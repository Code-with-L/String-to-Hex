<div align="center">

# HexKit

**String → Hex, and every base in between.**
Plus 50+ unit converters and calculators that work offline, on any screen, and install as an app.

[![Tests](https://github.com/Code-with-L/String-to-Hex/actions/workflows/tests.yml/badge.svg)](https://github.com/Code-with-L/String-to-Hex/actions/workflows/tests.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![No dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](package.json)
[![Offline](https://img.shields.io/badge/PWA-offline--first-7c5cff.svg)](manifest.webmanifest)

</div>

---

## What it is

Paste text, get the bytes.

```
"Plant trees"  →  50 6C 61 6E 74 20 74 72 65 65 73
```

HexKit is a from-scratch rebuild of the classic RapidTables converter set — the same
functionality and the same answers, wrapped in software that is installable, offline-first,
responsive from a 320 px phone to a 4K monitor, and free of the ad scripts and 15 Bootstrap
copies that used to come with it.

Everything runs in the browser. There is no backend, no telemetry and no network call after
the first load.

## Highlights

| | |
|---|---|
| **Universal base matrix** | Text ⇄ Hex ⇄ Binary ⇄ Decimal ⇄ Octal ⇄ Base64 — all 36 ordered pairs |
| **~45 character encodings** | UTF-8, UTF-16 LE/BE, Latin-1, ASCII, code points, plus 30 legacy Windows/ISO/KOI/Shift-JIS/Big5/GB/EUC charsets |
| **Forgiving hex input** | Accepts `0x41`, `\x41`, `%41`, `41,42`, `41:42`, quoted strings — anything a paste buffer throws at it |
| **Byte inspector** | Hex dump with offset, hex and ASCII columns |
| **Mathematical working** | Every result shows its derivation: `65 = 4·16¹ + 1·16⁰` |
| **Exact integer maths** | Base arithmetic runs on `BigInt`, so 64-bit and larger values are never rounded |
| **55 calculators** | Ohm's law, voltage divider, three-phase power, AWG, statistics, quadratic roots, mortgage, GPA, colour, photometry, hashing, passwords and more |
| **24 unit families, 202 units** | Length, mass, temperature, area, volume, speed, pressure, force, torque, time, energy, power, frequency, V/I/R/C/L, angle, data, concentration, illuminance |
| **PWA** | Installable on phone and laptop, works with no connection |
| **Zero dependencies** | No framework, no bundler, no CDN — 9 hand-written ES modules |

## Quick start

```bash
git clone https://github.com/Code-with-L/String-to-Hex.git
cd String-to-Hex
npm start          # → http://localhost:5173
```

There is no build step. `npm start` only runs a static file server, which is needed because
service workers do not register from `file://` URLs.

```bash
npm test           # 62 tests: engine values + view rendering
npm run check      # tests + project validation (manifest, SW, data, syntax)
npm run verify     # everything, plus a real headless-Chrome pass
npm run icons      # regenerate the PNG icon set from icons/icon.svg
```

`npm run verify` drives Chrome over the DevTools Protocol and asserts that the page
boots without console errors, converts `"Plant trees"` to the reference hex, registers a
service worker that precaches the shell, **still converts with the network switched off**,
and has no horizontal overflow at 320, 390, 768, 1024, 1440 and 2560 px.

## Deploying

The repository is a static site — any static host works.

**GitHub Pages** — Settings → Pages → Deploy from a branch → `main` / root.

**Netlify / Vercel / Cloudflare Pages** — build command: *(none)*, publish directory: `/`.

Remember that a service worker needs `https://` (or `localhost`). On plain `http://` it will
silently decline to register and the app still works — it just will not install.

## Installing as an app

- **Chrome / Edge / Android** — the **Install** button in the header, or the address-bar install icon.
- **iOS / iPadOS** — Safari → Share → **Add to Home Screen**.
- **Desktop** — Chrome/Edge → install icon in the address bar → *Install HexKit*.

Once installed it launches in its own window, honours the manifest shortcuts
(text→hex, hex→text, calculators), and keeps working offline.

## Project layout

```
index.html               app shell
manifest.webmanifest     PWA manifest
sw.js                    service worker (precache + runtime cache)
css/app.css              design system: tokens, layout, components
js/
  app.js                 bootstrap: theme, routing, PWA install, shortcuts
  core/convert.js        unit conversion engine (linear + affine)
  data/units.js          unit families and their reference factors
  data/tools.js          50+ calculators, one pure function each
  data/formats.js        text ⇄ bytes ⇄ hex/bin/dec/oct/base64, checksums
  data/ascii.js          ASCII tables and per-character breakdown
  ui/dom.js              DOM helpers, formatting, storage
  ui/router.js           hash router
  ui/views.js            every page view
scripts/
  serve.mjs              zero-dependency dev server
  validate.mjs           manifest / SW / data / syntax integrity checks
  make-icons.mjs         pure-Node PNG icon generator
  verify-browser.mjs     headless-Chrome pass (offline, layout, console)
tests/
  engine.test.js         engine values asserted against the reference
  views.test.js          every page rendered and asserted in a DOM shim
  dom-shim.js            minimal DOM so views can run under Node
```

### Why it is shaped like this

The reference site was 1,222 near-identical HTML files, each carrying its own inline
`function convert(x){ return x*FACTOR }`. That cannot be maintained or tested. Here a unit is
a row in a table:

```js
in: { name: 'inch', symbol: 'in', f: 0.0254 }
```

and a calculator is a pure function returning `{ values, steps, outputs }`. The UI is a thin
renderer over both. That is why the whole surface — every unit pair, every calculator — is
covered by one test suite.

## Correctness

Conversion factors and formulas were transcribed verbatim from the reference implementation,
including its own rounding choices. Two examples that are deliberately preserved:

- `1 lb = 16.000001763… oz` — the reference defines an ounce as `0.02834952 kg` rather than
  `lb/16`, and HexKit does not "fix" it.
- `1 kW = 3412.141633 BTU/h` and `1 kWh = 3412.1416416 BTU` — two different constants in the
  original, both kept.

`tests/engine.test.js` asserts these against the reference's own worked examples, e.g.
`"Plant trees" → 50 6C 61 6E 74 20 74 72 65 65 73` and
`"Example" → 01000101 01111000 01100001 01101101 01110000 01101100 01100101`.

## Privacy

No accounts, no analytics, no cookies. The only persisted state is your theme and the
encoding you last used, in `localStorage`. You can confirm it: open DevTools → Application →
Local Storage, or turn off your network and keep converting.

## Accessibility

Semantic landmarks, a skip link, labelled controls, `aria-live` for results, visible focus
rings, and full `prefers-reduced-motion` and `prefers-color-scheme` support. The layout is a
single responsive column on a phone and multi-column from 900 px up.

## Keyboard

| Shortcut | Action |
|---|---|
| `Ctrl`/`⌘` + `K` | Jump to the converter |
| `Ctrl`/`⌘` + `Enter` | Copy the converter output |
| `Ctrl`/`⌘` + `/` | Toggle light/dark theme |

## Browser support

Any browser with ES modules, `BigInt`, `TextDecoder`, CSS custom properties and
`color-mix()` — Chrome/Edge 111+, Firefox 113+, Safari 16.4+. Older browsers still get a
readable page; only the gradients and colour-mix accents are lost.

## Contributing

1. `npm test` before you open a PR.
2. A unit goes in `js/data/units.js` with its factor **and a citation-free comment** saying
   where the constant comes from.
3. A calculator goes in `js/data/tools.js` as a pure `compute(values)` function. Return
   human-readable `steps` — showing the working is a feature.
4. Run `npm run check`.

## Credits

Formulas and conversion constants derive from the RapidTables calculator set. This
implementation is original; no code was copied from it. Icons are generated from scratch by
`scripts/make-icons.mjs`.

## License

[MIT](LICENSE) © 2026 Leon (Code-with-L)
