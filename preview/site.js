// Static review interactions only. No booking, email, analytics, or form delivery.
const notice = document.querySelector('#preview-notice');
const inform = () => {
  if (dialog && open?.getAttribute('aria-expanded') === 'true') setMenu(false);
  notice.textContent = 'Preview only — no booking or message was sent.';
  notice.focus();
};
for (const link of document.querySelectorAll('[data-preview-action]')) link.addEventListener('click', event => { event.preventDefault(); inform(); });
for (const form of document.querySelectorAll('form')) form.addEventListener('submit', event => { event.preventDefault(); inform(); });

const open = document.querySelector('[aria-label="Open navigation menu"]');
const close = document.querySelector('[aria-label="Close navigation menu"]');
const dialog = document.querySelector('[role="dialog"][aria-label="Navigation menu"]');
const setMenu = expanded => {
  if (!dialog) return;
  dialog.inert = !expanded;
  dialog.setAttribute('aria-hidden', String(!expanded));
  dialog.style.opacity = expanded ? '1' : '0';
  dialog.style.pointerEvents = expanded ? 'auto' : 'none';
  dialog.style.transform = expanded ? 'translateY(0)' : 'translateY(-8px)';
  open.setAttribute('aria-expanded', String(expanded));
  document.body.style.overflow = expanded ? 'hidden' : '';
  for (const link of dialog.querySelectorAll('nav a')) { link.style.opacity = expanded ? '1' : '0'; link.style.transform = 'none'; }
  if (expanded) close.focus();
};
if (dialog) {
  setMenu(false);
  open.addEventListener('click', () => setMenu(true));
  addEventListener('resize', () => { if (innerWidth >= 768) setMenu(false); });
  close.addEventListener('click', () => { setMenu(false); open.focus(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') { setMenu(false); open.focus(); }
    if (event.key === 'Tab') {
      const items = [...dialog.querySelectorAll('a,button')];
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
    }
  });
}
const header = document.querySelector('header.fixed');
if (header) {
  const update = () => {
    header.style.backgroundColor = scrollY > 20 ? 'rgba(250,247,244,0.97)' : 'transparent';
    header.style.backdropFilter = scrollY > 20 ? 'blur(12px)' : 'none';
    header.style.borderBottom = scrollY > 20 ? '1px solid #e8e0d5' : 'none';
  };
  addEventListener('scroll', update, { passive: true }); update();
}
(async () => {
  const script = document.querySelector('script[src$="/preview/site.js"]');
  const base = new URL('../', script.src).pathname.replace(/\/$/, '');
  const route = location.pathname.slice(base.length).replace(/\/$/, '') || '/';
  const response = await fetch(new URL('faq-data.json', script.src));
  if (!response.ok) throw new Error('Preview FAQ content unavailable.');
  const data = (await response.json())[route] || [];
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  for (const [index, button] of [...document.querySelectorAll('main button[aria-expanded]')].entries()) {
    const faq = data.find(item => normalize(item.question) === normalize(button.textContent));
    if (!faq) throw new Error('Missing preview FAQ: ' + button.textContent);
    const answer = document.createElement('p');
    answer.id = `preview-answer-${index}`; answer.className = 'preview-answer'; answer.hidden = true; answer.textContent = faq.answer;
    button.setAttribute('aria-controls', answer.id); button.after(answer);
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expanded)); answer.hidden = !expanded;
    });
  }
})().catch(console.error);
