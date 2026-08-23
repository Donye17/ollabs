import { useState, useRef, useCallback, useEffect } from 'react';
import { Position, FrameConfig, FrameType } from '@/lib/types';
import { CANVAS_SIZE } from '@/lib/constants';
import ColorThief from 'colorthief';

const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}).join('');

interface UseEditorLogicProps {
    imageSrc: string | null;
    selectedFrame: FrameConfig;
}

export const useEditorLogic = ({
    imageSrc,
    selectedFrame
}: UseEditorLogicProps) => {
    // Canvas State
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scale, setScale] = useState<number>(1);
    const [rotation, setRotation] = useState<number>(0);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [imageObject, setImageObject] = useState<HTMLImageElement | null>(null);

    // Interaction State. Panning the photo is the only interaction left; the
    // drag/scale/rotate modes belonged to sticker handles, and the selection and
    // initial-state fields to stickers and text layers.
    const [interactionMode, setInteractionMode] = useState<'none' | 'pan'>('none');
    const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
    const [isDragOver, setIsDragOver] = useState<boolean>(false);

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
                const colorThief = new ColorThief();
                const palette = colorThief.getPalette(imageObject, 3);
                if (palette && palette.length > 0) {
                    const hexPalette = palette.map((rgb) => rgbToHex(rgb[0], rgb[1], rgb[2]));
                    resolve(hexPalette);
                } else {
                    reject("No colors found");
                }
            } catch (e) {
                reject(e);
            }
        });
    };

    const getMousePos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        let clientX: number;
        let clientY: number;
        if ('touches' in e && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else if ('changedTouches' in e && e.changedTouches.length > 0) {
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
        } else {
            clientX = (e as MouseEvent | React.MouseEvent).clientX;
            clientY = (e as MouseEvent | React.MouseEvent).clientY;
        }
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
        interactionMode, setInteractionMode,
        dragStart, setDragStart,
        isDragOver, setIsDragOver,
        textureVersion,
        handleAutoFit,
        getDominantColors,
        getMousePos
    };
};
