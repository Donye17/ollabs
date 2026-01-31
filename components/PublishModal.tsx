"use client";
import React, { useState } from 'react';
import { Loader2, X, Globe, Lock, Share2 } from 'lucide-react';

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

    if (!isOpen) return null;

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;

        setLoading(true);
        setError(null);

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
                    name: name, // Changed from frameName to name
                    description,
                    config: frameConfig,
                    creator_id: session.user.id,
                    creator_name: session.user.name || 'Anonymous',
                    is_public: isPublic // Changed from true to isPublic
                })
            });

            if (!response.ok) throw new Error('Failed to publish frame');
            const result = await response.json();

            console.log("Published frame ID:", result.id);
            setSuccess(true);

            // Close after delay
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 2000);

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
                        <p className="text-slate-400">Your frame is now live in the gallery.</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-white mb-6">Publish to Gallery</h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handlePublish} className="space-y-4">
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

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-3">Visibility</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsPublic(true)}
                                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${isPublic
                                            ? 'bg-blue-600/20 border-blue-500 text-white'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                            }`}
                                    >
                                        <Globe size={18} />
                                        <span className="font-medium">Public</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsPublic(false)}
                                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${!isPublic
                                            ? 'bg-purple-600/20 border-purple-500 text-white'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                            }`}
                                    >
                                        <Lock size={18} />
                                        <span className="font-medium">Private</span>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Publish Frame'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};
