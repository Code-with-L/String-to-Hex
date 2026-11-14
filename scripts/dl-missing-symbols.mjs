import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const base = path.join(process.cwd(), 'assets', 'symbols');
const map = JSON.parse(readFileSync(path.join(base, '_map.json'), 'utf8'));

// extra/better candidates
const extra = {
  inductorCore: ['https://upload.wikimedia.org/wikipedia/commons/3/3e/Inductor_with_iron_core.svg'],
  fet: ['https://upload.wikimedia.org/wikipedia/commons/6/62/IGFET_N-Ch_Enh_Labelled_simplified.svg','https://upload.wikimedia.org/wikipedia/commons/3/3c/IGFET_N-Ch_Enh.svg'],
  pushbuttonNo: ['https://upload.wikimedia.org/wikipedia/commons/3/3a/Pushbutton_make.svg','https://upload.wikimedia.org/wikipedia/commons/3/3e/Push-to-make_switch.svg'],
  pushbuttonNc: ['https://upload.wikimedia.org/wikipedia/commons/3/3f/Pushbutton_break.svg','https://upload.wikimedia.org/wikipedia/commons/1/1e/Push-to-break_switch.svg'],
  resistorPot: ['https://upload.wikimedia.org/wikipedia/commons/1/1c/Potentiometer_symbol_Europe.svg'],
  trimmer: ['https://upload.wikimedia.org/wikipedia/commons/1/1b/Trimmer_resistor.svg','https://upload.wikimedia.org/wikipedia/commons/2/2e/Trimmer_resistor_symbol_GOST.svg'],
  thermistor: ['https://upload.wikimedia.org/wikipedia/commons/0/09/Thermistor_symbol.svg','https://upload.wikimedia.org/wikipedia/commons/8/8c/Thermistor.svg'],
  dipSwitch: ['https://upload.wikimedia.org/wikipedia/commons/7/7d/DIP_switch_symbol.svg'],
  solderBridge: ['https://upload.wikimedia.org/wikipedia/commons/4/4e/Solder_bridge_closed.svg'],
  relayCoil: ['https://upload.wikimedia.org/wikipedia/commons/8/8a/Relay_coil_symbol.svg','https://upload.wikimedia.org/wikipedia/commons/7/7b/Relay_coil.svg'],
  relaySpdt: ['https://upload.wikimedia.org/wikipedia/commons/8/8a/Relay_symbols.svg'],
  thyristor: ['https://upload.wikimedia.org/wikipedia/commons/3/3d/Thyristor_circuit_symbol.svg'],
  optocoupler: ['https://upload.wikimedia.org/wikipedia/commons/1/1a/Opto-isolator.svg'],
  crystal: ['https://upload.wikimedia.org/wikipedia/commons/6/6a/Crystal-oscillator.svg','https://upload.wikimedia.org/wikipedia/commons/3/3a/Crystal_symbol.svg'],
  bridgeRectifier: ['https://upload.wikimedia.org/wikipedia/commons/6/6c/Diode_bridge.svg','https://upload.wikimedia.org/wikipedia/commons/3/3f/Bridge_rectifier.svg'],
  ammeter: ['https://upload.wikimedia.org/wikipedia/commons/d/d0/Ammeter_symbol.svg'],
  voltmeter: ['https://upload.wikimedia.org/wikipedia/commons/1/1c/Voltmeter_symbol.svg'],
  ohmmeter: ['https://upload.wikimedia.org/wikipedia/commons/3/3f/Ohmmeter_symbol.svg'],
  wattmeter: ['https://upload.wikimedia.org/wikipedia/commons/7/7e/Wattmeter_symbol.svg'],
  buzzer: ['https://upload.wikimedia.org/wikipedia/commons/5/5c/Buzzer-IEC-Symbol.svg'],
  speaker: ['https://upload.wikimedia.org/wikipedia/commons/2/21/Loudspeaker.svg','https://upload.wikimedia.org/wikipedia/commons/2/2b/Loudspeaker_symbol.svg'],
  microphone: ['https://upload.wikimedia.org/wikipedia/commons/4/4e/Mic-IEC-Symbol.svg','https://upload.wikimedia.org/wikipedia/commons/5/5a/Microphone_symbol.svg'],
  motor: ['https://upload.wikimedia.org/wikipedia/commons/f/f9/Motor_Symbol.svg','https://upload.wikimedia.org/wikipedia/commons/8/89/Motor_symbol.svg'],
  generator: ['https://upload.wikimedia.org/wikipedia/commons/0/0a/Generator_symbol.svg'],
  wire: ['https://upload.wikimedia.org/wikipedia/commons/0/0b/Wire_symbol.svg','https://upload.wikimedia.org/wikipedia/commons/8/86/Conductor_symbol.svg'],
  lamp: ['https://upload.wikimedia.org/wikipedia/commons/3/3a/Lamp_symbol.svg'],
  fuse: ['https://upload.wikimedia.org/wikipedia/commons/c/cb/Fuse_symbol.svg','https://upload.wikimedia.org/wikipedia/commons/3/3b/Fuse_symbol_Europe.svg'],
  dcSource: ['https://upload.wikimedia.org/wikipedia/commons/2/2c/Voltage_Source_%28DC%29.svg','https://upload.wikimedia.org/wikipedia/commons/3/3b/Voltage_Source.svg'],
};
for (const [k,v] of Object.entries(extra)) if (map[k]) map[k].candidates = [...new Set([...(v||[]), ...(map[k].candidates||[])])];

const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
let ok=0, fail=[];
for (const [key, info] of Object.entries(map)) {
  const out = path.join(base, info.file);
  if (existsSync(out) && (readFileSync(out).length > 100 || info.file === 'resistor.svg')) { ok++; continue; }
  let done=false;
  for (const url of info.candidates||[]) {
    try {
      execFileSync('curl.exe', ['-fsSL','-A','HexKit/1.0 (https://github.com/Code-with-L/String-to-Hex)','-o', out, url], {stdio:'ignore'});
      if (existsSync(out) && readFileSync(out).length>50) { ok++; done=true; console.log('ok',key); break; }
    } catch {}
    try { if(existsSync(out)) require('fs').unlinkSync(out);} catch{}
    sleep(800);
  }
  if(!done) fail.push(key);
  sleep(1200);
}
console.log('summary ok='+ok+' fail='+fail.length);
console.log(fail.join(','));
