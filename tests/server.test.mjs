import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Removing the root restriction or image-url validation would fail these HTTP tests.
test('serves the archive without exposing files or accepting writes', async (t) => {
  const { createSiteServer } = await import('../server.mjs');
  const parent = await mkdtemp(join(tmpdir(), 'janus-server-'));
  const root = join(parent, 'public');
  await mkdir(join(root, 'images'), { recursive: true });
  await mkdir(join(root, 'about'), { recursive: true });
  await writeFile(join(root, 'index.html'), '<h1>Janus</h1>');
  await writeFile(join(root, 'about/index.html'), '<h1>About</h1>');
  await writeFile(join(root, 'images/test.png'), Buffer.from([137, 80, 78, 71]));
  await writeFile(join(parent, 'private.txt'), 'private');
  const server = createSiteServer({ root });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await rm(parent, { recursive: true }); });
  for (const path of ['/', '/about', '/about/', '/about?_rsc=123']) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.match(await response.text(), /<h1>/);
  }
  const image = await fetch(origin + '/_next/image?url=%2Fimages%2Ftest.png&w=640&q=75');
  assert.equal(image.status, 200);
  assert.equal(image.headers.get('content-type'), 'image/png');
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), Buffer.from([137, 80, 78, 71]));
  for (const path of ['/missing', '/_next/image?url=https://example.com/a.png', '/_next/image?url=%2F..%2Fprivate.txt', '/%2e%2e%2fprivate.txt', '/%00']) {
    assert.ok([400, 404].includes((await fetch(origin + path)).status), path);
  }
  const head = await fetch(origin + '/about', { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.equal((await fetch(origin + '/about', { method: 'POST', body: 'test' })).status, 405);
});
