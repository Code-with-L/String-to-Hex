import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const RAW = path.join(ROOT,'assets/symbols/commons-raw');
const ASSETS = path.join(ROOT,'assets/symbols');
fs.mkdirSync(RAW,{recursive:true});
const sleep=(ms)=>Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,ms);

const targets = [
  // key, assetFilename, [File titles to try]
  ['switchSpst','switch-spst.svg',['Switch normally open symbol.svg','Make contact symbol.svg','NO contact symbol.svg','Contact NO.svg']],
  ['relaySpdt','relay-spdt.svg',['Relay SPDT symbol.svg','SPDT relay symbol.svg','Changeover relay symbol.svg']],
  ['dipSwitch','dip-switch.svg',['DIP switch symbol.svg']],
  ['solderBridge','solder-bridge.svg',['Solder bridge symbol.svg','Solder jumper symbol.svg']],
  ['trimmer','trimmer.svg',['Trimmer resistor symbol.svg','Preset potentiometer symbol.svg','Trimmer potentiometer symbol.svg']],
  ['lamp','lamp.svg',['Lamp symbol.svg','AmpouleIncandescenceSymbole.svg']],
  ['pushbuttonNo','pushbutton-no.svg',['Push-to-make switch electronic symbol.svg','IEEE push to make switch symbol.svg']],
  ['pushbuttonNc','pushbutton-nc.svg',['Push-to-break switch electronic symbol.svg','IEEE push to break switch symbol.svg']],
  ['ground','ground.svg',['Signal ground symbol.svg']],
  ['groundEarth','ground-earth.svg',['Earth ground symbol.svg','IEC 60417 - Ref-No 5019.svg']],
  ['dcSource','dc-source.svg',['Voltage Source (DC) symbol.svg','DC voltage source symbol.svg']],
  ['acSource','ac-source.svg',['AC voltage source symbol.svg']],
  ['wire','wire.svg',['Electrical wire symbol.svg','Wire symbol.svg']],
  ['ammeter','ammeter.svg',['Ammeter symbol.svg']],
  ['voltmeter','voltmeter.svg',['Voltmeter symbol.svg']],
  ['ohmmeter','ohmmeter.svg',['Ohmmeter symbol.svg']],
  ['wattmeter','wattmeter.svg',['Wattmeter symbol.svg']],
  ['buzzer','buzzer.svg',['Buzzer-IEC-Symbol.svg','Buzzer symbol.svg']],
  ['speaker','speaker.svg',['Loudspeaker symbol.svg']],
  ['microphone','microphone.svg',['Microphone symbol IEC.svg','IEC MIC.svg']],
  ['antenna','antenna.svg',['Antenna schematic symbol.svg','Antenna symbol.svg']],
  ['motor','motor.svg',['Electric motor symbol IEC.svg','Motor symbol.svg']],
  ['generator','generator.svg',['Electric generator symbol.svg','Generator symbol.svg']],
  ['transformer','transformer.svg',['Transformer symbol.svg']],
  ['crystal','crystal.svg',['Crystal oscillator symbol.svg','Crystal symbol.svg']],
  ['inductorCore','inductor-core.svg',['Inductor with iron core symbol.svg']],
  ['thyristor','thyristor.svg',['Thyristor symbol.svg']],
  ['bridgeRectifier','bridge-rectifier.svg',['Diode bridge symbol.svg']],
  ['optocoupler','optocoupler.svg',['Optocoupler symbol.svg']],
  ['relayCoil','relay-coil.svg',['Relay coil symbol.svg']],
  ['thermistor','thermistor.svg',['Thermistor symbol.svg']],
];

function apiImageInfo(title){
  const api = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + encodeURIComponent('File:'+title.replace(/^File:/,'')) + '&prop=imageinfo&iiprop=url|extmetadata&format=json&redirects=1';
  const body = execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0','--max-time','20',api],{encoding:'utf8',maxBuffer:10*1024*1024});
  const data = JSON.parse(body);
  for(const p of Object.values(data?.query?.pages||{})){
    const ii=p.imageinfo?.[0];
    if(ii?.url) return {url:ii.url, title:p.title, meta:ii.extmetadata||{}};
  }
  return null;
}
function dl(url,out){ try{execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0','--max-time','30','-o',out,url],{stdio:'ignore'});}catch{} return fs.existsSync(out)&&fs.statSync(out).size>50; }

const results = {};
for(const [key, asset, titles] of targets){
  let ok=false;
  for(const t of titles){
    try{
      sleep(1200);
      const info=apiImageInfo(t);
      if(!info||!info.url||!/\.svg(\?|$)/i.test(info.url)) continue;
      const rawPath=path.join(RAW,key+'.svg');
      if(dl(info.url,rawPath)){
        fs.copyFileSync(rawPath,path.join(ASSETS,asset));
        fs.writeFileSync(path.join(ASSETS,asset+'.meta.json'), JSON.stringify({key,title:info.title,url:info.url.split('?')[0],meta:info.meta},null,2));
        results[key]={asset,title:info.title,url:info.url.split('?')[0],meta:info.meta};
        console.log('OK',key,info.title);
        ok=true; break;
      }
    }catch(e){}
  }
  if(!ok) console.log('MISS',key);
}
fs.writeFileSync(path.join(ASSETS,'_fixed.json'), JSON.stringify(results,null,2));
console.log('done',Object.keys(results).length);
