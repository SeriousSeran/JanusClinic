import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root));
const manifest = JSON.parse(read('site/uploaded-images.json'));
test('all supplied images are optimized and the approved doctor portrait remains unchanged', () => {
  assert.equal(manifest.images.length, 40);
  assert.equal(new Set(manifest.images.map(image => image.filename)).size, 40);
  for (const image of manifest.images) {
    for (const path of [image.src, image.thumbnail]) {
      const bytes = read(path.slice(1));
      assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', path);
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', path);
    }
  }
  assert.equal(createHash('sha256').update(read('site/assets/practitioner-owner-supplied.jpg')).digest('hex'), manifest.doctorPortraitSHA256);
});
test('exported treatment pages use the correct replacement instead of the former portrait or mismatched stock image', () => {
  const cases = {'medical-cosmetic/hair-treatment':'scalp-assessment','medical-cosmetic/hair-removal':'laser-hair-reduction','beauty/hair-services':'haircut-detail','therapy/cryolipolysis':'cryolipolysis'};
  for (const [route, filename] of Object.entries(cases)) {
    const html = read('dist/JanusClinic/services/'+route+'/index.html').toString();
    assert.ok(html.includes('/JanusClinic/site/assets/treatments/janus-'+filename+'.webp'), route);
    assert.ok(html.includes('AI-generated illustration:'), route);
  }
  const gallery=read('dist/JanusClinic/image-review/index.html').toString();
  for (const image of manifest.images) assert.ok(gallery.includes(image.src), image.filename);
});
