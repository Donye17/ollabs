"use client";
import React, { useState } from 'react';
import { X, Check, Loader2, Copy, ExternalLink, Rocket, ShieldCheck, QrCode } from 'lucide-react';
import { FrameConfig } from '@/lib/types';
import { upload } from '@vercel/blob/client';
import { FramePreview } from './FramePreview';
import { QRCode } from './QRCode';

interface PublishTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    config: FrameConfig;
    previewDataUrl: string | null;
    parentId?: string;
}

export const PublishTemplateModal: React.FC<PublishTemplateModalProps> = ({ isOpen, onClose, config, previewDataUrl }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [goal, setGoal] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [campaignUrl, setCampaignUrl] = useState<string | null>(null);
    const [manageUrl, setManageUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [manageCopied, setManageCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);

    if (!isOpen) return null;

    const handleCreate = async () => {
        if (!title) return;
        setIsSubmitting(true);

        try {
            // Upload the rendered preview so the shared campaign link shows a rich image.
            let previewUrl: string | null = null;
            if (previewDataUrl) {
                try {
                    const blob = await (await fetch(previewDataUrl)).blob();
                    const uploaded = await upload(`preview-${Date.now()}.png`, blob, { access: 'public', handleUploadUrl: '/api/upload' });
                    previewUrl = uploaded.url;
                } catch (e) {
                    console.error('preview upload failed', e);
                }
            }
            const res = await fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, frameConfig: config, previewUrl, goal: goal || null })
            });

            if (res.ok) {
                const campaign = await res.json();
                const cUrl = `${window.location.origin}/c/${campaign.slug}`;
                const mUrl = campaign.owner_token ? `${window.location.origin}/c/${campaign.slug}/manage?k=${campaign.owner_token}` : null;
                setCampaignUrl(cUrl);
                if (mUrl) setManageUrl(mUrl);

                // Remember this campaign on the device so the owner can find it again.
                try {
                    const key = 'ollabs_my_campaigns';
                    const list = JSON.parse(localStorage.getItem(key) || '[]');
                    list.unshift({ slug: campaign.slug, title, url: cUrl, manageUrl: mUrl, createdAt: Date.now() });
                    localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
                } catch { /* ignore */ }
            } else {
                const err = await res.json().catch(() => ({}));
                alert(err.error || 'Failed to create campaign');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating campaign');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopy = async () => {
        if (!campaignUrl) return;
        try {
            await navigator.clipboard.writeText(campaignUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // clipboard unavailable
        }
    };

    const handleCopyManage = async () => {
        if (!manageUrl) return;
        try {
            await navigator.clipboard.writeText(manageUrl);
            setManageCopied(true);
            setTimeout(() => setManageCopied(false), 1500);
        } catch {
            // clipboard unavailable
        }
    };

    const handleClose = () => {
        onClose();
        setTitle('');
        setDescription('');
        setGoal('');
        setCampaignUrl(null);
        setManageUrl(null);
        setShowQR(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-paper border border-ink/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-ink/10 flex items-center justify-between">
                    <h2 className="font-display text-lg font-extrabold text-ink">{campaignUrl ? 'Campaign is live' : 'Create a campaign'}</h2>
                    <button onClick={handleClose} className="p-2 hover:bg-ink/10 rounded-full transition-colors">
                        <X size={18} className="text-muted" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Preview */}
                    <div className="flex justify-center py-2">
                        <FramePreview frame={config} className="w-40 h-40 rounded-full border-4 border-cream bg-paper2 shadow-lg mx-auto" />
                    </div>

                    {campaignUrl ? (
                        /* Success: shareable link */
                        <div className="space-y-4">
                            <p className="text-sm text-ink/70 text-center">Share this link. Anyone who opens it can add your frame to their photo.</p>
                            <div className="bg-cream border border-ink/10 rounded-xl px-4 py-3 flex items-center gap-3">
                                <span className="text-sm text-ink truncate flex-1">{campaignUrl}</span>
                                <button onClick={handleCopy} className="text-muted hover:text-brand-deep transition-colors flex items-center gap-1 text-xs shrink-0 font-semibold">
                                    {copied ? <><Check size={14} className="text-brand-deep" /> Copied</> : <><Copy size={14} /> Copy</>}
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href={campaignUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-cream border border-ink/10 hover:bg-ink/5 text-ink transition-all"
                                >
                                    <ExternalLink size={18} /> Open
                                </a>
                                <button
                                    onClick={() => setShowQR((v) => !v)}
                                    className="py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-cream border border-ink/10 hover:bg-ink/5 text-ink transition-all"
                                >
                                    <QrCode size={18} /> QR
                                </button>
                            </div>

                            {showQR && (
                                <div className="flex flex-col items-center gap-2">
                                    <QRCode value={campaignUrl} size={172} className="border border-ink/10" />
                                    <p className="text-[11px] text-muted">Scan or download to print for events</p>
                                </div>
                            )}

                            {manageUrl && (
                                <div className="bg-brand/10 border border-brand/30 rounded-xl p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-ink">
                                        <ShieldCheck size={16} className="text-brand-deep" />
                                        <span className="text-sm font-bold">Your private manage link</span>
                                    </div>
                                    <p className="text-xs text-ink/70">Bookmark this. It is the only way to see your stats and edit the campaign later. Keep it private.</p>
                                    <button onClick={handleCopyManage}
                                        className="w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 bg-cream border border-ink/10 hover:bg-ink/5 text-ink transition-colors">
                                        {manageCopied ? <><Check size={15} className="text-brand-deep" /> Copied</> : <><Copy size={15} /> Copy manage link</>}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Form */
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider">Campaign title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Support Team USA"
                                    className="w-full bg-cream border border-ink/10 rounded-xl px-4 py-3 text-ink placeholder-muted focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider">Description (optional)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What's this campaign for?"
                                    className="w-full bg-cream border border-ink/10 rounded-xl px-4 py-3 text-ink placeholder-muted focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none transition-all min-h-[80px] resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider">Supporter goal (optional)</label>
                                <input
                                    type="number"
                                    min={1}
                                    inputMode="numeric"
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    placeholder="e.g. 1000"
                                    className="w-full bg-cream border border-ink/10 rounded-xl px-4 py-3 text-ink placeholder-muted focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none transition-all"
                                />
                                <p className="text-[11px] text-muted">Shows a progress bar on your campaign page.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-ink/10">
                    {campaignUrl ? (
                        <button
                            onClick={handleClose}
                            className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-ink text-paper transition-all"
                        >
                            <Check size={20} /> Done
                        </button>
                    ) : (
                        <button
                            onClick={handleCreate}
                            disabled={!title || isSubmitting}
                            className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-brand hover:brightness-105 text-ink transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <><Rocket size={20} /> Create campaign</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
