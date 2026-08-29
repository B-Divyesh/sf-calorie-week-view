# Calorie Week View — visual system

## Direction: topographic cartography

The interface treats a week as terrain to read, not a score to beat. Contour lines
show gradual change; small coordinate labels make dates and totals easy to locate.
The visual language is quiet and field-ready, with no streaks, confetti, red penalty
states, or medical imagery.

## Palette

Light mode is "field paper" and dark mode is "night survey".

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--paper` | `#F4F0E5` | `#17211D` | page ground |
| `--surface` | `#FFFCF4` | `#202D27` | working surfaces |
| `--ink` | `#173C35` | `#F4F0E5` | primary text |
| `--muted` | `#536760` | `#B5C5BC` | supporting text |
| `--line` | `#B8B9A8` | `#516259` | rules and contours |
| `--moss` | `#2D6A4F` | `#8BC6A7` | actions, in-range state |
| `--ochre` | `#A14E16` | `#F2A66F` | highlights and focus |
| `--water` | `#22667A` | `#83CADD` | weight trend |
| `--danger` | `#9B2C2C` | `#FF9B96` | destructive actions/errors |

All body text combinations meet 4.5:1 contrast. Status never relies on color:
labels and hatch patterns accompany every band state.

## Type and spacing

- Display and numeric face: self-hosted `Atkinson Hyperlegible`, bold and tabular.
- Body face: the same family at regular weight. One family keeps the utility fast;
  its open letterforms suit dense dates and numbers.
- Type steps: 14, 16, 20, 26, 36, and 52 px with fluid headline scaling.
- Spacing follows an 8 px base: 4, 8, 16, 24, 32, 48, 64, and 96 px.
- Text measure stops at 68 characters. Controls are at least 44 px tall.

## Shape, depth, and interaction

Panels resemble cropped map sheets: 2 px rules, 14 px corners, and offset ochre or
green shadows. Charts have coordinate ticks, contour hatching, and direct labels.
Primary buttons look like survey stamps. Links stay underlined. Focus uses a 3 px
ochre outline with a 3 px gap.

The live app is the visual centerpiece. On phones, week summaries precede the chart,
the table becomes day sheets, and editing uses a full-width dialog. Decorative contour
art is cropped before it can compete with controls.

## Motion policy

The signature motion is a single contour trace when a week changes: lines reveal from
left to right over 280 ms, as if a route is being drawn. Panels fade for 180 ms from
their source. Nothing loops. With `prefers-reduced-motion: reduce`, all transitions and
line tracing are instant; hierarchy remains through scale, rules, and hatching.

## Asset plan and provenance

- `public/art/weekly-terrain.webp`: original generated editorial topographic still.
  It establishes the map-world beside the first screen without pretending to show
  product output. The app chart itself is native SVG with an accessible text summary.
- `public/art/social-card.png`: a 1200×630 crop composed from the same original art.
- Favicon and install icons: original hand-authored contour mark, rasterized locally.

Prompt sheet:

> Use case: stylized-concept. Asset type: landing hero background. An abstract
> topographic survey map of one gentle seven-ridge landscape seen from directly above,
> layered cut-paper contours, fine ink elevation lines, tiny coordinate ticks with no
> readable text, a calm field notebook mood. Palette: warm field-paper cream, forest
> green, muted moss, burnt ochre, one slate-blue river line. Soft raking studio light,
> tactile paper fibers, generous quiet areas, editorial still life, wide composition.
> No people, food, scales, numbers, letters, logos, brands, gradients, neon, medical
> symbols, UI mockup, watermark, or readable text.

Generated with the factory image deployment on 2026-08-28. The resulting art is
original for this product. Prompts are stored beside the source image. Icons and chart
graphics are authored in this repository under the MIT license.
`assets/src/weekly-terrain.provenance.json` binds the reviewed source and each
published derivative by SHA-256 for the public provenance claim.

## Why this fits

Weekly calorie and weight changes are uneven terrain, not pass/fail marks. Cartography
makes missing observations visible as blank ground and makes the chosen calorie range
a band users can interpret without judgment. The restrained paper palette also prints
cleanly for a weekly review.
