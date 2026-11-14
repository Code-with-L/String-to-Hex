import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { SYMBOLS } from '../js/data/symbols.js';

const base = path.join(process.cwd(), 'assets', 'symbols');
const extra = {
  inductorCore: [
    'https://upload.wikimedia.org/wikipedia/commons/3/3e/Inductor_with_iron_core.svg',
    'https://upload.wikimedia.org/wikipedia/commons/1/1f/Inductor_with_core.svg',
  ],
  pushbuttonNo: [
    'https://upload.wikimedia.org/wikipedia/commons/3/3a/Pushbutton_make.svg',
    'https://upload.wikimedia.org/wikipedia/commons/4/4f/Switch_push.svg',
  ],
  pushbuttonNc: [
    'https://upload.wikimedia.org/wikipedia/commons/3/3f/Pushbutton_break.svg',
  ],
  relaySpdt: [
    'https://upload.wikimedia.org/wikipedia/commons/8/8a/Relay_symbols.svg',
  ],
  ground: ['https://upload.wikimedia.org/wikipedia/commons/5/5b/Signal_Ground.svg'],
  groundEarth: ['https://upload.wikimedia.org/wikipedia/commons/2/2f/Earth_Ground.svg'],
  dcSource: ['https://upload.wikimedia.org/wikipedia/commons/2/2c/Voltage_Source_%28DC%29.svg','https://upload.wikimedia.org/wikipedia/commons/3/3b/Voltage_Source.svg'],
  acSource: ['https://upload.wikimedia.org/wikipedia/commons/5/5e/AC_voltage_source.svg'],
  lamp: ['https://upload.wikimedia.org/wikipedia/commons/3/3a/Lamp_symbol.svg'],
  wire: ['https://upload.wikimedia.org/wikipedia/commons/0/0b/Wire_symbol.svg','https://upload.wikimedia.org/wikipedia/commons/8/86/Conductor_symbol.svg'],
  trimmer: ['https://upload.wikimedia.org/wikipedia/commons/1/1b/Trimmer_resistor.svg'],
  thermistor: ['https://upload.wikimedia.org/wikipedia/commons/0/09/Thermistor_symbol.svg'],
  dipSwitch: ['https://upload.wikimedia.org/wikipedia/commons/7/7d/DIP_switch_symbol.svg'],
  solderBridge: ['https://upload.wikimedia.org/wikipedia/commons/4/4e/Solder_bridge_closed.svg'],
  relayCoil: ['https://upload.wikimedia.org/wikipedia/commons/8/8a/Relay_coil_symbol.svg'],
  thyristor: ['https://upload.wikimedia.org/wikipedia/commons/3/3d/Thyristor_circuit_symbol.svg'],
  opAmp: ['https://upload.wikimedia.org/wikipedia/commons/9/97/Op-amp_symbol.svg'],
  optocoupler: ['https://upload.wikimedia.org/wikipedia/commons/1/1a/Opto-isolator.svg'],
  crystal: ['https://upload.wikimedia.org/wikipedia/commons/6/6a/Crystal-oscillator.svg','https://upload.wikimedia.org/wikipedia/commons/3/3a/Crystal_symbol.svg'],
  transformer: ['https://upload.wikimedia.org/wikipedia/commons/1/17/Transformer_Symbol.svg'],
  bridgeRectifier: ['https://upload.wikimedia.org/wikipedia/commons/6/6c/Diode_bridge.svg'],
  ammeter: ['https://upload.wikimedia.org/wikipedia/commons/d/d0/Ammeter_symbol.svg'],
  voltmeter: ['https://upload.wikimedia.org/wikipedia/commons/1/1c/Voltmeter_symbol.svg'],
  ohmmeter: ['https://upload.wikimedia.org/wikipedia/commons/3/3f/Ohmmeter_symbol.svg'],
  wattmeter: ['https://upload.wikimedia.org/wikipedia/commons/7/7e/Wattmeter_symbol.svg'],
  buzzer: ['https://upload.wikimedia.org/wikipedia/commons/5/5c/Buzzer-IEC-Symbol.svg'],
  speaker: ['https://upload.wikimedia.org/wikipedia/commons/2/21/Loudspeaker.svg'],
  microphone: ['https://upload.wikimedia.org/wikipedia/commons/4/4e/Mic-IEC-Symbol.svg'],
  antenna: ['https://upload.wikimedia.org/wikipedia/commons/4/4f/Antenna_symbol.svg'],
  motor: ['https://upload.wikimedia.org/wikipedia/commons/f/f9/Motor_Symbol.svg'],
  generator: ['https://upload.wikimedia.org/wikipedia/commons/0/0a/Generator_symbol.svg'],
};
const sleep = (ms)=>Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,ms);
let ok=0, fail=[];
for (const [key,s] of Object.entries(SYMBOLS)) {
  const out = path.join(base, s.file);
  if (existsSync(out) && statSync(out).size>50) { ok++; continue; }
  const cands = extra[key] || [];
  let done=false;
  for (const url of cands) {
    try {
      execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0','--max-time','20','-o',out,url],{stdio:'ignore'});
      if (existsSync(out) && statSync(out).size>50){ ok++; done=true; console.log('ok',key); break; }
    } catch {}
    try{fs.rmSync(out)}catch{}
    sleep(600);
  }
  if(!done) fail.push(key);
  sleep(1000);
}
console.log('ok='+ok+' fail='+fail.length, fail.join(','));
