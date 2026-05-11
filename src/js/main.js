// JS Entry Point for AquariumLife Custom Layer

import { initAnimations }      from './modules/animations.js';
import { injectMenuIcons }     from './modules/menuIcons.js';
import { buildDesktopNav }     from './modules/desktopNav.js';
import { initCategorySection } from './modules/categorySection.js';
import { initProductsSection } from './modules/productsSection.js';
import { initCartStyles }      from './modules/cartStyles.js';

function init() {
  initAnimations();
  injectMenuIcons();
  buildDesktopNav();
  initCategorySection();
  initProductsSection();
  initCartStyles();
  console.log('[AQ] Premium Layer Loaded — readyState:', document.readyState);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
