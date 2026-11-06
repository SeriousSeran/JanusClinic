import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url));
const set2=JSON.parse(read('site/uploaded-images-set2.json')).images;
const data=JSON.parse(read('frontend/data/treatment-images.json'));
test('all 29 new uploads have valid optimized copies and are assigned to a service or assessment section',()=>{
 assert.equal(set2.length,29);assert.equal(new Set(set2.map(i=>i.filename)).size,29);
 for(const image of set2){
  for(const path of [image.src,image.thumbnail])assert.equal(read(path.slice(1)).toString('ascii',8,12),'WEBP',path);
  assert.match(image.caption,/AI-generated/);
  const key=image.filename.replace('.jpg','');
  assert.deepEqual(data.images[key].src,image.src);
  if(key.endsWith('body-composition-check'))assert.ok(read('frontend/pages/Wellness.tsx').includes(image.src));
  else assert.ok(Object.values(data.offerings).includes(key),key);
 }
});
test('distinct salon actions use distinct uploads and price variants share one intended image',()=>{
 const get=id=>data.offerings[id];
 assert.equal(get('hair-023'),get('hair-025'));
 const ids=['hair-001','hair-004','hair-007','hair-023','hair-026','hair-029','hair-032','hair-033','hair-036'];
 assert.equal(new Set(ids.map(get)).size,ids.length);
 assert.equal(get('beauty-034'),'janus-missing-saree-draping');
 assert.equal(get('beauty-024'),'janus-missing-high-frequency-facial');
 assert.equal(get('beauty-069'),get('beauty-070'));
});
test('new detail-page galleries and complete 69-image review export with repository-prefixed image paths',()=>{
 const gallery=read('dist/JanusClinic/image-review/index.html').toString();
 for(const image of set2)assert.ok(gallery.includes('/JanusClinic'+image.src),image.filename);
 for(const slug of ['hair-services','facials','bridal','nails']){
  const html=read('dist/JanusClinic/services/beauty/'+slug+'/index.html').toString();
  assert.ok(html.includes('salon-detail-imagery'));assert.ok(html.includes('/JanusClinic/site/assets/treatments/janus-missing-'));
 }
});
