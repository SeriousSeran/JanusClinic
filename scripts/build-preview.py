"""Build a read-only, server-free review site; leave the original capture untouched."""
import argparse
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import shutil
import tempfile
from urllib.parse import parse_qs, urlsplit

ROOT = Path(__file__).resolve().parent.parent
HOSTS = {'janusestheticlinique.com', 'www.janusestheticlinique.com'}
CSP = "default-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'none'; form-action 'none'; base-uri 'self'; object-src 'none'"


class Scripts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.active = False
        self.scripts = []
    def handle_starttag(self, tag, attrs):
        if tag == 'script':
            self.active = True
            self.scripts.append('')
    def handle_data(self, text):
        if self.active:
            self.scripts[-1] += text
    def handle_endtag(self, tag):
        if tag == 'script':
            self.active = False


def faq_content(source):
    scripts = Scripts()
    scripts.feed(source)
    chunks = []
    for script in scripts.scripts:
        prefix = 'self.__next_f.push('
        if script.startswith(prefix):
            value = json.loads(script[len(prefix):script.rfind(')')])
            if len(value) > 1 and value[0] == 1 and isinstance(value[1], str):
                chunks.append(value[1])
    flight = ''.join(chunks)
    faqs = []
    for match in re.finditer(r'"faqs"\s*:', flight):
        data, _ = json.JSONDecoder().raw_decode(flight[match.end():].lstrip())
        faqs.extend({'question': entry['question'], 'answer': entry['answer']} for entry in data)
    expected = source.count('aria-expanded="false"') - (1 if 'Open navigation menu' in source else 0)
    if expected != len(faqs):
        raise ValueError(f'FAQ extraction incomplete: expected {expected}, found {len(faqs)}')
    return faqs


class PreviewHTML(HTMLParser):
    def __init__(self, base):
        super().__init__(convert_charrefs=False)
        self.base = base
        self.output = []
        self.skip_script = False
        self.skip_iframe = False

    def local_url(self, value):
        url = urlsplit(value)
        if url.scheme in {'tel', 'mailto'} or url.hostname == 'wa.me':
            return '#preview-notice'
        if url.netloc and url.hostname not in HOSTS:
            return value
        if not url.path.startswith('/'):
            return value
        if url.path == '/_next/image':
            path = parse_qs(url.query).get('url', [''])[0]
            if not path.startswith('/images/') or '..' in path.split('/'):
                raise ValueError('Unexpected image URL: ' + value)
            return self.base + path
        return self.base + url.path + ('?' + url.query if url.query else '') + ('#' + url.fragment if url.fragment else '')

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if tag == 'script':
            if data.get('src') != '/portfolio/portfolio.mjs':
                self.skip_script = True
                return
        if self.skip_script or self.skip_iframe:
            return
        if tag == 'iframe':
            self.skip_iframe = True
            self.output.append('<div class="preview-map">Map unavailable in the design preview.</div>')
            return
        if tag == 'link' and (data.get('as') == 'script' or data.get('rel') == 'canonical'):
            return
        if tag == 'meta' and data.get('name', '').lower() == 'robots':
            return
        if tag == 'input' and data.get('type') == 'hidden':
            return
        if tag == 'form':
            attrs = [(key, value) for key, value in attrs if key not in {'action', 'method', 'novalidate'}]
        rewritten = []
        for key, value in attrs:
            if key.startswith('on'):
                continue
            if value is not None and key in {'src', 'href', 'poster', 'action'}:
                original = value
                value = self.local_url(value)
                if tag == 'a' and value == '#preview-notice' and original != value:
                    rewritten.append(('data-preview-action', 'disabled'))
            if value is not None and key in {'srcset', 'imagesrcset'}:
                parts = []
                for entry in value.split(','):
                    fields = entry.strip().split()
                    if fields:
                        parts.append(' '.join([self.local_url(fields[0]), *fields[1:]]))
                value = ', '.join(parts)
            rewritten.append((key, value))
        attributes = ''.join(' ' + key + ('' if value is None else '="' + html.escape(value, quote=True) + '"') for key, value in rewritten)
        self.output.append('<' + tag + attributes + '>')
        if tag == 'form':
            self.output.append('<p class="preview-form-note">Design preview only. No enquiry or booking will be sent.</p>')

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag == 'script' and self.skip_script:
            self.skip_script = False
            return
        if tag == 'iframe' and self.skip_iframe:
            self.skip_iframe = False
            return
        if self.skip_script or self.skip_iframe:
            return
        if tag == 'head':
            self.output.append('<meta name="robots" content="noindex, nofollow"><meta http-equiv="Content-Security-Policy" content="' + html.escape(CSP, quote=False) + '"><link rel="stylesheet" href="' + self.base + '/preview/site.css">')
        if tag == 'body':
            self.output.append('<aside class="preview-bar" aria-label="Preview controls"><strong>Design preview</strong><span id="preview-notice" role="status" tabindex="-1">Forms and booking actions are disabled.</span><a href="' + self.base + '/portfolio/">Design portfolio</a></aside><script defer src="' + self.base + '/preview/site.js"></script>')
        self.output.append('</' + tag + '>')

    def handle_data(self, text):
        if not self.skip_script and not self.skip_iframe:
            self.output.append(text)
    def handle_entityref(self, name):
        if not self.skip_script and not self.skip_iframe:
            self.output.append('&' + name + ';')
    def handle_charref(self, name):
        if not self.skip_script and not self.skip_iframe:
            self.output.append('&#' + name + ';')
    def handle_decl(self, value):
        self.output.append('<!' + value + '>')
    def handle_comment(self, value):
        if not self.skip_script and not self.skip_iframe:
            self.output.append('<!--' + value + '-->')


class Audit(HTMLParser):
    def __init__(self, output, base):
        super().__init__()
        self.output = output
        self.base = base
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if not value or key not in {'src', 'href', 'srcset', 'imagesrcset'}:
                continue
            for entry in value.split(',') if 'srcset' in key else [value]:
                url = urlsplit(entry.strip().split()[0])
                if url.netloc or url.scheme:
                    continue
                path = url.path
                if not path.startswith('/'):
                    continue
                if not path.startswith(self.base + '/') and path != self.base:
                    raise ValueError('Unprefixed local URL: ' + path)
                target = self.output / path[len(self.base):].lstrip('/')
                if target.is_dir():
                    target /= 'index.html'
                if not target.is_file():
                    raise ValueError('Missing static target: ' + path)


def build(destination, base):
    manifest = json.loads((ROOT / 'capture-manifest.json').read_text())
    destination = destination.resolve()
    if destination.exists() and not (destination / 'preview-manifest.json').is_file():
        raise ValueError('Refusing to replace an output directory without the preview build marker.')
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='.preview-build-', dir=destination.parent) as temporary:
        output = Path(temporary) / 'next'
        output.mkdir()
        for asset in manifest['assets']:
            source = ROOT / asset['file']
            if source.suffix == '.js' or source.name in {'robots.txt', 'sitemap.xml'}:
                continue
            target = output / source.relative_to(ROOT / 'public')
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, target)
        faq_data = {}
        for page in manifest['pages']:
            source = (ROOT / page['file']).read_text()
            route = urlsplit(page['source_url']).path or '/'
            faq_data[route] = faq_content(source)
            parser = PreviewHTML(base)
            parser.feed(source)
            target = output / Path(page['file']).relative_to('public')
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(''.join(parser.output))
        shutil.copytree(ROOT / 'reference/portfolio', output / 'portfolio', ignore=shutil.ignore_patterns('.*'))
        source = (output / 'portfolio/index.html').read_text()
        parser = PreviewHTML(base)
        parser.feed(source)
        (output / 'portfolio/index.html').write_text(''.join(parser.output))
        shutil.copytree(ROOT / 'preview', output / 'preview')
        (output / 'preview/faq-data.json').write_text(json.dumps(faq_data, ensure_ascii=False))
        (output / 'robots.txt').write_text('User-agent: *\nDisallow: /\n')
        (output / '.nojekyll').write_text('')
        (output / '404.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Preview page not found</title><h1>Preview page not found</h1><a href="' + base + '/">Return to the preview</a></html>')
        (output / 'preview-manifest.json').write_text(json.dumps({'base_path': base, 'captured_pages': len(manifest['pages']), 'mode': 'read-only-design-preview'}, indent=2))
        audit = Audit(output, base)
        for page in output.rglob('*.html'):
            audit.feed(page.read_text())
        previous = Path(temporary) / 'previous'
        if destination.exists():
            destination.rename(previous)
        try:
            output.rename(destination)
        except BaseException:
            if previous.exists():
                previous.rename(destination)
            raise
    print(f"Built {len(manifest['pages'])} captured pages + portfolio; {sum(map(len, faq_data.values()))} FAQ answers; all static references verified.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-path', default='/JanusClinic')
    parser.add_argument('--output', type=Path, default=ROOT / 'dist/JanusClinic')
    args = parser.parse_args()
    base = args.base_path.rstrip('/')
    if not re.fullmatch(r'/[A-Za-z0-9_-]+', base):
        parser.error('Use a single repository-name base path, such as /JanusClinic')
    build(args.output, base)
