import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const base = path.join(process.cwd(), 'assets', 'symbols', 'commons-raw');
fs.mkdirSync(base, { recursive: true });
const sleep = (ms)=>Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,ms);

const files = [
  ['lamp.svg','File:Lamp symbol.svg'],
  ['lamp-alt.svg','File:AmpouleIncandescenceSymbole.svg'],
  ['pushbutton-no.svg','File:Push-to-make switch electronic symbol.svg'],
  ['pushbutton-no2.svg','File:IEEE push to make switch symbol.svg'],
  ['pushbutton-nc.svg','File:Push-to-break switch electronic symbol.svg'],
  ['pushbutton-nc2.svg','File:IEEE push to break switch symbol.svg'],
  ['buzzer.svg','File:Buzzer-IEC-Symbol.svg'],
  ['ground-earth-iec.svg','File:IEC 60417 - Ref-No 5019.svg'],
  ['ammeter.svg','File:Lukion taulukot - ammeter symbol (1993).svg'],
  ['voltmeter.svg','File:Lukion taulukot - voltmeter symbol (1993).svg'],
  ['ohmmeter.svg','File:Lukion taulukot - ohmmeter symbol (1993).svg'],
  ['speaker.svg','File:Lukion taulukot - loudspeaker symbol (1993).svg'],
  ['antenna.svg','File:Antenna schematic symbol.svg'],
  ['microphone.svg','File:IEC MIC.svg'],
];

function getUrl(title){
  const api = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + encodeURIComponent(title) + '&prop=imageinfo&iiprop=url|extmetadata&format=json&redirects=1';
  const body = execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0',api],{encoding:'utf8',maxBuffer:10*1024*1024});
  const data = JSON.parse(body);
  const pages = data?.query?.pages||{};
  for(const p of Object.values(pages)){
    const ii=p.imageinfo?.[0]; if(ii?.url) return {url:ii.url, meta:ii.extmetadata||{}, title:p.title};
  }
  return null;
}

for(const [outName,title] of files){
  try{
    sleep(900);
    const info=getUrl(title);
    if(!info||!info.url||!/\.svg/i.test(info.url)){ console.log('no',title); continue; }
    const out=path.join(base,outName);
    execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0','--max-time','30','-o',out,info.url],{stdio:'ignore'});
    if(fs.existsSync(out) && fs.statSync(out).size>50){
      fs.writeFileSync(out+'.json', JSON.stringify(info,null,2));
      console.log('ok',outName,info.url);
    } else console.log('faildl',title);
  }catch(e){ console.log('err',title,e.message); }
}
