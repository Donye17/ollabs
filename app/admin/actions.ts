'use server';

import { pool } from '@/lib/neon';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function toggleVerification(userId: string, currentStatus: boolean) {
    // 1. Check Admin Auth
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) {
        throw new Error("Unauthorized");
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
    if (!adminEmails.includes(session.user.email)) {
        throw new Error("Unauthorized");
    }

    // 2. Update DB
    try {
        await pool.query(
            'UPDATE "user" SET isVerified = $1 WHERE id = $2',
            [!currentStatus, userId]
        );
        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        console.error("Failed to toggle verification", e);
        return { success: false, error: "Database error" };
    }
}
