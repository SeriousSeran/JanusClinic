"""Render maintained pages; the original public capture is never changed."""
import argparse
from html import escape
import json
from pathlib import Path
import shutil
from string import Template

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / 'site'


def template(name, **values):
    return Template((SITE / 'templates' / (name + '.html')).read_text()).substitute(values)


def render_pages():
    content = json.loads((SITE / 'content.json').read_text())
    catalog = json.loads((ROOT / 'content/salon/catalog.draft.json').read_text())
    areas = content['areas']
    routes = [('cosmetic', 'Cosmetic'), ('salon', 'Salon'), ('wellness', 'Wellness'), ('services', 'Services'), ('about', 'About'), ('products', 'Products'), ('journal', 'Journal'), ('contact', 'Contact')]

    def layout(area, title, description, body):
        navigation = ''.join(f'<a class="nav-link" href="/{key}{"/" if key in {"cosmetic", "salon", "wellness"} else ""}"' + (' aria-current="page"' if key == area else '') + f'>{label}</a>' for key, label in routes)
        return template('layout', title=escape(title), description=escape(description, quote=True), navigation=navigation, content=body)

    def hero(area, intro, action='', anchor=''):
        cta = f'<a class="primary" href="#{anchor}">{escape(action)} <span aria-hidden="true">↓</span></a>' if action else ''
        return f'''<section class="area-hero container-content"><div class="area-copy"><a class="back-link" href="/">← All of Janus</a><p class="eyebrow">{escape(area['eyebrow'])}</p><h1 class="text-display">{escape(area['name'])}<span class="heading-period">.</span></h1><p class="intro-copy">{escape(intro)}</p>{cta}</div><figure class="area-portrait"><img src="{area['image']}" alt="{escape(area['alt'], quote=True)}" width="1122" height="1402" fetchpriority="high"><figcaption>AI-generated illustrative portrait</figcaption></figure></section>'''

    cards = ''.join(f'''<a class="gateway-card" data-area="{a['id']}" href="/{a['id']}/"><div class="card-image"><img src="{a['image']}" alt="{escape(a['alt'], quote=True)}" width="1122" height="1402" {('fetchpriority="high"' if index == 0 else 'loading="eager"')}></div><div class="card-label"><p class="eyebrow">{escape(a['eyebrow'])}</p><div><h2>{escape(a['name'])}</h2><span class="card-arrow" aria-hidden="true">→</span></div><p class="card-description">{escape(a['description'])}</p><span class="card-action">{escape(a['action'])} <span aria-hidden="true">→</span></span></div></a>''' for index, a in enumerate(areas))
    pages = {'/': layout('', 'Cosmetic, Salon & Wellness', content['home']['intro'], template('home', **{key: escape(value) for key, value in content['home'].items()}, cards=cards))}
    treatments = ''.join(f'''<a class="treatment-link" href="/services/medical-cosmetic/{escape(t['slug'], quote=True)}"><span class="treatment-number">{index + 1:02}</span><div><h3 class="text-h3">{escape(t['name'])}</h3><p>{escape(t['detail'])}</p></div><span aria-hidden="true">→</span></a>''' for index, t in enumerate(content['cosmetic_treatments']))
    pages['/cosmetic/'] = layout('cosmetic', 'Cosmetic Care', areas[0]['description'], template('cosmetic', hero=hero(areas[0], 'Considered information. Individual care. Explore medical cosmetic treatment guides at Janus.'), treatments=treatments))
    categories = ''.join(f'<a href="#catalog-{escape(c["id"], quote=True)}">{escape(c["label"])}</a>' for c in catalog['categories'])
    sections = []
    for index, category in enumerate(catalog['categories']):
        rows = []
        items = [item for item in catalog['items'] if item['category_id'] == category['id']]
        for item in items:
            note = f'<small class="wording-note">Wording to confirm: {escape(item["review_note"])}</small>' if item.get('review_note') else ''
            duration = f'<small class="service-duration">{escape(str(item["duration_minutes"]))} min</small>' if item.get('duration_minutes') is not None else ''
            rows.append(f'<tr data-service-id="{escape(item["id"], quote=True)}"><th scope="row">{escape(item["name"])}{duration}{note}</th><td><span class="sr-only">LKR </span>{item["price_lkr"]:,}</td></tr>')
        sections.append(f'''<details class="catalog-category" id="catalog-{category['id']}" {'open' if index == 0 else ''}><summary><span><span class="eyebrow">{index + 1:02} · {len(items)} services</span><span class="category-name">{escape(category['label'])}</span></span><span class="category-indicator" aria-hidden="true">+</span></summary><table><caption class="sr-only">{escape(category['label'])} prices in LKR</caption><thead><tr><th scope="col">Service</th><th scope="col">LKR</th></tr></thead><tbody>{''.join(rows)}</tbody></table></details>''')
    conditions = []
    for condition in catalog['pricing_conditions']:
        text = condition.get('note') or f'{condition["condition"]} Additional LKR {condition["amount_lkr"]:,}.'
        conditions.append('<li>' + escape(text) + '</li>')
    pages['/salon/'] = layout('salon', 'Salon Services & Prices', areas[1]['description'], template('salon', hero=hero(areas[1], 'Everyday rituals. Special occasions. Hair, beauty and body care, with space to be yourself.', 'Browse services & prices', 'salon-catalog'), service_count=len(catalog['items']), category_count=len(catalog['categories']), categories=categories, catalog=''.join(sections), conditions=''.join(conditions)))
    pages['/wellness/'] = layout('wellness', 'Wellness', areas[2]['description'], template('wellness', hero=hero(areas[2], 'A little more room for wellbeing. A new chapter at Janus, taking shape with care.')))
    return pages


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=SITE / 'generated')
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    for route, source in render_pages().items():
        target = args.output / route.lstrip('/') / 'index.html'
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(source)
    shutil.copytree(SITE / 'assets', args.output / 'site/assets', dirs_exist_ok=True)
    print('Rendered 4 maintained pages and their assets.')
