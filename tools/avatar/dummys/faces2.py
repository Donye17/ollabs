"""Second batch of face parts for Dummys: more eyes, mouths, brows, stubble, and face details.

Everything is appended after the existing options so old share links keep their meaning.
"""
import math
from parts import CX, EYE_L, EYE_R, EYE_Y, MY, dot, brow_pair

INK = '{ink}'


def heart(x, y, s, fill):
    return (f'<path d="M{x},{y + s * .9} C{x - s * 1.4},{y - s * .1} {x - s * .9},{y - s * 1.1} {x},{y - s * .45} '
            f'C{x + s * .9},{y - s * 1.1} {x + s * 1.4},{y - s * .1} {x},{y + s * .9}Z" fill="{fill}"/>')


def star(x, y, r, fill):
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * .45
        pts.append(f'{x + rr * math.cos(a):.0f},{y + rr * math.sin(a):.0f}')
    return f'<path d="M{" L".join(pts)}Z" fill="{fill}" stroke="{fill}" stroke-width="8" stroke-linejoin="round"/>'


def chevron(x, y, right):
    d = 1 if right else -1
    return (f'<path d="M{x - 40 * d},{y - 34} L{x + 34 * d},{y} L{x - 40 * d},{y + 34}" fill="none" stroke="{INK}" '
            'stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>')


def lid(x, y, slope):
    """Skin-colored wedge over the top of a dot eye: slope>0 tilts down toward the nose."""
    return (f'<path d="M{x - 70},{y - 70 + slope * -1} L{x + 70},{y - 70 + slope} L{x + 70},{y - 8 + slope} L{x - 70},{y - 8 - slope}Z" '
            'fill="{skin}"/>'
            f'<path d="M{x - 58},{y - 8 - slope * .8} L{x + 58},{y - 8 + slope * .8}" stroke="{INK}" stroke-width="14" stroke-linecap="round"/>')


def lashes(x, y, outer):
    d = -1 if outer == 'left' else 1
    return ''.join(f'<path d="M{x + d * dx},{y - dy} L{x + d * (dx + 22)},{y - dy - 26}" stroke="{INK}" stroke-width="12" stroke-linecap="round"/>'
                   for dx, dy in [(26, 40), (42, 22), (50, 0)])


EYES2 = {
    'laugh': chevron(EYE_L, EYE_Y, True) + chevron(EYE_R, EYE_Y, False),
    'hearts': heart(EYE_L, EYE_Y, 56, '#E23D52') + heart(EYE_R, EYE_Y, 56, '#E23D52'),
    'stars': star(EYE_L, EYE_Y, 60, '#F5B800') + star(EYE_R, EYE_Y, 60, '#F5B800'),
    'angry': dot(EYE_L, EYE_Y + 6) + dot(EYE_R, EYE_Y + 6) + lid(EYE_L, EYE_Y + 6, 22) + lid(EYE_R, EYE_Y + 6, -22),
    'side': (dot(EYE_L + 24, EYE_Y + 4, 44) + dot(EYE_R + 24, EYE_Y + 4, 44)
             + ''.join(f'<rect x="{x - 70}" y="{EYE_Y - 70}" width="160" height="66" fill="{{skin}}"/>'
                       f'<path d="M{x - 50},{EYE_Y - 4} L{x + 76},{EYE_Y - 4}" stroke="{INK}" stroke-width="14" stroke-linecap="round"/>'
                       for x in (EYE_L, EYE_R))),
    'lashes': dot(EYE_L, EYE_Y) + dot(EYE_R, EYE_Y) + lashes(EYE_L, EYE_Y, 'left') + lashes(EYE_R, EYE_Y, 'right'),
}

S = 'stroke-linecap="round" stroke-linejoin="round"'
MOUTHS2 = {
    'tongue': (f'<path d="M{CX - 80},{MY - 14} Q{CX},{MY + 60} {CX + 80},{MY - 14}" fill="none" stroke="{INK}" stroke-width="18" {S}/>'
               f'<path d="M{CX - 4},{MY + 20} L{CX + 60},{MY + 12} Q{CX + 66},{MY + 92} {CX + 24},{MY + 90} Q{CX - 6},{MY + 84} {CX - 4},{MY + 20}Z" fill="#E8636B"/>'
               f'<path d="M{CX + 30},{MY + 34} L{CX + 34},{MY + 66}" stroke="#C94A55" stroke-width="8" stroke-linecap="round"/>'),
    'laugh': (f'<path d="M{CX - 110},{MY - 30} Q{CX},{MY - 46} {CX + 110},{MY - 30} Q{CX + 104},{MY + 104} {CX},{MY + 110} Q{CX - 104},{MY + 104} {CX - 110},{MY - 30}Z" fill="{INK}"/>'
              f'<path d="M{CX - 96},{MY - 24} Q{CX},{MY - 38} {CX + 96},{MY - 24} L{CX + 90},{MY + 2} Q{CX},{MY - 8} {CX - 90},{MY + 2}Z" fill="#FFFFFF"/>'
              f'<ellipse cx="{CX}" cy="{MY + 78}" rx="58" ry="26" fill="#E8636B"/>'),
    'sad': f'<path d="M{CX - 66},{MY + 30} Q{CX},{MY - 22} {CX + 66},{MY + 30}" fill="none" stroke="{INK}" stroke-width="18" {S}/>',
    'teeth': (f'<path d="M{CX - 92},{MY - 18} Q{CX},{MY - 4} {CX + 92},{MY - 18} Q{CX + 70},{MY + 62} {CX},{MY + 64} Q{CX - 70},{MY + 62} {CX - 92},{MY - 18}Z" fill="{INK}"/>'
              f'<path d="M{CX - 80},{MY - 10} Q{CX},{MY + 4} {CX + 80},{MY - 10} Q{CX + 66},{MY + 46} {CX},{MY + 48} Q{CX - 66},{MY + 46} {CX - 80},{MY - 10}Z" fill="#FFFFFF"/>'
              f'<path d="M{CX - 78},{MY + 12} Q{CX},{MY + 26} {CX + 78},{MY + 12}" fill="none" stroke="{INK}" stroke-width="5"/>'),
    'lipstick': (f'<path d="M{CX - 76},{MY + 4} Q{CX - 40},{MY - 30} {CX},{MY - 14} Q{CX + 40},{MY - 30} {CX + 76},{MY + 4} '
                 f'Q{CX + 40},{MY + 48} {CX},{MY + 50} Q{CX - 40},{MY + 48} {CX - 76},{MY + 4}Z" fill="#C8324A"/>'
                 f'<path d="M{CX - 70},{MY + 4} Q{CX},{MY + 20} {CX + 70},{MY + 4}" fill="none" stroke="#7E1A2C" stroke-width="7" stroke-linecap="round"/>'
                 f'<ellipse cx="{CX + 28}" cy="{MY + 30}" rx="16" ry="6" fill="#FFFFFF" opacity="0.4"/>'),
}

BROWS2 = {
    'angry': brow_pair(EYE_L + 10, 392, EYE_R - 10, 392, 150, 40, 22),
    'thick': brow_pair(EYE_L, 368, EYE_R, 368, 164, 54, 0),
}

FACIAL2 = {
    'stubble': ('<g clip-path="url(#headclip)" opacity="0.32">'
                f'<path d="M380,560 Q430,600 480,630 Q600,700 {CX},730 Q1010,700 1090,600 L1100,860 L380,860Z" fill="{{hair}}"/>'
                f'<path d="M{CX - 110},{MY - 40} Q{CX},{MY - 70} {CX + 110},{MY - 40} L{CX + 110},{MY - 10} Q{CX},{MY - 36} {CX - 110},{MY - 10}Z" fill="{{hair}}"/></g>'),
}

CHEEK_L, CHEEK_R, CHEEK_Y = 590, 1010, 600


def freckles():
    pts = [(-40, -10), (-10, 8), (20, -14), (44, 12), (-24, 30), (10, 34)]
    return ''.join(f'<circle cx="{cx + dx * sgn}" cy="{CHEEK_Y + dy}" r="12" fill="#3B1F10" opacity="0.3"/>'
                   for cx, sgn in ((CHEEK_L, 1), (CHEEK_R - 16, -1)) for dx, dy in pts)


DETAILS = {
    'none': '',
    'freckles': freckles(),
    'blush': ''.join(f'<ellipse cx="{x}" cy="{CHEEK_Y + 10}" rx="66" ry="36" fill="#F06A7E" opacity="0.38"/>' for x in (CHEEK_L, CHEEK_R)),
    'beauty_mark': f'<circle cx="{CX + 120}" cy="{MY - 40}" r="11" fill="{INK}"/>',
    'face_paint': ''.join(f'<path d="M{x - 52},{CHEEK_Y - 10} L{x + 52},{CHEEK_Y - 24}" stroke="#16A34A" stroke-width="24" stroke-linecap="round"/>'
                          f'<path d="M{x - 52},{CHEEK_Y + 26} L{x + 52},{CHEEK_Y + 12}" stroke="#F5C518" stroke-width="24" stroke-linecap="round"/>'
                          for x in (CHEEK_L, CHEEK_R)),
    'bandaid': (f'<g transform="rotate(-24 {CHEEK_R} {CHEEK_Y - 20}) translate({CHEEK_R} {CHEEK_Y - 20}) scale(1.35) translate({-CHEEK_R} {-(CHEEK_Y - 20)})">'
                f'<rect x="{CHEEK_R - 70}" y="{CHEEK_Y - 46}" width="140" height="52" rx="22" fill="#F2C9A0"/>'
                f'<rect x="{CHEEK_R - 24}" y="{CHEEK_Y - 46}" width="48" height="52" fill="#E2B184"/>'
                + ''.join(f'<circle cx="{CHEEK_R + dx}" cy="{CHEEK_Y - 20 + dy}" r="4" fill="#C9966A"/>' for dx in (-48, -38, 38, 48) for dy in (-10, 10))
                + '</g>'),
}
