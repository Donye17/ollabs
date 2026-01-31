import { authClient } from "./auth-client";

const API_URL = import.meta.env.VITE_NEON_DATA_API_URL;

interface QueryResult<T> {
    result: T[];
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const session = await authClient.getSession();
    const token = session.data?.session?.token; // Try to get token if exposed, otherwise generic fetch

    // Note: For now we assume public read or specific auth headers handled by Better Auth hook if integrated deep.
    // Better Auth acts as the issuer. The Data API expects a Bearer token.
    // We need to extract the token from the session or storage.
    // Implementation detail: Better Auth stores token in cookie or local storage.

    // For this MVP, we will try to just fetch. RLS might block us if not handled.

    const response = await fetch(`${API_URL}/sql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
            query: sql,
            params: params
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Database Error: ${err}`);
    }

    const data = await response.json();
    return data.result;
}
