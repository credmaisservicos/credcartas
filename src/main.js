import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, inView } from 'motion';
import './style.css';

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
menuButton?.addEventListener('click', () => {
  const open = mobileNav?.classList.toggle('open');
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(Boolean(open)));
  menuButton.textContent = open ? 'Fechar' : 'Menu';
});
mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  document.body.classList.remove('menu-open');
  if (menuButton) menuButton.textContent = 'Menu';
}));

document.querySelectorAll('.magnetic').forEach((element) => {
  element.addEventListener('pointermove', (event) => {
    if (reducedMotion) return;
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

  gsap.utils.toArray('[data-parallax]').forEach((frame) => {
    const image = frame.querySelector('img');
    if (!image) return;
    gsap.fromTo(image, { yPercent: -5, scale: 1.06 }, { yPercent: 5, scale: 1.12, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  const marquee = document.querySelector('.brand-strip-track');
  if (marquee) gsap.to(marquee, { xPercent: -50, duration: 18, repeat: -1, ease: 'none' });
  document.querySelectorAll('.ticker-track').forEach((track) => gsap.to(track, { xPercent: -50, duration: 22, repeat: -1, ease: 'none' }));

  const processTrack = document.querySelector('.process-track');
  if (processTrack) ScrollTrigger.matchMedia({
    '(min-width: 901px)': () => gsap.to(processTrack, { x: () => -(processTrack.scrollWidth - window.innerWidth + window.innerWidth * .14), ease: 'none', scrollTrigger: { trigger: '.process', start: 'top top', end: () => `+=${processTrack.scrollWidth * .8}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } })
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

const contactNotes = document.querySelector('.contact-notes');
if (contactNotes) contactNotes.insertAdjacentHTML('beforeend', `<span>${officialContact.phoneDisplay}</span><span>${officialContact.email}</span><span>São Paulo — Brasil</span>`);

document.body.insertAdjacentHTML('beforeend', `<a class="whatsapp-float magnetic" href="${officialContact.whatsapp}" target="_blank" rel="noopener" aria-label="Falar com a CredCartas pelo WhatsApp">WhatsApp</a>`);

window.addEventListener('load', () => ScrollTrigger.refresh());
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    mobileNav?.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuButton) menuButton.textContent = 'Menu';
  }
});
