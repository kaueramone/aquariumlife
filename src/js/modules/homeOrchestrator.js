/**
 * homeOrchestrator.js – v3
 * Usa element.before() em vez de parentNode.insertBefore() — mais robusto
 * quando o footer pode ser movido no DOM pelo Shopkit após a nossa referência.
 */

import { buildBrandsSection }  from './brandsSection.js';
import { buildStoreSection }   from './storeSection.js';
import { buildFAQSection }     from './faqSection.js';
import { buildBlogSection }    from './blogSection.js';

function waitForFooter(maxMs = 8000) {
  return new Promise((resolve) => {
    const sel = 'footer, #footer, .footer, [class*="footer"]';
    const el = document.querySelector(sel);
    if (el) { resolve(el); return; }
    const start = Date.now();
    const iv = setInterval(() => {
      const f = document.querySelector(sel);
      if (f) { clearInterval(iv); resolve(f); return; }
      if (Date.now() - start > maxMs) {
        clearInterval(iv);
        // último recurso: injeta no fim do body
        resolve(null);
      }
    }, 200);
  });
}

function insertSection(section, id, footer) {
  if (!section) return;
  if (document.getElementById(id)) return;
  try {
    if (footer) {
      footer.before(section);   // mais robusto que insertBefore
    } else {
      document.body.appendChild(section);
    }
  } catch (e) {
    // fallback absoluto
    console.warn('[AQ] insertSection fallback para appendChild:', id, e);
    document.body.appendChild(section);
  }
}

export async function initHome() {
  const footer = await waitForFooter();

  // 1. Marcas
  try {
    const brands = await buildBrandsSection();
    insertSection(brands, 'aq-brands', footer);
    console.log('[AQ] brands injetado');
  } catch (e) { console.warn('[AQ] brands falhou:', e); }

  // 2. Loja física + Maps
  try {
    const store = buildStoreSection();
    insertSection(store, 'aq-store', footer);
    console.log('[AQ] store injetado');
  } catch (e) { console.warn('[AQ] store falhou:', e); }

  // 3. FAQ
  try {
    const faq = buildFAQSection();
    insertSection(faq, 'aq-faq', footer);
    console.log('[AQ] faq injetado');
  } catch (e) { console.warn('[AQ] faq falhou:', e); }

  // 4. Blog
  try {
    const blog = await buildBlogSection();
    insertSection(blog, 'aq-blog-home', footer);
    console.log('[AQ] blog injetado');
  } catch (e) { console.warn('[AQ] blog falhou:', e); }

  console.log('[AQ] Home orquestrada: brands → store → faq → blog');
}
