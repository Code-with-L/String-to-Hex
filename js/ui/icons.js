/**
 * Hand-drawn SVG assets.
 *
 * The reference site drew its circuit symbols as 383 loose GIF files. These are
 * redrawn as clean, themeable, resolution-independent SVG so they inherit
 * `currentColor` and stay crisp at any zoom.
 */

const svg = (paths, { viewBox = '0 0 120 60', label = '' } = {}) => {
  const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  node.setAttribute('viewBox', viewBox);
  node.setAttribute('fill', 'none');
  node.setAttribute('stroke', 'currentColor');
  node.setAttribute('stroke-width', '2');
  node.setAttribute('stroke-linecap', 'round');
  node.setAttribute('stroke-linejoin', 'round');
  node.setAttribute('role', 'img');
  if (label) { node.setAttribute('aria-label', label); }
  node.innerHTML = paths;
  return node;
};

/* ── circuit symbols (IEC/ANSI hybrid, as on the reference pages) ─────── */

export const SYMBOLS = {
  resistor: {
    label: 'Resistor',
    note: 'IEC box',
    svg: svg('<path d="M6 30h16v-16h36v32h36V30h20"/>'),
  },
  resistorUs: {
    label: 'Resistor (ANSI)',
    note: 'zig-zag',
    svg: svg('<path d="M6 30h14l6-12 10 24 10-24 10 24 10-24 10 24 8-12h20"/>'),
  },
  capacitor: {
    label: 'Capacitor',
    note: 'two plates',
    svg: svg('<path d="M6 30h48M66 30h48M48 16v28M66 16v28"/>'),
  },
  capacitorPol: {
    label: 'Polarised capacitor',
    note: 'curved plate',
    svg: svg('<path d="M6 30h48M72 30h42M48 16v28M66 20a16 16 0 0 1 0 20"/>'),
  },
  inductor: {
    label: 'Inductor',
    note: 'coil',
    svg: svg('<path d="M6 30h14a9 9 0 0 1 18 0 9 9 0 0 1 18 0 9 9 0 0 1 18 0 9 9 0 0 1 18 0h22"/>'),
  },
  inductorCore: {
    label: 'Inductor with core',
    note: 'coil over iron',
    svg: svg('<path d="M6 34h12a9 9 0 0 1 18 0 9 9 0 0 1 18 0 9 9 0 0 1 18 0 9 9 0 0 1 18 0h20M24 16v10M72 16v10"/>'),
  },
  diode: {
    label: 'Diode',
    note: 'triangle to bar',
    svg: svg('<path d="M6 30h42M48 16l28 14-28 14zM76 16v28M76 30h38"/>'),
  },
  zener: {
    label: 'Zener diode',
    note: 'bent cathode bar',
    svg: svg('<path d="M6 30h42M48 16l28 14-28 14zM76 14v32M82 20h-6M82 40h-6M82 20h24v20H82"/>'),
  },
  led: {
    label: 'LED',
    note: 'diode + arrows',
    svg: svg('<path d="M6 30h38M44 18l22 12-22 12zM66 18v24M66 30h48M74 10l8-6M86 14l8-6M78 18l8-6M90 22l8-6"/>'),
  },
  photodiode: {
    label: 'Photodiode',
    note: 'incoming arrows',
    svg: svg('<path d="M6 30h40M46 18l22 12-22 12zM68 18v24M68 30h46M78 8l8 6M90 4l8 6M82 16l8 6"/>'),
  },
  transistorNpn: {
    label: 'NPN transistor',
    note: 'arrow out',
    svg: svg('<path d="M40 12v36M40 24h18M40 38h18M58 24l14-10M58 24v14M72 24l-10 8 10 8M72 24h14M72 38h16"/>'),
  },
  transistorPnp: {
    label: 'PNP transistor',
    note: 'arrow in',
    svg: svg('<path d="M40 12v36M40 24h18M40 38h18M58 24l14-10M58 24v14M72 24l10-8-10-8M72 24h14M72 38h16"/>'),
  },
  fet: {
    label: 'MOSFET',
    note: 'insulated gate',
    svg: svg('<path d="M34 14v32M34 24h14M34 36h14M48 16v10M48 34v10M62 20v24M62 20h20M62 44h20M62 32h20"/>'),
  },
  switch: {
    label: 'Switch (SPST)',
    note: 'open contact',
    svg: svg('<path d="M6 34h30M48 34h30M30 34L52 16"/>'),
  },
  switchSpst: {
    label: 'Switch, normally open',
    note: 'open blade',
    svg: svg('<path d="M6 34h28M56 34h28M30 34L52 14"/><circle cx="30" cy="34" r="3.5" fill="currentColor" stroke="none"/><circle cx="56" cy="34" r="3.5" fill="currentColor" stroke="none"/>'),
  },
  switchSpdt: {
    label: 'SPDT (changeover)',
    note: 'one common, two paths',
    svg: svg('<path d="M10 14h18M10 34h30L54 16"/><circle cx="38" cy="34" r="3.2" fill="currentColor" stroke="none"/><circle cx="66" cy="14" r="3.2" fill="currentColor" stroke="none"/><circle cx="66" cy="34" r="3.2" fill="currentColor" stroke="none"/>'),
  },
  pushbuttonNo: {
    label: 'Pushbutton (NO)',
    note: 'momentary normally-open',
    svg: svg('<path d="M6 24h40M54 24h40M54 32v-16M46 24v-14"/><circle cx="54" cy="50" r="3.2" fill="currentColor" stroke="none"/><path d="M54 44v10"/>'),
  },
  pushbuttonNc: {
    label: 'Pushbutton (NC)',
    note: 'momentary normally-closed',
    svg: svg('<path d="M6 24h18v-14M82 24h42"/><circle cx="54" cy="24" r="3.2" fill="currentColor" stroke="none"/><circle cx="24" cy="24" r="3.2" fill="currentColor" stroke="none"/><path d="M54 16v-12M30 16h48M24 20v10M54 20v10"/>'),
  },
  relaySpdt: {
    label: 'Relay (SPDT)',
    note: 'changeover contacts',
    svg: svg('<path d="M10 14h18M10 46h30L54 28"/><circle cx="54" cy="28" r="3.2" fill="currentColor" stroke="none"/><circle cx="66" cy="14" r="3.2" fill="currentColor" stroke="none"/><circle cx="66" cy="46" r="3.2" fill="currentColor" stroke="none"/><path d="M82 14l-8 12M82 46l-8-12"/>'),
  },
  ground: {
    label: 'Ground',
    note: 'three bars',
    svg: svg('<path d="M60 10v28M38 38h44M44 46h32M50 54h20"/>'),
  },
  groundEarth: {
    label: 'Protective earth',
    note: 'hatched earth',
    svg: svg('<path d="M60 10v30M40 40h40M46 46l-6 8M56 46l-6 8M66 46l-6 8M76 46l-6 8"/>'),
  },
  battery: {
    label: 'Battery cell',
    note: 'long/short plate',
    svg: svg('<path d="M6 30h44M50 18v24M62 10v40M62 30h52"/>'),
  },
  dcSource: {
    label: 'DC voltage source',
    note: 'circle with +−',
    svg: svg('<circle cx="60" cy="30" r="20"/><path d="M6 30h40M74 30h40M52 24h16M52 34h16M60 20v-8M60 40v8"/>'),
  },
  acSource: {
    label: 'AC source',
    note: 'sine in circle',
    svg: svg('<circle cx="60" cy="30" r="20"/><path d="M6 30h40M74 30h40M50 30c3-10 7-10 10 0s7 10 10 0"/>'),
  },
  lamp: {
    label: 'Lamp',
    note: 'bulb',
    svg: svg('<path d="M6 46h34M80 46h34"/><circle cx="60" cy="30" r="20"/><path d="M50 44h20M52 50h16M56 56h8M52 20l16 20M68 20L52 40"/>'),
  },
  fuse: {
    label: 'Fuse',
    note: 'cartridge',
    svg: svg('<path d="M6 30h30M42 18v24M78 18v24M84 30h30M42 30h36"/>'),
  },
  wire: {
    label: 'Wire / conductor',
    note: 'conductor',
    svg: svg('<path d="M6 30h108"/>'),
  },
  resistorPot: {
    label: 'Potentiometer',
    note: 'resistor + wiper',
    svg: svg('<path d="M6 30h12v-14h28v28h28V30h12M40 44l20-26"/>'),
  },
  trimmer: {
    label: 'Trimmer resistor',
    note: 'preset, small',
    svg: svg('<path d="M6 30h10v-14h28v28h28V30h16"/><path d="M40 14l8 8M44 12v6M36 20l8-8"/>'),
  },
  thermistor: {
    label: 'Thermistor',
    note: 'resistor vs temperature',
    svg: svg('<path d="M6 30h10v-14h44v28h28V30h16"/><path d="M36 12v4M36 44v4M44 12v4M44 44v4"/><path d="M28 48l16-36"/>'),
  },
  dipSwitch: {
    label: 'DIP switch',
    note: 'multi-pole package',
    svg: svg('<rect x="22" y="12" width="76" height="36" rx="2"/><path d="M34 24v12M48 24v12M62 24v12M76 24v12M88 24v12"/><path d="M6 24h16M6 36h16M98 24h16M98 36h16M34 48v10M48 48v10M62 48v10M76 48v10M88 48v10"/>'),
  },
  solderBridge: {
    label: 'Solder bridge',
    note: '0 Ω jumper',
    svg: svg('<path d="M4 20h14v20H4zM102 20h14v20h-14z"/><circle cx="24" cy="30" r="5" fill="currentColor" stroke="none"/><circle cx="96" cy="30" r="5" fill="currentColor" stroke="none"/><path d="M24 30h72" stroke-width="5"/>'),
  },
  relayCoil: {
    label: 'Relay coil',
    note: 'inductive coil',
    svg: svg('<path d="M6 30h14a8 8 0 0 1 16 0 8 8 0 0 1 16 0 8 8 0 0 1 16 0h26M62 46h22M62 40h22"/>'),
  },
  thyristor: {
    label: 'Thyristor (SCR)',
    note: 'latching switch',
    svg: svg('<circle cx="60" cy="30" r="22"/><path d="M6 30h24M36 22v16l14-8-14-8M36 22h0"/><path d="M36 30h48"/><path d="M50 40v10"/>'),
  },
  opAmp: {
    label: 'Operational amplifier',
    note: 'triangle, two inputs',
    svg: svg('<path d="M10 10v40L90 30z"/><path d="M10 20h20M10 40h20M90 30h24M30 18v8M30 36v8"/>'),
  },
  optocoupler: {
    label: 'Optocoupler',
    note: 'LED + photodiode isolation',
    svg: svg('<path d="M6 30h22M28 22v16M28 22l10 8-10 8M18 14v4"/><path d="M46 14v28M46 18l12 8-12 8M46 28l0 8M58 18v4"/><path d="M58 10l4 4M58 42l4-4M46 24l-4-4M46 32l-4 4"/><path d="M90 30h24"/>'),
  },
  crystal: {
    label: 'Crystal oscillator',
    note: 'piezo element',
    svg: svg('<path d="M6 30h18"/><rect x="24" y="14" width="20" height="32"/><rect x="52" y="14" width="20" height="32"/><path d="M72 30h42"/>'),
  },
  transformer: {
    label: 'Transformer',
    note: 'two coupled coils',
    svg: svg('<path d="M6 30h10a8 8 0 0 1 16 0 8 8 0 0 1 16 0 8 8 0 0 1 16 0 8 8 0 0 1 16 0h20M50 22v16h40M50 38v-16h20M70 22v16"/>'),
  },
  bridgeRectifier: {
    label: 'Bridge rectifier',
    note: 'four-diode diamond',
    svg: svg('<path d="M40 12h40l16 20-16 20H40l-16-20z"/><path d="M60 26v10M56 30h8"/><path d="M10 20h24M10 40h24M76 30h24M50 12v-6M50 52v6"/>'),
  },
  ammeter: {
    label: 'Ammeter',
    note: 'series current meter',
    svg: svg('<circle cx="60" cy="30" r="16"/><path d="M6 30h38M76 30h38"/><path d="M54 38l6-16 6 16M56 33h8"/>'),
  },
  voltmeter: {
    label: 'Voltmeter',
    note: 'parallel voltage meter',
    svg: svg('<circle cx="60" cy="30" r="16"/><path d="M6 30h38M76 30h38"/><path d="M54 22l6 16 6-16"/>'),
  },
  ohmmeter: {
    label: 'Ohmmeter',
    note: 'resistance meter',
    svg: svg('<circle cx="60" cy="30" r="16"/><path d="M6 30h38M76 30h38"/><path d="M52 24v4a8 6 0 1 0 16 0v-4M60 34v4"/>'),
  },
  wattmeter: {
    label: 'Wattmeter',
    note: 'power meter',
    svg: svg('<circle cx="60" cy="30" r="16"/><path d="M6 30h38M76 30h38"/><path d="M50 22l4 16 6-10 6 10 4-16"/>'),
  },
  buzzer: {
    label: 'Buzzer',
    note: 'audible alert',
    svg: svg('<path d="M6 30h26"/><path d="M32 14v32a16 16 0 0 0 0-32z"/><path d="M54 22h10M54 30h14M54 38h10"/>'),
  },
  speaker: {
    label: 'Speaker',
    note: 'sound output',
    svg: svg('<path d="M6 30h18"/><rect x="24" y="20" width="12" height="20"/><path d="M36 20l18-10v40L36 40z"/><path d="M60 22c4 4 4 12 0 16M66 18c6 6 6 18 0 24"/>'),
  },
  microphone: {
    label: 'Microphone',
    note: 'sound input',
    svg: svg('<path d="M60 6v8"/><rect x="50" y="14" width="20" height="22" rx="10"/><path d="M44 26v6a16 16 0 0 0 32 0v-6"/><path d="M60 48v6M46 54h28"/><path d="M6 30h38M76 30h38"/>'),
  },
  antenna: {
    label: 'Antenna',
    note: 'radiating element',
    svg: svg('<path d="M60 54V18"/><path d="M60 18L40 6M60 18l20-12M60 18l-10-8M60 18l10-8"/><path d="M6 54h108"/>'),
  },
  motor: {
    label: 'Motor',
    note: 'electromechanical drive',
    svg: svg('<circle cx="60" cy="30" r="16"/><path d="M6 30h38M76 30h38"/><path d="M52 38V22l8 10 8-10v16"/>'),
  },
  generator: {
    label: 'Generator',
    note: 'mechanical to electrical',
    svg: svg('<circle cx="60" cy="30" r="16"/><path d="M6 30h38M76 30h38"/><path d="M66 22h-8a6 6 0 0 0 0 12h4a4 4 0 0 0 0-8h-8"/>'),
  },
};

/* ── UI glyphs ────────────────────────────────────────────────────────── */

const ICONS = {
  bolt: 'M13 2 4 14h6l-1 8 9-12h-6l1-8z',
  sigma: 'M18 4H6l6 8-6 8h12M6 4h12',
  hash: 'M4 9h16M4 15h16M10 3 8 21M16 3l-2 18',
  palette: 'M12 3a9 9 0 1 0 0 18h1.5a1.5 1.5 0 0 0 0-3H12a2 2 0 0 1 0-4h3a6 6 0 0 0 0-12z',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6M14 4l-4 16',
  chart: 'M4 20V10m5 10V4m5 16v-7m5 7V7',
  heart: 'M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9z',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4v5l3 2',
  cable: 'M4 8h6v8H4zM14 8h6v8h-6zM10 12h4M8 8v8M16 8v8',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  book: 'M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 0-2 2zm15 0h1v16h-1',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm5 12 5 5',
  swap: 'M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4m4 4H7',
  copy: 'M8 8h12v12H8zM4 16V4h12',
  download: 'M12 4v11m-4-4 4 4 4-4M4 19h16',
  upload: 'M12 20V9m-4 4 4-4 4 4M4 5h16',
  check: 'm4 13 5 5L20 7',
  chevron: 'm9 5 7 7-7 7',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 5v.5M12 11v6',
  warn: 'M12 4 2 20h20L12 4zm0 6v5m0 3v.5',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm8 3a8 8 0 0 0-.2-1.8l2-1.5-2-3.4-2.3 1a8 8 0 0 0-3-1.8L14 2h-4l-.5 2.5a8 8 0 0 0-3 1.8l-2.3-1-2 3.4 2 1.5a8 8 0 0 0 0 3.6l-2 1.5 2 3.4 2.3-1a8 8 0 0 0 3 1.8L10 22h4l.5-2.5a8 8 0 0 0 3-1.8l2.3 1 2-3.4-2-1.5c.13-.6.2-1.2.2-1.8z',
  calc: 'M6 3h12v18H6zM9 7h6M9 11h1m4 0h1M9 15h1m4 0h1',
  ruler: 'M3 17 17 3l4 4L7 21zM7 11l2 2m2-6 2 2m2-6 2 2',
  layers: 'm12 3 9 5-9 5-9-5 9-5zm9 9-9 5-9-5m18 5-9 5-9-5',
  wifi: 'M3 9a15 15 0 0 1 18 0M6 13a10 10 0 0 1 12 0M9 16.5a5 5 0 0 1 6 0M12 20v.5',
  mobile: 'M8 3h8v18H8zM11 18h2',
  desktop: 'M3 5h18v11H3zM9 20h6M12 16v4',
  terminal: 'M4 5h16v14H4zM7 9l3 3-3 3m6 0h4',
  sun: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v3m0 16v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M1 12h3m16 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
  moon: 'M20 14A9 9 0 0 1 10 4a9 9 0 1 0 10 10z',
};

export function icon(name, { size = 18, cls = '' } = {}) {
  const d = ICONS[name] ?? ICONS.info;
  const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  node.setAttribute('viewBox', '0 0 24 24');
  node.setAttribute('width', size);
  node.setAttribute('height', size);
  node.setAttribute('fill', 'none');
  node.setAttribute('stroke', 'currentColor');
  node.setAttribute('stroke-width', '1.8');
  node.setAttribute('stroke-linecap', 'round');
  node.setAttribute('stroke-linejoin', 'round');
  node.setAttribute('aria-hidden', 'true');
  if (cls) node.setAttribute('class', cls);
  node.innerHTML = `<path d="${d}"/>`;
  return node;
}

export const ICON_NAMES = Object.keys(ICONS);
export const SYMBOL_NAMES = Object.keys(SYMBOLS);

/** Group metadata for the symbols reference page. */
export const SYMBOL_GROUPS = [
  {
    id: 'resistive',
    title: 'Resistive & control',
    blurb: 'Elements that limit or divide current.',
    keys: ['resistor', 'resistorUs', 'resistorPot', 'trimmer', 'thermistor', 'fuse', 'lamp', 'switch', 'switchSpst', 'switchSpdt', 'pushbuttonNo', 'pushbuttonNc', 'dipSwitch', 'solderBridge', 'relaySpdt'],
  },
  {
    id: 'reactive',
    title: 'Energy storage',
    blurb: 'Elements that store charge or magnetic field, and the transformer that transfers both.',
    keys: ['capacitor', 'capacitorPol', 'inductor', 'inductorCore', 'relayCoil', 'transformer'],
  },
  {
    id: 'semiconductor',
    title: 'Semiconductors & active',
    blurb: 'One-way and controlled conduction, plus gain and switching.',
    keys: ['diode', 'zener', 'led', 'photodiode', 'transistorNpn', 'transistorPnp', 'fet', 'thyristor', 'bridgeRectifier', 'opAmp', 'optocoupler'],
  },
  {
    id: 'sources',
    title: 'Sources, returns & bits',
    blurb: 'Where voltage comes from, where it goes, and the passive bits in between.',
    keys: ['dcSource', 'acSource', 'battery', 'ground', 'groundEarth', 'wire', 'crystal'],
  },
  {
    id: 'instruments',
    title: 'Instruments & transducers',
    blurb: 'Meters that measure, and parts that turn electricity into motion, sound or signals (and back).',
    keys: ['ammeter', 'voltmeter', 'ohmmeter', 'wattmeter', 'buzzer', 'speaker', 'microphone', 'antenna', 'motor', 'generator'],
  },
];
