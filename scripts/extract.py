"""Capture the public site using curl's inherited proxy and verified TLS trust."""
import concurrent.futures
from datetime import datetime, timezone
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
from urllib.parse import parse_qs, urljoin, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
ORIGIN = 'https://www.janusestheticlinique.com'
HOSTS = {'janusestheticlinique.com', 'www.janusestheticlinique.com'}


def local_path(url):
    parsed = urlsplit(urljoin(ORIGIN + '/', url))
    if parsed.scheme != 'https' or parsed.hostname not in HOSTS:
        raise ValueError(f'Not a source-site URL: {url}')
    path = parsed.path or '/'
    if any(part in {'.', '..'} for part in path.split('/')) or '\\' in path or '%' in path:
        raise ValueError(f'Unsafe capture path: {path}')
    return path


def download(path, target):
    target.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(['curl', '--fail', '--silent', '--show-error', '--location',
                    '--proto', '=https', '--proto-redir', '=https', '--max-time', '60',
                    '--retry', '2', ORIGIN + path, '--output', str(target)], check=True)
    return {'source_url': ORIGIN + path, 'file': target.as_posix(),
            'bytes': target.stat().st_size,
            'sha256': hashlib.sha256(target.read_bytes()).hexdigest()}


class PageAssets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = set()
        self.external = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag not in {'img', 'script', 'link', 'source', 'iframe'}:
            return
        for key in ('src', 'href', 'srcset', 'imagesrcset'):
            values = attrs.get(key, '')
            for value in (values.split(',') if 'srcset' in key else [values]):
                if not value.strip():
                    continue
                value = value.strip().split(' ')[0]
                parsed = urlsplit(urljoin(ORIGIN + '/', value))
                if parsed.hostname not in HOSTS:
                    self.external.add(value)
                    continue
                if parsed.path == '/_next/image':
                    self.paths.add(local_path(parse_qs(parsed.query)['url'][0]))
                elif parsed.path.startswith(('/_next/static/', '/images/')) or parsed.path == '/icon.png':
                    self.paths.add(local_path(value))


def main():
    with tempfile.TemporaryDirectory(prefix='.capture-staging-', dir=ROOT) as temporary:
        staging = Path(temporary)
        public = staging / 'public'
        public.mkdir()
        download('/sitemap.xml', public / 'sitemap.xml')
        download('/robots.txt', public / 'robots.txt')
        sitemap = ET.parse(public / 'sitemap.xml')
        paths = sorted({local_path(element.text) for element in sitemap.iter()
                        if element.tag.endswith('}loc')})
        if not paths or len(paths) > 200:
            raise ValueError('Unexpected sitemap size; inspect before capturing')
        records = {'pages': [], 'assets': []}
        def page(path):
            return download(path, public / path.lstrip('/') / 'index.html')
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
            records['pages'] = list(pool.map(page, paths))
        scan = PageAssets()
        for path in paths:
            scan.feed((public / path.lstrip('/') / 'index.html').read_text())
        def asset(path):
            return download(path, public / path.lstrip('/'))
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
            records['assets'] = list(pool.map(asset, sorted(scan.paths)))
        # Font subsets referenced only by CSS must be retained too.
        dependencies = set()
        for css in public.rglob('*.css'):
            path = '/' + css.relative_to(public).as_posix()
            for value in re.findall(r'url\(([^)]+)\)', css.read_text()):
                if value.startswith('data:'):
                    continue
                dependencies.add(local_path(urljoin(ORIGIN + path, value.strip('\"\''))))
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
            records['assets'].extend(pool.map(asset, sorted(dependencies - scan.paths)))
        for path in ['/sitemap.xml', '/robots.txt']:
            target = public / path.lstrip('/')
            records['assets'].append({'source_url': ORIGIN + path, 'file': target.as_posix(),
                                     'bytes': target.stat().st_size,
                                     'sha256': hashlib.sha256(target.read_bytes()).hexdigest()})
        for entries in records.values():
            for entry in entries:
                entry['file'] = 'public/' + Path(entry['file']).relative_to(public).as_posix()
        manifest = {'origin': ORIGIN, 'captured_at': datetime.now(timezone.utc).isoformat(),
                    'external_integrations': sorted(scan.external), **records}
        (staging / 'capture-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
        destination = ROOT / 'public'
        if destination.is_symlink():
            raise ValueError('Refusing to replace a symlinked public directory')
        # Do not replace the current capture until every download has succeeded.
        previous = staging / 'previous'
        if destination.exists():
            destination.rename(previous)
        try:
            public.rename(destination)
            (staging / 'capture-manifest.json').replace(ROOT / 'capture-manifest.json')
        except BaseException:
            if previous.exists():
                if destination.exists():
                    shutil.rmtree(destination)
                previous.rename(destination)
            raise
        print(f"Captured {len(records['pages'])} pages and {len(records['assets'])} assets.")


if __name__ == '__main__':
    main()
