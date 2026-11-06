import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { treatmentImage } from '../frontend/lib/treatment-images.ts';
const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const wellness = read('../frontend/data/wellness.json');
const salon = read('../content/salon/catalog.draft.json');
const content = read('../site/content.json');
const source = () => read('../frontend/data/treatment-images.json');
const offerings = [
 ...wellness.filter(o => o.bookable !== false),
 ...salon.items.map(o=>({id:o.id,area:'salon',category:salon.categories.find(c=>c.id===o.category_id).label})),
 ...content.cosmetic_treatments.map(o=>({id:'cosmetic-'+o.slug,area:'cosmetic',category:'Cosmetic Care'}))
];
test('every published treatment has an intentional image with descriptive provenance',()=>{
 for(const o of offerings){
  const image=treatmentImage(o);
  assert.notEqual(image.key,'fallback',o.id);
  assert.ok(image.alt.length>15,o.id);
  assert.ok(['photo','ai'].includes(image.source),o.id);
  assert.ok(image.caption.length>5,o.id);
 }
});
test('image map uses local optimized assets without changing original capture',()=>{
 for(const [key,image] of Object.entries(source().images)){
  assert.match(image.src,/^\/site\/assets\/treatments\/[a-z0-9-]+\.webp$/,key);
  assert.ok(existsSync(new URL('../'+image.src.slice(1),import.meta.url)),key);
  assert.ok(image.origin,key);
  assert.ok(image.width>0&&image.height>0,key);
  if(image.source==='ai')assert.match(image.caption,/AI-generated illustration/,key);
 }
});
test('related variants share photos while different service families stay distinct',()=>{
 const get = id => treatmentImage(offerings.find(o=>o.id===id)).key;
 assert.equal(get('hair-001'),get('hair-002'));
 assert.notEqual(get('beauty-028'),get('beauty-030'));
 assert.notEqual(get('beauty-064'),get('beauty-065'));
 assert.notEqual(get('cosmetic-hair-removal'),get('cosmetic-carbon-peeling'));
 for(const id of ['cosmetic-acne-treatment','cosmetic-hair-treatment','cosmetic-laser-pigmentation','cosmetic-hair-removal']) assert.equal(treatmentImage(offerings.find(o=>o.id===id)).source,'ai');
});
test('unknown offerings use an explicitly illustrative neutral fallback',()=>{
 assert.equal(treatmentImage({id:'new-service',area:'wellness',category:'New'}).key,'fallback');
 assert.match(treatmentImage({id:'new-service',area:'wellness',category:'New'}).caption,/AI-generated illustration/);
});
