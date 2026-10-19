import {ACCESSORY_SLOTS} from './accessories.js';
import { freshTouch, normalizeTouch, normalizeDrawing } from './touch.js';
import { defaultFurniture, normalizeFurniture, freshAdventures, normalizeAdventures, OUTFITS, PATTERNS, HEADWEAR } from './world.js';
export const SAVE_KEY = 'lea-sigge-world-v1';
export const PALETTES = {
  tops: ['#d95b84', '#a99ad9', '#71b5ac', '#f3c56d', '#79a9d0', '#e8976e'],
  lips: ['#d86e8a', '#c65072', '#e59a89', '#b56b91'],
  eyes: ['#beaad8', '#b4d5d0', '#ebc593', '#e3b2c7'],
  walls: ['#e8ddf0', '#d9e9df', '#f3dfd9', '#dce7f0', '#f1e6ce'],
  hair: ['#8a684f', '#b18a5e', '#674a3e', '#c8a476'],
};
export const TASKS = [
  { id: 'craft', label: 'Mitt alldeles egna rum', hint: 'Pyssla med färger och klistermärken.', icon: 'rainbow', scene: 'craft' },
  { id: 'outfit', label: 'Min favoritstil', hint: 'Välj något i garderoben.', icon: 'shirt', scene: 'dress' },
  { id: 'makeup', label: 'En stund vid spegeln', hint: 'Prova en färg på sminkbordet.', icon: 'mirror', scene: 'makeup' },
  { id: 'tidy', label: 'Var sak på sin plats', hint: 'Hjälp sakerna att hitta hem.', icon: 'basket', scene: 'tidy' },
  { id: 'brush', label: 'Sigges mjuka päls', hint: 'Borsta Sigge med borsten.', icon: 'paw', scene: 'dog' },
  { id: 'wash', label: 'Rena tassar', hint: 'Tvätta bort leran från Sigge.', icon: 'drop', scene: 'dog' },
  { id: 'teeth', label: 'Tandborstkalas', hint: 'Borsta alla tänderna rena.', icon: 'tooth', scene: 'teeth' },
];
export const TOYS = [
  { id: 'bear', icon: 'bear', name: 'Nallen', box: 'toys', x: 24, y: 38 },
  { id: 'ball', icon: 'ball', name: 'Bollen', box: 'toys', x: 72, y: 26 },
  { id: 'bow', icon: 'bow', name: 'Rosetten', box: 'accessories', x: 47, y: 22 },
  { id: 'brush', icon: 'brush', name: 'Hårborsten', box: 'accessories', x: 83, y: 52 },
  { id: 'book', icon: 'book', name: 'Boken', box: 'books', x: 17, y: 64 },
  { id: 'pencils', icon: 'pencil', name: 'Pennorna', box: 'books', x: 54, y: 63 },
];
export const STICKERS = ['flower', 'star', 'heart', 'paw', 'moon', 'rainbow', 'butterfly','sun','leaf','music','sparkles','cherry'];
export function freshState() {
  return {
    version: 1, entered: false, sound: true,
    lea: { top: 0, outfit: 'skirt', shoes: 0, hair: 3, hairstyle: 'loose', bow: false, bottom: 1, pattern: 'plain', headwear: 'none',hairclip:'none',eyewear:'none',necklace:'none',bag:'none' },
    makeup: { lips: null, cheeks: null, eyes: null },
    room: { wall: 0, stickers: [], furniture: defaultFurniture(), drawing: [] },
    dog: { brushed: 0, clean: [false, false, false, false, false], fed: false, collar: '#68a99d',accessory:'none',affection:0,played:0 },
    tidy: [], teeth: Array(8).fill(false), done: [], looks:[], nextLookId:1, adventures: freshAdventures(), touch: freshTouch(),
  };
}
const index = (value, max, fallback = 0) => Number.isInteger(value) && value >= 0 && value < max ? value : fallback;
// Only trusted, bounded values are loaded. Saving never needs a network request.
export function normalizeState(raw) {
  const s = freshState();
  if (!raw || raw.version !== 1) return s;
  s.entered = raw.entered === true;
  s.sound = raw.sound !== false;
  for (const k of ['top', 'hair']) s.lea[k] = index(raw.lea?.[k], k === 'top' ? 6 : 4, s.lea[k]);
  s.lea.shoes = index(raw.lea?.shoes, 4);
  s.lea.outfit = OUTFITS.includes(raw.lea?.outfit) ? raw.lea.outfit : 'skirt';
  s.lea.hairstyle = ['loose', 'ponytail', 'pigtails'].includes(raw.lea?.hairstyle) ? raw.lea.hairstyle : 'loose';
  s.lea.bow = raw.lea?.bow === true;
  s.lea.bottom = index(raw.lea?.bottom, 6, s.lea.bottom);
  s.lea.pattern = PATTERNS.includes(raw.lea?.pattern) ? raw.lea.pattern : 'plain';
  s.lea.headwear = HEADWEAR.includes(raw.lea?.headwear) ? raw.lea.headwear : 'none';
  for(const [slot,ids] of Object.entries(ACCESSORY_SLOTS))s.lea[slot]=ids.includes(raw.lea?.[slot])?raw.lea[slot]:slot==='hairclip'&&s.lea.bow?'bow':'none';
  s.lea.bow=s.lea.hairclip==='bow';
  s.room.furniture = normalizeFurniture(raw.room?.furniture);
  s.room.drawing = normalizeDrawing(raw.room?.drawing);
  s.adventures = normalizeAdventures(raw.adventures);
  for (const k of ['lips', 'cheeks', 'eyes']) {
    const v = raw.makeup?.[k];
    s.makeup[k] = v === null || v === undefined ? null : index(v, 4, null);
  }
  s.room.wall = index(raw.room?.wall, 5);
  s.room.stickers = Array.isArray(raw.room?.stickers) ? raw.room.stickers.slice(0, 24).filter(v =>
    v && STICKERS.includes(v.icon) && Number.isFinite(v.x) && Number.isFinite(v.y)
  ).map(v => ({icon: v.icon, x: Math.max(8, Math.min(92, v.x)), y: Math.max(10, Math.min(90, v.y))})) : [];
  s.dog.brushed = Math.max(0, Math.min(100, Number(raw.dog?.brushed) || 0));
  s.dog.clean = s.dog.clean.map((_, i) => raw.dog?.clean?.[i] === true);
  s.dog.fed = raw.dog?.fed === true;
  s.dog.collar = ['#68a99d', '#ca7da2', '#9293cf', '#d8a652'].includes(raw.dog?.collar) ? raw.dog.collar : s.dog.collar;
  s.tidy = TOYS.filter(t => Array.isArray(raw.tidy) && raw.tidy.includes(t.id)).map(t => t.id);
  s.teeth = s.teeth.map((_, i) => raw.teeth?.[i] === true);
  s.done = TASKS.filter(t => Array.isArray(raw.done) && raw.done.includes(t.id)).map(t => t.id);
  s.touch = normalizeTouch(raw.touch, s.dog, s.teeth);
  s.dog.accessory=['none','bandana','bowtie'].includes(raw.dog?.accessory)?raw.dog.accessory:'none';
  s.dog.affection=Math.max(0,Math.min(100,Number(raw.dog?.affection)||0));
  s.dog.played=Math.max(0,Math.min(99,Math.floor(Number(raw.dog?.played)||0)));
  s.looks=Array.isArray(raw.looks)?raw.looks.slice(0,6).filter(v=>v&&/^look-[0-9]+$/.test(v.id)).map(v=>{const n=normalizeState({version:1,lea:v.lea,makeup:v.makeup,touch:{paint:v.paint}});return{id:v.id,lea:n.lea,makeup:n.makeup,paint:n.touch.paint};}).filter((v,i,a)=>a.findIndex(q=>q.id===v.id)===i):[];
  s.nextLookId=Math.max(Number.isInteger(raw.nextLookId)&&raw.nextLookId>0&&raw.nextLookId<1000000000?raw.nextLookId:1,...s.looks.map(v=>Number(v.id.slice(5))+1));
  return s;
}
export function load(storage) {
  try { return normalizeState(JSON.parse(storage.getItem(SAVE_KEY))); } catch { return freshState(); }
}
export function persist(storage, state) {
  try { storage.setItem(SAVE_KEY, JSON.stringify(state)); return true; } catch { return false; }
}
export function complete(state, id) {
  if (!TASKS.some(t => t.id === id) || state.done.includes(id)) return false;
  state.done.push(id); return true;
}
export function sortToy(state, id, box) {
  const toy = TOYS.find(t => t.id === id);
  if (!toy || toy.box !== box || state.tidy.includes(id)) return false;
  state.tidy.push(id);
  if (state.tidy.length === TOYS.length) complete(state, 'tidy');
  return true;
}
export function washSpot(state, i) {
  if (!Number.isInteger(i) || i < 0 || i >= 5) return false;
  state.dog.clean[i] = true;
  if (state.dog.clean.every(Boolean)) complete(state, 'wash');
  return true;
}
export function brushDog(state, amount = 10) {
  state.dog.brushed = Math.min(100, state.dog.brushed + Math.max(0, amount));
  if (state.dog.brushed === 100) complete(state, 'brush');
}
export function cleanTooth(state, i) {
  if (!Number.isInteger(i) || i < 0 || i >= 8) return false;
  state.teeth[i] = true;
  if (state.teeth.every(Boolean)) complete(state, 'teeth');
  return true;
}

export function saveLook(s){if(s.looks.length>=6)return false;const id=`look-${s.nextLookId++}`;s.looks.push({id,lea:structuredClone(s.lea),makeup:{...s.makeup},paint:structuredClone(s.touch.paint)});return true;}
export function wearLook(s,id){const look=s.looks.find(v=>v.id===id);if(!look)return false;s.lea=structuredClone(look.lea);s.makeup={...look.makeup};s.touch.paint=structuredClone(look.paint);return true;}
