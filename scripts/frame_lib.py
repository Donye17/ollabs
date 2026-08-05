#!/usr/bin/env python3
"""
Ollabs frame drawing library.

The primitives here exist because the obvious way to draw a profile frame
(PIL's ellipse outline + a rounded rectangle) produces something that reads as
a UI component pasted onto a photo. The difference between that and a frame
someone actually leaves on their profile comes down to four things:

  1. TAPER.      Bands that thin toward their ends read as designed strokes.
                 Blunt 90-degree cuts read as clipping errors.
  2. ANGULAR     Colour that travels along the arc's own path, not left-to-right
     GRADIENT.   across the canvas. A linear gradient on a curve always looks
                 arbitrary because the axis has nothing to do with the shape.
  3. SEPARATION. A soft shadow under the frame so it sits above the photo.
                 Without it the frame and the face occupy the same plane.
  4. NESTING.    Breaking the ring and setting the mark into the gap, instead of
                 stacking a disc on top of an unbroken ring. Nesting looks
                 intentional; stacking looks like a sticker.

Everything is drawn in a 4x supersampled space and downsampled with LANCZOS.
"""

import math

from PIL import Image, ImageDraw, ImageFilter

SIZE = 1024
SS = 4
C = SIZE * SS // 2
R = SIZE * SS // 2


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def mix(c1, c2, t):
    return tuple(int(c1[k] + (c2[k] - c1[k]) * t) for k in range(3))


def shade(c, f):
    return tuple(max(0, min(255, int(v * f))) for v in c)


def new_canvas():
    return Image.new("RGBA", (SIZE * SS, SIZE * SS), (0, 0, 0, 0))


def finish(img):
    return img.resize((SIZE, SIZE), Image.LANCZOS)


# ------------------------------------------------------------------ geometry

def bezier(p0, p1, p2, p3, steps=120):
    out = []
    for i in range(steps + 1):
        t = i / steps
        u = 1 - t
        out.append((
            u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0],
            u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1],
        ))
    return out


def _taper(t, mode):
    """Width multiplier along a band, t in 0..1."""
    if mode == "none":
        return 1.0
    if mode == "both":
        # ease in and out, staying full through the middle 60%
        e = min(t, 1 - t) * 2          # 0 at ends, 1 at centre
        return math.sin(min(e / 0.4, 1.0) * math.pi / 2) ** 0.9
    if mode == "end":
        return math.sin(min((1 - t) / 0.5, 1.0) * math.pi / 2) ** 0.9
    return 1.0


def tapered_arc(img, radius, width, a0_deg, a1_deg, c1, c2=None,
                taper="both", segments=260, alpha=255):
    """
    A band following a circular arc, drawn as a strip of quads so that colour
    can travel along the arc (angular gradient) and width can vary (taper).
    Rounded caps are added at both ends when tapering is off.
    """
    d = ImageDraw.Draw(img, "RGBA")
    c2 = c2 or c1
    a0, a1 = math.radians(a0_deg), math.radians(a1_deg)
    prev = None
    for i in range(segments + 1):
        t = i / segments
        a = a0 + (a1 - a0) * t
        w = width * _taper(t, taper)
        ca, sa = math.cos(a), math.sin(a)
        outer = (C + (radius + w / 2) * ca, C + (radius + w / 2) * sa)
        inner = (C + (radius - w / 2) * ca, C + (radius - w / 2) * sa)
        if prev is not None:
            col = mix(c1, c2, t) + (alpha,)
            d.polygon([prev[0], outer, inner, prev[1]], fill=col)
        prev = (outer, inner)

    if taper == "none":
        for t, a in ((0.0, a0), (1.0, a1)):
            ca, sa = math.cos(a), math.sin(a)
            cx, cy = C + radius * ca, C + radius * sa
            r = width / 2
            d.ellipse([cx - r, cy - r, cx + r, cy + r],
                      fill=mix(c1, c2, t) + (alpha,))
    return img


def ring(img, radius, width, color, alpha=255):
    d = ImageDraw.Draw(img, "RGBA")
    d.ellipse([C - radius, C - radius, C + radius, C + radius],
              outline=color + (alpha,), width=int(width))
    return img


def ring_gap(img, radius, width, color, gap_center=90, gap_deg=0, c2=None):
    """A ring with an optional wedge removed, for nesting a mark into."""
    if gap_deg <= 0:
        return ring(img, radius, width, color)
    a0 = gap_center + gap_deg / 2
    a1 = gap_center - gap_deg / 2 + 360
    return tapered_arc(img, radius, width, a0, a1, color, c2 or color,
                       taper="none", segments=560)


def drop_shadow(base, layer, blur=14, dy=6, alpha=70):
    """Composite `layer` onto `base` with a soft shadow beneath it."""
    a = layer.split()[3]
    sh = Image.new("RGBA", base.size, (0, 0, 0, 0))
    sh.putalpha(a.point(lambda v: int(v * alpha / 255)))
    sh = sh.filter(ImageFilter.GaussianBlur(blur * SS / 4))
    base.alpha_composite(sh, (0, int(dy * SS / 4)))
    base.alpha_composite(layer)
    return base


# ------------------------------------------------------------------- ribbon

def _offset_edges(pts, half):
    """Offset a polyline by +/- half along its normals."""
    left, right = [], []
    for i, p in enumerate(pts):
        q = pts[min(i + 1, len(pts) - 1)]
        o = pts[max(i - 1, 0)]
        dx, dy = q[0] - o[0], q[1] - o[1]
        n = math.hypot(dx, dy) or 1
        nx, ny = -dy / n, dx / n
        left.append((p[0] + nx * half, p[1] + ny * half))
        right.append((p[0] - nx * half, p[1] - ny * half))
    return left, right


def ribbon(img, cx, cy, h, color, thickness=0.30):
    """
    A properly built awareness ribbon: a strip of constant width folded into a
    loop, with flat angled cuts at the tails. Drawn as filled polygons rather
    than strokes, because a stroked polyline cannot give you the angled tail cut
    that makes it read as ribbon rather than as wire.

    `cy` is the crossing point; the loop rises to `cy - h`.
    """
    half = h * thickness / 2
    # A ribbon loop is a narrow teardrop, not a circle. Too much bulge and the
    # two strands close into an O; the fold stops reading entirely.
    w = h * 0.40
    tl = h * 0.62
    tw = h * 0.36
    apex = h * 0.045

    def strand(tail_x, bulge_x, apex_dx):
        pts = bezier((cx + tail_x, cy + tl),
                     (cx + tail_x * 0.42, cy + tl * 0.40),
                     (cx + bulge_x * 0.10, cy + h * 0.12), (cx, cy), 44)
        # control points kept high so the loop stays tall and narrow, and the
        # strands converge hard at the apex instead of meeting side by side
        pts += bezier((cx, cy), (cx + bulge_x, cy - h * 0.34),
                      (cx + bulge_x * 0.86, cy - h * 0.92), (cx + apex_dx, cy - h), 96)
        return pts

    a = strand(tw, -w, -apex)     # right tail, bulges left
    b = strand(-tw, w, apex)      # left tail, bulges right

    d = ImageDraw.Draw(img, "RGBA")
    dark = shade(color, 0.74) + (255,)
    for pts, col in ((a, dark), (b, color + (255,))):
        le, ri = _offset_edges(pts, half)
        d.polygon(le + ri[::-1], fill=col)
        # round the apex end so the fold reads soft
        ax, ay = pts[-1]
        d.ellipse([ax - half, ay - half, ax + half, ay + half], fill=col)
        # flat angled cut at the tail, the detail that sells it as ribbon
        tx, ty = pts[0]
        nx, ny = le[0][0] - tx, le[0][1] - ty
        cut = half * 0.9
        d.polygon([le[0], ri[0],
                   (ri[0][0] - nx * 0.15 + cut * 0.2, ri[0][1] + cut),
                   (le[0][0] - nx * 0.15 + cut * 0.2, le[0][1] + cut)], fill=col)
    return img


# --------------------------------------------------------------------- type

def tracked_text(d, xy, text, font, fill, track=0.0, anchor_mid=True):
    letters = list(text)
    widths = [d.textlength(ch, font=font) for ch in letters]
    total = sum(widths) + track * (len(letters) - 1)
    x = xy[0] - total / 2 if anchor_mid else xy[0]
    asc, desc = font.getmetrics()
    y = xy[1] - (asc - desc) / 2
    for ch, cw in zip(letters, widths):
        d.text((x, y), ch, font=font, fill=fill)
        x += cw + track
    return total


def arc_text(img, text, font, radius, color, center_deg=90, spread=1.14,
             flip=False):
    """Set type along an arc. Angles run right-to-left so it reads correctly."""
    d = ImageDraw.Draw(img)
    letters = list(text)
    total = sum(d.textlength(ch, font=font) for ch in letters)
    span = total / radius * spread
    start = math.radians(center_deg) + span / 2
    tile = int(font.size * 2.4)
    for i, ch in enumerate(letters):
        cw = d.textlength(ch, font=font)
        frac = sum(d.textlength(x, font=font) for x in letters[:i]) + cw / 2
        a = start - (frac / total) * span
        x = C + radius * math.cos(a)
        y = C + radius * math.sin(a)
        gl = Image.new("RGBA", (tile, tile), (0, 0, 0, 0))
        ImageDraw.Draw(gl).text((tile / 2, tile / 2), ch, font=font,
                                fill=color, anchor="mm")
        gl = gl.rotate(math.degrees(-a) + (270 if flip else 90),
                       resample=Image.BICUBIC)
        img.alpha_composite(gl, (int(x - tile / 2), int(y - tile / 2)))
    return math.degrees(span)
