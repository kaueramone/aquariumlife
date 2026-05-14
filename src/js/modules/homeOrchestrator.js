/**
 * homeOrchestrator.js – v7
 * Sem MutationObserver. Oculta nativos via CSS no SCSS.
 * Injeta secções premium em ordem no container principal.
 */

import { buildBrandsSection }  from './brandsSection.js';
import { buildStoreSection }   from './storeSection.js';
import { buildFAQSection }     from './faqSection.js';
import { buildBlogSection }    from './blogSection.js';

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
  const container = getContainer();
  console.log('[AQ] initHome v7 — container:', container.tagName, container.id || container.className.slice(0,30));

  try { append(await buildBrandsSection(), 'aq-brands'); } catch(e) { console.warn('[AQ] brands:', e); }
  try { append(buildStoreSection(),        'aq-store');  } catch(e) { console.warn('[AQ] store:', e);  }
  try { append(buildFAQSection(),          'aq-faq');    } catch(e) { console.warn('[AQ] faq:', e);    }
  try { append(await buildBlogSection(),   'aq-blog-home'); } catch(e) { console.warn('[AQ] blog:', e); }

  console.log('[AQ] Home completa ✓');
}
