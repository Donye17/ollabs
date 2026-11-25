"""Dummys extras: accessories, hand props, pets, second batch of headwear, scene backgrounds.

Accessory and pet fragments may hold two layers separated by <!--L-->:
the first is drawn behind the head (necklaces), the second on top (earrings, headphones).
"""
import math
import numpy as np
from hair3 import (HEAD, X, Y, grow, smooth, poly, curve, circle, trace, arc, lit, pompom, CXH)

L = '<!--L-->'
GOLD, GOLDSH = '#F5C518', '#C99D0C'

# ------------------------------------------------------------------ accessories
EAR_L, EAR_R, EAR_Y = 446, 1060, 600


def hoop(x, y, r):
    return f'<circle cx="{x}" cy="{y + r}" r="{r}" fill="none" stroke="{GOLD}" stroke-width="10"/>'


chain_pts = ' '.join(f'{640 + 240 * t:.0f},{812 + 70 * math.sin(math.pi * t):.0f}' for t in np.linspace(0, 1, 13))
ACCESSORIES = {
    'none': '',
    'studs': L + f'<circle cx="{EAR_L}" cy="{EAR_Y}" r="15" fill="{GOLD}"/><circle cx="{EAR_R}" cy="{EAR_Y}" r="15" fill="{GOLD}"/>',
    'hoops': L + hoop(EAR_L, EAR_Y - 6, 34) + hoop(EAR_R, EAR_Y - 6, 34),
    'necklace': (f'<polyline points="{chain_pts}" fill="none" stroke="{GOLD}" stroke-width="7"/>'
                 f'<path d="M760,878 L782,906 L760,934 L738,906Z" fill="{{c3}}" stroke="{GOLDSH}" stroke-width="5"/>'),
    'chain': ''.join(f'<ellipse cx="{640 + 240 * t:.0f}" cy="{816 + 78 * math.sin(math.pi * t):.0f}" rx="16" ry="11" fill="none" stroke="{GOLD}" stroke-width="8" '
                     f'transform="rotate({(t - .5) * -60:.0f} {640 + 240 * t:.0f} {816 + 78 * math.sin(math.pi * t):.0f})"/>' for t in np.linspace(0, 1, 11)),
    'headphones': L + (
        f'<path d="M424,470 Q400,20 760,10 Q1110,20 1092,470" fill="none" stroke="{{ink}}" stroke-width="34" stroke-linecap="round"/>'
        f'<rect x="372" y="400" width="96" height="180" rx="42" fill="{{c3}}"/><rect x="372" y="400" width="40" height="180" rx="20" fill="{{c3sh}}"/>'
        f'<rect x="1046" y="400" width="96" height="180" rx="42" fill="{{c3}}"/><rect x="1046" y="400" width="40" height="180" rx="20" fill="{{c3sh}}"/>'),
    'hearing_aid': L + (f'<path d="M1062,470 Q1104,470 1100,540 Q1096,600 1066,606" fill="none" stroke="{{c3}}" stroke-width="30" stroke-linecap="round"/>'
                        f'<circle cx="1060" cy="606" r="14" fill="{{c3sh}}"/>'),
    'bandana': smooth(poly([(600, 800), (920, 800), (870, 860), (760, 930), (650, 860)]), 8),
}
ACCESSORIES['bandana'] = (f'<path d="{trace(ACCESSORIES["bandana"])}" fill="{{c3}}"/>'
                          + ''.join(f'<circle cx="{x}" cy="{y}" r="8" fill="#F2F4F3"/>' for x, y in [(680, 830), (740, 850), (800, 846), (860, 828), (720, 884), (780, 892)]))

# ------------------------------------------------------------------ props (right hand at about (1012, 1130))
HX, HY = 1012, 1120
def _scale(frag, cx, cy, k):
    return f'<g transform="translate({cx} {cy}) scale({k}) translate({-cx} {-cy})">{frag}</g>' if frag else ''


PROPS = {
    'none': '',
    'phone': (f'<rect x="{HX - 34}" y="{HY - 110}" width="78" height="140" rx="16" fill="{{ink}}"/>'
              f'<rect x="{HX - 26}" y="{HY - 100}" width="62" height="112" rx="8" fill="{{c3}}"/>'
              f'<circle cx="{HX + 5}" cy="{HY - 60}" r="14" fill="#FFFFFF" opacity="0.7"/>'),
    'coffee': (f'<path d="M{HX - 44},{HY - 110} L{HX + 44},{HY - 110} L{HX + 34},{HY + 10} L{HX - 34},{HY + 10}Z" fill="#F2F4F3"/>'
               f'<path d="M{HX - 40},{HY - 70} L{HX + 40},{HY - 70} L{HX + 36},{HY - 24} L{HX - 36},{HY - 24}Z" fill="{{c3}}"/>'
               f'<rect x="{HX - 52}" y="{HY - 130}" width="104" height="26" rx="10" fill="#7A5236"/>'
               f'<path d="M{HX - 14},{HY - 150} q-16,-30 0,-60 M{HX + 18},{HY - 150} q-16,-30 0,-60" fill="none" stroke="#C9CFCC" stroke-width="10" stroke-linecap="round"/>'),
    'ball': ('<circle cx="1210" cy="1318" r="74" fill="#F2F4F3"/>'
             '<path d="M1210,1288 L1238,1308 L1228,1342 L1192,1342 L1182,1308Z" fill="#22313B"/>'
             '<path d="M1210,1288 L1210,1250 M1238,1308 L1272,1294 M1228,1342 L1250,1374 M1192,1342 L1170,1374 M1182,1308 L1148,1294" stroke="#22313B" stroke-width="8"/>'
             '<path d="M1150,1268 Q1210,1238 1268,1268" fill="none" stroke="#C9CFCC" stroke-width="6" opacity="0.6"/>'),
    'flag': (f'<path d="M{HX},{HY + 40} L{HX + 20},560" stroke="#7A5236" stroke-width="16" stroke-linecap="round"/>'
             f'<path d="M{HX + 20},570 Q{HX + 140},530 {HX + 260},580 Q{HX + 330},610 {HX + 380},580 L{HX + 380},790 Q{HX + 300},830 {HX + 240},790 Q{HX + 140},750 {HX + 20},790Z" fill="{{c3}}"/>'
             f'<path d="M{HX + 20},650 Q{HX + 140},610 {HX + 260},660 Q{HX + 330},690 {HX + 380},660 L{HX + 380},710 Q{HX + 300},750 {HX + 240},710 Q{HX + 140},670 {HX + 20},710Z" fill="#F2F4F3"/>'),
    'sign': (f'<path d="M{HX},{HY + 30} L{HX + 30},770" stroke="#7A5236" stroke-width="18" stroke-linecap="round"/>'
             f'<rect x="{HX - 110}" y="520" width="300" height="250" rx="18" fill="#F2F4F3" stroke="{{c3}}" stroke-width="14"/>'
             f'<text x="{HX + 40}" y="690" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="120" text-anchor="middle" fill="{{ink}}">OI!</text>'),
    'guitar': ('<path d="M1060,1060 L1300,760" stroke="#5A3A26" stroke-width="34" stroke-linecap="round"/>'
               '<rect x="1270" y="700" width="70" height="90" rx="14" fill="#3B2A21" transform="rotate(38 1305 745)"/>'
               '<ellipse cx="1080" cy="1210" rx="130" ry="150" fill="{c3}" transform="rotate(38 1080 1210)"/>'
               '<ellipse cx="1130" cy="1110" rx="96" ry="96" fill="{c3}"/>'
               '<circle cx="1105" cy="1150" r="36" fill="#3B2A21"/>'
               '<path d="M1040,1240 L1300,760" stroke="#F2F4F3" stroke-width="3" opacity="0.7"/>'),
    'balloon': (f'<path d="M{HX},{HY - 10} Q{HX + 110},900 {HX + 170},700" fill="none" stroke="#C9CFCC" stroke-width="6"/>'
                f'<ellipse cx="{HX + 180}" cy="560" rx="120" ry="146" fill="{{c3}}"/>'
                f'<path d="M{HX + 166},700 L{HX + 194},700 L{HX + 180},716Z" fill="{{c3sh}}"/>'
                f'<ellipse cx="{HX + 136}" cy="500" rx="24" ry="44" fill="#FFFFFF" opacity="0.35" transform="rotate(-20 {HX + 136} 500)"/>'),
}

PROPS = {k: _scale(v, HX, HY, 1.0 if k in ('flag', 'sign', 'balloon', 'guitar', 'ball') else 1.5) for k, v in PROPS.items()}
PROPS['ball'] = _scale(PROPS['ball'], 1210, 1392, 1.3)

# ------------------------------------------------------------------ pets (sit at the left of the figure)
DOG_C, DOG_SH = '#C89948', '#A87B32'
PETS = {
    'none': '',
    'dog': L + (
        f'<ellipse cx="300" cy="1300" rx="110" ry="90" fill="{DOG_C}"/>'
        f'<path d="M210,1280 q-60,-40 -40,-110" fill="none" stroke="{DOG_C}" stroke-width="30" stroke-linecap="round"/>'
        f'<ellipse cx="350" cy="1360" rx="40" ry="30" fill="{DOG_SH}"/><ellipse cx="250" cy="1370" rx="40" ry="26" fill="{DOG_SH}"/>'
        f'<circle cx="360" cy="1150" r="92" fill="{DOG_C}"/>'
        f'<ellipse cx="288" cy="1140" rx="36" ry="70" fill="{DOG_SH}" transform="rotate(20 288 1140)"/>'
        f'<ellipse cx="436" cy="1140" rx="36" ry="70" fill="{DOG_SH}" transform="rotate(-20 436 1140)"/>'
        f'<ellipse cx="372" cy="1196" rx="50" ry="36" fill="#F2E3C4"/><ellipse cx="372" cy="1180" rx="18" ry="13" fill="{{ink}}"/>'
        f'<circle cx="330" cy="1130" r="12" fill="{{ink}}"/><circle cx="406" cy="1130" r="12" fill="{{ink}}"/>'
        f'<path d="M290,1230 Q360,1258 440,1230" fill="none" stroke="{{c3}}" stroke-width="18" stroke-linecap="round"/>'
        f'<circle cx="368" cy="1258" r="12" fill="{GOLD}"/>'),
    'cat': L + (
        '<path d="M200,1360 q-90,-20 -60,-130" fill="none" stroke="#8D9294" stroke-width="26" stroke-linecap="round"/>'
        '<ellipse cx="290" cy="1300" rx="96" ry="96" fill="#A3A8AA"/>'
        '<ellipse cx="330" cy="1374" rx="36" ry="22" fill="#8D9294"/><ellipse cx="250" cy="1378" rx="36" ry="22" fill="#8D9294"/>'
        '<circle cx="320" cy="1160" r="82" fill="#A3A8AA"/>'
        '<path d="M250,1120 L262,1040 L304,1094Z M390,1120 L378,1040 L336,1094Z" fill="#A3A8AA"/>'
        '<path d="M262,1106 L268,1064 L290,1094Z M378,1106 L372,1064 L350,1094Z" fill="#F0A6B4"/>'
        '<circle cx="292" cy="1156" r="11" fill="{ink}"/><circle cx="350" cy="1156" r="11" fill="{ink}"/>'
        '<path d="M312,1182 L328,1182 L320,1192Z" fill="#F0A6B4"/>'
        '<path d="M250,1186 L210,1180 M250,1196 L212,1204 M390,1186 L430,1180 M390,1196 L428,1204" stroke="#6E7375" stroke-width="5" stroke-linecap="round"/>'
        '<path d="M260,1236 Q320,1258 380,1236" fill="none" stroke="{c3}" stroke-width="14" stroke-linecap="round"/>'),
}

PETS = {k: (L + _scale(v.replace(L, ''), 300, 1400, 1.8)) if v else '' for k, v in PETS.items()}

# ------------------------------------------------------------------ headwear, second batch


def band(top, bot, g, sag_t=40, sag_b=44):
    return grow(HEAD, g) & (Y >= arc(top, sag_t)) & (Y < arc(bot, sag_b))


def bucket():
    crown = smooth(grow(HEAD, 30) & (Y < arc(260, 34)) & (Y > 60), 10) | smooth(grow(HEAD, 30) & (Y < arc(260, 34)) & (Y >= 60), 4)
    crown = smooth(crown & (Y > 70), 8)
    brim = smooth(poly(curve((330, 330), (380, 230), (500, 236)) + curve((500, 236), (780, 290), (1080, 236))
                       + curve((1080, 236), (1200, 230), (1240, 330)) + curve((1240, 330), (780, 420), (330, 330))), 8)
    return (lit(brim, '{c3}', '{c3sh}') + lit(crown, '{c3}', '{c3sh}')
            + f'<path d="M490,236 Q780,300 1090,236" fill="none" stroke="{{c3sh}}" stroke-width="12" stroke-linecap="round"/>'
            + f'<path d="M420,320 Q780,400 1150,320" fill="none" stroke="{{c3sh}}" stroke-width="7" stroke-dasharray="4 18" stroke-linecap="round"/>')


def beret():
    disc = smooth(poly([(x, y) for x, y in [
        (720 + 400 * math.cos(a) * math.cos(-0.16) - 130 * math.sin(a) * math.sin(-0.16),
         170 + 400 * math.cos(a) * math.sin(-0.16) + 130 * math.sin(a) * math.cos(-0.16)) for a in np.linspace(0, 2 * math.pi, 60)]]), 4)
    b = smooth(band(230, 290, 26), 4)
    return (lit(disc, '{c3}', '{c3sh}') + lit(b, '{c3sh}', '{c3sh}')
            + '<path d="M760,64 L768,22" stroke="{c3sh}" stroke-width="18" stroke-linecap="round"/>')


def headband():
    b = smooth(band(214, 270, 22), 4)
    return lit(b, '{c3}', '{c3sh}') + '<path d="M560,232 Q780,284 1010,232" fill="none" stroke="#FFFFFF" stroke-width="8" opacity="0.25" stroke-linecap="round"/>'


def straw():
    brim = smooth(poly([(780 + 560 * math.cos(a), 270 + 120 * math.sin(a)) for a in np.linspace(0, 2 * math.pi, 70)]), 4)
    crown = smooth(grow(HEAD, 24) & (Y < 270) & (Y > 70), 10)
    s = lit(brim, '#E3B64B', '#C4952F') + lit(crown, '#E3B64B', '#C4952F')
    s += ''.join(f'<path d="M{780 + 520 * math.cos(a):.0f},{270 + 104 * math.sin(a):.0f} L{780 + 300 * math.cos(a):.0f},{270 + 60 * math.sin(a):.0f}" stroke="#C4952F" stroke-width="6" opacity="0.6"/>'
                 for a in np.linspace(0, 2 * math.pi, 28, endpoint=False) if math.sin(a) > -0.2)
    s += f'<path d="{trace(smooth(band(222, 266, 26, 30, 30) & (Y < 270), 3))}" fill="#D63A2F"/>'
    s += '<path d="M560,120 L600,150 M960,130 L920,160" stroke="#C4952F" stroke-width="8" stroke-linecap="round"/>'
    return s


def party():
    cone = poly([(530, 250), (790, -10), (1050, 236)])
    out = f'<path d="{trace(smooth(cone, 3))}" fill="{{c3}}"/>'
    for y in (80, 170):
        w = (y + 10) / 260 * 260 - 18
        out += f'<path d="M{790 - w:.0f},{y + 24:.0f} L{790 + w:.0f},{y - 12:.0f} L{790 + w + 10:.0f},{y + 24:.0f} L{790 - w + 8:.0f},{y + 60:.0f}Z" fill="#F2F4F3" opacity="0.85"/>'
    out += f'<path d="M530,250 Q790,280 1050,236" fill="none" stroke="{{c3sh}}" stroke-width="14" stroke-linecap="round"/>'
    out += pompom(790, -12, 38)
    return out


def flowers():
    out = ''
    cols = ['#F06A7E', '#F5C518', '#F2F4F3', '#B794F4', '#F06A7E', '#54C0FF', '#F5C518', '#F2F4F3', '#F06A7E']
    for i, t in enumerate(np.linspace(-1, 1, 9)):
        x = CXH + 300 * t
        y = 250 - 40 * t * t
        if i % 2:
            out += f'<ellipse cx="{x - 30:.0f}" cy="{y + 10:.0f}" rx="34" ry="16" fill="#3FA56B" transform="rotate(-30 {x - 30:.0f} {y + 10:.0f})"/>'
        out += ''.join(f'<circle cx="{x + 24 * math.cos(a):.0f}" cy="{y + 24 * math.sin(a):.0f}" r="22" fill="{cols[i]}"/>' for a in np.linspace(0, 2 * math.pi, 5, endpoint=False))
        out += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="15" fill="{GOLDSH if cols[i] != "#F5C518" else "#E07A2E"}"/>'
    return out


def headwrap():
    body = smooth(grow(HEAD, 54) & (Y < arc(320, 50)), 10)
    knot = smooth(circle(820, 60, 110) | circle(700, 90, 90), 6)
    return (lit(body | knot, '{c3}', '{c3sh}')
            + '<path d="M460,300 Q620,160 900,120 M520,330 Q700,230 1060,250 M600,180 Q760,90 980,170" fill="none" stroke="{c3sh}" stroke-width="12" stroke-linecap="round" opacity="0.7"/>'
            + '<path d="M760,40 Q820,10 880,60" fill="none" stroke="#FFFFFF" stroke-width="10" opacity="0.25" stroke-linecap="round"/>')


def durag():
    cap = smooth(grow(HEAD, 14) & (Y < arc(318, 48)), 6)
    tails = smooth(poly(curve((440, 280), (330, 420), (360, 700)) + [(420, 700)] + curve((420, 700), (420, 440), (480, 320))), 6)
    return (lit(tails, '{c3sh}', '{c3sh}') + lit(cap, '{c3}', '{c3sh}')
            + '<path d="M780,110 L776,300" stroke="{c3sh}" stroke-width="10" stroke-linecap="round"/>'
            + f'<path d="{trace(smooth(band(276, 318, 16, 48, 48), 3))}" fill="{{c3sh}}"/>'
            + '<path d="M820,150 Q900,170 960,240" fill="none" stroke="#FFFFFF" stroke-width="10" opacity="0.2" stroke-linecap="round"/>')


HATS2 = {'bucket': bucket(), 'beret': beret(), 'headband': headband(), 'straw': straw(), 'party': party(),
         'flowers': flowers(), 'headwrap': headwrap(), 'durag': durag()}
HAT_ORDER = ['bucket', 'beret', 'headband', 'straw', 'party', 'flowers', 'headwrap', 'durag']
KEEPS_HAIR = ['headband', 'flowers']
COVERS = ['headwrap', 'durag']

# ------------------------------------------------------------------ backgrounds, second batch
R = '<rect x="-200" y="-200" width="1900" height="1900" fill="{}"/>'
BG2 = {
    'dots': ('<defs><pattern id="bgdots" width="120" height="240" patternUnits="userSpaceOnUse">'
             '<circle cx="30" cy="30" r="16" fill="#FFFFFF" opacity="0.7"/><circle cx="90" cy="150" r="16" fill="#FFFFFF" opacity="0.7"/></pattern></defs>'
             + R.format('#FFE9A8') + R.format('url(#bgdots)')),
    'stripes': ('<defs><pattern id="bgstripes" width="160" height="160" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">'
                '<rect width="60" height="160" fill="#C7ECFB"/></pattern></defs>' + R.format('#E4F7FE') + R.format('url(#bgstripes)')),
    'sunset': ('<defs><linearGradient id="bgsunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB36B"/>'
               '<stop offset="0.6" stop-color="#F68FA0"/><stop offset="1" stop-color="#9B7BD8"/></linearGradient></defs>'
               '<rect x="-200" y="-200" width="1900" height="1900" fill="url(#bgsunset)"/>'),
    'ocean': ('<defs><linearGradient id="bgocean" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FD8F5"/>'
              '<stop offset="1" stop-color="#2F7FC1"/></linearGradient></defs>'
              '<rect x="-200" y="-200" width="1900" height="1900" fill="url(#bgocean)"/>'),
    'beach': (R.format('#8FD8F7') + '<circle cx="1260" cy="160" r="110" fill="#FFE07A"/>'
              '<rect x="-200" y="900" width="1900" height="200" fill="#2E9BD6"/>'
              '<path d="M-200,1010 Q100,980 400,1010 T1000,1010 T1700,1010" fill="none" stroke="#FFFFFF" stroke-width="10" opacity="0.6"/>'
              '<rect x="-200" y="1100" width="1900" height="800" fill="#F3D9A4"/>'),
    'city': (R.format('#CDE7F5') + ''.join(f'<rect x="{x}" y="{y}" width="{w}" height="1900" fill="#9FB8C8"/>' for x, y, w in
                                             [(-200, 500, 260), (80, 300, 200), (300, 620, 180), (1100, 380, 220), (1340, 560, 200), (1560, 260, 180)])
             + ''.join(f'<rect x="{x}" y="{y}" width="34" height="44" fill="#E4F2FA"/>' for x in (120, 200, 1140, 1220) for y in range(360, 1000, 90))
             + '<rect x="-200" y="1250" width="1900" height="700" fill="#B9C7CF"/>'),
    'stadium': ('<defs><pattern id="bgcrowd" width="100" height="100" patternUnits="userSpaceOnUse">'
                '<circle cx="25" cy="25" r="10" fill="#F5C518"/><circle cx="75" cy="25" r="10" fill="#D63A2F"/>'
                '<circle cx="25" cy="75" r="10" fill="#F2F4F3"/><circle cx="75" cy="75" r="10" fill="#54C0FF"/></pattern></defs>'
                + R.format('#1E6B4A') + '<rect x="-200" y="-200" width="1900" height="760" fill="#2C3E50"/>'
                '<rect x="-200" y="-200" width="1900" height="740" fill="url(#bgcrowd)"/>'
                '<rect x="-200" y="560" width="1900" height="30" fill="#F2F4F3" opacity="0.4"/>'
                + ''.join(f'<rect x="-200" y="{y}" width="1900" height="120" fill="#24805A"/>' for y in (700, 940, 1180, 1420))
                + '<path d="M-200,1250 Q750,1150 1700,1250" fill="none" stroke="#F2F4F3" stroke-width="12" opacity="0.8"/>'),
}
BG_ORDER = ['dots', 'stripes', 'sunset', 'ocean', 'beach', 'city', 'stadium']
