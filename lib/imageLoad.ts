// Load a user photo into a normalized data URL.
// - Respects EXIF orientation (fixes sideways iPhone photos) via createImageBitmap.
// - Downscales very large images so the canvas stays fast and memory-safe.
// Falls back to a plain FileReader when createImageBitmap is unavailable.
export async function fileToDisplayDataUrl(file: File, maxSize = 2048): Promise<string> {
    if (typeof createImageBitmap === 'function' && typeof document !== 'undefined') {
        try {
            const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' } as ImageBitmapOptions);
            const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
            const w = Math.max(1, Math.round(bitmap.width * scale));
            const h = Math.max(1, Math.round(bitmap.height * scale));
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(bitmap, 0, 0, w, h);
                if (typeof bitmap.close === 'function') bitmap.close();
                return canvas.toDataURL('image/jpeg', 0.92);
            }
            if (typeof bitmap.close === 'function') bitmap.close();
        } catch {
            // fall through to FileReader
        }
    }

    return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('read failed'));
        reader.readAsDataURL(file);
    });
}
