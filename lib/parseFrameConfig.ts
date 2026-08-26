import type { FrameConfig } from '@/lib/types';

/**
 * Parse frame_config from Postgres (jsonb or string). Never throws.
 * Corrupt rows should soft-fail to null rather than 500 a public /c page.
 */
export function parseFrameConfig(raw: unknown): FrameConfig | null {
    try {
        const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (!value || typeof value !== 'object') return null;
        return value as FrameConfig;
    } catch {
        return null;
    }
}
