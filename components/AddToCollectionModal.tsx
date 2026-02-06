
import React, { useState, useEffect } from 'react';
import { X, Plus, Folder, Lock, Check } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

interface AddToCollectionModalProps {
    frameId: string;
    isOpen: boolean;
    onClose: () => void;
}

export const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({ frameId, isOpen, onClose }) => {
    const session = authClient.useSession();
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

    // Fetch collections on open
    useEffect(() => {
        if (isOpen && session.data?.user?.id) {
            setLoading(true);
            fetch(`/api/collections?user_id=${session.data.user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setCollections(data);
                })
                .finally(() => setLoading(false));
        }
    }, [isOpen, session.data?.user?.id]);

    const handleCreate = async () => {
        if (!newCollectionName.trim()) return;
        setCreating(true);
        try {
            const res = await fetch('/api/collections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCollectionName })
            });
            const newCol = await res.json();
            if (newCol.id) {
                setCollections([newCol, ...collections]);
                setNewCollectionName('');
                // Auto add to new collection
                handleAddToCollection(newCol.id);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setCreating(false);
        }
    };

    const handleAddToCollection = async (collectionId: string) => {
        try {
            const res = await fetch(`/api/collections/${collectionId}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ frame_id: frameId })
            });
            if (res.ok) {
                setAddedIds(prev => new Set(prev).add(collectionId));
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-md relative overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-white">Save to Collection</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-400">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {/* Create New Input */}
                    <div className="p-2 mb-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="New collection name..."
                                value={newCollectionName}
                                onChange={e => setNewCollectionName(e.target.value)}
                                className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                            />
                            <button
                                onClick={handleCreate}
                                disabled={!newCollectionName.trim() || creating}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl px-3 flex items-center justify-center transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-8 text-zinc-500 text-sm">Loading collections...</div>
                    ) : collections.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500 text-sm">No collections found. Create one!</div>
                    ) : (
                        collections.map(col => {
                            const isAdded = addedIds.has(col.id);
                            return (
                                <button
                                    key={col.id}
                                    onClick={() => !isAdded && handleAddToCollection(col.id)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors group text-left"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 transition-colors">
                                        <Folder size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-zinc-200 truncate">{col.name}</span>
                                            {!col.is_public && <Lock size={12} className="text-zinc-500" />}
                                        </div>
                                        <div className="text-xs text-zinc-500">{col.item_count} items</div>
                                    </div>
                                    {isAdded && (
                                        <div className="text-green-400 animate-in fade-in zoom-in">
                                            <Check size={18} />
                                        </div>
                                    )}
                                </button>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
