/**
 * Reference material — the "reading" half of the site.
 *
 * Structure mirrors the kind of page a learner actually needs: a definition,
 * an intuition/analogy, the formula with every symbol defined, then worked
 * relationships and a linked calculator.
 *
 * `body` is an array of blocks so the renderer stays a pure function and the
 * same content can be prerendered to static HTML for search engines.
 */

/* ── glossary ──────────────────────────────────────────────────────────── */

export const GLOSSARY = {
  /* Electrical */
  voltage: {
    term: 'Voltage',
    group: 'Electrical',
    symbol: 'V',
    unit: 'volt (V)',
    short: 'Electric potential difference between two points.',
    def: 'Electrical voltage is the potential difference between two points in an electric field. It is the "pressure" that pushes charge around a circuit.',
    intuition: 'Think of water in pipes. Height difference is what makes water flow; voltage is that height difference, and current is the flow it produces.',
    formula: 'V = φ₂ − φ₁',
    seeAlso: ['current', 'resistance', 'ohms-law'],
    tool: 'ohms-law',
  },
  current: {
    term: 'Electric current',
    group: 'Electrical',
    symbol: 'I',
    unit: 'ampere (A)',
    short: 'Rate of flow of electric charge past a point.',
    def: 'Current is the amount of charge passing a point in a circuit per second. 1 ampere is one coulomb per second.',
    intuition: 'The volume of water passing through the pipe per second, once the pressure difference is applied.',
    formula: 'I = Q / t',
    seeAlso: ['voltage', 'resistance'],
    tool: 'ohms-law',
  },
  resistance: {
    term: 'Electrical resistance',
    group: 'Electrical',
    symbol: 'R',
    unit: 'ohm (Ω)',
    short: 'Opposition to the flow of current.',
    def: 'Resistance measures how much a component opposes current. 1 ohm allows 1 ampere to flow when 1 volt is applied across it.',
    intuition: 'A constriction in the pipe: the narrower it is, the harder the water gets through at a given pressure.',
    formula: 'R = V / I',
    seeAlso: ['voltage', 'current', 'ohms-law'],
    tool: 'ohms-law',
  },
  power: {
    term: 'Electric power',
    group: 'Electrical',
    symbol: 'P',
    unit: 'watt (W)',
    short: 'Rate at which electrical energy is transferred.',
    def: 'Power is the rate of energy transfer. 1 watt is one joule per second.',
    intuition: 'Not the height of the waterfall, nor the amount of water — it is how fast the water can do work on the way down.',
    formula: 'P = V × I',
    seeAlso: ['voltage', 'current', 'power-factor'],
    tool: 'power-factor',
  },
  charge: {
    term: 'Electric charge',
    group: 'Electrical',
    symbol: 'Q',
    unit: 'coulomb (C)',
    short: 'Quantity of electricity carried by a body of charge.',
    def: 'Charge is a conserved property; electrons carry a negative charge of magnitude 1.602176565×10⁻¹⁹ C.',
    intuition: 'The total volume of water in a bucket, before it is released.',
    formula: 'Q = I × t',
    seeAlso: ['current', 'voltage'],
  },
  capacitance: {
    term: 'Capacitance',
    group: 'Electrical',
    symbol: 'C',
    unit: 'farad (F)',
    short: 'A component’s ability to store charge.',
    def: 'Capacitance is the ratio of stored charge to the voltage across it. 1 farad stores 1 coulomb at 1 volt.',
    formula: 'C = Q / V',
    seeAlso: ['charge', 'voltage'],
  },
  inductance: {
    term: 'Inductance',
    group: 'Electrical',
    symbol: 'L',
    unit: 'henry (H)',
    short: 'A coil’s ability to store energy in a magnetic field.',
    def: 'Inductance is the ratio of induced voltage to the rate of change of current through a coil.',
    formula: 'V = L · dI/dt',
    seeAlso: ['current'],
  },
  impedance: {
    term: 'Impedance',
    group: 'Electrical',
    symbol: 'Z',
    unit: 'ohm (Ω)',
    short: 'Total opposition to AC current, including phase.',
    def: 'For AC circuits, impedance generalises resistance: it accounts for reactive components and the phase shift they introduce.',
    formula: 'Z = √(R² + X²)',
    seeAlso: ['resistance', 'power-factor'],
    tool: 'three-phase',
  },
  conductance: {
    term: 'Conductance',
    group: 'Electrical',
    symbol: 'G',
    unit: 'siemens (S)',
    short: 'Ease with which current flows — the inverse of resistance.',
    def: 'Conductance is the reciprocal of resistance. 1 siemens is one reciprocal ohm.',
    formula: 'G = 1 / R',
    seeAlso: ['resistance'],
  },
  powerFactor: {
    term: 'Power factor',
    group: 'Electrical',
    symbol: 'PF',
    unit: '—',
    short: 'How closely current and voltage are in phase.',
    def: 'Power factor is the ratio of real power (kW) to apparent power (kVA). 1.0 is perfect; below 1 the extra current is wasted as heat.',
    formula: 'PF = kW / kVA',
    seeAlso: ['power', 'apparent-power'],
    tool: 'power-factor',
  },
  apparentPower: {
    term: 'Apparent power',
    group: 'Electrical',
    symbol: 'S',
    unit: 'volt-ampere (VA)',
    short: 'Total power a supply must deliver, in phase or not.',
    def: 'Apparent power is voltage times current regardless of phase. Utilities bill against real power, but size equipment against apparent power.',
    formula: 'S = V × I',
    seeAlso: ['power-factor', 'power'],
  },
  reactance: {
    term: 'Reactance',
    group: 'Electrical',
    symbol: 'X',
    unit: 'ohm (Ω)',
    short: 'Opposition to AC from capacitors and inductors.',
    def: 'Capacitive reactance falls with frequency; inductive reactance rises with it.',
    formula: 'X_C = 1 / (2πfC)   ·   X_L = 2πfL',
    seeAlso: ['capacitance', 'inductance', 'impedance'],
  },
  rms: {
    term: 'RMS voltage',
    group: 'Electrical',
    symbol: 'V_rms',
    unit: 'volt (V)',
    short: 'The DC value with the same heating effect as the AC waveform.',
    def: 'For a sine wave the RMS value is the peak divided by √2. This is why a 230 V supply is quoted as 230 V and not 325 V.',
    formula: 'V_rms = V_max / √2 ≈ 0.707 · V_max',
    seeAlso: ['voltage'],
  },
  efficiency: {
    term: 'Power efficiency',
    group: 'Electrical',
    symbol: 'η',
    unit: 'percent (%)',
    short: 'Useful output as a share of input.',
    def: 'Efficiency is the ratio of useful output power to input power. It can never exceed 100% — the rest becomes heat, sound and motion.',
    formula: 'η = (P_out / P_in) × 100%',
    seeAlso: ['power'],
    tool: 'power-efficiency',
  },
  seriesCircuit: {
    term: 'Series connection',
    group: 'Circuits',
    symbol: '—',
    unit: '—',
    short: 'Components sharing one path; voltages add.',
    def: 'In a series circuit the same current flows through every component, and the total voltage is the sum of the individual drops.',
    formula: 'V_T = V₁ + V₂ + V₃ + …',
    seeAlso: ['parallelCircuit', 'resistance'],
  },
  parallelCircuit: {
    term: 'Parallel connection',
    group: 'Circuits',
    symbol: '—',
    unit: '—',
    short: 'Components sharing the same two nodes; current divides.',
    def: 'In a parallel circuit every branch sees the same voltage, and the branch currents sum to the total.',
    formula: 'V_T = V₁ = V₂ = V₃',
    seeAlso: ['seriesCircuit', 'voltage'],
  },
  voltageDivider: {
    term: 'Voltage divider',
    group: 'Circuits',
    symbol: '—',
    unit: '—',
    short: 'Series resistors scaling a source voltage down.',
    def: 'With resistors in series, the drop across one resistor is proportional to its share of the total resistance.',
    formula: 'V_i = V_T · R_i / (R₁ + R₂ + R₃ + …)',
    seeAlso: ['resistance', 'seriesCircuit'],
    tool: 'voltage-divider',
  },
  kvl: {
    term: "Kirchhoff's voltage law",
    group: 'Circuits',
    symbol: 'KVL',
    unit: '—',
    short: 'Voltage rises equal voltage drops around any closed loop.',
    def: 'Energy is conserved, so the algebraic sum of voltages around a closed loop is zero. Sign convention: rises positive, drops negative.',
    formula: 'Σ V_k = 0',
    seeAlso: ['kcl', 'voltage', 'voltageDivider'],
    tool: 'kirchhoff',
  },
  kcl: {
    term: "Kirchhoff's current law",
    group: 'Circuits',
    symbol: 'KCL',
    unit: '—',
    short: 'Charge is conserved, so current entering a node equals current leaving.',
    def: 'No charge accumulates at an ideal node. The algebraic sum of currents at any junction is zero.',
    formula: 'Σ I_k = 0',
    seeAlso: ['kvl', 'current'],
    tool: 'kirchhoff',
  },
  coulombsLaw: {
    term: "Coulomb's law",
    group: 'Circuits',
    symbol: '—',
    unit: '—',
    short: 'Force between two point charges.',
    def: 'The electrostatic force between two charges is proportional to their product and falls off with the square of the distance between them.',
    formula: 'F = k · q₁·q₂ / r²',
    seeAlso: ['charge', 'voltage'],
    tool: 'coulomb',
  },
  superconductivity: {
    term: 'Superconductivity',
    group: 'Circuits',
    symbol: '—',
    unit: '—',
    short: 'Zero resistance below a critical temperature.',
    def: 'Below its critical temperature a superconductor conducts with no electrical resistance and excludes magnetic flux.',
    seeAlso: ['resistance'],
  },

  /* Units */
  ohm: { term: 'Ohm (Ω)', group: 'Units', symbol: 'Ω', unit: 'ohm', short: 'SI unit of electrical resistance.', def: 'Named after Georg Ohm. 1 Ω is the resistance that allows 1 A to flow across 1 V.', formula: '1 Ω = 1 V / 1 A', seeAlso: ['resistance'] },
  watt: { term: 'Watt (W)', group: 'Units', symbol: 'W', unit: 'watt', short: 'SI unit of power.', def: 'Named after James Watt. 1 W is one joule per second.', formula: '1 W = 1 J/s', seeAlso: ['power'] },
  volt: { term: 'Volt (V)', group: 'Units', symbol: 'V', unit: 'volt', short: 'SI unit of voltage.', def: 'One volt is the potential difference that moves one coulomb of charge per coulomb of work done.', formula: '1 V = 1 J/C', seeAlso: ['voltage', 'charge'] },
  ampere: { term: 'Ampere (A)', group: 'Units', symbol: 'A', unit: 'ampere', short: 'SI unit of current.', def: 'Since the 2019 SI redefinition it is defined by the elementary charge, not by a prototype.', formula: '1 A = 1 C/s', seeAlso: ['current'] },
  farad: { term: 'Farad (F)', group: 'Units', symbol: 'F', unit: 'farad', short: 'SI unit of capacitance.', def: 'One farad stores one coulomb at one volt.', formula: '1 F = 1 C/V', seeAlso: ['capacitance'] },
  henry: { term: 'Henry (H)', group: 'Units', symbol: 'H', unit: 'henry', short: 'SI unit of inductance.', def: 'One henry induces one volt across a coil when current through it changes at one ampere per second.', formula: '1 H = 1 V·s/A', seeAlso: ['inductance'] },
  decibel: { term: 'Decibel (dB)', group: 'Units', symbol: 'dB', unit: 'decibel', short: 'A logarithmic ratio — one tenth of a bel.', def: 'Decibels express ratios, not absolute quantities. Ten decibels is a factor of ten in power; twenty is a factor of a hundred.', formula: 'dB = 10 · log₁₀(P₂ / P₁)', seeAlso: ['dbm', 'dbw', 'power'], tool: 'decibel' },
  dbm: { term: 'dB-milliwatt (dBm)', group: 'Units', symbol: 'dBm', unit: '—', short: 'Absolute power referenced to 1 milliwatt.', def: '0 dBm is exactly 1 mW. Because the reference is fixed, dBm is an absolute measure you can compare directly across equipment.', formula: 'P(W) = 10^((dBm − 30)/10)', seeAlso: ['decibel', 'dbw'], tool: 'dbm' },
  dbw: { term: 'dB-watt (dBW)', group: 'Units', symbol: 'dBW', unit: '—', short: 'Absolute power referenced to 1 watt.', def: '0 dBW is 1 W, so dBm = dBW + 30 at all times.', formula: 'P(W) = 10^(dBW/10)', seeAlso: ['decibel', 'dbm'], tool: 'dbm' },
  kilowatt: { term: 'Kilowatt (kW)', group: 'Units', symbol: 'kW', unit: 'kilowatt', short: '1000 watts — the unit utility meters use.', def: 'Residential and commercial billing is in kilowatt-hours, and equipment is often rated in kilowatts.', formula: '1 kW = 1000 W', seeAlso: ['watt', 'power'] },
  kwh: { term: 'Kilowatt-hour (kWh)', group: 'Units', symbol: 'kWh', unit: 'kilowatt-hour', short: 'Energy used, not power drawn.', def: 'One kilowatt-hour is the energy of running a 1 kW load for one hour. It is a unit of energy, and bills are priced per kWh.', formula: '1 kWh = 1000 W × 3600 s = 3.6 MJ', seeAlso: ['kilowatt', 'power'] },
  kva: { term: 'Kilovolt-amp (kVA)', group: 'Units', symbol: 'kVA', unit: 'kilovolt-ampere', short: 'Apparent power — the size a supply must handle.', def: 'Equipment is rated in kVA because transformers and cables are sized by apparent power, not real power.', formula: '1 kVA = 1000 VA', seeAlso: ['apparentPower', 'powerFactor'] },

  /* Math & computing */
  logarithm: { term: 'Logarithm', group: 'Mathematics', symbol: 'log', unit: '—', short: 'The exponent a base must be raised to.', def: 'log_b(x) is the power b must be raised to in order to equal x. A logarithm turns multiplication into addition, which is why it appears wherever things scale exponentially.', formula: 'log_b(x) = ln(x) / ln(b)', seeAlso: ['exponential'], tool: 'log' },
  exponential: { term: 'Exponential function', group: 'Mathematics', symbol: 'aˣ', unit: '—', short: 'Output grows by a fixed ratio each step.', def: 'In y = aˣ the output is multiplied by a for every unit increase in x. Decay is the same function with a < 1.', formula: 'y = x₀ · (1 + r/100)ᵗ', seeAlso: ['logarithm'], tool: 'exponential-growth' },
  radix: { term: 'Radix / base', group: 'Computing', symbol: 'b', unit: '—', short: 'The number of distinct digits a numeral system uses.', def: 'Base 2 uses {0,1}, base 16 uses {0–9,A–F}, base 36 uses {0–9,A–Z}. Positional notation means each digit is multiplied by the base raised to its position.', formula: 'value = Σ dᵢ · bⁱ', seeAlso: ['bit', 'byte'], tool: 'radix-calc' },
  bit: { term: 'Bit', group: 'Computing', symbol: 'bit', unit: 'bit', short: 'One binary digit — the smallest unit of information.', def: 'A bit is one 0 or one 1. It is a count, not a piece of data on its own.', formula: '8 bit = 1 byte', seeAlso: ['byte', 'radix'] },
  byte: { term: 'Byte', group: 'Computing', symbol: 'B', unit: 'byte', short: 'Eight bits — the addressable unit of memory.', def: 'One byte has 256 possible values, 0 to 255, which is exactly one hex digit pair. This is why hex is the natural way to read binary.', formula: 'byte = 8 bits = 2 hex digits', seeAlso: ['bit', 'hexadecimal'] },
  hexadecimal: { term: 'Hexadecimal', group: 'Computing', symbol: 'hex', unit: '—', short: 'Base 16 — one digit per four bits.', def: 'Each hex digit encodes exactly four binary bits, so a byte is always two hex digits. Nothing is lost in either direction.', formula: '1 hex digit = 4 bits = ½ byte', seeAlso: ['byte', 'radix'], tool: 'radix-calc' },
  utf8: { term: 'UTF-8', group: 'Computing', symbol: 'UTF-8', unit: '—', short: 'The web’s default text encoding.', def: 'UTF-8 stores ASCII as one byte and uses two to four bytes for everything else, so plain English costs no more than ASCII.', formula: '1–4 bytes per character', seeAlso: ['byte', 'ascii'] },
  ascii: { term: 'ASCII', group: 'Computing', symbol: 'ASCII', unit: '—', short: '7-bit character encoding, 128 characters.', def: 'ASCII covers 0–127: control codes, space, and printable English. Anything beyond it needs a wider encoding.', formula: '7 bits, 128 characters', seeAlso: ['utf8', 'byte'] },
  checksum: { term: 'Checksum', group: 'Computing', symbol: '—', unit: '—', short: 'A small value computed from data to detect errors.', def: 'A checksum is cheap to compute and compare. A CRC is a checksum with good error detection; it is not a defence against deliberate tampering.', formula: 'CRC-32 = 32-bit polynomial remainder', seeAlso: ['byte'], tool: 'hash' },
  endianness: { term: 'Byte order (endianness)', group: 'Computing', symbol: '—', unit: '—', short: 'Whether the most or least significant byte comes first.', def: 'Big-endian puts the most significant byte first, matching how numbers are written. Little-endian puts it last, which suits little-endian CPUs.', formula: '0x1234 → 12 34 (BE) or 34 12 (LE)', seeAlso: ['byte', 'hexadecimal'] },
  crc: { term: 'Cyclic redundancy check', group: 'Computing', symbol: 'CRC', unit: '—', short: 'Error-detecting code built from polynomial division.', def: 'A CRC treats a message as a polynomial, divides by a fixed generator polynomial, and sends the remainder. Bursts of errors are detected reliably.', seeAlso: ['checksum'], tool: 'hash' },
};

export const GLOSSARY_GROUPS = ['Electrical', 'Circuits', 'Units', 'Mathematics', 'Computing'];

/* ── formula encyclopedia ──────────────────────────────────────────────── */

/**
 * Each article: slug → { title, kicker, summary, tool, blocks[] }
 * Block kinds: 'p' | 'h3' | 'definition' | 'formula' | 'callout' | 'list'
 *   | 'table' | 'symbols' | 'links' | 'fig'
 */
export const ARTICLES = {
  'electrical-voltage': {
    title: 'Electrical Voltage',
    kicker: 'Fundamentals',
    summary: 'What voltage is, why a water analogy works, and every relationship that follows from it.',
    tool: 'ohms-law',
    blocks: [
      { k: 'definition', t: 'Electrical voltage is the potential difference between two points in an electric field.' },
      { k: 'p', t: 'Voltage is the “pressure” in a circuit. It does not itself flow — charge does. A battery does not push electrons around; it raises their potential so that a circuit can.' },
      { k: 'p', t: 'The water-pipe analogy is useful precisely because it is imperfect in instructive ways. Height difference is pressure, cross-section plus flow rate is current, and constriction is resistance. What the analogy misses is that water is consumed and charge is not.' },
      { k: 'formula', eq: 'V = φ₂ − φ₁', note: 'φ is the electric potential at a point, measured in volts.' },
      { k: 'symbols', rows: [['V', 'voltage between point 2 and point 1, in volts (V)'], ['φ₂', 'electric potential at point 2, in volts (V)'], ['φ₁', 'electric potential at point 1, in volts (V)']] },
      { k: 'h3', t: 'Voltage as energy per unit charge' },
      { k: 'p', t: 'In a circuit, the voltage across a component equals the energy it consumes divided by the charge that passes through it.' },
      { k: 'formula', eq: 'V = E / Q', note: 'One volt is one joule of work per coulomb of charge.' },
      { k: 'h3', t: 'Voltage in series and in parallel' },
      { k: 'p', t: 'Voltage sources or drops connected in series add up — the total is the sum of the parts.' },
      { k: 'formula', eq: 'V_T = V₁ + V₂ + V₃ + …' },
      { k: 'p', t: 'Branches in parallel all see the same voltage, because each pair of branches shares the same two nodes.' },
      { k: 'formula', eq: 'V_T = V₁ = V₂ = V₃' },
      { k: 'h3', t: 'The voltage divider' },
      { k: 'p', t: 'With resistors (or other impedances) in series, each drop is proportional to that element’s share of the total resistance.' },
      { k: 'formula', eq: 'Vᵢ = V_T · Rᵢ / (R₁ + R₂ + R₃ + …)' },
      { k: 'h3', t: 'DC and AC' },
      { k: 'p', t: 'Direct current comes from a constant source such as a battery; the drop across a resistor follows Ohm’s law, V_R = I_R · R.' },
      { k: 'p', t: 'Alternating current comes from a sinusoidal source. The same relation holds, but with impedance Z in place of resistance R, because reactive elements also shift the phase.' },
      { k: 'formula', eq: 'V_Z = I_Z · Z' },
      { k: 'p', t: 'A sinusoidal voltage is described by amplitude, frequency and phase.' },
      { k: 'formula', eq: 'v(t) = V_max · sin(ωt + θ)', note: 'ω is the angular frequency in rad/s, t in seconds, θ in radians.' },
      { k: 'h3', t: 'RMS and peak-to-peak' },
      { k: 'p', t: 'Quoted AC values are RMS, not peak. For a sine wave the relationship is fixed, which is why a 230 V supply has a 325 V peak.' },
      { k: 'formula', eq: 'V_rms = V_max / √2 ≈ 0.707 · V_max\nV_pp = 2 · V_max' },
      { k: 'callout', icon: 'info', t: 'A voltmeter is connected in parallel with the component being measured. It has very high resistance, so it barely perturbs the circuit it is measuring.' },
      { k: 'h3', t: 'Voltage by country' },
      { k: 'p', t: 'AC supply voltage varies by country. North America uses 120 V; most of Europe, Africa and Oceania use 230 V.' },
      { k: 'table', head: ['Country', 'Voltage', 'Frequency'], rows: [
        ['Australia', '230 V', '50 Hz'], ['Brazil', '110 V', '60 Hz'], ['Canada', '120 V', '60 Hz'],
        ['China', '220 V', '50 Hz'], ['France', '230 V', '50 Hz'], ['Germany', '230 V', '50 Hz'],
        ['India', '230 V', '50 Hz'], ['Ireland', '230 V', '50 Hz'], ['Israel', '230 V', '50 Hz'],
        ['Italy', '230 V', '50 Hz'], ['Japan', '100 V', '50/60 Hz'], ['New Zealand', '230 V', '50 Hz'],
        ['Philippines', '220 V', '60 Hz'], ['Russia', '220 V', '50 Hz'], ['South Africa', '220 V', '50 Hz'],
        ['Thailand', '220 V', '50 Hz'], ['UK', '230 V', '50 Hz'], ['USA', '120 V', '60 Hz'],
      ] },
    ],
  },

  'electrical-current': {
    title: 'Electrical Current',
    kicker: 'Fundamentals',
    summary: 'Charge in motion, how much of it flows, and what limits it.',
    tool: 'ohms-law',
    blocks: [
      { k: 'definition', t: 'Electric current is the rate of flow of electric charge past a point in a circuit.' },
      { k: 'formula', eq: 'I = Q / t', note: 'One ampere is one coulomb per second.' },
      { k: 'symbols', rows: [['I', 'current, in amperes (A)'], ['Q', 'charge, in coulombs (C)'], ['t', 'time, in seconds (s)']] },
      { k: 'p', t: 'Conventional current is defined in the direction positive charge would move. In metals the actual carriers are electrons moving the other way — the numbers are identical, only the sign convention differs.' },
      { k: 'h3', t: 'Conventional vs electron flow' },
      { k: 'list', items: [
        'Conventional current runs from the positive terminal of a source to the negative.',
        'Electron flow runs the opposite way in metallic conductors.',
        'Either convention gives correct results as long as you use one consistently.',
      ] },
      { k: 'h3', t: 'Current in series and parallel' },
      { k: 'p', t: 'In series there is only one path, so the same current flows through every component.' },
      { k: 'formula', eq: 'I_T = I₁ = I₂ = I₃' },
      { k: 'p', t: 'In parallel the voltage across each branch is the same and the branch currents add up to the total.' },
      { k: 'formula', eq: 'I_T = I₁ + I₂ + I₃' },
      { k: 'h3', t: 'Measuring current' },
      { k: 'p', t: 'An ammeter is connected in series — it must carry the same current as the branch it measures. Its resistance is very low so that it does not change the circuit.' },
      { k: 'callout', icon: 'warn', t: 'Connecting an ammeter directly across a source is close to a short circuit. Almost all the supply voltage appears across near-zero resistance, which is why the current — and the damage — is very large.' },
    ],
  },

  'electrical-resistance': {
    title: 'Electrical Resistance',
    kicker: 'Fundamentals',
    summary: 'What opposes current, how it depends on geometry and material, and how temperature changes it.',
    tool: 'ohms-law',
    blocks: [
      { k: 'definition', t: 'Resistance is a component’s opposition to the flow of electric current.' },
      { k: 'formula', eq: 'R = V / I', note: 'One ohm passes one ampere when one volt is applied across it.' },
      { k: 'h3', t: 'What resistance depends on' },
      { k: 'p', t: 'For a uniform conductor, resistance rises with length, falls with cross-sectional area, and scales with the material’s resistivity.' },
      { k: 'formula', eq: 'R = ρ · L / A', note: 'ρ in Ω·m, L in m, A in m². Copper is 1.72×10⁻⁸ Ω·m at 20 °C.' },
      { k: 'p', t: 'Doubling a wire’s length doubles its resistance; doubling its diameter quarters it, because area goes as the square.' },
      { k: 'h3', t: 'Resistance combinations' },
      { k: 'formula', eq: 'Series:     R_T = R₁ + R₂ + R₃\nParallel:   1/R_T = 1/R₁ + 1/R₂ + 1/R₃' },
      { k: 'h3', t: 'Temperature' },
      { k: 'p', t: 'Metals get more resistive as they heat — which is why tungsten filament lamps glow, and why a hot motor draws more current than a cold one. Carbon behaves the other way, which is how thermistors sense temperature.' },
      { k: 'h3', t: 'Measuring resistance' },
      { k: 'p', t: 'An ohmmeter passes a known small current through the component and measures the resulting voltage. A component must be out of circuit, or the measurement includes everything in parallel with it.' },
    ],
  },

  'ohms-law': {
    title: "Ohm's Law",
    kicker: 'Circuit laws',
    summary: 'The three quantities that define a resistive circuit, and all six ways to solve for one of them.',
    tool: 'ohms-law',
    blocks: [
      { k: 'definition', t: 'For a conductor at constant temperature, the current through it is directly proportional to the potential difference across its ends.' },
      { k: 'formula', eq: 'V = I · R', note: 'Valid for ohmic components at constant temperature.' },
      { k: 'p', t: 'Because voltage, current and resistance are related by one equation, any two of them determine the third. The triangular arrangement below is the usual memory aid.' },
      { k: 'formula', eq: 'I = V / R          V = I · R          P = V · I\nR = V / I          P = I² · R         P = V² / R' },
      { k: 'h3', t: 'Power in the three forms' },
      { k: 'symbols', rows: [
        ['P = V · I', 'useful when voltage and current are known'],
        ['P = I² · R', 'useful when current and resistance are known'],
        ['P = V² / R', 'useful when voltage and resistance are known'],
      ] },
      { k: 'h3', t: 'The formula wheel — all twelve rearrangements' },
      { k: 'table', head: ['Apparent law', 'Solve for V', 'Solve for I', 'Solve for R', 'Solve for P'], rows: [
        ['Ohm’s law (V = IR)', 'V = I · R', 'I = V ÷ R', 'R = V ÷ I', '—'],
        ['Joule’s law (P = VI)', 'V = P ÷ I', 'I = P ÷ V', '—', 'P = V · I'],
        ['Joule’s law (P = I²R)', '—', 'I = √(P ÷ R)', 'R = P ÷ I²', 'P = I² · R'],
        ['Joule’s law (P = V²/R)', 'V = √(P · R)', '—', 'R = V² ÷ P', 'P = V² / R'],
      ] },
      { k: 'callout', icon: 'info', t: 'Pick the form whose variables you have. If the circuit shows both V and I, use P = V·I. If only V and R, use P = V²/R — and note that P rises with the square of V, not with V itself.' },
      { k: 'p', t: 'The choice of form is not cosmetic. For a fixed-resistance load, P = V²/R means power rises with the square of voltage — halving the supply quarters the power. That is why a 12 V lamp fitted to a 6 V supply does not merely dim, it barely lights.' },
      { k: 'h3', t: 'Where Ohm’s law stops applying' },
      { k: 'list', items: [
        'Semiconductor diodes and LEDs are non-ohmic — their forward voltage is nearly fixed regardless of current.',
        'Filament lamps and tungsten heaters change resistance strongly with temperature.',
        'In AC circuits, replace R with Z, because reactance and phase matter as well.',
      ] },
      { k: 'callout', icon: 'info', t: 'Use the Ohm’s law solver to check any two known values; it shows which of the six rearrangements it used.' },
    ],
  },

  'kirchhoff-laws': {
    title: "Kirchhoff's Laws",
    kicker: 'Circuit laws',
    summary: 'KVL and KCL — the two conservation rules that make any multi-loop circuit solvable by hand.',
    tool: 'kirchhoff',
    blocks: [
      { k: 'definition', t: "Kirchhoff's voltage law (KVL) states that the sum of voltage drops around any closed loop is zero. Kirchhoff's current law (KCL) states that the sum of currents at any node is zero." },
      { k: 'p', t: 'Neither law invents physics; both are restatements of energy and charge conservation. KVL follows from the fact that a charge cannot accumulate energy as it goes round a loop; KCL follows from the fact that charge cannot pile up at a junction.' },
      { k: 'h3', t: "Kirchhoff's voltage law" },
      { k: 'formula', eq: 'Σ V_k = 0', note: 'Algebraic sum around a closed loop. Rises positive, drops negative.' },
      { k: 'p', t: 'Pick any closed path through the circuit, including through sources where you traverse from − to + and gain voltage. Write an equation. Repeat for every independent loop. The result is a system of simultaneous equations.' },
      { k: 'h3', t: "Kirchhoff's current law" },
      { k: 'formula', eq: 'Σ I_k = 0', note: 'Algebraic sum at a node. Currents entering are positive, leaving negative.' },
      { k: 'p', t: 'Draw a boundary around any node or junction. Everything the boundary encloses is either a component or a wire, neither of which stores charge, so the current crossing the boundary must sum to zero.' },
      { k: 'h3', t: 'Solving a network' },
      { k: 'list', items: [
        'Label every current and every voltage in the diagram.',
        'Apply KCL at each node except one — the last is implied by the others.',
        'Apply KVL around each independent loop; the number of independent loops is branches minus nodes plus one.',
        'Solve the simultaneous equations, then check the answer against a law you did not use.',
      ] },
      { k: 'callout', icon: 'warn', t: 'The most common mistake is a sign error: traversing a source from + to − loses voltage, and traversing a resistor in the assumed current direction loses IR. Sketch the assumed directions before writing equations.' },
    ],
  },

  'coulombs-law': {
    title: "Coulomb's Law",
    kicker: 'Electrostatics',
    summary: 'The force between two point charges, and how it falls away with distance.',
    tool: 'coulomb',
    blocks: [
      { k: 'definition', t: 'The electrostatic force between two point charges is proportional to the product of the charges and inversely proportional to the square of the distance between them.' },
      { k: 'formula', eq: 'F = k · q₁·q₂ / r²', note: 'k = 8.9875517923×10⁹ N·m²/C² in vacuum.' },
      { k: 'symbols', rows: [
        ['F', 'force between the charges, in newtons (N)'],
        ['k', 'Coulomb’s constant, 8.9875517923×10⁹ N·m²/C²'],
        ['q₁, q₂', 'the two charges, in coulombs (C)'],
        ['r', 'distance between the charges, in metres (m)'],
      ] },
      { k: 'p', t: 'Like charges repel, opposite charges attract — the sign of the product q₁q₂ carries that information, so the same equation covers both.' },
      { k: 'h3', t: 'Why the inverse square' },
      { k: 'p', t: 'Electric field spreads over the surface of an imaginary sphere centred on the charge. Doubling the radius quadruples that surface, and since the field is spread evenly over it, the field strength falls to a quarter. Force falls off with the square of distance for the same reason gravity does.' },
      { k: 'callout', icon: 'info', t: 'Doubling the distance between two charges reduces the force to one quarter — not to one half. This is the fastest fall-off of any common force, and it is why electric forces dominate at atomic distances but are irrelevant between everyday objects.' },
      { k: 'h3', t: 'Relation to voltage' },
      { k: 'p', t: 'The electric potential at a point is the work done per unit charge in bringing a test charge from infinity to that point.' },
      { k: 'formula', eq: 'V = k · q / r', note: 'So V = E/Q, the same definition used in the voltage article.' },
    ],
  },

  'power-factor': {
    title: 'Power Factor and Three-Phase Power',
    kicker: 'AC power',
    summary: 'Why a power factor below 1 wastes current, and how three-phase systems change the arithmetic.',
    tool: 'power-factor',
    blocks: [
      { k: 'definition', t: 'Power factor is the ratio of real power to apparent power. It measures how closely current and voltage stay in phase.' },
      { k: 'formula', eq: 'PF = kW / kVA', note: 'PF = cos φ, where φ is the phase angle between voltage and current.' },
      { k: 'symbols', rows: [
        ['kW', 'real (useful) power', 'what the load actually consumes'],
        ['kVA', 'apparent power', 'what the supply must be sized for'],
        ['kvar', 'reactive power', 'the extra, wasted, component'],
        ['φ', 'phase angle', '0° is perfect, typically 20–35° in industry'],
      ] },
      { k: 'p', t: 'A purely resistive load draws current exactly in step with voltage, giving PF = 1. Motors, transformers and fluorescent lighting are inductive: their current lags, PF drops, and the supply carries current that does no useful work.' },
      { k: 'h3', t: 'The power triangle' },
      { k: 'formula', eq: 'kVA² = kW² + kvar²' },
      { k: 'p', t: 'The three quantities form a right-angled triangle with kVA as the hypotenuse, which is why a low power factor means a large kVA for a given kW.' },
      { k: 'h3', t: 'Three-phase' },
      { k: 'p', t: 'Three-phase systems do more work per ampere than single-phase, which is why industry uses them. The conversion factor depends on how the load is connected.' },
      { k: 'formula', eq: 'Single phase:       kVA = V · A / 1000\nThree-phase star:   kVA = √3 · V · A / 1000\nThree-phase delta:  kVA = 3 · V · A / 1000' },
      { k: 'p', t: 'In star connection the line current equals the phase current and the line voltage is √3 times the phase voltage. In delta the line voltage equals the phase voltage and the line current is √3 times the phase current.' },
      { k: 'callout', icon: 'warn', t: 'Utilities bill for kWh but charge penalties on low power factor, because the extra current heats the distribution network for no benefit. Correction is normally done with capacitor banks, which supply the reactive current locally.' },
    ],
  },

  'wire-gauge-awg': {
    title: 'Wire Gauge (AWG & SWG)',
    kicker: 'Conductors',
    summary: 'Why American Wire Gauge numbers get smaller as wires get thicker, and what the numbers actually mean.',
    tool: 'wire-gauge',
    blocks: [
      { k: 'definition', t: 'AWG is a logarithmic scale: each step in gauge number is a fixed percentage change in diameter, and therefore a fixed ratio change in cross-sectional area and resistance.' },
      { k: 'formula', eq: 'd(in) = 0.005 · 92^((36 − n)/39)', note: 'd in inches, n the AWG number. d(mm) = 0.127 · 92^((36 − n)/39).' },
      { k: 'p', t: 'The counter-intuitive direction is worth internalising: 14 AWG is thicker and carries more current than 18 AWG, because 18 is the higher number. A wire 40 AWG above a given gauge is roughly half the diameter.' },
      { k: 'h3', t: 'Working out area' },
      { k: 'formula', eq: 'A = π/4 · d²', note: 'Cross-section in in² from inches, or mm² from millimetres.' },
      { k: 'h3', t: 'Working backwards from a diameter' },
      { k: 'formula', eq: 'n = 36 − 39 · log₉₂(d / 0.005)' },
      { k: 'h3', t: 'British Standard Wire Gauge' },
      { k: 'p', t: 'SWG is an older, non-logarithmic series defined by a table of diameters. Where AWG skips some numbers at the fine end, SWG does not — which is why "5/0" means 0.040 in in SWG but 0.0459 in in AWG.' },
      { k: 'table', head: ['Gauge', 'AWG diameter (in)', 'Area (mm²)'], rows: [
        ['18 AWG', '0.0159', '0.823'], ['16 AWG', '0.0201', '1.31'], ['14 AWG', '0.0323', '2.08'],
        ['12 AWG', '0.0408', '3.31'], ['10 AWG', '0.0519', '5.26'], ['8 AWG', '0.0650', '8.37'],
        ['6 AWG', '0.0812', '13.3'], ['4 AWG', '0.102', '20.9'], ['2 AWG', '0.128', '33.1'],
        ['1/0 AWG', '0.149', '44.6'], ['2/0 AWG', '0.185', '67.4'], ['4/0 AWG', '0.235', '107'],
      ] },
      { k: 'callout', icon: 'warn', t: 'The AWG numbers say nothing about current capacity. That depends on insulation, installation method, ambient temperature and local code — and it is the reason two identical wires can have very different safe ratings.' },
    ],
  },

  'exponent-rules': {
    title: 'Exponent Rules',
    kicker: 'Algebra',
    summary: 'Every law of exponents — product, quotient, power-of-power, zero, negative and fractional — with worked examples.',
    tool: 'scientific-calc',
    blocks: [
      { k: 'definition', t: 'An exponent says how many times a base is multiplied by itself: xⁿ means x written n times as a factor.' },
      { k: 'h3', t: 'The three core laws' },
      { k: 'formula', eq: 'xᵃ · xᵇ = xᵃ⁺ᵇ\nxᵃ ÷ xᵇ = xᵃ⁻ᵇ\n(xᵃ)ᵇ = xᵃ·ᵇ', note: 'Product, quotient, and power-of-power.' },
      { k: 'symbols', rows: [
        ['xᵃ · xᵇ', 'when bases are the same, add the exponents'],
        ['xᵃ ÷ xᵇ', 'when bases are the same, subtract the exponents'],
        ['(xᵃ)ᵇ', 'power raised to a power — multiply the exponents'],
        ['x⁰ = 1', 'any non-zero number to the zero power is 1'],
        ['x⁻ᵃ = 1 ÷ xᵃ', 'a negative exponent reciprocates'],
        ['x^(a/b) = ᵇ√(xᵃ)', 'a fractional exponent is a root then a power'],
      ] },
      { k: 'h3', t: 'Powers of ten and zero' },
      { k: 'p', t: '10⁰ = 1, 10¹ = 10, 10⁻¹ = 0.1. Each step of one exponent multiplies by 10, which is the whole of the metric prefix system.' },
      { k: 'formula', eq: '10³ × 10⁻⁵ = 10³⁻⁵ = 10⁻² = 0.01' },
      { k: 'h3', t: 'Worked example' },
      { k: 'p', t: 'Simplify (2³ · 2⁴) ÷ 2².' },
      { k: 'formula', eq: '(2³ · 2⁴) ÷ 2² = 2³⁺⁴⁻² = 2⁵ = 32' },
      { k: 'h3', t: 'Common mistakes' },
      { k: 'list', items: [
        '(xᵃ)ᵇ ≠ xᵃ⁺ᵇ — powers of powers multiply exponents, they do not add.',
        'xᵃ · yᵃ = (xy)ᵃ only when the exponent is the same, not the base.',
        'A negative exponent is not a negative number: 2⁻³ = 1/8, not −8.',
      ] },
      { k: 'callout', icon: 'info', t: 'Anything the exponent rules can simplify can also be checked on a calculator — the scientific calculator tool follows the same precedence rules.' },
    ],
  },

  'logarithms': {
    title: 'Logarithms',
    kicker: 'Algebra',
    summary: 'What a logarithm is, the three laws, change of base and why engineers think in decades.',
    tool: 'log',
    blocks: [
      { k: 'definition', t: 'A logarithm answers “to what power must the base be raised to give this number?” — log_b x = y means b^y = x.' },
      { k: 'formula', eq: 'log_b x = y\n⇔ b^y = x' },
      { k: 'h3', t: 'The three laws' },
      { k: 'symbols', rows: [
        ['log_b (x·y)', 'log_b x + log_b y  — product becomes sum'],
        ['log_b (x ÷ y)', 'log_b x − log_b y  — quotient becomes difference'],
        ['log_b (xⁿ)', 'n · log_b x  — power moves out front'],
        ['log_b 1', '0  — any base to the zero power is 1'],
        ['log_b b', '1  — the base to the first power is itself'],
      ] },
      { k: 'h3', t: 'Which base?' },
      { k: 'p', t: 'log means base 10 (common) in most practical work; ln means base e ≈ 2.71828 (natural, from calculus); log₂ is binary (bits, entropy, complexity). Base 2 is what “bit” means: log₂ N tells how many binary decisions separate N possibilities from one.' },
      { k: 'formula', eq: 'log₂ 256 = 8\nlog₁₀ 1000 = 3\nln 2 ≈ 0.693' },
      { k: 'h3', t: 'Change of base' },
      { k: 'p', t: 'Any log can be rewritten in whichever base is convenient — usually to get e or 10 out of a base-2 or odd-base log.' },
      { k: 'formula', eq: 'log₂ x = ln x ÷ ln 2 = log₁₀ x ÷ log₁₀ 2' },
      { k: 'h3', t: 'Decibels are logs' },
      { k: 'p', t: 'A decibel is a ratio on a logarithmic scale: 3 dB doubles the power, 10 dB multiplies it by ten. That is why audio and radio engineers never multiply — they add dB.' },
      { k: 'formula', eq: 'dB = 10 · log₁₀ (P₂ ÷ P₁)' },
      { k: 'callout', icon: 'info', t: 'Anti-log is the inverse of log: antilog_b y = b^y. The anti-log tool reverses this page’s formulas, and the log tool evaluates log_b x directly.' },
    ],
  },

  'algebra': {
    title: 'Algebra Cheat Sheet',
    kicker: 'Algebra',
    summary: 'Properties, radicals, rational expressions and the quadratic formula — the working rules and the common shapes.',
    tool: 'quadratic',
    blocks: [
      { k: 'definition', t: 'Algebra is arithmetic with unknowns. Variables stand for numbers; properties and rules let you rewrite expressions without changing their value.' },
      { k: 'h3', t: 'The properties of arithmetic' },
      { k: 'symbols', rows: [
        ['Commutative', 'a + b = b + a,  a · b = b · a  — order does not matter'],
        ['Associative', '(a + b) + c = a + (b + c),  (a · b) · c = a · (b · c)'],
        ['Distributive', 'a · (b + c) = a · b + a · c  — the single most used rule'],
        ['Identity', 'a + 0 = a,  a · 1 = a'],
        ['Inverse', 'a + (−a) = 0,  a · (1/a) = 1'],
      ] },
      { k: 'h3', t: 'The distributive pattern in full' },
      { k: 'formula', eq: 'a(b + c) = ab + ac\n(a + b)(c + d) = ac + ad + bc + bd', note: 'FOIL is just the distributive law applied twice.' },
      { k: 'h3', t: 'Radicals (the geometric-mean family)' },
      { k: 'symbols', rows: [
        ['√x · √y', '√(x·y)  — the square root distributes over products, not sums'],
        ['√x ÷ √y', '√(x ÷ y)  — same for quotients'],
        ['√x + √x', 'you cannot combine different radicands'],
        ['(√x)²', 'x  — for x ≥ 0 the square and the root cancel'],
        ['√(a²)', '|a|  — not a itself: sign survives the square root'],
      ] },
      { k: 'h3', t: 'The quadratic formula' },
      { k: 'formula', eq: 'x = (−b ± √(b² − 4ac)) ÷ 2a', note: 'Solves any ax² + bx + c = 0 with no factoring required.' },
      { k: 'symbols', rows: [
        ['b² − 4ac > 0', 'two real roots'],
        ['b² − 4ac = 0', 'one repeated root — the curve touches the axis'],
        ['b² − 4ac < 0', 'no real roots — the curve never reaches the axis'],
      ] },
      { k: 'h3', t: 'Common radicand simplifications' },
      { k: 'table', head: ['Expression', 'Simplified'], rows: [
        ['√75', '5√3'], ['√48', '4√3'], ['√125', '5√5'], ['√18', '3√2'],
        ['√200', '10√2'], ['√(x⁴y)', 'x²√y'], ['√(50a²b³)', '5a · b√(2b)'],
      ] },
      { k: 'h3', t: 'Difference and sum of squares' },
      { k: 'formula', eq: 'a² − b² = (a − b)(a + b)\na² + b² does not factor over the reals\n(a ± b)³ = a³ ± 3a²b + 3ab² ± b³' },
      { k: 'h3', t: 'Rational expressions' },
      { k: 'p', t: 'A fraction of polynomials is a rational expression. Cancel common factors only when they are factors of the whole numerator and the whole denominator — never cancel just an a out of each term.' },
      { k: 'formula', eq: 'a·x ÷ a·y = x ÷ y\nx ÷ (a·y) = x ÷ a ÷ y  — powers of a multiply and divide freely' },
      { k: 'callout', icon: 'warn', t: 'The classic algebra mistakes: cancelling terms that are not factors, √(a²) = a when a < 0, and dividing by a variable before checking it could be zero.' },
    ],
  },

  'trigonometry': {
    title: 'Trigonometry Cheat Sheet',
    kicker: 'Algebra',
    summary: 'Sines, cosines and tangents — definitions, special angles, and the identities you reach for most.',
    tool: 'trig',
    blocks: [
      { k: 'definition', t: 'Trigonometry is the study of relationships between the sides and angles of triangles — and, beyond that, between angles and circular motion in general.' },
      { k: 'h3', t: 'Definitions in a right triangle' },
      { k: 'formula', eq: 'sin α = a ÷ c\ncos α = b ÷ c\ntan α = a ÷ b', note: 'a = opposite, b = adjacent, c = hypotenuse.' },
      { k: 'h3', t: 'The special angles worth knowing cold' },
      { k: 'table', head: ['θ', 'rad', 'sin', 'cos', 'tan'], rows: [
        ['0°', '0', '0', '1', '0'],
        ['30°', 'π/6', '½', '√3÷2', '1÷√3'],
        ['45°', 'π/4', '√2÷2', '√2÷2', '1'],
        ['60°', 'π/3', '√3÷2', '½', '√3'],
        ['90°', 'π/2', '1', '0', '∞'],
        ['120°', '2π/3', '√3÷2', '−½', '−√3'],
        ['135°', '3π/4', '√2÷2', '−√2÷2', '−1'],
        ['150°', '5π/6', '½', '−√3÷2', '−1÷√3'],
        ['180°', 'π', '0', '−1', '0'],
        ['270°', '3π/2', '−1', '0', '∞'],
        ['360°', '2π', '0', '1', '0'],
      ] },
      { k: 'h3', t: 'Core identities' },
      { k: 'symbols', rows: [
        ['Pythagorean', 'sin²θ + cos²θ = 1  — for every angle'],
        ['Symmetry', 'sin(−θ) = −sin θ,  cos(−θ) = cos θ  — sine is odd, cosine is even'],
        ['Complementary', 'sin(90° − θ) = cos θ,  cos(90° − θ) = sin θ'],
        ['Double angle', 'sin 2θ = 2 sin θ cos θ\ncos 2θ = cos²θ − sin²θ = 2cos²θ − 1 = 1 − 2sin²θ'],
        ['Sum and difference', 'sin(α±β) = sin α cos β ± cos α sin β\ncos(α±β) = cos α cos β ∓ sin α sin β'],
        ['Reciprocals', 'csc θ = 1÷sin θ,  sec θ = 1÷cos θ,  cot θ = 1÷tan θ'],
      ] },
      { k: 'h3', t: 'Law of sines and cosines' },
      { k: 'formula', eq: 'a ÷ sin α = b ÷ sin β = c ÷ sin γ\nc² = a² + b² − 2ab cos γ', note: 'Use the sine law for AAS, ASA and SSA; the cosine law for SAS and SSS.' },
      { k: 'h3', t: 'Euler’s formula' },
      { k: 'formula', eq: 'e^(iθ) = cos θ + i sin θ\nsin θ = (e^(iθ) − e^(−iθ)) ÷ 2i\ncos θ = (e^(iθ) + e^(−iθ)) ÷ 2' },
      { k: 'h3', t: 'Derivatives and integrals' },
      { k: 'symbols', rows: [
        ['d/dx sin x', 'cos x'],
        ['d/dx cos x', '−sin x'],
        ['d/dx tan x', 'sec²x'],
        ['∫ sin x dx', '−cos x + C'],
        ['∫ cos x dx', 'sin x + C'],
        ['∫ tan x dx', '−ln|cos x| + C'],
      ] },
      { k: 'callout', icon: 'info', t: 'If you forget a value, the 30-60-90 triangle (1, √3, 2) and the 45-45-90 triangle (1, 1, √2) recover it — that is the exhaustive list of exact special cases.' },
    ],
  },

  'calculus': {
    title: 'Calculus Cheat Sheet',
    kicker: 'Calculus',
    summary: 'Derivatives, limits and integrals — the rules you actually use most often, with worked examples.',
    tool: 'scientific-calc',
    blocks: [
      { k: 'definition', t: 'Calculus is the mathematics of change: derivatives measure how fast something changes, integrals measure how much accumulates.' },
      { k: 'h3', t: 'Definitions worth memorising' },
      { k: 'symbols', rows: [
        ['Derivative', 'f′(x) = lim(h→0) (f(x+h) − f(x)) ÷ h  — the slope of the tangent'],
        ['Integral', '∫ f(x) dx  — the area under the curve, the inverse of the derivative'],
        ['Limit', 'lim(x→a) f(x)  — the value f(x) approaches, never necessarily reaches'],
      ] },
      { k: 'h3', t: 'The fundamental theorem' },
      { k: 'formula', eq: 'F′(x) = f(x)\n∫ₐᵃ f(t) dt = 0\n∫ₐᵇ f(t) dt = F(b) − F(a)' },
      { k: 'h3', t: 'Derivative rules (with examples)' },
      { k: 'symbols', rows: [
        ['Power rule', 'd/dx xⁿ = n·xⁿ⁻¹  — multiply by the exponent, drop it by one'],
        ['Constant rule', 'd/dx c = 0  — nothing about a constant changes'],
        ['Constant multiple', 'd/dx (c·f) = c·f′  — constants sail through'],
        ['Sum rule', 'd/dx (f + g) = f′ + g′  — differentiate term by term'],
        ['Product rule', 'd/dx (fg) = f′g + fg′  — never f·g with a single plus'],
        ['Quotient rule', 'd/dx (f/g) = (f′g − fg′) ÷ g²'],
        ['Chain rule', 'd/dx f(g(x)) = f′(g(x)) · g′(x)  — outside × inside'],
      ] },
      { k: 'h3', t: 'Common derivatives' },
      { k: 'table', head: ['Function', 'Derivative'], rows: [
        ['sin x', 'cos x'],
        ['cos x', '−sin x'],
        ['tan x', 'sec²x'],
        ['eˣ', 'eˣ  — e is its own derivative'],
        ['ln x', '1/x'],
        ['aˣ', 'aˣ · ln a'],
        ['√x', '1 ÷ (2√x)'],
        ['1/x', '−1/x²'],
      ] },
      { k: 'h3', t: 'Integration rules' },
      { k: 'symbols', rows: [
        ['Power rule', '∫ xⁿ dx = xⁿ⁺¹ ÷ (n + 1) + C,  n ≠ −1'],
        ['1 ÷ x', '∫ (1/x) dx = ln|x| + C'],
        ['eˣ', '∫ eˣ dx = eˣ + C'],
        ['sin x', '∫ sin x dx = −cos x + C'],
        ['cos x', '∫ cos x dx = sin x + C'],
        ['Substitution', '∫ f(g(x))·g′(x) dx = ∫ f(u) du,  u = g(x)'],
        ['Parts', '∫ u dv = uv − ∫ v du'],
      ] },
      { k: 'h3', t: 'Limit rules' },
      { k: 'symbols', rows: [
        ['Constant', 'lim(x→a) c = c'],
        ['Sum', 'lim (f + g) = lim f + lim g'],
        ['Product', 'lim (f · g) = lim f · lim g'],
        ['Quotient', "lim (f ÷ g) = lim f ÷ lim g,  provided lim g ≠ 0"],
        ['Sandwich', 'if g ≤ f ≤ h and lim g = lim h, then lim f = both'],
      ] },
      { k: 'callout', icon: 'warn', t: 'The derivative of a product is not the product of the derivatives, and d/dx f(g(x)) is not f′(g(x)) — the chain rule is the difference between a right answer and a mess.' },
    ],
  },

  'capacitor': {
    title: 'Capacitor',
    kicker: 'Components',
    summary: 'How a capacitor stores charge, how reactance works, and how to combine caps in series and parallel.',
    tool: 'capacitor',
    blocks: [
      { k: 'definition', t: 'A capacitor stores electric charge between two close conductors separated by an insulating dielectric material.' },
      { k: 'formula', eq: 'C = Q ÷ V', note: 'Q is charge in coulombs, V is voltage across the plates. C is capacitance in farads.' },
      { k: 'h3', t: 'Capacitance of a parallel-plate capacitor' },
      { k: 'p', t: 'The capacitance of two parallel plates grows with plate area and shrinks with the distance between them. The constant ε₀ is the permittivity of free space.' },
      { k: 'formula', eq: 'C = ε₀ · εᵣ · A ÷ d', note: 'ε₀ ≈ 8.854×10⁻¹² F/m; εᵣ is the dielectric constant of the insulator (air 1, SiO₂ 3.9, mica ≈ 7).' },
      { k: 'h3', t: 'Capacitors in series and parallel' },
      { k: 'formula', eq: 'Series:    1 ÷ C_T = 1 ÷ C₁ + 1 ÷ C₂ + …\nParallel:  C_T = C₁ + C₂ + …' },
      { k: 'p', t: 'Series capacitors all carry the same charge but see a fraction of the total voltage; parallel capacitors all see the same voltage but share the current.' },
      { k: 'h3', t: 'Reactance: why it blocks DC' },
      { k: 'p', t: 'At zero or very low frequency a capacitor’s impedance is extremely high — it passes no DC after the initial charging spike. As frequency rises its opposition falls.' },
      { k: 'formula', eq: 'X_C = 1 ÷ (2πfC)', note: 'Impedance of a pure capacitor, in ohms.' },
      { k: 'symbols', rows: [
        ['f = 0 Hz', 'X_C → ∞ — a capacitor blocks DC entirely'],
        ['f = 50 Hz, C = 100 µF', 'X_C ≈ 32 Ω'],
        ['f = 1 kHz, C = 100 nF', 'X_C ≈ 1.6 kΩ'],
      ] },
      { k: 'h3', t: 'Energy stored in a charged capacitor' },
      { k: 'formula', eq: 'E = ½ · C · V²', note: 'Energy is released as a destructive pulse when a shorted charged capacitor discharges — which is why large filter caps can explode under fault.' },
      { k: 'symbols', rows: [
        ['C = 10 µF, V = 25 V', 'E = 3.125 mJ'],
        ['C = 470 µF, V = 400 V', 'E ≈ 37.6 J — dangerous'],
      ] },
      { k: 'callout', icon: 'warn', t: 'Short a charged capacitor — or discharge it with a screwdriver — and the released energy decides whether the resulting flash is exciting or expensive. Always discharge through a resistor, not a short.' },
    ],
  },

  'inductor': {
    title: 'Inductor',
    kicker: 'Components',
    summary: 'Energy stored in a magnetic field, inductive reactance, and why a collapsing field produces a voltage spike.',
    tool: 'inductor',
    blocks: [
      { k: 'definition', t: 'An inductor stores energy in the magnetic field around a coil of wire when current flows through it.' },
      { k: 'formula', eq: 'E = ½ · L · I²', note: 'L is inductance in henries, I is the current through the coil in amperes.' },
      { k: 'h3', t: 'Voltage across an inductor' },
      { k: 'p', t: 'An inductor opposes every change in the current flowing through it. Voltage across it is proportional to the rate of change of current — not to the current itself.' },
      { k: 'formula', eq: 'V = L · (di ÷ dt)', note: 'Cutting the current in a coil produces a fast-rising negative voltage — this is exactly how a car ignition coil makes a spark.' },
      { k: 'h3', t: 'Inductive reactance' },
      { k: 'formula', eq: 'X_L = 2πfL' },
      { k: 'p', t: 'An inductor’s opposition to an AC signal rises with frequency: it passes DC freely but blocks high-frequency RF.' },
      { k: 'symbols', rows: [
        ['f = 50 Hz, L = 10 mH', 'X_L ≈ 3.14 Ω'],
        ['f = 10 kHz, L = 10 mH', 'X_L ≈ 628 Ω'],
        ['f = 1 MHz, L = 10 µH', 'X_L ≈ 63 Ω'],
      ] },
      { k: 'h3', t: 'Combining inductors' },
      { k: 'formula', eq: 'Series:    L_T = L₁ + L₂ + …\nParallel:  1 ÷ L_T = 1 ÷ L₁ + 1 ÷ L₂ + …' },
      { k: 'p', t: 'Unlike capacitors, series inductors add their reactances; parallel inductors oppose each other and reduce net reactance. Parallel combination is identical to resistors.' },
      { k: 'callout', icon: 'warn', t: 'A relay or transformer coil left switched open produces a very large voltage spike (V = L · di/dt) that can puncture a transistor. A freewheeling diode across the coil gives that energy a harmless path to dissipate.' },
    ],
  },

  'electronic-components': {
    title: 'Electronic Components',
    kicker: 'Components',
    summary: 'Passive vs active parts — the functional families every bench contains, sorted the way a hobbyist opens a box.',
    tool: 'resistor-color',
    blocks: [
      { k: 'definition', t: 'An electronic component is a discrete device that performs one electrical role in a circuit. Every component falls into exactly one of two camps: passive (needs no extra power source) or active (needs one, and can provide gain).' },
      { k: 'h3', t: 'Passive components' },
      { k: 'list', items: [
        'Wires and jumpers — conduct without asking.',
        'Switches — SPST, DPDT, pushbutton, reed, toggle.',
        'Resistors (R) and variable resistors (rheostats, pots).',
        'Capacitors (C), fixed and electrolytic.',
        'Inductors (L) and coils.',
        'Lamps and indicators.',
        'Fuses.',
        'Crystals.',
        'Relays.',
        'Connectors and headers.',
      ] },
      { k: 'h3', t: 'Active components' },
      { k: 'list', items: [
        'Power sources — batteries, DC supplies, bench supplies.',
        'Relays — a coil driving contacts, an electrical amplifier.',
        'Diodes — rectifiers, LEDs, Zeners, photodiodes.',
        'Transistors — BJTs (NPN/PNP), Field-effect transistors (N-channel/P-channel), optocouplers.',
        'Operational amplifiers (op-amps) — the universal gain block.',
        '555 timers — the classic monostable and astable ICs.',
        'Microcontrollers, sensors and ICs — the brains and the sense.',
      ] },
      { k: 'h3', t: 'Resistor packages' },
      { k: 'list', items: [
        'Through-hole ¼ W (beige body, colour bands) — the default in kits.',
        'Precision 1 % resistor (metal film, often blue).',
        'SMD — 0805, 0603, 0402 chip sizes; marked with EIA-96 codes.',
        'Potentiometers and trimpots — variable voltage dividers.',
      ] },
      { k: 'h3', t: 'The five components that matter most on this site' },
      { k: 'list', items: [
        'Resistors — every current-limiting application.',
        'Capacitors — smoothing, coupling, filtering.',
        'Inductors — noise suppression, switching conversion, RF.',
        'Diodes — reverse-current protection, OR circuits, rectification.',
        'Transistors — switches, amplifiers, drivers.',
      ] },
      { k: 'callout', icon: 'info', t: 'Read the silkscreen and the datasheet — markings, polarity and pinout matter. A reversed capacitor bulges and pops.' },
    ],
  },

  'probability-distributions': {
    title: 'Probability Distributions',
    kicker: 'Statistics',
    summary: 'What a distribution is, discrete versus continuous, and the ones worth memorising — binomial, Poisson, normal, uniform.',
    tool: 'stddev',
    blocks: [
      { k: 'definition', t: 'A probability distribution describes how probability is spread over the possible values of a random variable. The cumulative distribution function F(x) is the probability that the variable falls at or below x.' },
      { k: 'formula', eq: 'Continuous:  F(x) = ∫₋∞ˣ f(u) du\nDiscrete:    F(x) = Σₖ≤ₓ P(X = k)' },
      { k: 'h3', t: 'Discrete distributions' },
      { k: 'table', head: ['Distribution', 'Symbol', 'Mean', 'Variance'], rows: [
        ['Binomial', 'X ~ Bin(n, p)', 'n·p', 'n·p(1 − p)'],
        ['Poisson', 'X ~ Poisson(λ)', 'λ', 'λ'],
        ['Uniform', 'X ~ U(a, b)', '(a+b)/2', '(b−a)²/12'],
        ['Geometric', 'X ~ Geom(p)', '1/p', '(1 − p)/p²'],
        ['Hypergeometric', 'X ~ HG(N, K, n)', 'nK/N', 'n·(K/N)·(1−K/N)·(N−n)/(N−1)'],
        ['Bernoulli', 'X ~ Bern(p)', 'p', 'p(1 − p)'],
      ] },
      { k: 'h3', t: 'Continuous distributions' },
      { k: 'table', head: ['Distribution', 'Symbol', 'Mean', 'Variance'], rows: [
        ['Normal', 'X ~ N(μ, σ²)', 'μ', 'σ²'],
        ['Uniform', 'X ~ U(a, b)', '(a+b)/2', '(b−a)²/12'],
        ['Exponential', 'X ~ exp(λ)', '1/λ', '1/λ²'],
        ['Gamma', 'X ~ gamma(c, λ)', 'c/λ', 'c/λ²'],
        ['Chi-squared', 'X ~ χ²(k)', 'k', '2k'],
        ['Student’s t', 'X ~ t(k)', '0', 'k/(k−2), k > 2'],
      ] },
      { k: 'h3', t: 'Continuous vs discrete' },
      { k: 'list', items: [
        'Discrete — the variable takes countable values. Described by a probability mass function P(X = k).',
        'Continuous — the variable takes a range of values. Described by a probability density function f(x).',
        'For continuous variables, the probability of any exact point is zero — only intervals carry non-zero probability.',
        'The z-table on the tables page is the N(0, 1) CDF at every 0.01 step from 0 to 3.99.',
      ] },
      { k: 'h3', t: 'What to memorise' },
      { k: 'list', items: [
        'Normal: symmetric, two parameters (μ, σ²). 68 % within 1σ, 95 % within 1.96σ, 99.7 % within 3σ.',
        'Poisson: for counts of rare events. Mean = variance.',
        'Binomial: for the number of successes in n independent trials.',
        'Exponential: for time until the next event from a memoryless process.',
      ] },
      { k: 'callout', icon: 'info', t: 'The standard normal CDF Φ(z) is exactly the table on the tables page. 1.96σ either side covers 95 % of outcomes — the usual rule of thumb.' },
    ],
  },

  'electrical-units': {
    title: 'Electrical Units',
    kicker: 'Reference',
    summary: 'Every electrical unit — ampere, volt, ohm, watt, farad, henry, siemens — with its symbol and the quantity it measures.',
    tool: 'ohm-law',
    blocks: [
      { k: 'definition', t: 'A unit is a fixed reference quantity. Seventeen SI base and derived units cover electricity and magnetism — each one answers “one what?” for a single physical quantity.' },
      { k: 'h3', t: 'Electrical units at a glance' },
      { k: 'table', head: ['Unit', 'Symbol', 'Quantity'], rows: [
        ['Ampere', 'A', 'electric current'],
        ['Volt', 'V', 'electric potential difference (voltage)'],
        ['Ohm', 'Ω', 'electrical resistance'],
        ['Watt', 'W', 'electric power'],
        ['Decibel-milliwatt', 'dBm', 'logarithmic power relative to 1 mW'],
        ['Decibel-watt', 'dBW', 'logarithmic power relative to 1 W'],
        ['Volt-ampere-reactive', 'var', 'reactive power'],
        ['Volt-ampere', 'VA', 'apparent power'],
        ['Farad', 'F', 'capacitance'],
        ['Henry', 'H', 'inductance'],
        ['Siemens / mho', 'S', 'conductance, admittance'],
        ['Coulomb', 'C', 'electric charge'],
        ['Ampere-hour', 'Ah', 'electric charge, batteries'],
        ['Joule', 'J', 'energy, work'],
        ['Kilowatt-hour', 'kWh', 'energy, billing'],
        ['Electron-volt', 'eV', 'energy of particles'],
        ['Ohm-metre', 'Ω·m', 'resistivity'],
        ['Siemens per metre', 'S/m', 'conductivity'],
        ['Volts per metre', 'V/m', 'electric field strength'],
        ['Newtons per coulomb', 'N/C', 'electric field strength'],
        ['Volt-metre', 'V·m', 'electric flux'],
        ['Tesla', 'T', 'magnetic flux density'],
        ['Gauss', 'G', 'magnetic flux density (cgs)'],
        ['Weber', 'Wb', 'magnetic flux'],
        ['Hertz', 'Hz', 'frequency'],
      ] },
      { k: 'h3', t: 'Prefixes and what they mean' },
      { k: 'symbols', rows: [
        ['pico (p)', '×10⁻¹² — one trillionth'],
        ['nano (n)', '×10⁻⁹ — one billionth'],
        ['micro (μ)', '×10⁻⁶ — one millionth'],
        ['milli (m)', '×10⁻³ — one thousandth'],
        ['kilo (k)', '×10³ — one thousand'],
        ['mega (M)', '×10⁶ — one million'],
        ['giga (G)', '×10⁹ — one billion'],
        ['tera (T)', '×10¹² — one trillion'],
      ] },
      { k: 'h3', t: 'Reading a meter like a bench' },
      { k: 'p', t: 'An ammeter connects in series (it reads the current through it). A voltmeter connects in parallel (it reads the voltage across it). An ohmmeter is self-powered — it des-energises the circuit and measures how hard the loop fights a test current.' },
      { k: 'callout', icon: 'info', t: 'The symbols on the meter are exactly the symbols printed on the page you are reading — V, A, Ω, Hz, F. If the reading is tiny, milli/k/m/M change the scale, not the quantity.' },
    ],
  },

  'dc-circuit-rules': {
    title: 'DC Circuit Rules',
    kicker: 'Fundamentals',
    summary: 'The handful of formulae every DC problem obeys — series and parallel combination, divider rule, KVL/KCL — in one place.',
    tool: 'ohms-law',
    blocks: [
      { k: 'definition', t: 'DC circuit rules are the conservation laws and series/parallel identities that hold in every linear DC network: KVL, KCL, Ohm’s law, and the expressions for equivalent resistance/capacitance/inductance.' },
      { k: 'h3', t: 'Series circuit' },
      { k: 'formula', eq: 'V_T = V₁ + V₂ + V₃ + …\nI_T = I₁ = I₂ = I₃ = …\nR_T = R₁ + R₂ + R₃ + …\n1/C_T = 1/C₁ + 1/C₂ + 1/C₃ + …\nL_T = L₁ + L₂ + L₃ + …' },
      { k: 'h3', t: 'Parallel circuit' },
      { k: 'formula', eq: 'V_T = V₁ = V₂ = V₃ = …\nI_T = I₁ + I₂ + I₃ + …\n1/R_T = 1/R₁ + 1/R₂ + 1/R₃ + …\nC_T = C₁ + C₂ + C₃ + …\n1/L_T = 1/L₁ + 1/L₂ + 1/L₃ + …' },
      { k: 'h3', t: 'Voltage and current divider rules' },
      { k: 'p', t: 'In a series string, the fraction of the total voltage that drops across Rᵢ is proportional to Rᵢ as a share of the total:' },
      { k: 'formula', eq: 'Vᵢ = V_T · Rᵢ ÷ (R₁ + R₂ + R₃ + …)' },
      { k: 'p', t: 'In a parallel combination, the current through one branch is the share of the total current that the complementary resistances dictate:' },
      { k: 'formula', eq: 'I₁ = I_T · (R₂ + R₃ + …) ÷ (R₁ + R₂ + R₃ + …)' },
      { k: 'h3', t: 'Kirchhoff’s laws' },
      { k: 'symbols', rows: [
        ['KVL', 'The sum of voltage drops around a closed loop is zero: Σ Vᵢ = 0'],
        ['KCL', 'The sum of currents at a node is zero: Σ Iᵢ = 0'],
      ] },
      { k: 'p', t: 'In practical terms: rises prove drops; if you traverse a battery from – to + you add a voltage, if you traverse a resistor in the direction of current you subtract it; outlets = inlets at every node.' },
      { k: 'h3', t: 'Capacitor and inductor energy' },
      { k: 'formula', eq: 'E_C = ½ · C · V²\nE_L = ½ · L · I²' },
      { k: 'h3', t: 'Permittivity and the plates' },
      { k: 'formula', eq: 'C = ε₀ · εᵣ · A ÷ d', note: 'd is the separation between plates; A is the overlapping area.' },
      { k: 'callout', icon: 'info', t: 'These identities are the reason the triangle works. If you memorise just KVL, KCL and Ohm’s law, you can re-derive each row above when you need it.' },
    ],
  },

  'kilowatt-hour': {
    title: 'Kilowatt-Hours and Energy',
    kicker: 'Everyday electricity',
    summary: 'What kWh means, how bills work, and why 1 kWh is 3.6 megajoules of anything.',
    tool: 'energy-bill',
    blocks: [
      { k: 'definition', t: 'One kilowatt-hour (kWh) is one thousand watts of power applied for one hour — that is 3.6 megajoules (MJ) of energy, whatever the source.' },
      { k: 'formula', eq: 'E = P × t', note: 'In electrical terms: watts × seconds gives joules; watts × hours gives watt-hours (Wh); kW × h gives kilowatt-hours.' },
      { k: 'h3', t: 'How utility bills work' },
      { k: 'p', t: 'The meter integrates your power draw over time and records energy in kWh. Multiply the meter reading by your unit rate to get money: a 3 kW immersion heater running 4 hours a day for a year is 4,380 kWh.' },
      { k: 'formula', eq: 'Cost = kWh × rate', note: 'Energy and money are the same number once the meter is right.' },
      { k: 'table', head: ['1 kWh in other units', 'Value'], rows: [
        ['Joules', '3,600,000 J (3.6 MJ)'],
        ['BTU', '3,412.14 BTU (thermogenic energy unit)'],
        ['Calories', '860,000 cal (860 kcal)'],
        ['Wh', '1,000 Wh'],
        ['Tons of TNT', '~0.86 kg of TNT (scientific only)'],
      ] },
      { k: 'h3', t: 'Comparing devices' },
      { k: 'p', t: 'Cost comparisons across devices use the same relation. A 2 kW space heater running 3 hours a day for a year consumes 2,190 kWh; a modern heat-pump clothes dryer with a COP of 3 uses a third of that.' },
      { k: 'h3', t: 'BTU and kWh' },
      { k: 'p', t: 'US gas utilities bill in therms (100,000 BTU); European gas utilities bill in kWh. Both are the same measurement of heat.' },
      { k: 'formula', eq: '1 therm = 100,000 BTU ≈ 29.3 kWh\n1 kWh ≈ 3412.14 BTU' },
      { k: 'callout', icon: 'info', t: 'Stats quoted different ways in different countries but the physics does not care: 1 kWh is always 3.6 MJ.' },
    ],
  },

  'parts-per-million': {
    title: 'Parts Per Million',
    kicker: 'Measurement',
    summary: 'What ppm means, how it relates to percent, permil, ppb and ppt, and why Co₂ is measured in it.',
    tool: 'ppm',
    blocks: [
      { k: 'definition', t: 'A part-per-million is exactly what it says: one part in a million, so 1 ppm = 1e-6. It is the purest way to write very small fractions without scientific notation.' },
      { k: 'h3', t: 'The ppm family in one line' },
      { k: 'formula', eq: '1 ratio = 1 % = 10 ‰ = 10,000 ppm = 10,000,000 ppb = 10,000,000,000 ppt' },
      { k: 'h3', t: 'ppm by mass (ppmw) and by volume (ppmv)' },
      { k: 'list', items: [
        'ppmw — the ratio of weights: mg/L of water roughly equal ppm (for dilute solutions at 4 °C).',
        'ppmv — the ratio of volumes: for gases, "ppm of CO₂" means parts per million by volume (µmol/mol).',
        'For air, ppmv ≈ ppmv in dry air at standard pressure. At altitude the absolute number of molecules changes, but ratio does not.',
      ] },
      { k: 'table', head: ['Ratio', 'Parts'], rows: [
        ['1%', '10,000 ppm'],
        ['0.1 ppm', '100 ppb'],
        ['1 ppm CO₂', '1 µmol/mol'],
        ['420 ppm CO₂ in air', '≈ 0.042%'],
        ['1 g/L in water', '≈ 1,000 ppm'],
      ] },
      { k: 'h3', t: 'ppm and molarity (aqueous solutions)' },
      { k: 'p', t: 'Molarity is moles per litre. To convert to ppm in water you almost always need the solute’s molar mass and the density of water at the actual temperature — cold water is denser, so the same molarity is a smaller ppm.' },
      { k: 'formula', eq: 'mg/L = 1000 × M × MM\nppm ≈ mg/L  (1 mg/L = 1 ppm at 25 °C)' },
      { k: 'h3', t: 'Frequency stability' },
      { k: 'p', t: 'A quartz crystal specified to 10 ppm is off by at most 10 parts per million — that is 36 seconds over a year, or better than your phone’s clock. It is also how tolerances are often quoted for voltage references and resistors ("0.1 % = 1,000 ppm").' },
      { k: 'h3', t: 'ppm, ppb and ppt' },
      { k: 'list', items: [
        'ppb = 1,000 ppm — water with 0.1 ppm arsenic is 100 ppb.',
        'ppt = 1,000 ppb — used for CO₂ seawater, mercury, contamination.',
        'A 0.001% leakage = 10 ppm; a 1 bp = 100 ppm.',
      ] },
      { k: 'callout', icon: 'info', t: 'Calculators on this site use the same convention as the reference page: ratio = 1, and every other notation is a multiple of that ratio.' },
    ],
  },

  'number-bases': {
    title: 'Number Bases and Radix',
    kicker: 'Computing',
    summary: 'Why positional notation works, and why binary, octal and hexadecimal are the natural companions of each other.',
    tool: 'radix-calc',
    blocks: [
      { k: 'definition', t: 'A positional numeral system represents a number as a sum of digits multiplied by powers of the base. The base is the number of distinct digits available, counting from zero.' },
      { k: 'formula', eq: 'value = Σ dᵢ · bⁱ', note: 'dᵢ is the digit at position i, b the base. The rightmost digit is position 0.' },
      { k: 'h3', t: 'Why hexadecimal exists' },
      { k: 'p', t: 'Base 16 is exactly 2⁴. That is the whole reason hex is used to display binary: one hex digit is precisely four bits, so a byte is always two hex digits with nothing left over.' },
      { k: 'formula', eq: '1 hex digit = 4 bits = ½ byte\nBinary:  01001000 01101001\nHex:      48        69' },
      { k: 'p', t: 'Octal, 8 = 2³, is the same idea for three-bit groups and was common on 12- and 18-bit machines.' },
      { k: 'h3', t: 'Converting by hand' },
      { k: 'p', t: 'From any base to base 10, multiply-accumulate left to right. From base 10 to any other base, divide repeatedly and read the remainders upwards.' },
      { k: 'formula', eq: '255₁₀ → 11111111₂ → FF₁₆ → 377₈' },
      { k: 'h3', t: 'Why exact integers matter' },
      { k: 'p', t: 'JavaScript numbers are 64-bit floating point, which holds integers exactly only to 2⁵³. Above that, ordinary arithmetic silently rounds. A base calculator built on BigInt has no such limit, which is why this one uses BigInt throughout.' },
      { k: 'callout', icon: 'info', t: 'In this app every base operation runs on BigInt, so 2⁵³, 2⁶⁴ and beyond are computed exactly rather than approximately.' },
    ],
  },

  'ascii-encoding': {
    title: 'ASCII and Character Encoding',
    kicker: 'Computing',
    summary: 'From seven bits to Unicode, and why "a character" is not a fixed number of bytes.',
    tool: 'convert',
    blocks: [
      { k: 'definition', t: 'ASCII is a 7-bit character encoding assigning codes 0–127 to control characters, space, and printable English.' },
      { k: 'p', t: 'Seven bits was chosen so that a 7-bit code would also carry a parity bit in an 8-bit byte, which mattered when teleprinters were the reference. 128 characters was a deliberate economy.' },
      { k: 'h3', t: 'Position is what gives the number meaning' },
      { k: 'formula', eq: '’A’ = 65 = 4·16¹ + 1·16⁰ = 41₁₆', note: 'Four sixteen-times, plus one. The decimal code is the same quantity written differently.' },
      { k: 'h3', t: 'The variable-width problem' },
      { k: 'p', t: 'ASCII cannot represent "é", "€" or "中". A single-byte extended encoding such as Windows-1252 can add 128 more characters but only those 128, and which 128 differs per alphabet. That is why legacy encodings are so confusing.' },
      { k: 'p', t: 'Unicode solves the coverage problem by assigning a code point to every character in every script. UTF-8 then encodes those code points in one to four bytes, chosen so that ASCII characters still cost exactly one byte.' },
      { k: 'table', head: ['Character', 'Code point', 'UTF-8 bytes', 'Hex'], rows: [
        ['A', 'U+0041', '1', '41'], ['é', 'U+00E9', '2', 'C3 A9'], ['€', 'U+20AC', '3', 'E2 82 AC'],
        ['→', 'U+2192', '3', 'E2 86 92'], ['中', 'U+4E2D', '3', 'E4 B8 AD'], ['😀', 'U+1F600', '4', 'F0 9F 98 80'],
      ] },
      { k: 'callout', icon: 'warn', t: 'JavaScript strings are sequences of UTF-16 code units, not bytes. A character outside the Basic Multilingual Plane — every emoji, for instance — occupies two of them. Encoding such a string to bytes therefore produces four bytes, not two. This is the single most common source of confusion when converting text to hex.' },
      { k: 'h3', t: 'Which encoding should you use' },
      { k: 'list', items: [
        'UTF-8 for anything on the web, in files, or in a database — it is the only sane default today.',
        'UTF-16 only when a system or protocol mandates it, such as the Windows registry or Java’s char streams.',
        'A legacy code page only when reading historical data that is known to be in that encoding.',
      ] },
    ],
  },

  'save-electricity': {
    title: 'How to Save Electricity',
    kicker: 'Everyday electricity',
    summary: 'Where the power bill actually goes, and the handful of changes that make a measurable difference.',
    tool: 'energy-bill',
    blocks: [
      { k: 'definition', t: 'Saving electricity means reducing the kWh drawn from the grid for the same useful work — heat, light, motion, computing — or doing major replacement to stop wasting it.' },
      { k: 'p', t: 'The single most important fact from your power bill: every kWh costs about the same wherever it comes from, so savings come from reducing kWh, not from consuming at a "cheaper time" — except on a time-of-use tariff, where timing shifts the price rather than the quantity.' },
      { k: 'h3', t: 'Read the meter, not the guesswork' },
      { k: 'p', t: 'A plug meter shows the real draw of one appliance: standby, idle and cycling draws included. Most houses find the worst offender is something boring and always on — a dehumidifier, a set-top box, an aquarium heater, or a fridge with a tired gasket.' },
      { k: 'table', head: ['Appliance', 'Typical draw', 'Cost per 100 h @ 30p/kWh'], rows: [
        ['Kettle (3 kW)', '3.0 kW', '£9'],
        ['Immersion heater (3 kW)', '3.0 kW', '£9'],
        ['Hair dryer (1.8 kW)', '1.8 kW', '£5.40'],
        ['Vacuum cleaner (700 W)', '0.7 kW', '£2.10'],
        ['Fridge/freezer (average)', '~0.15 kW', '£4.50'],
        ['Standby set (LED + box + TV)', '~0.05 kW', '£1.50'],
      ] },
      { k: 'h3', t: 'The changes that pay back' },
      { k: 'list', items: [
        'Heating and hot water: 1 °C lower on the thermostat, shorter showers, and a full drum — heat dominates most homes.',
        'Stop standby: a switched extension lead costs pennies and removes idle draw.',
        'Water heating: fit an insulating cylinder jacket; 60 °C is hot enough for safe legionella control.',
        'Lighting: LED replacement pays for itself in a year or two of normal evening use.',
        'Cold spaces: keep the fridge at 4 °C and the freezer at −18 °C; each degree colder than needed is wasted.',
        'Wash cold: modern detergent is formulated for 30 °C cycles.',
      ] },
      { k: 'h3', t: 'The maths of one appliance' },
      { k: 'p', t: 'A 2 kW heater running four hours a day for a year uses 2.9 MWh — more than most households spend on lighting in the same year. Any candidate for "I leave it on" is worth a plug-meter test before it becomes a habit.' },
      { k: 'formula', eq: 'kWh = kW × h', note: 'Two kilowatts for four hours is eight kilowatt-hours; multiply by your unit rate to get money.' },
      { k: 'callout', icon: 'info', t: 'The biggest single saving available to most homes is insulation — loft first, then cavity. It is a one-time capital cost that pays back every winter for decades.' },
    ],
  },

  'save-energy': {
    title: 'How to Save Energy',
    kicker: 'Everyday energy',
    summary: 'Electricity is only part of energy. Gas, petrol and food all sit in the same budget — here is where the whole of it goes.',
    tool: 'energy-bill',
    blocks: [
      { k: 'definition', t: 'Energy saving is broader than electricity: it is cutting joules drawn for heating, transport, food and computing, measured in kWh, litres or kg CO₂ depending on what your bill itemises.' },
      { k: 'p', t: 'Energy in a home is bought as electricity (kWh), gas (kWh), solid fuel (kWh) and transport fuel (litres or gallons). Thinking in joules rather than cash keeps you honest: a litre of petrol is about 10 kWh, so a car that avoids one tank a month has saved ~120 kWh — roughly a month of an LED-lit flat.' },
      { k: 'h3', t: 'Where the joules go' },
      { k: 'table', head: ['End use', 'Share of home energy (typical)'], rows: [
        ['Space heating', '~65%'],
        ['Water heating', '~12%'],
        ['Lighting', '~5%'],
        ['Appliances & cooker', '~18%'],
      ] },
      { k: 'formula', eq: 'E = P × t', note: 'The same relation applies to any energy: power (kW) times time (h) gives energy in kWh.' },
      { k: 'h3', t: 'Transport — the silent giant' },
      { k: 'list', items: [
        'One avoided car journey per week is worth hundreds of litres of petrol a year.',
        'Keeping tyres at the recommended pressure is worth a few percent of fuel.',
        'A 100 kg lighter car uses about 6% less fuel — remove the roof box you never use.',
        'Short trips by cold engine cost disproportionately; combine errands.',
      ] },
      { k: 'h3', t: 'Food — embodied energy' },
      { k: 'p', t: 'Every kg of beef is roughly 30 kWh of agricultural energy; a kg of lentils is under 2 kWh. One meat-free day a week is the largest single dietary energy saving most people can make.' },
      { k: 'h3', t: 'Computing & standby' },
      { k: 'p', t: 'A workstation idling at 90 W all day is over 780 kWh a year. Switch it off, or at least sleep it. A laptop on battery is the efficient default — modern ones sip a few watts.' },
      { k: 'h3', t: 'The triage list' },
      { k: 'list', items: [
        'Audit first: meter one billing cycle, or use last year’s bills — no spreadsheet, no guesswork.',
        'Fix the uncontrolled losses: draughts, loft insulation, hot-water lagging.',
        'Replace the always-on waste: standby, old fridges, immersion timers.',
        'Then the lifestyle changes that cost nothing.',
      ] },
      { k: 'formula', eq: 'ΔkWh = (P₁ − P₂) × h × days', note: 'Swapping a 200 W deck light run 6 h/day for a 30 W LED saves about 370 kWh per year.' },
      { k: 'callout', icon: 'info', t: 'Energy and money are the same number at fixed prices — the skill is knowing which small changes move that number. Start with the biggest term in the formula, not the most satisfying one.' },
    ],
  },
  '800-watts-to-amps': {
    title: '800 Watts to Amps',
    kicker: 'Electrical conversion',
    summary: 'How to find current in amperes for an 800-watt load at common DC and AC voltages.',
    tool: 'current-power',
    blocks: [
      { k: 'definition', t: 'To get amps from watts you must also know voltage (and power factor for AC). For DC, current is power divided by voltage. For AC, current is power divided by voltage times power factor.' },
      { k: 'h3', t: 'DC: 12 V supply' },
      { k: 'formula', eq: 'I = P / V', note: 'DC: amps = watts / volts.' },
      { k: 'formula', eq: 'I = 800 W / 12 V = 66.667 A' },
      { k: 'h3', t: 'AC: 120 V supply' },
      { k: 'formula', eq: 'I = P / (PF × V)', note: 'AC: amps = watts / (power factor × volts).' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 800 W / (1 × 120 V) = 6.667 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 800 W / (0.8 × 120 V) = 8.333 A' },
      { k: 'h3', t: 'AC: 230 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 800 W / (1 × 230 V) = 3.478 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 800 W / (0.8 × 230 V) = 4.348 A' },
      { k: 'callout', icon: 'info', t: 'Use the Current / power calculator for other wattages, voltages, and power factors.' },
    ],
  },
  'cm-to-feet': {
    title: 'Centimeters to Feet',
    kicker: 'Length conversion',
    summary: 'Convert centimeters (cm) to feet (ft) using the exact relationship between metric and imperial length units.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'A centimeter is 1/100 of a meter in SI. A foot is an imperial/US customary length unit equal to 12 inches, exactly 0.3048 meters (30.48 cm).' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: '1 cm = 1 / 30.48 ft ≈ 0.0328084 ft' },
      { k: 'formula', eq: 'd(ft) = d(cm) / 30.48' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '20 cm = 20 / 30.48 ft ≈ 0.656168 ft' },
      { k: 'formula', eq: '50 cm = 50 / 30.48 ft ≈ 1.64042 ft' },
      { k: 'h3', t: 'Quick reference' },
      { k: 'table', head: ['Centimeters (cm)', 'Feet (ft)'], rows: [
        ['1 cm', '0.032808 ft'], ['10 cm', '0.328084 ft'], ['20 cm', '0.656168 ft'], ['30 cm', '0.984252 ft'],
        ['50 cm', '1.640420 ft'], ['100 cm', '3.280840 ft'], ['150 cm', '4.921260 ft'], ['180 cm', '5.905512 ft'],
      ] },
      { k: 'callout', icon: 'info', t: 'Divide centimeters by 30.48 to get feet. Multiply feet by 30.48 to get centimeters.' },
    ],
  },
  '1-watts-to-amps': {
    title: '1 Watts to Amps',
    kicker: 'Electrical conversion',
    summary: 'How to calculate current in amperes for a 1-watt load at common DC and AC voltages.',
    tool: 'current-power',
    blocks: [
      { k: 'definition', t: 'Current (amps) depends on power (watts), voltage, and for AC circuits the power factor. Use I = P / V for DC and I = P / (PF × V) for AC.' },
      { k: 'h3', t: 'DC: 12 V supply' },
      { k: 'formula', eq: 'I = 1 W / 12 V = 0.083 A' },
      { k: 'h3', t: 'AC: 120 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 1 W / (1 × 120 V) = 0.008 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 1 W / (0.8 × 120 V) = 0.01 A' },
      { k: 'h3', t: 'AC: 230 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 1 W / (1 × 230 V) = 0.004 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 1 W / (0.8 × 230 V) = 0.005 A' },
      { k: 'callout', icon: 'info', t: 'Results vary with actual supply voltage and load power factor. Use the Current / power calculator for custom values.' },
    ],
  },
  '100-watts-to-amps': {
    title: '100 Watts to Amps',
    kicker: 'Electrical conversion',
    summary: 'How to calculate current in amperes for a 100-watt load at common DC and AC voltages.',
    tool: 'current-power',
    blocks: [
      { k: 'definition', t: 'Current (amps) depends on power (watts), voltage, and for AC circuits the power factor. Use I = P / V for DC and I = P / (PF × V) for AC.' },
      { k: 'h3', t: 'DC: 12 V supply' },
      { k: 'formula', eq: 'I = 100 W / 12 V = 8.333 A' },
      { k: 'h3', t: 'AC: 120 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 100 W / (1 × 120 V) = 0.833 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 100 W / (0.8 × 120 V) = 1.042 A' },
      { k: 'h3', t: 'AC: 230 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 100 W / (1 × 230 V) = 0.435 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 100 W / (0.8 × 230 V) = 0.543 A' },
      { k: 'callout', icon: 'info', t: 'Results vary with actual supply voltage and load power factor. Use the Current / power calculator for custom values.' },
    ],
  },
  '500-watts-to-amps': {
    title: '500 Watts to Amps',
    kicker: 'Electrical conversion',
    summary: 'How to calculate current in amperes for a 500-watt load at common DC and AC voltages.',
    tool: 'current-power',
    blocks: [
      { k: 'definition', t: 'Current (amps) depends on power (watts), voltage, and for AC circuits the power factor. Use I = P / V for DC and I = P / (PF × V) for AC.' },
      { k: 'h3', t: 'DC: 12 V supply' },
      { k: 'formula', eq: 'I = 500 W / 12 V = 41.667 A' },
      { k: 'h3', t: 'AC: 120 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 500 W / (1 × 120 V) = 4.167 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 500 W / (0.8 × 120 V) = 5.208 A' },
      { k: 'h3', t: 'AC: 230 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 500 W / (1 × 230 V) = 2.174 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 500 W / (0.8 × 230 V) = 2.717 A' },
      { k: 'callout', icon: 'info', t: 'Results vary with actual supply voltage and load power factor. Use the Current / power calculator for custom values.' },
    ],
  },
  '600-watts-to-amps': {
    title: '600 Watts to Amps',
    kicker: 'Electrical conversion',
    summary: 'How to calculate current in amperes for a 600-watt load at common DC and AC voltages.',
    tool: 'current-power',
    blocks: [
      { k: 'definition', t: 'Current (amps) depends on power (watts), voltage, and for AC circuits the power factor. Use I = P / V for DC and I = P / (PF × V) for AC.' },
      { k: 'h3', t: 'DC: 12 V supply' },
      { k: 'formula', eq: 'I = 600 W / 12 V = 50 A' },
      { k: 'h3', t: 'AC: 120 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 600 W / (1 × 120 V) = 5 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 600 W / (0.8 × 120 V) = 6.25 A' },
      { k: 'h3', t: 'AC: 230 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 600 W / (1 × 230 V) = 2.609 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 600 W / (0.8 × 230 V) = 3.261 A' },
      { k: 'callout', icon: 'info', t: 'Results vary with actual supply voltage and load power factor. Use the Current / power calculator for custom values.' },
    ],
  },
  '1000-watts-to-amps': {
    title: '1000 Watts to Amps',
    kicker: 'Electrical conversion',
    summary: 'How to calculate current in amperes for a 1000-watt load at common DC and AC voltages.',
    tool: 'current-power',
    blocks: [
      { k: 'definition', t: 'Current (amps) depends on power (watts), voltage, and for AC circuits the power factor. Use I = P / V for DC and I = P / (PF × V) for AC.' },
      { k: 'h3', t: 'DC: 12 V supply' },
      { k: 'formula', eq: 'I = 1000 W / 12 V = 83.333 A' },
      { k: 'h3', t: 'AC: 120 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 1000 W / (1 × 120 V) = 8.333 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 1000 W / (0.8 × 120 V) = 10.417 A' },
      { k: 'h3', t: 'AC: 230 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 1000 W / (1 × 230 V) = 4.348 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 1000 W / (0.8 × 230 V) = 5.435 A' },
      { k: 'callout', icon: 'info', t: 'Results vary with actual supply voltage and load power factor. Use the Current / power calculator for custom values.' },
    ],
  },
  '1200-watts-to-amps': {
    title: '1200 Watts to Amps',
    kicker: 'Electrical conversion',
    summary: 'How to calculate current in amperes for a 1200-watt load at common DC and AC voltages.',
    tool: 'current-power',
    blocks: [
      { k: 'definition', t: 'Current (amps) depends on power (watts), voltage, and for AC circuits the power factor. Use I = P / V for DC and I = P / (PF × V) for AC.' },
      { k: 'h3', t: 'DC: 12 V supply' },
      { k: 'formula', eq: 'I = 1200 W / 12 V = 100 A' },
      { k: 'h3', t: 'AC: 120 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 1200 W / (1 × 120 V) = 10 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 1200 W / (0.8 × 120 V) = 12.5 A' },
      { k: 'h3', t: 'AC: 230 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 1200 W / (1 × 230 V) = 5.217 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 1200 W / (0.8 × 230 V) = 6.522 A' },
      { k: 'callout', icon: 'info', t: 'Results vary with actual supply voltage and load power factor. Use the Current / power calculator for custom values.' },
    ],
  },
  '2000-watts-to-amps': {
    title: '2000 Watts to Amps',
    kicker: 'Electrical conversion',
    summary: 'How to calculate current in amperes for a 2000-watt load at common DC and AC voltages.',
    tool: 'current-power',
    blocks: [
      { k: 'definition', t: 'Current (amps) depends on power (watts), voltage, and for AC circuits the power factor. Use I = P / V for DC and I = P / (PF × V) for AC.' },
      { k: 'h3', t: 'DC: 12 V supply' },
      { k: 'formula', eq: 'I = 2000 W / 12 V = 166.667 A' },
      { k: 'h3', t: 'AC: 120 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 2000 W / (1 × 120 V) = 16.667 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 2000 W / (0.8 × 120 V) = 20.833 A' },
      { k: 'h3', t: 'AC: 230 V supply' },
      { k: 'p', t: 'Resistive load (PF = 1):' },
      { k: 'formula', eq: 'I = 2000 W / (1 × 230 V) = 8.696 A' },
      { k: 'p', t: 'Inductive load (example PF = 0.8):' },
      { k: 'formula', eq: 'I = 2000 W / (0.8 × 230 V) = 10.87 A' },
      { k: 'callout', icon: 'info', t: 'Results vary with actual supply voltage and load power factor. Use the Current / power calculator for custom values.' },
    ],
  },
  'feet-to-cm': {
    title: 'Feet to Centimeters',
    kicker: 'Length conversion',
    summary: 'Convert feet (ft) to centimeters (cm) using the exact relationship 1 ft = 30.48 cm.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'One foot equals exactly 30.48 centimeters (0.3048 meters). To convert feet to centimeters, multiply by 30.48.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'd(cm) = d(ft) × 30.48' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '2 ft = 2 × 30.48 cm = 60.96 cm' },
      { k: 'formula', eq: '5 ft = 5 × 30.48 cm = 152.4 cm' },
      { k: 'h3', t: 'Quick reference' },
      { k: 'table', head: ['Feet (ft)', 'Centimeters (cm)'], rows: [
        ['1 ft','30.48 cm'],['2 ft','60.96 cm'],['3 ft','91.44 cm'],['5 ft','152.4 cm'],['6 ft','182.88 cm'],['10 ft','304.8 cm']
      ] },
      { k: 'callout', icon: 'info', t: 'Multiply feet by 30.48 to get centimeters. Divide centimeters by 30.48 to get feet.' },
    ],
  },

  'cm-to-inches': {
    title: 'Centimeters to Inches',
    kicker: 'Length conversion',
    summary: 'Convert cm to in with the standard conversion factor and worked examples.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'cm and in are units of length. 1 inch is exactly 2.54 cm.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'in = cm × 0.3937007874' },
      { k: 'formula', eq: 'cm = in × 2.54' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '1 cm = 0.393701 in' },
      { k: 'formula', eq: '10 cm = 3.937008 in' },
      { k: 'formula', eq: '100 cm = 39.370079 in' },
      { k: 'callout', icon: 'info', t: 'Multiply the value in cm by 0.3937007874 to get in.' },
    ],
  },
  'inches-to-cm': {
    title: 'Inches to Centimeters',
    kicker: 'Length conversion',
    summary: 'Convert in to cm with the standard conversion factor and worked examples.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'in and cm are units of length. 1 inch is exactly 2.54 cm.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'cm = in × 2.54' },
      { k: 'formula', eq: 'in = cm × 0.3937007874' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '1 in = 2.54 cm' },
      { k: 'formula', eq: '10 in = 25.4 cm' },
      { k: 'formula', eq: '100 in = 254 cm' },
      { k: 'callout', icon: 'info', t: 'Multiply the value in in by 2.54 to get cm.' },
    ],
  },
  'mm-to-inches': {
    title: 'Millimeters to Inches',
    kicker: 'Length conversion',
    summary: 'Convert mm to in with the standard conversion factor and worked examples.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'mm and in are units of length. 1 inch is exactly 25.4 mm.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'in = mm × 0.0393700787' },
      { k: 'formula', eq: 'mm = in × 25.4' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '1 mm = 0.03937 in' },
      { k: 'formula', eq: '10 mm = 0.393701 in' },
      { k: 'formula', eq: '100 mm = 3.937008 in' },
      { k: 'callout', icon: 'info', t: 'Multiply the value in mm by 0.0393700787 to get in.' },
    ],
  },
  'inches-to-mm': {
    title: 'Inches to Millimeters',
    kicker: 'Length conversion',
    summary: 'Convert in to mm with the standard conversion factor and worked examples.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'in and mm are units of length. 1 inch is exactly 25.4 mm.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'mm = in × 25.4' },
      { k: 'formula', eq: 'in = mm × 0.0393700787' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '1 in = 25.4 mm' },
      { k: 'formula', eq: '10 in = 254 mm' },
      { k: 'formula', eq: '100 in = 2540 mm' },
      { k: 'callout', icon: 'info', t: 'Multiply the value in in by 25.4 to get mm.' },
    ],
  },
  'meters-to-feet': {
    title: 'Meters to Feet',
    kicker: 'Length conversion',
    summary: 'Convert m to ft with the standard conversion factor and worked examples.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'm and ft are units of length. 1 foot is exactly 0.3048 meters.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'ft = m × 3.280839895' },
      { k: 'formula', eq: 'm = ft × 0.3048' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '1 m = 3.28084 ft' },
      { k: 'formula', eq: '10 m = 32.808399 ft' },
      { k: 'formula', eq: '100 m = 328.08399 ft' },
      { k: 'callout', icon: 'info', t: 'Multiply the value in m by 3.280839895 to get ft.' },
    ],
  },
  'feet-to-meters': {
    title: 'Feet to Meters',
    kicker: 'Length conversion',
    summary: 'Convert ft to m with the standard conversion factor and worked examples.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'ft and m are units of length. 1 foot is exactly 0.3048 meters.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'm = ft × 0.3048' },
      { k: 'formula', eq: 'ft = m × 3.280839895' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '1 ft = 0.3048 m' },
      { k: 'formula', eq: '10 ft = 3.048 m' },
      { k: 'formula', eq: '100 ft = 30.48 m' },
      { k: 'callout', icon: 'info', t: 'Multiply the value in ft by 0.3048 to get m.' },
    ],
  },
  'km-to-miles': {
    title: 'Kilometers to Miles',
    kicker: 'Length conversion',
    summary: 'Convert km to mi with the standard conversion factor and worked examples.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'km and mi are units of length. 1 mile is exactly 1.609344 km.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'mi = km × 0.6213711922' },
      { k: 'formula', eq: 'km = mi × 1.609344' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '1 km = 0.621371 mi' },
      { k: 'formula', eq: '10 km = 6.213712 mi' },
      { k: 'formula', eq: '100 km = 62.137119 mi' },
      { k: 'callout', icon: 'info', t: 'Multiply the value in km by 0.6213711922 to get mi.' },
    ],
  },
  'miles-to-km': {
    title: 'Miles to Kilometers',
    kicker: 'Length conversion',
    summary: 'Convert mi to km with the standard conversion factor and worked examples.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'mi and km are units of length. 1 mile is exactly 1.609344 km.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'km = mi × 1.609344' },
      { k: 'formula', eq: 'mi = km × 0.6213711922' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '1 mi = 1.609344 km' },
      { k: 'formula', eq: '10 mi = 16.09344 km' },
      { k: 'formula', eq: '100 mi = 160.9344 km' },
      { k: 'callout', icon: 'info', t: 'Multiply the value in mi by 1.609344 to get km.' },
    ],
  },
  'cm-to-mm': {
    title: 'Centimeters to Millimeters',
    kicker: 'Length conversion',
    summary: 'Convert cm to mm with the standard conversion factor and worked examples.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'cm and mm are units of length. 1 cm equals 10 mm.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'mm = cm × 10' },
      { k: 'formula', eq: 'cm = mm × 0.1' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '1 cm = 10 mm' },
      { k: 'formula', eq: '10 cm = 100 mm' },
      { k: 'formula', eq: '100 cm = 1000 mm' },
      { k: 'callout', icon: 'info', t: 'Multiply the value in cm by 10 to get mm.' },
    ],
  },
  'mm-to-cm': {
    title: 'Millimeters to Centimeters',
    kicker: 'Length conversion',
    summary: 'Convert mm to cm with the standard conversion factor and worked examples.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'mm and cm are units of length. 1 cm equals 10 mm.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'cm = mm × 0.1' },
      { k: 'formula', eq: 'mm = cm × 10' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '1 mm = 0.1 cm' },
      { k: 'formula', eq: '10 mm = 1 cm' },
      { k: 'formula', eq: '100 mm = 10 cm' },
      { k: 'callout', icon: 'info', t: 'Multiply the value in mm by 0.1 to get cm.' },
    ],
  },
  'meters-to-cm': {
    title: 'Meters to Centimeters',
    kicker: 'Length conversion',
    summary: 'Convert m to cm with the standard conversion factor and worked examples.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'm and cm are units of length. 1 m equals 100 cm.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'cm = m × 100' },
      { k: 'formula', eq: 'm = cm × 0.01' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '1 m = 100 cm' },
      { k: 'formula', eq: '10 m = 1000 cm' },
      { k: 'formula', eq: '100 m = 10000 cm' },
      { k: 'callout', icon: 'info', t: 'Multiply the value in m by 100 to get cm.' },
    ],
  },
  'cm-to-meters': {
    title: 'Centimeters to Meters',
    kicker: 'Length conversion',
    summary: 'Convert cm to m with the standard conversion factor and worked examples.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'cm and m are units of length. 1 m equals 100 cm.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'm = cm × 0.01' },
      { k: 'formula', eq: 'cm = m × 100' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '1 cm = 0.01 m' },
      { k: 'formula', eq: '10 cm = 0.1 m' },
      { k: 'formula', eq: '100 cm = 1 m' },
      { k: 'callout', icon: 'info', t: 'Multiply the value in cm by 0.01 to get m.' },
    ],
  },
  'inch-to-feet': {
    title: 'Inches to Feet',
    kicker: 'Length conversion',
    summary: 'Convert in to ft with the standard conversion factor and worked examples.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'in and ft are units of length. 1 foot equals 12 inches.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'ft = in × 0.0833333333' },
      { k: 'formula', eq: 'in = ft × 12' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '1 in = 0.083333 ft' },
      { k: 'formula', eq: '10 in = 0.833333 ft' },
      { k: 'formula', eq: '100 in = 8.333333 ft' },
      { k: 'callout', icon: 'info', t: 'Multiply the value in in by 0.0833333333 to get ft.' },
    ],
  },
  'feet-to-inches': {
    title: 'Feet to Inches',
    kicker: 'Length conversion',
    summary: 'Convert ft to in with the standard conversion factor and worked examples.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'ft and in are units of length. 1 foot equals 12 inches.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'in = ft × 12' },
      { k: 'formula', eq: 'ft = in × 0.0833333333' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '1 ft = 12 in' },
      { k: 'formula', eq: '10 ft = 120 in' },
      { k: 'formula', eq: '100 ft = 1200 in' },
      { k: 'callout', icon: 'info', t: 'Multiply the value in ft by 12 to get in.' },
    ],
  },
  'yards-to-feet': {
    title: 'Yards to Feet',
    kicker: 'Length conversion',
    summary: 'Convert yd to ft with the standard conversion factor and worked examples.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'yd and ft are units of length. 1 yard equals 3 feet.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'ft = yd × 3' },
      { k: 'formula', eq: 'yd = ft × 0.3333333333' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '1 yd = 3 ft' },
      { k: 'formula', eq: '10 yd = 30 ft' },
      { k: 'formula', eq: '100 yd = 300 ft' },
      { k: 'callout', icon: 'info', t: 'Multiply the value in yd by 3 to get ft.' },
    ],
  },
  'feet-to-yards': {
    title: 'Feet to Yards',
    kicker: 'Length conversion',
    summary: 'Convert ft to yd with the standard conversion factor and worked examples.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'ft and yd are units of length. 1 yard equals 3 feet.' },
      { k: 'h3', t: 'Conversion formula' },
      { k: 'formula', eq: 'yd = ft × 0.3333333333' },
      { k: 'formula', eq: 'ft = yd × 3' },
      { k: 'h3', t: 'Examples' },
      { k: 'formula', eq: '1 ft = 0.333333 yd' },
      { k: 'formula', eq: '10 ft = 3.333333 yd' },
      { k: 'formula', eq: '100 ft = 33.333333 yd' },
      { k: 'callout', icon: 'info', t: 'Multiply the value in ft by 0.3333333333 to get yd.' },
    ],
  },
  '0-c-to-f': {
    title: '0°C to °F',
    kicker: 'Temperature conversion',
    summary: 'Convert 0 degrees Celsius to Fahrenheit.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Celsius to Fahrenheit, multiply by 9/5 and add 32.' },
      { k: 'formula', eq: '°F = °C × 9/5 + 32' },
      { k: 'formula', eq: '0°C × 9/5 + 32 = 32°F' },
      { k: 'callout', icon: 'info', t: '0 degrees Celsius equals 32 degrees Fahrenheit.' },
    ],
  },
  '0-f-to-c': {
    title: '0°F to °C',
    kicker: 'Temperature conversion',
    summary: 'Convert 0 degrees Fahrenheit to Celsius.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9.' },
      { k: 'formula', eq: '°C = (°F − 32) × 5/9' },
      { k: 'formula', eq: '(0°F − 32) × 5/9 = -17.7778°C' },
      { k: 'callout', icon: 'info', t: '0 degrees Fahrenheit equals -17.7778 degrees Celsius.' },
    ],
  },
  '10-c-to-f': {
    title: '10°C to °F',
    kicker: 'Temperature conversion',
    summary: 'Convert 10 degrees Celsius to Fahrenheit.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Celsius to Fahrenheit, multiply by 9/5 and add 32.' },
      { k: 'formula', eq: '°F = °C × 9/5 + 32' },
      { k: 'formula', eq: '10°C × 9/5 + 32 = 50°F' },
      { k: 'callout', icon: 'info', t: '10 degrees Celsius equals 50 degrees Fahrenheit.' },
    ],
  },
  '10-f-to-c': {
    title: '10°F to °C',
    kicker: 'Temperature conversion',
    summary: 'Convert 10 degrees Fahrenheit to Celsius.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9.' },
      { k: 'formula', eq: '°C = (°F − 32) × 5/9' },
      { k: 'formula', eq: '(10°F − 32) × 5/9 = -12.2222°C' },
      { k: 'callout', icon: 'info', t: '10 degrees Fahrenheit equals -12.2222 degrees Celsius.' },
    ],
  },
  '100-c-to-f': {
    title: '100°C to °F',
    kicker: 'Temperature conversion',
    summary: 'Convert 100 degrees Celsius to Fahrenheit.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Celsius to Fahrenheit, multiply by 9/5 and add 32.' },
      { k: 'formula', eq: '°F = °C × 9/5 + 32' },
      { k: 'formula', eq: '100°C × 9/5 + 32 = 212°F' },
      { k: 'callout', icon: 'info', t: '100 degrees Celsius equals 212 degrees Fahrenheit.' },
    ],
  },
  '100-fahrenheit-to-celsius': {
    title: '100°F to °C',
    kicker: 'Temperature conversion',
    summary: 'Convert 100 degrees Fahrenheit to Celsius.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9.' },
      { k: 'formula', eq: '°C = (°F − 32) × 5/9' },
      { k: 'formula', eq: '(100°F − 32) × 5/9 = 37.7778°C' },
      { k: 'callout', icon: 'info', t: '100 degrees Fahrenheit equals 37.7778 degrees Celsius.' },
    ],
  },
  '20-c-to-f': {
    title: '20°C to °F',
    kicker: 'Temperature conversion',
    summary: 'Convert 20 degrees Celsius to Fahrenheit.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Celsius to Fahrenheit, multiply by 9/5 and add 32.' },
      { k: 'formula', eq: '°F = °C × 9/5 + 32' },
      { k: 'formula', eq: '20°C × 9/5 + 32 = 68°F' },
      { k: 'callout', icon: 'info', t: '20 degrees Celsius equals 68 degrees Fahrenheit.' },
    ],
  },
  '20-f-to-c': {
    title: '20°F to °C',
    kicker: 'Temperature conversion',
    summary: 'Convert 20 degrees Fahrenheit to Celsius.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9.' },
      { k: 'formula', eq: '°C = (°F − 32) × 5/9' },
      { k: 'formula', eq: '(20°F − 32) × 5/9 = -6.6667°C' },
      { k: 'callout', icon: 'info', t: '20 degrees Fahrenheit equals -6.6667 degrees Celsius.' },
    ],
  },
  '30-c-to-f': {
    title: '30°C to °F',
    kicker: 'Temperature conversion',
    summary: 'Convert 30 degrees Celsius to Fahrenheit.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Celsius to Fahrenheit, multiply by 9/5 and add 32.' },
      { k: 'formula', eq: '°F = °C × 9/5 + 32' },
      { k: 'formula', eq: '30°C × 9/5 + 32 = 86°F' },
      { k: 'callout', icon: 'info', t: '30 degrees Celsius equals 86 degrees Fahrenheit.' },
    ],
  },
  '30-f-to-c': {
    title: '30°F to °C',
    kicker: 'Temperature conversion',
    summary: 'Convert 30 degrees Fahrenheit to Celsius.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9.' },
      { k: 'formula', eq: '°C = (°F − 32) × 5/9' },
      { k: 'formula', eq: '(30°F − 32) × 5/9 = -1.1111°C' },
      { k: 'callout', icon: 'info', t: '30 degrees Fahrenheit equals -1.1111 degrees Celsius.' },
    ],
  },
  '325-fahrenheit-to-celsius': {
    title: '325°F to °C',
    kicker: 'Temperature conversion',
    summary: 'Convert 325 degrees Fahrenheit to Celsius.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9.' },
      { k: 'formula', eq: '°C = (°F − 32) × 5/9' },
      { k: 'formula', eq: '(325°F − 32) × 5/9 = 162.7778°C' },
      { k: 'callout', icon: 'info', t: '325 degrees Fahrenheit equals 162.7778 degrees Celsius.' },
    ],
  },
  '350-fahrenheit-to-celsius': {
    title: '350°F to °C',
    kicker: 'Temperature conversion',
    summary: 'Convert 350 degrees Fahrenheit to Celsius.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9.' },
      { k: 'formula', eq: '°C = (°F − 32) × 5/9' },
      { k: 'formula', eq: '(350°F − 32) × 5/9 = 176.6667°C' },
      { k: 'callout', icon: 'info', t: '350 degrees Fahrenheit equals 176.6667 degrees Celsius.' },
    ],
  },
  '375-fahrenheit-to-celsius': {
    title: '375°F to °C',
    kicker: 'Temperature conversion',
    summary: 'Convert 375 degrees Fahrenheit to Celsius.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9.' },
      { k: 'formula', eq: '°C = (°F − 32) × 5/9' },
      { k: 'formula', eq: '(375°F − 32) × 5/9 = 190.5556°C' },
      { k: 'callout', icon: 'info', t: '375 degrees Fahrenheit equals 190.5556 degrees Celsius.' },
    ],
  },
  '400-fahrenheit-to-celsius': {
    title: '400°F to °C',
    kicker: 'Temperature conversion',
    summary: 'Convert 400 degrees Fahrenheit to Celsius.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9.' },
      { k: 'formula', eq: '°C = (°F − 32) × 5/9' },
      { k: 'formula', eq: '(400°F − 32) × 5/9 = 204.4444°C' },
      { k: 'callout', icon: 'info', t: '400 degrees Fahrenheit equals 204.4444 degrees Celsius.' },
    ],
  },
  '425-fahrenheit-to-celsius': {
    title: '425°F to °C',
    kicker: 'Temperature conversion',
    summary: 'Convert 425 degrees Fahrenheit to Celsius.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9.' },
      { k: 'formula', eq: '°C = (°F − 32) × 5/9' },
      { k: 'formula', eq: '(425°F − 32) × 5/9 = 218.3333°C' },
      { k: 'callout', icon: 'info', t: '425 degrees Fahrenheit equals 218.3333 degrees Celsius.' },
    ],
  },
  '70-fahrenheit-to-celsius': {
    title: '70°F to °C',
    kicker: 'Temperature conversion',
    summary: 'Convert 70 degrees Fahrenheit to Celsius.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9.' },
      { k: 'formula', eq: '°C = (°F − 32) × 5/9' },
      { k: 'formula', eq: '(70°F − 32) × 5/9 = 21.1111°C' },
      { k: 'callout', icon: 'info', t: '70 degrees Fahrenheit equals 21.1111 degrees Celsius.' },
    ],
  },
  '75-fahrenheit-to-celsius': {
    title: '75°F to °C',
    kicker: 'Temperature conversion',
    summary: 'Convert 75 degrees Fahrenheit to Celsius.',
    tool: null,
    blocks: [
      { k: 'definition', t: 'To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9.' },
      { k: 'formula', eq: '°C = (°F − 32) × 5/9' },
      { k: 'formula', eq: '(75°F − 32) × 5/9 = 23.8889°C' },
      { k: 'callout', icon: 'info', t: '75 degrees Fahrenheit equals 23.8889 degrees Celsius.' },
    ],
  },

  'kg-to-lbs': {
    "title": "Kilograms to Pounds",
    "kicker": "Weight conversion",
    "summary": "Convert kg to lb.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "kg and lb are units of mass/weight. 1 kg ≈ 2.20462 lb."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "lb = kg × 2.20462262185"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 kg = 2.204623 lb"
      },
      {
        "k": "formula",
        "eq": "10 kg = 22.046226 lb"
      },
      {
        "k": "formula",
        "eq": "100 kg = 220.462262 lb"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply kg by 2.20462262185 to get lb."
      }
    ]
  },
  'lbs-to-kg': {
    "title": "Pounds to Kilograms",
    "kicker": "Weight conversion",
    "summary": "Convert lb to kg.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "lb and kg are units of mass/weight. 1 lb = 0.45359237 kg."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "kg = lb × 0.45359237"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 lb = 0.453592 kg"
      },
      {
        "k": "formula",
        "eq": "10 lb = 4.535924 kg"
      },
      {
        "k": "formula",
        "eq": "100 lb = 45.359237 kg"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply lb by 0.45359237 to get kg."
      }
    ]
  },
  'kg-to-pound': {
    "title": "Kilograms to Pounds",
    "kicker": "Weight conversion",
    "summary": "Convert kg to lb.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "kg and lb are units of mass/weight. 1 kg ≈ 2.20462 lb."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "lb = kg × 2.20462262185"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 kg = 2.204623 lb"
      },
      {
        "k": "formula",
        "eq": "10 kg = 22.046226 lb"
      },
      {
        "k": "formula",
        "eq": "100 kg = 220.462262 lb"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply kg by 2.20462262185 to get lb."
      }
    ]
  },
  'pound-to-kg': {
    "title": "Pounds to Kilograms",
    "kicker": "Weight conversion",
    "summary": "Convert lb to kg.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "lb and kg are units of mass/weight. 1 lb = 0.45359237 kg."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "kg = lb × 0.45359237"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 lb = 0.453592 kg"
      },
      {
        "k": "formula",
        "eq": "10 lb = 4.535924 kg"
      },
      {
        "k": "formula",
        "eq": "100 lb = 45.359237 kg"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply lb by 0.45359237 to get kg."
      }
    ]
  },
  'grams-to-ounces': {
    "title": "Grams to Ounces",
    "kicker": "Weight conversion",
    "summary": "Convert g to oz.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "g and oz are units of mass/weight. 1 oz = 28.349523125 g."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "oz = g × 0.03527396195"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 g = 0.035274 oz"
      },
      {
        "k": "formula",
        "eq": "10 g = 0.35274 oz"
      },
      {
        "k": "formula",
        "eq": "100 g = 3.527396 oz"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply g by 0.03527396195 to get oz."
      }
    ]
  },
  'ounces-to-grams': {
    "title": "Ounces to Grams",
    "kicker": "Weight conversion",
    "summary": "Convert oz to g.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "oz and g are units of mass/weight. 1 oz = 28.349523125 g."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "g = oz × 28.349523125"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 oz = 28.349523 g"
      },
      {
        "k": "formula",
        "eq": "10 oz = 283.495231 g"
      },
      {
        "k": "formula",
        "eq": "100 oz = 2834.952313 g"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply oz by 28.349523125 to get g."
      }
    ]
  },
  'gram-to-ounce': {
    "title": "Grams to Ounces",
    "kicker": "Weight conversion",
    "summary": "Convert g to oz.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "g and oz are units of mass/weight. 1 oz = 28.349523125 g."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "oz = g × 0.03527396195"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 g = 0.035274 oz"
      },
      {
        "k": "formula",
        "eq": "10 g = 0.35274 oz"
      },
      {
        "k": "formula",
        "eq": "100 g = 3.527396 oz"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply g by 0.03527396195 to get oz."
      }
    ]
  },
  'kg-to-grams': {
    "title": "Kilograms to Grams",
    "kicker": "Weight conversion",
    "summary": "Convert kg to g.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "kg and g are units of mass/weight. 1 kg = 1000 g."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "g = kg × 1000"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 kg = 1000 g"
      },
      {
        "k": "formula",
        "eq": "10 kg = 10000 g"
      },
      {
        "k": "formula",
        "eq": "100 kg = 100000 g"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply kg by 1000 to get g."
      }
    ]
  },
  'grams-to-kg': {
    "title": "Grams to Kilograms",
    "kicker": "Weight conversion",
    "summary": "Convert g to kg.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "g and kg are units of mass/weight. 1 kg = 1000 g."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "kg = g × 0.001"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 g = 0.001 kg"
      },
      {
        "k": "formula",
        "eq": "10 g = 0.01 kg"
      },
      {
        "k": "formula",
        "eq": "100 g = 0.1 kg"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply g by 0.001 to get kg."
      }
    ]
  },
  'lb-to-oz': {
    "title": "Pounds to Ounces",
    "kicker": "Weight conversion",
    "summary": "Convert lb to oz.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "lb and oz are units of mass/weight. 1 lb = 16 oz."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "oz = lb × 16"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 lb = 16 oz"
      },
      {
        "k": "formula",
        "eq": "10 lb = 160 oz"
      },
      {
        "k": "formula",
        "eq": "100 lb = 1600 oz"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply lb by 16 to get oz."
      }
    ]
  },
  'oz-to-lb': {
    "title": "Ounces to Pounds",
    "kicker": "Weight conversion",
    "summary": "Convert oz to lb.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "oz and lb are units of mass/weight. 1 lb = 16 oz."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "lb = oz × 0.0625"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 oz = 0.0625 lb"
      },
      {
        "k": "formula",
        "eq": "10 oz = 0.625 lb"
      },
      {
        "k": "formula",
        "eq": "100 oz = 6.25 lb"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply oz by 0.0625 to get lb."
      }
    ]
  },
  'kg-to-oz': {
    "title": "Kilograms to Ounces",
    "kicker": "Weight conversion",
    "summary": "Convert kg to oz.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "kg and oz are units of mass/weight. 1 kg ≈ 35.274 oz."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "oz = kg × 35.27396195"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 kg = 35.273962 oz"
      },
      {
        "k": "formula",
        "eq": "10 kg = 352.73962 oz"
      },
      {
        "k": "formula",
        "eq": "100 kg = 3527.396195 oz"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply kg by 35.27396195 to get oz."
      }
    ]
  },
  'oz-to-kg': {
    "title": "Ounces to Kilograms",
    "kicker": "Weight conversion",
    "summary": "Convert oz to kg.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "oz and kg are units of mass/weight. 1 oz = 28.349523125 g."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "kg = oz × 0.028349523125"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 oz = 0.02835 kg"
      },
      {
        "k": "formula",
        "eq": "10 oz = 0.283495 kg"
      },
      {
        "k": "formula",
        "eq": "100 oz = 2.834952 kg"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply oz by 0.028349523125 to get kg."
      }
    ]
  },
  'stones-to-kg': {
    "title": "Stones to Kilograms",
    "kicker": "Weight conversion",
    "summary": "Convert st to kg.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "st and kg are units of mass/weight. 1 stone = 6.35029318 kg."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "kg = st × 6.35029318"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 st = 6.350293 kg"
      },
      {
        "k": "formula",
        "eq": "10 st = 63.502932 kg"
      },
      {
        "k": "formula",
        "eq": "100 st = 635.029318 kg"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply st by 6.35029318 to get kg."
      }
    ]
  },
  'kg-to-stones': {
    "title": "Kilograms to Stones",
    "kicker": "Weight conversion",
    "summary": "Convert kg to st.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "kg and st are units of mass/weight. 1 stone = 6.35029318 kg."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "st = kg × 0.157473044418"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 kg = 0.157473 st"
      },
      {
        "k": "formula",
        "eq": "10 kg = 1.57473 st"
      },
      {
        "k": "formula",
        "eq": "100 kg = 15.747304 st"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply kg by 0.157473044418 to get st."
      }
    ]
  },
  'ton-to-kg': {
    "title": "Tons to Kilograms",
    "kicker": "Weight conversion",
    "summary": "Convert ton to kg.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "ton and kg are units of mass/weight. Using metric ton: 1 t = 1000 kg."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "kg = ton × 1000"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 ton = 1000 kg"
      },
      {
        "k": "formula",
        "eq": "10 ton = 10000 kg"
      },
      {
        "k": "formula",
        "eq": "100 ton = 100000 kg"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply ton by 1000 to get kg."
      }
    ]
  },
  'kg-to-ton': {
    "title": "Kilograms to Tons",
    "kicker": "Weight conversion",
    "summary": "Convert kg to ton.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "kg and ton are units of mass/weight. Using metric ton: 1 t = 1000 kg."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "ton = kg × 0.001"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 kg = 0.001 ton"
      },
      {
        "k": "formula",
        "eq": "10 kg = 0.01 ton"
      },
      {
        "k": "formula",
        "eq": "100 kg = 0.1 ton"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply kg by 0.001 to get ton."
      }
    ]
  },
  'kw-to-hp': {
    "title": "Kilowatts to Horsepower",
    "kicker": "Power conversion",
    "summary": "Convert kW to hp.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "kW and hp are units of power. 1 kW ≈ 1.34102 mechanical horsepower."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "hp = kW × 1.341022089595"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 kW = 1.341022 hp"
      },
      {
        "k": "formula",
        "eq": "10 kW = 13.410221 hp"
      },
      {
        "k": "formula",
        "eq": "100 kW = 134.102209 hp"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply kW by 1.341022089595 to get hp."
      }
    ]
  },
  'hp-to-kw': {
    "title": "Horsepower to Kilowatts",
    "kicker": "Power conversion",
    "summary": "Convert hp to kW.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "hp and kW are units of power. 1 mechanical hp = 0.745699872 kW."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "kW = hp × 0.745699871582"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 hp = 0.7457 kW"
      },
      {
        "k": "formula",
        "eq": "10 hp = 7.456999 kW"
      },
      {
        "k": "formula",
        "eq": "100 hp = 74.569987 kW"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply hp by 0.745699871582 to get kW."
      }
    ]
  },
  'hp-to-watt': {
    "title": "Horsepower to Watts",
    "kicker": "Power conversion",
    "summary": "Convert hp to W.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "hp and W are units of power. 1 mechanical hp = 745.699872 W."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "W = hp × 745.699871582"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 hp = 745.699872 W"
      },
      {
        "k": "formula",
        "eq": "10 hp = 7456.998716 W"
      },
      {
        "k": "formula",
        "eq": "100 hp = 74569.987158 W"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply hp by 745.699871582 to get W."
      }
    ]
  },
  'watt-to-hp': {
    "title": "Watts to Horsepower",
    "kicker": "Power conversion",
    "summary": "Convert W to hp.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "W and hp are units of power. 1 mechanical hp = 745.699872 W."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "hp = W × 0.00134102209"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 W = 0.001341 hp"
      },
      {
        "k": "formula",
        "eq": "10 W = 0.01341 hp"
      },
      {
        "k": "formula",
        "eq": "100 W = 0.134102 hp"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply W by 0.00134102209 to get hp."
      }
    ]
  },
  'kw-to-watt': {
    "title": "Kilowatts to Watts",
    "kicker": "Power conversion",
    "summary": "Convert kW to W.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "kW and W are units of power. 1 kW = 1000 W."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "W = kW × 1000"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 kW = 1000 W"
      },
      {
        "k": "formula",
        "eq": "10 kW = 10000 W"
      },
      {
        "k": "formula",
        "eq": "100 kW = 100000 W"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply kW by 1000 to get W."
      }
    ]
  },
  'watt-to-kw': {
    "title": "Watts to Kilowatts",
    "kicker": "Power conversion",
    "summary": "Convert W to kW.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "W and kW are units of power. 1 kW = 1000 W."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "kW = W × 0.001"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 W = 0.001 kW"
      },
      {
        "k": "formula",
        "eq": "10 W = 0.01 kW"
      },
      {
        "k": "formula",
        "eq": "100 W = 0.1 kW"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply W by 0.001 to get kW."
      }
    ]
  },
  'kw-to-bhp': {
    "title": "Kilowatts to Brake Horsepower",
    "kicker": "Power conversion",
    "summary": "Convert kW to bhp.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "kW and bhp are units of power. 1 kW ≈ 1.34102 bhp (mechanical)."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "bhp = kW × 1.341022089595"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 kW = 1.341022 bhp"
      },
      {
        "k": "formula",
        "eq": "10 kW = 13.410221 bhp"
      },
      {
        "k": "formula",
        "eq": "100 kW = 134.102209 bhp"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply kW by 1.341022089595 to get bhp."
      }
    ]
  },
  'btuh-to-watt': {
    "title": "BTU/h to Watts",
    "kicker": "Power conversion",
    "summary": "Convert BTU/h to W.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "BTU/h and W are units of power. 1 BTU/h ≈ 0.29307107 W."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "W = BTU/h × 0.29307107"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 BTU/h = 0.293071 W"
      },
      {
        "k": "formula",
        "eq": "10 BTU/h = 2.930711 W"
      },
      {
        "k": "formula",
        "eq": "100 BTU/h = 29.307107 W"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply BTU/h by 0.29307107 to get W."
      }
    ]
  },
  'watt-to-btuh': {
    "title": "Watts to BTU/h",
    "kicker": "Power conversion",
    "summary": "Convert W to BTU/h.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "W and BTU/h are units of power. 1 W ≈ 3.41214 BTU/h."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "BTU/h = W × 3.412141633"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 W = 3.412142 BTU/h"
      },
      {
        "k": "formula",
        "eq": "10 W = 34.121416 BTU/h"
      },
      {
        "k": "formula",
        "eq": "100 W = 341.214163 BTU/h"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply W by 3.412141633 to get BTU/h."
      }
    ]
  },
  'cm-to-inch': {
    "title": "Centimeters to Inches",
    "kicker": "Length conversion",
    "summary": "Convert cm to in.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "cm and in are units of length. 1 inch = 2.54 cm."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "in = cm × 0.393700787402"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 cm = 0.393701 in"
      },
      {
        "k": "formula",
        "eq": "10 cm = 3.937008 in"
      },
      {
        "k": "formula",
        "eq": "100 cm = 39.370079 in"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply cm by 0.393700787402 to get in."
      }
    ]
  },
  'inch-to-cm': {
    "title": "Inches to Centimeters",
    "kicker": "Length conversion",
    "summary": "Convert in to cm.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "in and cm are units of length. 1 inch = 2.54 cm."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "cm = in × 2.54"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 in = 2.54 cm"
      },
      {
        "k": "formula",
        "eq": "10 in = 25.4 cm"
      },
      {
        "k": "formula",
        "eq": "100 in = 254 cm"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply in by 2.54 to get cm."
      }
    ]
  },
  'mm-to-inch': {
    "title": "Millimeters to Inches",
    "kicker": "Length conversion",
    "summary": "Convert mm to in.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "mm and in are units of length. 1 inch = 25.4 mm."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "in = mm × 0.03937007874"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 mm = 0.03937 in"
      },
      {
        "k": "formula",
        "eq": "10 mm = 0.393701 in"
      },
      {
        "k": "formula",
        "eq": "100 mm = 3.937008 in"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply mm by 0.03937007874 to get in."
      }
    ]
  },
  'inch-to-mm': {
    "title": "Inches to Millimeters",
    "kicker": "Length conversion",
    "summary": "Convert in to mm.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "in and mm are units of length. 1 inch = 25.4 mm."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "mm = in × 25.4"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 in = 25.4 mm"
      },
      {
        "k": "formula",
        "eq": "10 in = 254 mm"
      },
      {
        "k": "formula",
        "eq": "100 in = 2540 mm"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply in by 25.4 to get mm."
      }
    ]
  },
  'km-to-mile': {
    "title": "Kilometers to Miles",
    "kicker": "Length conversion",
    "summary": "Convert km to mi.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "km and mi are units of length. 1 mile = 1.609344 km."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "mi = km × 0.621371192237"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 km = 0.621371 mi"
      },
      {
        "k": "formula",
        "eq": "10 km = 6.213712 mi"
      },
      {
        "k": "formula",
        "eq": "100 km = 62.137119 mi"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply km by 0.621371192237 to get mi."
      }
    ]
  },
  'mile-to-km': {
    "title": "Miles to Kilometers",
    "kicker": "Length conversion",
    "summary": "Convert mi to km.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "mi and km are units of length. 1 mile = 1.609344 km."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "km = mi × 1.609344"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 mi = 1.609344 km"
      },
      {
        "k": "formula",
        "eq": "10 mi = 16.09344 km"
      },
      {
        "k": "formula",
        "eq": "100 mi = 160.9344 km"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply mi by 1.609344 to get km."
      }
    ]
  },
  'm-to-ft': {
    "title": "Meters to Feet",
    "kicker": "Length conversion",
    "summary": "Convert m to ft.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "m and ft are units of length. 1 ft = 0.3048 m."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "ft = m × 3.280839895013"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 m = 3.28084 ft"
      },
      {
        "k": "formula",
        "eq": "10 m = 32.808399 ft"
      },
      {
        "k": "formula",
        "eq": "100 m = 328.08399 ft"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply m by 3.280839895013 to get ft."
      }
    ]
  },
  'ft-to-m': {
    "title": "Feet to Meters",
    "kicker": "Length conversion",
    "summary": "Convert ft to m.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "ft and m are units of length. 1 ft = 0.3048 m."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "m = ft × 0.3048"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 ft = 0.3048 m"
      },
      {
        "k": "formula",
        "eq": "10 ft = 3.048 m"
      },
      {
        "k": "formula",
        "eq": "100 ft = 30.48 m"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply ft by 0.3048 to get m."
      }
    ]
  },
  'meter-to-feet': {
    "title": "Meters to Feet",
    "kicker": "Length conversion",
    "summary": "Convert m to ft.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "m and ft are units of length. 1 ft = 0.3048 m."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "ft = m × 3.280839895013"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 m = 3.28084 ft"
      },
      {
        "k": "formula",
        "eq": "10 m = 32.808399 ft"
      },
      {
        "k": "formula",
        "eq": "100 m = 328.08399 ft"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply m by 3.280839895013 to get ft."
      }
    ]
  },
  'feet-to-meter': {
    "title": "Feet to Meters",
    "kicker": "Length conversion",
    "summary": "Convert ft to m.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "ft and m are units of length. 1 ft = 0.3048 m."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "m = ft × 0.3048"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 ft = 0.3048 m"
      },
      {
        "k": "formula",
        "eq": "10 ft = 3.048 m"
      },
      {
        "k": "formula",
        "eq": "100 ft = 30.48 m"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply ft by 0.3048 to get m."
      }
    ]
  },
  'yard-to-meter': {
    "title": "Yards to Meters",
    "kicker": "Length conversion",
    "summary": "Convert yd to m.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "yd and m are units of length. 1 yd = 0.9144 m."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "m = yd × 0.9144"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 yd = 0.9144 m"
      },
      {
        "k": "formula",
        "eq": "10 yd = 9.144 m"
      },
      {
        "k": "formula",
        "eq": "100 yd = 91.44 m"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply yd by 0.9144 to get m."
      }
    ]
  },
  'meter-to-yard': {
    "title": "Meters to Yards",
    "kicker": "Length conversion",
    "summary": "Convert m to yd.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "m and yd are units of length. 1 yd = 0.9144 m."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "yd = m × 1.093613298338"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 m = 1.093613 yd"
      },
      {
        "k": "formula",
        "eq": "10 m = 10.936133 yd"
      },
      {
        "k": "formula",
        "eq": "100 m = 109.36133 yd"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply m by 1.093613298338 to get yd."
      }
    ]
  },
  'kj-to-joule': {
    "title": "Kilojoules to Joules",
    "kicker": "Energy conversion",
    "summary": "Convert kJ to J.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "kJ and J are units of energy/charge. 1 kJ = 1000 J."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "J = kJ × 1000"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 kJ = 1000 J"
      },
      {
        "k": "formula",
        "eq": "10 kJ = 10000 J"
      },
      {
        "k": "formula",
        "eq": "100 kJ = 100000 J"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply kJ by 1000 to get J."
      }
    ]
  },
  'joule-to-kj': {
    "title": "Joules to Kilojoules",
    "kicker": "Energy conversion",
    "summary": "Convert J to kJ.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "J and kJ are units of energy/charge. 1 kJ = 1000 J."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "kJ = J × 0.001"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 J = 0.001 kJ"
      },
      {
        "k": "formula",
        "eq": "10 J = 0.01 kJ"
      },
      {
        "k": "formula",
        "eq": "100 J = 0.1 kJ"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply J by 0.001 to get kJ."
      }
    ]
  },
  'kcal-to-cal': {
    "title": "Kilocalories to Calories",
    "kicker": "Energy conversion",
    "summary": "Convert kcal to cal.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "kcal and cal are units of energy/charge. 1 kcal = 1000 cal."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "cal = kcal × 1000"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 kcal = 1000 cal"
      },
      {
        "k": "formula",
        "eq": "10 kcal = 10000 cal"
      },
      {
        "k": "formula",
        "eq": "100 kcal = 100000 cal"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply kcal by 1000 to get cal."
      }
    ]
  },
  'cal-to-kcal': {
    "title": "Calories to Kilocalories",
    "kicker": "Energy conversion",
    "summary": "Convert cal to kcal.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "cal and kcal are units of energy/charge. 1 kcal = 1000 cal."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "kcal = cal × 0.001"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 cal = 0.001 kcal"
      },
      {
        "k": "formula",
        "eq": "10 cal = 0.01 kcal"
      },
      {
        "k": "formula",
        "eq": "100 cal = 0.1 kcal"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply cal by 0.001 to get kcal."
      }
    ]
  },
  'kcal-to-joule': {
    "title": "Kilocalories to Joules",
    "kicker": "Energy conversion",
    "summary": "Convert kcal to J.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "kcal and J are units of energy/charge. 1 kcal = 4184 J (thermochemical)."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "J = kcal × 4184"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 kcal = 4184 J"
      },
      {
        "k": "formula",
        "eq": "10 kcal = 41840 J"
      },
      {
        "k": "formula",
        "eq": "100 kcal = 418400 J"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply kcal by 4184 to get J."
      }
    ]
  },
  'joule-to-kcal': {
    "title": "Joules to Kilocalories",
    "kicker": "Energy conversion",
    "summary": "Convert J to kcal.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "J and kcal are units of energy/charge. 1 kcal = 4184 J (thermochemical)."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "kcal = J × 0.000239005736"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 J = 0.000239 kcal"
      },
      {
        "k": "formula",
        "eq": "10 J = 0.00239 kcal"
      },
      {
        "k": "formula",
        "eq": "100 J = 0.023901 kcal"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply J by 0.000239005736 to get kcal."
      }
    ]
  },
  'wh-to-mah': {
    "title": "Watt-hours to Milliamp-hours",
    "kicker": "Energy conversion",
    "summary": "Convert Wh to mAh.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "Wh and mAh relate through voltage. Requires voltage: mAh = (Wh × 1000) / V."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "mAh = (Wh × 1000) / V"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "10 Wh at 5 V = 2000 mAh"
      },
      {
        "k": "formula",
        "eq": "10 Wh at 3.7 V ≈ 2702.7 mAh"
      },
      {
        "k": "formula",
        "eq": "1 Wh at 12 V ≈ 83.333 mAh"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Requires voltage: mAh = (Wh × 1000) / V."
      }
    ]
  },
  'ah-to-mah': {
    "title": "Amp-hours to Milliamp-hours",
    "kicker": "Energy conversion",
    "summary": "Convert Ah to mAh.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "Ah and mAh are units of energy/charge. 1 Ah = 1000 mAh."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "mAh = Ah × 1000"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 Ah = 1000 mAh"
      },
      {
        "k": "formula",
        "eq": "10 Ah = 10000 mAh"
      },
      {
        "k": "formula",
        "eq": "100 Ah = 100000 mAh"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply Ah by 1000 to get mAh."
      }
    ]
  },
  'mah-to-ah': {
    "title": "Milliamp-hours to Amp-hours",
    "kicker": "Energy conversion",
    "summary": "Convert mAh to Ah.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "mAh and Ah are units of energy/charge. 1 Ah = 1000 mAh."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "Ah = mAh × 0.001"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 mAh = 0.001 Ah"
      },
      {
        "k": "formula",
        "eq": "10 mAh = 0.01 Ah"
      },
      {
        "k": "formula",
        "eq": "100 mAh = 0.1 Ah"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply mAh by 0.001 to get Ah."
      }
    ]
  },

  'hz-to-khz': {
    "title": "Hertz to Kilohertz",
    "kicker": "Frequency conversion",
    "summary": "Convert Hz to kHz.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "Hertz (Hz) and kilohertz (kHz) measure frequency. 1 kHz = 1000 Hz."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "kHz = Hz / 1000"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1000 Hz = 1 kHz"
      },
      {
        "k": "formula",
        "eq": "500 Hz = 0.5 kHz"
      },
      {
        "k": "formula",
        "eq": "20000 Hz = 20 kHz"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Divide hertz by 1000 to get kilohertz."
      }
    ]
  },
  'khz-to-hz': {
    "title": "Kilohertz to Hertz",
    "kicker": "Frequency conversion",
    "summary": "Convert kHz to Hz.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "1 kHz = 1000 Hz."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "Hz = kHz × 1000"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 kHz = 1000 Hz"
      },
      {
        "k": "formula",
        "eq": "2.5 kHz = 2500 Hz"
      },
      {
        "k": "formula",
        "eq": "20 kHz = 20000 Hz"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply kilohertz by 1000 to get hertz."
      }
    ]
  },
  'hz-to-mhz': {
    "title": "Hertz to Megahertz",
    "kicker": "Frequency conversion",
    "summary": "Convert Hz to MHz.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "1 MHz = 1,000,000 Hz."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "MHz = Hz / 1,000,000"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1000000 Hz = 1 MHz"
      },
      {
        "k": "formula",
        "eq": "500000 Hz = 0.5 MHz"
      },
      {
        "k": "formula",
        "eq": "2400000000 Hz = 2400 MHz"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Divide hertz by 1,000,000 to get megahertz."
      }
    ]
  },
  'mhz-to-hz': {
    "title": "Megahertz to Hertz",
    "kicker": "Frequency conversion",
    "summary": "Convert MHz to Hz.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "1 MHz = 1,000,000 Hz."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "Hz = MHz × 1,000,000"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 MHz = 1000000 Hz"
      },
      {
        "k": "formula",
        "eq": "2.4 MHz = 2400000 Hz"
      },
      {
        "k": "formula",
        "eq": "100 MHz = 100000000 Hz"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply megahertz by 1,000,000 to get hertz."
      }
    ]
  },
  'khz-to-mhz': {
    "title": "Kilohertz to Megahertz",
    "kicker": "Frequency conversion",
    "summary": "Convert kHz to MHz.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "1 MHz = 1000 kHz."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "MHz = kHz / 1000"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1000 kHz = 1 MHz"
      },
      {
        "k": "formula",
        "eq": "500 kHz = 0.5 MHz"
      },
      {
        "k": "formula",
        "eq": "2400 kHz = 2.4 MHz"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Divide kilohertz by 1000 to get megahertz."
      }
    ]
  },
  'mhz-to-khz': {
    "title": "Megahertz to Kilohertz",
    "kicker": "Frequency conversion",
    "summary": "Convert MHz to kHz.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "1 MHz = 1000 kHz."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "kHz = MHz × 1000"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 MHz = 1000 kHz"
      },
      {
        "k": "formula",
        "eq": "2.4 MHz = 2400 kHz"
      },
      {
        "k": "formula",
        "eq": "0.5 MHz = 500 kHz"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply megahertz by 1000 to get kilohertz."
      }
    ]
  },
  'ghz-to-hz': {
    "title": "Gigahertz to Hertz",
    "kicker": "Frequency conversion",
    "summary": "Convert GHz to Hz.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "1 GHz = 1,000,000,000 Hz."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "Hz = GHz × 1,000,000,000"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 GHz = 1000000000 Hz"
      },
      {
        "k": "formula",
        "eq": "2.4 GHz = 2400000000 Hz"
      },
      {
        "k": "formula",
        "eq": "5 GHz = 5000000000 Hz"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply gigahertz by 1,000,000,000 to get hertz."
      }
    ]
  },
  'hz-to-ghz': {
    "title": "Hertz to Gigahertz",
    "kicker": "Frequency conversion",
    "summary": "Convert Hz to GHz.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "1 GHz = 1,000,000,000 Hz."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "GHz = Hz / 1,000,000,000"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1000000000 Hz = 1 GHz"
      },
      {
        "k": "formula",
        "eq": "2400000000 Hz = 2.4 GHz"
      },
      {
        "k": "formula",
        "eq": "5000000000 Hz = 5 GHz"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Divide hertz by 1,000,000,000 to get gigahertz."
      }
    ]
  },
  'ghz-to-mhz': {
    "title": "Gigahertz to Megahertz",
    "kicker": "Frequency conversion",
    "summary": "Convert GHz to MHz.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "1 GHz = 1000 MHz."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "MHz = GHz × 1000"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 GHz = 1000 MHz"
      },
      {
        "k": "formula",
        "eq": "2.4 GHz = 2400 MHz"
      },
      {
        "k": "formula",
        "eq": "5 GHz = 5000 MHz"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply gigahertz by 1000 to get megahertz."
      }
    ]
  },
  'mhz-to-ghz': {
    "title": "Megahertz to Gigahertz",
    "kicker": "Frequency conversion",
    "summary": "Convert MHz to GHz.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "1 GHz = 1000 MHz."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "GHz = MHz / 1000"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1000 MHz = 1 GHz"
      },
      {
        "k": "formula",
        "eq": "2400 MHz = 2.4 GHz"
      },
      {
        "k": "formula",
        "eq": "500 MHz = 0.5 GHz"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Divide megahertz by 1000 to get gigahertz."
      }
    ]
  },
  'amp-to-watt': {
    "title": "Amps to Watts",
    "kicker": "Electrical conversion",
    "summary": "Convert current (A) and voltage (V) to power (W).",
    "tool": "current-power",
    "blocks": [
      {
        "k": "definition",
        "t": "Power depends on current and voltage (and power factor for AC)."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "P(W) = I(A) × V(V) (DC)"
      },
      {
        "k": "formula",
        "eq": "P(W) = PF × I(A) × V(V) (AC)"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1 A × 120 V = 120 W (DC/resistive)"
      },
      {
        "k": "formula",
        "eq": "2 A × 230 V = 460 W (PF 1)"
      },
      {
        "k": "formula",
        "eq": "5 A × 12 V = 60 W"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply amps by volts (and PF for AC) to get watts."
      }
    ]
  },
  'watt-to-amp': {
    "title": "Watts to Amps",
    "kicker": "Electrical conversion",
    "summary": "Convert power (W) and voltage (V) to current (A).",
    "tool": "current-power",
    "blocks": [
      {
        "k": "definition",
        "t": "Current depends on power, voltage, and power factor for AC."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "I(A) = P(W) / V(V) (DC)"
      },
      {
        "k": "formula",
        "eq": "I(A) = P(W) / (PF × V(V)) (AC)"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "120 W / 120 V = 1 A"
      },
      {
        "k": "formula",
        "eq": "800 W / 12 V = 66.667 A"
      },
      {
        "k": "formula",
        "eq": "800 W / (0.8 × 120 V) = 8.333 A"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Divide watts by volts (and PF for AC) to get amps."
      }
    ]
  },
  'amp-to-volt': {
    "title": "Amps to Volts",
    "kicker": "Electrical conversion",
    "summary": "Convert current and resistance/power to voltage.",
    "tool": "ohms-law",
    "blocks": [
      {
        "k": "definition",
        "t": "Voltage can be found from current and resistance (Ohm’s law) or from power."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "V = I × R"
      },
      {
        "k": "formula",
        "eq": "V = P / I"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "2 A × 10 Ω = 20 V"
      },
      {
        "k": "formula",
        "eq": "120 W / 2 A = 60 V"
      },
      {
        "k": "formula",
        "eq": "5 A × 12 Ω = 60 V"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Use V = I×R or V = P/I depending on known values."
      }
    ]
  },
  'volt-to-amp': {
    "title": "Volts to Amps",
    "kicker": "Electrical conversion",
    "summary": "Convert voltage and resistance/power to current.",
    "tool": "ohms-law",
    "blocks": [
      {
        "k": "definition",
        "t": "Current can be found from voltage and resistance or from power."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "I = V / R"
      },
      {
        "k": "formula",
        "eq": "I = P / V"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "12 V / 6 Ω = 2 A"
      },
      {
        "k": "formula",
        "eq": "120 W / 120 V = 1 A"
      },
      {
        "k": "formula",
        "eq": "230 V / 46 Ω = 5 A"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Use I = V/R or I = P/V depending on known values."
      }
    ]
  },
  'volt-to-watt': {
    "title": "Volts to Watts",
    "kicker": "Electrical conversion",
    "summary": "Convert voltage and current to power.",
    "tool": "current-power",
    "blocks": [
      {
        "k": "definition",
        "t": "Power is voltage times current (times PF for AC)."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "P = V × I (DC)"
      },
      {
        "k": "formula",
        "eq": "P = PF × V × I (AC)"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "120 V × 2 A = 240 W"
      },
      {
        "k": "formula",
        "eq": "230 V × 5 A = 1150 W"
      },
      {
        "k": "formula",
        "eq": "12 V × 10 A = 120 W"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply volts by amps to get watts."
      }
    ]
  },
  'watt-to-volt': {
    "title": "Watts to Volts",
    "kicker": "Electrical conversion",
    "summary": "Convert power and current to voltage.",
    "tool": "ohms-law",
    "blocks": [
      {
        "k": "definition",
        "t": "Voltage can be found from power and current."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "V = P / I"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "120 W / 1 A = 120 V"
      },
      {
        "k": "formula",
        "eq": "1000 W / 10 A = 100 V"
      },
      {
        "k": "formula",
        "eq": "60 W / 5 A = 12 V"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Divide watts by amps to get volts."
      }
    ]
  },
  'ohm-to-amp': {
    "title": "Ohms to Amps",
    "kicker": "Electrical conversion",
    "summary": "Relate resistance to current using voltage or power.",
    "tool": "ohms-law",
    "blocks": [
      {
        "k": "definition",
        "t": "Current depends on voltage or power as well as resistance."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "I = V / R"
      },
      {
        "k": "formula",
        "eq": "I = √(P / R)"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "12 V / 6 Ω = 2 A"
      },
      {
        "k": "formula",
        "eq": "100 W / 25 Ω → I = 2 A"
      },
      {
        "k": "formula",
        "eq": "230 V / 46 Ω = 5 A"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Use Ohm’s law: I = V/R (or I = √(P/R))."
      }
    ]
  },
  'amp-to-ohm': {
    "title": "Amps to Ohms",
    "kicker": "Electrical conversion",
    "summary": "Relate current to resistance using voltage or power.",
    "tool": "ohms-law",
    "blocks": [
      {
        "k": "definition",
        "t": "Resistance can be found from voltage and current or from power and current."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "R = V / I"
      },
      {
        "k": "formula",
        "eq": "R = P / I²"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "12 V / 2 A = 6 Ω"
      },
      {
        "k": "formula",
        "eq": "100 W / (2 A)² = 25 Ω"
      },
      {
        "k": "formula",
        "eq": "230 V / 5 A = 46 Ω"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Use R = V/I or R = P/I²."
      }
    ]
  },
  'va-to-watt': {
    "title": "VA to Watts",
    "kicker": "Electrical conversion",
    "summary": "Convert apparent power (VA) to real power (W).",
    "tool": "power-factor",
    "blocks": [
      {
        "k": "definition",
        "t": "Real power equals apparent power times power factor."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "W = VA × PF"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1000 VA × 1 = 1000 W"
      },
      {
        "k": "formula",
        "eq": "1000 VA × 0.8 = 800 W"
      },
      {
        "k": "formula",
        "eq": "500 VA × 0.9 = 450 W"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply VA by power factor to get watts."
      }
    ]
  },
  'watt-to-va': {
    "title": "Watts to VA",
    "kicker": "Electrical conversion",
    "summary": "Convert real power (W) to apparent power (VA).",
    "tool": "power-factor",
    "blocks": [
      {
        "k": "definition",
        "t": "Apparent power equals real power divided by power factor."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "VA = W / PF"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "800 W / 0.8 = 1000 VA"
      },
      {
        "k": "formula",
        "eq": "1000 W / 1 = 1000 VA"
      },
      {
        "k": "formula",
        "eq": "450 W / 0.9 = 500 VA"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Divide watts by power factor to get VA."
      }
    ]
  },
  'kva-to-kw': {
    "title": "kVA to kW",
    "kicker": "Electrical conversion",
    "summary": "Convert apparent power (kVA) to real power (kW).",
    "tool": "power-factor",
    "blocks": [
      {
        "k": "definition",
        "t": "Real power equals apparent power times power factor."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "kW = kVA × PF"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "10 kVA × 0.8 = 8 kW"
      },
      {
        "k": "formula",
        "eq": "5 kVA × 1 = 5 kW"
      },
      {
        "k": "formula",
        "eq": "100 kVA × 0.9 = 90 kW"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Multiply kVA by power factor to get kW."
      }
    ]
  },
  'kw-to-kva': {
    "title": "kW to kVA",
    "kicker": "Electrical conversion",
    "summary": "Convert real power (kW) to apparent power (kVA).",
    "tool": "power-factor",
    "blocks": [
      {
        "k": "definition",
        "t": "Apparent power equals real power divided by power factor."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "kVA = kW / PF"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "8 kW / 0.8 = 10 kVA"
      },
      {
        "k": "formula",
        "eq": "5 kW / 1 = 5 kVA"
      },
      {
        "k": "formula",
        "eq": "90 kW / 0.9 = 100 kVA"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Divide kW by power factor to get kVA."
      }
    ]
  },
  'kva-to-amp': {
    "title": "kVA to Amps",
    "kicker": "Electrical conversion",
    "summary": "Convert kVA to amps given voltage and phase.",
    "tool": "three-phase",
    "blocks": [
      {
        "k": "definition",
        "t": "Current depends on kVA, voltage, and whether the system is single-phase or three-phase."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "I = (kVA × 1000) / V (single-phase)"
      },
      {
        "k": "formula",
        "eq": "I = (kVA × 1000) / (√3 × V) (three-phase)"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "10 kVA / 230 V ≈ 43.478 A (1φ)"
      },
      {
        "k": "formula",
        "eq": "10 kVA / (1.732 × 400 V) ≈ 14.434 A (3φ)"
      },
      {
        "k": "formula",
        "eq": "5 kVA / 120 V ≈ 41.667 A (1φ)"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Use the appropriate formula for single-phase or three-phase systems."
      }
    ]
  },
  'amp-to-kva': {
    "title": "Amps to kVA",
    "kicker": "Electrical conversion",
    "summary": "Convert amps to kVA given voltage and phase.",
    "tool": "three-phase",
    "blocks": [
      {
        "k": "definition",
        "t": "Apparent power depends on current, voltage, and phase configuration."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "kVA = (I × V) / 1000 (single-phase)"
      },
      {
        "k": "formula",
        "eq": "kVA = (√3 × I × V) / 1000 (three-phase)"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "43.478 A × 230 V / 1000 ≈ 10 kVA (1φ)"
      },
      {
        "k": "formula",
        "eq": "14.434 A × 1.732 × 400 V / 1000 ≈ 10 kVA (3φ)"
      },
      {
        "k": "formula",
        "eq": "10 A × 120 V / 1000 = 1.2 kVA (1φ)"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Use the appropriate formula for single-phase or three-phase systems."
      }
    ]
  },
  'how-binary-to-decimal': {
    "title": "How to Convert Binary to Decimal",
    "kicker": "Number conversion",
    "summary": "Convert binary numbers to decimal.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "Binary is base 2; each digit represents a power of two."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "Decimal = Σ (bit × 2^position)"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1010₂ = 10₁₀"
      },
      {
        "k": "formula",
        "eq": "1111₂ = 15₁₀"
      },
      {
        "k": "formula",
        "eq": "10000000₂ = 128₁₀"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Sum the powers of two for each 1 bit."
      }
    ]
  },
  'how-decimal-to-binary': {
    "title": "How to Convert Decimal to Binary",
    "kicker": "Number conversion",
    "summary": "Convert decimal numbers to binary.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "Divide the number by 2 repeatedly and read remainders in reverse order."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "Binary = remainders of successive division by 2 (reverse order)"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "10₁₀ = 1010₂"
      },
      {
        "k": "formula",
        "eq": "15₁₀ = 1111₂"
      },
      {
        "k": "formula",
        "eq": "255₁₀ = 11111111₂"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Use repeated division by 2."
      }
    ]
  },
  'how-decimal-to-hex': {
    "title": "How to Convert Decimal to Hexadecimal",
    "kicker": "Number conversion",
    "summary": "Convert decimal numbers to hexadecimal.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "Hexadecimal is base 16 (digits 0-9 and A-F)."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "Hex = remainders of successive division by 16 (reverse order)"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "255₁₀ = FF₁₆"
      },
      {
        "k": "formula",
        "eq": "4096₁₀ = 1000₁₆"
      },
      {
        "k": "formula",
        "eq": "26₁₀ = 1A₁₆"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Divide by 16 repeatedly and map remainders 10-15 to A-F."
      }
    ]
  },
  'how-hex-to-decimal': {
    "title": "How to Convert Hexadecimal to Decimal",
    "kicker": "Number conversion",
    "summary": "Convert hexadecimal numbers to decimal.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "Each hex digit represents a power of 16."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "Decimal = Σ (digit × 16^position)"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "FF₁₆ = 255₁₀"
      },
      {
        "k": "formula",
        "eq": "1A₁₆ = 26₁₀"
      },
      {
        "k": "formula",
        "eq": "100₁₆ = 256₁₀"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Sum digit values times powers of 16."
      }
    ]
  },
  'how-binary-to-hex': {
    "title": "How to Convert Binary to Hexadecimal",
    "kicker": "Number conversion",
    "summary": "Convert binary to hexadecimal.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "Group binary bits in sets of four (from right) and map each group to a hex digit."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "1 hex digit = 4 binary bits"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "1010₂ = A₁₆"
      },
      {
        "k": "formula",
        "eq": "11111111₂ = FF₁₆"
      },
      {
        "k": "formula",
        "eq": "11010110₂ = D6₁₆"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Group bits into nibbles and convert each nibble."
      }
    ]
  },
  'how-hex-to-binary': {
    "title": "How to Convert Hexadecimal to Binary",
    "kicker": "Number conversion",
    "summary": "Convert hexadecimal to binary.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "Convert each hex digit to a 4-bit binary group."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "1 hex digit = 4 binary bits"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "A₁₆ = 1010₂"
      },
      {
        "k": "formula",
        "eq": "FF₁₆ = 11111111₂"
      },
      {
        "k": "formula",
        "eq": "2F₁₆ = 00101111₂"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Expand each hex digit into four bits."
      }
    ]
  },
  'how-celsius-to-fahrenheit': {
    "title": "How to Convert Celsius to Fahrenheit",
    "kicker": "Temperature conversion",
    "summary": "Convert Celsius to Fahrenheit.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "Multiply Celsius by 9/5 and add 32."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "°F = °C × 9/5 + 32"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "0°C = 32°F"
      },
      {
        "k": "formula",
        "eq": "100°C = 212°F"
      },
      {
        "k": "formula",
        "eq": "25°C = 77°F"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Use °F = °C × 1.8 + 32."
      }
    ]
  },
  'how-fahrenheit-to-celsius': {
    "title": "How to Convert Fahrenheit to Celsius",
    "kicker": "Temperature conversion",
    "summary": "Convert Fahrenheit to Celsius.",
    "tool": null,
    "blocks": [
      {
        "k": "definition",
        "t": "Subtract 32 from Fahrenheit and multiply by 5/9."
      },
      {
        "k": "h3",
        "t": "Conversion formula"
      },
      {
        "k": "formula",
        "eq": "°C = (°F − 32) × 5/9"
      },
      {
        "k": "h3",
        "t": "Examples"
      },
      {
        "k": "formula",
        "eq": "32°F = 0°C"
      },
      {
        "k": "formula",
        "eq": "212°F = 100°C"
      },
      {
        "k": "formula",
        "eq": "77°F = 25°C"
      },
      {
        "k": "callout",
        "icon": "info",
        "t": "Use °C = (°F − 32) / 1.8."
      }
    ]
  },

};

export const ARTICLE_SLUGS = Object.keys(ARTICLES);

/* ── reference tables ──────────────────────────────────────────────────── */

/* ── named colours and the web-safe palette ──────────────────────────────── */

const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, Math.round(l * 100)];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  return [h, Math.round((s || 0) * 100), Math.round(l * 100)];
};

const NAMED_COLOURS = [
  ['black', '000000'], ['white', 'ffffff'], ['silver', 'c0c0c0'], ['gray', '808080'],
  ['maroon', '800000'], ['red', 'ff0000'], ['crimson', 'dc143c'], ['tomato', 'ff6347'],
  ['orangered', 'ff4500'], ['orange', 'ffa500'], ['gold', 'ffd700'], ['yellow', 'ffff00'],
  ['khaki', 'f0e68c'], ['olive', '808000'], ['lime', '00ff00'], ['limegreen', '32cd32'],
  ['forestgreen', '228b57'], ['seagreen', '2e8b57'], ['green', '008000'], ['teal', '008080'],
  ['aquamarine', '7fffd4'], ['cyan', '00ffff'], ['aqua', '00ffff'], ['deepskyblue', '00bfff'],
  ['dodgerblue', '1e90ff'], ['skyblue', '87ceeb'], ['steelblue', '4682b4'], ['royalblue', '4169e1'],
  ['blue', '0000ff'], ['darkblue', '00008b'], ['midnightblue', '191970'], ['navy', '000080'],
  ['slateblue', '6a5acd'], ['indigo', '4b0082'], ['violet', 'ee82ee'], ['orchid', 'da70d6'],
  ['magenta', 'ff00ff'], ['fuchsia', 'ff00ff'], ['plum', 'dda0dd'], ['lavender', 'e6e6fa'],
  ['slategray', '708090'], ['aliceblue', 'f0f8ff'], ['ivory', 'fffff0'],
];

const namedRgbHsl = ([name, hex]) => {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  return { name, hex: `#${hex}`, rgb: `${r}, ${g}, ${b}`, hsl: `${h}°, ${s}%, ${l}%` };
};

// The 216 web-safe colours: each channel picks from {00, 33, 66, 99, CC, FF}.
const WEB_SAFE_CHANNELS = ['00', '33', '66', '99', 'cc', 'ff'];
const WEB_SAFE = WEB_SAFE_CHANNELS.flatMap((r) =>
  WEB_SAFE_CHANNELS.flatMap((g) => WEB_SAFE_CHANNELS.map((b) => `#${r}${g}${b}`)));

export const TABLES = {
  resistors: {
    title: 'Resistor colour code',
    blurb: 'Four or five bands, read as digit · digit · multiplier · tolerance.',
    bands: [
      { code: 'Black', hex: '000000', value: '0', note: '0 × 10⁰' },
      { code: 'Brown', hex: '6b3a1a', value: '1', note: '1 × 10⁰' },
      { code: 'Red', hex: 'c0392b', value: '2', note: '2 × 10⁰' },
      { code: 'Orange', hex: 'd35400', value: '3', note: '3 × 10⁰' },
      { code: 'Yellow', hex: 'd4ac0d', value: '4', note: '4 × 10⁰' },
      { code: 'Green', hex: '27ae60', value: '5', note: '5 × 10⁰' },
      { code: 'Blue', hex: '2471a3', value: '6', note: '6 × 10⁰' },
      { code: 'Violet', hex: '8e44ad', value: '7', note: '7 × 10⁰' },
      { code: 'Gray', hex: '7f8c8d', value: '8', note: '8 × 10⁰' },
      { code: 'White', hex: 'ecf0f1', value: '9', note: '9 × 10⁰' },
    ],
    multipliers: [
      { code: 'Silver', hex: 'bdc3c7', value: '× 0.01' },
      { code: 'Gold', hex: 'd4ac0d', value: '× 0.1' },
      { code: 'Black', hex: '000000', value: '× 1' },
      { code: 'Brown', hex: '6b3a1a', value: '× 10' },
      { code: 'Red', hex: 'c0392b', value: '× 100' },
      { code: 'Orange', hex: 'd35400', value: '× 1 000' },
      { code: 'Yellow', hex: 'd4ac0d', value: '× 10 000' },
      { code: 'Green', hex: '27ae60', value: '× 100 000' },
      { code: 'Blue', hex: '2471a3', value: '× 1 000 000' },
      { code: 'Violet', hex: '8e44ad', value: '× 10 000 000' },
    ],
    tolerance: [
      { code: 'Brown', hex: '6b3a1a', value: '± 1 %' },
      { code: 'Red', hex: 'c0392b', value: '± 2 %' },
      { code: 'Gold', hex: 'd4ac0d', value: '± 5 %' },
      { code: 'Silver', hex: 'bdc3c7', value: '± 10 %' },
      { code: 'No band', hex: '', value: '± 20 %' },
      { code: 'Green', hex: '27ae60', value: '± 0.5 %' },
      { code: 'Blue', hex: '2471a3', value: '± 0.25 %' },
      { code: 'Violet', hex: '8e44ad', value: '± 0.1 %' },
    ],
  },

  conductivity: {
    title: 'Resistivity of common materials',
    blurb: 'At 20 °C. The lower the number, the better the conductor.',
    rows: [
      ['Silver', '1.59×10⁻⁸', 'Best conductor'],
      ['Copper', '1.68×10⁻⁸', 'Used for wiring'],
      ['Gold', '2.44×10⁻⁸', 'Corrosion-resistant contacts'],
      ['Aluminium', '2.82×10⁻⁸', 'Lightweight, cheap'],
      ['Tungsten', '5.6×10⁻⁸', 'High melting point'],
      ['Iron', '9.71×10⁻⁸', 'Strong, magnetically soft'],
      ['Platinum', '1.06×10⁻⁷', 'Sensor and catalyst'],
      ['Nickel-chrome', '1.10×10⁻⁷', 'Heating elements'],
      ['Carbon (graphite)', '3.5×10⁻⁵', 'Resistors, brushes'],
    ],
  },

  wireCurrent: {
    title: 'Indicative current capacity',
    blurb: 'Single conductors in conduit, PVC insulated, in free air at 30 °C. Local code always governs.',
    rows: [
      ['1.5 mm²', '14 AWG', '≈ 16 A', 'Lighting circuits'],
      ['2.5 mm²', '12 AWG', '≈ 21 A', 'Socket circuits, showers'],
      ['4 mm²', '10 AWG', '≈ 28 A', 'Rings, larger loads'],
      ['6 mm²', '8 AWG', '≈ 36 A', 'Cooker circuits'],
      ['10 mm²', '6 AWG', '≈ 50 A', 'Sub-board feeders'],
      ['16 mm²', '4 AWG', '≈ 68 A', 'Three-phase supply'],
      ['25 mm²', '2 AWG', '≈ 89 A', 'Main feeders'],
    ],
  },

  /* IEC 60063 preferred-number series — the nominal values printed on every
     1 % or 5 % resistor. Codes are 10…100 (i.e. "102" = 1 kΩ); add one or more
     zeros after the last printed digit for the decimal multiplier. */
  eseries: {
    title: 'Resistor E-series',
    blurb: 'IEC 60063 preferred values. Code printed on the part = digits × 10^n Ω (e.g. 102 = 1 kΩ).',
    series: [
      { id: 'E6', label: 'E6 · ±20 %', values: [10, 15, 22, 33, 47, 68] },
      { id: 'E12', label: 'E12 · ±10 %', values: [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82] },
      { id: 'E24', label: 'E24 · ±5 %', values: [10, 11, 13, 15, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 43, 47, 51, 56, 62, 68, 75, 82, 91] },
      { id: 'E48', label: 'E48 · ±2 %', values: [100, 110, 120, 130, 150, 160, 180, 200, 220, 240, 270, 300, 330, 360, 390, 430, 470, 510, 560, 620, 680, 750, 820, 910] },
      { id: 'E96', label: 'E96 · ±1 %', values: [100, 102, 105, 107, 110, 113, 115, 118, 121, 124, 127, 130, 133, 137, 140, 143, 147, 150, 154, 158, 162, 165, 169, 174, 178, 182, 187, 191, 196, 200, 205, 210, 215, 221, 226, 232, 237, 243, 249, 255, 261, 267, 274, 280, 287, 294, 301, 309, 316, 324, 332, 340, 348, 357, 365, 374, 383, 392, 402, 412, 422, 432, 442, 453, 464, 475, 487, 499, 511, 523, 536, 549, 562, 576, 590, 604, 619, 634, 649, 665, 681, 698, 715, 732, 750, 768, 787, 806, 825, 845, 866, 887, 909, 931, 953, 976] },
    ],
  },

  awgCopper: (() => {
    /* d(in) = 0.005 · 92^((36 − n)/39); resistivity of copper at 20 °C = 1.68e-8 Ω·m.
       AWG numbering: 4/0 = −3, 3/0 = −2, 2/0 = −1, 1 = 0. */
    const gauges = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26];
    const label = (g) => (g < 0 ? ['4/0', '3/0', '2/0'][g + 3] : g === 0 ? '1/0' : String(g));
    const rho = 1.68e-8;
    const rows = gauges.map((n) => {
      const dMm = 0.127 * Math.pow(92, (36 - n) / 39);
      const areaMm2 = Math.PI * dMm * dMm / 4;
      return [label(n), dMm.toFixed(3), areaMm2.toFixed(4), (rho * 1000 / (areaMm2 * 1e-6)).toFixed(3)];
    });
    return {
      title: 'Copper wire — AWG',
      blurb: 'Diameter, cross-section and resistance per kilometre calculated with d = 0.127·92^((36−n)/39) mm and ρ(Cu) = 1.68×10⁻⁸ Ω·m.',
      columns: ['AWG', 'Diameter (mm)', 'Area (mm²)', 'Resistance Ω/km'],
      rows,
    };
  })(),

  /**
   * Reference math tables, mirroring the reference site's multiplication,
   * addition, log and temperature charts. Rows are generated once at import
   * time rather than pulled from the network at view-build time.
   */
  multiplication: {
    title: 'Multiplication table',
    blurb: '×1 through ×12 — hover highlights the row you are reading.',
    size: 12,
    rows: Array.from({ length: 12 }, (_, i) =>
      Array.from({ length: 12 }, (_, j) => (i + 1) * (j + 1))),
  },

  normalDist: {
    title: 'Standard normal (z-score) table',
    blurb: 'Cumulative Φ(z) and density φ(z) for z = 0.00 to 3.99.',
    rows: [
    ['0.00', '0.5000', '0.3989'],
    ['0.01', '0.5040', '0.3989'],
    ['0.02', '0.5080', '0.3989'],
    ['0.03', '0.5120', '0.3988'],
    ['0.04', '0.5160', '0.3986'],
    ['0.05', '0.5199', '0.3984'],
    ['0.06', '0.5239', '0.3982'],
    ['0.07', '0.5279', '0.3980'],
    ['0.08', '0.5319', '0.3977'],
    ['0.09', '0.5359', '0.3973'],
    ['0.10', '0.5398', '0.3970'],
    ['0.11', '0.5438', '0.3965'],
    ['0.12', '0.5478', '0.3961'],
    ['0.13', '0.5517', '0.3956'],
    ['0.14', '0.5557', '0.3951'],
    ['0.15', '0.5596', '0.3945'],
    ['0.16', '0.5636', '0.3939'],
    ['0.17', '0.5675', '0.3932'],
    ['0.18', '0.5714', '0.3925'],
    ['0.19', '0.5753', '0.3918'],
    ['0.20', '0.5793', '0.3910'],
    ['0.21', '0.5832', '0.3902'],
    ['0.22', '0.5871', '0.3894'],
    ['0.23', '0.5910', '0.3885'],
    ['0.24', '0.5948', '0.3876'],
    ['0.25', '0.5987', '0.3867'],
    ['0.26', '0.6026', '0.3857'],
    ['0.27', '0.6064', '0.3847'],
    ['0.28', '0.6103', '0.3836'],
    ['0.29', '0.6141', '0.3825'],
    ['0.30', '0.6179', '0.3814'],
    ['0.31', '0.6217', '0.3802'],
    ['0.32', '0.6255', '0.3790'],
    ['0.33', '0.6293', '0.3778'],
    ['0.34', '0.6331', '0.3765'],
    ['0.35', '0.6368', '0.3752'],
    ['0.36', '0.6406', '0.3739'],
    ['0.37', '0.6443', '0.3725'],
    ['0.38', '0.6480', '0.3712'],
    ['0.39', '0.6517', '0.3697'],
    ['0.40', '0.6554', '0.3683'],
    ['0.41', '0.6591', '0.3668'],
    ['0.42', '0.6628', '0.3653'],
    ['0.43', '0.6664', '0.3637'],
    ['0.44', '0.6700', '0.3621'],
    ['0.45', '0.6736', '0.3605'],
    ['0.46', '0.6772', '0.3589'],
    ['0.47', '0.6808', '0.3572'],
    ['0.48', '0.6844', '0.3555'],
    ['0.49', '0.6879', '0.3538'],
    ['0.50', '0.6915', '0.3521'],
    ['0.51', '0.6950', '0.3503'],
    ['0.52', '0.6985', '0.3485'],
    ['0.53', '0.7019', '0.3467'],
    ['0.54', '0.7054', '0.3448'],
    ['0.55', '0.7088', '0.3429'],
    ['0.56', '0.7123', '0.3410'],
    ['0.57', '0.7157', '0.3391'],
    ['0.58', '0.7190', '0.3372'],
    ['0.59', '0.7224', '0.3352'],
    ['0.60', '0.7257', '0.3332'],
    ['0.61', '0.7291', '0.3312'],
    ['0.62', '0.7324', '0.3292'],
    ['0.63', '0.7357', '0.3271'],
    ['0.64', '0.7389', '0.3251'],
    ['0.65', '0.7422', '0.3230'],
    ['0.66', '0.7454', '0.3209'],
    ['0.67', '0.7486', '0.3187'],
    ['0.68', '0.7517', '0.3166'],
    ['0.69', '0.7549', '0.3144'],
    ['0.70', '0.7580', '0.3123'],
    ['0.71', '0.7611', '0.3101'],
    ['0.72', '0.7642', '0.3079'],
    ['0.73', '0.7673', '0.3056'],
    ['0.74', '0.7704', '0.3034'],
    ['0.75', '0.7734', '0.3011'],
    ['0.76', '0.7764', '0.2989'],
    ['0.77', '0.7794', '0.2966'],
    ['0.78', '0.7823', '0.2943'],
    ['0.79', '0.7852', '0.2920'],
    ['0.80', '0.7881', '0.2897'],
    ['0.81', '0.7910', '0.2874'],
    ['0.82', '0.7939', '0.2850'],
    ['0.83', '0.7967', '0.2827'],
    ['0.84', '0.7995', '0.2803'],
    ['0.85', '0.8023', '0.2780'],
    ['0.86', '0.8051', '0.2756'],
    ['0.87', '0.8078', '0.2732'],
    ['0.88', '0.8106', '0.2709'],
    ['0.89', '0.8133', '0.2685'],
    ['0.90', '0.8159', '0.2661'],
    ['0.91', '0.8186', '0.2637'],
    ['0.92', '0.8212', '0.2613'],
    ['0.93', '0.8238', '0.2589'],
    ['0.94', '0.8264', '0.2565'],
    ['0.95', '0.8289', '0.2541'],
    ['0.96', '0.8315', '0.2516'],
    ['0.97', '0.8340', '0.2492'],
    ['0.98', '0.8365', '0.2468'],
    ['0.99', '0.8389', '0.2444'],
    ['1.00', '0.8413', '0.2420'],
    ['1.01', '0.8438', '0.2396'],
    ['1.02', '0.8461', '0.2371'],
    ['1.03', '0.8485', '0.2347'],
    ['1.04', '0.8508', '0.2323'],
    ['1.05', '0.8531', '0.2299'],
    ['1.06', '0.8554', '0.2275'],
    ['1.07', '0.8577', '0.2251'],
    ['1.08', '0.8599', '0.2227'],
    ['1.09', '0.8621', '0.2203'],
    ['1.10', '0.8643', '0.2179'],
    ['1.11', '0.8665', '0.2155'],
    ['1.12', '0.8686', '0.2131'],
    ['1.13', '0.8708', '0.2107'],
    ['1.14', '0.8729', '0.2083'],
    ['1.15', '0.8749', '0.2059'],
    ['1.16', '0.8770', '0.2036'],
    ['1.17', '0.8790', '0.2012'],
    ['1.18', '0.8810', '0.1989'],
    ['1.19', '0.8830', '0.1965'],
    ['1.20', '0.8849', '0.1942'],
    ['1.21', '0.8869', '0.1919'],
    ['1.22', '0.8888', '0.1895'],
    ['1.23', '0.8907', '0.1872'],
    ['1.24', '0.8925', '0.1849'],
    ['1.25', '0.8944', '0.1826'],
    ['1.26', '0.8962', '0.1804'],
    ['1.27', '0.8980', '0.1781'],
    ['1.28', '0.8997', '0.1758'],
    ['1.29', '0.9015', '0.1736'],
    ['1.30', '0.9032', '0.1714'],
    ['1.31', '0.9049', '0.1691'],
    ['1.32', '0.9066', '0.1669'],
    ['1.33', '0.9082', '0.1647'],
    ['1.34', '0.9099', '0.1626'],
    ['1.35', '0.9115', '0.1604'],
    ['1.36', '0.9131', '0.1582'],
    ['1.37', '0.9147', '0.1561'],
    ['1.38', '0.9162', '0.1539'],
    ['1.39', '0.9177', '0.1518'],
    ['1.40', '0.9192', '0.1497'],
    ['1.41', '0.9207', '0.1476'],
    ['1.42', '0.9222', '0.1456'],
    ['1.43', '0.9236', '0.1435'],
    ['1.44', '0.9251', '0.1415'],
    ['1.45', '0.9265', '0.1394'],
    ['1.46', '0.9279', '0.1374'],
    ['1.47', '0.9292', '0.1354'],
    ['1.48', '0.9306', '0.1334'],
    ['1.49', '0.9319', '0.1315'],
    ['1.50', '0.9332', '0.1295'],
    ['1.51', '0.9345', '0.1276'],
    ['1.52', '0.9357', '0.1257'],
    ['1.53', '0.9370', '0.1238'],
    ['1.54', '0.9382', '0.1219'],
    ['1.55', '0.9394', '0.1200'],
    ['1.56', '0.9406', '0.1182'],
    ['1.57', '0.9418', '0.1163'],
    ['1.58', '0.9429', '0.1145'],
    ['1.59', '0.9441', '0.1127'],
    ['1.60', '0.9452', '0.1109'],
    ['1.61', '0.9463', '0.1092'],
    ['1.62', '0.9474', '0.1074'],
    ['1.63', '0.9484', '0.1057'],
    ['1.64', '0.9495', '0.1040'],
    ['1.65', '0.9505', '0.1023'],
    ['1.66', '0.9515', '0.1006'],
    ['1.67', '0.9525', '0.0989'],
    ['1.68', '0.9535', '0.0973'],
    ['1.69', '0.9545', '0.0957'],
    ['1.70', '0.9554', '0.0940'],
    ['1.71', '0.9564', '0.0925'],
    ['1.72', '0.9573', '0.0909'],
    ['1.73', '0.9582', '0.0893'],
    ['1.74', '0.9591', '0.0878'],
    ['1.75', '0.9599', '0.0863'],
    ['1.76', '0.9608', '0.0848'],
    ['1.77', '0.9616', '0.0833'],
    ['1.78', '0.9625', '0.0818'],
    ['1.79', '0.9633', '0.0804'],
    ['1.80', '0.9641', '0.0790'],
    ['1.81', '0.9649', '0.0775'],
    ['1.82', '0.9656', '0.0761'],
    ['1.83', '0.9664', '0.0748'],
    ['1.84', '0.9671', '0.0734'],
    ['1.85', '0.9678', '0.0721'],
    ['1.86', '0.9686', '0.0707'],
    ['1.87', '0.9693', '0.0694'],
    ['1.88', '0.9699', '0.0681'],
    ['1.89', '0.9706', '0.0669'],
    ['1.90', '0.9713', '0.0656'],
    ['1.91', '0.9719', '0.0644'],
    ['1.92', '0.9726', '0.0632'],
    ['1.93', '0.9732', '0.0620'],
    ['1.94', '0.9738', '0.0608'],
    ['1.95', '0.9744', '0.0596'],
    ['1.96', '0.9750', '0.0584'],
    ['1.97', '0.9756', '0.0573'],
    ['1.98', '0.9761', '0.0562'],
    ['1.99', '0.9767', '0.0551'],
    ['2.00', '0.9772', '0.0540'],
    ['2.01', '0.9778', '0.0529'],
    ['2.02', '0.9783', '0.0519'],
    ['2.03', '0.9788', '0.0508'],
    ['2.04', '0.9793', '0.0498'],
    ['2.05', '0.9798', '0.0488'],
    ['2.06', '0.9803', '0.0478'],
    ['2.07', '0.9808', '0.0468'],
    ['2.08', '0.9812', '0.0459'],
    ['2.09', '0.9817', '0.0449'],
    ['2.10', '0.9821', '0.0440'],
    ['2.11', '0.9826', '0.0431'],
    ['2.12', '0.9830', '0.0422'],
    ['2.13', '0.9834', '0.0413'],
    ['2.14', '0.9838', '0.0404'],
    ['2.15', '0.9842', '0.0396'],
    ['2.16', '0.9846', '0.0387'],
    ['2.17', '0.9850', '0.0379'],
    ['2.18', '0.9854', '0.0371'],
    ['2.19', '0.9857', '0.0363'],
    ['2.20', '0.9861', '0.0355'],
    ['2.21', '0.9864', '0.0347'],
    ['2.22', '0.9868', '0.0339'],
    ['2.23', '0.9871', '0.0332'],
    ['2.24', '0.9875', '0.0325'],
    ['2.25', '0.9878', '0.0317'],
    ['2.26', '0.9881', '0.0310'],
    ['2.27', '0.9884', '0.0303'],
    ['2.28', '0.9887', '0.0297'],
    ['2.29', '0.9890', '0.0290'],
    ['2.30', '0.9893', '0.0283'],
    ['2.31', '0.9896', '0.0277'],
    ['2.32', '0.9898', '0.0270'],
    ['2.33', '0.9901', '0.0264'],
    ['2.34', '0.9904', '0.0258'],
    ['2.35', '0.9906', '0.0252'],
    ['2.36', '0.9909', '0.0246'],
    ['2.37', '0.9911', '0.0241'],
    ['2.38', '0.9913', '0.0235'],
    ['2.39', '0.9916', '0.0229'],
    ['2.40', '0.9918', '0.0224'],
    ['2.41', '0.9920', '0.0219'],
    ['2.42', '0.9922', '0.0213'],
    ['2.43', '0.9925', '0.0208'],
    ['2.44', '0.9927', '0.0203'],
    ['2.45', '0.9929', '0.0198'],
    ['2.46', '0.9931', '0.0194'],
    ['2.47', '0.9932', '0.0189'],
    ['2.48', '0.9934', '0.0184'],
    ['2.49', '0.9936', '0.0180'],
    ['2.50', '0.9938', '0.0175'],
    ['2.51', '0.9940', '0.0171'],
    ['2.52', '0.9941', '0.0167'],
    ['2.53', '0.9943', '0.0163'],
    ['2.54', '0.9945', '0.0158'],
    ['2.55', '0.9946', '0.0154'],
    ['2.56', '0.9948', '0.0151'],
    ['2.57', '0.9949', '0.0147'],
    ['2.58', '0.9951', '0.0143'],
    ['2.59', '0.9952', '0.0139'],
    ['2.60', '0.9953', '0.0136'],
    ['2.61', '0.9955', '0.0132'],
    ['2.62', '0.9956', '0.0129'],
    ['2.63', '0.9957', '0.0126'],
    ['2.64', '0.9959', '0.0122'],
    ['2.65', '0.9960', '0.0119'],
    ['2.66', '0.9961', '0.0116'],
    ['2.67', '0.9962', '0.0113'],
    ['2.68', '0.9963', '0.0110'],
    ['2.69', '0.9964', '0.0107'],
    ['2.70', '0.9965', '0.0104'],
    ['2.71', '0.9966', '0.0101'],
    ['2.72', '0.9967', '0.0099'],
    ['2.73', '0.9968', '0.0096'],
    ['2.74', '0.9969', '0.0093'],
    ['2.75', '0.9970', '0.0091'],
    ['2.76', '0.9971', '0.0088'],
    ['2.77', '0.9972', '0.0086'],
    ['2.78', '0.9973', '0.0084'],
    ['2.79', '0.9974', '0.0081'],
    ['2.80', '0.9974', '0.0079'],
    ['2.81', '0.9975', '0.0077'],
    ['2.82', '0.9976', '0.0075'],
    ['2.83', '0.9977', '0.0073'],
    ['2.84', '0.9977', '0.0071'],
    ['2.85', '0.9978', '0.0069'],
    ['2.86', '0.9979', '0.0067'],
    ['2.87', '0.9979', '0.0065'],
    ['2.88', '0.9980', '0.0063'],
    ['2.89', '0.9981', '0.0061'],
    ['2.90', '0.9981', '0.0060'],
    ['2.91', '0.9982', '0.0058'],
    ['2.92', '0.9982', '0.0056'],
    ['2.93', '0.9983', '0.0055'],
    ['2.94', '0.9984', '0.0053'],
    ['2.95', '0.9984', '0.0051'],
    ['2.96', '0.9985', '0.0050'],
    ['2.97', '0.9985', '0.0048'],
    ['2.98', '0.9986', '0.0047'],
    ['2.99', '0.9986', '0.0046'],
    ['3.00', '0.9987', '0.0044'],
    ['3.01', '0.9987', '0.0043'],
    ['3.02', '0.9987', '0.0042'],
    ['3.03', '0.9988', '0.0040'],
    ['3.04', '0.9988', '0.0039'],
    ['3.05', '0.9989', '0.0038'],
    ['3.06', '0.9989', '0.0037'],
    ['3.07', '0.9989', '0.0036'],
    ['3.08', '0.9990', '0.0035'],
    ['3.09', '0.9990', '0.0034'],
    ['3.10', '0.9990', '0.0033'],
    ['3.11', '0.9991', '0.0032'],
    ['3.12', '0.9991', '0.0031'],
    ['3.13', '0.9991', '0.0030'],
    ['3.14', '0.9992', '0.0029'],
    ['3.15', '0.9992', '0.0028'],
    ['3.16', '0.9992', '0.0027'],
    ['3.17', '0.9992', '0.0026'],
    ['3.18', '0.9993', '0.0025'],
    ['3.19', '0.9993', '0.0025'],
    ['3.20', '0.9993', '0.0024'],
    ['3.21', '0.9993', '0.0023'],
    ['3.22', '0.9994', '0.0022'],
    ['3.23', '0.9994', '0.0022'],
    ['3.24', '0.9994', '0.0021'],
    ['3.25', '0.9994', '0.0020'],
    ['3.26', '0.9994', '0.0020'],
    ['3.27', '0.9995', '0.0019'],
    ['3.28', '0.9995', '0.0018'],
    ['3.29', '0.9995', '0.0018'],
    ['3.30', '0.9995', '0.0017'],
    ['3.31', '0.9995', '0.0017'],
    ['3.32', '0.9995', '0.0016'],
    ['3.33', '0.9996', '0.0016'],
    ['3.34', '0.9996', '0.0015'],
    ['3.35', '0.9996', '0.0015'],
    ['3.36', '0.9996', '0.0014'],
    ['3.37', '0.9996', '0.0014'],
    ['3.38', '0.9996', '0.0013'],
    ['3.39', '0.9997', '0.0013'],
    ['3.40', '0.9997', '0.0012'],
    ['3.41', '0.9997', '0.0012'],
    ['3.42', '0.9997', '0.0012'],
    ['3.43', '0.9997', '0.0011'],
    ['3.44', '0.9997', '0.0011'],
    ['3.45', '0.9997', '0.0010'],
    ['3.46', '0.9997', '0.0010'],
    ['3.47', '0.9998', '0.0010'],
    ['3.48', '0.9998', '0.0009'],
    ['3.49', '0.9998', '0.0009'],
    ['3.50', '0.9998', '0.0009'],
    ['3.51', '0.9998', '0.0008'],
    ['3.52', '0.9998', '0.0008'],
    ['3.53', '0.9998', '0.0008'],
    ['3.54', '0.9998', '0.0008'],
    ['3.55', '0.9998', '0.0007'],
    ['3.56', '0.9998', '0.0007'],
    ['3.57', '0.9998', '0.0007'],
    ['3.58', '0.9998', '0.0007'],
    ['3.59', '0.9998', '0.0006'],
    ['3.60', '0.9998', '0.0006'],
    ['3.61', '0.9998', '0.0006'],
    ['3.62', '0.9999', '0.0006'],
    ['3.63', '0.9999', '0.0005'],
    ['3.64', '0.9999', '0.0005'],
    ['3.65', '0.9999', '0.0005'],
    ['3.66', '0.9999', '0.0005'],
    ['3.67', '0.9999', '0.0005'],
    ['3.68', '0.9999', '0.0005'],
    ['3.69', '0.9999', '0.0004'],
    ['3.70', '0.9999', '0.0004'],
    ['3.71', '0.9999', '0.0004'],
    ['3.72', '0.9999', '0.0004'],
    ['3.73', '0.9999', '0.0004'],
    ['3.74', '0.9999', '0.0004'],
    ['3.75', '0.9999', '0.0004'],
    ['3.76', '0.9999', '0.0003'],
    ['3.77', '0.9999', '0.0003'],
    ['3.78', '0.9999', '0.0003'],
    ['3.79', '0.9999', '0.0003'],
    ['3.80', '0.9999', '0.0003'],
    ['3.81', '0.9999', '0.0003'],
    ['3.82', '0.9999', '0.0003'],
    ['3.83', '0.9999', '0.0003'],
    ['3.84', '0.9999', '0.0003'],
    ['3.85', '0.9999', '0.0002'],
    ['3.86', '0.9999', '0.0002'],
    ['3.87', '0.9999', '0.0002'],
    ['3.88', '0.9999', '0.0002'],
    ['3.89', '0.9999', '0.0002'],
    ['3.90', '1.0000', '0.0002'],
    ['3.91', '1.0000', '0.0002'],
    ['3.92', '1.0000', '0.0002'],
    ['3.93', '1.0000', '0.0002'],
    ['3.94', '1.0000', '0.0002'],
    ['3.95', '1.0000', '0.0002'],
    ['3.96', '1.0000', '0.0002'],
    ['3.97', '1.0000', '0.0002'],
    ['3.98', '1.0000', '0.0001'],
    ['3.99', '1.0000', '0.0001'],
    ],
  },

  roman: {
    title: 'Roman numerals',
    blurb: 'I V X L C D M — the seven symbols, and the 1–100 chart.',
    symbols: [
      ['I', '1', 'one'],
      ['V', '5', 'five'],
      ['X', '10', 'ten'],
      ['L', '50', 'fifty'],
      ['C', '100', 'one hundred'],
      ['D', '500', 'five hundred'],
      ['M', '1,000', 'one thousand'],
    ],
    subtractive: 'IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900 — a smaller symbol before a larger one subtracts (never repeating before a larger symbol, e.g. IL is not 49, it is XLIX).',
    chart: (() => {
      const T = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
      const toRoman = (n) => {
        let out = '';
        let m = n;
        for (const [val, sym] of T) while (m >= val) { out += sym; m -= val; }
        return out;
      };
      return Array.from({ length: 100 }, (_, i) => [String(i + 1), toRoman(i + 1)]);
    })(),
  },

  addition: {
    title: 'Addition table',
    blurb: 'Sums from 0 to 12.',
    size: 12,
    rows: Array.from({ length: 13 }, (_, i) =>
      Array.from({ length: 13 }, (_, j) => i + j)),
  },

  logarithms: {
    title: 'Logarithm tables',
    blurb: 'log₁₀(x) and ln(x) for x = 1 to 20 and the key powers of ten.',
    rows: [
      ...Array.from({ length: 20 }, (_, i) => i + 1),
      25, 30, 40, 50, 75, 100, 1000, 10000,
    ].map((x) => [String(x), Math.log10(x).toFixed(6), Math.log(x).toFixed(6)]),
  },

  temperatures: {
    title: 'Temperature conversion chart',
    blurb: '°C and °F for common bench-top values.',
    rows: [
      ['−273.15', '−460', 'Absolute zero'],
      ['−100', '−148', 'Nowhere on Earth — ever'],
      ['−40', '−40', '°C = °F — the two scales cross here'],
      ['−20', '−4', 'Freezer interior'],
      ['0', '32', 'Water freezes'],
      ['10', '50', 'Cold room'],
      ['20', '68', 'Comfortable office'],
      ['25', '77', 'Warm room / IC junction nominal'],
      ['30', '86', 'Room at 30 °C'],
      ['37', '98.6', 'Human body temperature'],
      ['40', '104', 'Very hot'],
      ['50', '122', 'CPU hotspot'],
      ['60', '140', 'Boiling hot beverage once brewed'],
      ['70', '158', 'LED junction absolute max'],
      ['80', '176', 'Solder reflow zone'],
      ['100', '212', 'Water boils (sea level)'],
      ['125', '257', 'Lead-free solder paste melt point'],
      ['150', '302', 'PVC cable rating (typical)'],
      ['200', '392', 'Old-school solder iron tip'],
      ['300', '572', 'Hot water on a 600 °C element'],
      ['500', '932', 'Wood ignition temperature'],
    ],
  },

  altCodes: {
    title: 'Alt codes (Windows)',
    blurb: 'Press ALT and type the number on the numeric keypad — e.g. ALT+65 writes A. 0–31 are the control characters.',
    rows: [
    ['0', " "],
    ['1', "☺"],
    ['2', "☻"],
    ['3', "♥"],
    ['4', "♦"],
    ['5', "♣"],
    ['6', "♠"],
    ['7', "•"],
    ['8', "◘"],
    ['9', "○"],
    ['10', "◙"],
    ['11', "♂"],
    ['12', "♀"],
    ['13', "♪"],
    ['14', "♫"],
    ['15', "☼"],
    ['16', "►"],
    ['17', "◄"],
    ['18', "↕"],
    ['19', "‼"],
    ['20', "¶"],
    ['21', "§"],
    ['22', "▬"],
    ['23', "↨"],
    ['24', "↑"],
    ['25', "↓"],
    ['26', "→"],
    ['27', "←"],
    ['28', "∟"],
    ['29', "↔"],
    ['30', "▲"],
    ['31', "▼"],
    ['32', " "],
    ['33', "!"],
    ['34', "\""],
    ['35', "#"],
    ['36', "$"],
    ['37', "%"],
    ['38', "&"],
    ['39', "'"],
    ['40', "("],
    ['41', ")"],
    ['42', "*"],
    ['43', "+"],
    ['44', ","],
    ['45', "-"],
    ['46', "."],
    ['47', "/"],
    ['48', "0"],
    ['49', "1"],
    ['50', "2"],
    ['51', "3"],
    ['52', "4"],
    ['53', "5"],
    ['54', "6"],
    ['55', "7"],
    ['56', "8"],
    ['57', "9"],
    ['58', ":"],
    ['59', ";"],
    ['60', "<"],
    ['61', "="],
    ['62', ">"],
    ['63', "?"],
    ['64', "@"],
    ['65', "A"],
    ['66', "B"],
    ['67', "C"],
    ['68', "D"],
    ['69', "E"],
    ['70', "F"],
    ['71', "G"],
    ['72', "H"],
    ['73', "I"],
    ['74', "J"],
    ['75', "K"],
    ['76', "L"],
    ['77', "M"],
    ['78', "N"],
    ['79', "O"],
    ['80', "P"],
    ['81', "Q"],
    ['82', "R"],
    ['83', "S"],
    ['84', "T"],
    ['85', "U"],
    ['86', "V"],
    ['87', "W"],
    ['88', "X"],
    ['89', "Y"],
    ['90', "Z"],
    ['91', "["],
    ['92', "\\"],
    ['93', "]"],
    ['94', "^"],
    ['95', "_"],
    ['96', "`"],
    ['97', "a"],
    ['98', "b"],
    ['99', "c"],
    ['100', "d"],
    ['101', "e"],
    ['102', "f"],
    ['103', "g"],
    ['104', "h"],
    ['105', "i"],
    ['106', "j"],
    ['107', "k"],
    ['108', "l"],
    ['109', "m"],
    ['110', "n"],
    ['111', "o"],
    ['112', "p"],
    ['113', "q"],
    ['114', "r"],
    ['115', "s"],
    ['116', "t"],
    ['117', "u"],
    ['118', "v"],
    ['119', "w"],
    ['120', "x"],
    ['121', "y"],
    ['122', "z"],
    ['123', "{"],
    ['124', "|"],
    ['125', "}"],
    ['126', "~"],
    ['127', "⌂"],
    ['128', "Ç"],
    ['129', "ü"],
    ['130', "é"],
    ['131', "â"],
    ['132', "ä"],
    ['133', "à"],
    ['134', "å"],
    ['135', "ç"],
    ['136', "ê"],
    ['137', "ë"],
    ['138', "è"],
    ['139', "ï"],
    ['140', "î"],
    ['141', "ì"],
    ['142', "Ä"],
    ['143', "Å"],
    ['144', "É"],
    ['145', "æ"],
    ['146', "Æ"],
    ['147', "ô"],
    ['148', "ö"],
    ['149', "ò"],
    ['150', "û"],
    ['151', "ù"],
    ['152', "ÿ"],
    ['153', "Ö"],
    ['154', "Ü"],
    ['155', "¢"],
    ['156', "£"],
    ['157', "¥"],
    ['158', "₧"],
    ['159', "ƒ"],
    ['160', "á"],
    ['161', "í"],
    ['162', "ó"],
    ['163', "ú"],
    ['164', "ñ"],
    ['165', "Ñ"],
    ['166', "ª"],
    ['167', "º"],
    ['168', "¿"],
    ['169', "⌐"],
    ['170', "¬"],
    ['171', "½"],
    ['172', "¼"],
    ['173', "¡"],
    ['174', "«"],
    ['175', "»"],
    ['176', "░"],
    ['177', "▒"],
    ['178', "▓"],
    ['179', "│"],
    ['180', "┤"],
    ['181', "╡"],
    ['182', "╢"],
    ['183', "╖"],
    ['184', "╕"],
    ['185', "╣"],
    ['186', "║"],
    ['187', "╗"],
    ['188', "╝"],
    ['189', "╜"],
    ['190', "╛"],
    ['191', "┐"],
    ['192', "└"],
    ['193', "┴"],
    ['194', "┬"],
    ['195', "├"],
    ['196', "─"],
    ['197', "┼"],
    ['198', "╞"],
    ['199', "╟"],
    ['200', "╚"],
    ['201', "╔"],
    ['202', "╩"],
    ['203', "╦"],
    ['204', "╠"],
    ['205', "═"],
    ['206', "╬"],
    ['207', "╧"],
    ['208', "╨"],
    ['209', "╤"],
    ['210', "╥"],
    ['211', "╙"],
    ['212', "╘"],
    ['213', "╒"],
    ['214', "╓"],
    ['215', "╫"],
    ['216', "╪"],
    ['217', "┘"],
    ['218', "┌"],
    ['219', "█"],
    ['220', "▄"],
    ['221', "▌"],
    ['222', "▐"],
    ['223', "▀"],
    ['224', "α"],
    ['225', "ß"],
    ['226', "Γ"],
    ['227', "π"],
    ['228', "Σ"],
    ['229', "σ"],
    ['230', "µ"],
    ['231', "τ"],
    ['232', "Φ"],
    ['233', "Θ"],
    ['234', "Ω"],
    ['235', "δ"],
    ['236', "∞"],
    ['237', "φ"],
    ['238', "ε"],
    ['239', "∩"],
    ['240', "≡"],
    ['241', "±"],
    ['242', "≥"],
    ['243', "≤"],
    ['244', "⌠"],
    ['245', "⌡"],
    ['246', "÷"],
    ['247', "≈"],
    ['248', "°"],
    ['249', "∙"],
    ['250', "⋅"],
    ['251', "√"],
    ['252', "ⁿ"],
    ['253', "²"],
    ['254', "■"],
    ['255', "  "],
    ],
  },

  named: {
    title: 'Named colours',
    blurb: 'The CSS named colours — hex, RGB and HSL for every entry.',
    rows: NAMED_COLOURS.map(namedRgbHsl),
  },

  webSafe: {
    title: 'Web-safe palette',
    blurb: '216 colours every channel can render — the old 6×6×6 palette, safe to use today.',
    rows: WEB_SAFE,
  },
};

/* ── component and symbol glossary used by the symbols page ────────────── */

export const COMPONENTS = [
  { name: 'Resistor', sym: 'R', unit: 'ohm (Ω)', does: 'Limits current. Converts electrical energy to heat.', tool: 'resistor-color' },
  { name: 'Capacitor', sym: 'C', unit: 'farad (F)', does: 'Stores charge in an electric field. Blocks DC, passes AC.', tool: null },
  { name: 'Inductor', sym: 'L', unit: 'henry (H)', does: 'Stores energy in a magnetic field. Passes DC, blocks AC.', tool: null },
  { name: 'Diode', sym: '—', unit: '—', does: 'Allows current to flow in one direction only.', tool: null },
  { name: 'LED', sym: '—', unit: '—', does: 'A diode that emits light when forward-biased.', tool: null },
  { name: 'Transistor', sym: 'Q', unit: '—', does: 'Current-controlled switch. Amplifies or switches.', tool: null },
  { name: 'MOSFET', sym: 'Q', unit: '—', does: 'Voltage-controlled switch. Efficient for high current.', tool: null },
  { name: 'Fuse', sym: '—', unit: 'ampere (A)', does: 'Melts and opens the circuit when current exceeds its rating.', tool: null },
  { name: 'Switch', sym: 'S', unit: '—', does: 'Opens or closes a path, usually under operator control.', tool: null },
  { name: 'SPDT switch', sym: 'S', unit: '—', does: 'One common pole routed to either of two throws — a changeover selector.', tool: null },
  { name: 'Pushbutton (NO)', sym: 'S', unit: '—', does: 'Momentary — closes only while pressed; front-panel button of choice.', tool: null },
  { name: 'Pushbutton (NC)', sym: 'S', unit: '—', does: 'Momentary normally-closed — opens only while pressed; the machine stop button.', tool: null },
  { name: 'DIP switch', sym: 'SW', unit: '—', does: 'A bank of tiny switches in one dual-in-line package. Fitted once rather than flipped every day, used for addressing and configuration on boards.', tool: null },
  { name: 'Solder bridge', sym: 'JP', unit: '0 Ω', does: 'A deliberate solder dot joining two pads — a zero-cost jumper for variant selection. Remove it with solder wick to change configuration.', tool: null },
  { name: 'Jumper', sym: 'JP', unit: '0 Ω', does: 'A removable link across adjacent pins on a header, configuring the board.', tool: null },
  { name: 'Potentiometer', sym: 'RV', unit: 'ohm (Ω)', does: 'A variable divider — a resistor with an adjustable tap.', tool: null },
  { name: 'Trimmer resistor', sym: 'RV', unit: 'ohm (Ω)', does: 'Small preset resistor set once at factory or service time.', tool: null },
  { name: 'Thermistor', sym: 'RT', unit: 'resistance varies', does: 'Resistor whose resistance changes with temperature — used for sensing and inrush protection.', tool: null },
  { name: 'Relay coil', sym: '—', unit: '—', does: 'Electromagnet that mechanically switches a separate contact set.', tool: null },
  { name: 'Lamp', sym: '—', unit: '—', does: 'Converts electrical energy to light and heat.', tool: null },
  { name: 'Thyristor (SCR)', sym: 'T', unit: '—', does: 'Latching semiconductor — stays on until the current drops below a threshold.', tool: null },
  { name: 'Operational amplifier', sym: 'U', unit: '—', does: 'High-gain differential amplifier; the workhorse of analog design.', tool: null },
  { name: 'Optocoupler', sym: 'U', unit: '—', does: 'Isolated signal coupling via LED and photodiode — no galvanic path.', tool: null },
  { name: 'Crystal oscillator', sym: 'X', unit: '—', does: 'Piezoelectric frequency reference for precise clocks.', tool: null },
  { name: 'Transformer', sym: 'T', unit: '—', does: 'Coupled inductor — transfers AC power through a magnetic field, stepping voltage.', tool: null },
  { name: 'Bridge rectifier', sym: '—', unit: '—', does: 'Four-diode diamond converting AC to full-wave pulsating DC.', tool: null },
  { name: 'Ammeter', sym: 'A', unit: 'ampere (A)', does: 'Measures current; connected in series so it carries the branch current (low internal resistance).', tool: 'current-power' },
  { name: 'Voltmeter', sym: 'V', unit: 'volt (V)', does: 'Measures potential difference; connected in parallel across the component (high internal resistance).', tool: 'ohms-law' },
  { name: 'Ohmmeter', sym: 'Ω', unit: 'ohm (Ω)', does: 'Measures resistance with its own test source; the circuit under test must be de-energised.', tool: 'ohms-law' },
  { name: 'Wattmeter', sym: 'W', unit: 'watt (W)', does: 'Measures electrical power, typically using both voltage and current sensing.', tool: 'current-power' },
  { name: 'Buzzer', sym: 'BZ', unit: '—', does: 'Converts electrical energy to an audible tone for alerts and indicators.', tool: null },
  { name: 'Speaker', sym: 'LS', unit: '—', does: 'Converts an electrical audio signal into sound waves.', tool: null },
  { name: 'Microphone', sym: 'MIC', unit: '—', does: 'Converts sound pressure into an electrical signal.', tool: null },
  { name: 'Antenna', sym: 'ANT', unit: '—', does: 'Radiates or receives electromagnetic waves for wireless communication.', tool: null },
  { name: 'Motor', sym: 'M', unit: '—', does: 'Converts electrical energy into mechanical rotation or motion.', tool: null },
  { name: 'Generator', sym: 'G', unit: '—', does: 'Converts mechanical energy into electrical energy (the motor in reverse).', tool: null },
];
