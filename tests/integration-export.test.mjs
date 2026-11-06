import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const output=new URL('../dist/JanusClinic/',import.meta.url);
test('new Pages entries use repository-prefixed scripts, local motion and photo-compatible CSP',async()=>{
 for(const route of ['profile','profile-preview','booking-preview','about','contact','book','wellness/book']){
  const html=await readFile(new URL(route+'/index.html',output),'utf8');
  assert.match(html,/src="\/JanusClinic\/site\/app\//);assert.match(html,/src="\/JanusClinic\/site\/assets\/ios-motion.js"/);
  assert.match(html,/img-src 'self' data: blob:/);assert.match(html,/frame-src https:\/\/www.google.com/);assert.match(html,/form-action 'none'/);
 }
 const detail=await readFile(new URL('services/medical-cosmetic/collagen-treatment/index.html',output),'utf8');
 assert.match(detail,/book\/\?offering=cosmetic-collagen-treatment/);assert.doesNotMatch(detail,/data-preview-action="disabled"[^>]*>Book/);
 assert.match(detail,/frame-src 'none'/);
});
