import json
from parts import *
M={
 'id':'dummys','name':'Dummys','size':1500,
 'headClip':D['head_all'],
 'base':{'limbs':BASE_LIMBS,'head':BASE_HEAD},
 'palettes':{'skin':SKIN,'hair':HAIR,'cloth':CLOTH},
 'backgrounds':BACKGROUNDS,
 'parts':{
   'outfit':OUTFITS,'brows':BROWS,'eyes':EYES,'mouth':MOUTHS,'facial':FACIAL,
   'hairBack':HAIR_BACK,'hair':HAIR_FRONT,'hat':HATS,'glasses':GLASSES,
 },
 'tallHair':['swoop','curly','bun'],
 'ink':'#113F3D',
}
def fix(v):
    if isinstance(v,str): return v.replace('{{','{').replace('}}','}')
    if isinstance(v,dict): return {k:fix(x) for k,x in v.items()}
    if isinstance(v,(list,tuple)): return [fix(x) for x in v]
    return v
M=fix(M)
s=json.dumps(M,separators=(',',':'))
open('../../../lib/avatar/dummys.json','w').write(s)
print(len(s)//1024,'KB')
