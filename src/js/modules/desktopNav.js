/**
 * desktopNav.js
 * 
 * Estratégia: Em vez de brigar com o JS nativo do Shopkit/Boxie que controla
 * o estado do menu mobile, nós lemos os links do menu original, construímos
 * nossa própria nav horizontal premium e inserimos no header.
 * O menu original é ocultado no desktop via CSS.
 */

// Mapa de ícones RemixIcon por palavra-chave (português)
const ICON_MAP = {
  'equipamento': 'ri-settings-4-line',
  'alimentação': 'ri-restaurant-2-line',
  'alimentacao': 'ri-restaurant-2-line',
  'hardscape': 'ri-landscape-line',
  'planta': 'ri-leaf-line',
  'peixe': 'ri-drop-line',
  'invertebrado': 'ri-bug-line',
  'outro': 'ri-archive-line',
  'condicionador': 'ri-flask-line',
  'aquascape': 'ri-anchor-line',
  'aquascaping': 'ri-anchor-line',
};

function getIconForLabel(text) {
  const normalized = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    const keyNorm = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalized.includes(keyNorm)) return icon;
  }
  return 'ri-arrow-right-s-line'; // fallback genérico
}

export function buildDesktopNav() {
  // Apenas em telas desktop
  if (window.innerWidth < 992) return;

  // Encontrar o header
  const header = document.querySelector('header, #header, .header, .navbar');
  if (!header) return;

  // Evitar duplicação
  if (document.getElementById('aq-desktop-nav')) return;

  // Encontrar os links do menu nativo
  // Tenta várias seletoras comuns do Shopkit/Boxie
  const possibleMenus = [
    '.menu-wrapper a',
    '.header-menu a',
    '#menu a',
    'nav.navigation a',
    '.nav-menu a',
    '.navbar-collapse a',
    'header nav a',
  ];

  let menuLinks = [];
  for (const selector of possibleMenus) {
    const found = document.querySelectorAll(selector);
    if (found.length >= 3) { // Pelo menos 3 links = menu de verdade
      menuLinks = Array.from(found).filter(a => {
        const text = a.textContent.trim();
        const href = a.getAttribute('href') || '';
        // Filtrar links vazios, ícones e links de sistema
        return text.length > 1 && !a.querySelector('i') && href && !href.startsWith('#');
      });
      if (menuLinks.length >= 3) break;
    }
  }

  if (menuLinks.length === 0) {
    console.warn('[AQ] Nenhum link de menu encontrado. Tentando novamente em 1s...');
    setTimeout(buildDesktopNav, 1000);
    return;
  }

  // Construir a nav premium
  const nav = document.createElement('nav');
  nav.id = 'aq-desktop-nav';
  nav.setAttribute('aria-label', 'Menu Principal');

  const ul = document.createElement('ul');

  menuLinks.forEach(originalLink => {
    const text = originalLink.textContent.trim();
    const href = originalLink.getAttribute('href');

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.title = text;

    // Ícone
    const icon = document.createElement('i');
    icon.className = getIconForLabel(text);

    // Texto
    const span = document.createElement('span');
    span.textContent = text;

    a.appendChild(icon);
    a.appendChild(span);
    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);

  // Inserir depois do logo no header
  const logo = header.querySelector('.logo, .header-logo, .navbar-brand');
  if (logo && logo.nextSibling) {
    header.insertBefore(nav, logo.nextSibling);
  } else {
    header.appendChild(nav);
  }

  console.log(`[AQ] Desktop nav construída com ${menuLinks.length} itens.`);
}
