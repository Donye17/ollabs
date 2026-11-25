import cv2, numpy as np, json
def load(p): return cv2.cvtColor(cv2.imread(p), cv2.COLOR_BGR2RGB).astype(int)
B=load('reference/base.png')
A=np.roll(load('reference/styled.png'),21,axis=1)
def m(im,cols,tol=34):
    out=np.zeros(im.shape[:2],bool)
    for h in cols:
        c=np.array([int(h[i:i+2],16) for i in (1,3,5)]); out|=(np.abs(im-c).sum(2)<tol)
    return out
def clean(mk,k=3,grow=2):
    mk=mk.astype(np.uint8)*255
    mk=cv2.morphologyEx(mk,cv2.MORPH_CLOSE,np.ones((k,k),np.uint8))
    mk=cv2.morphologyEx(mk,cv2.MORPH_OPEN,np.ones((k,k),np.uint8))
    if grow: mk=cv2.dilate(mk,np.ones((2*grow+1,2*grow+1),np.uint8))
    return mk
def path(mk,eps=1.2,minarea=40):
    cs,_=cv2.findContours(mk,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE)
    d=[]
    for c in cs:
        if cv2.contourArea(c)<minarea: continue
        a=cv2.approxPolyDP(c,eps,True).reshape(-1,2)
        d.append('M'+' L'.join(f'{x},{y}' for x,y in a)+'Z')
    return ' '.join(d)
Y,X=np.mgrid[0:1500,0:1500]
body=m(B,['#54C0FF','#449FD4','#AAE0FF','#163C52','#265D7D'])&(Y>800)&(Y<1320)
body=cv2.morphologyEx(body.astype(np.uint8),cv2.MORPH_CLOSE,np.ones((7,7),np.uint8)).astype(bool)
shade=m(B,['#163C52','#265D7D'])  # left shadow + seams on the onesie
arms=body&((X<606)|(X>922))&(Y<1095)
torso=body&~arms&(Y<1048)
legs=body&~arms&(Y>=1048)
D={}
# T-shirt: torso + short sleeves; forearms become skin
sleeve=arms&(Y<965)
D['tee']=path(clean(torso|sleeve))
D['tee_dark']=path(clean((torso|sleeve)&shade))
D['arm_skin']=path(clean(arms&(Y>=955)))
D['arm_skin_dark']=path(clean(arms&(Y>=955)&shade))
# shorts and the bare legs under them
D['shorts']=path(clean(legs&(Y<1185)))
D['shorts_dark']=path(clean(legs&(Y<1185)&shade))
D['leg_skin']=path(clean(legs&(Y>=1175)))
D['leg_skin_dark']=path(clean(legs&(Y>=1175)&shade))
# long trousers / jeans
D['jeans']=path(clean(legs))
D['jeans_dark']=path(clean(legs&shade))
# football shirt stripes (vertical bands across the torso)
stripes=(torso|sleeve)&(((X-620)//70)%2==0)
D['jersey_stripes']=path(clean(stripes,grow=1))
# shoes from the styled reference, and sock gap
dk=m(A,['#113F3D','#103B38','#113D3A'],40)
D['shoes']=path(clean(dk&(Y>1250)))
# whole-head silhouette for clipping hair and hats
head=m(B,['#FDD1A9','#FBD0A7','#E7AD84','#E9B087','#E6B18A'])&(Y<805)
D['head_all']=path(clean(head,grow=0))
# dress: tee top flowing into an A-line skirt, legs bare below
skirt=np.zeros_like(body)
pts=np.array([[600,1030],[928,1030],[985,1222],[548,1222]],np.int32)
sk=np.zeros((1500,1500),np.uint8); cv2.fillPoly(sk,[pts],1); skirt=sk.astype(bool)
dress=(torso|sleeve|skirt)
D['dress']=path(clean(dress))
D['dress_dark']=path(clean((torso|sleeve)&shade | skirt&(X<640)))
D['dress_belt']=path(clean(body&~arms&(Y>=1028)&(Y<1058),grow=1))
D['dress_legs']=path(clean(legs&(Y>=1205)))
D['dress_legs_dark']=path(clean(legs&(Y>=1205)&shade))
json.dump(D,open('derived.json','w'))
print({k:len(v) for k,v in D.items()})
