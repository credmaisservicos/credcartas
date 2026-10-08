import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, inView } from 'motion';
import './style.css';
import './mobile.css';

gsap.registerPlugin(ScrollTrigger);

// Keep every static entry point consistent for crawlers, social previews and
// direct visits. The HTML files already provide their first paint metadata;
// this reinforces it after Vite loads the shared module.
const pageMeta = {
  '/': { title: 'CredCartas | Cartas de crédito contempladas para carros e imóveis', description: 'Encontre cartas de crédito contempladas para carros e imóveis com atendimento claro e próximo na CredCartas.' },
  '/cartas.html': { title: 'Cartas de crédito contempladas | CredCartas', description: 'Conheça cartas de crédito contempladas para veículos e imóveis com orientação da CredCartas.' },
  '/veiculos.html': { title: 'Carta contemplada para veículos | CredCartas', description: 'Encontre cartas de crédito contempladas para comprar carro novo ou usado, com orientação clara da CredCartas.' },
  '/como-funciona.html': { title: 'Como funciona uma carta contemplada | CredCartas', description: 'Entenda como funciona a busca, análise e transferência de cartas de crédito contempladas com a CredCartas.' },
  '/contato.html': { title: 'Contato | Encontre sua carta contemplada | CredCartas', description: 'Fale com a CredCartas e conte qual carta de crédito contemplada você procura para carro ou imóvel.' },
  '/sobre.html': { title: 'Sobre a CredCartas | Atendimento claro e humano', description: 'Conheça a CredCartas e nossa forma clara e humana de orientar a escolha de cartas de crédito contempladas.' }
};

const currentPath = window.location.pathname === '' ? '/' : window.location.pathname;
const currentMeta = pageMeta[currentPath] || pageMeta['/'];
const canonicalUrl = `https://credcartas.solutions${currentPath === '/index.html' ? '/' : currentPath}`;
document.title = currentMeta.title;
const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
};
upsertMeta('meta[name="description"]', { name: 'description', content: currentMeta.description });
upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index,follow,max-image-preview:large' });
upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'pt_BR' });
upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'CredCartas' });
upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
upsertMeta('meta[property="og:title"]', { property: 'og:title', content: currentMeta.title });
upsertMeta('meta[property="og:description"]', { property: 'og:description', content: currentMeta.description });
upsertMeta('meta[property="og:image"]', { property: 'og:image', content: 'https://credcartas.solutions/hero-credcartas-final.png' });
upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: 'CredCartas: cartas contempladas para carros e imóveis' });
upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: currentMeta.title });
upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: currentMeta.description });
upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: 'https://credcartas.solutions/hero-credcartas-final.png' });
let canonical = document.head.querySelector('link[rel="canonical"]');
if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
canonical.href = canonicalUrl;
if (!document.head.querySelector('script[data-credcartas-schema]')) {
  const schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.dataset.credcartasSchema = 'true';
  schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'CredCartas', url: 'https://credcartas.solutions/', inLanguage: 'pt-BR', description: currentMeta.description });
  document.head.appendChild(schema);
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
let menuScroll = 0;
let menuPreviousFocus;
const touchLayout = window.matchMedia('(max-width: 900px)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

if (menuButton) {
  menuButton.innerHTML = '<span class="menu-button-label">Menu</span><span class="menu-button-icon" aria-hidden="true"><i></i><i></i></span>';
  menuButton.setAttribute('aria-label', 'Abrir menu de navegação');
}
if (mobileNav) {
  mobileNav.hidden = true;
  mobileNav.setAttribute('aria-label', 'Navegação no celular');
  const normalize = path => path.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/';
  mobileNav.querySelectorAll(':scope > a').forEach(link => {
    if (normalize(new URL(link.href).pathname) === normalize(location.pathname)) link.setAttribute('aria-current', 'page');
  });
}

function setMenu(open, restoreFocus = true) {
  if (!mobileNav || !menuButton || open === mobileNav.classList.contains('open')) return;
  if (open) {
    menuScroll = window.scrollY;
    menuPreviousFocus = document.activeElement;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + menuScroll + 'px';
    document.body.style.width = '100%';
    mobileNav.hidden = false;
  }
  mobileNav.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
  menuButton.querySelector('.menu-button-label').textContent = open ? 'Fechar' : 'Menu';
  document.querySelectorAll('main, .site-footer, .whatsapp-float').forEach(element => { element.inert = open; });
  if (open) {
    mobileNav.scrollTop = 0;
    mobileNav.querySelector('a')?.focus({ preventScroll: true });
  } else {
    mobileNav.hidden = true;
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo({ top: menuScroll, behavior: 'instant' });
    if (restoreFocus) (menuPreviousFocus || menuButton).focus({ preventScroll: true });
  }
}
menuButton?.addEventListener('click', () => setMenu(!mobileNav?.classList.contains('open')));
mobileNav?.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (!mobileNav?.classList.contains('open')) return;
  if (event.key === 'Escape') { event.preventDefault(); setMenu(false); }
  if (event.key !== 'Tab') return;
  const controls = [menuButton, ...mobileNav.querySelectorAll('a[href], button, [tabindex="0"]')].filter(element => element && element.getClientRects().length);
  const first = controls[0], last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
touchLayout.addEventListener('change', event => { if (!event.matches) setMenu(false, false); });

document.querySelectorAll('.magnetic').forEach((element) => {
  element.addEventListener('pointermove', (event) => {
    if (reducedMotion || !finePointer.matches || event.pointerType === 'touch') return;
    const rect = element.getBoundingClientRect();
    gsap.to(element, { x: (event.clientX - rect.left - rect.width / 2) * .08, y: (event.clientY - rect.top - rect.height / 2) * .08, duration: .25, ease: 'power3.out' });
  });
  element.addEventListener('pointerleave', () => gsap.to(element, { x: 0, y: 0, duration: .45, ease: 'elastic.out(1,.45)' }));
});

if (!reducedMotion) {
  gsap.fromTo('.site-header', { y: -80 }, { y: 0, duration: .8, ease: 'power3.out' });
  gsap.fromTo('.hero .eyebrow, .page-hero .eyebrow', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .65, delay: .18, ease: 'power3.out' });
  gsap.fromTo('.hero h1, .page-hero h1', { y: 55, opacity: 0 }, { y: 0, opacity: 1, duration: .9, delay: .28, ease: 'power3.out' });
  gsap.fromTo('.hero-copy>p:not(.eyebrow), .page-hero-copy>p:not(.eyebrow), .hero-actions, .hero-facts', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: .72, stagger: .1, delay: .55, ease: 'power3.out' });
  gsap.fromTo('.hero-media img, .page-hero-media img', { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.35, delay: .15, ease: 'power3.out' });
  gsap.to('.hero-actions .button span, .page-hero .button span', { y: -1.5, opacity: .74, duration: .9, repeat: -1, repeatDelay: .45, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.hero-actions .button i, .page-hero .button i', { x: 3, y: -3, duration: .75, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  document.querySelectorAll('[data-motion]').forEach((element) => {
    inView(element, () => {
      animate(element, { opacity: [0, 1], transform: ['translateY(42px)', 'translateY(0px)'] }, { duration: .72, easing: [0.22, 1, 0.36, 1] });
    }, { amount: .18 });
  });

  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 86%',
    once: true,
    onEnter: (elements) => gsap.fromTo(elements, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: .75, stagger: .1, ease: 'power3.out' })
  });

  // Photo movement and pinned journeys belong to the spacious desktop layout.
  // MatchMedia removes their inline transforms when the viewport becomes mobile.
  gsap.matchMedia().add('(min-width: 901px) and (hover: hover) and (pointer: fine)', () => {
    gsap.utils.toArray('[data-parallax]').forEach(frame => {
      const image = frame.querySelector('img');
      if (!image) return;
      gsap.fromTo(image, { yPercent: -5, scale: 1.06 }, { yPercent: 5, scale: 1.12, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    const marquee = document.querySelector('.brand-strip-track');
    if (marquee) gsap.to(marquee, { xPercent: -50, duration: 18, repeat: -1, ease: 'none' });
    document.querySelectorAll('.ticker-track').forEach(track => gsap.to(track, { xPercent: -50, duration: 22, repeat: -1, ease: 'none' }));
    const processTrack = document.querySelector('.process-track');
    if (processTrack) gsap.to(processTrack, { x: () => -Math.max(0, processTrack.scrollWidth - window.innerWidth + window.innerWidth * .14), ease: 'none', scrollTrigger: { trigger: '.process', start: 'top top', end: () => '+=' + processTrack.scrollWidth * .8, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
  });

  gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: .25 } });
}

const officialContact = {
  phoneDisplay: '(11) 94089-3852',
  phoneHref: 'tel:+5511940893852',
  whatsapp: 'https://wa.me/5511940893852',
  email: 'contato@sejacredmais.com'
};

document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
  link.href = `mailto:${officialContact.email}`;
  link.textContent = officialContact.email;
});

document.querySelectorAll('.footer-col').forEach((column) => {
  const title = column.querySelector('strong')?.textContent?.toLowerCase() || '';
  if (!/contato|fale/.test(title)) return;
  column.innerHTML = `<strong>Fale conosco</strong><a href="${officialContact.phoneHref}">${officialContact.phoneDisplay}</a><a href="mailto:${officialContact.email}">${officialContact.email}</a><a href="${officialContact.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>`;
});

document.querySelectorAll('.footer-brand').forEach((brand) => {
  if (!brand.querySelector('.official-location')) brand.insertAdjacentHTML('beforeend', '<span class="official-location">São Paulo — Brasil</span>');
});

if (mobileNav) {
  mobileNav.insertAdjacentHTML('beforeend', '<div class="mobile-nav-contact"><p>Vamos conversar sobre o seu plano.</p><a class="mobile-contact-action" href="'+officialContact.whatsapp+'" target="_blank" rel="noopener">Falar pelo WhatsApp <span aria-hidden="true">↗</span></a><a class="mobile-contact-email" href="mailto:'+officialContact.email+'">'+officialContact.email+'</a></div>');
}

const contactNotes = document.querySelector('.contact-notes');
if (contactNotes) contactNotes.insertAdjacentHTML('beforeend', `<span>${officialContact.phoneDisplay}</span><span>${officialContact.email}</span><span>São Paulo — Brasil</span>`);

document.body.insertAdjacentHTML('beforeend', `<a class="whatsapp-float magnetic" href="${officialContact.whatsapp}" target="_blank" rel="noopener" aria-label="Falar com a CredCartas pelo WhatsApp"><svg class="whatsapp-float-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.8 7.4L3 20.5l1.4-4.6a8.5 8.5 0 1 1 16.1-4.2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.1 7.5c.3-.2.7-.2.8.2l.8 1.7c.2.4-.3.8-.7 1.2.5 1.3 1.6 2.4 3 3 .3-.4.8-1 1.1-.8l1.8.9c.4.2.4.6.2.9-.5.9-1.2 1.3-2.1 1.1-2.8-.6-5.7-3.2-6.3-6-.2-.8.4-1.8 1.4-2.2Z" fill="currentColor"/></svg><span>WhatsApp</span></a>`);

window.addEventListener('load', () => ScrollTrigger.refresh());
