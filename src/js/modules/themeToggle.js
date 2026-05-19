/**
 * themeToggle.js - v1
 * Lampada flutuante (canto inferior esquerdo) para alternar dark/light mode.
 * Dark  = tema actual (fundo #00040D, texto branco, acentos neon)
 * Light = fundo branco, texto azul escuro, acentos verde/azul da palette
 * Preferencia guardada em localStorage.
 */

var STORAGE_KEY = 'aq-theme';
var LIGHT_CLASS  = 'aq-light-mode';

var LIGHT_VARS = {
  '--aq-bg':        '#F0F8FF',
  '--aq-bg2':       '#E0F0FF',
  '--aq-text':      '#00204A',
  '--aq-text2':     'rgba(0,32,74,0.7)',
  '--aq-neon':      '#007A5C',
  '--aq-neon2':     '#005FA3',
  '--aq-border':    'rgba(0,122,92,0.25)',
};

function applyTheme(isLight) {
  var root = document.documentElement;
  if (isLight) {
    document.body.classList.add(LIGHT_CLASS);
    Object.keys(LIGHT_VARS).forEach(function(k) {
      root.style.setProperty(k, LIGHT_VARS[k]);
    });
  } else {
    document.body.classList.remove(LIGHT_CLASS);
    Object.keys(LIGHT_VARS).forEach(function(k) {
      root.style.removeProperty(k);
    });
  }
}

function saveTheme(isLight) {
  try { localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark'); } catch(e) {}
}

function loadTheme() {
  try { return localStorage.getItem(STORAGE_KEY) === 'light'; } catch(e) { return false; }
}

export function initThemeToggle() {
  if (document.getElementById('aq-theme-toggle')) return;

  var isLight = loadTheme();
  applyTheme(isLight);

  // Criar botao flutuante
  var btn = document.createElement('button');
  btn.id = 'aq-theme-toggle';
  btn.setAttribute('aria-label', 'Alternar tema claro/escuro');
  btn.setAttribute('title', isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro');
  btn.innerHTML = isLight ? '&#x1F506;' : '&#x1F4A1;'; // Sol ou Lampada
  document.body.appendChild(btn);

  btn.addEventListener('click', function() {
    isLight = !isLight;
    applyTheme(isLight);
    saveTheme(isLight);
    btn.innerHTML = isLight ? '&#x1F506;' : '&#x1F4A1;';
    btn.setAttribute('title', isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro');
    btn.classList.add('aq-theme-toggle--pop');
    setTimeout(function() { btn.classList.remove('aq-theme-toggle--pop'); }, 400);
  });
}
