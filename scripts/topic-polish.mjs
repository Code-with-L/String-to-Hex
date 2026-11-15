import fs from 'fs';

// SPA: add crumbs to viewConvert
{
  const p = 'js/ui/views.js';
  let s = fs.readFileSync(p, 'utf8');
  const start = "export function viewConvert(route) {\n  currentEncoding = route.query.get('enc') ?? 'utf-8';";
  if (!s.includes(start)) throw new Error('viewConvert start nf');
  // check if crumbs already present
  if (!s.includes("crumbs(el('a', { href: '#/conversion' }, 'Conversion'), el('span', {}, 'Text & base converter'))") &&
      s.indexOf('export function viewConvert') === s.indexOf(start.slice(0,30))) {
    // insert after first few lines? better to prepend crumbs in returned frag by finding "return frag(" inside viewConvert
  }
  const fnIdx = s.indexOf('export function viewConvert(route) {');
  const fragIdx = s.indexOf('  return frag(', fnIdx);
  if (fnIdx < 0 || fragIdx < 0 || fragIdx - fnIdx > 20000) throw new Error('viewConvert frag nf');
  if (!s.slice(fragIdx, fragIdx+120).includes("crumbs(el('a', { href: '#/conversion' }, 'Conversion')")) {
    s = s.slice(0, fragIdx) + "  return frag(\n    crumbs(el('a', { href: '#/conversion' }, 'Conversion'), el('span', {}, 'Text & base converter')),\n" + s.slice(fragIdx + '  return frag(\n'.length);
    fs.writeFileSync(p, s);
    console.log('viewConvert crumbs added');
  } else {
    console.log('viewConvert crumbs already');
  }
}

// Prerender thin pages: topic-aware nav
{
  const p = 'scripts/prerender.mjs';
  let s = fs.readFileSync(p, 'utf8');
  const old = `for (const [path, hash, title, description] of [
  ['/notepad/index.html', '/notepad', \`Online notepad - private, autosaving | \${SITE}\`, 'A scratchpad that autosaves to your browser only. Nothing is uploaded and no account is needed.'],
  ['/html-editor/index.html', '/html-editor', \`HTML editor & viewer with live preview | \${SITE}\`, 'Write HTML with a live sandboxed preview. Nothing is fetched over the network and scripts are blocked in the preview.'],
  ['/entities/index.html', '/entities', \`HTML entities & colour code reference | \${SITE}\`, 'A copyable reference of HTML entities and numeric colour code formats.'],
  ['/convert/index.html', '/convert', \`Text to hex, binary, decimal, octal & Base64 | \${SITE}\`, 'Convert text to any base and back. 42 character encodings, live conversion, works offline.'],
  ['/about/index.html', '/about', \`About \${SITE} - offline converters and calculators\`, 'What HexKit is, how it works, and what it does with your data: nothing.'],
]) {
  PAGES.push({
    path,
    hash,
    title,
    description,
    jsonLd: graph([{ '@type': 'WebApplication', '@id': \`\${ORIGIN}\${cleanPath(path)}#app\`, name: title.split(' - ')[0], applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', url: \`\${ORIGIN}\${cleanPath(path)}\`, description, isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }]),
    body: (up) => \`    \${nav(up, [{ label: title.split(' - ')[0] }])}
    <header class="page-head">
      <h1>\${esc(title.split(' - ')[0])}</h1>
      <p>\${esc(description)}</p>
    </header>
    <section class="panel prose">
      <p>Enable JavaScript to use this page, or <a href="\${up}#\${hash}">open the interactive version</a>.</p>
    </section>\`,
  });
}`;

  const rep = `for (const page of [
  { path: '/convert/index.html', hash: '/convert', title: \`Text & base converter | \${SITE}\`, description: 'Convert text to hex, binary, decimal, octal and Base64 and back. 42 character encodings, live conversion, works offline.', topic: 'Conversion', topicHref: 'conversion/' },
  { path: '/notepad/index.html', hash: '/notepad', title: \`Online Notepad | \${SITE}\`, description: 'A browser-based notepad that autosaves locally. Nothing is uploaded and no account is needed.', topic: 'Web Tools', topicHref: 'web-tools/' },
  { path: '/html-editor/index.html', hash: '/html-editor', title: \`HTML editor & viewer | \${SITE}\`, description: 'Write HTML with a live sandboxed preview in your browser. No network fetches and scripts are blocked in the preview.', topic: 'Web Tools', topicHref: 'web-tools/' },
  { path: '/entities/index.html', hash: '/entities', title: \`HTML entities reference | \${SITE}\`, description: 'A copyable reference of HTML entities and numeric code formats.', topic: 'Web Tools', topicHref: 'web-tools/' },
  { path: '/about/index.html', hash: '/about', title: \`About \${SITE}\`, description: 'What HexKit is, how it works, and what it does with your data: everything runs locally in your browser.', topic: null, topicHref: null },
]) {
  const { path, hash, title, description, topic, topicHref } = page;
  PAGES.push({
    path,
    hash,
    title,
    description,
    jsonLd: graph([{ '@type': 'WebApplication', '@id': \`\${ORIGIN}\${cleanPath(path)}#app\`, name: title.split(' | ')[0], applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', url: \`\${ORIGIN}\${cleanPath(path)}\`, description, isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }]),
    body: (up) => \`    \${nav(up, topic ? [{ label: topic, href: \`\${up}\${topicHref}\` }, { label: title.split(' | ')[0] }] : [{ label: title.split(' | ')[0] }])}
    <header class="page-head">
      <h1>\${esc(title.split(' | ')[0])}</h1>
      <p>\${esc(description)}</p>
    </header>
    <section class="panel prose">
      <p>This is a browser-based tool that runs locally. Enable JavaScript to use it, or <a href="\${up}#\${hash}">open the interactive version</a>.</p>
    </section>\`,
  });
}`;

  if (!s.includes(old)) {
    // try a looser approach: replace from marker to marker
    const start = "for (const [path, hash, title, description] of [";
    const end = "\n/* ── write";
    const i = s.indexOf(start);
    const j = s.indexOf(end, i);
    if (i < 0 || j < 0) throw new Error('thin pages block nf ' + i + ' ' + j);
    s = s.slice(0, i) + rep + '\n' + s.slice(j);
    fs.writeFileSync(p, s);
    console.log('thin pages updated (loose)');
  } else {
    s = s.replace(old, rep);
    fs.writeFileSync(p, s);
    console.log('thin pages updated');
  }
}
