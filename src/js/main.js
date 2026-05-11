// JS Entry Point for AquariumLife Custom Layer
// Este arquivo será injetado na Shopkit via painel avançado

import { initAnimations } from './modules/animations.js';
import { injectMenuIcons } from './modules/menuIcons.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar micro-animações
  initAnimations();

  // Injetar ícones dinâmicos no menu
  injectMenuIcons();
  
  console.log('AquariumLife Premium Layer Loaded');
});
