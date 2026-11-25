import json
from parts import *
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
M=fix(M)
s=json.dumps(M,separators=(',',':'))
open('../../../lib/avatar/dummys.json','w').write(s)
print(len(s)//1024,'KB')
