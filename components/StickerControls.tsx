import React from 'react';
import { StickerConfig } from '@/lib/types';
import { Heart, Zap, Star, BadgeCheck, Plus, Trash2, Smile } from 'lucide-react';

interface StickerControlsProps {
    stickers: StickerConfig[];
    selectedStickerId: string | null;
    onAddSticker: (icon: string) => void;
    onUpdateSticker: (id: string, updates: Partial<StickerConfig>) => void;
    onDeleteSticker: (id: string) => void;
    onSelectSticker: (id: string) => void;
}

const AVAILABLE_STICKERS = [
    { id: 'verified', name: 'Verified', icon: BadgeCheck, color: 'text-blue-500' },
    { id: 'heart', name: 'Heart', icon: Heart, color: 'text-pink-500' },
    { id: 'zap', name: 'Bolt', icon: Zap, color: 'text-yellow-500' },
    { id: 'star', name: 'Star', icon: Star, color: 'text-purple-500' },
];

export const StickerControls: React.FC<StickerControlsProps> = ({
    stickers,
    selectedStickerId,
    onAddSticker,
    onDeleteSticker,
    onSelectSticker
}) => {
    return (
        <div className="w-full bg-slate-900/60 p-5 rounded-2xl border border-white/5 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold font-heading text-slate-400 uppercase tracking-widest">Stickers ✨</h4>
            </div>

            <p className="text-xs text-slate-500 font-bold mb-3 uppercase tracking-wider">Add Sticker</p>
            <div className="grid grid-cols-4 gap-2 mb-6">
                {AVAILABLE_STICKERS.map((sticker) => (
                    <button
                        key={sticker.id}
                        onClick={() => onAddSticker(sticker.id)}
                        className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all group"
                    >
                        <sticker.icon className={`w-6 h-6 ${sticker.color} group-hover:scale-110 transition-transform`} />
                        <span className="text-[10px] text-slate-400 font-medium">{sticker.name}</span>
                    </button>
                ))}
            </div>

            {/* Layer List */}
            {stickers.length > 0 && (
                <div className="space-y-2">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Layers</p>
                    {stickers.map((sticker, index) => {
                        const def = AVAILABLE_STICKERS.find(s => s.id === sticker.icon) || AVAILABLE_STICKERS[0];
                        const Icon = def.icon;

                        return (
                            <div
                                key={sticker.id}
                                onClick={() => onSelectSticker(sticker.id)}
                                className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${selectedStickerId === sticker.id ? 'bg-slate-800 border-blue-500/50' : 'bg-slate-800/50 border-transparent hover:bg-slate-800'}`}
                            >
                                <Icon className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-300 truncate flex-1 font-medium">
                                    {def.name} #{index + 1}
                                </span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteSticker(sticker.id); }}
                                    className="p-1 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {stickers.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-xl">
                    <Smile className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No decorations yet</p>
                </div>
            )}
        </div>
    );
};
