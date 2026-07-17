"use client";
import React, { useState } from 'react';
import { X, Check, Loader2, Copy, ExternalLink, Rocket } from 'lucide-react';
import { FrameConfig } from '@/lib/types';
import { upload } from '@vercel/blob/client';
import { FramePreview } from './FramePreview';

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [campaignUrl, setCampaignUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

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
                body: JSON.stringify({ title, description, frameConfig: config, previewUrl })
            });

            if (res.ok) {
                const campaign = await res.json();
                setCampaignUrl(`${window.location.origin}/c/${campaign.slug}`);
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

    const handleClose = () => {
        onClose();
        setTitle('');
        setDescription('');
        setCampaignUrl(null);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                    <h2 className="text-lg font-bold text-white">{campaignUrl ? 'Campaign is live' : 'Create a campaign'}</h2>
                    <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={18} className="text-zinc-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Preview */}
                    <div className="flex justify-center py-4 relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-75 pointer-events-none" />
                        <FramePreview frame={config} className="w-40 h-40 rounded-full border-4 border-zinc-900 bg-zinc-950 shadow-2xl relative z-10 mx-auto" />
                    </div>

                    {campaignUrl ? (
                        /* Success: shareable link */
                        <div className="space-y-4">
                            <p className="text-sm text-zinc-400 text-center">Share this link. Anyone who opens it can add your frame to their photo.</p>
                            <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 flex items-center gap-3">
                                <span className="text-sm text-zinc-200 truncate flex-1">{campaignUrl}</span>
                                <button onClick={handleCopy} className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-xs shrink-0">
                                    {copied ? <><Check size={14} className="text-green-400" /> Copied</> : <><Copy size={14} /> Copy</>}
                                </button>
                            </div>
                            <a
                                href={campaignUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white transition-all"
                            >
                                <ExternalLink size={18} /> Open campaign
                            </a>
                        </div>
                    ) : (
                        /* Form */
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Campaign title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Support Team USA"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Description (optional)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What's this campaign for?"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all min-h-[80px] resize-none"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-zinc-900/50">
                    {campaignUrl ? (
                        <button
                            onClick={handleClose}
                            className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-green-500 text-white transition-all"
                        >
                            <Check size={20} /> Done
                        </button>
                    ) : (
                        <button
                            onClick={handleCreate}
                            disabled={!title || isSubmitting}
                            className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <><Rocket size={20} /> Create campaign</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
