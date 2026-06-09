// JS Entry Point for AquariumLife Custom Layer

import { initAnimations }      from './modules/animations.js';
import { injectMenuIcons }     from './modules/menuIcons.js';
import { buildDesktopNav }     from './modules/desktopNav.js';
import { initCategorySection } from './modules/categorySection.js';
import { initProductsSection } from './modules/productsSection.js';
import { initCartStyles }      from './modules/cartStyles.js';
import { initBrandsSection }   from './modules/brandsSection.js';
import { initBlogSection }     from './modules/blogSection.js';
import { initPagesSection }    from './modules/pagesSection.js';
import { initThemeToggle }     from './modules/themeToggle.js';
import { initTrustSeals }      from './modules/trustSeals.js';
import { initSpecialPages }    from './modules/specialPages.js';
import { initCategoryFilters } from './modules/categoryFilters.js';
import { initNativeFixes }     from './modules/nativeFixes.js';
import { initHome }            from './modules/homeOrchestrator.js';

function init() {
  initAnimations();
  injectMenuIcons();
  buildDesktopNav();
  initCategorySection();
  initProductsSection();
  initCartStyles();
  initTrustSeals();

  // Oculta bloco nativo de marcas independentemente do orquestrador
  initBrandsSection();

  // Redesign de /blog e post individual
  initBlogSection();

  // Redesign de paginas estaticas /page/*
  initPagesSection();

  // Redesign de /sales, /new e /contact
  initSpecialPages();

  // Slider de preco + layout filtros nas paginas de categoria
  initCategoryFilters();

  // Correcoes de conteudo nativo Shopkit (stock, botao checkout, SEO home)
  initNativeFixes();

  // Toggle dark/light mode (lampada flutuante)
  initThemeToggle();

  // Orquestrador: injeta seções da home em ordem garantida
  // brands → store → faq → blog
  const path = window.location.pathname;
  if (path === '/' || path === '' || path === '/index') {
    initHome();
  }

  console.log('[AQ] Premium Layer Loaded — readyState:', document.readyState);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
// build Thu May 14 21:12:37 HVGMT 2026
// build Thu May 14 21:19:10 HVGMT 2026
// build Thu May 14 21:28:05 HVGMT 2026
// build Thu May 14 21:35:19 HVGMT 2026
// build Thu May 14 21:42:27 HVGMT 2026
// build Thu May 14 21:46:56 HVGMT 2026
// Thu May 14 21:59:55 HVGMT 2026
// Thu May 14 22:11:14 HVGMT 2026
// Thu May 14 23:49:01 HVGMT 2026
// Thu May 14 23:52:33 HVGMT 2026
