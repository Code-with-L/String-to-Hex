import { execFileSync } from 'node:child_process';
import { existsSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { SYMBOLS } from '../js/data/symbols.js';

const base = path.join(process.cwd(), 'assets', 'symbols');
const sleep = (ms)=>Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,ms);

const titleMap = {
  inductorCore: ['Inductor with iron core.svg','Inductor core.svg','Iron-core inductor.svg'],
  pushbuttonNo: ['Pushbutton make.svg','Make switch.svg','IEEE 315 Contacts, Switches, Contactors, and Relays Symbols (76).svg','Switch - push-to-make - symbol.svg'],
  pushbuttonNc: ['Pushbutton break.svg','Break switch.svg','IEEE 315 Contacts, Switches, Contactors, and Relays Symbols (77).svg','Switch - push-to-break - symbol.svg'],
  relaySpdt: ['Relay symbols.svg','SPDT relay symbol.svg','Relay-IEC.svg','Relay principle horizontal.jpg'],
  ground: ['Signal Ground.svg','Earth Ground.svg'],
  groundEarth: ['Earth Ground.svg','Protective Earth.svg','Protective earth ground.svg'],
  dcSource: ['Voltage Source (DC).svg','Voltage source DC.svg','Voltage Source.svg','Battery symbol.svg'],
  acSource: ['AC voltage source.svg','Voltage Source (AC).svg'],
  lamp: ['Lamp symbol.svg','Lamp.svg','Lamp symbol, old.svg','Bulb symbol.svg'],
  wire: ['Wire symbol.svg','Conductor symbol.svg','Line symbol.svg'],
  trimmer: ['Trimmer resistor.svg','Trimmer symbol.svg','Preset resistor.svg','Variable resistor symbol.svg'],
  thermistor: ['Thermistor symbol.svg','Thermistor.svg','NTC thermistor symbol.svg'],
  dipSwitch: ['DIP switch symbol.svg','DIP switch.svg','DIP symbol.svg'],
  solderBridge: ['Solder bridge closed.svg','Solder bridge.svg','Solder jumper.svg'],
  relayCoil: ['Relay coil symbol.svg','Relay coil.svg','Relay-IEC.svg'],
  thyristor: ['Thyristor circuit symbol.svg','Thyristor symbol.svg','SCR symbol.svg','Thyristor.svg'],
  opAmp: ['Op-amp symbol.svg','Operational amplifier.svg','Opamp.svg'],
  optocoupler: ['Opto-isolator.svg','Optocoupler symbol.svg','Optoisolator.svg','Optocoupler.svg'],
  crystal: ['Crystal-oscillator.svg','Crystal oscillator symbol.svg','Crystal symbol.svg','Crystal.svg'],
  transformer: ['Transformer Symbol.svg','Transformer symbol.svg','Transformer.svg','Transformer Iron Core.svg'],
  bridgeRectifier: ['Diode bridge.svg','Bridge rectifier.svg','Diode bridge symbol.svg','Graetz bridge.svg'],
  ammeter: ['Ammeter symbol.svg','Ammeter.svg'],
  voltmeter: ['Voltmeter symbol.svg','Voltmeter.svg'],
  ohmmeter: ['Ohmmeter symbol.svg','Ohmmeter.svg'],
  wattmeter: ['Wattmeter symbol.svg','Wattmeter.svg'],
  buzzer: ['Buzzer-IEC-Symbol.svg','Buzzer symbol.svg','Buzzer.svg','Buzzer IEC.svg'],
  speaker: ['Loudspeaker.svg','Loudspeaker symbol.svg','Speaker symbol.svg'],
  microphone: ['Mic-IEC-Symbol.svg','Microphone symbol.svg','Microphone.svg'],
  antenna: ['Antenna symbol.svg','Antenna.svg'],
  motor: ['Motor Symbol.svg','Motor symbol.svg','Electric motor symbol.svg'],
  generator: ['Generator symbol.svg','Generator.svg','AC generator symbol.svg'],
};

function apiUrl(titles) {
  const t = titles.map(x => 'File:' + x).join('|');
  return 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + encodeURIComponent(t) + '&prop=imageinfo&iiprop=url&format=json&redirects=1';
}

let ok=0, fail=[];
for (const [key,sym] of Object.entries(SYMBOLS)) {
  const out = path.join(base, sym.file);
  if (existsSync(out) && statSync(out).size>50) { ok++; continue; }
  const titles = titleMap[key] || [];
  let done=false;
  // query in chunks
  for (let i=0;i<titles.length && !done;i+=10){
    const chunk = titles.slice(i,i+10);
    try {
      const body = execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0', apiUrl(chunk)],{encoding:'utf8',maxBuffer:10*1024*1024});
      const data = JSON.parse(body);
      const pages = data?.query?.pages || {};
      for (const p of Object.values(pages)) {
        const url = p?.imageinfo?.[0]?.url;
        if (!url) continue;
        if (!/\.svg(\?|$)/i.test(url)) continue; // prefer svg
        try {
          execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0','--max-time','25','-o',out,url],{stdio:'ignore'});
          if (existsSync(out) && statSync(out).size>50){ ok++; done=true; console.log('ok',key,url); break; }
        } catch {}
        try{fs.unlinkSync(out)}catch{}
      }
      if (!done) {
        // try non-svg only if needed? skip for now
      }
    } catch(e) { /* ignore */ }
    sleep(700);
  }
  if(!done) { fail.push(key); console.log('fail',key); }
  sleep(400);
}
console.log('RESULT ok='+ok+' fail='+fail.length);
console.log(fail.join(','));
