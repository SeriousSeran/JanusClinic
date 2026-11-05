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
  assert.match(home, /Care, in every/);
  assert.match(home, /href="\/JanusClinic\/services"/);
  assert.match(home, /src="\/JanusClinic\/site\/assets\/cosmetic.webp"/);
  assert.match(home, /noindex, nofollow/);
  assert.match(home, /Design preview/);
  for (const area of ['cosmetic', 'salon', 'wellness']) {
    assert.match(home, new RegExp('href="/JanusClinic/' + area + '/"'));
    const page = await readFile(join(output, area, 'index.html'), 'utf8');
    assert.match(page, /id="main-content"/);
  }
  const salon = await readFile(join(output, 'salon/index.html'), 'utf8');
  assert.equal((salon.match(/data-service-id=/g) || []).length, 123);
  assert.match(salon, /data-service-id="hair-019"[\s\S]*?6,800/);
  assert.doesNotMatch(salon, /data-service-id="hair-020"/);
  assert.match(salon, /Body care/);
  assert.match(salon, /before 08:30/);
  assert.match(salon, /Wording to confirm/);
  for (const [id, minutes] of [['hair-042', 60], ['hair-043', 20], ['beauty-026', 60], ['beauty-028', 60]]) {
    const row = salon.match(new RegExp('<tr data-service-id="' + id + '">([\\s\\S]*?)</tr>'))?.[1];
    assert.ok(row?.includes(`${minutes} min`), `${id} must show its catalog duration`);
  }
  const wellness = await readFile(join(output, 'wellness/index.html'), 'utf8');
  assert.match(wellness, /being developed/);
  assert.doesNotMatch(wellness, /LKR|Tier 1|Tier 2|Tier 3/);
  const cosmetic = await readFile(join(output, 'cosmetic/index.html'), 'utf8');
  assert.match(cosmetic, /services\/medical-cosmetic\/botox/);
  const treatment = await readFile(join(output, 'services/medical-cosmetic/botox/index.html'), 'utf8');
  for (const area of ['cosmetic', 'salon', 'wellness']) assert.match(treatment, new RegExp('href="/JanusClinic/' + area + '/"'));

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
