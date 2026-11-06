import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {groupSalonOfferings} from '../frontend/lib/salon-families.ts';
const source=JSON.parse(readFileSync(new URL('../content/salon/catalog.draft.json',import.meta.url)));
const offerings=source.items.map(o=>({id:o.id,name:o.name,category:o.category_id,price:o.price_lkr}));
test('family grouping preserves every original ID and price exactly once',()=>{
 const groups=groupSalonOfferings(offerings);
 assert.equal(groups.flatMap(g=>g.variants).length,123);
 assert.deepEqual(groups.flatMap(g=>g.variants).map(o=>o.id).sort(),offerings.map(o=>o.id).sort());
 assert.ok(groups.length<offerings.length);
 for(const o of groups.flatMap(g=>g.variants))assert.equal(o.price,offerings.find(s=>s.id===o.id).price);
});
test('length variants group without mixing crown, whole-head or different procedures',()=>{
 const groups=groupSalonOfferings(offerings);
 const family=id=>groups.find(g=>g.variants.some(o=>o.id===id));
 assert.deepEqual(family('hair-023').variants.map(o=>o.id),['hair-023','hair-024','hair-025']);
 assert.deepEqual(family('hair-026').variants.map(o=>o.id),['hair-026','hair-027','hair-028']);
 assert.notEqual(family('hair-023').key,family('hair-026').key);
 assert.notEqual(family('beauty-028').key,family('beauty-029').key);
 assert.equal(family('hair-019').variants[0].price,6800);
 assert.equal(family('hair-019').variants.length,1);
});
