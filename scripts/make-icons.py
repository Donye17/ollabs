"""Generate the Ollabs app icon set.

Why this exists, from what was actually wrong:

  * apple-touch-icon.png was 180x180 RGBA with a fully transparent background.
    iOS does not support alpha in home screen icons; it flattens transparency
    onto black. So the icon on an iPhone was a blue ring on a black square.
  * Google renders result icons on a white card, so a white/transparent
    background left the ring floating with no edge.

Fix: a full-bleed Ollabs Blue tile with a white ring. No alpha anywhere, hard
edges, sized to survive being shrunk to 32px and to survive Android's maskable
crop. The 16px and 32px favicons are deliberately left alone.
"""

from PIL import Image, ImageDraw
from pathlib import Path

BLUE = (1, 190, 246)      # #01BEF6, Ollabs Blue
WHITE = (255, 255, 255)
SS = 8                    # supersample factor, for clean circle edges

OUT = Path("/home/claude/work/public/favicon")
OUT.mkdir(parents=True, exist_ok=True)


def ring_icon(size: int, outer_frac: float, stroke_frac: float) -> Image.Image:
    """A white ring centred on a solid blue square. Fully opaque."""
    n = size * SS
    img = Image.new("RGB", (n, n), BLUE)
    d = ImageDraw.Draw(img)

    outer_r = n * outer_frac / 2
    stroke = n * stroke_frac
    inner_r = outer_r - stroke
    c = n / 2

    d.ellipse([c - outer_r, c - outer_r, c + outer_r, c + outer_r], fill=WHITE)
    d.ellipse([c - inner_r, c - inner_r, c + inner_r, c + inner_r], fill=BLUE)

    return img.resize((size, size), Image.LANCZOS)


# Standard tiles. 70% outer diameter reads as a confident mark without
# crowding the edge, and a 12% stroke is still ~4px at 32 and survives.
STANDARD = dict(outer_frac=0.70, stroke_frac=0.12)

# Android maskable crops to a circle of 80% width, so the mark pulls in to
# 58% and everything outside it is just blue that can be safely eaten.
MASKABLE = dict(outer_frac=0.58, stroke_frac=0.105)

targets = [
    ("apple-touch-icon.png", 180, STANDARD),
    ("android-chrome-192x192.png", 192, STANDARD),
    ("android-chrome-512x512.png", 512, STANDARD),
    ("icon-maskable-512x512.png", 512, MASKABLE),
    # A 1024 master, handy for app stores or anywhere needing a big square.
    ("icon-1024x1024.png", 1024, STANDARD),
]

for name, size, geom in targets:
    img = ring_icon(size, **geom)
    path = OUT / name
    img.save(path, "PNG", optimize=True)
    assert img.mode == "RGB", "icons must not carry an alpha channel"
    print(f"{name:32} {size:>5}px  {path.stat().st_size / 1024:6.1f} kB")

print("\nAll icons written opaque (mode RGB), no alpha channel.")
