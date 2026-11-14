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
  { name: 'DIP switch', sym: 'SW', unit: '—', does: 'A bank of tiny switches in one dual-in-line package. Fitted once rather than flipped every day, used for addressing and configuration on boards.', tool: null },
  { name: 'Solder bridge', sym: 'JP', unit: '0 Ω', does: 'A deliberate solder dot joining two pads — a zero-cost jumper for variant selection. Remove it with solder wick to change configuration.', tool: null },
  { name: 'Jumper', sym: 'JP', unit: '0 Ω', does: 'A removable link across adjacent pins on a header, configuring the board.', tool: null },
  { name: 'Potentiometer', sym: 'RV', unit: 'ohm (Ω)', does: 'A variable divider — a resistor with an adjustable tap.', tool: null },
  { name: 'Relay coil', sym: '—', unit: '—', does: 'Electromagnet that mechanically switches a separate contact set.', tool: null },
  { name: 'Lamp', sym: '—', unit: '—', does: 'Converts electrical energy to light and heat.', tool: null },
];
