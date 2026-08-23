/**
 * Compose a 9:16 story PNG from a square framed canvas (centered circle on ink).
 */

export async function framedCircleToStoryBlob(
    source: HTMLCanvasElement,
    opts?: { width?: number; height?: number }
): Promise<Blob | null> {
    const W = opts?.width ?? 1080;
    const H = opts?.height ?? 1920;
    const out = document.createElement('canvas');
    out.width = W;
    out.height = H;
    const ctx = out.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#06141F';
    ctx.fillRect(0, 0, W, H);

    const size = Math.min(W * 0.86, H * 0.48);
    const x = (W - size) / 2;
    const y = (H - size) / 2 - H * 0.04;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(source, x, y, size, size);
    ctx.restore();

    return new Promise((resolve) => {
        out.toBlob((b) => resolve(b), 'image/png', 1);
    });
}
