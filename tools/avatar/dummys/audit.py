import json,subprocess,sys
from compose_py import compose
from PIL import Image, ImageDraw
M=json.load(open('../../../lib/avatar/dummys.json'))
B=dict(skin='caramel',hair='buzz',hairColor='brown',brows='straight',eyes='dots',mouth='smile',facial='none',outfit='tee_jeans',color1='green',color2='denim',hat='none',hatColor='red',glasses='none',bg='paper',details='none',pattern='none',accessory='none',prop='none',pet='none',number='10')
def tile(cfg,crop,w):
    open('/tmp/a.svg','w').write(compose(M,{**B,**cfg},crop)); subprocess.run(['rsvg-convert','-w',str(w),'/tmp/a.svg','-o','/tmp/a.png'],check=True)
    return Image.open('/tmp/a.png').convert('RGB')
def sheet(name, slot, rows, crop='head', w=180, opts=None):
    opts = opts or [k for k in (M['parts'][slot] if slot in M['parts'] else M['backgrounds']) if k!='none']
    im=Image.new('RGB',(len(opts)*w,len(rows)*w+18),'white'); d=ImageDraw.Draw(im)
    for i,o in enumerate(opts):
        d.text((i*w+4,2),o,fill='black')
        for r,extra in enumerate(rows):
            im.paste(tile({**extra,slot:o},crop,w),(i*w,18+r*w))
    im.save(f'audit_{name}.png'); print(name, im.size)
