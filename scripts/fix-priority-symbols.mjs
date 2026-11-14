import { execFileSync } from 'node:child_process';
import fs from 'fs';
import path from 'path';
const ROOT=process.cwd(); const RAW=path.join(ROOT,'assets/symbols/commons-raw'); const ASSETS=path.join(ROOT,'assets/symbols');
fs.mkdirSync(RAW,{recursive:true});
const sleep=ms=>Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,ms);
const targets=[
  ['switchSpst','switch-spst.svg','Symbol Threshold switch (Normally open contact).svg'],
  ['relaySpdt','relay-spdt.svg','DPDT relay symbol.svg'],
  ['dipSwitch','dip-switch.svg','DIP switch symbol.svg'],
  ['solderBridge','solder-bridge.svg','Solder bridge symbol.svg'],
  ['trimmer','trimmer.svg','Trimmer resistor symbol.svg'],
  ['trimmer','trimmer.svg','Preset potentiometer symbol.svg'],
];
function api(title){
  const u='https://commons.wikimedia.org/w/api.php?action=query&titles='+encodeURIComponent('File:'+title)+'&prop=imageinfo&iiprop=url|extmetadata&format=json&redirects=1';
  const b=execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0','--max-time','20',u],{encoding:'utf8',maxBuffer:10*1024*1024});
  const d=JSON.parse(b); for(const p of Object.values(d?.query?.pages||{})){const ii=p.imageinfo?.[0]; if(ii?.url) return {url:ii.url,title:p.title,meta:ii.extmetadata||{}};} return null;
}
function dl(url,out){try{execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0','--max-time','25','-o',out,url],{stdio:'ignore'});}catch{} return fs.existsSync(out)&&fs.statSync(out).size>50;}
const done=new Set();
for(const [key,asset,title] of targets){
  if(done.has(key)) continue;
  try{
    sleep(1500);
    const info=api(title); if(!info||!/\.svg(\?|$)/i.test(info.url)) {console.log('no',key,title); continue;}
    const raw=path.join(RAW,key+'.svg'); if(dl(info.url,raw)){ fs.copyFileSync(raw,path.join(ASSETS,asset)); fs.writeFileSync(path.join(ASSETS,asset+'.meta.json'),JSON.stringify({key,title:info.title,url:info.url.split('?')[0],meta:info.meta||{}},null,2)); console.log('OK',key,info.title); done.add(key);} else console.log('fail',key,title);
  }catch(e){console.log('err',key,title,e.message);}
}
console.log('got',done.size);
