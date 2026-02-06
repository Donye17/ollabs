"use client";
import React, { useState } from 'react';
import { X, Upload, Check, Loader2 } from 'lucide-react';
import { FrameConfig } from '@/lib/types';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

interface PublishTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    config: FrameConfig;
    previewDataUrl: string | null;
    parentId?: string;
}

export const PublishTemplateModal: React.FC<PublishTemplateModalProps> = ({ isOpen, onClose, config, previewDataUrl, parentId }) => {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = tagInput.trim();
            if (val && !tags.includes(val) && tags.length < 5) {
                setTags([...tags, val]);
                setTagInput('');
            }
        } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };

    const removeTag = (t: string) => setTags(tags.filter(tag => tag !== t));

    if (!isOpen) return null;

    const handlePublish = async () => {
        if (!name) return;
        if (!session?.user) {
            alert("Please sign in to publish templates.");
            return;
        }
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/frames', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    description,
                    config,
                    creator_id: session.user.id,
                    creator_name: session.user.name,
                    is_public: true,
                    parent_id: parentId,
                    tags // Pass the tags array
                })
            });

            if (res.ok) {
                const result = await res.json();
                setIsSuccess(true);
                setTimeout(() => {
                    onClose();
                    setIsSuccess(false);
                    setName('');
                    setDescription('');
                    // Redirect to the new frame
                    if (result.frame?.id || result.id) {
                        router.push(`/share/${result.frame?.id || result.id}`);
                    }
                }, 1500);
            } else {
                alert('Failed to publish template');
            }
        } catch (error) {
            console.error(error);
            alert('Error publishing template');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                    <h2 className="text-lg font-bold text-white">Publish Template</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={18} className="text-zinc-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Preview */}
                    <div className="flex justify-center py-4 relative">
                        {previewDataUrl && (
                            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-75 pointer-events-none" />
                        )}
                        <div className="w-40 h-40 rounded-full border-4 border-zinc-900 overflow-hidden bg-zinc-950 shadow-2xl relative z-10 mx-auto">
                            {previewDataUrl ? (
                                <img src={previewDataUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-900">No Preview</div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Template Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="E.g. Neon Cyberpunk"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tags</label>
                            <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                                {tags.map((tag) => (
                                    <span key={tag} className="bg-zinc-800 text-zinc-200 text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                                        #{tag}
                                        <button onClick={() => removeTag(tag)} className="hover:text-red-400 hidden-hover-trigger">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    placeholder={tags.length === 0 ? "Add tags (press Enter)..." : ""}
                                    className="bg-transparent border-none outline-none text-white text-sm flex-1 min-w-[120px] px-2 py-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Description (Optional)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your style..."
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all min-h-[80px] resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-zinc-900/50">
                    <button
                        onClick={handlePublish}
                        disabled={!name || isSubmitting || isSuccess || !session}
                        className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isSuccess
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" />
                        ) : isSuccess ? (
                            <>
                                <Check size={20} /> Published!
                            </>
                        ) : !session ? (
                            <span>Sign In Required</span>
                        ) : (
                            <>
                                <Upload size={20} /> Publish to Community
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
