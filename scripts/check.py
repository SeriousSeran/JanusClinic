"""Validate captured file integrity and every local page/asset reference."""
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import parse_qs, unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / 'public'
manifest = json.loads((ROOT / 'capture-manifest.json').read_text())
ORIGIN = manifest['origin']
HOSTS = {urlsplit(ORIGIN).hostname, 'janusestheticlinique.com'}
errors = []
checked = 0


def check_url(value, page):
    global checked
    url = urlsplit(urljoin(ORIGIN + page, value))
    if url.scheme not in {'http', 'https'} or url.hostname not in HOSTS:
        return
    path = unquote(url.path) or '/'
    if path == '/_next/image':
        path = parse_qs(url.query).get('url', [''])[0]
    target = PUBLIC / path.lstrip('/')
    if target.is_dir():
        target /= 'index.html'
    checked += 1
    if not target.is_file():
        errors.append(f'{page}: missing local reference {value}')


class References(HTMLParser):
    def __init__(self, page):
        super().__init__()
        self.page = page

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ('src', 'href', 'srcset', 'imagesrcset'):
            if key not in attrs:
                continue
            values = attrs[key].split(',') if 'srcset' in key else [attrs[key]]
            for value in values:
                if value.strip():
                    check_url(value.strip().split(' ')[0], self.page)


for group in ('pages', 'assets'):
    for entry in manifest[group]:
        file = ROOT / entry['file']
        if not file.is_file():
            errors.append(f"Missing capture file: {entry['file']}")
        elif hashlib.sha256(file.read_bytes()).hexdigest() != entry['sha256']:
            errors.append(f"Capture changed: {entry['file']}. Review edits before refreshing.")
for entry in manifest['pages']:
    path = urlsplit(entry['source_url']).path or '/'
    References(path).feed((ROOT / entry['file']).read_text())
for css in PUBLIC.rglob('*.css'):
    path = '/' + css.relative_to(PUBLIC).as_posix()
    for value in re.findall(r'url\(([^)]+)\)', css.read_text()):
        check_url(value.strip('\"\''), path)
if errors:
    raise SystemExit('\n'.join(errors))
print(f"Verified {len(manifest['pages'])} pages, {len(manifest['assets'])} assets and {checked} local references.")
