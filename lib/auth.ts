// Optional organizer accounts.
//
// Campaigns are still created anonymously and supporters still never log in.
// This module only exists so an organizer can reach their dashboard from a
// device that is not the one they created on.
//
// Two deliberate choices:
//
// 1. Six digit codes, never magic links. Most organizers arrive inside the
//    WhatsApp in-app browser. A link mailed to them opens in their default
//    browser, which is a separate session, so it signs in a tab they are not
//    looking at. A code typed back into the open tab works in every browser.
//
// 2. Codes and session tokens are stored hashed. The plaintext exists only in
//    the email and in the user's cookie.

import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';

export const SESSION_COOKIE = 'ollabs_org';
export const SESSION_DAYS = 90;
export const CODE_TTL_MINUTES = 10;
export const MAX_CODE_ATTEMPTS = 5;

export interface Organizer {
    id: string;
    email: string;
}

// ------------------------------------------------------------------ crypto

/** Six digits from the CSPRNG, rejection sampled so every code is equally likely. */
export function newLoginCode(): string {
    const buf = new Uint32Array(1);
    // Largest multiple of 1e6 that fits in a uint32; anything above it would
    // make the low codes fractionally more common.
    const limit = Math.floor(0x100000000 / 1_000_000) * 1_000_000;
    let value = limit;
    while (value >= limit) {
        crypto.getRandomValues(buf);
        value = buf[0];
    }
    return String(value % 1_000_000).padStart(6, '0');
}

/** 64 hex characters, same shape as the campaign owner_token. */
export function newSessionToken(): string {
    return (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, '');
}

export async function sha256Hex(input: string): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
    return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

/** Compare two hex digests without leaking where they diverge. */
export function constantTimeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

export function isValidCode(value: unknown): value is string {
    return typeof value === 'string' && /^\d{6}$/.test(value.trim());
}

// ----------------------------------------------------------------- session

export async function createSession(organizerId: string): Promise<string> {
    const token = newSessionToken();
    const hash = await sha256Hex(token);
    await pool.query(
        `INSERT INTO organizer_sessions (token_hash, organizer_id, created_at, expires_at)
         VALUES ($1, $2, NOW(), NOW() + ($3 || ' days')::interval)`,
        [hash, organizerId, String(SESSION_DAYS)]
    );
    return token;
}

/** Resolve the signed-in organizer, or null. Never throws. */
export async function getSessionOrganizer(request: NextRequest): Promise<Organizer | null> {
    try {
        const raw = request.cookies.get(SESSION_COOKIE)?.value;
        if (!raw) return null;
        const hash = await sha256Hex(raw);
        const result = await pool.query(
            `SELECT o.id, o.email
             FROM organizer_sessions s
             JOIN organizers o ON o.id = s.organizer_id
             WHERE s.token_hash = $1 AND s.expires_at > NOW()
             LIMIT 1`,
            [hash]
        );
        return result.rows[0] ?? null;
    } catch (e) {
        console.error('[auth] session lookup failed', e);
        return null;
    }
}

export async function destroySession(request: NextRequest): Promise<void> {
    const raw = request.cookies.get(SESSION_COOKIE)?.value;
    if (!raw) return;
    const hash = await sha256Hex(raw);
    await pool.query(`DELETE FROM organizer_sessions WHERE token_hash = $1`, [hash]);
}

export function setSessionCookie(response: NextResponse, token: string): void {
    response.cookies.set({
        name: SESSION_COOKIE,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_DAYS * 24 * 60 * 60,
    });
}

export function clearSessionCookie(response: NextResponse): void {
    response.cookies.set({
        name: SESSION_COOKIE,
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });
}

// --------------------------------------------------------------- organizer

/** Find or create the organizer for a normalized email, and stamp the login. */
export async function upsertOrganizer(email: string): Promise<Organizer> {
    const result = await pool.query(
        `INSERT INTO organizers (email, created_at, last_login_at)
         VALUES ($1, NOW(), NOW())
         ON CONFLICT (email) DO UPDATE SET last_login_at = NOW()
         RETURNING id, email`,
        [email]
    );
    return result.rows[0];
}

/**
 * Attach every campaign created with this email to the account.
 *
 * This is what makes the first sign-in feel like nothing was ever lost: an
 * organizer who typed their address at publish gets all of it back without
 * touching a recovery link. Only claims campaigns nobody owns yet.
 */
export async function claimCampaignsByEmail(organizerId: string, email: string): Promise<number> {
    const result = await pool.query(
        `UPDATE campaigns
         SET creator_id = $1
         WHERE organizer_email = $2 AND creator_id IS NULL`,
        [organizerId, email]
    );
    return result.rowCount ?? 0;
}
