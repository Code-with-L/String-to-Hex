/**
 * Unit conversion engine.
 *   linear families : y = x · (f_to / f_from)
 *   affine families : y = (x − o_from) · (f_to / f_from) + o_to
 * Composite units (`ftin`, `lb_oz`) and logarithmic units (AWG) are delegated
 * to the tools module, so every answer traces back to an explicit formula.
 */

import { FAMILIES } from '../data/units.js';

export class ConversionError extends Error {}

/** Slope + offset of one unit relative to the family base. */
export function unitTransform(family, key) {
  const u = FAMILIES[family].units[key];
  if (!u) throw new ConversionError(`Unknown unit "${key}" in family "${family}".`);
  if (u.f === 1 && u.o === undefined) return { slope: 1, offset: 0 };
  return { slope: u.f ?? 1, offset: u.o ?? 0 };
}

/**
 * Convert a numeric value between two units of the same family.
 *
 * Every family is reduced to its canonical base unit first:
 *
 *   base = x · slopeFrom + offsetFrom
 *   y    = (base − offsetTo) / slopeTo
 *
 * For linear families the offsets are zero, so this collapses to the usual
 * x · (f_to / f_from). Temperature uses the general form.
 *
 * `options.composite` supplies the operands of a composite unit
 * (e.g. { ft: 5, in: 8 } for foot-and-inch).
 */
export function convertValue(family, from, to, x, options = {}) {
  const F = FAMILIES[family];
  if (!F) throw new ConversionError(`Unknown family "${family}".`);
  const a = F.units[from];
  const b = F.units[to];
  if (!a) throw new ConversionError(`Unknown unit "${from}" in family "${family}".`);
  if (!b) throw new ConversionError(`Unknown unit "${to}" in family "${family}".`);
  if (a.expr || b.expr) return convertComposite(family, from, to, x, options);

  if (F.minAbsolute && F.minAbsolute[from] !== undefined && x < F.minAbsolute[from]) {
    throw new ConversionError(`${a.name} cannot be below ${F.minAbsolute[from]} (absolute zero).`);
  }

  const slopeFrom = a.f ?? 1;
  const offsetFrom = a.o ?? 0;
  const slopeTo = b.f ?? 1;
  const offsetTo = b.o ?? 0;

  const base = x * slopeFrom + offsetFrom;
  return (base - offsetTo) / slopeTo;
}

/** Composite/complex unit pairs delegate to a registered handler. */
const COMPOSITE = {
  'length:ftin': (to, x, opts) => {
    // x is a base-metre value; produce { ft, in } or a formatted string.
    const totalIn = x / 0.0254;
    const neg = totalIn < 0;
    const abs = Math.abs(totalIn);
    const ft = Math.floor(abs / 12);
    const inch = +(abs - ft * 12).toFixed(4);
    const sign = neg ? '-' : '';
    return to === 'ftin' ? `${sign}${ft}′ ${inch}″` : x / (FAMILIES.length.units[to].f ?? 1);
  },
  'mass:lb_oz': (to, x) => {
    const totalOz = x / 0.02834952;
    const neg = totalOz < 0;
    const abs = Math.abs(totalOz);
    const lb = Math.floor(abs / 16);
    const oz = +(abs - lb * 16).toFixed(4);
    return to === 'lb_oz' ? `${neg ? '-' : ''}${lb} lb ${oz} oz` : x;
  },
};

function convertComposite(family, from, to, x) {
  const key = `${family}:${from === 'ftin' || from === 'lb_oz' ? from : to}`;
  const fn = COMPOSITE[key];
  if (fn) return fn(to, x);
  // Non-composite side: normalise through the base unit.
  const F = FAMILIES[family];
  if (F.units[from].expr) return x; // composite source already resolved upstream
  const target = F.units[to].expr ? from : to;
  const slopeTo = F.units[to].f ?? 1;
  const offsetTo = F.units[to].o ?? 0;
  const y = (x - offsetTo) / slopeTo;
  const handler = COMPOSITE[`${family}:${to}`];
  return handler ? handler(target, y) : y;
}

/** All convertible pairs within a family, used to build the page catalogue. */
export function pairsFor(family) {
  const keys = Object.keys(FAMILIES[family].units).filter((k) => !FAMILIES[family].units[k].expr);
  const out = [];
  for (const a of keys) for (const b of keys) if (a !== b) out.push([a, b]);
  return out;
}

/** Reverse a conversion by swapping units. */
export const inverse = (value, to, from) => convertValue(FAMILIES && value, to, from, 0) ?? 0;
