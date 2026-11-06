import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { products,normalizeCart,cartLines,cartTotal,orderMessage } from '../frontend/lib/cart.ts';
const contact={name:'Fictional Client',phone:'+94771234567',fulfilment:'pickup',address:'',notes:'A question & collection time?'};
test('cart accepts only catalogue items, normalizes persisted quantities and calculates using published prices',()=>{
 assert.deepEqual(normalizeCart({'cinteric-gel':2,unknown:3,'antiseptic-soap':-1,'cinteric-shampoo-3':1.5,'cinteric-shampoo-5':500}),{'cinteric-gel':2,'cinteric-shampoo-5':20});
 assert.equal(cartTotal({'cinteric-gel':2,'antiseptic-soap':1}),3800);
 assert.equal(cartLines({'cinteric-gel':0}).length,0);
 assert.deepEqual(normalizeCart(null),{});
 assert.deepEqual(normalizeCart([]),{});
 for(const p of products){const html=readFileSync(new URL('../public/products/'+p.id+'/index.html',import.meta.url),'utf8');assert.ok(html.includes('"price":'+p.price),p.id);}
});
test('WhatsApp order draft includes products, quantities, contact, fulfilment and unconfirmed delivery charges',()=>{
 const text=orderMessage({'cinteric-gel':2},contact);
 assert.match(text,/2 × LKR 1,250 = LKR 2,500/);assert.match(text,/Fictional Client/);assert.match(text,/Clinic pickup/);assert.match(text,/final total and payment/);assert.doesNotMatch(text,/Delivery address:/);
 const delivery=orderMessage({'cinteric-gel':1},{...contact,fulfilment:'delivery',address:'Fictional address'});
 assert.match(delivery,/Delivery address: Fictional address/);assert.match(delivery,/any delivery fee/);
 const url=new URL('https://wa.me/94777060404?text='+encodeURIComponent(text));assert.equal(url.searchParams.get('text'),text);
 assert.throws(()=>orderMessage({},contact));assert.throws(()=>orderMessage({'cinteric-gel':1},{...contact,phone:'+++++++'}));assert.throws(()=>orderMessage({'cinteric-gel':1},{...contact,fulfilment:'delivery',address:''}));
});
test('catalogue, cart, checkout and all product details export the new application at their existing URLs',()=>{
 for(const route of ['products','products/cart','products/checkout',...products.map(p=>'products/'+p.id)]){
 const html=readFileSync(new URL('../dist/JanusClinic/'+route+'/index.html',import.meta.url),'utf8');assert.match(html,/\/JanusClinic\/site\/app\/index-/);}
});
