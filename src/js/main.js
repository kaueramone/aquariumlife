// JS Entry Point for AquariumLife Custom Layer

import { initAnimations }      from './modules/animations.js';
import { injectMenuIcons }     from './modules/menuIcons.js';
import { buildDesktopNav }     from './modules/desktopNav.js';
import { initCategorySection } from './modules/categorySection.js';
import { initProductsSection } from './modules/productsSection.js';
import { initCartStyles }      from './modules/cartStyles.js';
import { initBrandsSection }   from './modules/brandsSection.js';
import { initStoreSection }    from './modules/storeSection.js';
import { initFAQSection }      from './modules/faqSection.js';
import { initTrustSeals }      from './modules/trustSeals.js';
import { initBlogSection }     from './modules/blogSection.js';

function init() {
  initAnimations();
  injectMenuIcons();
  buildDesktopNav();
  initCategorySection();
  initProductsSection();
  initBrandsSection();
  initStoreSection();
  initFAQSection();
  initCartStyles();
  initTrustSeals();
  initBlogSection();
  console.log('[AQ] Premium Layer Loaded — readyState:', document.readyState);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
