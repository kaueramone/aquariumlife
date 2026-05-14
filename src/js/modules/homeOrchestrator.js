/**
 * homeOrchestrator.js – v2
 * Garante a ordem exata das seções da home, injetando-as sequencialmente
 * ANTES do footer, na ordem correta:
 *
 *  [Shopkit nativo: banner, categorias, produtos]
 *  ↓ aq-brands      (marcas)
 *  ↓ aq-store       (loja física + mapa)
 *  ↓ aq-faq         (perguntas frequentes)
 *  ↓ aq-blog-home   (últimos posts)
 *  [footer]
 *
 * v2: waitForFooter retorna Promise; cada seção tem try/catch independente
 * para que a falha de uma não bloqueie as demais.
 */

import { buildBrandsSection }  from './brandsSection.js';
import { buildStoreSection }   from './storeSection.js';
import { buildFAQSection }     from './faqSection.js';
import { buildBlogSection }    from './blogSection.js';

function waitForFooter(maxMs = 6000) {
  return new Promise((resolve, reject) => {
    const footer = document.querySelector('footer, #footer, .footer, [class*="footer"]');
    if (footer) { resolve(footer); return; }
    const start = Date.now();
    const interval = setInterval(() => {
      const f = document.querySelector('footer, #footer, .footer, [class*="footer"]');
      if (f) {
        clearInterval(interval);
        resolve(f);
      } else if (Date.now() - start > maxMs) {
        clearInterval(interval);
        // Fallback: injeta no fim do body
        resolve(document.body);
      }
    }, 200);
  });
}

function injectBefore(section, id, ref) {
  if (!section) return;
  if (document.getElementById(id)) return;
  ref.parentNode.insertBefore(section, ref);
}

export async function initHome() {
  const footer = await waitForFooter();

  // 1. Marcas
  try {
    const brands = await buildBrandsSection();
    injectBefore(brands, 'aq-brands', footer);
    console.log('[AQ] brands injetado');
  } catch (e) {
    console.warn('[AQ] brands falhou:', e);
  }

  // 2. Loja física + Maps
  try {
    const store = buildStoreSection();
    injectBefore(store, 'aq-store', footer);
    console.log('[AQ] store injetado');
  } catch (e) {
    console.warn('[AQ] store falhou:', e);
  }

  // 3. FAQ
  try {
    const faq = buildFAQSection();
    injectBefore(faq, 'aq-faq', footer);
    console.log('[AQ] faq injetado');
  } catch (e) {
    console.warn('[AQ] faq falhou:', e);
  }

  // 4. Blog
  try {
    const blog = await buildBlogSection();
    injectBefore(blog, 'aq-blog-home', footer);
    console.log('[AQ] blog injetado');
  } catch (e) {
    console.warn('[AQ] blog falhou:', e);
  }

  console.log('[AQ] Home orquestrada: brands → store → faq → blog');
}
