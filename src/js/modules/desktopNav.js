/**
 * desktopNav.js – Versão 5 (Definitiva com URLs reais)
 * Menu de 9 itens horizontais com submenus para Equipamento e Hardscape.
 * Font Awesome 5 Free.
 */

const MENU = [
  {
    label: 'Equipamento',
    icon: 'fas fa-tools',
    href: null, // Só submenu
    children: [
      { label: 'Filtros Externos',   icon: 'fas fa-filter',            href: '/category/equipamento-filtros-externos' },
      { label: 'Filtros Internos',   icon: 'fas fa-filter',            href: '/category/equipamento-filtros-internos' },
      { label: 'Filtros Cascata',    icon: 'fas fa-water',             href: '/category/equipamento-filtros-cascata' },
      { label: 'Medicação',          icon: 'fas fa-pills',             href: '/category/equipamento-medicacao' },
      { label: 'Termostatos',        icon: 'fas fa-thermometer-half',  href: '/category/equipamento-termostatos' },
      { label: 'Fertilizantes',      icon: 'fas fa-flask',             href: '/category/equipamento-fertilizantes' },
      { label: 'Areão',              icon: 'fas fa-layer-group',       href: '/category/equipamento-areao-inerte' },
      { label: 'Substrato Fértil',   icon: 'fas fa-seedling',          href: '/category/equipamento-areao-fertil' },
      { label: 'CO₂',                icon: 'fas fa-wind',              href: '/category/equipamento-co2' },
      { label: 'LEDs',               icon: 'fas fa-lightbulb',         href: '/category/equipamento-led-s' },
      { label: 'Media Filtrante',    icon: 'fas fa-recycle',           href: '/category/equipamento-media-filtrante' },
      { label: 'Testes de Água',     icon: 'fas fa-vial',              href: '/category/equipamento-testes-de-agua' },
      { label: 'Lilly Pipes',        icon: 'fas fa-grip-lines-vertical',href: '/category/equipamento-lilly-pipes' },
      { label: 'Aquários',           icon: 'fas fa-cube',              href: '/category/equipamento-aquarios' },
      { label: 'Acessórios',         icon: 'fas fa-toolbox',           href: '/category/equipamento-acessorios' },
      { label: 'Bombas de Água',     icon: 'fas fa-sync',              href: '/category/equipamento-bombas-de-agua' },
    ]
  },
  {
    label: 'Alimentação',
    icon: 'fas fa-utensils',
    href: '/category/alimentacao',
    children: []
  },
  {
    label: 'Hardscape',
    icon: 'fas fa-mountain',
    href: null, // Só submenu
    children: [
      { label: 'Rochas',  icon: 'fas fa-mountain', href: '/category/hardscape-rochas' },
      { label: 'Troncos', icon: 'fas fa-tree',      href: '/category/hardscape-troncos' },
    ]
  },
  {
    label: 'Plantas',
    icon: 'fas fa-seedling',
    href: '/category/plantas',
    children: []
  },
  {
    label: 'Peixes',
    icon: 'fas fa-fish',
    href: '/category/peixes',
    children: []
  },
  {
    label: 'Invertebrados',
    icon: 'fas fa-bug',
    href: '/category/invertebrados',
    children: []
  },
  {
    label: 'Outros',
    icon: 'fas fa-ellipsis-h',
    href: '/category/outros',
    children: []
  },
  {
    label: 'Condicionadores de Água',
    icon: 'fas fa-tint',
    href: '/category/condicionadores-de-agua',
    children: []
  },
  {
    label: 'Aquascaping',
    icon: 'fas fa-leaf',
    href: '/category/aquascaping',
    children: []
  },
];

function createNavItem(item) {
  const li = document.createElement('li');
  const hasChildren = item.children && item.children.length > 0;
  if (hasChildren) li.className = 'aq-has-sub';

  const a = document.createElement('a');
  // Se não tem página própria, previne navegação
  a.href = item.href || '#';
  if (!item.href) a.addEventListener('click', e => e.preventDefault());
  a.setAttribute('role', 'menuitem');
  a.title = item.label;

  // Ícone + texto + seta (se tiver submenu)
  a.innerHTML = `
    <i class="${item.icon}" aria-hidden="true"></i>
    <span>${item.label}</span>
    ${hasChildren ? '<i class="fas fa-chevron-down aq-arrow" aria-hidden="true"></i>' : ''}
  `;

  li.appendChild(a);

  // Submenu dropdown
  if (hasChildren) {
    const sub = document.createElement('ul');
    sub.className = 'aq-submenu';
    sub.setAttribute('role', 'menu');

    item.children.forEach(child => {
      const subLi = document.createElement('li');
      const subA  = document.createElement('a');
      subA.href   = child.href;
      subA.innerHTML = `<i class="${child.icon}" aria-hidden="true"></i><span>${child.label}</span>`;
      subA.setAttribute('role', 'menuitem');
      subLi.appendChild(subA);
      sub.appendChild(subLi);
    });

    li.appendChild(sub);
  }

  return li;
}

export function buildDesktopNav() {
  if (window.innerWidth < 992) return;
  if (document.getElementById('aq-nav-bar')) return;

  const header = document.querySelector('header, #header, .header');
  if (!header) { setTimeout(buildDesktopNav, 500); return; }

  // Esconder bolinha hamburguer real do Boxie
  const triggers = header.querySelectorAll(
    '.trigger-header-menu, .menu-toggle, .mobile-menu-btn, .burger, .btn-menu, .navbar-toggler'
  );
  triggers.forEach(el => el.style.setProperty('display', 'none', 'important'));

  // Construir nav
  const nav = document.createElement('nav');
  nav.id = 'aq-nav-bar';
  nav.setAttribute('aria-label', 'Menu Principal');
  nav.setAttribute('role', 'navigation');

  const ul = document.createElement('ul');
  ul.setAttribute('role', 'menubar');
  MENU.forEach(item => ul.appendChild(createNavItem(item)));
  nav.appendChild(ul);

  // Adicionar como segunda linha no header
  header.appendChild(nav);

  console.log('[AQ] Nav v5 pronta —', MENU.length, 'itens.');
}
