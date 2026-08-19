#!/usr/bin/env python3
"""Ollabs social post frames.

These are NOT product frames. Product frames are the restrained circular rings in
`generate_frames.py`, built to survive at 32px on a profile photo. These are loud
feed graphics: a cream plate with a transparent photo window, built to stop a thumb
in a scroll.

Brand system (brand/ollabs-brand-book.html):
  cream #F4F1EA leads, ink #06141F carries, blue #01BEF6 brands,
  coral #FF5C39 and amber #FFC24B are rare sparks.
  Display = Bricolage Grotesque 800. Labels = Inter 700 uppercase, wide tracking.
  Ink text on blue fills, never white. Blue Deep #0288B8 when blue must be text.

Output: transparent-window PNG overlays at 1080x1080 (feed) and 1080x1920 (story).

Usage:
    python3 scripts/generate_social_frames.py
Add an occasion by appending to POSTS at the bottom.
"""
import math
import os
from PIL import Image, ImageDraw, ImageFont

FONTS = os.environ.get("OLLABS_FONT_DIR", "/tmp/gf/fonts")
OUT = os.environ.get("OLLABS_SOCIAL_OUT", "public/social")
S = 2  # supersample factor

# ---- brand palette -----------------------------------------------------------
INK        = (6, 20, 31, 255)
CREAM      = (244, 241, 234, 255)
WHITE      = (253, 252, 249, 255)
BLUE       = (1, 190, 246, 255)
BLUE_DEEP  = (2, 136, 184, 255)
CORAL      = (255, 92, 57, 255)
AMBER      = (255, 194, 75, 255)
MUTED      = (114, 108, 95, 255)


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), max(int(size), 1))


def tracked_width(d, txt, f, tracking=0.0):
    return d.textlength(txt, font=f) + tracking * max(len(txt) - 1, 0)


def draw_tracked(d, xy, txt, f, fill, tracking=0.0, center=False):
    x, y = xy
    if center:
        x -= tracked_width(d, txt, f, tracking) / 2
    for ch in txt:
        d.text((x, y), ch, font=f, fill=fill)
        x += d.textlength(ch, font=f) + tracking


def fit(d, txt, name, target_w, tracking_ratio=0.0, lo=10, hi=520):
    """Largest size whose tracked width still fits target_w."""
    best = lo
    while lo <= hi:
        mid = (lo + hi) // 2
        if tracked_width(d, txt, font(name, mid), mid * tracking_ratio) <= target_w:
            best, lo = mid, mid + 1
        else:
            hi = mid - 1
    return font(name, best), best * tracking_ratio


def heart(cx, cy, size, rot=0):
    pts = []
    for i in range(90):
        t = 2 * math.pi * i / 90
        x = 16 * math.sin(t) ** 3
        y = -(13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t))
        x *= size / 32.0
        y *= size / 32.0
        a = math.radians(rot)
        pts.append((cx + x * math.cos(a) - y * math.sin(a),
                    cy + x * math.sin(a) + y * math.cos(a)))
    return pts


def sparkle(cx, cy, r, waist=0.24, rot=0):
    return [(cx + (r if i % 2 == 0 else r * waist) * math.cos(math.radians(rot + i * 45)),
             cy + (r if i % 2 == 0 else r * waist) * math.sin(math.radians(rot + i * 45)))
            for i in range(8)]


def build(eyebrow, line1, line2, kicker, W=1080, H=1080):
    """One social frame. line2 carries the blue-deep highlight."""
    w, h = W * S, H * S
    story = H > W

    plate = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(plate)
    d.rounded_rectangle((0, 0, w, h), radius=52 * S, fill=CREAM)

    # decorative rings, cropped off the edges, low opacity (brand: shapes)
    deco = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dd = ImageDraw.Draw(deco)
    r1 = 300 * S
    dd.ellipse((w - r1, -r1 * 0.55, w + r1, r1 * 1.45), outline=BLUE[:3] + (56,), width=46 * S)
    r2 = 190 * S
    dd.ellipse((-r2 * 0.8, h - r2 * 1.25, r2 * 1.2, h + r2 * 0.75),
               outline=CORAL[:3] + (40,), width=30 * S)
    plate.alpha_composite(deco)
    d = ImageDraw.Draw(plate)

    margin = 74 * S
    inner_w = w - margin * 2

    # ---- type block, measured before the window is placed so nothing overlaps ----
    eb_px = int((25 if not story else 31) * S)
    f_eb = font("inter700.ttf", eb_px)
    y = (74 if not story else 172) * S
    draw_tracked(d, (w / 2, y), eyebrow.upper(), f_eb, BLUE_DEEP,
                 tracking=eb_px * 0.30, center=True)
    y += eb_px * 2.35

    f1, t1 = fit(d, line1, "bricolage800.ttf", inner_w * 0.94, 0.0)
    b1 = f1.getbbox(line1)
    draw_tracked(d, (w / 2, y - b1[1]), line1, f1, INK, tracking=t1, center=True)
    y += (b1[3] - b1[1]) * 1.14

    f2, t2 = fit(d, line2, "bricolage800.ttf", inner_w, 0.0)
    b2 = f2.getbbox(line2)
    draw_tracked(d, (w / 2, y - b2[1]), line2, f2, BLUE_DEEP, tracking=t2, center=True)
    y += (b2[3] - b2[1]) + (54 if not story else 78) * S

    # ---- bottom ink band ----
    band_h = (196 if not story else 280) * S
    band_top = h - band_h
    d.rounded_rectangle((0, band_top, w, h), radius=52 * S, fill=INK)
    d.rectangle((0, band_top, w, band_top + 60 * S), fill=INK)

    # ---- the photo window, whatever room is left between type and band ----
    wx0, wx1 = margin, w - margin
    wy0 = y
    wy1 = band_top - (54 if not story else 78) * S
    rad = 38 * S
    if wy1 - wy0 > 160 * S:
        d.rounded_rectangle((wx0 + 13 * S, wy0 + 13 * S, wx1 + 13 * S, wy1 + 13 * S),
                            radius=rad, fill=BLUE)
        d.rounded_rectangle((wx0, wy0, wx1, wy1), radius=rad, fill=INK)
        hole = Image.new("L", (w, h), 255)
        ImageDraw.Draw(hole).rounded_rectangle((wx0 + 6 * S, wy0 + 6 * S,
                                                wx1 - 6 * S, wy1 - 6 * S),
                                               radius=rad - 6 * S, fill=0)
        plate.putalpha(Image.composite(plate.split()[3], Image.new("L", (w, h), 0), hole))

    # ---- stickers and lockup on top of the punched plate ----
    ov = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    o = ImageDraw.Draw(ov)

    def sticker(pts_fn, fill, *a, **k):
        o.polygon(pts_fn(*a, **k), fill=CREAM)

    hs = (104 if not story else 132) * S
    o.polygon(heart(wx0 + 10 * S, wy0 + 4 * S, hs + 15 * S, -18), fill=CREAM)
    o.polygon(heart(wx0 + 10 * S, wy0 + 4 * S, hs, -18), fill=CORAL)
    o.polygon(heart(wx1 - 8 * S, wy1 - 6 * S, hs * 0.62 + 14 * S, 16), fill=CREAM)
    o.polygon(heart(wx1 - 8 * S, wy1 - 6 * S, hs * 0.62, 16), fill=AMBER)
    for cx, cy, r in [(wx0 + 24 * S, wy1 - 62 * S, 30 * S),
                      (wx1 - 30 * S, wy0 + 96 * S, 24 * S)]:
        o.polygon(sparkle(cx, cy, r + 5 * S, rot=12), fill=CREAM)
        o.polygon(sparkle(cx, cy, r, rot=12), fill=BLUE)

    # kicker + wordmark inside the ink band
    k_px = int((40 if not story else 54) * S)
    fk = font("bricolage800.ttf", k_px)
    ky = band_top + (36 if not story else 56) * S
    o.text((w / 2, ky), kicker, font=fk, fill=CREAM, anchor="ma")

    wm_px = int((30 if not story else 40) * S)
    fw = font("inter900.ttf", wm_px)
    wy = ky + k_px * 1.62
    ring_r = wm_px * 0.52
    label = "OLLABS"
    lw = tracked_width(o, label, fw, wm_px * 0.20)
    total = ring_r * 2 + wm_px * 0.55 + lw
    x0 = w / 2 - total / 2
    o.ellipse((x0, wy + wm_px * 0.06, x0 + ring_r * 2, wy + wm_px * 0.06 + ring_r * 2),
              outline=BLUE, width=int(wm_px * 0.28))
    draw_tracked(o, (x0 + ring_r * 2 + wm_px * 0.55, wy), label, fw, CREAM,
                 tracking=wm_px * 0.20)

    return Image.alpha_composite(plate, ov).resize((W, H), Image.LANCZOS)


POSTS = [
    # slug,              eyebrow,               line1,       line2 (blue),      kicker
    ("girlfriend-day",   "Aug 1 · Ollabs",      "National",  "Girlfriend Day",  "Best collab ever."),
]


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for slug, eb, l1, l2, kick in POSTS:
        for (W, H), tag in [((1080, 1080), "feed"), ((1080, 1920), "story")]:
            img = build(eb, l1, l2, kick, W, H)
            path = os.path.join(OUT, f"ollabs-{slug}-{tag}.png")
            img.save(path)
            print("wrote", path)
