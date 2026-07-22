"use client";
import React from 'react';
import { FrameConfig, FrameCaption } from '@/lib/types';
import { Type } from 'lucide-react';

const COLORS = ['#ffffff', '#06141F', '#01BEF6', '#FF5C39', '#FFC24B'];

export const CaptionControls: React.FC<{ frame: FrameConfig; onChange: (f: FrameConfig) => void }> = ({ frame, onChange }) => {
    const caption = frame.caption;

    const update = (patch: Partial<FrameCaption>) => {
        const next: FrameCaption = {
            text: caption?.text ?? '',
            color: caption?.color ?? '#ffffff',
            position: caption?.position ?? 'bottom',
            size: caption?.size ?? 1,
            ...patch,
        };
        if (!next.text.trim()) {
            const rest = { ...frame };
            delete rest.caption;
            onChange(rest);
            return;
        }
        onChange({ ...frame, caption: next });
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Type size={16} className="text-brand" />
                <h3 className="text-sm font-bold text-white">Slogan around the ring</h3>
            </div>

            <input
                type="text"
                maxLength={42}
                value={caption?.text ?? ''}
                onChange={(e) => update({ text: e.target.value })}
                placeholder="e.g. SUPPORT TEAM USA"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-brand/50 transition-all text-sm"
            />

            {caption?.text ? (
                <>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400 w-14">Position</span>
                        <div className="flex gap-1.5">
                            {(['bottom', 'top'] as const).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => update({ position: p })}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${(caption.position ?? 'bottom') === p ? 'bg-brand text-ink' : 'bg-white/5 text-zinc-300 hover:bg-white/10'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400 w-14">Color</span>
                        <div className="flex gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => update({ color: c })}
                                    className={`w-7 h-7 rounded-full border-2 transition-all ${(caption.color ?? '#ffffff') === c ? 'border-brand scale-110' : 'border-white/20'}`}
                                    style={{ backgroundColor: c }}
                                    aria-label={`Slogan color ${c}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400 w-14">Size</span>
                        <input
                            type="range" min={0.6} max={1.6} step={0.05}
                            value={caption.size ?? 1}
                            onChange={(e) => update({ size: parseFloat(e.target.value) })}
                            className="flex-1 accent-brand"
                        />
                    </div>

                    <button
                        onClick={() => update({ text: '' })}
                        className="text-xs text-zinc-400 hover:text-coral transition-colors"
                    >
                        Remove slogan
                    </button>
                </>
            ) : (
                <p className="text-xs text-zinc-500">Add a short slogan that curves around your frame. Great for team names and causes.</p>
            )}
        </div>
    );
};
