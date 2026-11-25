import json
from parts import *
import faces2, outfits2
M={
 'id':'dummys','name':'Dummys','size':1500,
 'headClip':D['head_all'],
 'sideClip':T['head_shadow'],
 'base':{'limbs':BASE_LIMBS,'head':BASE_HEAD},
 'palettes':{'skin':SKIN,'hair':HAIR,'cloth':CLOTH},
 'backgrounds':BACKGROUNDS,
 'parts':{
   'outfit':OUTFITS,'brows':BROWS,'eyes':EYES,'mouth':MOUTHS,'facial':FACIAL,
   'hairBack':HAIR_BACK,'hair':HAIR_FRONT,'hat':HATS,'glasses':GLASSES,
 },
 'tallHair':TALL,
 'coversHair':['hijab'],
 'ink':'#113F3D',
}
def fix(v):
    if isinstance(v,str): return v.replace('{{','{').replace('}}','}')
    if isinstance(v,dict): return {k:fix(x) for k,x in v.items()}
    if isinstance(v,(list,tuple)): return [fix(x) for x in v]
    return v
def tail(d, keys):
    out={k:v for k,v in d.items() if k not in keys}
    out.update({k:d[k] for k in keys})
    return out
# Appending keeps share codes stable: indexes of existing options must not move.
M['parts']['outfit']=tail(M['parts']['outfit'],['dress'])
M['parts']['hat']=tail(M['parts']['hat'],['hijab'])
# second batch: appended after the originals
def add(d, extra, order=None):
    for k in (order or extra): d[k]=extra[k]
P2=M['parts']
add(P2['eyes'],faces2.EYES2); add(P2['mouth'],faces2.MOUTHS2); add(P2['brows'],faces2.BROWS2); add(P2['facial'],faces2.FACIAL2)
P2['details']=faces2.DETAILS
add(P2['outfit'],outfits2.OUT,outfits2.ORDER)
P2['outfit']['jersey']=P2['outfit']['jersey'].replace('>10</text>','>{num}</text>')
P2['pattern']=outfits2.PATTERNS
M['tops']=outfits2.top_paths()
try:
    import extras
    P2['accessory']=extras.ACCESSORIES; P2['prop']=extras.PROPS; P2['pet']=extras.PETS
    add(P2['hat'],extras.HATS2,extras.HAT_ORDER)
    add(M['backgrounds'],extras.BG2,extras.BG_ORDER)
    M['hatKeepsHair']=extras.KEEPS_HAIR; M['coversHair']=M['coversHair']+extras.COVERS
except ImportError:
    P2['accessory']={'none':''}; P2['prop']={'none':''}; P2['pet']={'none':''}
M['layers']=['bg','pet@0','hairBack','base.limbs','outfit','pattern','accessory@0','base.head','details','brows','eyes','mouth','facial','hair','hat','glasses','accessory@1','prop','pet@1']
M=fix(M)
s=json.dumps(M,separators=(',',':'))
open('../../../lib/avatar/dummys.json','w').write(s)
print(len(s)//1024,'KB')
