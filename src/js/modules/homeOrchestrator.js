/**
 * homeOrchestrator.js – v1
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
 * Cada módulo expõe buildSection() que retorna um HTMLElement pronto.
 * O orquestrador insere tudo de uma vez, em sequência, antes do footer.
 */

import { buildBrandsSection }  from './brandsSection.js';
import { buildStoreSection }   from './storeSection.js';
import { buildFAQSection }     from './faqSection.js';
import { buildBlogSection }    from './blogSection.js';

function waitForFooter(cb, maxMs = 6000) {
  const footer = document.querySelector('footer, #footer, .footer');
  if (footer) { cb(footer); return; }
  const start = Date.now();
  const interval = setInterval(() => {
    const f = document.querySelector('footer, #footer, .footer');
    if (f || Date.now() - start > maxMs) {
      clearInterval(interval);
      if (f) cb(f);
    }
  }, 200);
}

export async function initHome() {
  waitForFooter(async (footer) => {

    // 1. Marcas (síncrono — aguarda API internamente, retorna section)
    const brands = await buildBrandsSection();
    if (brands && !document.getElementById('aq-brands')) {
      footer.parentNode.insertBefore(brands, footer);
    }

    // 2. Loja física + Maps (síncrono)
    const store = buildStoreSection();
    if (store && !document.getElementById('aq-store')) {
      footer.parentNode.insertBefore(store, footer);
    }

    // 3. FAQ (síncrono)
    const faq = buildFAQSection();
    if (faq && !document.getElementById('aq-faq')) {
      footer.parentNode.insertBefore(faq, footer);
    }

    // 4. Blog (async — busca posts)
    const blog = await buildBlogSection();
    if (blog && !document.getElementById('aq-blog-home')) {
      footer.parentNode.insertBefore(blog, footer);
    }

    console.log('[AQ] Home orquestrada: brands → store → faq → blog');
  });
}
