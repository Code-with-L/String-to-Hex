import { execFileSync } from 'node:child_process';

const queries = [
  ['lamp','Lamp symbol IEC 60617 SVG'],
  ['lamp2','Lamp electrical symbol SVG'],
  ['lamp3','File:AmpouleIncandescenceSymbole.svg'],
  ['pushbuttonNo','Push-to-make switch symbol SVG'],
  ['pushbuttonNo2','Normally open pushbutton symbol IEC SVG'],
  ['pushbuttonNo3','Switch make contact symbol SVG'],
  ['pushbuttonNc','Push-to-break switch symbol SVG'],
  ['pushbuttonNc2','Normally closed pushbutton symbol IEC SVG'],
  ['dipSwitch','DIP switch symbol SVG'],
  ['solderBridge','Solder bridge symbol SVG'],
  ['solderBridge2','Jumper PCB symbol SVG'],
  ['relaySpdt','SPDT relay symbol SVG'],
  ['relaySpdt2','Changeover relay contact symbol SVG'],
  ['relaySpdt3','DPDT relay symbol SVG'],
  ['trimmer','Trimmer resistor symbol SVG'],
  ['trimmer2','Preset potentiometer symbol SVG'],
  ['potentiometer','Potentiometer symbol IEC SVG'],
  ['inductorCore','Inductor with iron core symbol SVG'],
  ['dcSource','Voltage Source (DC) symbol SVG'],
  ['acSource','AC voltage source symbol SVG'],
  ['ground','Signal ground symbol SVG'],
  ['groundEarth','Protective earth ground symbol SVG'],
  ['wire','Wire symbol electrical SVG'],
  ['ammeter','Ammeter symbol SVG'],
  ['voltmeter','Voltmeter symbol SVG'],
  ['ohmmeter','Ohmmeter symbol SVG'],
  ['wattmeter','Wattmeter symbol SVG'],
  ['buzzer','Buzzer symbol IEC SVG'],
  ['speaker','Loudspeaker symbol SVG'],
  ['microphone','Microphone symbol IEC SVG'],
  ['antenna','Antenna symbol SVG'],
  ['motor','Electric motor symbol IEC SVG'],
  ['generator','Electric generator symbol SVG'],
  ['transformer','Transformer symbol SVG'],
  ['crystal','Crystal oscillator symbol SVG'],
  ['optocoupler','Optocoupler symbol SVG'],
  ['thyristor','Thyristor symbol SVG'],
  ['bridgeRectifier','Diode bridge rectifier symbol SVG'],
  ['relayCoil','Relay coil symbol SVG'],
  ['switchSpstDistinct','Switch normally open symbol SVG'],
  ['switchSpst2','SPST switch symbol SVG'],
  ['thermistor','Thermistor symbol SVG'],
];

for (const [tag,q] of queries){
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&format=json&srlimit=5&srsearch=' + encodeURIComponent(q);
  try{
    const body = execFileSync('curl.exe',['-fsSL','-A','HexKit/1.0',url],{encoding:'utf8',maxBuffer:5*1024*1024});
    const data = JSON.parse(body);
    const hits = (data?.query?.search||[]).map(h=>({title:h.title,snippet:h.snippet}));
    console.log('###',tag,q);
    for(const h of hits) console.log('-', h.title);
  }catch(e){
    console.log('###',tag,q,'ERR');
  }
}
