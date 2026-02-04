import React from 'react';
import { Type, AlignLeft, AlignCenter, AlignRight, Plus, Trash2, Circle } from 'lucide-react';
import { TextConfig } from '@/lib/types';

interface TextControlsProps {
    textLayers: TextConfig[];
    selectedTextId: string | null;
    onAddText: () => void;
    onUpdateText: (id: string, updates: Partial<TextConfig>) => void;
    onDeleteText: (id: string) => void;
    onSelectText: (id: string) => void;
}

const FONTS = [
    { id: 'Inter', name: 'Inter' },
    { id: 'Archivo', name: 'Archivo' },
    { id: 'Space Grotesk', name: 'Space Grotesk' },
    { id: 'Courier New', name: 'Courier' },
    { id: 'Georgia', name: 'Serif' },
    { id: 'Impact', name: 'Impact' },
    { id: 'Comic Sans MS', name: 'Comic' },
];

const COLORS = [
    '#ffffff', '#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'
];

export const TextControls: React.FC<TextControlsProps> = ({
    textLayers,
    selectedTextId,
    onAddText,
    onUpdateText,
    onDeleteText,
    onSelectText
}) => {
    const selectedText = textLayers.find(t => t.id === selectedTextId);

    return (
        <div className="w-full bg-slate-900/60 p-5 rounded-2xl border border-white/5 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold font-heading text-slate-400 uppercase tracking-widest">Text Studio ✍️</h4>
                <button
                    onClick={onAddText}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-blue-900/20"
                >
                    <Plus size={14} />
                    <span>Add Text</span>
                </button>
            </div>

            {selectedText ? (
                <div className="space-y-4">
                    {/* Text Input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={selectedText.text}
                            onChange={(e) => onUpdateText(selectedText.id, { text: e.target.value })}
                            className="flex-1 bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
                            placeholder="Type something..."
                            autoFocus
                        />
                        <button
                            onClick={() => onDeleteText(selectedText.id)}
                            className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors border border-red-500/20"
                            title="Delete Text"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    {/* Font & Alignment & Curve */}
                    <div className="grid grid-cols-2 gap-3">
                        <select
                            value={selectedText.fontFamily}
                            onChange={(e) => onUpdateText(selectedText.id, { fontFamily: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            {FONTS.map(font => (
                                <option key={font.id} value={font.id} style={{ fontFamily: font.id }}>
                                    {font.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex bg-slate-800 rounded-xl border border-slate-700/50 p-1">
                            {['left', 'center', 'right'].map((align) => (
                                <button
                                    key={align}
                                    onClick={() => onUpdateText(selectedText.id, { align: align as any })}
                                    className={`flex-1 flex items-center justify-center p-1.5 rounded-lg transition-colors ${selectedText.align === align ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {align === 'left' && <AlignLeft size={14} />}
                                    {align === 'center' && <AlignCenter size={14} />}
                                    {align === 'right' && <AlignRight size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>


                    {/* Colors */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-wider">Color</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
                            {COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => onUpdateText(selectedText.id, { color })}
                                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 flex-shrink-0 ${selectedText.color === color ? 'border-white ring-2 ring-white/20' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                            <input
                                type="color"
                                value={selectedText.color}
                                onChange={(e) => onUpdateText(selectedText.id, { color: e.target.value })}
                                className="w-8 h-8 rounded-full border-0 p-0 overflow-hidden cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Size Slider */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Size</label>
                            <span className="text-[10px] text-slate-400 font-mono">{selectedText.fontSize}px</span>
                        </div>
                        <input
                            type="range"
                            min="12"
                            max="200"
                            value={selectedText.fontSize}
                            onChange={(e) => onUpdateText(selectedText.id, { fontSize: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                </div>
            ) : (
                <div className="text-center py-6 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-500">
                        <Type size={20} />
                    </div>
                    <p className="text-sm text-slate-400 font-medium">No Text Selected</p>
                    <p className="text-xs text-slate-600 mt-1">Select text on canvas or add new</p>
                </div>
            )
            }

            {/* Layer List (Mini) */}
            {
                textLayers.length > 0 && !selectedText && (
                    <div className="mt-4 space-y-2">
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Layers</p>
                        {textLayers.map(layer => (
                            <div
                                key={layer.id}
                                onClick={() => onSelectText(layer.id)}
                                className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-transparent hover:border-slate-700 cursor-pointer group transition-colors"
                            >
                                <Type size={14} className="text-slate-500" />
                                <span className="text-sm text-slate-300 truncate flex-1 font-medium">{layer.text}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteText(layer.id); }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded transition-all"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )
            }
        </div >
    );
};
