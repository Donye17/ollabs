import json, subprocess, numpy as np
from PIL import Image
T = json.load(open('traced.json')); D = json.load(open('derived.json'))
SRC = {**T, **D}
_cache = {}
def pmask(name):
    if name in _cache: return _cache[name]
    d = SRC[name]
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1500" viewBox="0 0 1500 1500"><rect width="1500" height="1500" fill="#fff"/><path d="{d}" fill="#000" fill-rule="evenodd"/></svg>'
    open('/tmp/pm.svg','w').write(svg)
    subprocess.run(['rsvg-convert','-w','1500','-h','1500','/tmp/pm.svg','-o','/tmp/pm.png'],check=True)
    m = np.array(Image.open('/tmp/pm.png').convert('L')) < 128
    _cache[name] = m
    return m
