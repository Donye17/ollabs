"use client";
import React, { useMemo, useState } from 'react';
import { AVAILABLE_FRAMES } from '@/lib/constants';
import { FRAME_PACKS, type FramePackId } from '@/lib/framePacks';
import { FrameConfig, FrameType } from '@/lib/types';
import { prefersIndonesian, prefersPortuguese, prefersSpanish, prefersTagalog } from '@/lib/share';

interface FrameSelectorProps {
  selectedFrameId: string;
  onSelect: (frame: FrameConfig) => void;
}

function defaultPackId(): FramePackId | 'rings' {
  if (prefersPortuguese()) return 'br';
  if (prefersIndonesian()) return 'id';
  if (prefersTagalog()) return 'ph';
  if (prefersSpanish()) return 'mx';
  return 'rings';
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({ selectedFrameId, onSelect }) => {
  const [tab, setTab] = useState<FramePackId | 'rings'>(() => defaultPackId());

  const frames = useMemo(() => {
    if (tab === 'rings') return AVAILABLE_FRAMES;
    return FRAME_PACKS.find((p) => p.id === tab)?.frames ?? AVAILABLE_FRAMES;
  }, [tab]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setTab('rings')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
            tab === 'rings' ? 'bg-brand/20 border-brand/40 text-brand-deep' : 'bg-paper border-ink/10 text-muted'
          }`}
        >
          Colour rings
        </button>
        {FRAME_PACKS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setTab(p.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
              tab === p.id ? 'bg-brand/20 border-brand/40 text-brand-deep' : 'bg-paper border-ink/10 text-muted'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

    <div className="grid grid-cols-4 gap-3">
      {frames.map((frame) => {
        const isSelected = selectedFrameId === frame.id;
        let previewStyle: React.CSSProperties = {};

        switch (frame.type) {
          case FrameType.SOLID:
            previewStyle = { border: `4px solid ${frame.color1}` };
            break;
          case FrameType.DASHED:
            previewStyle = { border: `3px dashed ${frame.color1}` };
            break;
          case FrameType.GRADIENT:
            previewStyle = {};
            break;
          case FrameType.NEON:
            previewStyle = {
              border: `2px solid ${frame.color2}`,
              boxShadow: `0 0 6px ${frame.color1}, inset 0 0 4px ${frame.color1}`
            };
            break;
          case FrameType.CUSTOM_IMAGE:
            previewStyle = {};
            break;
          case FrameType.DOUBLE:
            break;
          case FrameType.MEMPHIS:
            previewStyle = {
              border: `3px solid ${frame.color1}`,
              boxShadow: `3px 3px 0px ${frame.color2}`
            };
            break;
          case FrameType.GEOMETRIC:
            previewStyle = {
              border: `3px dotted ${frame.color1}`
            };
            break;
          default:
            break;
        }

        return (
          <button
            key={frame.id}
            type="button"
            onClick={() => onSelect(frame)}
            className={`
              relative group flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200
              ${isSelected
                ? 'bg-paper2 ring-2 ring-brand ring-offset-2 ring-offset-paper'
                : 'bg-cream hover:bg-paper2 border border-ink/10 hover:border-ink/15'}
            `}
            title={frame.name}
          >
            <div className="w-10 h-10 relative mb-1 overflow-hidden flex items-center justify-center rounded-full bg-paper2">
              {frame.type === FrameType.CUSTOM_IMAGE && frame.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={frame.imageUrl} alt="" className="w-full h-full object-contain" />
              ) : (
                <div className="absolute inset-0 z-10 rounded-full" style={previewStyle}>
                  {frame.type === FrameType.GRADIENT && (
                    <div className="absolute inset-0 rounded-full border-[4px] border-transparent" style={{
                      background: `linear-gradient(135deg, ${frame.color1}, ${frame.color2}) border-box`,
                      WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude'
                    }} />
                  )}
                  {frame.type === FrameType.DOUBLE && (
                    <div className="absolute inset-0 rounded-full border-[3px] border-solid" style={{ borderColor: frame.color1 }}>
                      <div className="absolute inset-[3px] rounded-full border-[2px] border-solid" style={{ borderColor: frame.color2 }} />
                    </div>
                  )}
                </div>
              )}
            </div>
            <span className="text-[10px] font-medium text-muted group-hover:text-ink truncate w-full text-center">
              {frame.name}
            </span>
          </button>
        );
      })}
    </div>
    </div>
  );
};
