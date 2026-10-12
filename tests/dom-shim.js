/**
 * Minimal DOM shim — just enough to execute the real view builders in Node so
 * that render-time errors (bad selectors, undefined nodes, typos in tags) fail
 * the test run instead of the browser.
 */

class ClassList {
  constructor(el) { this.el = el; this.set = new Set(); }
  add(...c) { c.forEach((x) => this.set.add(x)); this.sync(); }
  remove(...c) { c.forEach((x) => this.set.delete(x)); this.sync(); }
  contains(c) { return this.set.has(c); }
  toggle(c) { if (this.set.has(c)) this.set.delete(c); else this.set.add(c); this.sync(); }
  sync() { this.el.attributes.class = [...this.set].join(' '); }
}

class Node {
  constructor(tag) {
    this.tagName = String(tag).toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.attributes = {};
    this.dataset = {};
    this.listeners = {};
    this.classList = new ClassList(this);
    this._text = '';
    this.hidden = false;
    // Browsers give every form control a value/checked; mirror that so view
    // code that reads `.value` behaves the same here.
    this.value = '';
    this.checked = false;
    this.type = '';
    this.files = [];
  }
  get firstChild() { return this.children[0] ?? null; }
  get textContent() {
    return this.children.length
      ? this.children.map((c) => c.textContent).join('')
      : this._text;
  }
  set textContent(v) { this._text = String(v); this.children = []; }
  get className() { return this.attributes.class ?? ''; }
  set className(v) { this.attributes.class = v; this.classList.set = new Set(String(v).split(/\s+/).filter(Boolean)); }
  set innerHTML(v) { this._html = String(v); this.children = []; }
  get innerHTML() { return this._html ?? ''; }
  append(...nodes) {
    for (const n of nodes) {
      if (n === null || n === undefined || n === false) continue;
      if (n instanceof Fragment) {
        for (const c of [...n.children]) { c.parentNode = this; this.children.push(c); }
        n.children = [];
        continue;
      }
      // duck-type rather than `instanceof`, because TextNode is a separate class
      const node = n?.__isNode ? n : new TextNode(String(n));
      node.parentNode = this;
      this.children.push(node);
    }
  }
  replaceChildren(...nodes) { this.children = []; this._text = ''; this.append(...nodes); }
  remove() {
    if (!this.parentNode) return;
    const i = this.parentNode.children.indexOf(this);
    if (i >= 0) this.parentNode.children.splice(i, 1);
    this.parentNode = null;
  }
  addEventListener(type, fn) { (this.listeners[type] ??= []).push(fn); }
  removeEventListener(type, fn) { this.listeners[type] = (this.listeners[type] ?? []).filter((f) => f !== fn); }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return this.attributes[k] ?? null; }
  removeAttribute(k) { delete this.attributes[k]; }
  focus() {}
  click() { (this.listeners.click ?? []).forEach((f) => f({ target: this })); }
  dispatch(type, event = {}) { for (const f of this.listeners[type] ?? []) f({ preventDefault() {}, stopPropagation() {}, target: this, ...event }); }
  querySelector(sel) { return this.querySelectorAll(sel)[0] ?? null; }
  querySelectorAll(sel) {
    const out = [];
    const match = (n) => {
      if (!n.classList) return;          // text nodes have no classes
      if (n.tagName === sel.toUpperCase()) out.push(n);
      if (sel.startsWith('.')) { if (n.classList.contains(sel.slice(1))) out.push(n); }
      if (sel.startsWith('#')) { if (n.attributes.id === sel.slice(1)) out.push(n); }
      for (const c of n.children ?? []) match(c);
    };
    for (const c of this.children ?? []) match(c);
    return out;
  }
  get scrollIntoView() { return () => {}; }
}

class TextNode {
  constructor(text) { this._text = String(text); this.children = []; }
  get textContent() { return this._text; }
  get tagName() { return '#TEXT'; }
  querySelector() { return null; }
  querySelectorAll() { return []; }
}

class Fragment extends Node {
  constructor() { super('#fragment'); this.isFragment = true; }
}

/** Any shim node, used by `append` to distinguish nodes from plain values. */
Node.prototype.__isNode = true;
TextNode.prototype.__isNode = true;

export function installDOM() {
  const doc = {
    documentElement: new Node('html'),
    head: new Node('head'),
    body: new Node('body'),
    createElement: (t) => new Node(t),
    createTextNode: (t) => new TextNode(t),
    createDocumentFragment: () => new Fragment(),
    querySelector: (s) => (s.startsWith('#') ? doc.body.querySelector(s) : null),
    querySelectorAll: (s) => doc.body.querySelectorAll(s),
    addEventListener() {},
    removeEventListener() {},
  };
  doc.documentElement.dataset = {};
  globalThis.document = doc;
  globalThis.Node = Node;
  globalThis.window = globalThis;
  if (!globalThis.location) globalThis.location = { hash: '#/', href: 'http://localhost/' };
  if (!globalThis.history) globalThis.history = { replaceState() {}, pushState() {} };
  if (!globalThis.addEventListener) globalThis.addEventListener = () => {};
  if (!globalThis.matchMedia) globalThis.matchMedia = () => ({ matches: false, addEventListener() {} });
  if (!globalThis.navigator) globalThis.navigator = { userAgent: 'node' };
  return doc;
}

/** Depth-first walk collecting every element in the tree. */
export function walk(node, out = []) {
  if (node.tagName && node.tagName !== '#TEXT') out.push(node);
  for (const c of node.children ?? []) walk(c, out);
  return out;
}

/** Append a tree to a container so `querySelector` on the document can find it. */
export function toTree(fragment) {
  const root = new Node('div');
  root.append(fragment);
  return root;
}

export { Node, TextNode, Fragment };
