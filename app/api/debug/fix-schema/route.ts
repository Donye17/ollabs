import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // Create verification table required by better-auth
        // Based on standard better-auth postgres schema
        await pool.query(`
            CREATE TABLE IF NOT EXISTS verification (
                id TEXT NOT NULL PRIMARY KEY,
                identifier TEXT NOT NULL,
                value TEXT NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP,
                updated_at TIMESTAMP
            );
        `);

        return NextResponse.json({ message: "Verification table created successfully" });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
