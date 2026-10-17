"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AVAILABLE_FRAMES } from '@/lib/constants';
import { FRAME_PACKS, type FramePackId } from '@/lib/framePacks';
import { FrameConfig, FrameType } from '@/lib/types';
import { useLocale } from '@/components/i18n/LocaleProvider';
import type { Locale } from '@/lib/i18n/locale';

interface FrameSelectorProps {
  selectedFrameId: string;
  onSelect: (frame: FrameConfig) => void;
}

function defaultPackId(locale: Locale): FramePackId | 'rings' {
  if (locale === 'pt') return 'br';
  if (locale === 'id') return 'id';
  if (locale === 'tl') return 'ph';
  if (locale === 'es') return 'mx';
  return 'rings';
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({ selectedFrameId, onSelect }) => {
  const { locale, messages } = useLocale();
  // Follow the UI language, not the browser. WhatsApp's in-app browser often
  // reports English while the campaign page has already switched to Portuguese.
  const [tab, setTab] = useState<FramePackId | 'rings'>(() => defaultPackId(locale));
  const pickedTab = useRef(false);
  useEffect(() => {
    if (pickedTab.current) return;
    setTab(defaultPackId(locale));
  }, [locale]);
  const chooseTab = (next: FramePackId | 'rings') => {
    pickedTab.current = true;
    setTab(next);
  };

  const frames = useMemo(() => {
    if (tab === 'rings') return AVAILABLE_FRAMES;
    return FRAME_PACKS.find((p) => p.id === tab)?.frames ?? AVAILABLE_FRAMES;
  }, [tab]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => chooseTab('rings')}
          className={`min-h-[44px] px-3 rounded-lg text-xs font-bold border transition-colors ${
            tab === 'rings' ? 'bg-brand/20 border-brand/40 text-brand-deep' : 'bg-paper border-ink/10 text-muted'
          }`}
        >
          {messages.create.colourRings}
        </button>
        {FRAME_PACKS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => chooseTab(p.id)}
            className={`min-h-[44px] px-3 rounded-lg text-xs font-bold border transition-colors ${
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
