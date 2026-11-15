import fs from 'fs';

const refPath = 'js/data/reference.js';
let src = fs.readFileSync(refPath, 'utf8');
const HEX = 'C:\\Users\\leon2\\Documents\\Open Code\\hex';
const files = fs.readdirSync(HEX).filter(f => f.endsWith('.html')).map(f=>f.replace(/\.html$/,''));

const fmt = (x, d=6) => { let s = Number(x).toFixed(d); s = s.replace(/\.?0+$/,''); if(s==='-0') s='0'; return s||'0'; };
const has = (slug) => src.includes(`'${slug}': {`);
const articles = [];

function addConv(slug, title, kicker, summary, def, formulas, examples, note, tool=null) {
  if (has(slug)) return;
  const blocks = [
    { k: 'definition', t: def },
    { k: 'h3', t: 'Conversion formula' },
    ...formulas.map(eq => ({ k: 'formula', eq })),
    { k: 'h3', t: 'Examples' },
    ...examples.map(eq => ({ k: 'formula', eq })),
  ];
  if (note) blocks.push({ k: 'callout', icon: 'info', t: note });
  articles.push(`  '${slug}': ${JSON.stringify({ title, kicker, summary, tool, blocks }, null, 2).replace(/^/gm,'  ').trimStart()}`);
}

const defs = [
  // Frequency
  ['hz-to-khz','Hertz to Kilohertz','Frequency conversion','Convert Hz to kHz.','Hertz (Hz) and kilohertz (kHz) measure frequency. 1 kHz = 1000 Hz.',['kHz = Hz / 1000'],['1000 Hz = 1 kHz','500 Hz = 0.5 kHz','20000 Hz = 20 kHz'],'Divide hertz by 1000 to get kilohertz.'],
  ['khz-to-hz','Kilohertz to Hertz','Frequency conversion','Convert kHz to Hz.','1 kHz = 1000 Hz.',['Hz = kHz × 1000'],['1 kHz = 1000 Hz','2.5 kHz = 2500 Hz','20 kHz = 20000 Hz'],'Multiply kilohertz by 1000 to get hertz.'],
  ['hz-to-mhz','Hertz to Megahertz','Frequency conversion','Convert Hz to MHz.','1 MHz = 1,000,000 Hz.',['MHz = Hz / 1,000,000'],['1000000 Hz = 1 MHz','500000 Hz = 0.5 MHz','2400000000 Hz = 2400 MHz'],'Divide hertz by 1,000,000 to get megahertz.'],
  ['mhz-to-hz','Megahertz to Hertz','Frequency conversion','Convert MHz to Hz.','1 MHz = 1,000,000 Hz.',['Hz = MHz × 1,000,000'],['1 MHz = 1000000 Hz','2.4 MHz = 2400000 Hz','100 MHz = 100000000 Hz'],'Multiply megahertz by 1,000,000 to get hertz.'],
  ['khz-to-mhz','Kilohertz to Megahertz','Frequency conversion','Convert kHz to MHz.','1 MHz = 1000 kHz.',['MHz = kHz / 1000'],['1000 kHz = 1 MHz','500 kHz = 0.5 MHz','2400 kHz = 2.4 MHz'],'Divide kilohertz by 1000 to get megahertz.'],
  ['mhz-to-khz','Megahertz to Kilohertz','Frequency conversion','Convert MHz to kHz.','1 MHz = 1000 kHz.',['kHz = MHz × 1000'],['1 MHz = 1000 kHz','2.4 MHz = 2400 kHz','0.5 MHz = 500 kHz'],'Multiply megahertz by 1000 to get kilohertz.'],
  ['ghz-to-hz','Gigahertz to Hertz','Frequency conversion','Convert GHz to Hz.','1 GHz = 1,000,000,000 Hz.',['Hz = GHz × 1,000,000,000'],['1 GHz = 1000000000 Hz','2.4 GHz = 2400000000 Hz','5 GHz = 5000000000 Hz'],'Multiply gigahertz by 1,000,000,000 to get hertz.'],
  ['hz-to-ghz','Hertz to Gigahertz','Frequency conversion','Convert Hz to GHz.','1 GHz = 1,000,000,000 Hz.',['GHz = Hz / 1,000,000,000'],['1000000000 Hz = 1 GHz','2400000000 Hz = 2.4 GHz','5000000000 Hz = 5 GHz'],'Divide hertz by 1,000,000,000 to get gigahertz.'],
  ['ghz-to-mhz','Gigahertz to Megahertz','Frequency conversion','Convert GHz to MHz.','1 GHz = 1000 MHz.',['MHz = GHz × 1000'],['1 GHz = 1000 MHz','2.4 GHz = 2400 MHz','5 GHz = 5000 MHz'],'Multiply gigahertz by 1000 to get megahertz.'],
  ['mhz-to-ghz','Megahertz to Gigahertz','Frequency conversion','Convert MHz to GHz.','1 GHz = 1000 MHz.',['GHz = MHz / 1000'],['1000 MHz = 1 GHz','2400 MHz = 2.4 GHz','500 MHz = 0.5 GHz'],'Divide megahertz by 1000 to get gigahertz.'],

  // Electrical base
  ['amp-to-watt','Amps to Watts','Electrical conversion','Convert current (A) and voltage (V) to power (W).','Power depends on current and voltage (and power factor for AC).',['P(W) = I(A) × V(V) (DC)','P(W) = PF × I(A) × V(V) (AC)'],['1 A × 120 V = 120 W (DC/resistive)','2 A × 230 V = 460 W (PF 1)','5 A × 12 V = 60 W'],'Multiply amps by volts (and PF for AC) to get watts.','current-power'],
  ['watt-to-amp','Watts to Amps','Electrical conversion','Convert power (W) and voltage (V) to current (A).','Current depends on power, voltage, and power factor for AC.',['I(A) = P(W) / V(V) (DC)','I(A) = P(W) / (PF × V(V)) (AC)'],['120 W / 120 V = 1 A','800 W / 12 V = 66.667 A','800 W / (0.8 × 120 V) = 8.333 A'],'Divide watts by volts (and PF for AC) to get amps.','current-power'],
  ['amp-to-volt','Amps to Volts','Electrical conversion','Convert current and resistance/power to voltage.','Voltage can be found from current and resistance (Ohm’s law) or from power.',['V = I × R','V = P / I'],['2 A × 10 Ω = 20 V','120 W / 2 A = 60 V','5 A × 12 Ω = 60 V'],'Use V = I×R or V = P/I depending on known values.','ohms-law'],
  ['volt-to-amp','Volts to Amps','Electrical conversion','Convert voltage and resistance/power to current.','Current can be found from voltage and resistance or from power.',['I = V / R','I = P / V'],['12 V / 6 Ω = 2 A','120 W / 120 V = 1 A','230 V / 46 Ω = 5 A'],'Use I = V/R or I = P/V depending on known values.','ohms-law'],
  ['volt-to-watt','Volts to Watts','Electrical conversion','Convert voltage and current to power.','Power is voltage times current (times PF for AC).',['P = V × I (DC)','P = PF × V × I (AC)'],['120 V × 2 A = 240 W','230 V × 5 A = 1150 W','12 V × 10 A = 120 W'],'Multiply volts by amps to get watts.','current-power'],
  ['watt-to-volt','Watts to Volts','Electrical conversion','Convert power and current to voltage.','Voltage can be found from power and current.',['V = P / I'],['120 W / 1 A = 120 V','1000 W / 10 A = 100 V','60 W / 5 A = 12 V'],'Divide watts by amps to get volts.','ohms-law'],
  ['ohm-to-amp','Ohms to Amps','Electrical conversion','Relate resistance to current using voltage or power.','Current depends on voltage or power as well as resistance.',['I = V / R','I = √(P / R)'],['12 V / 6 Ω = 2 A','100 W / 25 Ω → I = 2 A','230 V / 46 Ω = 5 A'],'Use Ohm’s law: I = V/R (or I = √(P/R)).','ohms-law'],
  ['amp-to-ohm','Amps to Ohms','Electrical conversion','Relate current to resistance using voltage or power.','Resistance can be found from voltage and current or from power and current.',['R = V / I','R = P / I²'],['12 V / 2 A = 6 Ω','100 W / (2 A)² = 25 Ω','230 V / 5 A = 46 Ω'],'Use R = V/I or R = P/I².','ohms-law'],
  ['va-to-watt','VA to Watts','Electrical conversion','Convert apparent power (VA) to real power (W).','Real power equals apparent power times power factor.',['W = VA × PF'],['1000 VA × 1 = 1000 W','1000 VA × 0.8 = 800 W','500 VA × 0.9 = 450 W'],'Multiply VA by power factor to get watts.','power-factor'],
  ['watt-to-va','Watts to VA','Electrical conversion','Convert real power (W) to apparent power (VA).','Apparent power equals real power divided by power factor.',['VA = W / PF'],['800 W / 0.8 = 1000 VA','1000 W / 1 = 1000 VA','450 W / 0.9 = 500 VA'],'Divide watts by power factor to get VA.','power-factor'],
  ['kva-to-kw','kVA to kW','Electrical conversion','Convert apparent power (kVA) to real power (kW).','Real power equals apparent power times power factor.',['kW = kVA × PF'],['10 kVA × 0.8 = 8 kW','5 kVA × 1 = 5 kW','100 kVA × 0.9 = 90 kW'],'Multiply kVA by power factor to get kW.','power-factor'],
  ['kw-to-kva','kW to kVA','Electrical conversion','Convert real power (kW) to apparent power (kVA).','Apparent power equals real power divided by power factor.',['kVA = kW / PF'],['8 kW / 0.8 = 10 kVA','5 kW / 1 = 5 kVA','90 kW / 0.9 = 100 kVA'],'Divide kW by power factor to get kVA.','power-factor'],
  ['kva-to-amp','kVA to Amps','Electrical conversion','Convert kVA to amps given voltage and phase.','Current depends on kVA, voltage, and whether the system is single-phase or three-phase.',['I = (kVA × 1000) / V (single-phase)','I = (kVA × 1000) / (√3 × V) (three-phase)'],['10 kVA / 230 V ≈ 43.478 A (1φ)','10 kVA / (1.732 × 400 V) ≈ 14.434 A (3φ)','5 kVA / 120 V ≈ 41.667 A (1φ)'],'Use the appropriate formula for single-phase or three-phase systems.','three-phase'],
  ['amp-to-kva','Amps to kVA','Electrical conversion','Convert amps to kVA given voltage and phase.','Apparent power depends on current, voltage, and phase configuration.',['kVA = (I × V) / 1000 (single-phase)','kVA = (√3 × I × V) / 1000 (three-phase)'],['43.478 A × 230 V / 1000 ≈ 10 kVA (1φ)','14.434 A × 1.732 × 400 V / 1000 ≈ 10 kVA (3φ)','10 A × 120 V / 1000 = 1.2 kVA (1φ)'],'Use the appropriate formula for single-phase or three-phase systems.','three-phase'],

  // How-to common
  ['how-binary-to-decimal','How to Convert Binary to Decimal','Number conversion','Convert binary numbers to decimal.','Binary is base 2; each digit represents a power of two.',['Decimal = Σ (bit × 2^position)'],['1010₂ = 10₁₀','1111₂ = 15₁₀','10000000₂ = 128₁₀'],'Sum the powers of two for each 1 bit.'],
  ['how-decimal-to-binary','How to Convert Decimal to Binary','Number conversion','Convert decimal numbers to binary.','Divide the number by 2 repeatedly and read remainders in reverse order.',['Binary = remainders of successive division by 2 (reverse order)'],['10₁₀ = 1010₂','15₁₀ = 1111₂','255₁₀ = 11111111₂'],'Use repeated division by 2.'],
  ['how-decimal-to-hex','How to Convert Decimal to Hexadecimal','Number conversion','Convert decimal numbers to hexadecimal.','Hexadecimal is base 16 (digits 0-9 and A-F).',['Hex = remainders of successive division by 16 (reverse order)'],['255₁₀ = FF₁₆','4096₁₀ = 1000₁₆','26₁₀ = 1A₁₆'],'Divide by 16 repeatedly and map remainders 10-15 to A-F.'],
  ['how-hex-to-decimal','How to Convert Hexadecimal to Decimal','Number conversion','Convert hexadecimal numbers to decimal.','Each hex digit represents a power of 16.',['Decimal = Σ (digit × 16^position)'],['FF₁₆ = 255₁₀','1A₁₆ = 26₁₀','100₁₆ = 256₁₀'],'Sum digit values times powers of 16.'],
  ['how-binary-to-hex','How to Convert Binary to Hexadecimal','Number conversion','Convert binary to hexadecimal.','Group binary bits in sets of four (from right) and map each group to a hex digit.',['1 hex digit = 4 binary bits'],['1010₂ = A₁₆','11111111₂ = FF₁₆','11010110₂ = D6₁₆'],'Group bits into nibbles and convert each nibble.'],
  ['how-hex-to-binary','How to Convert Hexadecimal to Binary','Number conversion','Convert hexadecimal to binary.','Convert each hex digit to a 4-bit binary group.',['1 hex digit = 4 binary bits'],['A₁₆ = 1010₂','FF₁₆ = 11111111₂','2F₁₆ = 00101111₂'],'Expand each hex digit into four bits.'],
  ['how-celsius-to-fahrenheit','How to Convert Celsius to Fahrenheit','Temperature conversion','Convert Celsius to Fahrenheit.','Multiply Celsius by 9/5 and add 32.',['°F = °C × 9/5 + 32'],['0°C = 32°F','100°C = 212°F','25°C = 77°F'],'Use °F = °C × 1.8 + 32.'],
  ['how-fahrenheit-to-celsius','How to Convert Fahrenheit to Celsius','Temperature conversion','Convert Fahrenheit to Celsius.','Subtract 32 from Fahrenheit and multiply by 5/9.',['°C = (°F − 32) × 5/9'],['32°F = 0°C','212°F = 100°C','77°F = 25°C'],'Use °C = (°F − 32) / 1.8.'],
];

for (const d of defs) addConv(...d);

if (articles.length === 0) { console.log('nothing to add'); process.exit(0); }
const slugIdx = src.indexOf('\nexport const ARTICLE_SLUGS = Object.keys(ARTICLES);');
const articlesEnd = src.lastIndexOf('\n};', slugIdx);
const beforeClose = src.slice(0, articlesEnd).replace(/\s+$/, '');
const prefix = beforeClose.endsWith(',') ? '\n' : ',\n';
src = src.slice(0, articlesEnd) + prefix + articles.join(',\n') + ',\n' + src.slice(articlesEnd);
fs.writeFileSync(refPath, src);
console.log('added', articles.length, 'articles');
