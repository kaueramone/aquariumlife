/**
 * homeOrchestrator.js – v5
 * Abordagem simples: injeta secções no fim do <main> ou <body>,
 * sem depender do footer nem de polling.
 */

import { buildBrandsSection }  from './brandsSection.js';
import { buildStoreSection }   from './storeSection.js';
import { buildFAQSection }     from './faqSection.js';
import { buildBlogSection }    from './blogSection.js';

function getContainer() {
  // Tenta encontrar o container principal do Shopkit
  return document.querySelector('main, #main, .main, [role="main"], #content, .content') 
    || document.body;
}

function append(section, id) {
  if (!section) return;
  if (document.getElementById(id)) return;
  const container = getContainer();
  container.appendChild(section);
  console.log('[AQ] injetado:', id, '→', container.tagName + (container.id ? '#'+container.id : ''));
}

export async function initHome() {
  console.log('[AQ] initHome() v5 — container:', getContainer()?.tagName);

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
