"""Hair review: big close-ups, a thumbnail strip, and an under-hat strip."""
import json, subprocess, sys
from PIL import Image, ImageDraw
from compose_py import compose
M=json.load(open('../../../lib/avatar/dummys.json'))
BASE=dict(skin='caramel',hairColor='brown',brows='straight',eyes='dots',mouth='smile',facial='none',outfit='tee_jeans',color1='green',color2='denim',hat='none',hatColor='red',glasses='none',bg='paper')
def png(c,crop,w):
    open('/tmp/h.svg','w').write(compose(M,{**BASE,**c},crop))
    subprocess.run(['rsvg-convert','-w',str(w),'/tmp/h.svg','-o','/tmp/h.png'],check=True)
    return Image.open('/tmp/h.png').convert('RGB')
def closeups(styles,out,w=420):
    combos=[dict(skin='caramel',hairColor='brown'),dict(skin='porcelain',hairColor='honey'),dict(skin='espresso',hairColor='black'),dict(skin='sand',hairColor='grey')]
    im=Image.new('RGB',(len(combos)*w,len(styles)*w),'white')
    for r,s in enumerate(styles):
        for c,cb in enumerate(combos):
            im.paste(png({**cb,'hair':s},'head',w),(c*w,r*w))
    im.save(out)
def thumbs(out,w=112):
    hairs=list(M['parts']['hair'])
    im=Image.new('RGB',(len(hairs)*w,3*w),'white')
    for i,h in enumerate(hairs):
        im.paste(png(dict(hair=h),'head',w),(i*w,0))
        im.paste(png(dict(hair=h,hat='beanie',hatColor='ink'),'head',w),(i*w,w))
        im.paste(png(dict(hair=h,hat='cap',hatColor='red'),'head',w),(i*w,2*w))
    im.save(out)
if __name__=='__main__':
    styles=sys.argv[1].split(',') if len(sys.argv)>1 else list(M['parts']['hair'])
    closeups(styles,'lab.png')
    thumbs('thumbs.png')
