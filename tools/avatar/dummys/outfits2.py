"""Second batch of Dummys outfits, built from the traced tee, sweater, jeans and shorts shapes
so every new garment fits the base body. Also: pattern overlays and per-outfit top masks.

Colors: {c1}/{c1sh} main garment, {c2}/{c2sh} second garment (usually the bottoms).
"""
import numpy as np
from hair3 import trace, smooth, poly, circle, X, Y
from bodymask import pmask, SRC

TEE, TEE_D = pmask('tee'), pmask('tee_dark')
SW, SW_D = pmask('sweater'), pmask('sweater_dark')
JEANS, JEANS_D = pmask('jeans'), pmask('jeans_dark')
SHORTS, SHORTS_D = pmask('shorts'), pmask('shorts_dark')
PANTS, PANTS_D = pmask('pants'), pmask('pants_dark')
ARM = pmask('arm_skin')
NECK_X = 760


def P(d, fill, extra=''):
    return f'<path d="{d}" fill="{fill}" fill-rule="evenodd"{extra}/>'


def M(mask, fill, extra='', r=2):
    return f'<path d="{trace(smooth(mask, r) if r else mask)}" fill="{fill}" fill-rule="evenodd"{extra}/>'


def garment(mask, dark, c='{c1}', csh='{c1sh}'):
    return M(mask, c) + M(mask & dark, csh)


SHOES = P(SRC['shoes'], '{ink}')
ARMS = P(SRC['arm_skin'], '{skin}') + P(SRC['arm_skin_dark'], '{skinsh}')
LEGS = P(SRC['leg_skin'], '{skin}') + P(SRC['leg_skin_dark'], '{skinsh}')
JEANS_C2 = P(SRC['jeans'], '{c2}') + P(SRC['jeans_dark'], '{c2sh}')
SHORTS_C2 = P(SRC['shorts'], '{c2}') + P(SRC['shorts_dark'], '{c2sh}')
PANTS_C2 = P(SRC['pants'], '{c2}') + P(SRC['pants_dark'], '{c2sh}')


def buttons(x, ys, fill, r=9):
    return ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>' for y in ys)


# ------------------------------------------------------------------ shapes
TORSO_TOP = 790
vneck = poly([(NECK_X - 80, TORSO_TOP), (NECK_X, 900), (NECK_X + 80, TORSO_TOP)])
collar_pts_l = poly([(NECK_X - 96, 808), (NECK_X - 6, 846), (NECK_X - 64, 880)])
collar_pts_r = poly([(NECK_X + 96, 808), (NECK_X + 6, 846), (NECK_X + 64, 880)])

# tank: tee body without the sleeves; upper arms show as skin
tank_body = TEE & poly([(600, 790), (640, 790), (700, 880), (820, 880), (880, 790), (920, 790), (900, 960), (930, 1100), (590, 1100), (620, 960)])
upper_arms = TEE & ~tank_body & ~poly([(600, 760), (920, 760), (920, 840), (600, 840)])

OUT = {}
TOPS = {}   # outfit -> top garment mask, for pattern overlays

# Hoodie
hood = smooth(poly([(NECK_X - 190, 812), (NECK_X - 150, 770), (NECK_X + 150, 770), (NECK_X + 190, 812), (NECK_X + 120, 860), (NECK_X - 120, 860)]), 12)
pocket = smooth(poly([(640, 1040), (660, 960), (860, 960), (880, 1040)]), 6)
OUT['hoodie'] = (PANTS_C2 + SHOES + garment(SW, SW_D) + M(hood, '{c1sh}')
                 + f'<path d="{trace(smooth(pocket, 4))}" fill="none" stroke="{{c1sh}}" stroke-width="10"/>'
                 + f'<path d="M{NECK_X - 40},850 L{NECK_X - 44},940 M{NECK_X + 40},850 L{NECK_X + 44},930" stroke="#F2F4F3" stroke-width="9" stroke-linecap="round"/>')
TOPS['hoodie'] = SW

# Jacket: open zip jacket over a white tee
inner = SW & poly([(NECK_X - 56, 790), (NECK_X + 56, 790), (NECK_X + 46, 1100), (NECK_X - 46, 1100)])
OUT['jacket'] = (JEANS_C2 + SHOES + garment(SW & ~inner, SW_D) + M(inner, '#F2F4F3')
                 + M(smooth(collar_pts_l | collar_pts_r, 3) & SW, '{c1sh}')
                 + f'<path d="M{NECK_X - 56},860 L{NECK_X - 48},1090 M{NECK_X + 56},860 L{NECK_X + 48},1090" stroke="{{c1sh}}" stroke-width="10" stroke-linecap="round"/>')
TOPS['jacket'] = SW & ~inner

# Overalls: c1 overalls over a c2 tee
bib = smooth(poly([(650, 905), (870, 905), (880, 1060), (640, 1060)]), 6)
straps = poly([(612, 830), (650, 820), (690, 920), (650, 920)]) | poly([(908, 830), (870, 820), (830, 920), (870, 920)])
OUT['overalls'] = (P(SRC['jeans'], '{c1}') + P(SRC['jeans_dark'], '{c1sh}') + SHOES + ARMS
                   + garment(TEE, TEE_D, '{c2}', '{c2sh}') + M(bib | straps & TEE, '{c1}') + M((bib | straps) & TEE_D, '{c1sh}')
                   + buttons(668, [920], '#F5C518', 13) + buttons(852, [920], '#F5C518', 13)
                   + '<rect x="715" y="955" width="90" height="62" rx="10" fill="none" stroke="{c1sh}" stroke-width="8"/>')
TOPS['overalls'] = TEE & ~(bib | straps)

# Button-up shirt
OUT['buttonup'] = (PANTS_C2 + SHOES + garment(SW, SW_D) + M(collar_pts_l | collar_pts_r, '#F2F4F3', r=2)
                   + f'<path d="M{NECK_X},860 L{NECK_X},1094" stroke="{{c1sh}}" stroke-width="8"/>'
                   + buttons(NECK_X + 16, [900, 960, 1020, 1076], '#F2F4F3'))
TOPS['buttonup'] = SW

# Tank top with shorts
OUT['tank'] = (LEGS + SHORTS_C2 + SHOES + ARMS + M(upper_arms, '{skin}') + M(upper_arms & TEE_D, '{skinsh}')
               + garment(tank_body, TEE_D))
TOPS['tank'] = tank_body

# Suit and tie: c1 suit, c2 tie, white shirt
shirt_v = SW & poly([(NECK_X - 70, 790), (NECK_X + 70, 790), (NECK_X, 980)])
tie = poly([(NECK_X - 18, 830), (NECK_X + 18, 830), (NECK_X + 28, 950), (NECK_X, 985), (NECK_X - 28, 950)])
knot = poly([(NECK_X - 24, 808), (NECK_X + 24, 808), (NECK_X + 16, 838), (NECK_X - 16, 838)])
lapel_l = poly([(NECK_X - 70, 790), (NECK_X - 110, 800), (NECK_X - 70, 900), (NECK_X, 980)])
lapel_r = poly([(NECK_X + 70, 790), (NECK_X + 110, 800), (NECK_X + 70, 900), (NECK_X, 980)])
OUT['suit'] = (P(SRC['pants'], '{c1}') + P(SRC['pants_dark'], '{c1sh}') + SHOES + garment(SW & ~shirt_v, SW_D)
               + M(lapel_l | lapel_r, '{c1sh}', r=1) + M(shirt_v, '#F2F4F3') + M(tie, '{c2}', r=1) + M(knot, '{c2sh}', r=1)
               + buttons(NECK_X, [1010, 1060], '{c1sh}', 11))
TOPS['suit'] = SW & ~shirt_v

# Beach: open-collar short-sleeve shirt with flower print, board shorts
flowers = ''
for x, y in [(600, 880), (690, 960), (860, 880), (930, 980), (640, 1030), (820, 1010), (560, 980), (950, 860)]:
    flowers += ''.join(f'<circle cx="{x + 16 * np.cos(a):.0f}" cy="{y + 16 * np.sin(a):.0f}" r="13" fill="#F2F4F3"/>' for a in np.linspace(0, 2 * np.pi, 5, endpoint=False))
    flowers += f'<circle cx="{x}" cy="{y}" r="9" fill="#F5C518"/>'
OUT['beach'] = (LEGS + SHORTS_C2 + SHOES + ARMS + garment(TEE & ~vneck, TEE_D)
                + f'<g clip-path="url(#topclip)">{flowers}</g>' + M(vneck & TEE, '{skin}', r=1)
                + M((collar_pts_l | collar_pts_r) & TEE, '{c1sh}', r=1)
                + '<path d="M600,1060 L600,1180 M920,1060 L920,1180" stroke="#F2F4F3" stroke-width="14"/>')
TOPS['beach'] = TEE & ~vneck

# Flannel: plaid button-up (pattern built in), jeans
plaid = ''.join(f'<rect x="480" y="{y}" width="560" height="34" fill="{{c1sh}}" opacity="0.75"/>' for y in range(800, 1100, 96))
plaid += ''.join(f'<rect x="{x}" y="780" width="34" height="330" fill="{{c1sh}}" opacity="0.55"/>' for x in range(500, 1040, 96))
plaid += ''.join(f'<rect x="480" y="{y}" width="560" height="8" fill="{{c2}}"/>' for y in range(845, 1100, 96))
OUT['flannel'] = (JEANS_C2 + SHOES + garment(SW, SW_D) + f'<g clip-path="url(#topclip)">{plaid}</g>'
                  + M(collar_pts_l | collar_pts_r, '{c1sh}', r=2) + buttons(NECK_X + 14, [900, 960, 1020, 1076], '#F2F4F3', 8))
TOPS['flannel'] = SW

# Scrubs: v-neck top and matching trousers, chest pocket
OUT['scrubs'] = (P(SRC['pants'], '{c1}') + P(SRC['pants_dark'], '{c1sh}') + SHOES + ARMS + garment(TEE & ~vneck, TEE_D)
                 + M(vneck & TEE, '{skin}', r=1)
                 + f'<path d="M{NECK_X - 80},{TORSO_TOP} L{NECK_X},900 L{NECK_X + 80},{TORSO_TOP}" fill="none" stroke="{{c1sh}}" stroke-width="10" stroke-linejoin="round"/>'
                 + '<rect x="840" y="900" width="80" height="70" rx="8" fill="none" stroke="{c1sh}" stroke-width="8"/>')
TOPS['scrubs'] = TEE & ~vneck

# Chef: white double-breasted coat, c1 neckerchief, c2 trousers
OUT['chef'] = (PANTS_C2 + SHOES + garment(SW, SW_D, '#F2F4F3', '#C9CFCC')
               + M(smooth(poly([(NECK_X - 90, 800), (NECK_X + 90, 800), (NECK_X + 40, 880), (NECK_X - 40, 880)]), 6), '{c1}')
               + buttons(NECK_X - 40, [920, 980, 1040], '{ink}', 10) + buttons(NECK_X + 70, [920, 980, 1040], '{ink}', 10))
TOPS['chef'] = SW

ORDER = ['hoodie', 'jacket', 'overalls', 'buttonup', 'tank', 'suit', 'beach', 'flannel', 'scrubs', 'chef']

# Tops of the original six outfits (for pattern overlays)
TOPS0 = {'onesie': pmask('onesie'), 'sweater': SW, 'tee_jeans': TEE, 'tee_shorts': TEE, 'jersey': TEE, 'dress': pmask('dress')}

# ------------------------------------------------------------------ pattern overlays (drawn inside the top's clip)
PATTERNS = {
    'none': '',
    'stripes': ''.join(f'<rect x="470" y="{y}" width="580" height="26" fill="{{c2}}"/>' for y in range(820, 1240, 58)),
    'dots': ''.join(f'<circle cx="{x + (30 if (y // 60) % 2 else 0)}" cy="{y}" r="14" fill="{{c2}}"/>'
                    for y in range(820, 1240, 60) for x in range(480, 1060, 60)),
    'plaid': (''.join(f'<rect x="470" y="{y}" width="580" height="30" fill="{{c2}}" opacity="0.55"/>' for y in range(810, 1240, 90))
              + ''.join(f'<rect x="{x}" y="780" width="30" height="460" fill="{{c2}}" opacity="0.45"/>' for x in range(490, 1060, 90))),
    'stars': ''.join(f'<path d="M{x},{y - 18} L{x + 6},{y - 6} L{x + 18},{y - 4} L{x + 9},{y + 5} L{x + 11},{y + 18} L{x},{y + 11} L{x - 11},{y + 18} L{x - 9},{y + 5} L{x - 18},{y - 4} L{x - 6},{y - 6}Z" fill="{{c2}}"/>'
                     for y in range(840, 1240, 80) for x in range(500 + (40 if (y // 80) % 2 else 0), 1060, 80)),
}


def top_paths():
    """outfit -> [clip path, shadow path] for the pattern layer."""
    out = {}
    for k, m in {**TOPS0, **TOPS}.items():
        out[k] = [trace(smooth(m, 1)), trace(smooth(m & (TEE_D | SW_D | pmask('onesie_dark') | pmask('dress_dark')), 2))]
    return out
