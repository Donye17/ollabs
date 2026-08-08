# Frame edges and the circular crop

Every platform crops a profile picture to a circle. Artwork drawn to fill a
square canvas can sit outside that circle and get sliced.

**Do not fix this with a uniform inset.** A square canvas touches its inscribed
circle at four points: top, bottom, left, right. Artwork at those points is
already inside. Only the diagonals overflow. Scaling the whole image down to
rescue the diagonals pulls the top and bottom away from the edge too, and leaves
a dead ring around the artwork.

## Measure before deciding

```python
from PIL import Image
import numpy as np

a = np.array(Image.open(src).convert("RGBA"))[:, :, 3]
h, w = a.shape
cy, cx = (h - 1) / 2, (w - 1) / 2
ys, xs = np.nonzero(a > 40)
r = np.sqrt((xs - cx) ** 2 + (ys - cy) ** 2)
out = r > w / 2

# where is the overflow, in degrees?
ang = (np.degrees(np.arctan2(-(ys[out] - cy), xs[out] - cx)) + 360) % 360
```

If the overflow clusters at the diagonals (roughly 45, 135, 225, 315 degrees)
and the axes are clean, **ship at full size**. The composition was drawn to fill
the canvas and the corners were always going to be cropped.

If artwork overflows on the axes, the source file needs fixing, not the export.

## What happened with the s'mores frame

It shipped inset 10%, then 5%, and both were wrong. The measurement showed all
39,593 overflowing pixels sat in four clusters at 30-60, 120-150, 210-240 and
300-330 degrees: the four graham crackers. The axes had fewer than 250 pixels
between them, so the top banner and the bottom campfire were never outside the
circle at all.

Shipped at full size. The crop trims a sliver from the outer corner of each
graham cracker, about 2% of the artwork, which is what the composition intended.
