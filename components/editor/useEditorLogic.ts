import { useState, useRef, useCallback, useEffect } from 'react';
import { Position, StickerConfig, TextConfig, FrameConfig, FrameType } from '@/lib/types';
import { CANVAS_SIZE } from '@/lib/constants';
import ColorThief from 'colorthief';

const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}).join('');

interface UseEditorLogicProps {
    imageSrc: string | null;
    stickers: StickerConfig[];
    onStickersChange: (stickers: StickerConfig[]) => void;
    textLayers: TextConfig[];
    onTextLayersChange: (layers: TextConfig[]) => void;
    selectedFrame: FrameConfig;
}

export const useEditorLogic = ({
    imageSrc,
    stickers,
    onStickersChange,
    textLayers,
    onTextLayersChange,
    selectedFrame
}: UseEditorLogicProps) => {
    // Canvas State
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scale, setScale] = useState<number>(1);
    const [rotation, setRotation] = useState<number>(0);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [imageObject, setImageObject] = useState<HTMLImageElement | null>(null);

    // Interaction State
    const [selection, setSelection] = useState<string | null>(null); // Selected Sticker ID
    const [selectedTextId, setSelectedTextId] = useState<string | null>(null); // Selected Text ID
    const [interactionMode, setInteractionMode] = useState<'none' | 'drag' | 'scale' | 'rotate' | 'pan'>('none');
    const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    // Initial state for interactions to calculate deltas
    const [initialStickerState, setInitialStickerState] = useState<{ x: number, y: number, scale: number, rotation: number } | null>(null);
    const [initialTextState, setInitialTextState] = useState<{ x: number, y: number, rotation: number } | null>(null);

    // Recording State (GIF)
    const [isRecording, setIsRecording] = useState(false);
    const requestRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);

    // Texture Versioning for custom frames
    const [textureVersion, setTextureVersion] = useState(0);

    // --- Effects ---

    // Load Image
    useEffect(() => {
        if (imageSrc) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = imageSrc;
            img.onload = () => {
                setImageObject(img);
                setScale(1);
                setRotation(0);
                setPosition({ x: 0, y: 0 });
            };
        } else {
            setImageObject(null);
        }
    }, [imageSrc]);

    // Texture Reloading
    useEffect(() => {
        if (selectedFrame.type === FrameType.CUSTOM_IMAGE && selectedFrame.imageUrl) {
            const img = new Image();
            img.src = selectedFrame.imageUrl;
            img.onload = () => {
                setTextureVersion(prev => prev + 1);
            };
        }
    }, [selectedFrame.type, selectedFrame.imageUrl]);

    // --- Actions ---

    const handleAutoFit = () => {
        if (!imageObject) return;
        const radius = CANVAS_SIZE / 2;
        const coverRatio = Math.max((radius * 2) / imageObject.width, (radius * 2) / imageObject.height);
        const containRatio = Math.min((radius * 2) / imageObject.width, (radius * 2) / imageObject.height);
        const newScale = containRatio / coverRatio;
        setScale(newScale);
        setPosition({ x: 0, y: 0 });
        setRotation(0);
    };

    const getDominantColors = () => {
        return new Promise<string[]>((resolve, reject) => {
            if (!imageObject) {
                reject("No image loaded");
                return;
            }
            try {
                // @ts-ignore
                const colorThief = new ColorThief();
                const palette = colorThief.getPalette(imageObject, 3);
                if (palette && palette.length > 0) {
                    // @ts-ignore
                    const hexPalette = palette.map((rgb: number[]) => rgbToHex(rgb[0], rgb[1], rgb[2]));
                    resolve(hexPalette);
                } else {
                    reject("No colors found");
                }
            } catch (e) {
                reject(e);
            }
        });
    };

    const rotatePoint = (px: number, py: number, cx: number, cy: number, angle: number) => {
        const rad = (angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        return {
            x: (cos * (px - cx)) - (sin * (py - cy)) + cx,
            y: (sin * (px - cx)) + (cos * (py - cy)) + cy
        };
    };

    const getMousePos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? (e as any).touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as any).touches[0].clientY : (e as React.MouseEvent).clientY;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    };

    return {
        canvasRef,
        scale, setScale,
        rotation, setRotation,
        position, setPosition,
        imageObject,
        selection, setSelection,
        selectedTextId, setSelectedTextId,
        interactionMode, setInteractionMode,
        dragStart, setDragStart,
        isDragOver, setIsDragOver,
        initialStickerState, setInitialStickerState,
        initialTextState, setInitialTextState,
        isRecording, setIsRecording,
        requestRef,
        startTimeRef,
        textureVersion,
        handleAutoFit,
        getDominantColors,
        rotatePoint,
        getMousePos
    };
};
