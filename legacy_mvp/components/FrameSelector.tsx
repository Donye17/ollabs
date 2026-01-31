import React from 'react';
import { AVAILABLE_FRAMES } from '../constants';
import { FrameConfig, FrameType } from '../types';

interface FrameSelectorProps {
  selectedFrameId: string;
  onSelect: (frame: FrameConfig) => void;
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({ selectedFrameId, onSelect }) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {AVAILABLE_FRAMES.map((frame) => {
        const isSelected = selectedFrameId === frame.id;
        
        // Generate Preview Styles
        let previewStyle: React.CSSProperties = {};
        
        switch (frame.type) {
            case FrameType.SOLID:
                previewStyle = { border: `4px solid ${frame.color1}` };
                break;
            case FrameType.DASHED:
                previewStyle = { border: `3px dashed ${frame.color1}` };
                break;
            case FrameType.GRADIENT:
                // Gradient handled via JSX overlay below for better masking
                previewStyle = {};
                break;
            case FrameType.NEON:
                previewStyle = { 
                    border: `2px solid ${frame.color2}`,
                    boxShadow: `0 0 6px ${frame.color1}, inset 0 0 4px ${frame.color1}`
                };
                break;
            case FrameType.DOUBLE:
                // Double handled via nested div below
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
            case FrameType.STAR:
            case FrameType.HEART:
            case FrameType.HEXAGON:
                 // These use SVGs or clip-paths below
                 previewStyle = {};
                 break;
            default:
                break;
        }

        return (
          <button
            key={frame.id}
            onClick={() => onSelect(frame)}
            className={`
              relative group flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200
              ${isSelected 
                ? 'bg-slate-700 ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900' 
                : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600'}
            `}
            title={`Select ${frame.name}: ${getFrameDescription(frame)}`}
          >
            <div className="w-10 h-10 relative mb-1 overflow-visible flex items-center justify-center">
              
              {/* Background Shape */}
               {/* For shapes, we don't want the default circle bg if the shape is wildly different, 
                   but for a "Frame" maker, usually the "No Frame" part is a circle. 
                   We'll keep the circle bg for consistency unless it's a shape type. */}
              {frame.type !== FrameType.STAR && frame.type !== FrameType.HEXAGON && frame.type !== FrameType.HEART && (
                  <div className="absolute inset-0 bg-slate-600 rounded-full overflow-hidden shadow-inner" />
              )}
              
              {/* Actual Frame Preview */}
              <div 
                className={`absolute inset-0 z-10 ${
                    frame.type !== FrameType.STAR && frame.type !== FrameType.HEXAGON && frame.type !== FrameType.HEART ? 'rounded-full' : ''
                }`}
                style={previewStyle} 
              >
                  {/* High fidelity gradient ring using mask-composite */}
                  {(frame.type === FrameType.GRADIENT) && (
                      <div className="absolute inset-0 rounded-full border-[4px] border-transparent" style={{ 
                        background: `linear-gradient(135deg, ${frame.color1}, ${frame.color2}) border-box`,
                        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude'
                      }}></div>
                  )}

                  {/* Inner White Line for Neon */}
                  {(frame.type === FrameType.NEON) && (
                       <div className="absolute inset-0 rounded-full border border-white/40"></div>
                  )}
                  {/* Double Frame Structure */}
                  {frame.type === FrameType.DOUBLE && (
                       <div className="absolute inset-0 rounded-full border-[3px] border-solid" style={{ borderColor: frame.color1 }}>
                            <div className="absolute inset-[3px] rounded-full border-[2px] border-solid" style={{ borderColor: frame.color2 }}></div>
                       </div>
                  )}

                  {/* SVG Shapes */}
                  {frame.type === FrameType.STAR && (
                      <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
                          <path 
                              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                              fill="none" 
                              stroke={frame.color1} 
                              strokeWidth="2.5" 
                              className="drop-shadow-sm"
                          />
                      </svg>
                  )}
                  
                  {frame.type === FrameType.HEXAGON && (
                      <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
                           <path 
                              d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" 
                              fill="none" 
                              stroke={frame.color1} 
                              strokeWidth="2.5" 
                           />
                      </svg>
                  )}

                  {frame.type === FrameType.HEART && (
                      <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
                          <defs>
                              <linearGradient id={`grad-${frame.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor={frame.color1} />
                                  <stop offset="100%" stopColor={frame.color2 || frame.color1} />
                              </linearGradient>
                          </defs>
                          <path 
                              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                              fill="none" 
                              stroke={frame.color2 ? `url(#grad-${frame.id})` : frame.color1} 
                              strokeWidth="2.5" 
                          />
                      </svg>
                  )}

              </div>
            </div>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-200 truncate w-full text-center">
              {frame.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// Helper for tooltips
function getFrameDescription(frame: FrameConfig): string {
    switch (frame.type) {
        case FrameType.SOLID: return "A classic solid single-color ring.";
        case FrameType.GRADIENT: return "A smooth color blend between two tones.";
        case FrameType.NEON: return "A glowing cyber-style effect.";
        case FrameType.DOUBLE: return "Two concentric rings of different colors.";
        case FrameType.DASHED: return "A stitched or dashed line effect.";
        case FrameType.MEMPHIS: return "A bold pop-art style with offset shadow.";
        case FrameType.GEOMETRIC: return "A pattern of dots or geometric shapes.";
        case FrameType.STAR: return "A star-shaped frame for standout profiles.";
        case FrameType.HEART: return "A heart-shaped frame for lovely avatars.";
        case FrameType.HEXAGON: return "A hexagonal frame for tech or gaming vibes.";
        default: return "No frame.";
    }
}