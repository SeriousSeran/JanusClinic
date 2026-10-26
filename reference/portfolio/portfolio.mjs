const gallery = document.querySelector('#page-gallery');
const status = document.querySelector('#gallery-status');
const category = route => route.startsWith('/services') ? 'services' : route.startsWith('/products') ? 'products' : route.startsWith('/journal') ? 'journal' : 'core';

try {
  const response = await fetch('/portfolio/capture/pages.json');
  if (!response.ok) throw new Error('Page inventory is unavailable.');
  const inventory = await response.json();
  for (const page of inventory.pages) {
    const card = document.createElement('a');
    card.href = page.route;
    card.className = 'page-card';
    card.dataset.category = category(page.route);
    card.dataset.portfolioPage = '';
    const image = document.createElement('img');
    Object.assign(image, { src: '/portfolio/capture/' + page.desktop, alt: '', loading: 'lazy', width: 1280, height: 900 });
    const body = document.createElement('div');
    body.className = 'page-card-body';
    const label = document.createElement('span');
    label.className = 'eyebrow'; label.textContent = category(page.route);
    const title = document.createElement('h3'); title.textContent = page.title;
    const route = document.createElement('code'); route.textContent = page.route;
    const view = document.createElement('span'); view.className = 'view'; view.textContent = 'View page →';
    body.append(label, title, route, view); card.append(image, body); gallery.append(card);
    if (page.mobile) {
      const figure = document.createElement('figure');
      const link = document.createElement('a'); link.href = page.route;
      const mobile = document.createElement('img');
      Object.assign(mobile, { src: '/portfolio/capture/' + page.mobile, alt: 'Mobile layout: ' + page.title, loading: 'lazy', width: 390, height: 844 });
      const caption = document.createElement('figcaption'); caption.textContent = page.title;
      link.append(mobile); figure.append(link, caption); document.querySelector('#mobile-gallery').append(figure);
    }
  }
  const showCount = count => { status.textContent = `${count} of ${inventory.pages.length} captured pages`; };
  showCount(inventory.pages.length);
  for (const button of document.querySelectorAll('[data-filter]')) {
    button.addEventListener('click', () => {
      for (const other of document.querySelectorAll('[data-filter]')) other.setAttribute('aria-pressed', String(other === button));
      let count = 0;
      for (const card of gallery.children) {
        card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
        if (!card.hidden) count++;
      }
      showCount(count);
    });
  }
  document.querySelector('#capture-provenance').textContent = `Reference covers captured ${new Date(inventory.capturedAt).toLocaleDateString('en-GB', { timeZone: 'UTC' })} from source commit ${inventory.sourceCommit.slice(0, 7)}. Covers are historical references; open each page to inspect the current version.`;
} catch (error) {
  status.textContent = 'Page references could not be loaded. Check that the local server is running and the reference inventory exists.';
  console.error(error);
}
