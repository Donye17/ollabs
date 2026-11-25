from parts import *
ORDER=['bg','hair_back','limbs','outfit','head','brows','eyes','mouth','facial','hair','hat','glasses']
TALL={'swoop','curly','bun'}
def compose(c):
    sk,sksh=SKIN[c['skin']]; hr,hrsh=HAIR[c['hair_color']]
    c1,c1sh=CLOTH[c['color1']]; c2,c2sh=CLOTH[c.get('color2','brown')]
    hair=c['hair']
    if c.get('hat','none')!='none' and hair in TALL: hair='buzz'
    parts=[]
    bg=BACKGROUNDS[c.get('bg','none')]
    if bg: parts.append(f'<rect width="1500" height="1500" fill="{bg}"/>')
    parts.append(HAIR_BACK.get(c['hair'],'') if not (c.get('hat','none')!='none' and c['hair']=='curly') else '')
    parts+= [BASE_LIMBS, OUTFITS[c['outfit']], BASE_HEAD, BROWS[c['brows']], EYES[c['eyes']], MOUTHS[c['mouth']],
             FACIAL[c['facial']], HAIR_FRONT[hair], HATS[c.get('hat','none')], GLASSES[c.get('glasses','none')].replace('{eyes_again}', EYES[c['eyes']])]
    body=''.join(parts)
    for k,v in {'{skin}':sk,'{skinsh}':sksh,'{hair}':hr,'{hairsh}':hrsh,'{c1}':c1,'{c1sh}':c1sh,'{c2}':c2,'{c2sh}':c2sh,'{ink}':'#113F3D'}.items():
        body=body.replace(k,v)
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1500 1500">'
            f'<defs><clipPath id="headclip"><path d="{D["head_all"]}"/></clipPath></defs>{body}</svg>')
if __name__=='__main__':
    import subprocess
    from PIL import Image
    combos=[
      dict(skin='porcelain',hair='bald',hair_color='honey',brows='worried',eyes='dots',mouth='none',facial='walrus',outfit='sweater',color1='green',color2='brown',bg='paper'),
      dict(skin='cocoa',hair='curly',hair_color='black',brows='raised',eyes='happy',mouth='grin',facial='none',outfit='jersey',color1='yellow',color2='green',bg='cyan'),
      dict(skin='caramel',hair='long',hair_color='brown',brows='straight',eyes='big',mouth='smile',facial='none',outfit='tee_jeans',color1='red',color2='denim',glasses='round',bg='blush'),
      dict(skin='sand',hair='swoop',hair_color='ginger',brows='cross',eyes='dots',mouth='smirk',facial='beard',outfit='tee_shorts',color1='ink',color2='sky',bg='sun'),
      dict(skin='espresso',hair='bun',hair_color='black',brows='straight',eyes='wink',mouth='smile',facial='none',outfit='onesie',color1='sky',bg='sage'),
      dict(skin='cinnamon',hair='buzz',hair_color='black',brows='straight',eyes='sleepy',mouth='flat',facial='goatee',outfit='sweater',color1='ink',color2='denim',glasses='shades',hat='cap',bg='paper'),
      dict(skin='porcelain',hair='long',hair_color='grey',brows='raised',eyes='happy',mouth='oh',facial='none',outfit='tee_jeans',color1='white',color2='ink',hat='santa',bg='cyan'),
      dict(skin='caramel',hair='curly',hair_color='honey',brows='raised',eyes='big',mouth='grin',facial='none',outfit='tee_shorts',color1='yellow',color2='green',hat='tiara',glasses='masquerade',bg='blush'),
    ]
    sheet=Image.new('RGB',(1600,800),'white')
    for i,c in enumerate(combos):
        open(f'c{i}.svg','w').write(compose(c))
        subprocess.run(['rsvg-convert','-w','400',f'c{i}.svg','-o',f'c{i}.png'],check=True)
        sheet.paste(Image.open(f'c{i}.png').convert('RGB'),((i%4)*400,(i//4)*400))
    sheet.save('sheet.png')
