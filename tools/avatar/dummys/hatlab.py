import json,subprocess,sys
from compose_py import compose
from PIL import Image
M=json.load(open('../../../lib/avatar/dummys.json'))
B=dict(brows='straight',eyes='dots',mouth='smile',facial='none',outfit='tee_jeans',color1='green',color2='denim',glasses='none',bg='paper')
hats=sys.argv[1].split(',') if len(sys.argv)>1 else [h for h in M['parts']['hat'] if h!='none']
combos=[('caramel','brown','long','red'),('porcelain','honey','swoop','ink'),('espresso','black','afro','yellow'),('sand','grey','bun','green')]
w=360
im=Image.new('RGB',(len(combos)*w,len(hats)*w),'white')
for r,h in enumerate(hats):
    for c,(sk,hc,hair,col) in enumerate(combos):
        if col not in M['palettes']['cloth']: col=list(M['palettes']['cloth'])[c]
        open('/tmp/q.svg','w').write(compose(M,{**B,'skin':sk,'hairColor':hc,'hair':hair,'hat':h,'hatColor':col},'head'))
        subprocess.run(['rsvg-convert','-w',str(w),'/tmp/q.svg','-o','/tmp/q.png'],check=True)
        im.paste(Image.open('/tmp/q.png').convert('RGB'),(c*w,r*w))
im.save('hatlab.png')
