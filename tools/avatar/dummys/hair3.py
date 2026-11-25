"""Hair, third pass: every style is built from the head's own shape.

Method: take the head silhouette from the base art, grow it outward by an
exact thickness (morphological dilation), cut a hairline into it, and trace
the result to a vector path. Hair therefore hugs the head with consistent
thickness and overlaps the head edge, so there are no seams.

Shading: the head's left side (its shadow plane) continues outward; any hair
on that side is drawn in the darker hair tone, the same way the head shades.
"""
import cv2, numpy as np, json, math

REF_BASE = 'reference/base.png'
W = 1500
Y, X = np.mgrid[0:W, 0:W]


def _load(p):
    return cv2.cvtColor(cv2.imread(p), cv2.COLOR_BGR2RGB).astype(int)


def _m(im, cols, tol=34):
    out = np.zeros(im.shape[:2], bool)
    for h in cols:
        c = np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)])
        out |= (np.abs(im - c).sum(2) < tol)
    return out


B = _load(REF_BASE)
LIGHT = _m(B, ['#FDD1A9', '#FBD0A7', '#FDDCBE', '#FEE8D4']) & (Y < 805)
SHADOW = _m(B, ['#E7AD84', '#E9B087', '#E6B18A']) & (Y < 820)
HEAD = cv2.morphologyEx((LIGHT | SHADOW).astype(np.uint8), cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8)).astype(bool)

# Shadow side: for each row, everything left of where the lit face begins.
_side = np.zeros((W, W), bool)
for y in range(150, 700):
    xs = np.where(SHADOW[min(y, 819)])[0] if y < 820 else np.where(SHADOW[819])[0]
    if len(xs):
        _side[y, :xs.max() + 1] = True
_side[700:, :] = False
_side[700:, :540] = True
_x0 = np.where(SHADOW[170])[0].max()
for y in range(0, 170):
    _side[y, :max(0, int(_x0 - (170 - y) * 0.35))] = True
SIDE = cv2.GaussianBlur(_side.astype(np.uint8) * 255, (0, 0), 6) > 127


def grow(mask, r):
    if r <= 0:
        return mask.copy()
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
    return cv2.dilate(mask.astype(np.uint8), k).astype(bool)


def smooth(mask, r=6):
    """Round off steps and corners so traced paths come out soft."""
    m = cv2.GaussianBlur(mask.astype(np.uint8) * 255, (0, 0), r)
    return m > 127


def poly(points):
    m = np.zeros((W, W), np.uint8)
    cv2.fillPoly(m, [np.array(points, np.int32)], 1)
    return m.astype(bool)


def curve(p0, p1, p2, n=40):
    """Quadratic Bezier sampled to points."""
    return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
             (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]) for t in np.linspace(0, 1, n)]


def above(points):
    """Everything above a left-to-right polyline (the hairline)."""
    pts = [(-50, points[0][1])] + list(points) + [(W + 50, points[-1][1]), (W + 50, -50), (-50, -50)]
    return poly(pts)


def circle(cx, cy, r):
    return (X - cx) ** 2 + (Y - cy) ** 2 <= r * r


def trace(mask, eps=1.0, minarea=60, step=14):
    """Trace a mask to smooth curves: resample the outline, then fit Catmull-Rom splines as cubic Beziers."""
    mk = mask.astype(np.uint8) * 255
    cs, _ = cv2.findContours(mk, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    d = []
    for c in cs:
        if cv2.contourArea(c) < minarea:
            continue
        pts = c.reshape(-1, 2).astype(float)
        # moving average around the closed outline removes pixel stair-steps
        k = 9
        pad = np.concatenate([pts[-k:], pts, pts[:k]])
        ker = np.ones(2 * k + 1) / (2 * k + 1)
        pts = np.stack([np.convolve(pad[:, 0], ker, 'valid'), np.convolve(pad[:, 1], ker, 'valid')], 1)
        n = max(6, len(pts) // step)
        idx = np.linspace(0, len(pts), n, endpoint=False).astype(int)
        p = pts[idx]
        m = len(p)
        q = []  # absolute control points, rounded, so relative steps never drift
        for i in range(m):
            p0, p1, p2, p3 = p[(i - 1) % m], p[i], p[(i + 1) % m], p[(i + 2) % m]
            q.append((np.rint(p1 + (p2 - p0) / 6), np.rint(p2 - (p3 - p1) / 6), np.rint(p2)))
        cur = np.rint(p[0])
        seg = [f'M{cur[0]:.0f} {cur[1]:.0f}c']
        parts = []
        for c1, c2, e in q:
            a, b, c = c1 - cur, c2 - cur, e - cur
            parts.append(' '.join(f'{v:.0f}' for v in (a[0], a[1], b[0], b[1], c[0], c[1])))
            cur = e
        seg.append(' '.join(parts).replace(' -', '-'))
        d.append(''.join(seg) + 'z')
    return ' '.join(d)


def paint(mask, lit='{hair}', dark='{hairsh}'):
    """Hair shape in two tones: lit, and darker on the head's shadow side."""
    mask = smooth(mask, 4)
    return (f'<path d="{trace(mask)}" fill="{lit}" fill-rule="evenodd"/>'
            f'<path d="{trace(mask & SIDE)}" fill="{dark}" fill-rule="evenodd"/>')


def flat(mask, fill='{hairsh}'):
    mask = smooth(mask, 3)
    return f'<path d="{trace(mask)}" fill="{fill}" fill-rule="evenodd"/>'


# ------------------------------------------------------------------ hairlines
# Short hairline: high on the forehead, rounding down into tapered sideburns.
SHORT_LINE = ([(300, 440), (418, 414), (440, 412), (454, 392), (466, 330)] +
              curve((466, 330), (480, 285), (560, 262)) +
              curve((560, 262), (800, 205), (1000, 248)) +
              curve((1000, 248), (1046, 268), (1050, 330)) +
              [(1052, 392), (1062, 412), (1200, 440)])
# Sideburns are part of the hairline now; kept as empty masks for older call sites.
SIDEBURN_L = np.zeros((W, W), bool)
SIDEBURN_R = np.zeros((W, W), bool)

# Long hairline: centre part with the hair swept to both temples.
LONG_LINE = (curve((300, 640), (500, 600), (512, 520)) +
             curve((512, 520), (520, 300), (806, 205)) +
             curve((806, 205), (1040, 290), (1046, 520)) +
             curve((1046, 520), (1050, 600), (1200, 640)))

# Fringe for the bob: blunt and level with the brows' top.
BOB_LINE = [(300, 340), (520, 338), (1060, 334), (1200, 334)]


def short_cap(thick):
    return grow(HEAD, thick) & (above(SHORT_LINE) | SIDEBURN_L | SIDEBURN_R)


def top_volume(thick_top, thick_side, ybreak=300):
    """Outline grown thickly on top and thinly at the sides, blended."""
    a = grow(HEAD, thick_side)
    b = grow(HEAD, thick_top) & (Y < ybreak)
    return smooth(a | b, 14)


def build():
    F, Bk = {}, {}
    F['bald'] = ''

    F['buzz'] = paint(short_cap(12))

    # Crop: fuller on top with a short, choppy fringe falling onto the forehead.
    fringe_pts = [(300, 470), (430, 430), (470, 300)]
    xs = np.linspace(500, 1050, 13)
    for i, x in enumerate(xs):
        fringe_pts.append((x, 300 + (26 if i % 2 else 0) + (8 if 3 < i < 9 else 0)))
    fringe_pts += [(1048, 296), (1048, 430), (1200, 470)]
    F['crop'] = paint(top_volume(40, 14) & (above(fringe_pts) | SIDEBURN_L | SIDEBURN_R))

    # Swoop: crop with a quiff that rises at the front and sweeps right.
    quiff = poly([(p[0], p[1]) for p in curve((470, 330), (540, 40), (900, 60))] +
                 [(p[0], p[1]) for p in curve((900, 60), (1110, 80), (1062, 250))] +
                 [(1000, 245), (760, 215), (560, 262), (470, 330)])
    F['swoop'] = paint((top_volume(30, 14) & (above(SHORT_LINE) | SIDEBURN_L | SIDEBURN_R)) | smooth(quiff, 10))

    # Bun: hair slicked back (no fringe volume), bun on top with a darker tie.
    bun = circle(760, 88, 82)
    F['bun'] = (paint(short_cap(16) | bun)
                + '<path d="M694,150 Q760,170 826,150" fill="none" stroke="{hairsh}" stroke-width="16" stroke-linecap="round"/>')

    # Curly: clusters of round curls over the crown, each with a shadow crescent.
    F['curly'] = paint(grow(HEAD, 10) & (above(SHORT_LINE) | SIDEBURN_L | SIDEBURN_R)) + curl_cluster()
    Bk['curly'] = flat(grow(HEAD, 34) & (Y < 360))

    # Afro: a big rounded mass with a softly scalloped edge, behind the head.
    mass = np.zeros((W, W), bool)
    base = circle(745, 420, 380)
    mass |= base
    for a in np.linspace(-math.pi - 0.15, 0.15, 26):
        mass |= circle(745 + 372 * math.cos(a), 420 + 372 * math.sin(a), 40)
    mass &= (Y < 700)
    Bk['afro'] = paint(mass, lit='{hair}', dark='{hairsh}')
    F['afro'] = paint(short_cap(10))

    # Puffs: short cap and two scalloped puffs high on each side.
    def puff(cx, cy, r):
        m = circle(cx, cy, r)
        for a in np.linspace(0, 2 * math.pi, 14, endpoint=False):
            m |= circle(cx + r * math.cos(a), cy + r * math.sin(a), r * 0.26)
        return m
    puffs = puff(420, 190, 118) | puff(1080, 190, 118)
    F['puffs'] = (paint(short_cap(12) | puffs)
                  + '<rect x="476" y="246" width="70" height="38" rx="18" fill="#D63A2F" transform="rotate(-42 511 265)"/>'
                  + '<rect x="1016" y="246" width="70" height="38" rx="18" fill="#D63A2F" transform="rotate(42 1051 265)"/>')

    # Long: hair falls from the crown to below the shoulders.
    back_long = smooth(grow(HEAD, 26) | poly([(400, 330), (1095, 330), (1110, 960), (1060, 1000), (450, 1000), (395, 960)]), 18)
    Bk['long'] = flat(back_long & ~grow(HEAD, 0) | (back_long & (Y > 805)))
    lock_l = poly(curve((398, 400), (380, 700), (440, 990)) + curve((540, 990), (500, 700), (524, 520)) + [(512, 420)])
    lock_r = poly(curve((1098, 400), (1120, 700), (1080, 990)) + curve((990, 990), (1030, 700), (1040, 520)) + [(1050, 420)])
    F['long'] = (paint((grow(HEAD, 26) & above(LONG_LINE)) | smooth(lock_l | lock_r, 10))
                 + '<path d="M806,206 L806,248" stroke="{hairsh}" stroke-width="10" stroke-linecap="round"/>')

    # Bob: chin length with a blunt fringe; the sides frame the face.
    back_bob = smooth(grow(HEAD, 28) & (Y < 800), 18)
    Bk['bob'] = flat(back_bob)
    face = smooth(poly([(528, 340), (1046, 336), (1046, 760), (980, 800), (600, 800), (528, 760)]), 8)
    F['bob'] = paint((back_bob & ~face) & (above(BOB_LINE) | ~face))

    # Braids: plaits hang behind the head; a fuller crown covers where they start.
    Bk['braids'] = (flat(back_long & ~grow(HEAD, 0) | (back_long & (Y > 805)))
                    + ''.join(plait(x, 380, 1000, w) for x, w in [(412, 46), (458, 44), (1056, 42), (1090, 42)]))
    braid_crown = smooth(grow(HEAD, 50) & above(LONG_LINE), 6)
    F['braids'] = (paint(braid_crown)
                   + '<path d="M806,206 L806,248" stroke="{hairsh}" stroke-width="10" stroke-linecap="round"/>')
    return F, Bk


def curl_cluster():
    """Round curls in two rows following the crown, drawn back to front."""
    out = ''
    rows = [(330, 300, 250, 13, 66), (300, 270, 190, 10, 60)]  # (cy, rx, ry, count, r)
    curls = []
    for cy, rx, ry, n, r in rows:
        for i in range(n):
            t = math.pi * (0.03 + 0.94 * i / (n - 1))
            curls.append((748 - rx * math.cos(t), cy - ry * math.sin(t), r))
    curls.sort(key=lambda c: c[1])
    for x, y, r in curls:
        shade = '{hairsh}' if x < 560 else '{hair}'
        out += (f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r}" fill="{shade}"/>'
                f'<path d="M{x - r * 0.62:.0f},{y + r * 0.1:.0f} A{r * 0.66:.0f},{r * 0.66:.0f} 0 0 0 {x + r * 0.5:.0f},{y + r * 0.5:.0f}" '
                f'fill="none" stroke="{{hairsh}}" stroke-width="{r * 0.2:.0f}" stroke-linecap="round" opacity="0.8"/>')
    return out


def plait(x, y0, y1, w):
    """A box braid: a rounded strand with an alternating weave, ending in a bead."""
    h = y1 - y0
    out = (f'<rect x="{x - w / 2:.0f}" y="{y0}" width="{w}" height="{h}" rx="{w / 2:.0f}" fill="{{hair}}"/>'
           f'<rect x="{x - w / 2:.0f}" y="{y0}" width="{w * 0.38:.0f}" height="{h}" rx="{w * 0.19:.0f}" fill="{{hairsh}}" opacity="0.55"/>')
    y, i = y0 + 16, 0
    while y < y1 - 14:
        d = 1 if i % 2 else -1
        out += (f'<path d="M{x - w * 0.34:.0f},{y + 9 * d:.0f} Q{x:.0f},{y - 8 * d:.0f} {x + w * 0.34:.0f},{y + 9 * d:.0f}" '
                f'fill="none" stroke="{{hairsh}}" stroke-width="6" stroke-linecap="round"/>')
        y += 30
        i += 1
    out += (f'<rect x="{x - w * 0.42:.0f}" y="{y1 - 6}" width="{w * 0.84:.0f}" height="22" rx="10" fill="#F5C518"/>'
            f'<path d="M{x - w * 0.3:.0f},{y1 + 16} L{x - w * 0.36:.0f},{y1 + 40} M{x:.0f},{y1 + 16} L{x:.0f},{y1 + 44} M{x + w * 0.3:.0f},{y1 + 16} L{x + w * 0.36:.0f},{y1 + 40}" '
            f'stroke="{{hair}}" stroke-width="10" stroke-linecap="round"/>')
    return out


def build2():
    """Second batch of styles, appended after the first eleven."""
    F, Bk = {}, {}

    # Ponytail: slicked back, tail hanging behind the head on the far side.
    F['ponytail'] = (paint(short_cap(16))
                     + '<path d="M600,250 Q720,200 860,214 M560,300 Q700,236 900,236" fill="none" stroke="{hairsh}" stroke-width="9" stroke-linecap="round" opacity="0.6"/>')
    tail = smooth(poly(curve((470, 250), (330, 330), (360, 620)) + curve((360, 620), (380, 780), (470, 860))
                       + curve((470, 860), (430, 700), (450, 560)) + curve((450, 560), (470, 400), (520, 330))), 10)
    Bk['ponytail'] = (paint(tail) + '<rect x="440" y="258" width="78" height="44" rx="20" fill="{hairsh}" transform="rotate(-30 479 280)"/>')

    # Locs: rope-like strands from the crown to the chest, ringed texture.
    def loc(x0, y0, x1, y1, w):
        out = (f'<path d="M{x0},{y0} Q{(x0 + x1) / 2 + (x1 - x0) * .2:.0f},{(y0 + y1) / 2:.0f} {x1},{y1}" fill="none" '
               f'stroke="{{hair}}" stroke-width="{w}" stroke-linecap="round"/>')
        for t in np.linspace(.12, .92, 7):
            x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * ((x0 + x1) / 2 + (x1 - x0) * .2) + t * t * x1
            y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * ((y0 + y1) / 2) + t * t * y1
            out += f'<path d="M{x - w * .42:.0f},{y:.0f} Q{x:.0f},{y + 10:.0f} {x + w * .42:.0f},{y:.0f}" fill="none" stroke="{{hairsh}}" stroke-width="6" stroke-linecap="round"/>'
        return out
    Bk['locs'] = ''.join(loc(x, 320, x + dx, 900 + dy, 62) for x, dx, dy in
                         [(424, -30, 10), (482, -14, 60), (1010, 16, 50), (1070, 30, 0)])
    Bk['locs'] = flat(smooth(grow(HEAD, 34) & (Y < 430), 8)) + Bk['locs']
    F['locs'] = (paint(smooth(grow(HEAD, 36) & above(LONG_LINE), 6))
                 + loc(520, 330, 486, 880, 58) + loc(1040, 330, 1084, 860, 58)
                 + '<path d="M806,206 L806,248" stroke="{hairsh}" stroke-width="10" stroke-linecap="round"/>')

    # Twists: short two-strand twists packed over the crown, pointing up and out.
    tw = ''
    spots = []
    for cy, rx, ry, n in [(380, 330, 250, 14), (360, 250, 210, 11), (350, 150, 190, 7), (340, 40, 175, 2)]:
        for i in range(n):
            t = math.pi * (0.03 + 0.94 * i / max(1, n - 1))
            spots.append((748 - rx * math.cos(t), cy - ry * math.sin(t)))
    spots = [(x, y) for x, y in spots if y < 250 or x < 500 or x > 1010]
    spots.sort(key=lambda p: p[1])
    for x, y in spots:
        ang = 0.45 * (math.degrees(math.atan2(y - 560, x - 748)) + 90)
        fill = '{hairsh}' if x < 540 else '{hair}'
        tw += (f'<g transform="rotate({ang:.0f} {x:.0f} {y:.0f})"><rect x="{x - 26:.0f}" y="{y - 52:.0f}" width="52" height="104" rx="26" fill="{fill}"/>'
               f'<path d="M{x - 18:.0f},{y - 28:.0f} L{x + 18:.0f},{y - 10:.0f} M{x - 18:.0f},{y + 6:.0f} L{x + 18:.0f},{y + 24:.0f}" stroke="{{hairsh}}" stroke-width="7" stroke-linecap="round"/></g>')
    F['twists'] = paint(grow(HEAD, 16) & above(SHORT_LINE)) + tw

    # Mohawk: a crest of spikes along the top, faded sides.
    crest = smooth(grow(HEAD, 20) & (X > 650) & (X < 920) & (Y < 260), 6)
    for x0, h in [(670, 120), (730, 170), (790, 190), (850, 160), (905, 110)]:
        crest |= poly([(x0 - 44, 200), (x0 + 6, 160 - h), (x0 + 48, 200)])
    F['mohawk'] = (f'<path d="{trace(smooth(short_cap(8), 3))}" fill="{{hair}}" opacity="0.35"/>'
                   + paint(smooth(crest, 5)))

    # Side part: neat top with a soft wave swept across the forehead.
    wave = poly(curve((480, 330), (520, 180), (700, 160)) + curve((700, 160), (1000, 150), (1050, 300))
                + curve((1050, 300), (900, 250), (760, 300)) + curve((760, 300), (640, 340), (560, 290)) + [(500, 340)])
    F['sidepart'] = (paint((top_volume(34, 14) & above(SHORT_LINE)) | smooth(wave, 10))
                     + '<path d="M600,170 Q620,220 640,250" fill="none" stroke="{hairsh}" stroke-width="12" stroke-linecap="round"/>')

    # Pixie: close-cropped with a wispy fringe flicking to the side.
    fringe = poly([(470, 300), (520, 210), (700, 180), (1000, 220), (1046, 300), (980, 300), (940, 350), (880, 300),
                   (820, 380), (760, 310), (690, 390), (640, 300), (560, 330)])
    F['pixie'] = paint((grow(HEAD, 18) & above(SHORT_LINE)) | smooth(fringe, 4))

    # Mullet: short on top, long at the back.
    F['mullet'] = paint(top_volume(30, 14) & above(SHORT_LINE))
    Bk['mullet'] = flat(smooth(poly([(410, 360), (1086, 360), (1100, 760), (1060, 900), (440, 900), (400, 760)]), 30) & ~HEAD)

    # Balding: hair only round the sides, shine on top.
    F['balding'] = (paint(short_cap(14) & ((Y > 300) | (X < 500) | (X > 1020)))
                    + '<path d="M650,190 Q760,150 860,170" fill="none" stroke="#FFFFFF" stroke-width="18" stroke-linecap="round" opacity="0.25"/>')

    # Coily: short, dense natural hair with a soft bumpy outline.
    cm = grow(HEAD, 22) & above(SHORT_LINE)
    for a in np.linspace(-math.pi - 0.25, 0.25, 30):
        cm |= circle(748 + 330 * math.cos(a), 470 + 340 * math.sin(a), 22) & (Y < 440)
    cm = smooth(cm & grow(HEAD, 40), 3)
    spk = ''.join(f'<path d="M{x},{y} q12,-14 24,0" fill="none" stroke="{{hairsh}}" stroke-width="7" stroke-linecap="round" opacity="0.7"/>'
                  for x, y in [(560, 230), (640, 180), (720, 160), (800, 165), (880, 185), (960, 230), (600, 290), (700, 230), (820, 220), (930, 280), (520, 300), (1000, 290)])
    F['coily'] = paint(cm) + spk
    return F, Bk


ORDER2 = ['ponytail', 'locs', 'twists', 'mohawk', 'sidepart', 'pixie', 'mullet', 'balding', 'coily']
ORDER = ['bald', 'buzz', 'swoop', 'curly', 'bun', 'long', 'crop', 'afro', 'puffs', 'bob', 'braids']


CXH = 780  # hats centre slightly toward the face, which turns right


def arc(yc, sag, hw=340):
    """y of a band edge that wraps the head: lowest at the front centre."""
    return yc - sag * ((X - CXH) / hw) ** 2


# hats are rounder than hair: shade a crescent on the left, as if lit from the upper right
HATSIDE = (((X - 860) / 400.0) ** 2 + ((Y - 520) / 640.0) ** 2) > 1
HATSIDE &= X < 800


def lit(mask, fill, shade, r=3):
    return (f'<path d="{trace(mask)}" fill="{fill}"/>'
            f'<path d="{trace(smooth(mask & HATSIDE, r))}" fill="{shade}"/>')


def pompom(cx, cy, r, edge=None):
    ring = f' stroke="{edge}" stroke-width="7"' if edge else ''
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#F2F4F3"{ring}/>'
            f'<path d="M{cx - r * .55:.0f},{cy - r * .83:.0f} A{r},{r} 0 0 0 {cx - r * .55:.0f},{cy + r * .83:.0f} '
            f'A{r * 1.1:.0f},{r * 1.1:.0f} 0 0 1 {cx - r * .55:.0f},{cy - r * .83:.0f}Z" fill="#D9DFDD"/>')


def cap():
    """Baseball cap: six-panel crown grown from the head, brim projecting toward the face."""
    crown = smooth(grow(HEAD, 40) & (Y < arc(292, 34)), 6)
    out = lit(crown, '{c3}', '{c3sh}')
    out += ('<path d="M790,86 Q700,150 650,276 M790,86 Q880,150 930,270" fill="none" stroke="{c3sh}" '
            'stroke-width="9" stroke-linecap="round" opacity="0.6"/>')
    out += '<circle cx="790" cy="90" r="22" fill="{c3sh}"/>'
    # front panel highlight
    out += '<path d="M720,150 Q790,120 860,150" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" opacity="0.18"/>'
    # brim: visible top surface, longer on the side the face turns to
    brim = smooth(poly(curve((520, 262), (800, 312), (1150, 262))
                       + curve((1150, 262), (1200, 300), (1130, 340))
                       + curve((1130, 340), (820, 400), (530, 312))
                       + [(505, 290)]), 6)
    shadow = smooth(poly(curve((560, 300), (820, 390), (1080, 330)) + curve((1080, 330), (820, 430), (570, 330))), 6)
    out += f'<path d="{trace(shadow)}" fill="#000000" opacity="0.14"/>'
    out += f'<path d="{trace(brim)}" fill="{{c3sh}}"/>'
    top = smooth(brim & (Y < arc(318, 40, 380)) , 4)
    out += f'<path d="{trace(top)}" fill="{{c3}}"/>'
    return out


def beanie():
    """Knitted beanie: dome plus a ribbed cuff that wraps the head, pompom on top."""
    dome = smooth(grow(HEAD, 40) & (Y < arc(262, 40)), 6)
    cuff = smooth(grow(HEAD, 48) & (Y >= arc(236, 40)) & (Y < arc(338, 46)), 8)
    out = lit(dome, '{c3}', '{c3sh}')
    for x in range(520, 1080, 56):
        top = 150 if 620 < x < 980 else 196
        out += (f'<path d="M{x},{top} Q{x + (x - CXH) * .06:.0f},{(top + 250) / 2:.0f} {x + (x - CXH) * .1:.0f},{arc(244, 40)[0, 0] * 0 + 240 - 40 * ((x - CXH) / 340) ** 2:.0f}" '
                'fill="none" stroke="{c3sh}" stroke-width="8" stroke-linecap="round" opacity="0.35"/>')
    out += lit(cuff, '{c3}', '{c3sh}')
    # cuff ribs and the fold line
    for x in range(482, 1100, 46):
        t = 240 - 40 * ((x - CXH) / 340) ** 2
        b = 334 - 46 * ((x - CXH) / 340) ** 2
        out += f'<path d="M{x},{t + 14:.0f} L{x},{b - 10:.0f}" stroke="{{c3sh}}" stroke-width="8" stroke-linecap="round" opacity="0.3"/>'
    out += f'<path d="{trace(smooth(cuff & ~(Y > arc(250, 40)), 2))}" fill="#000000" opacity="0.12"/>'
    out += pompom(800, 92, 62, '{c3sh}')
    return out


def santa():
    """Santa hat: the cone flops over to the right and hangs beside the head; fluffy fur band."""
    cone = smooth(poly(curve((430, 290), (440, 20), (820, 22))
                       + curve((820, 22), (1230, 14), (1222, 404))
                       + [(1190, 436), (1100, 424)]
                       + curve((1100, 424), (1060, 230), (930, 205))
                       + [(1000, 260), (1040, 300)]), 8)
    dome = smooth(grow(HEAD, 40) & (Y < 300), 6)
    tail = smooth(cone & ~dome & (X > 1010) & (Y > 120), 4)
    out = lit(cone, '#D63A2F', '#A8281F')
    out += f'<path d="{trace(tail)}" fill="#B8302A"/>'
    out += '<path d="M960,150 Q1130,160 1150,380" fill="none" stroke="#E5554A" stroke-width="12" stroke-linecap="round" opacity="0.6"/>'
    out += pompom(1162, 448, 64)
    band = grow(HEAD, 44) & (Y >= arc(232, 40)) & (Y < arc(318, 44))
    for x in range(450, 1100, 40):  # fluffy edges
        yb = 318 - 44 * ((x - CXH) / 340) ** 2
        yt = 232 - 40 * ((x - CXH) / 340) ** 2
        band |= circle(x, yb, 24) | circle(x + 20, yt, 20)
    band = smooth(band & grow(HEAD, 62), 4)
    out += f'<path d="{trace(band)}" fill="#F2F4F3"/>'
    out += f'<path d="{trace(smooth(band & (Y > arc(292, 44)), 3))}" fill="#E2E7E5"/>'
    return out


def tiara():
    """Tiara: a gold band that follows the curve of the head with five peaks; sits on the hair."""
    c, hw = CXH + 10, 280
    yb = lambda x: 262 - 44 * ((x - c) / hw) ** 2
    peaks = [(-1.0, 50), (-.62, 96), (-.28, 134), (0, 196), (.28, 134), (.62, 96), (1.0, 50)]
    pts = []
    for i, (t, h) in enumerate(peaks):
        x = c + t * hw
        if i:
            xm = (pts[-1][0] + x) / 2
            pts.append((xm, yb(xm) - 22))
        pts.append((x, yb(x) - h))
    crown = smooth(poly(pts + [(c + hw + 8, yb(c + hw) + 30)] + [(x, yb(x) + 42) for x in np.linspace(c + hw, c - hw, 20)] + [(c - hw - 8, yb(c - hw) + 30)]), 3)
    band = smooth(poly([(x, yb(x) - 8) for x in np.linspace(c - hw - 6, c + hw + 6, 24)]
                       + [(x, yb(x) + 42) for x in np.linspace(c + hw + 6, c - hw - 6, 24)]), 3)
    out = lit(crown, '#F5C518', '#C99D0C')
    out += f'<path d="{trace(band)}" fill="#E0AE10"/>'
    out += f'<path d="{trace(smooth(band & HATSIDE, 2))}" fill="#B88A08"/>'
    for t, h in peaks:  # gems at the tips
        x = c + t * hw
        r = 32 if t == 0 else 21 if abs(t) < .5 else 15
        col = '#D00060' if t == 0 else '#01BEF6' if abs(t) < .5 else '#7E22CE'
        out += f'<circle cx="{x:.0f}" cy="{yb(x) - h + r + 18:.0f}" r="{r}" fill="{col}"/>'
        out += f'<circle cx="{x - r * .35:.0f}" cy="{yb(x) - h + r * .65 + 18:.0f}" r="{max(3, r * .3):.0f}" fill="#FFFFFF" opacity="0.7"/>'
    for x in np.linspace(c - hw + 18, c + hw - 18, 13):
        out += f'<circle cx="{x:.0f}" cy="{yb(x) + 17:.0f}" r="11" fill="#FFF3E6"/>'
    return out


def hijab():
    """Hijab: wraps the head and drapes over the shoulders, open around the face."""
    drape = poly(curve((430, 520), (380, 760), (450, 920)) + curve((450, 920), (775, 1010), (1100, 920)) + curve((1100, 920), (1150, 760), (1080, 520)))
    outer = smooth(grow(HEAD, 54) | drape, 12)
    opening = smooth(poly(curve((552, 306), (800, 196), (1046, 306)) + [(1050, 600)]
                          + curve((1050, 600), (1000, 796), (800, 804))
                          + curve((800, 804), (600, 796), (548, 600))), 6)
    scarf = outer & ~opening
    out = lit(scarf, '{c3}', '{c3sh}', 4)
    # under-scarf edge around the face, a chin wrap and a fold on the shaded side
    out += ('<path d="M549,440 L552,306 Q800,196 1046,306 L1049,440" fill="none" stroke="{c3sh}" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"/>'
            '<path d="M560,760 Q800,900 1080,690" fill="none" stroke="{c3sh}" stroke-width="12" stroke-linecap="round" opacity="0.55"/>'
            '<path d="M470,560 Q470,760 560,930" fill="none" stroke="{c3sh}" stroke-width="12" stroke-linecap="round" opacity="0.45"/>'
            '<path d="M760,90 Q960,110 1040,240" fill="none" stroke="#FFFFFF" stroke-width="14" stroke-linecap="round" opacity="0.14"/>')
    return out


if __name__ == '__main__':
    F, Bk = build()
    F2, Bk2 = build2()
    F.update(F2); Bk.update(Bk2)
    F = {k: F[k] for k in ORDER + ORDER2}  # fixed order keeps share codes stable
    json.dump({'front': F, 'back': Bk, 'tall': ['swoop', 'curly', 'bun', 'afro', 'puffs', 'crop', 'mohawk', 'twists', 'sidepart'], 'cap': cap(), 'beanie': beanie(), 'santa': santa(), 'tiara': tiara(), 'hijab': hijab()}, open('hair3.json', 'w'))
    print({k: len(v) for k, v in F.items()})
