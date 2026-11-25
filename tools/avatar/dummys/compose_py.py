import json, re
CROPS = {'full': '-40 -80 1580 1580', 'head': '310 -60 980 980'}
PLACE = re.compile(r'\{(skin|skinsh|hair|hairsh|c1|c1sh|c2|c2sh|c3|c3sh|ink)\}')
SPLIT = '<!--L-->'


def compose(M, c, crop='head', transparent=False, cid='hc'):
    """Mirror of lib/avatar/compose.ts. Layer order comes from M['layers']."""
    p, pal = M['parts'], M['palettes']
    g = lambda k, d: c.get(k, d)
    sk, sksh = pal['skin'][c['skin']]
    hr, hrsh = pal['hair'][c['hairColor']]
    c1, c1sh = pal['cloth'][c['color1']]
    c2, c2sh = pal['cloth'][c['color2']]
    c3, c3sh = pal['cloth'][g('hatColor', 'red')]
    hat = g('hat', 'none')
    hat_on = hat != 'none' and hat not in M.get('hatKeepsHair', [])
    covers = hat in M.get('coversHair', [])
    tall = hat_on and c['hair'] in M['tallHair']
    front = '' if covers else ('buzz' if tall else c['hair'])
    outfit = c['outfit']
    out = []
    for tok in M['layers']:
        if tok == 'bg':
            bg = None if transparent else M['backgrounds'].get(g('bg', 'none'))
            if bg:
                out.append(bg if bg.startswith('<') else f'<rect x="-200" y="-200" width="1900" height="1900" fill="{bg}"/>')
        elif tok.startswith('base.'):
            out.append(M['base'][tok[5:]])
        elif tok == 'hairBack':
            out.append('' if (covers or tall) else p['hairBack'].get(c['hair'], ''))
        elif tok == 'hair':
            out.append(p['hair'].get(front, ''))
        elif tok == 'pattern':
            pat = p['pattern'].get(g('pattern', 'none'), '')
            top = M['tops'].get(outfit)
            if pat and top:
                out.append(f'<g clip-path="url(#topclip)">{pat}<path d="{top[1]}" fill="#000" opacity="0.16"/></g>')
        else:
            name, _, seg = tok.partition('@')
            frag = p[name].get(g(name, 'none'), '')
            if seg:
                bits = frag.split(SPLIT)
                frag = bits[int(seg)] if int(seg) < len(bits) else ''
            if name == 'glasses':
                frag = frag.replace('{eyes_again}', p['eyes'][c['eyes']])
            out.append(frag)
    body = ''.join(out).replace('{num}', str(g('number', '10')))
    for a, b in (('headclip', cid), ('sideclip', cid + '-s'), ('leftclip', cid + '-l'), ('topclip', cid + '-t')):
        body = body.replace(f'url(#{a})', f'url(#{b})')
    col = dict(skin=sk, skinsh=sksh, hair=hr, hairsh=hrsh, c1=c1, c1sh=c1sh, c2=c2, c2sh=c2sh, c3=c3, c3sh=c3sh, ink=M['ink'])
    body = PLACE.sub(lambda m: col[m.group(1)], body)
    top = M['tops'].get(outfit, [''])[0]
    defs = (f'<clipPath id="{cid}"><path d="{M["headClip"]}"/></clipPath>'
            f'<clipPath id="{cid}-s"><path d="{M["sideClip"]}"/></clipPath>'
            f'<clipPath id="{cid}-l"><rect x="-200" y="-200" width="705" height="1900"/></clipPath>'
            f'<clipPath id="{cid}-t"><path d="{top}"/></clipPath>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{CROPS[crop]}"><defs>{defs}</defs>{body}</svg>'
