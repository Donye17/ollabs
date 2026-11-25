"""Hair, second pass.

Every style is built from the head's own outline:
  - the part on the head is clipped to the head (url(#headclip)),
  - the shaded side is the same shape clipped to the head's shadow side (url(#sideclip)),
  - volume beyond the head follows the head's top contour, pushed outward.
Head top contour (base coords): x450 y207, 500 174, 600 141, 700 123, 800 127,
900 148, 1000 185, 1050 231; sides at x~424 (left) and ~1063 (right).
"""
import math

CX = 804


def on_head(shape, fill='{hair}', shade='{hairsh}'):
    """A shape painted onto the head, darker where the head turns away."""
    return (f'<g clip-path="url(#headclip)"><path d="{shape}" fill="{fill}"/></g>'
            f'<g clip-path="url(#sideclip)"><path d="{shape}" fill="{shade}"/></g>')


# Hairline: high at the centre, curving down into sideburns at both temples.
HAIRLINE_SHORT = 'M300,40 L1160,40 L1160,470 L1075,470 Q1055,330 985,262 Q900,215 800,212 Q690,214 600,250 Q520,300 505,470 L300,470Z'
HAIRLINE_LONG = 'M300,40 L1160,40 L1160,560 L1068,560 Q1050,330 980,258 Q900,205 806,200 L806,200 Q700,205 610,255 Q525,310 510,560 L300,560Z'


def dome(push, fill='{hair}', ytop_extra=0):
    """Volume above the head: the top contour pushed outward by `push` px."""
    pts = [(424, 330), (440, 230), (470, 180), (520, 145), (600, 110), (700, 92), (800, 95), (900, 112), (1000, 150), (1050, 196), (1075, 260), (1068, 330)]
    cx, cy = 750, 360
    out = []
    for x, y in pts:
        dx, dy = x - cx, y - cy
        n = math.hypot(dx, dy)
        out.append((x + dx / n * push, y + dy / n * push - ytop_extra))
    d = f'M{out[0][0]:.0f},{out[0][1]:.0f} ' + ' '.join(
        f'Q{out[i][0]:.0f},{out[i][1]:.0f} {(out[i][0] + out[i + 1][0]) / 2:.0f},{(out[i][1] + out[i + 1][1]) / 2:.0f}' for i in range(1, len(out) - 1)
    ) + f' L{out[-1][0]:.0f},{out[-1][1]:.0f} Q790,300 {out[0][0]:.0f},{out[0][1]:.0f}Z'
    return d


def volume(d):
    """Hair mass beyond the head; its left part falls on the shadow side."""
    return (f'<path d="{d}" fill="{{hair}}"/>'
            f'<path d="{d}" fill="{{hairsh}}" clip-path="url(#leftclip)"/>')


def curls(n, r, push, start=0.02, end=0.98, cy=360, rx=360, ry=290):
    s = ''
    for i in range(n):
        t = math.pi * (start + (end - start) * i / (n - 1))
        x = 748 - rx * math.cos(t)
        y = cy - ry * math.sin(t)
        s += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r}" fill="{{hair}}"/>'
    return s


def braid_strand(x, y0, y1, w=38):
    segs = ''
    y = y0
    while y < y1:
        segs += f'<ellipse cx="{x}" cy="{y + 22}" rx="{w / 2}" ry="26" fill="{{hair}}"/>'
        segs += f'<path d="M{x - w / 2 + 6},{y + 30} Q{x},{y + 40} {x + w / 2 - 6},{y + 30}" fill="none" stroke="{{hairsh}}" stroke-width="6" stroke-linecap="round"/>'
        y += 40
    return segs



HAIR_BACK = {
    'curly': f'<path d="{dome(64)}" fill="{{hairsh}}"/>',
    'afro': ('<circle cx="748" cy="350" r="338" fill="{hair}"/>'
             + ''.join(f'<circle cx="{748 + 334*math.cos(a):.0f}" cy="{350 + 334*math.sin(a):.0f}" r="46" fill="{{hair}}"/>' for a in [i*math.pi/14 for i in range(-14, 1)])
             + '<g clip-path="url(#leftclip)"><circle cx="748" cy="350" r="338" fill="{hairsh}" opacity="0.45"/></g>'),
    'long': ('<path d="M420,300 Q400,130 800,90 Q1110,120 1090,300 L1110,900 Q1100,980 1020,990 L590,990 Q480,985 470,900Z" fill="{hairsh}"/>'),
    'braids': ('<path d="M420,300 Q400,130 800,90 Q1110,120 1090,300 L1100,960 L470,960Z" fill="{hairsh}"/>'
               + ''.join(braid_strand(x, 360, 940, 40) for x in (520, 1000))),
    'bob': '<path d="M410,320 Q400,120 800,88 Q1120,115 1095,320 L1110,720 Q1100,790 1030,790 L560,790 Q480,790 470,720Z" fill="{hairsh}"/>',
    'puffs': '<circle cx="410" cy="200" r="150" fill="{hairsh}"/><circle cx="1110" cy="200" r="150" fill="{hairsh}"/>',
}

HAIR_FRONT = {
    'bald': '',
    'buzz': on_head(HAIRLINE_SHORT),
    'swoop': (on_head(HAIRLINE_SHORT)
              + '<path d="M505,300 Q470,150 640,96 Q800,48 960,82 Q1068,110 1070,200 Q1072,236 1060,262 Q960,206 860,198 Q720,196 600,240 Q540,262 505,300Z" fill="{hair}"/>'
              + '<path d="M505,300 Q470,150 640,96 Q575,160 560,250 Q530,270 505,300Z" fill="{hairsh}"/>'
              + '<path d="M680,140 Q820,100 960,126 M720,186 Q840,156 950,170" fill="none" stroke="{hairsh}" stroke-width="11" stroke-linecap="round"/>'),
    'curly': on_head(HAIRLINE_SHORT) + curls(13, 70, 0, cy=345, rx=335, ry=262),
    'bun': (volume(dome(14)) + on_head(HAIRLINE_SHORT) +
            '<circle cx="800" cy="52" r="96" fill="{hair}"/><path d="M712,40 Q800,-30 888,40" fill="none" stroke="{hairsh}" stroke-width="12" stroke-linecap="round"/>'
            '<rect x="730" y="128" width="140" height="26" rx="13" fill="{hairsh}"/>'),
    'long': (on_head(HAIRLINE_LONG)
             + '<path d="M806,198 L806,250" stroke="{hairsh}" stroke-width="12" stroke-linecap="round"/>'
             + '<path d="M425,330 Q400,600 430,960 L520,960 Q500,640 515,470 Q505,380 470,330Z" fill="{hairsh}"/>'
             + '<path d="M1063,330 Q1110,620 1075,960 L995,960 Q1030,650 1040,470 Q1050,380 1063,330Z" fill="{hair}"/>'),
    'crop': volume(dome(26)) + on_head(HAIRLINE_SHORT),
    'afro': on_head(HAIRLINE_SHORT),
    'puffs': (on_head(HAIRLINE_SHORT)
              + '<circle cx="410" cy="200" r="132" fill="{hair}"/><circle cx="1110" cy="200" r="132" fill="{hair}"/>'
              + '<rect x="470" y="250" width="70" height="40" rx="18" fill="#D63A2F" transform="rotate(-40 505 270)"/>'
              + '<rect x="1060" y="250" width="70" height="40" rx="18" fill="#D63A2F" transform="rotate(40 1095 270)"/>'),
    'bob': (on_head('M300,40 L1160,40 L1160,620 L1068,620 Q1062,340 1030,326 L540,326 Q514,360 512,620 L300,620Z')
            + '<path d="M430,330 Q410,600 450,780 L540,780 Q510,600 520,420Z" fill="{hairsh}"/>'
            + '<path d="M1060,330 Q1100,600 1060,780 L990,780 Q1030,600 1045,420Z" fill="{hair}"/>'),
    'braids': (on_head(HAIRLINE_LONG)
               + '<path d="M806,198 L806,250" stroke="{hairsh}" stroke-width="12" stroke-linecap="round"/>'
               + braid_strand(452, 330, 1000, 50) + braid_strand(500, 380, 960, 46)
               + braid_strand(1060, 330, 1000, 50) + braid_strand(1012, 380, 960, 46)),
}

TALL = ['swoop', 'curly', 'bun', 'afro', 'puffs', 'crop']
