/**
 * Unit families — canonical data model.
 *
 * Every factor below was extracted verbatim from the reference site's inline
 * `convert(x)` / `OnCalc()` scripts, so answers are byte-identical to the
 * original pages (including the original's own BTU/HP rounding quirks, which
 * are captured by the per-pair `factors` overrides in pairs.js).
 *
 *   linear : y = x * (to.f / from.f)              [f in canonical base units]
 *   affine : y = x * (to.f / from.f) + (to.o - from.o * to.f / from.f)
 *
 * `expr` marks a composite unit implemented as a small function in tools.js.
 */

export const FAMILIES = {
  length: {
    title: 'Length',
    dim: 'L',
    base: 'm',
    baseName: 'meter',
    units: {
      mm:  { name: 'millimeter', symbol: 'mm', f: 0.001 },
      cm:  { name: 'centimeter', symbol: 'cm', f: 0.01 },
      dm:  { name: 'decimeter', symbol: 'dm', f: 0.1 },
      m:   { name: 'meter', symbol: 'm', f: 1 },
      km:  { name: 'kilometer', symbol: 'km', f: 1000 },
      in:  { name: 'inch', symbol: 'in', f: 0.0254 },
      ft:  { name: 'foot', symbol: 'ft', f: 0.3048 },
      yd:  { name: 'yard', symbol: 'yd', f: 0.9144 },
      mi:  { name: 'mile', symbol: 'mi', f: 1609.344 },
      nmi: { name: 'nautical mile', symbol: 'nmi', f: 1852 },
      ly:  { name: 'light year', symbol: 'ly', f: 9.4607304725808e15 },
      au:  { name: 'astronomical unit', symbol: 'AU', f: 1.495978707e11 },
      pc:  { name: 'parsec', symbol: 'pc', f: 3.0856775814913673e16 },
      ftin:{ name: 'foot and inch', symbol: "ft'", f: 1, expr: 'ftin' },
    },
  },

  mass: {
    title: 'Weight',
    dim: 'M',
    base: 'kg',
    baseName: 'kilogram',
    units: {
      mg:  { name: 'milligram', symbol: 'mg', f: 1e-6 },
      g:   { name: 'gram', symbol: 'g', f: 0.001 },
      kg:  { name: 'kilogram', symbol: 'kg', f: 1 },
      t:   { name: 'metric ton', symbol: 't', f: 1000 },
      oz:  { name: 'ounce', symbol: 'oz', f: 0.02834952 },
      lb:  { name: 'pound', symbol: 'lb', f: 0.45359237 },
      st:  { name: 'stone', symbol: 'st', f: 6.35029318 },
      ton: { name: 'short ton (US)', symbol: 'ton', f: 907.18474 },
      lt:  { name: 'long ton (UK)', symbol: 'lt', f: 1016.0469088 },
      grain:{ name: 'grain', symbol: 'gr', f: 6.479891e-5 },
      ct:  { name: 'carat', symbol: 'ct', f: 0.0002 },
      lb_oz: { name: 'pound and ounce', symbol: 'lb', f: 1, expr: 'lboz' },
    },
  },

  temperature: {
    title: 'Temperature',
    dim: 'Θ',
    base: 'celsius',
    baseName: 'Celsius',
    // Affine: base = x·f + o, where f is "how many °C in one of this unit".
    // C: 1 °C = 1 °C        · K: 1 K = 1 °C, 0 K = −273.15 °C
    // F: 1 °F = 5/9 °C, 0 °F = −17.777… °C   · R: 1 °R = 5/9 °C
    units: {
      C: { name: 'Celsius', symbol: '°C', f: 1, o: 0 },
      K: { name: 'Kelvin', symbol: 'K', f: 1, o: -273.15 },
      F: { name: 'Fahrenheit', symbol: '°F', f: 5 / 9, o: -160 / 9 },
      R: { name: 'Rankine', symbol: '°R', f: 5 / 9, o: -273.15 },
    },
    // Physical floor for absolute-zero rejection.
    minAbsolute: { C: -273.15, K: 0, F: -459.67, R: 0 },
    note: 'Temperature is affine, not linear: °F and °K have offsets, so these pairs use value = x·slope + offset rather than a plain factor.',
  },

  area: {
    title: 'Area',
    dim: 'L²',
    base: 'm2',
    baseName: 'square meter',
    units: {
      mm2: { name: 'square millimeter', symbol: 'mm²', f: 1e-6 },
      cm2: { name: 'square centimeter', symbol: 'cm²', f: 1e-4 },
      m2:  { name: 'square meter', symbol: 'm²', f: 1 },
      ha:  { name: 'hectare', symbol: 'ha', f: 10000 },
      km2: { name: 'square kilometer', symbol: 'km²', f: 1e6 },
      in2: { name: 'square inch', symbol: 'in²', f: 0.00064516 },
      ft2: { name: 'square foot', symbol: 'ft²', f: 0.09290304 },
      yd2: { name: 'square yard', symbol: 'yd²', f: 0.83612736 },
      ac:  { name: 'acre', symbol: 'ac', f: 4046.8564224 },
      mi2: { name: 'square mile', symbol: 'mi²', f: 2589988.110336 },
    },
  },

  volume: {
    title: 'Volume',
    dim: 'L³',
    base: 'l',
    baseName: 'liter',
    units: {
      ml:  { name: 'milliliter', symbol: 'mL', f: 0.001 },
      l:   { name: 'liter', symbol: 'L', f: 1 },
      m3:  { name: 'cubic meter', symbol: 'm³', f: 1000 },
      tsp: { name: 'teaspoon (US)', symbol: 'tsp', f: 0.00492892159375 },
      tbsp:{ name: 'tablespoon (US)', symbol: 'tbsp', f: 0.01478676478125 },
      floz:{ name: 'fluid ounce (US)', symbol: 'fl oz', f: 0.0295735295625 },
      cup: { name: 'cup (US)', symbol: 'cup', f: 0.2365882365 },
      pt:  { name: 'pint (US)', symbol: 'pt', f: 0.473176473 },
      qt:  { name: 'quart (US)', symbol: 'qt', f: 0.946352946 },
      gal: { name: 'gallon (US)', symbol: 'gal', f: 3.785411784 },
      galuk: { name: 'gallon (UK)', symbol: 'gal (UK)', f: 4.54609 },
      in3: { name: 'cubic inch', symbol: 'in³', f: 0.016387064 },
      ft3: { name: 'cubic foot', symbol: 'ft³', f: 28.316846592 },
      yd3: { name: 'cubic yard', symbol: 'yd³', f: 764.554857984 },
      bbl: { name: 'oil barrel', symbol: 'bbl', f: 158.987294928 },
    },
  },

  speed: {
    title: 'Speed',
    dim: 'LT⁻¹',
    base: 'mps',
    baseName: 'meters per second',
    units: {
      mps: { name: 'meters per second', symbol: 'm/s', f: 1 },
      kph: { name: 'kilometers per hour', symbol: 'km/h', f: 1 / 3.6 },
      mph: { name: 'miles per hour', symbol: 'mph', f: 0.44704 },
      fps: { name: 'feet per second', symbol: 'ft/s', f: 0.3048 },
      kn:  { name: 'knot', symbol: 'kn', f: 0.514444444444444 },
      c:   { name: 'speed of light', symbol: 'c', f: 299792458 },
      mach:{ name: 'Mach (sea level)', symbol: 'Ma', f: 340.29 },
    },
  },

  pressure: {
    title: 'Pressure',
    dim: 'ML⁻¹T⁻²',
    base: 'pa',
    baseName: 'pascal',
    units: {
      pa:   { name: 'pascal', symbol: 'Pa', f: 1 },
      kpa:  { name: 'kilopascal', symbol: 'kPa', f: 1000 },
      mpa:  { name: 'megapascal', symbol: 'MPa', f: 1e6 },
      bar:  { name: 'bar', symbol: 'bar', f: 100000 },
      mbar: { name: 'millibar', symbol: 'mbar', f: 100 },
      atm:  { name: 'standard atmosphere', symbol: 'atm', f: 101325 },
      psi:  { name: 'pound per square inch', symbol: 'psi', f: 6894.757293168361 },
      torr: { name: 'torr', symbol: 'Torr', f: 133.32236842105263 },
      mmhg:{ name: 'millimeter of mercury', symbol: 'mmHg', f: 133.322387415 },
      inhg:{ name: 'inch of mercury', symbol: 'inHg', f: 3386.388640341 },
    },
  },

  force: {
    title: 'Force',
    dim: 'MLT⁻²',
    base: 'n',
    baseName: 'newton',
    units: {
      n:   { name: 'newton', symbol: 'N', f: 1 },
      mn:  { name: 'millinewton', symbol: 'mN', f: 0.001 },
      kn:  { name: 'kilonewton', symbol: 'kN', f: 1000 },
      dy:  { name: 'dyne', symbol: 'dyn', f: 1e-5 },
      kgf: { name: 'kilogram-force', symbol: 'kgf', f: 9.80665 },
      lbf: { name: 'pound-force', symbol: 'lbf', f: 4.4482216152605 },
      pdl: { name: 'poundal', symbol: 'pdl', f: 0.138254954376 },
    },
  },

  torque: {
    title: 'Torque',
    dim: 'ML²T⁻²',
    base: 'nm',
    baseName: 'newton meter',
    units: {
      nm:    { name: 'newton meter', symbol: 'N·m', f: 1 },
      ncm:   { name: 'newton centimeter', symbol: 'N·cm', f: 0.01 },
      nmm:   { name: 'newton millimeter', symbol: 'N·mm', f: 0.001 },
      knm:   { name: 'kilonewton meter', symbol: 'kN·m', f: 1000 },
      lbfft: { name: 'pound-force foot', symbol: 'lbf·ft', f: 1.3558179483314 },
      lbfin: { name: 'pound-force inch', symbol: 'lbf·in', f: 0.1129848290276167 },
      kgfm:  { name: 'kilogram-force meter', symbol: 'kgf·m', f: 9.80665 },
    },
  },

  time: {
    title: 'Time',
    dim: 'T',
    base: 's',
    baseName: 'second',
    units: {
      ns:   { name: 'nanosecond', symbol: 'ns', f: 1e-9 },
      us:   { name: 'microsecond', symbol: 'µs', f: 1e-6 },
      ms:   { name: 'millisecond', symbol: 'ms', f: 0.001 },
      s:    { name: 'second', symbol: 's', f: 1 },
      min:  { name: 'minute', symbol: 'min', f: 60 },
      h:    { name: 'hour', symbol: 'h', f: 3600 },
      d:    { name: 'day', symbol: 'day', f: 86400 },
      wk:   { name: 'week', symbol: 'wk', f: 604800 },
      mo:   { name: 'month (30.4375 d)', symbol: 'mo', f: 2629800 },
      yr:   { name: 'year (365.25 d)', symbol: 'yr', f: 31557600 },
      dec:  { name: 'decade', symbol: 'dec', f: 315576000 },
    },
  },

  energy: {
    title: 'Energy',
    dim: 'ML²T⁻²',
    base: 'j',
    baseName: 'joule',
    units: {
      j:    { name: 'joule', symbol: 'J', f: 1 },
      kj:   { name: 'kilojoule', symbol: 'kJ', f: 1000 },
      mj:   { name: 'megajoule', symbol: 'MJ', f: 1e6 },
      gj:   { name: 'gigajoule', symbol: 'GJ', f: 1e9 },
      wh:   { name: 'watt-hour', symbol: 'Wh', f: 3600 },
      kwh:  { name: 'kilowatt-hour', symbol: 'kWh', f: 3.6e6 },
      mwh:  { name: 'megawatt-hour', symbol: 'MWh', f: 3.6e9 },
      btu:  { name: 'British thermal unit (IT)', symbol: 'BTU', f: 1055.05585262 },
      kbtu: { name: 'kilo-BTU', symbol: 'kBTU', f: 1055055.85262 },
      cal:  { name: 'thermochemical calorie', symbol: 'cal', f: 4.184 },
      kcal: { name: 'kilocalorie', symbol: 'kcal', f: 4184 },
      calk: { name: 'kilocalorie (food)', symbol: 'Cal', f: 4184 },
      ev:   { name: 'electronvolt', symbol: 'eV', f: 1.602176565e-19 },
      mev:  { name: 'megaelectronvolt', symbol: 'MeV', f: 1.602176565e-13 },
      gev:  { name: 'gigaelectronvolt', symbol: 'GeV', f: 1.602176565e-10 },
      ftlb: { name: 'foot-pound', symbol: 'ft·lb', f: 1.3558179483314 },
      tnt:  { name: 'ton of TNT', symbol: 't TNT', f: 4.184e9 },
    },
  },

  power: {
    title: 'Power',
    dim: 'ML²T⁻³',
    base: 'w',
    baseName: 'watt',
    units: {
      mw:   { name: 'milliwatt', symbol: 'mW', f: 0.001 },
      w:    { name: 'watt', symbol: 'W', f: 1 },
      kw:   { name: 'kilowatt', symbol: 'kW', f: 1000 },
      mw2:  { name: 'megawatt', symbol: 'MW', f: 1e6 },
      gw:   { name: 'gigawatt', symbol: 'GW', f: 1e9 },
      hp:   { name: 'horsepower (mechanical)', symbol: 'hp', f: 745.699872 },
      hpe:  { name: 'horsepower (electric)', symbol: 'hp (E)', f: 746 },
      hpm:  { name: 'horsepower (metric)', symbol: 'hp (M)', f: 735.49875 },
      bhp:  { name: 'boiler horsepower', symbol: 'bhp', f: 745.6998715822702 },
      va:   { name: 'volt-ampere (apparent)', symbol: 'VA', f: 1 },
      kva:  { name: 'kilovolt-ampere', symbol: 'kVA', f: 1000 },
      btuh: { name: 'BTU per hour', symbol: 'BTU/h', f: 0.2930710701722222 },
      tr:   { name: 'ton of refrigeration', symbol: 'TR', f: 3516.8525 },
    },
  },

  frequency: {
    title: 'Frequency',
    dim: 'T⁻¹',
    base: 'hz',
    baseName: 'hertz',
    units: {
      hz:  { name: 'hertz', symbol: 'Hz', f: 1 },
      khz: { name: 'kilohertz', symbol: 'kHz', f: 1e3 },
      mhz: { name: 'megahertz', symbol: 'MHz', f: 1e6 },
      ghz: { name: 'gigahertz', symbol: 'GHz', f: 1e9 },
      thz: { name: 'terahertz', symbol: 'THz', f: 1e12 },
      radps: { name: 'radian per second', symbol: 'rad/s', f: 1 / (2 * Math.PI) },
      rpm: { name: 'revolution per minute', symbol: 'rpm', f: 1 / 60 },
    },
  },

  voltage: {
    title: 'Voltage',
    dim: 'ML²T⁻³I⁻¹',
    base: 'v',
    baseName: 'volt',
    units: {
      uv:  { name: 'microvolt', symbol: 'µV', f: 1e-6 },
      mv:  { name: 'millivolt', symbol: 'mV', f: 0.001 },
      v:   { name: 'volt', symbol: 'V', f: 1 },
      kv:  { name: 'kilovolt', symbol: 'kV', f: 1000 },
      mv2: { name: 'megavolt', symbol: 'MV', f: 1e6 },
      gv:  { name: 'gigavolt', symbol: 'GV', f: 1e9 },
    },
  },

  current: {
    title: 'Current',
    dim: 'I',
    base: 'a',
    baseName: 'ampere',
    units: {
      ua:  { name: 'microampere', symbol: 'µA', f: 1e-6 },
      ma:  { name: 'milliampere', symbol: 'mA', f: 0.001 },
      a:   { name: 'ampere', symbol: 'A', f: 1 },
      ka:  { name: 'kiloampere', symbol: 'kA', f: 1000 },
    },
  },

  charge: {
    title: 'Electric charge',
    dim: 'TI',
    base: 'c',
    baseName: 'coulomb',
    units: {
      pc:   { name: 'picocoulomb', symbol: 'pC', f: 1e-12 },
      nc:   { name: 'nanocoulomb', symbol: 'nC', f: 1e-9 },
      uc:   { name: 'microcoulomb', symbol: 'µC', f: 1e-6 },
      mc:   { name: 'millicoulomb', symbol: 'mC', f: 0.001 },
      c:    { name: 'coulomb', symbol: 'C', f: 1 },
      ah:   { name: 'ampere-hour', symbol: 'Ah', f: 3600 },
      mah:  { name: 'milliampere-hour', symbol: 'mAh', f: 3.6 },
      e:    { name: 'elementary charge', symbol: 'e', f: 1.602176565e-19 },
    },
  },

  resistance: {
    title: 'Resistance',
    dim: 'ML²T⁻³I⁻²',
    base: 'ohm',
    baseName: 'ohm',
    units: {
      mohm: { name: 'milliohm', symbol: 'mΩ', f: 0.001 },
      ohm:  { name: 'ohm', symbol: 'Ω', f: 1 },
      kohm: { name: 'kilohm', symbol: 'kΩ', f: 1000 },
      mohm2:{ name: 'megohm', symbol: 'MΩ', f: 1e6 },
      gohm: { name: 'gigohm', symbol: 'GΩ', f: 1e9 },
    },
  },

  capacitance: {
    title: 'Capacitance',
    dim: 'M⁻¹L⁻²T⁴I²',
    base: 'f',
    baseName: 'farad',
    units: {
      pf:  { name: 'picofarad', symbol: 'pF', f: 1e-12 },
      nf:  { name: 'nanofarad', symbol: 'nF', f: 1e-9 },
      uf:  { name: 'microfarad', symbol: 'µF', f: 1e-6 },
      f:   { name: 'farad', symbol: 'F', f: 1 },
      mf:  { name: 'millifarad', symbol: 'mF', f: 0.001 },
    },
  },

  inductance: {
    title: 'Inductance',
    dim: 'ML²T⁻²I⁻²',
    base: 'h',
    baseName: 'henry',
    units: {
      nh: { name: 'nanohenry', symbol: 'nH', f: 1e-9 },
      uh: { name: 'microhenry', symbol: 'µH', f: 1e-6 },
      mh: { name: 'millihenry', symbol: 'mH', f: 0.001 },
      h:  { name: 'henry', symbol: 'H', f: 1 },
    },
  },

  angle: {
    title: 'Angle',
    dim: 'none',
    base: 'deg',
    baseName: 'degree',
    units: {
      deg:  { name: 'degree', symbol: '°', f: 1 },
      rad:  { name: 'radian', symbol: 'rad', f: 180 / Math.PI },
      grad: { name: 'gradian', symbol: 'gon', f: 0.9 },
      turn: { name: 'turn', symbol: 'turn', f: 360 },
      arcmin: { name: 'arcminute', symbol: "'", f: 1 / 60 },
      arcsec: { name: 'arcsecond', symbol: '"', f: 1 / 3600 },
      mil:  { name: 'NATO mil', symbol: 'mil', f: 360 / 6400 },
    },
  },

  data: {
    title: 'Data storage',
    dim: 'none',
    base: 'b',
    baseName: 'byte',
    units: {
      bit: { name: 'bit', symbol: 'bit', f: 0.125 },
      b:   { name: 'byte', symbol: 'B', f: 1 },
      kb:  { name: 'kilobyte (10³)', symbol: 'kB', f: 1e3 },
      kib: { name: 'kibibyte (2¹⁰)', symbol: 'KiB', f: 1024 },
      mb:  { name: 'megabyte (10⁶)', symbol: 'MB', f: 1e6 },
      mib: { name: 'mebibyte (2²⁰)', symbol: 'MiB', f: 1048576 },
      gb:  { name: 'gigabyte (10⁹)', symbol: 'GB', f: 1e9 },
      gib: { name: 'gibibyte (2³⁰)', symbol: 'GiB', f: 1073741824 },
      tb:  { name: 'terabyte (10¹²)', symbol: 'TB', f: 1e12 },
      tib: { name: 'tebibyte (2⁴⁰)', symbol: 'TiB', f: 1099511627776 },
      pb:  { name: 'petabyte (10¹⁵)', symbol: 'PB', f: 1e15 },
      pib: { name: 'pebibyte (2⁵⁰)', symbol: 'PiB', f: 1125899906842624 },
    },
  },

  concentration: {
    title: 'Concentration',
    dim: 'none',
    base: 'ratio',
    baseName: 'fraction',
    units: {
      frac:  { name: 'fraction', symbol: '', f: 1 },
      pct:   { name: 'percent', symbol: '%', f: 0.01 },
      permil:{ name: 'per mille', symbol: '‰', f: 0.001 },
      ppm:   { name: 'parts per million', symbol: 'ppm', f: 1e-6 },
      ppb:   { name: 'parts per billion', symbol: 'ppb', f: 1e-9 },
      ppt:   { name: 'parts per trillion', symbol: 'ppt', f: 1e-12 },
    },
  },

  light: {
    title: 'Light',
    dim: 'none',
    base: 'lm',
    baseName: 'lumen',
    units: {
      lm:   { name: 'lumen', symbol: 'lm', f: 1 },
      klm:  { name: 'kilolumen', symbol: 'klm', f: 1000 },
      cd:   { name: 'candela', symbol: 'cd', f: 1, note: 'intensity — use the photometry calculator for lux/lumen relations' },
      lx:   { name: 'lux', symbol: 'lx', f: 1, note: 'illuminance — see photometry calculator' },
      fc:   { name: 'footcandle', symbol: 'fc', f: 10.76391041671, note: 'illuminance' },
    },
  },
};

/** Illuminance family uses its own true base (lux) so the numbers are real. */
FAMILIES.illuminance = {
  title: 'Illuminance',
  dim: 'none',
  base: 'lx',
  baseName: 'lux',
  units: {
    lx:  { name: 'lux', symbol: 'lx', f: 1 },
    klx: { name: 'kilolux', symbol: 'klx', f: 1000 },
    mlx: { name: 'millilux', symbol: 'mlx', f: 0.001 },
    fc:  { name: 'footcandle', symbol: 'fc', f: 10.76391041671 },
    ph:  { name: 'phot', symbol: 'ph', f: 10000 },
    nox: { name: 'nox', symbol: 'nox', f: 0.001 },
  },
};

export const FAMILY_IDS = Object.keys(FAMILIES);

/** Lookup helpers ---------------------------------------------------------- */
export const familyOf = (id) => FAMILIES[id];
export const unitKeys = (id) => Object.keys(FAMILIES[id].units);
export const unit = (id, key) => FAMILIES[id].units[key];
export const unitName = (id, key) => FAMILIES[id].units[key]?.name ?? key;
export const unitSymbol = (id, key) => FAMILIES[id].units[key]?.symbol ?? key;

/** Convenience list for the tool catalogue UI. */
export const FAMILY_TITLES = FAMILY_IDS.map((id) => ({ id, title: FAMILIES[id].title, count: unitKeys(id).length }));
