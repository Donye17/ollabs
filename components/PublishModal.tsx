"use client";
import React, { useState } from 'react';
import { Loader2, X, Globe, Lock, Share2, Copy } from 'lucide-react';

import { FrameConfig } from '@/lib/types';
import { authClient } from '../lib/auth-client';

interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    frameConfig: FrameConfig;
}

export const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose, frameConfig }) => {
    const { data: session } = authClient.useSession();
    const [name, setName] = useState(frameConfig.name || '');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [publishedId, setPublishedId] = useState<string | null>(null);

    if (!isOpen) return null;

    const handlePublish = async (isPublicArg: boolean) => {
        if (!session) return;
        setLoading(true);
        setError('');

        try {
            // Check if user has a profile (optional, usually handled by triggers or lazy creation)
            // Ideally we insert into 'frames' table

            // Construct the SQL query
            // creator_id is mostly likely the user_id from auth, handled by backend or passed explicitly if RLS allows
            // We'll pass the user ID from session for now.

            const response = await fetch('/api/frames', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    description,
                    config: frameConfig,
                    creator_id: session.user.id,
                    creator_name: session.user.name || 'Anonymous',
                    is_public: isPublicArg // Use the argument, not the state which might be stale or irrelevant for drafts
                })
            });

            if (!response.ok) throw new Error('Failed to publish frame');
            const result = await response.json();

            if (!isPublicArg) {
                alert("Draft saved successfully!");
                onClose();
                return;
            }

            console.log("Published frame ID:", result.id);
            setPublishedId(result.id);
            setSuccess(true);
            // We removed the auto-close to let users copy the link

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to publish frame");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {success ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Share2 className="text-green-500" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Published!</h2>
                        <p className="text-slate-400 mb-6">Your frame is now live in the gallery.</p>

                        <div className="flex items-center gap-2 bg-slate-800 p-3 rounded-xl border border-white/5 mb-6">
                            <code className="flex-1 text-sm text-slate-300 font-mono text-left truncate">
                                {window.location.origin}/share/{publishedId}
                            </code>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/share/${publishedId}`);
                                    alert('Copied to clipboard!');
                                }}
                                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                            >
                                <Copy size={16} />
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                            >
                                Close
                            </button>
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my new avatar frame "${name}" on Ollabs! 🎨✨\n\n${window.location.origin}/share/${publishedId}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 py-3 bg-black hover:bg-zinc-900 border border-zinc-800 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                Share
                            </a>
                            <a
                                href={`/share/${publishedId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 py-3 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                View Page
                            </a>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-white mb-6">Publish to Gallery</h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Frame Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Neon Cyberpunk"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description (Optional)</label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder="Tell people about your design..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => handlePublish(false)}
                                    disabled={loading}
                                    className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading && !isPublic ? <Loader2 className="animate-spin" size={20} /> : <Lock size={18} />}
                                    Save Draft
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handlePublish(true)}
                                    disabled={loading}
                                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading && isPublic ? <Loader2 className="animate-spin" size={20} /> : <Globe size={18} />}
                                    Publish
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};
