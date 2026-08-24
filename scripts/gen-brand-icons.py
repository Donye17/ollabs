"""Render the cyan square + white ring into favicon PNGs and a simple OG card."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FAV = ROOT / "public" / "favicon"
PUBLIC = ROOT / "public"
BRAND = (1, 190, 246, 255)
WHITE = (255, 255, 255, 255)
PAPER = (247, 248, 246, 255)
INK = (6, 20, 31, 255)


def mark(size: int, *, pad: int = 0, bg=None) -> Image.Image:
    img = Image.new("RGBA", (size, size), bg if bg is not None else (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    inner = size - 2 * pad
    x0 = y0 = pad
    x1 = y1 = pad + inner - 1
    radius = max(1, round(inner * 0.22))
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=BRAND)
    ring = max(4, round(inner * 0.55))
    thick = max(2, round(inner * 0.12))
    cx = cy = size / 2
    half = ring / 2
    draw.ellipse(
        [cx - half, cy - half, cx + half, cy + half],
        outline=WHITE,
        width=thick,
    )
    return img


def save_png(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")


def main() -> None:
    FAV.mkdir(parents=True, exist_ok=True)
    save_png(mark(16), FAV / "favicon-16x16.png")
    save_png(mark(32), FAV / "favicon-32x32.png")
    save_png(mark(180), FAV / "apple-touch-icon.png")
    save_png(mark(192), FAV / "android-chrome-192x192.png")
    save_png(mark(512), FAV / "android-chrome-512x512.png")
    # Maskable icons need a safe zone; extra pad keeps the ring inside Android crop.
    save_png(mark(512, pad=64, bg=BRAND), FAV / "icon-maskable-512x512.png")

    ico = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    ico.paste(mark(32), (0, 0))
    ico.save(
        FAV / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32)],
    )

    og = Image.new("RGB", (1200, 630), PAPER[:3])
    icon = mark(240).convert("RGBA")
    og.paste(icon, ((1200 - 240) // 2, 150), icon)
    draw = ImageDraw.Draw(og)
    try:
        font = ImageFont.truetype("arial.ttf", 56)
    except OSError:
        font = ImageFont.load_default()
    text = "Ollabs"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((1200 - tw) / 2, 430), text, fill=INK[:3], font=font)
    og.save(PUBLIC / "og.png", "PNG")
    print("wrote favicons + og.png")


if __name__ == "__main__":
    main()
