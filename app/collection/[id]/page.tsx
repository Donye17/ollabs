
"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Gallery } from '@/components/Gallery';
import { ArrowLeft, Trash2, Lock, Share2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const session = authClient.useSession();

    const [collection, setCollection] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/collections/${id}`)
            .then(async res => {
                if (!res.ok) {
                    if (res.status === 404) throw new Error("Collection not found");
                    if (res.status === 403) throw new Error("Private collection");
                    throw new Error("Failed to load collection");
                }
                return res.json();
            })
            .then(data => {
                const { items, ...col } = data;
                setCollection(col);
                setItems(items || []);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this collection?")) return;
        try {
            const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' });
            if (res.ok) {
                router.push(`/profile/${session.data?.user?.id}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black pt-24 pb-12 px-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    if (error || !collection) {
        return (
            <div className="min-h-screen bg-black pt-24 pb-12 px-4 flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold text-red-500">{error || "Error"}</h1>
                <button onClick={() => router.back()} className="text-zinc-400 hover:text-white underline">
                    Go Back
                </button>
            </div>
        );
    }

    const isOwner = session.data?.user?.id === collection.user_id;

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-start gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-white/10 rounded-full text-zinc-400 transition-colors mt-1"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black tracking-tight text-white mb-1">{collection.name}</h1>
                                {!collection.is_public && <Lock size={18} className="text-zinc-500" />}
                            </div>
                            <p className="text-zinc-400 max-w-xl">{collection.description || "No description"}</p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-zinc-500">
                                <span>{items.length} items</span>
                                <span>•</span>
                                <span>Created {new Date(collection.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {isOwner && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert("Link copied!");
                                }}
                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                            >
                                <Share2 size={16} /> Share
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-medium transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* Items Grid */}
                <div className="border-t border-white/10 pt-8">
                    {items.length > 0 ? (
                        <Gallery
                            initialFrames={items}
                            onSelectFrame={(frame, frameId) => {
                                localStorage.setItem('temp_frame', JSON.stringify(frame));
                                router.push(`/?remix=${frameId}`);
                            }}
                        />
                    ) : (
                        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed">
                            <h3 className="text-xl font-bold text-white mb-2">Collection is empty</h3>
                            <p className="text-zinc-500">Go explore frames and add them here!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
