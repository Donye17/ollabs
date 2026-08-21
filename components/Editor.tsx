"use client";
import React, { useEffect } from 'react';
import { FrameConfig } from '@/lib/types';
import { useEditorLogic } from './editor/useEditorLogic';
import { CanvasArea } from './editor/CanvasArea';
import { EditorToolbar } from './editor/EditorToolbar';

interface EditorProps {
  imageSrc: string | null;
  onImageSelect: (file: File) => void;
  selectedFrame: FrameConfig;
  onReset: () => void;
  onPreviewUpdate: (dataUrl: string) => void;

  // Export Ref
  editorRef?: React.RefObject<{ getDominantColors: () => Promise<string[]> } | null>;

  // Background Removal
  onRemoveBackground?: () => void;
  isRemovingBackground?: boolean;
}

export const Editor: React.FC<EditorProps> = ({
  imageSrc,
  onImageSelect,
  selectedFrame,
  onReset,
  onPreviewUpdate,
  editorRef,
  onRemoveBackground,
  isRemovingBackground
}) => {
  const logic = useEditorLogic({ imageSrc, selectedFrame });

  // Panning the photo is the whole interaction model now. This used to open with
  // sticker rotate/scale handle hit tests, then a text hit test, then a sticker
  // hit test, before falling through to here.
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!logic.imageObject) {
      logic.setInteractionMode('none');
      return;
    }
    const { x, y } = logic.getMousePos(e);
    logic.setInteractionMode('pan');
    logic.setDragStart({ x: x - logic.position.x, y: y - logic.position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (logic.interactionMode !== 'pan') return;
    if (e.cancelable) e.preventDefault();
    const { x, y } = logic.getMousePos(e);
    logic.setPosition({ x: x - logic.dragStart.x, y: y - logic.dragStart.y });
  };

  const handleEnd = () => { logic.setInteractionMode('none'); };

  React.useImperativeHandle(editorRef, () => ({
    getDominantColors: logic.getDominantColors
  }));

  const handleDownload = async () => {
    const canvas = logic.canvasRef.current;
    if (!canvas) return;
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `ollabs-frame-${Date.now()}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Static preview update. This is what produces the campaign thumbnail, so the
  // body stays exactly as it was; only the `isPlaying` guard around it is gone,
  // along with the sticker and text-layer entries in the dependency list.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (logic.canvasRef.current) {
        onPreviewUpdate(logic.canvasRef.current.toDataURL('image/png', 0.5));
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [logic.canvasRef, logic.position, logic.scale, logic.rotation]);


  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      <CanvasArea
        canvasRef={logic.canvasRef as React.RefObject<HTMLCanvasElement>}
        imageObject={logic.imageObject}
        selectedFrame={selectedFrame}
        position={logic.position}
        scale={logic.scale}
        rotation={logic.rotation}
        isDragOver={logic.isDragOver}
        interactionMode={logic.interactionMode}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
        onDragOver={(e) => { e.preventDefault(); logic.setIsDragOver(true); }}
        onDragLeave={() => logic.setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          logic.setIsDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file && file.type.startsWith('image/')) onImageSelect(file);
        }}
      />

      <EditorToolbar
        imageObject={logic.imageObject}
        scale={logic.scale}
        setScale={logic.setScale}
        rotation={logic.rotation}
        setRotation={logic.setRotation}
        onReset={() => {
          logic.setScale(1);
          logic.setPosition({ x: 0, y: 0 });
          logic.setRotation(0);
          onReset();
        }}
        onAutoFit={logic.handleAutoFit}
        onImageSelect={onImageSelect}
        onRemoveBackground={onRemoveBackground}
        isRemovingBackground={isRemovingBackground}
        onDownload={handleDownload}
      />
    </div>
  );
};
