import { SYMBOLS } from '../js/data/symbols.js';
import { SYMBOL_INLINE } from '../js/data/symbol-inline.generated.js';
for (const [k,s] of Object.entries(SYMBOLS)) {
  const hasInline = !!SYMBOL_INLINE[k];
  const ext = s.file.split('.').pop().toLowerCase();
  if (!hasInline || ext !== 'svg') console.log('BROKEN', k, s.file, hasInline, s.label);
}
console.log('---');
console.log('inline', Object.keys(SYMBOL_INLINE).length, 'total', Object.keys(SYMBOLS).length);
