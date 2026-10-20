# Design tokens

Brand cyan stays the primary action color. The frame palette is sampled from published campaign art and is only for rings, fans, and frame treatments.

## Color

| Token | Value | Source |
| --- | --- | --- |
| `--brand` | `#01BEF6` | Ollabs cyan. Buttons and focus. |
| `--brand-deep` | `#026D94` | Text and links on paper. The lighter cyan fails 4.5:1. |
| `--frame-magenta` | `#D00060` | Pitágoras ring. |
| `--frame-green` | `#50A000` | Hugo Wanderley ring. |
| `--frame-purple` | `#9078C0` | Golden State Valkyries clouds. |
| `--frame-orange` | `#C09048` | Golden State Valkyries helmet. |

Tailwind: `bg-brand`, `text-brand-deep`, `bg-frame-magenta`, `bg-frame-green`, `bg-frame-purple`, `bg-frame-orange`.

Do not use the frame colors for body text. Green and orange sit under 4.5:1 on paper.

## Rings

- Solid: `.ring-frame-solid`. Default green. Set `--ring` to another frame token for purple, magenta, or orange.
- Conic: `.ring-frame-conic`. One turn through magenta, purple, green, and orange.

Both are a 3px pad behind a circular crop, not a stroke on the artwork.

## Avatars

| Token | Size |
| --- | --- |
| `--avatar-sm` | 120px |
| `--avatar-md` | 156px |
| `--avatar-lg` | 208px |

Radius is `--radius-avatar` (`999px`), so every size stays a circle. Tailwind: `rounded-avatar`.

## Shadow

| Token | Use |
| --- | --- |
| `--shadow-frame-sm` | Side circles in a fan. Also `.frame-fan-shadow`. |
| `--shadow-frame-md` | A single frame on the page. Also `.frame-shadow`. |
| `--shadow-frame-lg` | The front circle in a fan. |

Tailwind: `shadow-frame-sm`, `shadow-frame-md`, `shadow-frame-lg`.

## Radius

| Token | Value | Use |
| --- | --- | --- |
| `--radius-control` | 12px | Buttons. Tailwind `rounded-control`. |
| `--radius-card` | 16px | Cards. Tailwind `rounded-card`. |
| `--radius-avatar` | 999px | Photos and frames. |
