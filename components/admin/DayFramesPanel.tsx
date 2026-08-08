"use client";
import React, { useEffect, useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { Loader2, Upload, RotateCcw, ExternalLink, Check } from 'lucide-react';

interface Row {
    slug: string;
    name: string;
    bundled: string | null;
    color: string;
    overrideUrl: string | null;
    updatedAt: string | null;
}

/**
 * Swap the artwork on a /day page without a deploy.
 *
 * Only the image is editable here. The editorial on each day page stays in the
 * repo, where it can be reviewed, so this cannot be used to change what a page
 * says, only what it looks like.
 */
export const DayFramesPanel: React.FC<{ adminKey: string }> = ({ adminKey }) => {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState<string | null>(null);
    const [saved, setSaved] = useState<string | null>(null);
    const inputs = useRef<Record<string, HTMLInputElement | null>>({});

    const load = () => {
        setLoading(true);
        fetch(`/api/admin/day-frames?key=${encodeURIComponent(adminKey)}`)
            .then(async (r) => {
                if (!r.ok) throw new Error(r.status === 401 ? 'Wrong admin key.' : 'Could not load day frames.');
                return r.json();
            })
            .then(setRows)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(load, [adminKey]);

    const flash = (slug: string) => {
        setSaved(slug);
        setTimeout(() => setSaved((s) => (s === slug ? null : s)), 2000);
    };

    const onFile = async (slug: string, file: File) => {
        setBusy(slug);
        setError(null);
        try {
            const { url } = await upload(`day-${slug}-${Date.now()}-${file.name}`, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            });
            const res = await fetch(`/api/admin/day-frames?key=${encodeURIComponent(adminKey)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, imageUrl: url }),
            });
            if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Could not save.');
            flash(slug);
            load();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Upload failed.');
        } finally {
            setBusy(null);
        }
    };

    const revert = async (slug: string) => {
        setBusy(slug);
        try {
            const res = await fetch(`/api/admin/day-frames?key=${encodeURIComponent(adminKey)}&slug=${slug}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Could not revert.');
            flash(slug);
            load();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Revert failed.');
        } finally {
            setBusy(null);
        }
    };

    if (loading) return <div className="flex items-center gap-2 text-muted text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading day frames</div>;

    return (
        <div>
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
            <div className="space-y-3">
                {rows.map((r) => {
                    const src = r.overrideUrl ?? r.bundled;
                    return (
                        <div key={r.slug} className="bg-cream border border-ink/10 rounded-2xl p-4 flex items-center gap-4">
                            <div
                                className="w-16 h-16 rounded-full shrink-0 bg-paper2 border border-ink/10 overflow-hidden flex items-center justify-center"
                                style={src ? undefined : { borderColor: r.color, borderWidth: 6 }}
                            >
                                {src && <img src={src} alt="" className="w-full h-full object-contain" />}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="font-display font-bold truncate">{r.name}</p>
                                <p className="text-xs text-muted truncate">
                                    {r.overrideUrl
                                        ? `Custom upload${r.updatedAt ? ` · ${new Date(r.updatedAt).toLocaleDateString()}` : ''}`
                                        : r.bundled ? 'Bundled with the build' : 'Generated colour ring'}
                                </p>
                            </div>

                            {saved === r.slug && <Check size={18} className="text-brand-deep shrink-0" />}

                            <a
                                href={`/day/${r.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-10 w-10 rounded-xl border border-ink/15 flex items-center justify-center hover:bg-paper transition-colors shrink-0"
                                title="Open the day page"
                            >
                                <ExternalLink size={15} />
                            </a>

                            {r.overrideUrl && (
                                <button
                                    onClick={() => revert(r.slug)}
                                    disabled={busy === r.slug}
                                    className="h-10 px-3 rounded-xl border border-ink/15 text-sm font-bold flex items-center gap-1.5 hover:bg-paper transition-colors disabled:opacity-50 shrink-0"
                                    title="Revert to the frame in the repo"
                                >
                                    <RotateCcw size={14} /> Revert
                                </button>
                            )}

                            <button
                                onClick={() => inputs.current[r.slug]?.click()}
                                disabled={busy === r.slug}
                                className="h-10 px-4 rounded-xl bg-brand text-ink text-sm font-bold flex items-center gap-1.5 hover:brightness-105 transition-all disabled:opacity-50 shrink-0"
                            >
                                {busy === r.slug ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                                Replace
                            </button>

                            <input
                                ref={(el) => { inputs.current[r.slug] = el; }}
                                type="file"
                                accept="image/png,image/webp"
                                className="hidden"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) onFile(r.slug, f);
                                    e.target.value = '';
                                }}
                            />
                        </div>
                    );
                })}
            </div>
            <p className="text-xs text-muted mt-4 leading-relaxed">
                Transparent PNG, square. The page cache is cleared on save, so the new frame is live immediately.
                Reverting drops back to the artwork in the repo.
            </p>
        </div>
    );
};
