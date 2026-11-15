import fs from 'fs';

// 1) Add views to content.js
let c = fs.readFileSync('js/ui/content.js','utf8');
if (!c.includes('export function viewCalc')) {
  const add = `

/* == RapidTables-style category pages == */

const byGroup = (id) => TOOLS.filter((t) => t.group === id);

export function viewCalc(route) {
  const sub = route?.segments?.[1];
  const groups = [
    { id: 'math', title: 'Math calculators', desc: 'Algebra, statistics, geometry, and number tools.' },
    { id: 'electrical', title: 'Electrical calculators', desc: 'Ohm\\'s law, power, voltage, resistance, and circuit tools.' },
    { id: 'finance', title: 'Financial calculators', desc: 'Interest, loans, percentages, and money tools.' },
    { id: 'health', title: 'Health calculators', desc: 'BMI and health-related calculations.' },
    { id: 'time', title: 'Time & date calculators', desc: 'Date, time, and duration tools.' },
    { id: 'number', title: 'Number calculators', desc: 'Base, radix, and number conversion tools.' },
    { id: 'color', title: 'Color calculators', desc: 'Color conversion and code tools.' },
    { id: 'text', title: 'Text calculators', desc: 'Text, encoding, and string tools.' },
    { id: 'wire', title: 'Wire & AWG calculators', desc: 'Wire gauge and electrical sizing tools.' },
    { id: 'general', title: 'General calculators', desc: 'Everyday and utility calculators.' },
  ];
  if (sub) {
    const g = groups.find(x => x.id === sub);
    const items = byGroup(sub);
    if (!g || !items.length) return notFoundRef(\`No calculator category "\${sub}".\`);
    const node = frag(
      el('nav', { class: 'crumbs' }, el('a',{href:'#/'},'Home'), el('span',{'aria-hidden':'true'},'/'), el('a',{href:'#/calc'},'Calculators'), el('span',{'aria-hidden':'true'},'/'), el('span',{},g.title)),
      el('section',{class:'page-head'}, el('span',{class:'hero-eyebrow'},'Calculators'), el('h1',{},g.title), el('p',{},g.desc)),
      el('div',{class:'grid grid-2'}, ...items.map(toolCard))
    );
    node.pageTitle = \`\${g.title} - HexKit\`;
    node.pageDescription = g.desc;
    return node;
  }
  const node = frag(
    el('nav', { class: 'crumbs' }, el('a',{href:'#/'},'Home'), el('span',{'aria-hidden':'true'},'/'), el('span',{},'Calculators')),
    el('section',{class:'page-head'}, el('span',{class:'hero-eyebrow'},'Calculators'), el('h1',{},'Online Calculators'), el('p',{},'Calculators organized by topic, similar to RapidTables categories.')),
    el('section',{class:'section'}, el('div',{class:'section-head'}, el('h2',{},'Calculator categories')),
      el('div',{class:'grid grid-2'}, ...groups.map(g => {
        const count = byGroup(g.id).length;
        return el('a',{class:'tool-card',href:\`#/calc/\${g.id}\`}, el('h3',{},g.title), el('p',{},g.desc), el('span',{class:'card-tag'},\`\${count} calculators\`));
      }))
    ),
    el('section',{class:'section'}, el('div',{class:'section-head'}, el('h2',{},'All calculators')), el('p',{}, el('a',{href:'#/tools'},'Browse the full calculators list →')))
  );
  node.pageTitle = 'Calculators - HexKit';
  node.pageDescription = 'Math, electrical, financial, health, time and other calculators organized by topic.';
  return node;
}

export function viewConversion() {
  const node = frag(
    el('nav', { class: 'crumbs' }, el('a',{href:'#/'},'Home'), el('span',{'aria-hidden':'true'},'/'), el('span',{},'Conversion')),
    el('section',{class:'page-head'}, el('span',{class:'hero-eyebrow'},'Conversion'), el('h1',{},'Unit Conversion'), el('p',{},'Convert units across length, weight, temperature, area, volume, speed, power, energy, and more.')),
    el('section',{class:'section'}, el('div',{class:'section-head'}, el('h2',{},'Conversion categories')),
      el('div',{class:'grid grid-2'}, ...FAMILY_IDS.map(id => {
        const F = FAMILIES[id];
        return el('a',{class:'tool-card',href:\`#/units/\${id}\`}, el('h3',{},\`\${F.title} conversion\`), el('p',{},\`\${Object.keys(F.units).length} units - base: \${F.baseName}\`));
      }))
    ),
    el('section',{class:'section'}, el('div',{class:'section-head'}, el('h2',{},'Text & number conversion')),
      el('div',{class:'grid grid-2'},
        el('a',{class:'tool-card',href:'#/convert'}, el('h3',{},'Text/Base converter'), el('p',{},'Convert text to hex, binary, decimal, octal, Base64 and more.')),
        el('a',{class:'tool-card',href:'#/ascii'}, el('h3',{},'ASCII table'), el('p',{},'ASCII character codes and conversions.')),
        el('a',{class:'tool-card',href:'#/base'}, el('h3',{},'Number base converter'), el('p',{},'Convert between number bases.')),
      )
    )
  );
  node.pageTitle = 'Conversion - HexKit';
  node.pageDescription = 'Unit converters and number/text conversion tools organized by topic.';
  return node;
}

export function viewWebTools() {
  const tools = [
    { href:'#/notepad', title:'Online Notepad', desc:'Write and save notes in your browser.' },
    { href:'#/html-editor', title:'HTML Editor', desc:'Edit and preview HTML.' },
    { href:'#/entities', title:'HTML Entities & Color Codes', desc:'Reference for HTML entities and colors.' },
    { href:'#/tool/scientific-calc', title:'Scientific Calculator', desc:'Advanced scientific calculator.' },
    { href:'#/convert', title:'Text/Hex/Binary Converter', desc:'Convert text and numbers between formats.' },
    { href:'#/ascii', title:'ASCII Table', desc:'View ASCII character codes.' },
    { href:'#/tool/color-convert', title:'Color Converter', desc:'Convert between RGB, HEX, HSL, HSV, CMYK.' },
    { href:'#/tool/password', title:'Password Generator', desc:'Generate secure passwords.' },
    { href:'#/tool/random', title:'Random Number Generator', desc:'Generate random numbers.' },
    { href:'#/tool/case-convert', title:'Case Converter', desc:'Convert text case.' },
    { href:'#/tool/hash', title:'Hash / Checksum Tools', desc:'Compute hashes and checksums.' },
  ];
  const node = frag(
    el('nav', { class: 'crumbs' }, el('a',{href:'#/'},'Home'), el('span',{'aria-hidden':'true'},'/'), el('span',{},'Web Tools')),
    el('section',{class:'page-head'}, el('span',{class:'hero-eyebrow'},'Web Tools'), el('h1',{},'Online Tools'), el('p',{},'Browser-based tools for text, code, conversion, and utilities.')),
    el('div',{class:'grid grid-2'}, ...tools.map(t => el('a',{class:'tool-card',href:t.href}, el('h3',{},t.title), el('p',{},t.desc))))
  );
  node.pageTitle = 'Web Tools - HexKit';
  node.pageDescription = 'Online tools including notepad, editors, converters, generators and utilities.';
  return node;
}

export function viewMathRef() {
  const mathGroups = ['math','number'];
  const mathTools = TOOLS.filter(t => mathGroups.includes(t.group));
  const mathArticles = Object.entries(ARTICLES).filter(([s,a]) => /math|algebra|calculus|exponent|log|quadratic|trig|number|fraction|percent|ratio|root|factor/i.test(s + ' ' + a.title + ' ' + (a.kicker||'')));
  const node = frag(
    el('nav', { class: 'crumbs' }, el('a',{href:'#/'},'Home'), el('span',{'aria-hidden':'true'},'/'), el('span',{},'Math')),
    el('section',{class:'page-head'}, el('span',{class:'hero-eyebrow'},'Math'), el('h1',{},'Math Reference & Calculators'), el('p',{},'Math formulas, concepts, and calculators organized by topic.')),
    el('section',{class:'section'}, el('div',{class:'section-head'}, el('h2',{},'Math calculators')),
      el('div',{class:'grid grid-2'}, ...mathTools.slice(0,20).map(toolCard)),
      mathTools.length>20 ? el('p',{}, el('a',{href:'#/calc/math'},'View all math calculators →')) : null
    ),
    el('section',{class:'section'}, el('div',{class:'section-head'}, el('h2',{},'Math articles & formulas')),
      el('div',{class:'rail-list'}, ...mathArticles.map(([slug,a],i)=> el('a',{class:'rail-row',href:\`#/read/\${slug}\`}, el('span',{class:'n'},String(i+1).padStart(2,'0')), el('span',{}, el('b',{},a.title), el('small',{},a.summary)), el('span',{class:'arrow'},'→'))))
    )
  );
  node.pageTitle = 'Math - HexKit';
  node.pageDescription = 'Math calculators, formulas and reference articles.';
  return node;
}

export function viewElectricityRef() {
  const elecTools = TOOLS.filter(t => t.group === 'electrical' || t.group === 'wire');
  const elecArticles = Object.entries(ARTICLES).filter(([s,a]) => /electric|volt|current|ohm|amp|watt|circuit|resist|capacitor|inductor|power|kirchhoff|coulomb/i.test(s + ' ' + a.title + ' ' + (a.kicker||'')));
  const elecGlossary = Object.entries(GLOSSARY).filter(([,g]) => g.group === 'Electrical');
  const node = frag(
    el('nav', { class: 'crumbs' }, el('a',{href:'#/'},'Home'), el('span',{'aria-hidden':'true'},'/'), el('span',{},'Electricity')),
    el('section',{class:'page-head'}, el('span',{class:'hero-eyebrow'},'Electricity'), el('h1',{},'Electricity & Electronics'), el('p',{},'Electrical calculators, formulas, symbols, and concepts organized by topic.')),
    el('section',{class:'section'}, el('div',{class:'section-head'}, el('h2',{},'Electrical calculators')),
      el('div',{class:'grid grid-2'}, ...elecTools.slice(0,20).map(toolCard)),
      elecTools.length>20 ? el('p',{}, el('a',{href:'#/calc/electrical'},'View all electrical calculators →')) : null
    ),
    el('section',{class:'section'}, el('div',{class:'section-head'}, el('h2',{},'Electrical articles & formulas')),
      el('div',{class:'rail-list'}, ...elecArticles.map(([slug,a],i)=> el('a',{class:'rail-row',href:\`#/read/\${slug}\`}, el('span',{class:'n'},String(i+1).padStart(2,'0')), el('span',{}, el('b',{},a.title), el('small',{},a.summary)), el('span',{class:'arrow'},'→'))))
    ),
    el('section',{class:'section'}, el('div',{class:'section-head'}, el('h2',{},'Electrical reference')),
      el('div',{class:'grid grid-2'},
        el('a',{class:'tool-card',href:'#/symbols'}, el('h3',{},'Circuit symbols'), el('p',{},'Electrical and electronic schematic symbols.')),
        el('a',{class:'tool-card',href:'#/glossary'}, el('h3',{},'Electrical glossary'), el('p',{},\`\${elecGlossary.length}+ electrical terms and definitions.\`)),
        el('a',{class:'tool-card',href:'#/tables'}, el('h3',{},'Reference tables'), el('p',{},'Resistor colors, wire gauge and more.')),
        el('a',{class:'tool-card',href:'#/units/voltage'}, el('h3',{},'Electrical unit conversions'), el('p',{},'Voltage, current, resistance, power, energy and more.')),
      )
    )
  );
  node.pageTitle = 'Electricity - HexKit';
  node.pageDescription = 'Electrical calculators, formulas, symbols and reference organized by topic.';
  return node;
}
`;
  fs.writeFileSync('js/ui/content.js', c + add);
  console.log('added views');
} else {
  console.log('views already present');
}

// 2) Update app.js imports and routing
let a = fs.readFileSync('js/app.js','utf8');
if (!a.includes('viewCalc')) {
  a = a.replace(
    "import {\n  viewHome, viewLearn, viewArticle, viewGlossary, viewGlossaryEntry, viewSymbols, viewTables,\n} from './ui/content.js';",
    "import {\n  viewHome, viewLearn, viewArticle, viewGlossary, viewGlossaryEntry, viewSymbols, viewTables,\n  viewCalc, viewConversion, viewWebTools, viewMathRef, viewElectricityRef,\n} from './ui/content.js';"
  );
  a = a.replace("    case 'tools':\n      node = viewTools(route);\n      break;", "    case 'tools':\n      node = viewTools(route);\n      break;\n    case 'calc':\n      node = viewCalc(route);\n      break;\n    case 'conversion':\n      node = viewConversion();\n      break;\n    case 'web-tools':\n      node = viewWebTools();\n      break;\n    case 'math':\n      node = viewMathRef();\n      break;\n    case 'electricity':\n      node = viewElectricityRef();\n      break;");
  a = a.replace("  if (head === 'tools') return `All ${TOOLS.length} calculators - ${base}`;", "  if (head === 'tools') return `All ${TOOLS.length} calculators - ${base}`;\n  if (head === 'calc') return `${sub ? sub + ' calculators' : 'Calculators'} - ${base}`;\n  if (head === 'conversion') return `Conversion - ${base}`;\n  if (head === 'web-tools') return `Web Tools - ${base}`;\n  if (head === 'math') return `Math - ${base}`;\n  if (head === 'electricity') return `Electricity - ${base}`;");
  fs.writeFileSync('js/app.js', a);
  console.log('updated app');
} else {
  console.log('app already updated');
}
