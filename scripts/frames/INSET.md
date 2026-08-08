# Frame inset rule

Illustrated frames drawn to fill a square canvas need a small inset before
shipping. The outermost artwork sits past the inscribed circle, and every
platform crops a profile picture to that circle, so those pieces get sliced
flat.

**Do not guess the amount.** Measure it:

```python
from PIL import Image
import numpy as np

im = Image.open(src).convert("RGBA")
a = np.array(im)[:, :, 3]
h, w = a.shape
cy, cx = (h - 1) / 2, (w - 1) / 2
ys, xs = np.nonzero(a > 40)
r = np.sqrt((xs - cx) ** 2 + (ys - cy) ** 2)

scale = (w / 2) / r.max() * 0.995   # 0.995 is tolerance, nothing more
```

Then resize by `scale` and centre it on the original canvas size.

Verify after: no opaque pixel should sit outside the inscribed circle, and the
outermost should land around 99.5% of its radius. Below about 98% you start
seeing a dead ring.

## Why this is written down

The s'mores frame needed **5.1%**. It shipped at a round **10%**, which left a
visible gap between the artwork and the edge of the photo window and read as a
mistake rather than as breathing room. The measured minimum is the right answer;
anything past it is wasted canvas.
