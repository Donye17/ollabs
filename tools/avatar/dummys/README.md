# Dummys, the first avatar collection

Source for the Dummys art. Everything here regenerates the parts; nothing in it runs in the app.

- `reference/base.png` and `reference/styled.png` are the original art the collection is traced from.
- `trace.py` traces the references into vector paths (`traced.json`). The styled image is shifted 21px right to line up with the base.
- `derive.py` builds new outfits from the base body silhouette (`derived.json`).
- `parts.py` holds every part as an SVG fragment with color placeholders, plus the skin, hair and clothing palettes.
- `render.py` composes a config into one SVG and renders a preview sheet.

Canvas is 1500x1500. Face centre x=804, eyes at (636,477) and (972,477).
Layer order: background, hair back, limbs, outfit, head, brows, eyes, mouth, facial hair, hair, hat, glasses.
