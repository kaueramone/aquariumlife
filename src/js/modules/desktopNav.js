/**
 * desktopNav.js – Versão 4 (Definitiva)
 * 
 * O menu do Shopkit/Boxie usa um painel slide-over (`.trigger-header-menu`)
 * que só popula o DOM ao clicar — os links NÃO existem no DOM principal.
 * 
 * Estratégia: Hardcodar as categorias conhecidas + tentar ler da página.
 * Escondemos o .trigger-header-menu e injetamos nossa nav de 2 linhas.
 */

// Font Awesome 5 – ícones por categoria
const MENU_ITEMS = [
  { label: 'Equipamento',           icon: 'fas fa-tools',          href: '/categories/equipamento'           },
  { label: 'Alimentação',           icon: 'fas fa-utensils',        href: '/categories/alimentacao'           },
  { label: 'Hardscape',             icon: 'fas fa-mountain',        href: '/categories/hardscape'             },
  { label: 'Plantas',               icon: 'fas fa-seedling',        href: '/categories/plantas'               },
  { label: 'Peixes',                icon: 'fas fa-fish',            href: '/categories/peixes'                },
  { label: 'Invertebrados',         icon: 'fas fa-bug',             href: '/categories/invertebrados'         },
  { label: 'Condicionadores de água', icon: 'fas fa-tint',          href: '/categories/condicionadores-de-agua'},
  { label: 'Aquascaping',           icon: 'fas fa-leaf',            href: '/categories/aquascaping'           },
  { label: 'Outros',                icon: 'fas fa-ellipsis-h',      href: '/categories/outros'                },
];

/**
 * Tenta enriquecer os hrefs com os links reais do DOM (se existirem).
 * O Shopkit às vezes lista as categorias no body da homepage.
 */
function enrichFromDOM() {
  // Procura qualquer link de categoria no DOM
  const domLinks = document.querySelectorAll('a[href*="/categories/"], a[href*="/category/"]');
  if (!domLinks.length) return;

  const urlMap = {};
  domLinks.forEach(a => {
    const text = a.textContent.trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const href = a.getAttribute('href');
    if (href && text.length > 2) urlMap[text] = href;
  });

  MENU_ITEMS.forEach(item => {
    const key = item.label.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (urlMap[key]) item.href = urlMap[key];
  });
}

export function buildDesktopNav() {
  // Só no desktop
  if (window.innerWidth < 992) return;

  // Evitar duplicação
  if (document.getElementById('aq-nav-bar')) return;

  const header = document.querySelector('header, #header, .header');
  if (!header) { setTimeout(buildDesktopNav, 500); return; }

  // 1. Esconder o botão hamburguer (classe real do Boxie)
  const triggers = header.querySelectorAll(
    '.trigger-header-menu, .menu-toggle, .mobile-menu-btn, .burger, .btn-menu, .navbar-toggler'
  );
  triggers.forEach(el => {
    el.style.setProperty('display', 'none', 'important');
    el.setAttribute('aria-hidden', 'true');
  });

  // 2. Tentar enriquecer hrefs com links reais do DOM
  enrichFromDOM();

  // 3. Construir a nav
  const nav = document.createElement('nav');
  nav.id = 'aq-nav-bar';
  nav.setAttribute('aria-label', 'Menu Principal');
  nav.setAttribute('role', 'navigation');

  const ul = document.createElement('ul');
  ul.setAttribute('role', 'menubar');

  MENU_ITEMS.forEach(item => {
    const li = document.createElement('li');
    li.setAttribute('role', 'none');

    const a = document.createElement('a');
    a.href = item.href;
    a.setAttribute('role', 'menuitem');
    a.title = item.label;
    a.innerHTML = `<i class="${item.icon}" aria-hidden="true"></i><span>${item.label}</span>`;

    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);

  // 4. Inserir como segunda linha DENTRO do header (após o conteúdo existente)
  header.appendChild(nav);

  console.log('[AQ] Desktop nav v4 construída com', MENU_ITEMS.length, 'itens.');
}
