import json, subprocess, sys
from PIL import Image, ImageDraw
from compose_py import compose
M=json.load(open('../../../lib/avatar/dummys.json'))
DEF=dict(skin='caramel',hair='bald',hairColor='brown',brows='straight',eyes='dots',mouth='smile',facial='none',outfit='tee_jeans',color1='green',color2='denim',hat='none',glasses='none',bg='paper')
def sheet(rows,out,w=260):
    cols=max(len(r) for r in rows)
    im=Image.new('RGB',(cols*w,len(rows)*(w+22)),'white'); d=ImageDraw.Draw(im)
    for ri,r in enumerate(rows):
        for ci,(lab,c,crop) in enumerate(r):
            open('/tmp/a.svg','w').write(compose(M,{**DEF,**c},crop))
            subprocess.run(['rsvg-convert','-w',str(w),'/tmp/a.svg','-o','/tmp/a.png'],check=True)
            im.paste(Image.open('/tmp/a.png').convert('RGB'),(ci*w,ri*(w+22)))
            d.text((ci*w+6,ri*(w+22)+w+4),lab,fill='black')
    im.save(out)
if __name__=='__main__':
    hairs=list(M['parts']['hair'])
    half=(len(hairs)+1)//2
    rows=[[(h,dict(hair=h,hairColor='brown'),'head') for h in hairs[:half]],
          [(h,dict(hair=h,hairColor='brown'),'head') for h in hairs[half:]],
          [(h+' honey',dict(hair=h,hairColor='honey',skin='porcelain'),'head') for h in hairs[:half]],
          [(h+' black',dict(hair=h,hairColor='black',skin='cocoa'),'head') for h in hairs[half:]]]
    sheet(rows,'audit_hair.png')
