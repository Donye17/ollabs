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
        seg = [f'M{p[0][0]:.1f},{p[0][1]:.1f}']
        for i in range(m):
            p0, p1, p2, p3 = p[(i - 1) % m], p[i], p[(i + 1) % m], p[(i + 2) % m]
            c1 = p1 + (p2 - p0) / 6
            c2 = p2 - (p3 - p1) / 6
            seg.append(f'C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}')
        d.append(' '.join(seg) + 'Z')
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


ORDER = ['bald', 'buzz', 'swoop', 'curly', 'bun', 'long', 'crop', 'afro', 'puffs', 'bob', 'braids']


def cap():
    """Baseball cap grown from the head, so it covers any hair under it."""
    capline = curve((300, 300), (800, 238), (1200, 262))
    crown = smooth(grow(HEAD, 56) & above(capline), 4)
    out = (f'<path d="{trace(crown)}" fill="{{c3}}"/>'
           f'<path d="{trace(smooth(crown & SIDE, 3))}" fill="{{c3sh}}"/>')
    # seams on the crown and a button on top
    out += '<path d="M770,96 Q690,170 640,262 M770,96 Q860,170 900,250" fill="none" stroke="{c3sh}" stroke-width="9" stroke-linecap="round" opacity="0.7"/>'
    out += '<circle cx="770" cy="100" r="20" fill="{c3sh}"/>'
    # brim: a band across the forehead, longer on the lit side
    out += '<path d="M500,276 Q800,218 1120,246 Q1158,266 1132,298 Q800,270 500,310 Q470,292 500,276Z" fill="{c3sh}"/>'
    out += '<path d="M540,280 Q800,236 1100,258" fill="none" stroke="{c3}" stroke-width="10" stroke-linecap="round" opacity="0.6"/>'
    return out


def beanie():
    """Knitted beanie grown from the head, with a folded cuff and a pompom."""
    dome = smooth(grow(HEAD, 58) & (Y < 300), 6)
    cuff = smooth(grow(HEAD, 66) & (Y >= 250) & (Y < 345), 8)
    out = (f'<path d="{trace(dome)}" fill="{{c3}}"/>'
           f'<path d="{trace(smooth(dome & SIDE, 3))}" fill="{{c3sh}}"/>')
    # knit ribs on the dome
    for x in range(540, 1060, 64):
        out += f'<path d="M{x},{120 if 640 < x < 960 else 170} L{x + 6},262" stroke="{{c3sh}}" stroke-width="8" stroke-linecap="round" opacity="0.45"/>'
    out += (f'<path d="{trace(cuff)}" fill="{{c3sh}}"/>'
            '<circle cx="760" cy="64" r="58" fill="#F2F4F3"/>')
    return out


def santa():
    """Santa hat: the cone flops to the right; the fur band covers any hairstyle."""
    cone = smooth(poly(curve((380, 300), (470, 30), (820, 34)) + curve((820, 34), (1060, 40), (1180, 236)) + [(1120, 300)]), 8)
    band = smooth(grow(HEAD, 64) & (Y >= 232) & (Y < 334), 10)
    out = (f'<path d="{trace(cone)}" fill="#D63A2F"/>'
           f'<path d="{trace(smooth(cone & SIDE, 3))}" fill="#A8281F"/>'
           '<circle cx="1186" cy="250" r="56" fill="#F2F4F3"/>'
           f'<path d="{trace(band)}" fill="#F2F4F3"/>'
           f'<path d="{trace(smooth(band & SIDE, 3))}" fill="#DDE2E0"/>')
    return out


if __name__ == '__main__':
    F, Bk = build()
    F = {k: F[k] for k in ORDER}  # fixed order keeps share codes stable
    json.dump({'front': F, 'back': Bk, 'tall': ['swoop', 'curly', 'bun', 'afro', 'puffs', 'crop'], 'cap': cap(), 'beanie': beanie(), 'santa': santa()}, open('hair3.json', 'w'))
    print({k: len(v) for k, v in F.items()})
