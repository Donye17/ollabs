"use client";

import React, { useEffect, useState } from 'react';
import { detectInAppBrowser, INAPP_BAR_KEY, sessionFlag, setSessionFlag, androidIntentUrl, type InAppKind } from '@/lib/inAppBrowser';
import { isIOS, preferShareSheetForSave } from '@/lib/savePhoto';

type Copy = {
    whatsapp: string;
    instagram: string;
    facebook: string;
    openBrowser: string;
    copyLink: string;
    dismiss: string;
    copied: string;
};

/**
 * Dismissible inline bar. Not a modal. Hidden when the share sheet already
 * works, so iOS WhatsApp supporters who can save are not interrupted.
 */
export function InAppRescueBar({
    pageUrl,
    copy,
    onCopy,
}: {
    pageUrl: string;
    copy: Copy;
    onCopy: () => Promise<void> | void;
}) {
    const [kind, setKind] = useState<InAppKind | null>(null);
    const [visible, setVisible] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (sessionFlag(INAPP_BAR_KEY)) return;
        if (preferShareSheetForSave()) return;
        const detected = detectInAppBrowser();
        if (!detected) return;
        setKind(detected);
        setVisible(true);
    }, []);

    if (!visible || !kind) return null;

    const label = kind === 'instagram' ? copy.instagram : kind === 'facebook' ? copy.facebook : copy.whatsapp;
    const openHref = isIOS() ? pageUrl : androidIntentUrl(pageUrl);

    const dismiss = () => {
        setSessionFlag(INAPP_BAR_KEY);
        setVisible(false);
    };

    return (
        <div
            className="w-full rounded-xl border border-ink/10 bg-cream px-3 py-2.5 text-left"
            role="status"
        >
            <p className="text-sm text-ink leading-snug">{label}</p>
            <div className="mt-2 flex flex-wrap gap-2">
                <a
                    href={openHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center rounded-xl bg-ink px-3 text-sm font-semibold text-paper"
                    onClick={dismiss}
                >
                    {copy.openBrowser}
                </a>
                <button
                    type="button"
                    className="inline-flex min-h-[44px] items-center rounded-xl border border-ink/15 bg-paper px-3 text-sm font-semibold text-ink"
                    onClick={async () => {
                        await onCopy();
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                    }}
                >
                    {copied ? copy.copied : copy.copyLink}
                </button>
                <button
                    type="button"
                    className="inline-flex min-h-[44px] items-center px-3 text-sm font-semibold text-muted"
                    onClick={dismiss}
                >
                    {copy.dismiss}
                </button>
            </div>
        </div>
    );
}
