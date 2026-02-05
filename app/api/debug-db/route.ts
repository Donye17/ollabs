import { pool } from "@/lib/neon";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'verification';
        `);
        return NextResponse.json({ columns: result.rows });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
