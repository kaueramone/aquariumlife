/**
 * desktopNav.js – Versão 3
 * 
 * Estratégia: Lê a estrutura COMPLETA do menu nativo (incluindo submenus),
 * reconstrói uma nav horizontal de 2 níveis com Font Awesome 5,
 * e injeta num <div> próprio abaixo da linha logo+ícones.
 */

// Mapa de itens → Font Awesome 5 (free)
const FA_ICON_MAP = {
  'equipamento':         'fas fa-tools',
  'alimentação':         'fas fa-utensils',
  'alimentacao':         'fas fa-utensils',
  'hardscape':           'fas fa-mountain',
  'planta':              'fas fa-seedling',
  'peixe':               'fas fa-fish',
  'invertebrado':        'fas fa-bug',
  'outro':               'fas fa-ellipsis-h',
  'condicionador':       'fas fa-tint',
  'água':                'fas fa-tint',
  'agua':                'fas fa-tint',
  'aquascape':           'fas fa-leaf',
  'aquascaping':         'fas fa-leaf',
};

function normStr(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getFA(text) {
  const n = normStr(text);
  for (const [key, icon] of Object.entries(FA_ICON_MAP)) {
    if (n.includes(normStr(key))) return icon;
  }
  return 'fas fa-circle'; // fallback
}

function buildItem(originalLi) {
  const originalA = originalLi.querySelector(':scope > a');
  if (!originalA) return null;

  const label = originalA.textContent.trim();
  const href  = originalA.getAttribute('href') || '#';

  // Verifica submenu
  const originalSub = originalLi.querySelector(':scope > ul');

  const li = document.createElement('li');
  li.className = originalSub ? 'aq-has-sub' : '';

  const a = document.createElement('a');
  a.href = href;
  a.title = label;
  a.innerHTML = `<i class="${getFA(label)}"></i><span>${label}</span>`;
  if (originalSub) a.innerHTML += `<i class="fas fa-chevron-down aq-arrow"></i>`;

  li.appendChild(a);

  if (originalSub) {
    const sub = document.createElement('ul');
    sub.className = 'aq-submenu';

    originalSub.querySelectorAll(':scope > li').forEach(subLi => {
      const subA = subLi.querySelector(':scope > a');
      if (!subA) return;
      const subLi2 = document.createElement('li');
      const subA2  = document.createElement('a');
      subA2.href  = subA.getAttribute('href') || '#';
      subA2.textContent = subA.textContent.trim();
      subLi2.appendChild(subA2);
      sub.appendChild(subLi2);
    });

    li.appendChild(sub);
  }

  return li;
}

export function buildDesktopNav() {
  if (window.innerWidth < 992) return;

  // Evitar duplicação
  if (document.getElementById('aq-nav-bar')) return;

  // Procurar os <li> do menu nativo
  const menuSelectors = [
    '.menu-wrapper > ul > li',
    '.header-menu > ul > li',
    '#menu > li',
    'nav.navigation > ul > li',
    '.nav-menu > li',
    '.navbar-collapse ul > li',
    'header nav > ul > li',
  ];

  let sourceItems = [];
  for (const sel of menuSelectors) {
    const found = document.querySelectorAll(sel);
    if (found.length >= 3) { sourceItems = Array.from(found); break; }
  }

  if (sourceItems.length === 0) {
    setTimeout(buildDesktopNav, 800);
    return;
  }

  // Construir a nav
  const nav = document.createElement('nav');
  nav.id = 'aq-nav-bar';
  nav.setAttribute('aria-label', 'Menu Principal');

  const ul = document.createElement('ul');

  sourceItems.forEach(li => {
    const item = buildItem(li);
    if (item) ul.appendChild(item);
  });

  nav.appendChild(ul);

  // Inserir como segunda linha do header
  const header = document.querySelector('header, #header, .header');
  if (header) {
    header.appendChild(nav);
  }

  console.log(`[AQ] Nav construída com ${ul.children.length} itens.`);
}
