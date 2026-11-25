import cv2, numpy as np, json
def load(p): return cv2.cvtColor(cv2.imread(p), cv2.COLOR_BGR2RGB).astype(int)
A=load('reference/styled.png')
B=load('reference/base.png')
A=np.roll(A,21,axis=1)  # align styled image onto the base
def m(im,cols,tol=34):
    out=np.zeros(im.shape[:2],bool)
    for h in cols:
        c=np.array([int(h[i:i+2],16) for i in (1,3,5)])
        out|=(np.abs(im-c).sum(axis=2)<tol)
    return out
def clean(mk,k=3,grow=2):
    mk=mk.astype(np.uint8)*255
    mk=cv2.morphologyEx(mk,cv2.MORPH_CLOSE,np.ones((k,k),np.uint8))
    mk=cv2.morphologyEx(mk,cv2.MORPH_OPEN,np.ones((k,k),np.uint8))
    if grow: mk=cv2.dilate(mk,np.ones((2*grow+1,2*grow+1),np.uint8))
    return mk
def path(mk,eps=1.2,minarea=40):
    cs,h=cv2.findContours(mk,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE)
    d=[]
    for c in cs:
        if cv2.contourArea(c)<minarea: continue
        a=cv2.approxPolyDP(c,eps,True).reshape(-1,2)
        d.append('M'+' L'.join(f'{x},{y}' for x,y in a)+'Z')
    return ' '.join(d)
ys=np.arange(1500)[:,None]*np.ones((1,1500))
SKL=['#FDD1A9','#FBD0A7','#FDDCBE','#FEE8D4']; SKD=['#E7AD84','#E9B087','#E6B18A']
L={}
skinB=m(B,SKL); shB=m(B,SKD)
L['head_light']=path(clean(skinB&(ys<800)))
L['head_shadow']=path(clean(shB&(ys<820)))
L['limb_light']=path(clean(skinB&(ys>=1000)))
L['limb_shadow']=path(clean(shB&(ys>=1000)))
L['onesie']=path(clean(m(B,['#54C0FF','#449FD4','#AAE0FF'])))
L['onesie_dark']=path(clean(m(B,['#163C52','#265D7D'])))
L['onesie_patch']=path(clean(m(B,['#FFFFFF'])&(ys>850)&(ys<960)&(np.arange(1500)[None,:]>700)&(np.arange(1500)[None,:]<850)),minarea=10)
DK=['#113F3D','#103B38','#113D3A','#0F3A37']
dk=m(A,DK,40)
L['brows_a']=path(clean(dk&(ys<425)))
L['eyes_a']=path(clean(dk&(ys>=425)&(ys<540),k=1,grow=0),eps=0.8,minarea=4)
L['shoes_a']=path(clean(dk&(ys>1250)))
L['mustache_a']=path(clean(m(A,['#C89948','#C99A4A'],40)&(ys<760)))
L['sweater']=path(clean(m(A,['#0A9875','#0B9874','#0C9A77'])))
L['sweater_dark']=path(clean(m(A,['#057058','#0A6C57','#07725A'])))
L['pants']=path(clean(m(A,['#573F33','#58402F'],12)))
L['pants_dark']=path(clean(m(A,['#48352C','#4A372D'],12)))
# skin seen in A below the head (hands) for outfit A, to check alignment
for k,v in L.items(): print(k,len(v))
json.dump(L,open('traced.json','w'))
