/**
 * desktopNav.js - v6
 * Fix: nav nativo oculto, hamburguer oculto, aq-nav-bar centrado
 */

const MENU = [
  {
    label: 'Equipamento',
    icon: 'fas fa-tools',
    href: '/category/equipamento',
    children: [
      { label: 'Filtros Externos',  icon: 'fas fa-recycle',            href: '/category/equipamento-filtros-externos' },
      { label: 'Filtros Internos',  icon: 'fas fa-stream',             href: '/category/equipamento-filtros-internos' },
      { label: 'Filtros Cascata',   icon: 'fas fa-tint',               href: '/category/equipamento-filtros-cascata' },
      { label: 'Medicação',         icon: 'fas fa-pills',              href: '/category/equipamento-medicacao' },
      { label: 'Termostatos',       icon: 'fas fa-thermometer-half',   href: '/category/equipamento-termostatos' },
      { label: 'Fertilizantes',     icon: 'fas fa-flask',              href: '/category/equipamento-fertilizantes' },
      { label: 'Areão',             icon: 'fas fa-layer-group',        href: '/category/equipamento-areao-inerte' },
      { label: 'Substrato Fértil',  icon: 'fas fa-seedling',           href: '/category/equipamento-areao-fertil' },
      { label: 'CO2',               icon: 'fas fa-wind',               href: '/category/equipamento-co2' },
      { label: 'LEDs',              icon: 'fas fa-lightbulb',          href: '/category/equipamento-led-s' },
      { label: 'Média Filtrante',   icon: 'fas fa-recycle',            href: '/category/equipamento-media-filtrante' },
      { label: 'Testes de Água',    icon: 'fas fa-vial',               href: '/category/equipamento-testes-de-agua' },
      { label: 'Lilly Pipes',       icon: 'fas fa-grip-lines-vertical', href: '/category/equipamento-lilly-pipes' },
      { label: 'Aquários',          icon: 'fas fa-cube',               href: '/category/equipamento-aquarios' },
      { label: 'Acessórios',        icon: 'fas fa-toolbox',            href: '/category/equipamento-acessorios' },
      { label: 'Bombas de Água',    icon: 'fas fa-sync',               href: '/category/equipamento-bombas-de-agua' },
    ]
  },
  { label: 'Alimentação',           icon: 'fas fa-utensils',  href: '/category/alimentacao',           children: [] },
  {
    label: 'Hardscape',
    icon: 'fas fa-mountain',
    href: '/category/hardscape',
    children: [
      { label: 'Rochas',  icon: 'fas fa-mountain', href: '/category/hardscape-rochas' },
      { label: 'Troncos', icon: 'fas fa-tree',     href: '/category/hardscape-troncos' },
    ]
  },
  { label: 'Plantas',               icon: 'fas fa-seedling',  href: '/category/plantas',               children: [] },
  { label: 'Peixes',                icon: 'fas fa-fish',      href: '/category/peixes',                children: [] },
  { label: 'Invertebrados',         icon: 'fas fa-bug',       href: '/category/invertebrados',         children: [] },
  { label: 'Condicionadores',       icon: 'fas fa-tint',      href: '/category/condicionadores-de-agua', children: [] },
  { label: 'Aquascaping',           icon: 'fas fa-leaf',      href: '/category/aquascaping',           children: [] },
  { label: 'Outros',                icon: 'fas fa-ellipsis-h',href: '/category/outros',                children: [] },
];

function createNavItem(item) {
  var li = document.createElement('li');
  var hasChildren = item.children && item.children.length > 0;
  if (hasChildren) li.className = 'aq-has-sub';

  var a = document.createElement('a');
  a.href = item.href || '#';
  a.setAttribute('role', 'menuitem');

  a.innerHTML =
    '<i class="' + item.icon + '" aria-hidden="true"></i>' +
    '<span>' + item.label + '</span>' +
    (hasChildren ? '<i class="fas fa-chevron-down aq-arrow" aria-hidden="true"></i>' : '');

  li.appendChild(a);

  if (hasChildren) {
    var sub = document.createElement('ul');
    sub.className = 'aq-submenu';
    sub.setAttribute('role', 'menu');
    item.children.forEach(function(child) {
      var subLi = document.createElement('li');
      var subA  = document.createElement('a');
      subA.href = child.href;
      subA.setAttribute('role', 'menuitem');
      subA.innerHTML = '<i class="' + child.icon + '" aria-hidden="true"></i><span>' + child.label + '</span>';
      subLi.appendChild(subA);
      sub.appendChild(subLi);
    });
    li.appendChild(sub);
  }

  return li;
}

function hideNativeNav() {
  // Ocultar o nav nativo do Shopkit (tag nav directa dentro do header, sem id aq-nav-bar)
  var header = document.querySelector('body > header, body > .header');
  if (!header) return;
  Array.from(header.querySelectorAll('nav')).forEach(function(nav) {
    if (nav.id !== 'aq-nav-bar') {
      nav.style.setProperty('display', 'none', 'important');
    }
  });
  // Ocultar hamburguer: trigger-wrapper e similares
  Array.from(header.querySelectorAll(
    '.trigger-wrapper, .trigger-header-menu, .menu-toggle, .mobile-menu-btn, .burger, .btn-menu, .navbar-toggler'
  )).forEach(function(el) {
    el.style.setProperty('display', 'none', 'important');
  });
}

function tryBuild() {
  if (window.innerWidth < 992) return false;
  if (document.getElementById('aq-nav-bar')) {
    // Nav ja existe — apenas garantir que o nativo esta oculto
    hideNativeNav();
    return true;
  }

  var header =
    document.querySelector('body > header') ||
    document.querySelector('body > .header') ||
    document.querySelector('#header') ||
    document.querySelector('header');

  if (!header) return false;
  if (header.closest('footer, #footer, .footer')) return false;

  // Construir o nosso nav
  var nav = document.createElement('nav');
  nav.id = 'aq-nav-bar';
  nav.setAttribute('aria-label', 'Menu Principal');
  nav.setAttribute('role', 'navigation');

  var ul = document.createElement('ul');
  ul.setAttribute('role', 'menubar');
  MENU.forEach(function(item) { ul.appendChild(createNavItem(item)); });
  nav.appendChild(ul);

  // Inserir como ultimo filho do header (abaixo da linha logo/icones)
  header.appendChild(nav);

  // Ocultar nav nativo APOS inserir o nosso
  hideNativeNav();

  console.log('[AQ] desktopNav v6 — ' + MENU.length + ' itens inseridos');
  return true;
}

export function buildDesktopNav() {
  if (tryBuild()) return;

  var attempts = 0;
  var interval = setInterval(function() {
    attempts++;
    if (tryBuild() || attempts >= 15) clearInterval(interval);
  }, 400);
}
