// Shared authored navigation; the catalog is usable with native details without JS.
const toggle = document.querySelector('[aria-controls="mobile-navigation"]');
const mobile = document.getElementById('mobile-navigation');
const close = mobile.querySelector('button');
const setExpanded = (expanded, restoreFocus = false) => {
  toggle.setAttribute('aria-expanded', String(expanded));
  mobile.hidden = !expanded;
  if (restoreFocus) toggle.focus();
};
toggle.addEventListener('click', () => setExpanded(mobile.hidden));
close.addEventListener('click', () => setExpanded(false, true));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobile.hidden) setExpanded(false, true);
});
document.addEventListener('click', event => {
  if (!mobile.hidden && !event.target.closest('.janus-header')) setExpanded(false);
});
addEventListener('resize', () => { if (innerWidth >= 1024) setExpanded(false, mobile.contains(document.activeElement)); });

const revealCategory = () => {
  const id = location.hash.slice(1);
  const category = document.getElementById(id);
  if (category?.matches('details.catalog-category')) category.open = true;
};
for (const link of document.querySelectorAll('.category-navigation a')) link.addEventListener('click', () => {
  document.getElementById(link.hash.slice(1)).open = true;
});
addEventListener('hashchange', revealCategory);
revealCategory();
