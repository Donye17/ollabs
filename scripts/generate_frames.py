#!/usr/bin/env python3
"""
Ollabs premium frame generator.

Produces 1024x1024 RGBA PNG overlays with transparent centres, for use as
CUSTOM_IMAGE frames (public/frames/*.png).

Design rules, derived from how profile pictures are actually displayed:
  - A profile picture is usually seen at 32-48px. Every element must survive that.
  - Ring weight sits at ~5-6% of diameter. Thinner reads as a rendering artifact,
    thicker eats the face.
  - Type lives in a solid block or on a heavy band, never as thin text on a
    hairline, because thin curved type is illegible at avatar size.
  - Two colours maximum, one accent. Restraint is what makes a frame wearable.
  - Nothing crosses the circular safe zone. Everything is supersampled 4x.

Drawing primitives live in frame_lib.py, which explains the four things that
separate a designed frame from a coloured circle: taper, angular gradient,
shadow separation, and nesting marks into the ring rather than stacking on it.

Usage:  python3 scripts/generate_frames.py [--out public/frames]
"""

import argparse
import math
import os
import sys

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from frame_lib import (  # noqa: E402
    C, R, SS, SIZE, arc_text, bezier, drop_shadow, finish, hex_rgb, mix,
    new_canvas, ribbon, ring, ring_gap, shade, tapered_arc, tracked_text,
)

FONT_800 = "/tmp/Bricolage-800.ttf"
FONT_700 = "/tmp/Bricolage-700.ttf"
FALLBACK = "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf"


def ensure_fonts():
    """Convert the brand font from the fontsource package if it isn't here yet."""
    if os.path.exists(FONT_800):
        return
    try:
        import subprocess
        from fontTools.ttLib import TTFont
        subprocess.run(["npm", "pack", "@fontsource/bricolage-grotesque",
                        "--silent"], cwd="/tmp", check=True,
                       capture_output=True)
        subprocess.run(["tar", "xzf", "fontsource-bricolage-grotesque-5.3.0.tgz"],
                       cwd="/tmp", check=True, capture_output=True)
        for wt, dest in ((800, FONT_800), (700, FONT_700)):
            f = TTFont(f"/tmp/package/files/bricolage-grotesque-latin-{wt}-normal.woff")
            f.flavor = None
            f.save(dest)
    except Exception as e:  # fall back to a system face rather than failing
        print(f"  (brand font unavailable, falling back: {e})")


def font(size, weight=800):
    path = FONT_800 if weight == 800 else FONT_700
    for p in (path, FALLBACK):
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, int(size))
            except Exception:
                continue
    return ImageFont.load_default()


# ---------------------------------------------------------------- archetypes

def crest(color, text, *, accent=None, text_color="#FFFFFF", ring_w=52):
    """
    Ring broken at the bottom with a solid crest nested into the gap.

    The gap is what makes this read as one designed object rather than a badge
    stacked on a circle: the ring stops, the crest takes over, they share a
    centreline and an optical weight.
    """
    img = new_canvas()
    base = hex_rgb(color)
    acc = hex_rgb(accent or color)
    w = int(ring_w * SS)
    rad = R - w // 2

    layer = new_canvas()
    d = ImageDraw.Draw(layer, "RGBA")

    # --- size the crest first; the ring gap is cut to match it
    ky = 0.76
    cy = C + int(rad * ky)
    max_bw = 2 * (rad * math.sqrt(max(0.0, 1 - ky * ky))) * 0.94
    fsize = int(92 * SS)
    while True:
        f = font(fsize)
        track = fsize * 0.05
        tw = sum(d.textlength(ch, font=f) for ch in text) + track * (len(text) - 1)
        bh = int(fsize * 1.86)
        pad = min(int(fsize * 0.80), int(52 * SS))
        bw = int(tw + pad * 2)
        if bw <= max_bw or fsize <= int(32 * SS):
            break
        fsize = int(fsize * 0.94)

    # Break the ring where the crest sits. Nesting the two reads as one object;
    # a crest floating inside an unbroken ring reads as two.
    half_ang = math.degrees(math.asin(min(1.0, (bw / 2 + bh * 0.16) / rad))) * 1.02
    ring_gap(layer, rad, w, base, gap_center=90, gap_deg=half_ang * 2,
             c2=shade(base, 1.10))

    # crest body, with a hairline lip in the accent so it has an edge
    box = [C - bw // 2, cy - bh // 2, C + bw // 2, cy + bh // 2]
    d.rounded_rectangle(box, radius=bh // 2, fill=acc + (255,))
    if acc != base:
        d.rounded_rectangle(box, radius=bh // 2, outline=base + (255,),
                            width=int(5 * SS))

    tracked_text(d, (C, cy), text, font(fsize), hex_rgb(text_color) + (255,),
                 track=fsize * 0.05)

    drop_shadow(img, layer, blur=16, dy=7, alpha=76)
    return finish(img)


def sweep(c1, c2, text, *, text_color="#FFFFFF", ring_w=13):
    """
    Hairline ring plus a tapered band carrying the message.

    The band thins at both ends and its colour travels along its own path, so it
    reads as a stroke laid onto the ring rather than a slice cut out of a donut.
    """
    img = new_canvas()
    a, b = hex_rgb(c1), hex_rgb(c2)
    layer = new_canvas()

    thin = int(ring_w * SS)
    ring(layer, R - thin // 2, thin, a)

    heavy = int(104 * SS)
    rad = R - heavy // 2 - int(4 * SS)

    # fit the type, then build the band around it
    px = int(72 * SS)
    while px > int(36 * SS):
        f = font(px)
        d = ImageDraw.Draw(layer)
        total = sum(d.textlength(ch, font=f) for ch in text)
        if math.degrees(total / rad * 1.14) <= 122:
            break
        px = int(px * 0.94)
    f = font(px)
    d = ImageDraw.Draw(layer)
    total = sum(d.textlength(ch, font=f) for ch in text)
    span = math.degrees(total / rad * 1.14)

    sweep_deg = span + 54  # generous taper runway either side of the type
    tapered_arc(layer, rad, heavy, 90 - sweep_deg / 2, 90 + sweep_deg / 2,
                a, b, taper="both")
    arc_text(layer, text, f, rad, hex_rgb(text_color) + (255,), spread=1.14)

    drop_shadow(img, layer, blur=15, dy=6, alpha=70)
    return finish(img)


def emblem(color, *, ring_color=None, ring_w=50):
    """
    Ring broken at the bottom with an awareness ribbon set into the gap.

    Earlier versions floated the ribbon on a white disc over an unbroken ring,
    which read as a sticker. Nesting it into a gap in the ring makes the ribbon
    part of the frame.
    """
    img = new_canvas()
    rc = hex_rgb(ring_color or color)
    rib = hex_rgb(color)
    w = int(ring_w * SS)
    rad = R - w // 2

    layer = new_canvas()
    h = int(212 * SS)                 # ribbon height, crossing to apex
    tl = h * 0.62                     # tail length below the crossing
    half_w = h * 0.40 / 2 + h * 0.30 / 2

    # Seat the tails just inside the ring so nothing runs off the canvas, then
    # cut the gap to the ribbon's actual widest point rather than guessing.
    cross_y = C + int(rad * 0.96) - int(tl)
    gap = math.degrees(math.asin(min(1.0, half_w / rad))) * 2 * 1.30
    ring_gap(layer, rad, w, rc, gap_center=90, gap_deg=gap, c2=shade(rc, 1.10))
    ribbon(layer, C, cross_y, h, rib, thickness=0.30)

    drop_shadow(img, layer, blur=15, dy=6, alpha=74)
    return finish(img)


def hairline(color, *, accent=None):
    """
    One clean ring and a single solid pip.

    The restrained option. This is the frame people leave on for a month,
    because it signals support without taking over the picture.
    """
    img = new_canvas()
    col = hex_rgb(color)
    acc = hex_rgb(accent or color)
    layer = new_canvas()

    # One clean ring, not two. A faint second ring reads as a sketching
    # artifact at avatar size rather than as refinement.
    w = int(30 * SS)
    rad = R - w // 2
    ring(layer, rad, w, col)

    # A single solid pip seated on the ring, off the vertical axis so it reads
    # as deliberate. An earlier version used a crescent that tapered to nothing
    # at both ends; against a photo that just looked like a smudge.
    a = math.radians(52)
    px, py = C + rad * math.cos(a), C + rad * math.sin(a)
    d = ImageDraw.Draw(layer, "RGBA")
    outer = int(62 * SS)
    d.ellipse([px - outer, py - outer, px + outer, py + outer],
              fill=(255, 255, 255, 255))
    inner = int(44 * SS)
    d.ellipse([px - inner, py - inner, px + inner, py + inner], fill=acc + (255,))

    drop_shadow(img, layer, blur=11, dy=5, alpha=60)
    return finish(img)


def duo(c1, c2, text, *, text_color="#FFFFFF"):
    """
    Full angular-gradient ring with a nested crest. The loudest option, for
    campaigns that want the frame itself to be the graphic.
    """
    img = new_canvas()
    a, b = hex_rgb(c1), hex_rgb(c2)
    w = int(60 * SS)
    rad = R - w // 2
    layer = new_canvas()
    d = ImageDraw.Draw(layer, "RGBA")

    ky = 0.76
    cy = C + int(rad * ky)
    max_bw = 2 * (rad * math.sqrt(max(0.0, 1 - ky * ky))) * 0.94
    fsize = int(88 * SS)
    while True:
        f = font(fsize)
        track = fsize * 0.05
        tw = sum(d.textlength(ch, font=f) for ch in text) + track * (len(text) - 1)
        bh = int(fsize * 1.86)
        pad = min(int(fsize * 0.80), int(52 * SS))
        bw = int(tw + pad * 2)
        if bw <= max_bw or fsize <= int(32 * SS):
            break
        fsize = int(fsize * 0.94)

    half_ang = math.degrees(math.asin(min(1.0, (bw / 2) / rad))) * 1.06
    # gradient runs around the ring from one side of the crest to the other
    tapered_arc(layer, rad, w, 90 + half_ang, 90 - half_ang + 360,
                a, b, taper="none", segments=620)

    box = [C - bw // 2, cy - bh // 2, C + bw // 2, cy + bh // 2]
    d.rounded_rectangle(box, radius=bh // 2, fill=mix(a, b, 0.5) + (255,))
    tracked_text(d, (C, cy), text, font(fsize), hex_rgb(text_color) + (255,),
                 track=fsize * 0.05)

    drop_shadow(img, layer, blur=16, dy=7, alpha=76)
    return finish(img)


# ---------------------------------------------------------------------- set

def build(out_dir):
    ensure_fonts()
    os.makedirs(out_dir, exist_ok=True)
    made = []

    def save(name, img):
        img.save(os.path.join(out_dir, name + ".png"), "PNG", optimize=True)
        made.append(name)
        print(f"  {name}.png")

    # --- October: Breast Cancer Awareness (the single biggest moment)
    save("breast-cancer-ribbon", emblem("#EC4899"))
    save("breast-cancer-badge", crest("#EC4899", "IN THIS TOGETHER"))
    save("breast-cancer-minimal", hairline("#F472B6", accent="#BE185D"))

    # --- October: Domestic Violence Awareness
    save("domestic-violence-ribbon", emblem("#7C3AED"))
    save("domestic-violence-badge", crest("#7C3AED", "NO MORE"))

    # --- October: Unity Day / bullying prevention (PACER orange)
    save("unity-day-badge", crest("#F97316", "UNITY DAY", accent="#EA580C"))
    save("unity-day-arc", sweep("#F97316", "#FBBF24", "KINDNESS WINS"))

    # --- October: World Mental Health Day
    save("mental-health-arc", sweep("#0EA5A5", "#22C55E", "YOU MATTER"))
    save("mental-health-minimal", hairline("#2DD4BF", accent="#0F766E"))

    # --- September: Suicide Prevention
    save("suicide-prevention-ribbon", emblem("#14B8A6", ring_color="#7C3AED"))
    save("suicide-prevention-badge", crest("#7C3AED", "988", accent="#14B8A6"))

    # --- September: Childhood Cancer (gold)
    save("childhood-cancer-ribbon", emblem("#EAB308"))
    save("childhood-cancer-badge", crest("#EAB308", "GO GOLD", text_color="#1F1300"))

    # --- September: Hispanic Heritage Month
    save("hispanic-heritage-arc", sweep("#DC2626", "#F59E0B", "HERENCIA"))

    # --- September: Alzheimer's / The Longest Day
    save("alzheimers-ribbon", emblem("#8B5CF6"))

    # --- August/September: schools
    save("homecoming-arc", sweep("#1E3A8A", "#01BEF6", "HOMECOMING"))
    save("class-of-2027-badge", duo("#1E3A8A", "#01BEF6", "CLASS OF 2027"))
    save("go-team-badge", crest("#06141F", "GAME DAY", accent="#01BEF6"))

    # --- August: National Nonprofit Day
    save("nonprofit-day-badge", crest("#01BEF6", "NONPROFIT STRONG",
                                      text_color="#06141F"))

    # --- Q4 fundraising: Giving Tuesday (Dec 1 2026, seeded early for SEO)
    save("giving-tuesday-badge", crest("#E11D48", "I GAVE"))
    save("giving-tuesday-arc", sweep("#E11D48", "#F97316", "GIVING TUESDAY"))

    # --- Evergreen: the volunteer / supporter set organisations reuse
    save("volunteer-badge", crest("#01BEF6", "VOLUNTEER", text_color="#06141F"))
    save("donor-badge", crest("#DC2626", "BLOOD DONOR"))
    save("supporter-minimal", hairline("#38BDF8", accent="#0369A1"))

    print(f"\n{len(made)} frames written to {out_dir}")
    return made


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="public/frames")
    args = ap.parse_args()
    print("Generating Ollabs frames...")
    build(args.out)
