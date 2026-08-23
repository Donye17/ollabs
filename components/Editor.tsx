"use client";
import React, { useEffect, useState } from 'react';
import { FrameConfig } from '@/lib/types';
import { saveFramedPhoto, preferShareSheetForSave } from '@/lib/savePhoto';
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

  /** Campaign builder: preview the frame; photo upload is optional and secondary. */
  frameFirst?: boolean;
}

export const Editor: React.FC<EditorProps> = ({
  imageSrc,
  onImageSelect,
  selectedFrame,
  onReset,
  onPreviewUpdate,
  editorRef,
  onRemoveBackground,
  isRemovingBackground,
  frameFirst = false,
}) => {
  const logic = useEditorLogic({ imageSrc, selectedFrame });

  const [canSharePhoto, setCanSharePhoto] = useState(false);
  const [sharingPhoto, setSharingPhoto] = useState(false);

  useEffect(() => {
    setCanSharePhoto(preferShareSheetForSave());
  }, []);

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

  const renderedBlob = async (): Promise<Blob | null> => {
    const canvas = logic.canvasRef.current;
    if (!canvas) return null;
    return new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
  };

  const handleDownload = async () => {
    const blob = await renderedBlob();
    if (!blob) return;
    await saveFramedPhoto({
      blob,
      filename: `ollabs-frame-${Date.now()}.png`,
      title: 'Ollabs frame',
      forceDownload: true,
    });
  };

  const handleSharePhoto = async () => {
    setSharingPhoto(true);
    try {
      const blob = await renderedBlob();
      if (!blob) return;
      await saveFramedPhoto({
        blob,
        filename: `ollabs-frame-${Date.now()}.png`,
        title: 'Ollabs frame',
      });
    } finally {
      setSharingPhoto(false);
    }
  };

  // Static preview update. This is what produces the campaign thumbnail and the
  // image people see when the link is shared.
  //
  // selectedFrame was missing from the deps, which meant changing the frame
  // never re-read the canvas: whatever frame happened to be selected the last
  // time the photo moved got published as the share image. imageObject is here
  // for the same reason — the first paint after a photo loads has to be picked
  // up. Both repaint the canvas, so both have to re-read it.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (logic.canvasRef.current) {
        onPreviewUpdate(logic.canvasRef.current.toDataURL('image/png', 0.5));
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [logic.canvasRef, logic.imageObject, logic.position, logic.scale, logic.rotation, selectedFrame, onPreviewUpdate]);


  return (
    <div className={`flex flex-col items-center w-full max-w-lg mx-auto ${frameFirst ? 'gap-2 lg:gap-6' : 'gap-6'}`}>
      <CanvasArea
        canvasRef={logic.canvasRef as React.RefObject<HTMLCanvasElement>}
        imageObject={logic.imageObject}
        selectedFrame={selectedFrame}
        position={logic.position}
        scale={logic.scale}
        rotation={logic.rotation}
        isDragOver={logic.isDragOver}
        interactionMode={logic.interactionMode}
        frameFirst={frameFirst}
        compact={frameFirst}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
        onDragOver={(e) => {
          if (frameFirst && !logic.imageObject) return;
          e.preventDefault();
          logic.setIsDragOver(true);
        }}
        onDragLeave={() => logic.setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          logic.setIsDragOver(false);
          if (frameFirst && !logic.imageObject) return;
          const file = e.dataTransfer.files?.[0];
          if (file && file.type.startsWith('image/')) onImageSelect(file);
        }}
      />

      {/* On create, photo tools live under the frame upload on phones so the
          sticky preview stays a small always-on frame, not a tall stack. */}
      <div className={frameFirst ? 'hidden lg:block w-full' : 'w-full'}>
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
          onSharePhoto={canSharePhoto ? handleSharePhoto : undefined}
          isSharingPhoto={sharingPhoto}
          frameFirst={frameFirst}
        />
      </div>
    </div>
  );
};
