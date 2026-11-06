import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

test('exports a read-only site under the GitHub project path without the Node server', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'janus-pages-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const output = join(directory, 'JanusClinic');
  const result = spawnSync('python3', ['scripts/build-preview.py', '--output', output, '--base-path', '/JanusClinic'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const home = await readFile(join(output, 'index.html'), 'utf8');
  assert.match(home, /id="root"/);
  assert.match(home, /type="module"[^>]*src="\/JanusClinic\/site\/app\//);
  assert.match(home, /noindex, nofollow/);
  for (const area of ['cosmetic', 'salon', 'wellness', 'book', 'wellness/book', 'wellness/body-contouring']) {
    const page = await readFile(join(output, area, 'index.html'), 'utf8');
    assert.match(page, /id="main-content"/);
    assert.match(page, /site\/app\//);
  }
  const portableCatalog = await readFile(join(output, 'site/assets/salon-catalog.jpg'));
  assert.equal(portableCatalog.subarray(0,2).toString('hex'), 'ffd8');
  const treatment = await readFile(join(output, 'services/medical-cosmetic/botox/index.html'), 'utf8');
  for (const area of ['cosmetic', 'salon', 'wellness']) assert.match(treatment, new RegExp('href="/JanusClinic/' + area + '/"'));
  assert.match(treatment, /legacy-theme.css/);
  assert.doesNotMatch(home, /self\.__next_f|\/_next\/image\?|googletagmanager/);
  const contact = await readFile(join(output, 'contact/index.html'), 'utf8');
  assert.doesNotMatch(contact, /name="access_key"|wa\.me|mailto:|tel:/);
  assert.match(contact, /form-action 'none'/);
  const faqs = JSON.parse(await readFile(join(output, 'preview/faq-data.json')));
  assert.ok(faqs['/services/medical-cosmetic/botox'].find(f => f.question === 'Does BOTOX hurt?' && f.answer.includes('needles')));
  const portfolio = await readFile(join(output, 'portfolio/index.html'), 'utf8');
  assert.match(portfolio, /\/JanusClinic\/portfolio\/learning-guide.pdf/);
  assert.match(portfolio, /\/JanusClinic\/portfolio\/portfolio.mjs/);
  const inventory = JSON.parse(await readFile(join(output, 'portfolio/capture/pages.json')));
  assert.equal(inventory.pages.length, 43);
});
