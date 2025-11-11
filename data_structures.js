/*
  data_structures.js
  Implements: Trie, Simple HashMap (wrapper around Map), AVL tree (insert/search), Graph
  and a FIRStore that composes them to provide fast queries for FIR records.
*/

// Trie for prefix search on names (maps characters -> node with set of ids)
class TrieNode {
  constructor(){
    this.children = new Map();
    this.ids = new Set();
    this.isEnd = false;
  }
}

class Trie {
  constructor(){ this.root = new TrieNode(); }
  insert(key, id){
    key = (key || '').toLowerCase();
    let node = this.root;
    for (const ch of key){
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
      node.ids.add(id);
    }
    node.isEnd = true;
    node.ids.add(id);
  }
  searchExact(key){
    key = (key || '').toLowerCase();
    let node = this.root;
    for (const ch of key){
      node = node.children.get(ch);
      if (!node) return [];
    }
    return Array.from(node.ids);
  }
  startsWith(prefix){
    prefix = (prefix || '').toLowerCase();
    let node = this.root;
    for (const ch of prefix){
      node = node.children.get(ch);
      if (!node) return [];
    }
    return Array.from(node.ids);
  }
}

// Simple HashMap wrapper
class HashMap {
  constructor(){ this.map = new Map(); }
  put(k,v){ this.map.set(k,v); }
  get(k){ return this.map.get(k); }
  has(k){ return this.map.has(k); }
  delete(k){ return this.map.delete(k); }
  keys(){ return Array.from(this.map.keys()); }
  values(){ return Array.from(this.map.values()); }
}

// AVL Tree for numeric keys (id). We'll support insert and search.
class AVLNode {
  constructor(key, value){ this.key=key;this.value=value;this.left=null;this.right=null;this.height=1 }
}

class AVLTree {
  constructor(){ this.root = null }
  height(n){ return n ? n.height : 0 }
  rotateRight(y){
    const x = y.left; const T2 = x.right;
    x.right = y; y.left = T2;
    y.height = Math.max(this.height(y.left), this.height(y.right))+1;
    x.height = Math.max(this.height(x.left), this.height(x.right))+1;
    return x;
  }
  rotateLeft(x){
    const y = x.right; const T2 = y.left;
    y.left = x; x.right = T2;
    x.height = Math.max(this.height(x.left), this.height(x.right))+1;
    y.height = Math.max(this.height(y.left), this.height(y.right))+1;
    return y;
  }
  getBalance(n){ return n ? this.height(n.left) - this.height(n.right) : 0 }
  insert(key, value){ this.root = this._insert(this.root, key, value); }
  _insert(node, key, value){
    if (!node) return new AVLNode(key, value);
    if (key < node.key) node.left = this._insert(node.left, key, value);
    else if (key > node.key) node.right = this._insert(node.right, key, value);
    else { node.value = value; return node; }
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    const balance = this.getBalance(node);
    if (balance > 1 && key < node.left.key) return this.rotateRight(node);
    if (balance < -1 && key > node.right.key) return this.rotateLeft(node);
    if (balance > 1 && key > node.left.key){ node.left = this.rotateLeft(node.left); return this.rotateRight(node); }
    if (balance < -1 && key < node.right.key){ node.right = this.rotateRight(node.right); return this.rotateLeft(node); }
    return node;
  }
  find(key){ let n = this.root; while(n){ if (key===n.key) return n.value; n = key < n.key ? n.left : n.right } return null }
  inOrder(){ const out=[]; this._inOrder(this.root,out); return out }
  _inOrder(node,out){ if(!node) return; this._inOrder(node.left,out); out.push(node.value); this._inOrder(node.right,out); }
}

// Graph to model relations among FIRs (e.g., related suspects/ids)
class Graph {
  constructor(){ this.adj = new Map(); }
  addVertex(id){ if(!this.adj.has(id)) this.adj.set(id,new Set()); }
  addEdge(a,b){ this.addVertex(a); this.addVertex(b); this.adj.get(a).add(b); this.adj.get(b).add(a); }
  neighbors(id){ return this.adj.has(id) ? Array.from(this.adj.get(id)) : [] }
}

// FIRStore composes structures for fast queries
class FIRStore {
  constructor(){
    this.byId = new HashMap(); // id -> record
    this.complainantTrie = new Trie();
    this.suspectTrie = new Trie();
    this.idIndex = new AVLTree();
    this.graph = new Graph();
  }
  add(record){
    if (!record || record.id == null) throw new Error('record.id required');
    const id = Number(record.id);
    this.byId.put(id, record);
    this.complainantTrie.insert(record.complainant || '', id);
    this.suspectTrie.insert(record.suspect || '', id);
    this.idIndex.insert(id, record);
    this.graph.addVertex(id);
    // add relations: if record.relatedIds array present
    if (Array.isArray(record.relatedIds)){
      for (const r of record.relatedIds) this.graph.addEdge(id, Number(r));
    }
  }
  getById(id){ return this.byId.get(Number(id)) || null }
  searchComplainant(name){ const ids = this.complainantTrie.startsWith(name); return ids.map(i=>this.getById(i)).filter(Boolean) }
  searchSuspect(name){ const ids = this.suspectTrie.startsWith(name); return ids.map(i=>this.getById(i)).filter(Boolean) }
  listByStatus(status){ return this.byId.values().filter(r=>String(r.status||'').toLowerCase()===String(status||'').toLowerCase()) }
  all(){ return this.byId.values() }
  related(id){ return this.graph.neighbors(Number(id)).map(i=>this.getById(i)).filter(Boolean) }
  export(){ return JSON.stringify(this.all(),null,2) }
  importArray(arr){ arr.forEach(r=>this.add(r)) }
}

// Export to global so UI can access
window.Trie = Trie;
window.HashMap = HashMap;
window.AVLTree = AVLTree;
window.Graph = Graph;
window.FIRStore = FIRStore;
