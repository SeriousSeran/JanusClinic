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
    def __init__(self, base, imagery=None, area_navigation=True, booking_id=None, booking_area=None):
        super().__init__(convert_charrefs=False)
        self.imagery = imagery or {}
        self.area_navigation = area_navigation
        self.booking_id = booking_id
        self.booking_area = booking_area
        self.illustrative_portrait = False
        self.base = base
        self.output = []
        self.skip_script = False
        self.skip_iframe = False

    def local_url(self, value):
        url = urlsplit(value)
        if url.hostname == 'wa.me' or url.path.rstrip('/') in {'/book', '/booking'}:
            return self.base + '/book/' + ('?offering=' + self.booking_id if self.booking_id else ('?area=' + self.booking_area if self.booking_area else ''))
        if url.scheme in {'tel', 'mailto'}:
            return '#preview-notice'
        if url.netloc and url.hostname not in HOSTS:
            return value
        if not url.path.startswith('/'):
            return value
        if url.path == '/_next/image':
            path = parse_qs(url.query).get('url', [''])[0]
            if not path.startswith('/images/') or '..' in path.split('/'):
                raise ValueError('Unexpected image URL: ' + value)
            return self.base + self.imagery.get(path, path)
        return self.base + self.imagery.get(url.path, url.path) + ('?' + url.query if url.query else '') + ('#' + url.fragment if url.fragment else '')

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        mapped_portrait = tag == 'img' and self.imagery and self.local_url(data.get('src', '')).startswith(self.base + '/site/assets/')
        if mapped_portrait:
            self.illustrative_portrait = True
            attrs = [(key, 'AI-generated illustrative Sri Lankan model; not a patient or treatment result' if key == 'alt' else value) for key, value in attrs]
        if tag == 'script':
            if data.get('src') not in {'/portfolio/portfolio.mjs'}:
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
        if tag == 'body':
            self.output.append('<noscript><style>.janus-loader{display:none}</style></noscript><div class="janus-loader" role="status" aria-label="Loading Janus"><div class="janus-loader-inner"><div class="janus-loader-logo"><svg class="janus-loader-orbit" viewBox="0 0 120 120" aria-hidden="true"><circle class="janus-loader-track" cx="60" cy="60" r="54"/><circle class="janus-loader-arc" cx="60" cy="60" r="54" pathLength="100"/></svg><span class="janus-loader-dots" aria-hidden="true"><i></i><i></i><i></i></span><img src="' + self.base + '/images/logo-header.png" alt="Janus Clinic" width="220" height="52"></div><p>A moment for you.</p></div></div>')
        if tag == 'body' and self.area_navigation:
            self.output.append('<nav class="preview-areas" aria-label="Janus areas"><a href="' + self.base + '/">Janus</a><a href="' + self.base + '/cosmetic/">Cosmetic</a><a href="' + self.base + '/salon/">Salon</a><a href="' + self.base + '/wellness/">Wellness</a></nav>')
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
            self.output.append('<meta name="robots" content="noindex, nofollow"><meta http-equiv="Content-Security-Policy" content="' + html.escape(CSP, quote=False) + '"><link rel="stylesheet" href="' + self.base + '/preview/site.css"><link rel="stylesheet" href="' + self.base + '/site/assets/legacy-theme.css"><link rel="stylesheet" href="' + self.base + '/site/assets/ios-interface.css"><link rel="stylesheet" href="' + self.base + '/site/assets/janus-loader.css">')
        if tag == 'body':
            if self.illustrative_portrait:
                self.output.append('<p class="preview-illustration-note">Model portraits on this page include AI-generated illustrations, not patient photographs or treatment results.</p>')
            self.output.append('<aside class="preview-bar" aria-label="Preview controls"><strong>Design preview</strong><span id="preview-notice" role="status" tabindex="-1">Forms and booking actions are disabled.</span><a href="' + self.base + '/portfolio/">Design portfolio</a></aside><script defer src="' + self.base + '/preview/site.js"></script><script defer src="' + self.base + '/site/assets/ios-motion.js"></script>')
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


def build(destination, base, react_root):
    manifest = json.loads((ROOT / 'capture-manifest.json').read_text())
    destination = destination.resolve()
    if destination.exists() and not (destination / 'preview-manifest.json').is_file():
        raise ValueError('Refusing to replace an output directory without the preview build marker.')
    destination.parent.mkdir(parents=True, exist_ok=True)
    imagery = json.loads((ROOT / 'site/imagery.json').read_text())['replacements']
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
            slug = route.rstrip('/').split('/')[-1]
            treatments = json.loads((ROOT / 'site/content.json').read_text())['cosmetic_treatments']
            booking_id = 'cosmetic-' + slug if any(t['slug'] == slug for t in treatments) and '/medical-cosmetic/' in route else None
            if '/therapy/' in route:
                booking_id = {'cryolipolysis': 'wellness-fat-freezing', 'sauna': 'wellness-sauna', 'lipolysis': 'initial-consultation'}.get(slug)
            booking_area = 'salon' if '/beauty' in route else ('wellness' if '/therapy' in route else ('cosmetic' if '/medical-cosmetic' in route else None))
            parser = PreviewHTML(base, imagery, booking_id=booking_id, booking_area=booking_area)
            parser.feed(source)
            target = output / Path(page['file']).relative_to('public')
            target.parent.mkdir(parents=True, exist_ok=True)
            rendered = ''.join(parser.output)
            if not route.startswith(('/wellness', '/salon', '/services/beauty', '/services/therapy')):
                rendered = rendered.replace('<html', '<html data-janus-palette="rose"', 1)
                rendered = rendered.replace('</head>', '<link rel="stylesheet" href="' + base + '/site/assets/brand-rose.css"></head>')
            target.write_text(rendered)
        shutil.copytree(ROOT / 'site/assets', output / 'site/assets')
        shutil.copy2(ROOT / 'reference/catalogs/salon-catalog.jpg', output / 'site/assets/salon-catalog.jpg')
        shutil.copytree(react_root / 'site/app', output / 'site/app')
        shell = (react_root / 'index.html').read_text()
        shell = shell.replace('</head>', '<meta http-equiv="Content-Security-Policy" content="' + html.escape(CSP.replace("frame-src 'none'", "frame-src https://www.google.com").replace("img-src 'self' data:", "img-src 'self' data: blob:"), quote=False) + '"></head>')
        shell = shell.replace('</body>', '<script defer src="' + base + '/site/assets/ios-motion.js"></script></body>')
        routes = json.loads((ROOT / 'frontend/data/routes.json').read_text())
        for route in routes:
            target = output / route.lstrip('/') / 'index.html'
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(shell)
        shutil.copytree(ROOT / 'reference/portfolio', output / 'portfolio', ignore=shutil.ignore_patterns('.*'))
        source = (output / 'portfolio/index.html').read_text()
        parser = PreviewHTML(base, area_navigation=False)
        parser.feed(source)
        (output / 'portfolio/index.html').write_text(''.join(parser.output))
        shutil.copytree(ROOT / 'preview', output / 'preview')
        (output / 'preview/faq-data.json').write_text(json.dumps(faq_data, ensure_ascii=False))
        (output / 'robots.txt').write_text('User-agent: *\nDisallow: /\n')
        (output / '.nojekyll').write_text('')
        (output / '404.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Preview page not found</title><h1>Preview page not found</h1><a href="' + base + '/">Return to the preview</a></html>')
        loader_preview = output / 'loading-preview'
        loader_preview.mkdir()
        loader_shell = (ROOT / 'reference/loading-preview.html').read_text().replace('%BASE_URL%', base + '/')
        (loader_preview / 'index.html').write_text(loader_shell)
        # A review directory makes every authored and preserved destination discoverable.
        labels = {'/profile-preview/': 'Completed profile · read-only preview', '/booking-preview/': 'Booking page · read-only preview', '/profile/': 'Profile and Registration', '/': 'Janus home', '/services/': 'About us', '/about/': 'Meet your Doctor', '/contact/': 'Contact & Booking', '/book/': 'Register / Sign in to book', '/cosmetic/': 'Cosmetic Care', '/salon/': 'Salon', '/wellness/': 'Wellness Collection'}
        review_routes = {}
        for page in manifest['pages']:
            path = urlsplit(page['source_url']).path.rstrip('/') + '/'
            source = (ROOT / page['file']).read_text()
            title = re.search(r'<title>(.*?)</title>', source, re.S)
            review_routes[path] = html.unescape(title.group(1).split('|')[0].strip()) if title else path
        for path in routes:
            review_routes[path] = labels.get(path, path.strip('/').replace('/', ' · ').replace('-', ' ').title())
        review_routes.update(labels)
        review_routes['/loading-preview/'] = 'Janus loading animation · continuous preview'
        cards = ''.join('<a data-review-page href="' + base + path + '"><strong>' + html.escape(label) + '</strong><small>' + html.escape(path) + ' ↗</small></a>' for path, label in review_routes.items())
        review = output / 'design-review'
        review.mkdir()
        (review / 'index.html').write_text('<!doctype html><html lang="en" data-janus-palette="rose"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Explore the Janus redesign</title><meta http-equiv="Content-Security-Policy" content="' + html.escape(CSP, quote=True) + '"><link rel="stylesheet" href="' + base + '/_next/static/chunks/0ncapewydat_k.css"><link rel="stylesheet" href="' + base + '/site/assets/brand-rose.css"><link rel="stylesheet" href="' + base + '/site/assets/ios-interface.css"></head><body><main class="ios-review"><a href="' + base + '/">← Janus home</a><p>DESIGN REVIEW</p><h1>A seamless journey.<br>Every part of Janus.</h1><p>Explore the redesigned interface, including linked treatments, products and information pages. Salon and Wellness retain their own palettes. Registration and booking remain demonstrations.</p><label for="review-search">Find a page</label><input id="review-search" data-review-search type="search" placeholder="Search pages or treatments"><p data-review-count role="status">' + str(len(review_routes)) + ' pages to explore</p><div class="ios-review-grid">' + cards + '</div></main><script defer src="' + base + '/preview/site.js"></script></body></html>')
        (output / 'preview-manifest.json').write_text(json.dumps({'base_path': base, 'captured_pages': len(manifest['pages']), 'authored_pages': len(routes), 'mode': 'read-only-design-preview'}, indent=2))
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
    print(f"Built {len(manifest['pages'])} captured pages, {len(routes)} React routes + portfolio; {sum(map(len, faq_data.values()))} FAQ answers; all static references verified.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-path', default='/JanusClinic')
    parser.add_argument('--output', type=Path, default=ROOT / 'dist/JanusClinic')
    parser.add_argument('--react-root', type=Path, default=ROOT / '.build/pages')
    args = parser.parse_args()
    base = args.base_path.rstrip('/')
    if base and not re.fullmatch(r'/[A-Za-z0-9_-]+', base):
        parser.error('Use a single repository-name base path, such as /JanusClinic')
    build(args.output, base, args.react_root)
