// JS Entry Point for AquariumLife Custom Layer
// Injetado via Shopkit — o DOMContentLoaded pode já ter disparado!

import { initAnimations } from './modules/animations.js';
import { injectMenuIcons } from './modules/menuIcons.js';
import { buildDesktopNav } from './modules/desktopNav.js';

function init() {
  initAnimations();
  injectMenuIcons();
  buildDesktopNav();
  console.log('[AQ] Premium Layer Loaded — readyState:', document.readyState);
}

// Seguro para qualquer momento de carregamento
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM já está pronto (script carregado depois do DOMContentLoaded)
  init();
}
