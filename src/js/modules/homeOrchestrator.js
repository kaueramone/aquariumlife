/**
 * homeOrchestrator.js – v6
 * Oculta secções nativas do Shopkit e injeta as nossas em ordem.
 */

import { buildBrandsSection }  from './brandsSection.js';
import { buildStoreSection }   from './storeSection.js';
import { buildFAQSection }     from './faqSection.js';
import { buildBlogSection }    from './blogSection.js';

// Seletores das secções nativas do Shopkit a ocultar
const NATIVE_SECTIONS = [
  'section.brands-block',
  'section.brands.section',
  '[data-section-type="blog"]',
  'section.blog-section',
  '.blog-posts-section',
  '.section-blog',
  '#blog',
];

function hideNativeSections() {
  NATIVE_SECTIONS.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.style.setProperty('display', 'none', 'important');
      console.log('[AQ] ocultado nativo:', sel);
    });
  });
}

function getContainer() {
  return document.querySelector('main, #main, .main, [role="main"], #content, .content')
    || document.body;
}

function append(section, id) {
  if (!section) return;
  if (document.getElementById(id)) return;
  getContainer().appendChild(section);
  console.log('[AQ] injetado:', id);
}

export async function initHome() {
  // Oculta secções nativas antes de injetar as nossas
  hideNativeSections();

  // Observa o DOM para ocultar secções nativas que apareçam depois
  const obs = new MutationObserver(() => hideNativeSections());
  obs.observe(document.body, { childList: true, subtree: true });
  // Para o observer após 5s (já não é necessário)
  setTimeout(() => obs.disconnect(), 5000);

  // 1. Marcas
  try {
    const brands = await buildBrandsSection();
    append(brands, 'aq-brands');
  } catch(e) { console.warn('[AQ] brands erro:', e); }

  // 2. Loja
  try {
    append(buildStoreSection(), 'aq-store');
  } catch(e) { console.warn('[AQ] store erro:', e); }

  // 3. FAQ
  try {
    append(buildFAQSection(), 'aq-faq');
  } catch(e) { console.warn('[AQ] faq erro:', e); }

  // 4. Blog
  try {
    const blog = await buildBlogSection();
    append(blog, 'aq-blog-home');
  } catch(e) { console.warn('[AQ] blog erro:', e); }

  console.log('[AQ] Home completa: brands → store → faq → blog');
}
