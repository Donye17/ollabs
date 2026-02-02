import React from 'react';
import { Play, Square, Download, Activity, Zap, RefreshCw, CloudRain } from 'lucide-react';
import { MotionEffect } from '@/lib/types';

interface MotionControlsProps {
    currentEffect: MotionEffect;
    setEffect: (effect: MotionEffect) => void;
    isRecording: boolean;
    onExport: () => void;
    isPlaying: boolean;
    onTogglePlay: () => void;
}

export const MotionControls: React.FC<MotionControlsProps> = ({
    currentEffect,
    setEffect,
    isRecording,
    onExport,
    isPlaying,
    onTogglePlay
}) => {
    const effects: { id: MotionEffect; label: string; icon: React.ElementType }[] = [
        { id: 'none', label: 'Static', icon: Square },
        { id: 'pulse', label: 'Pulse', icon: Activity },
        { id: 'spin', label: 'Spin', icon: RefreshCw },
        { id: 'glitch', label: 'Glitch', icon: Zap },
        { id: 'rain', label: 'Rain', icon: CloudRain },
    ];

    return (
        <div className="w-full bg-slate-900/60 p-5 rounded-2xl border border-white/5 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold font-heading text-slate-400 uppercase tracking-widest">Motion Studio 🎥</h4>
                {currentEffect !== 'none' && (
                    <button
                        onClick={onTogglePlay}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${isPlaying ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}
                    >
                        {isPlaying ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                        <span>{isPlaying ? 'PAUSE PREVIEW' : 'PLAY PREVIEW'}</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-5 gap-2 mb-6">
                {effects.map((effect) => (
                    <button
                        key={effect.id}
                        onClick={() => setEffect(effect.id)}
                        className={`
              flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200
              ${currentEffect === effect.id
                                ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/20 transform -translate-y-1'
                                : 'bg-slate-800/40 border-transparent text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                            }
            `}
                    >
                        <effect.icon size={20} />
                        <span className="text-[10px] font-bold uppercase">{effect.label}</span>
                    </button>
                ))}
            </div>

            <button
                onClick={onExport}
                disabled={isRecording || currentEffect === 'none'}
                className={`
          w-full py-4 rounded-xl font-bold font-heading flex items-center justify-center gap-3 transition-all
          ${isRecording
                        ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/5'
                        : currentEffect === 'none'
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white shadow-xl shadow-rose-900/20 hover:scale-[1.02] active:scale-[0.98]'
                    }
        `}
            >
                {isRecording ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Rendering GIF...</span>
                    </>
                ) : (
                    <>
                        <Download size={20} />
                        <span>Export GIF Animation</span>
                    </>
                )}
            </button>

            {currentEffect === 'none' && (
                <p className="text-center text-xs text-slate-600 mt-2">Select an effect to enable export</p>
            )}
        </div>
    );
};
