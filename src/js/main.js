// JS Entry Point for AquariumLife Custom Layer
// Este arquivo será injetado na Shopkit via painel avançado

import { initAnimations } from './modules/animations.js';
import { injectMenuIcons } from './modules/menuIcons.js';
import { buildDesktopNav } from './modules/desktopNav.js';

document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
  injectMenuIcons();
  buildDesktopNav(); // Constrói nav horizontal própria no desktop

  console.log('AquariumLife Premium Layer Loaded');
});
