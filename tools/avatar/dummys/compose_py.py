import json, re
CROPS={'full':'-40 -80 1580 1580','head':'310 -60 980 980'}
def compose(M,c,crop='head',transparent=False,cid='hc'):
    p=M['parts'];pal=M['palettes']
    sk,sksh=pal['skin'][c['skin']];hr,hrsh=pal['hair'][c['hairColor']];c1,c1sh=pal['cloth'][c['color1']];c2,c2sh=pal['cloth'][c['color2']];c3,c3sh=pal['cloth'][c.get('hatColor','red')]
    hat=c['hat']!='none'
    covers = c['hat'] in M.get('coversHair',[])
    front='' if covers else ('buzz' if hat and c['hair'] in M['tallHair'] else c['hair'])
    back='' if (covers or (hat and c['hair'] in M['tallHair'])) else p['hairBack'].get(c['hair'],'')
    bg=None if transparent else M['backgrounds'][c['bg']]
    body=''.join([f'<rect x="-200" y="-200" width="1900" height="1900" fill="{bg}"/>' if bg else '',back,M['base']['limbs'],p['outfit'][c['outfit']],M['base']['head'],p['brows'][c['brows']],p['eyes'][c['eyes']],p['mouth'][c['mouth']],p['facial'][c['facial']],p['hair'].get(front,''),p['hat'][c['hat']],p['glasses'][c['glasses']].replace('{eyes_again}',p['eyes'][c['eyes']])])
    body=body.replace('url(#headclip)',f'url(#{cid})').replace('url(#sideclip)',f'url(#{cid}-s)').replace('url(#leftclip)',f'url(#{cid}-l)')
    col=dict(skin=sk,skinsh=sksh,hair=hr,hairsh=hrsh,c1=c1,c1sh=c1sh,c2=c2,c2sh=c2sh,c3=c3,c3sh=c3sh,ink=M['ink'])
    body=re.sub(r'\{(skin|skinsh|hair|hairsh|c1|c1sh|c2|c2sh|c3|c3sh|ink)\}',lambda m:col[m.group(1)],body)
    defs=(f'<clipPath id="{cid}"><path d="{M["headClip"]}"/></clipPath>'
          f'<clipPath id="{cid}-s"><path d="{M["sideClip"]}"/></clipPath>'
          f'<clipPath id="{cid}-l"><rect x="-200" y="-200" width="705" height="1900"/></clipPath>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{CROPS[crop]}"><defs>{defs}</defs>{body}</svg>'
