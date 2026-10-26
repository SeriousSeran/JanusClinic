import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json', '.pdf': 'application/pdf',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
};

export function createSiteServer({
  root = resolve(projectRoot, 'public'),
  portfolioRoot = resolve(projectRoot, 'reference/portfolio'),
} = {}) {
  root = resolve(root);
  portfolioRoot = resolve(portfolioRoot);
  return createServer(async (request, response) => {
    const fail = (status, message) => {
      response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(request.method === 'HEAD' ? undefined : message);
    };
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.setHeader('Allow', 'GET, HEAD');
      return fail(405, 'Method not allowed');
    }
    try {
      const url = new URL(request.url, 'http://localhost');
      let path = decodeURIComponent(url.pathname);
      if (path === '/_next/image') {
        // Use downloaded originals. Never fetch arbitrary URLs from this endpoint.
        path = url.searchParams.get('url') || '';
        if (!path.startsWith('/images/')) return fail(400, 'Invalid local image');
      }
      if (!path.startsWith('/') || path.includes('\\') || path.includes('\0') ||
          path.split('/').some(segment => segment.startsWith('.'))) {
        return fail(400, 'Invalid path');
      }
      // Authored identity references survive refreshes of the generated public capture.
      const isPortfolio = path === '/portfolio' || path.startsWith('/portfolio/');
      const servingRoot = isPortfolio ? portfolioRoot : root;
      if (isPortfolio) path = path.slice('/portfolio'.length) || '/';
      let file = resolve(servingRoot, '.' + path);
      if (file !== servingRoot && !file.startsWith(servingRoot + sep)) return fail(400, 'Invalid path');
      let info = await stat(file);
      if (info.isDirectory()) {
        file = resolve(file, 'index.html');
        info = await stat(file);
      }
      if (!info.isFile()) return fail(404, 'Page not found');
      const [actualFile, actualRoot] = await Promise.all([realpath(file), realpath(servingRoot)]);
      if (!actualFile.startsWith(actualRoot + sep)) return fail(404, 'Page not found');
      response.writeHead(200, {
        'Content-Type': types[extname(file).toLowerCase()] || 'application/octet-stream',
        'Content-Length': info.size,
        'X-Content-Type-Options': 'nosniff',
        // HTML also answers Next router requests, causing its documented full-page fallback.
        'Cache-Control': 'no-cache',
      });
      response.end(request.method === 'HEAD' ? undefined : await readFile(file));
    } catch (error) {
      if (error instanceof URIError || error.code === 'ERR_INVALID_URL') return fail(400, 'Invalid URL');
      if (['ENOENT', 'ENOTDIR', 'EACCES'].includes(error.code)) return fail(404, 'Page not found');
      console.error('Unable to serve request:', error.message);
      if (!response.headersSent) fail(500, 'Unable to serve page');
      else response.destroy();
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || '127.0.0.1';
  const server = createSiteServer();
  server.listen(port, host, () => console.log(`Janus website listening on ${host}:${port}`));
  for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close(() => process.exit(0)));
}
