#!/usr/bin/env python3
"""
National Nonprofit Day frame (August 17).

Writes public/frames/national-nonprofit-day.png, a 1024x1024 RGBA overlay with
a transparent centre, used as the CUSTOM_IMAGE frame on /day/national-nonprofit-day.

Composition: one cyan ring that breaks at the bottom for a single crest reading
[heart] NONPROFIT DAY. The break is what makes ring and crest read as one object
rather than a badge stuck onto a circle.

The heart is authored bezier geometry, not a glyph from a system font, and it
carries the meaning at sizes where the words have already turned to mush. A
profile picture is usually seen at 32-48px, so that is the size the design is
actually solving for.

    python3 scripts/frames/national_nonprofit_day.py [--out public/frames]
"""

import argparse
import math
import os
import subprocess

from PIL import Image, ImageDraw, ImageFilter, ImageFont

SIZE, SS = 1024, 4
C = R = SIZE * SS // 2

CYAN = (1, 190, 246)      # brand
DEEP = (2, 132, 199)      # deeper tone, used where the ring seats the crest
INK = (6, 20, 31)         # brand near-black, tinted, never pure

FONT_PATH = "/tmp/Bricolage-800.ttf"


def ensure_font():
    """Self-host the brand face. The nearest installed sans is a failure, not a fallback."""
    if os.path.exists(FONT_PATH):
        return
    from fontTools.ttLib import TTFont
    subprocess.run(["npm", "pack", "@fontsource/bricolage-grotesque", "--silent"],
                   cwd="/tmp", check=True, capture_output=True)
    subprocess.run(["tar", "xzf", "fontsource-bricolage-grotesque-5.3.0.tgz"],
                   cwd="/tmp", check=True, capture_output=True)
    f = TTFont("/tmp/package/files/bricolage-grotesque-latin-800-normal.woff")
    f.flavor = None
    f.save(FONT_PATH)


def mix(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def bez(p0, p1, p2, p3, n=56):
    out = []
    for i in range(n + 1):
        t = i / n
        u = 1 - t
        out.append((u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0],
                    u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]))
    return out


def heart(d, cx, cy, h, col):
    """Geometric heart from four beziers. Holds its silhouette down to ~20px."""
    s = h / 1.9
    tip = (cx, cy + 0.95 * s)
    p  = bez(tip, (cx-0.58*s, cy+0.55*s), (cx-1.02*s, cy+0.10*s), (cx-1.02*s, cy-0.16*s))
    p += bez((cx-1.02*s, cy-0.16*s), (cx-1.02*s, cy-0.58*s), (cx-0.74*s, cy-0.80*s), (cx-0.40*s, cy-0.80*s))
    p += bez((cx-0.40*s, cy-0.80*s), (cx-0.16*s, cy-0.80*s), (cx, cy-0.58*s), (cx, cy-0.34*s))
    p += bez((cx, cy-0.34*s), (cx, cy-0.58*s), (cx+0.16*s, cy-0.80*s), (cx+0.40*s, cy-0.80*s))
    p += bez((cx+0.40*s, cy-0.80*s), (cx+0.74*s, cy-0.80*s), (cx+1.02*s, cy-0.58*s), (cx+1.02*s, cy-0.16*s))
    p += bez((cx+1.02*s, cy-0.16*s), (cx+1.02*s, cy+0.10*s), (cx+0.58*s, cy+0.55*s), tip)
    d.polygon(p, fill=col + (255,))


def build():
    ensure_font()
    img = Image.new("RGBA", (SIZE*SS, SIZE*SS), (0, 0, 0, 0))
    layer = Image.new("RGBA", (SIZE*SS, SIZE*SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer, "RGBA")

    w = int(46 * SS)
    rad = R - w // 2
    text = "NONPROFIT DAY"

    # --- size the crest against the circle
    #
    # The binding constraint is the capsule's BOTTOM corners, not its centre:
    # the chord narrows as you go down, so a capsule that fits on its centreline
    # still gets its lower corners sliced off by the circular crop.
    ky = 0.70
    cy = C + int(rad * ky)

    px = int(78 * SS)
    while px > int(30 * SS):
        f = ImageFont.truetype(FONT_PATH, px)
        track = px * 0.055           # slight positive tracking: small caps need air
        tw = sum(d.textlength(c, font=f) for c in text) + track * (len(text) - 1)
        hw = px * 0.86               # heart occupies roughly cap height
        gap = px * 0.34
        bh = int(px * 1.80)
        bw = int(tw + hw + gap + min(int(px * 0.62), int(40*SS)) * 2)
        bottom = (cy - C) + bh / 2
        avail = 2 * math.sqrt(max(1.0, rad*rad - bottom*bottom)) * 0.94
        if bw <= avail:
            break
        px = int(px * 0.94)

    # --- ring, broken for the crest, deepening toward the break so the crest
    #     sits in a darker seat rather than floating on flat colour
    half = math.degrees(math.asin(min(1.0, (bw/2 + bh*0.10) / rad))) * 0.98
    a0, a1 = 90 + half, 90 - half + 360
    seg, prev = 620, None
    for i in range(seg + 1):
        t = i / seg
        ang = math.radians(a0 + (a1 - a0) * t)
        # darkest at both ends (nearest the crest), lightest at the top
        edge = 1 - abs(t - 0.5) * 2
        col = mix(DEEP, CYAN, min(1.0, edge * 1.6))
        ca, sa = math.cos(ang), math.sin(ang)
        o = (C + (rad + w/2)*ca, C + (rad + w/2)*sa)
        n = (C + (rad - w/2)*ca, C + (rad - w/2)*sa)
        if prev:
            d.polygon([prev[0], o, n, prev[1]], fill=col + (255,))
        prev = (o, n)
    for ang in (math.radians(a0), math.radians(a1)):   # round the cut ends
        ex, ey = C + rad*math.cos(ang), C + rad*math.sin(ang)
        d.ellipse([ex - w/2, ey - w/2, ex + w/2, ey + w/2], fill=DEEP + (255,))

    # --- crest
    d.rounded_rectangle([C - bw//2, cy - bh//2, C + bw//2, cy + bh//2],
                        radius=bh//2, fill=CYAN + (255,))

    f = ImageFont.truetype(FONT_PATH, px)
    track = px * 0.055
    widths = [d.textlength(c, font=f) for c in text]
    tw = sum(widths) + track * (len(text) - 1)
    hw = px * 0.86
    gap = px * 0.34
    total = hw + gap + tw
    x = C - total / 2

    heart(d, x + hw/2, cy, hw * 1.02, INK)
    x += hw + gap
    asc, desc = f.getmetrics()
    ty = cy - (asc - desc) / 2
    for ch, cw in zip(text, widths):
        d.text((x, ty), ch, font=f, fill=INK + (255,))
        x += cw + track

    # --- depth: real offset plus soft blur, so the frame sits above the photo
    sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
    sh.putalpha(layer.split()[3].point(lambda v: int(v * 62 / 255)))
    sh = sh.filter(ImageFilter.GaussianBlur(12 * SS / 4))
    img.alpha_composite(sh, (0, int(5 * SS / 4)))
    img.alpha_composite(layer)

    return img.resize((SIZE, SIZE), Image.LANCZOS)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="public/frames")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    p = os.path.join(a.out, "national-nonprofit-day.png")
    build().quantize(colors=200, method=Image.FASTOCTREE).save(p, "PNG", optimize=True)
    print(f"{p}  ({os.path.getsize(p)//1024}KB)")
