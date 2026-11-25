"""Dummys collection: every part as an SVG fragment on the shared 1500x1500 base.

Colors are placeholders filled at render time:
  {skin} {skinsh}  skin and its left-side shadow
  {hair} {hairsh}  hair / facial hair
  {c1} {c1sh}      outfit main color and its shadow
  {c2} {c2sh}      outfit second color (bottoms) and shadow
  {ink}            feature color (eyes, brows, mouth), #113F3D in the reference
Geometry is in the coordinates of the blank base reference: face centre x=804,
eyes at (636,477) and (972,477), head top ~y=123, jaw ~y=800.
"""
import json

T = json.load(open('traced.json'))
D = json.load(open('derived.json'))


def P(d, fill, extra=''):
    return f'<path d="{d}" fill="{fill}" fill-rule="evenodd"{extra}/>'


CX, EYE_L, EYE_R, EYE_Y = 804, 636, 972, 477

# ---------------------------------------------------------------- palettes
SKIN = {
    'porcelain': ('#FDD1A9', '#E7AD84'),
    'sand': ('#EDBB8A', '#D49A68'),
    'caramel': ('#C98E5E', '#AC7246'),
    'cinnamon': ('#A86B43', '#8A5332'),
    'cocoa': ('#7A4A2E', '#623821'),
    'espresso': ('#55331F', '#422616'),
}
HAIR = {
    'black': ('#1E1A18', '#0F0D0C'),
    'brown': ('#5A3A26', '#43291A'),
    'honey': ('#C89948', '#A87B32'),
    'ginger': ('#C2622D', '#9E4B1F'),
    'grey': ('#B9BCBD', '#959899'),
    'cyan': ('#01BEF6', '#0098C7'),
    'platinum': ('#ECE3CC', '#CBBE9E'),
    'pink': ('#F27BB0', '#D2558F'),
    'purple': ('#8B5CF6', '#6A3FD1'),
    'blue': ('#2F6FE0', '#1F52AE'),
    'auburn': ('#8C2F1E', '#6E2214'),
}
CLOTH = {
    'green': ('#0A9875', '#057058'),
    'sky': ('#54C0FF', '#2E8FCB'),
    'brown': ('#573F33', '#3B2A21'),
    'denim': ('#3C6FA6', '#2A527D'),
    'red': ('#D63A2F', '#A8281F'),
    'yellow': ('#F5C518', '#C99D0C'),
    'ink': ('#22313B', '#141E25'),
    'white': ('#F2F4F3', '#C9CFCC'),
}

# ---------------------------------------------------------------- base
BASE_LIMBS = P(T['limb_light'], '{skin}') + P(T['limb_shadow'], '{skinsh}')
BASE_HEAD = P(T['head_light'], '{skin}') + P(T['head_shadow'], '{skinsh}')

# ---------------------------------------------------------------- outfits
OUTFITS = {
    'onesie': P(T['onesie'], '{c1}') + P(T['onesie_dark'], '{c1sh}') + P(T['onesie_patch'], '#FFFFFF'),
    'sweater': P(T['pants'], '{c2}') + P(T['pants_dark'], '{c2sh}') + P(D['shoes'], '{ink}')
               + P(T['sweater'], '{c1}') + P(T['sweater_dark'], '{c1sh}'),
    'tee_jeans': P(D['arm_skin'], '{skin}') + P(D['arm_skin_dark'], '{skinsh}')
                 + P(D['jeans'], '{c2}') + P(D['jeans_dark'], '{c2sh}') + P(D['shoes'], '{ink}')
                 + P(D['tee'], '{c1}') + P(D['tee_dark'], '{c1sh}'),
    'tee_shorts': P(D['arm_skin'], '{skin}') + P(D['arm_skin_dark'], '{skinsh}')
                  + P(D['leg_skin'], '{skin}') + P(D['leg_skin_dark'], '{skinsh}')
                  + P(D['shorts'], '{c2}') + P(D['shorts_dark'], '{c2sh}') + P(D['shoes'], '{ink}')
                  + P(D['tee'], '{c1}') + P(D['tee_dark'], '{c1sh}'),
    'dress': P(D['arm_skin'], '{skin}') + P(D['arm_skin_dark'], '{skinsh}')
             + P(D['dress_legs'], '{skin}') + P(D['dress_legs_dark'], '{skinsh}') + P(D['shoes'], '{ink}')
             + P(D['dress'], '{c1}') + P(D['dress_dark'], '{c1sh}') + P(D['dress_belt'], '{c2}'),
    'jersey': P(D['arm_skin'], '{skin}') + P(D['arm_skin_dark'], '{skinsh}')
              + P(D['leg_skin'], '{skin}') + P(D['leg_skin_dark'], '{skinsh}')
              + P(D['shorts'], '{ink}') + P(D['shoes'], '{ink}')
              + P(D['tee'], '{c1}') + P(D['jersey_stripes'], '{c2}') + P(D['tee_dark'], '{c1sh}', ' opacity="0.55"')
              + '<text x="764" y="1000" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="96" '
                'text-anchor="middle" fill="#FFFFFF" stroke="{c1sh}" stroke-width="6" paint-order="stroke">10</text>',
}

# ---------------------------------------------------------------- brows
def brow_pair(lx, ly, rx, ry, w, h, tilt):
    def one(x, y, a):
        return (f'<rect x="{x - w/2}" y="{y - h/2}" width="{w}" height="{h}" rx="{h*0.35}" '
                f'fill="{{ink}}" transform="rotate({a} {x} {y})"/>')
    return one(lx, ly, -tilt) + one(rx, ry, tilt)

BROWS = {
    'none': '',
    'worried': P(T['brows_a'], '{ink}'),
    'straight': brow_pair(EYE_L, 372, EYE_R, 372, 140, 34, 0),
    'cross': brow_pair(EYE_L + 6, 385, EYE_R - 6, 385, 138, 34, 14),
    'raised': brow_pair(EYE_L, 352, EYE_R, 352, 122, 28, -7),
}

# ---------------------------------------------------------------- eyes
def dot(x, y, r=48, hl=True):
    s = f'<circle cx="{x}" cy="{y}" r="{r}" fill="{{ink}}"/>'
    if hl:
        s += f'<circle cx="{x - r*0.36}" cy="{y - r*0.3}" r="{r*0.15}" fill="#FFF3E6"/>'
    return s

def arc_eye(x, y, up=True, w=92):
    sweep = f'M{x - w/2},{y + 12} Q{x},{y - 46} {x + w/2},{y + 12}' if up else f'M{x - w/2},{y - 10} Q{x},{y + 40} {x + w/2},{y - 10}'
    return f'<path d="{sweep}" fill="none" stroke="{{ink}}" stroke-width="20" stroke-linecap="round"/>'

def sleepy(x, y):
    return (dot(x, y, 46, hl=False)
            + f'<rect x="{x - 56}" y="{y - 60}" width="112" height="56" fill="{{skin}}"/>'
            + f'<path d="M{x - 52},{y - 4} L{x + 52},{y - 4}" stroke="{{ink}}" stroke-width="14" stroke-linecap="round"/>')

EYES = {
    'dots': dot(EYE_L, EYE_Y) + dot(EYE_R, EYE_Y),
    'big': (dot(EYE_L, EYE_Y, 62) + dot(EYE_R, EYE_Y, 62)
            + f'<circle cx="{EYE_L + 18}" cy="{EYE_Y + 20}" r="7" fill="#FFF3E6"/>'
            + f'<circle cx="{EYE_R + 18}" cy="{EYE_Y + 20}" r="7" fill="#FFF3E6"/>'),
    'happy': arc_eye(EYE_L, EYE_Y) + arc_eye(EYE_R, EYE_Y),
    'sleepy': sleepy(EYE_L, EYE_Y) + sleepy(EYE_R, EYE_Y),
    'wink': dot(EYE_L, EYE_Y) + arc_eye(EYE_R, EYE_Y),
}

# ---------------------------------------------------------------- mouths
MY = 650
MOUTHS = {
    'none': '',
    'smile': f'<path d="M{CX - 70},{MY - 10} Q{CX},{MY + 50} {CX + 70},{MY - 10}" fill="none" stroke="{{ink}}" stroke-width="18" stroke-linecap="round"/>',
    'grin': (f'<path d="M{CX - 90},{MY - 20} L{CX + 90},{MY - 20} Q{CX + 86},{MY + 70} {CX},{MY + 74} Q{CX - 86},{MY + 70} {CX - 90},{MY - 20}Z" fill="{{ink}}"/>'
             f'<path d="M{CX - 78},{MY - 12} L{CX + 78},{MY - 12} L{CX + 70},{MY + 8} L{CX - 70},{MY + 8}Z" fill="#FFFFFF"/>'
             f'<ellipse cx="{CX}" cy="{MY + 52}" rx="44" ry="18" fill="#E8636B"/>'),
    'flat': f'<path d="M{CX - 50},{MY + 8} L{CX + 50},{MY + 8}" stroke="{{ink}}" stroke-width="18" stroke-linecap="round"/>',
    'oh': f'<ellipse cx="{CX}" cy="{MY + 10}" rx="30" ry="38" fill="{{ink}}"/>',
    'smirk': f'<path d="M{CX - 60},{MY + 12} Q{CX + 10},{MY + 26} {CX + 70},{MY - 18}" fill="none" stroke="{{ink}}" stroke-width="18" stroke-linecap="round"/>',
}

# ---------------------------------------------------------------- facial hair (uses hair color)
FACIAL = {
    'none': '',
    'walrus': P(T['mustache_a'], '{hair}'),
    'pencil': f'<path d="M{CX - 92},{MY - 30} Q{CX - 40},{MY - 58} {CX},{MY - 38} Q{CX + 40},{MY - 58} {CX + 92},{MY - 30} Q{CX + 40},{MY - 40} {CX},{MY - 24} Q{CX - 40},{MY - 40} {CX - 92},{MY - 30}Z" fill="{{hair}}"/>',
    'beard': (f'<g clip-path="url(#headclip)"><path d="M380,520 Q420,560 470,600 Q600,650 {CX},700 Q1010,650 1080,560 L1100,860 L380,860Z" fill="{{hair}}"/>'
              f'<path d="M380,520 Q420,560 470,600 L560,830 L380,860Z" fill="{{hairsh}}"/></g>'
              f'<path d="M{CX - 70},{MY - 4} Q{CX},{MY + 34} {CX + 70},{MY - 4} Q{CX},{MY + 4} {CX - 70},{MY - 4}Z" fill="{{skinsh}}" opacity="0.9"/>'),
    'goatee': f'<path d="M{CX - 60},{MY + 50} Q{CX},{MY + 36} {CX + 60},{MY + 50} Q{CX + 50},{MY + 140} {CX},{MY + 146} Q{CX - 50},{MY + 140} {CX - 60},{MY + 50}Z" fill="{{hair}}"/>',
}

# ---------------------------------------------------------------- hair (second pass)
_H = json.load(open('hair3.json'))
HAIR_FRONT, HAIR_BACK, TALL = _H['front'], _H['back'], _H['tall']
CAP_V3 = _H['cap']
BEANIE_V3, SANTA_V3, TIARA_V3 = _H['beanie'], _H['santa'], _H['tiara']
HIJAB_V3 = _H['hijab']

# ---------------------------------------------------------------- headwear
HATS = {
    'none': '',
    'cap': (f'<g clip-path="url(#headclip)"><path d="M380,40 L1120,40 L1120,262 Q{CX},228 380,292Z" fill="{{c3}}"/></g>'
            '<g clip-path="url(#sideclip)"><path d="M380,40 L1120,40 L1120,262 Q804,228 380,292Z" fill="{c3sh}"/></g>'
            f'<path d="M460,280 Q420,100 760,66 Q1090,80 1075,262 Q{CX},226 460,280Z" fill="{{c3}}" opacity="0"/>'
            '<path d="M520,262 Q800,214 1112,248 Q1140,268 1118,292 Q800,262 520,300 Q500,282 520,262Z" fill="{c3sh}"/>'
            '<path d="M560,264 Q800,226 1090,254" fill="none" stroke="{c3}" stroke-width="10" stroke-linecap="round"/>'
            f'<circle cx="770" cy="150" r="18" fill="{{c3sh}}"/>'),
    'beanie': (f'<path d="M420,300 Q410,110 {CX},90 Q1090,105 1080,290Z" fill="{{c3}}"/>'
               f'<path d="M420,300 Q410,110 {CX - 140},100 Q520,170 505,300Z" fill="{{c3sh}}"/>'
               f'<rect x="405" y="250" width="690" height="92" rx="40" fill="{{c3sh}}"/>'
               f'<circle cx="{CX}" cy="70" r="58" fill="#F2F4F3"/>'),
    'santa': (f'<path d="M430,270 Q520,60 {CX + 60},40 Q1000,50 1150,230 L1060,280Z" fill="#D63A2F"/>'
              f'<path d="M430,270 Q520,60 {CX - 60},48 Q560,140 520,280Z" fill="#A8281F"/>'
              f'<circle cx="1160" cy="250" r="58" fill="#F2F4F3"/>'
              f'<rect x="400" y="235" width="700" height="96" rx="46" fill="#F2F4F3"/>'),
    'hijab': ('<path fill-rule="evenodd" fill="{c3}" d="M418,340 Q400,80 750,58 Q1100,78 1084,340 L1098,700 Q1120,880 985,940 L515,940 Q390,880 408,700Z '
              'M552,306 Q800,196 1046,306 L1050,610 Q996,790 800,800 Q600,790 548,610Z"/>'
              '<g clip-path="url(#leftclip)"><path fill-rule="evenodd" fill="{c3sh}" d="M418,340 Q400,80 750,58 Q1100,78 1084,340 L1098,700 Q1120,880 985,940 L515,940 Q390,880 408,700Z '
              'M552,306 Q800,196 1046,306 L1050,610 Q996,790 800,800 Q600,790 548,610Z"/></g>'
              '<path d="M552,306 Q800,196 1046,306" fill="none" stroke="{c3sh}" stroke-width="14" stroke-linecap="round"/>'),
    'tiara': (
        '<path d="M470,300 L520,170 L600,250 L680,120 L760,240 L804,60 L848,240 L928,120 L1008,250 L1088,170 L1138,300Z" fill="#F5C518"/>'
        '<path d="M470,300 L520,170 L600,250 L620,300Z" fill="#C99D0C"/>'
        '<rect x="450" y="270" width="710" height="64" rx="28" fill="#C99D0C"/>'
        + ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}"/>' for x, y, r, c in [
            (804, 120, 30, '#D00060'), (680, 175, 22, '#01BEF6'), (928, 175, 22, '#01BEF6'),
            (520, 228, 16, '#7E22CE'), (1088, 228, 16, '#7E22CE')])
        + ''.join(f'<circle cx="{x}" cy="302" r="12" fill="#FFF3E6"/>' for x in range(500, 1140, 60))),
}

# ---------------------------------------------------------------- glasses
EYES_PLACEHOLDER = '{eyes_again}'

def frames(kind):
    if kind == 'none':
        return ''
    if kind == 'round':
        g = ''.join(f'<circle cx="{x}" cy="{EYE_Y}" r="86" fill="none" stroke="{{ink}}" stroke-width="16"/>' for x in (EYE_L, EYE_R))
    elif kind == 'square':
        g = ''.join(f'<rect x="{x - 96}" y="{EYE_Y - 72}" width="192" height="144" rx="26" fill="none" stroke="{{ink}}" stroke-width="16"/>' for x in (EYE_L, EYE_R))
    elif kind == 'masquerade':
        mask = (f'<path d="M{EYE_L - 150},{EYE_Y - 40} Q{EYE_L - 60},{EYE_Y - 120} {CX},{EYE_Y - 50} Q{EYE_R + 60},{EYE_Y - 120} {EYE_R + 150},{EYE_Y - 40} '
                f'Q{EYE_R + 130},{EYE_Y + 90} {EYE_R},{EYE_Y + 80} Q{CX + 40},{EYE_Y + 70} {CX},{EYE_Y + 30} Q{CX - 40},{EYE_Y + 70} {EYE_L},{EYE_Y + 80} '
                f'Q{EYE_L - 130},{EYE_Y + 90} {EYE_L - 150},{EYE_Y - 40}Z" fill="#7E22CE"/>')
        holes = ''.join(f'<ellipse cx="{x}" cy="{EYE_Y + 4}" rx="66" ry="52" fill="{{skin}}"/>' for x in (EYE_L, EYE_R))
        trim = ''.join(f'<circle cx="{x}" cy="{y}" r="11" fill="#F5C518"/>' for x, y in [(EYE_L - 120, EYE_Y - 40), (EYE_L - 60, EYE_Y - 85), (CX, EYE_Y - 50), (EYE_R + 60, EYE_Y - 85), (EYE_R + 120, EYE_Y - 40)])
        return mask + holes + trim + EYES_PLACEHOLDER
    else:  # shades
        g = ''.join(f'<path d="M{x - 104},{EYE_Y - 60} L{x + 104},{EYE_Y - 60} Q{x + 100},{EYE_Y + 70} {x},{EYE_Y + 72} Q{x - 100},{EYE_Y + 70} {x - 104},{EYE_Y - 60}Z" fill="{{ink}}"/>'
                    f'<path d="M{x - 70},{EYE_Y - 34} L{x - 30},{EYE_Y - 34}" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="12" stroke-linecap="round"/>' for x in (EYE_L, EYE_R))
    bridge = f'<path d="M{EYE_L + 86},{EYE_Y - 10} Q{CX},{EYE_Y - 40} {EYE_R - 86},{EYE_Y - 10}" fill="none" stroke="{{ink}}" stroke-width="14"/>'
    return g + bridge

HATS['cap'] = CAP_V3
HATS['beanie'] = BEANIE_V3
HATS['santa'] = SANTA_V3
HATS['tiara'] = TIARA_V3
HATS['hijab'] = HIJAB_V3

GLASSES = {k: frames(k) for k in ('none', 'round', 'square', 'shades', 'masquerade')}

BACKGROUNDS = {'none': None, 'paper': '#F7F8F6', 'cyan': '#E4F7FE', 'sage': '#86AA98', 'sun': '#FFE9A8', 'blush': '#FAD4D8'}
