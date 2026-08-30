"use client";

import React from 'react';

export type ExportFormat = 'square' | 'story';

type Copy = {
    profile: string;
    profileSize: string;
    story: string;
    storySize: string;
};

/**
 * Format is chosen before the photo goes in so the crop matches the file
 * they will save. Two cards, no filters.
 */
export function FormatCards({
    value,
    onChange,
    copy,
}: {
    value: ExportFormat;
    onChange: (next: ExportFormat) => void;
    copy: Copy;
}) {
    return (
        <div className="grid grid-cols-2 gap-2 w-full" role="radiogroup" aria-label={copy.profile}>
            <FormatCard
                selected={value === 'square'}
                onSelect={() => onChange('square')}
                title={copy.profile}
                size={copy.profileSize}
                previewClass="aspect-square max-w-[72px]"
            />
            <FormatCard
                selected={value === 'story'}
                onSelect={() => onChange('story')}
                title={copy.story}
                size={copy.storySize}
                previewClass="aspect-[9/16] h-[72px]"
            />
        </div>
    );
}

function FormatCard({
    selected,
    onSelect,
    title,
    size,
    previewClass,
}: {
    selected: boolean;
    onSelect: () => void;
    title: string;
    size: string;
    previewClass: string;
}) {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={onSelect}
            className={`min-h-[44px] rounded-xl border px-3 py-3 text-left transition-colors ${
                selected
                    ? 'border-brand bg-brand/10'
                    : 'border-ink/15 bg-cream hover:bg-ink/5'
            }`}
        >
            <span className={`mb-2 block rounded-md bg-ink/10 mx-auto ${previewClass}`} aria-hidden />
            <span className="block text-sm font-semibold text-ink">{title}</span>
            <span className="block text-xs text-muted tabular-nums mt-0.5">{size}</span>
        </button>
    );
}
