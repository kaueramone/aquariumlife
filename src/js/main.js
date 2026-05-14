// JS Entry Point for AquariumLife Custom Layer

import { initAnimations }      from './modules/animations.js';
import { injectMenuIcons }     from './modules/menuIcons.js';
import { buildDesktopNav }     from './modules/desktopNav.js';
import { initCategorySection } from './modules/categorySection.js';
import { initProductsSection } from './modules/productsSection.js';
import { initCartStyles }      from './modules/cartStyles.js';
import { initBrandsSection }   from './modules/brandsSection.js';
import { initBlogSection }     from './modules/blogSection.js';
import { initTrustSeals }      from './modules/trustSeals.js';
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

  // Redesign de /blog e post individual (não faz nada na home)
  initBlogSection();

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
