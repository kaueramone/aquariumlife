(function () {
    'use strict';

    const initAnimations = () => {
        console.log('Initializing custom micro-animations...');
        
        // Example: Add intersection observer for smooth reveal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        });

        const products = document.querySelectorAll('.product, .product-view, .categories-item');
        products.forEach(el => {
            el.classList.add('fade-in-on-scroll');
            observer.observe(el);
        });
    };

    function injectMenuIcons() {
      const menuLinks = document.querySelectorAll('.menu-link, .nav-link, .header-menu a, #header a');
      
      if (!menuLinks.length) return;

      // Mapa de palavras-chave para ícones do RemixIcon
      const iconMap = {
        'equipamento': 'ri-settings-4-line',
        'alimentação': 'ri-restaurant-line',
        'hardscape': 'ri-landscape-line',
        'plantas': 'ri-plant-line',
        'peixes': 'ri-anchor-line', // RemixIcon não tem peixe perfeito, âncora/água serve
        'invertebrados': 'ri-bug-line',
        'outros': 'ri-archive-line',
        'condicionadores': 'ri-flask-line',
        'aquascaping': 'ri-quill-pen-line'
      };

      menuLinks.forEach(link => {
        // Evitar injetar ícones em links de sistema (como ícone de carrinho ou login)
        if (link.querySelector('i') || link.children.length > 0) return;

        const text = link.textContent.toLowerCase().trim();
        
        // Procura por correspondência no mapa
        for (const [key, iconClass] of Object.entries(iconMap)) {
          if (text.includes(key)) {
            // Cria o ícone
            const icon = document.createElement('i');
            icon.className = `${iconClass} menu-dynamic-icon`;
            icon.style.marginRight = '8px';
            icon.style.color = '#08EEBC';
            icon.style.fontSize = '1.1rem';
            icon.style.verticalAlign = 'middle';
            
            // Inserir antes do texto
            link.prepend(icon);
            break; // Aplica só o primeiro que encontrar
          }
        }
      });
    }

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

    function buildDesktopNav() {
      if (tryBuild()) return;

      var attempts = 0;
      var interval = setInterval(function() {
        attempts++;
        if (tryBuild() || attempts >= 15) clearInterval(interval);
      }, 400);
    }

    /**
     * categorySection.js – v2
     * Oculta apenas a secção de categorias nativa do Shopkit (sem tocar no resto da página)
     * e injeta a nossa versão premium com neon glow.
     */

    const CATEGORIES = [
      { label: 'Equipamento',             href: '/category/equipamento',             img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/7753b01-160640-equipamentos-de-aquario.png' },
      { label: 'Alimentação',             href: '/category/alimentacao',             img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/8d9eaef-160632-alimentacao.png' },
      { label: 'Hardscape',               href: '/category/hardscape',               img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/d56453d-160643-hardscape.png' },
      { label: 'Plantas',                 href: '/category/plantas',                 img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/fca290c-160659-plantas.png' },
      { label: 'Peixes',                  href: '/category/peixes',                  img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/c380f2e-160654-peixes.png' },
      { label: 'Invertebrados',           href: '/category/invertebrados',           img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/904bd1c-160646-invertebrados.png' },
      { label: 'Condicionadores de Água', href: '/category/condicionadores-de-agua', img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/3a2d344-160638-condicionadores-de-agua.png' },
      { label: 'Aquascaping',             href: '/category/aquascaping',             img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/9977c3d-160634-aquascaping.png' },
      { label: 'Outros',                  href: '/category/outros',                  img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/41700fb-160651-outros.png' },
    ];

    /**
     * Encontra o container a ocultar de forma cirúrgica.
     *
     * Estratégia (por ordem de preferência):
     *  1. <section> mais próximo — Shopkit/Boxie usa <section> por bloco
     *  2. Pai do .slick-initialized que contém .categories-item (slider block)
     *  3. Fallback: sobe no máximo 5 níveis desde o item, nunca passando
     *     body / main / #wrapper ou divs de conteúdo raiz
     */
    function findCategoryContainer(item) {
      // 1) Tenta o <section> mais próximo
      const sec = item.closest('section');
      if (sec) return sec;

      // Containers que NÃO podemos ocultar (raiz da página)
      const isPageRoot = (el) =>
        !el ||
        el.tagName === 'BODY' ||
        el.tagName === 'HTML' ||
        el.tagName === 'MAIN' ||
        el.id === 'wrapper' ||
        el.id === 'page' ||
        el.id === 'content' ||
        el.id === 'app' ||
        el.classList.contains('wrapper') ||
        el.classList.contains('main-content') ||
        el.classList.contains('page-content') ||
        el.classList.contains('store-content');

      // 2) Parte do slider que contém categorias
      const slider =
        item.closest('.slick-initialized') ||
        item.closest('.slick-slider');

      let current = slider || item;

      // Sobe no máximo 4 níveis desde o slider
      for (let i = 0; i < 4; i++) {
        const parent = current.parentElement;
        if (!parent || isPageRoot(parent)) break; // para ANTES de ocultar o pai raiz
        current = parent;
        // Parar cedo se encontrar um div que parece um bloco de secção
        if (
          current.tagName === 'SECTION' ||
          current.classList.contains('section') ||
          current.classList.contains('block') ||
          current.classList.contains('home-section')
        ) break;
      }

      return current;
    }

    function buildNewSection() {
      const section = document.createElement('section');
      section.id = 'aq-categories';

      const grid = document.createElement('div');
      grid.className = 'aq-cat-grid';

      CATEGORIES.forEach((cat) => {
        const a = document.createElement('a');
        a.href = cat.href;
        a.className = 'aq-cat-item';

        const img = document.createElement('img');
        img.src = cat.img;
        img.alt = cat.label;
        img.className = 'aq-cat-icon';
        img.loading = 'lazy';

        const name = document.createElement('span');
        name.className = 'aq-cat-name';
        name.textContent = cat.label;

        a.appendChild(img);
        a.appendChild(name);
        grid.appendChild(a);
      });

      section.appendChild(grid);
      return section;
    }

    function buildSection() {
      if (document.getElementById('aq-categories')) return true;

      const nativeItem = document.querySelector('.categories-item');
      if (!nativeItem) return false;

      const hideTarget = findCategoryContainer(nativeItem);
      hideTarget.style.setProperty('display', 'none', 'important');

      // Remover espaçamento inferior da secção anterior (banner/slider)
      const prevSection = hideTarget.previousElementSibling;
      if (prevSection && !prevSection.id?.startsWith('aq-')) {
        prevSection.style.setProperty('margin-bottom', '0', 'important');
        prevSection.style.setProperty('padding-bottom', '0', 'important');
      }

      const newSection = buildNewSection();
      hideTarget.parentNode.insertBefore(newSection, hideTarget.nextSibling);

      console.log('[AQ] Category section v2 —', hideTarget.tagName, hideTarget.className || hideTarget.id, '→ oculto');
      return true;
    }

    function initCategorySection() {
      if (buildSection()) return;

      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (buildSection() || attempts >= 20) clearInterval(interval);
      }, 300);

      const observer = new MutationObserver(() => {
        if (buildSection()) observer.disconnect();
      });
      observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
      });
    }

    /**
     * productsSection.js – v4
     * - Oculta titulo nativo "Produtos"
     * - Move botao Comprar para filho direto de .card-shadow-hover (apos .product-details)
     * - Injeta botao "Ver todos os nossos produtos"
     */

    const VER_TODOS_HREF = '/catalog';

    // Mover botoes ────────────────────────────────────────────────────────────────
    function moveComprarButtons() {
      const btns = document.querySelectorAll(
        '.product-view a.product-btn, .product-view .product-btn'
      );
      if (!btns.length) return false;

      btns.forEach(btn => {
        const card = btn.closest('.card-shadow-hover');
        if (!card) return;
        // Ultimo filho de .card-shadow-hover = depois de .product-details
        // Fica no fluxo flex do card, abaixo do preco, dentro da borda visual
        card.appendChild(btn);
      });

      console.log('[AQ] Botoes Comprar movidos:', btns.length);
      return true;
    }

    // Ocultar titulo da seccao ────────────────────────────────────────────────────
    function hideProductsTitle() {
      const firstView = document.querySelector('.product-view');
      if (!firstView) return false;

      let section = firstView;
      while (section.parentElement && section.parentElement.tagName !== 'BODY') {
        section = section.parentElement;
        if (section.tagName === 'SECTION' || section.classList.contains('section')) break;
      }

      ['.title', '.title_mb-lg', 'h1', 'h2', 'h3', '.section-title', '.block-title']
        .forEach(sel => section.querySelectorAll(sel).forEach(el => {
          if (!el.closest('.card-shadow-hover') && !el.closest('.related-products')) {
            el.style.setProperty('display', 'none', 'important');
          }
        }));

      return true;
    }

    // Injetar "Ver todos" ─────────────────────────────────────────────────────────
    function injectVerTodos() {
      if (document.getElementById('aq-ver-todos')) return true;

      const firstView = document.querySelector('.product-view');
      if (!firstView) return false;

      let insertAfter = firstView;
      for (let i = 0; i < 6; i++) {
        const parent = insertAfter.parentElement;
        if (!parent || parent.tagName === 'BODY') break;
        insertAfter = parent;
        if (insertAfter.tagName === 'SECTION' || insertAfter.classList.contains('section')) break;
      }

      const wrapper = document.createElement('div');
      wrapper.id = 'aq-ver-todos';
      const a = document.createElement('a');
      a.href = VER_TODOS_HREF;
      const span = document.createElement('span');
      span.textContent = 'Ver todos os nossos produtos';
      a.appendChild(span);
      wrapper.appendChild(a);
      insertAfter.parentNode.insertBefore(wrapper, insertAfter.nextSibling);

      return true;
    }

    // Build principal ─────────────────────────────────────────────────────────────
    function build$1() {
      const t = hideProductsTitle();
      const m = moveComprarButtons();
      const v = injectVerTodos();
      return t && m && v;
    }

    function initProductsSection() {
      if (build$1()) return;

      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (build$1() || attempts >= 25) clearInterval(interval);
      }, 250);

      const observer = new MutationObserver(() => {
        if (document.querySelector('.product-view a.product-btn')) {
          moveComprarButtons();
        }
      });
      observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
      });
    }

    /**
     * cartStyles.js - v5
     * - Observer leve: childList apenas no body, sem attributes subtree
     * - Modal existente no DOM: polling leve ao clicar em comprar
     */

    var NEON = '#08EEBC';
    var DARK = '#001531';
    var STYLED = 'aq-styled';

    function applyDarkCart(popup) {
      if (!popup || popup.getAttribute(STYLED)) return;
      popup.setAttribute(STYLED, '1');

      var set = function(el, p, v) { if (el) el.style.setProperty(p, v, 'important'); };

      set(popup, 'background',       DARK);
      set(popup, 'background-color', DARK);
      set(popup, 'border',           '1px solid rgba(8,238,188,0.25)');
      set(popup, 'border-radius',    '14px');
      set(popup, 'box-shadow',       '0 20px 50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(8,238,188,0.1)');
      set(popup, 'overflow',         'hidden');
      set(popup, 'color',            '#fff');

      popup.querySelectorAll('.cart-item').forEach(function(el) {
        set(el, 'border-bottom', '1px solid rgba(8,238,188,0.08)');
        set(el, 'background', 'transparent');
      });
      popup.querySelectorAll('.item-image img').forEach(function(el) {
        set(el, 'border-radius', '8px');
        set(el, 'background', 'rgba(0,8,20,0.6)');
        set(el, 'border', '1px solid rgba(8,238,188,0.12)');
        set(el, 'padding', '4px');
      });
      popup.querySelectorAll('.item-product').forEach(function(el) {
        set(el, 'color', '#cde4f8');
        set(el, 'font-weight', '500');
      });
      popup.querySelectorAll('.details .price').forEach(function(el) {
        set(el, 'color', NEON);
        set(el, 'font-weight', '700');
      });
      popup.querySelectorAll('a.remove').forEach(function(el) {
        set(el, 'background', 'transparent');
        set(el, 'border', '1px solid rgba(8,238,188,0.2)');
        set(el, 'border-radius', '50%');
        set(el, 'width', '30px');
        set(el, 'height', '30px');
        set(el, 'display', 'flex');
        set(el, 'align-items', 'center');
        set(el, 'justify-content', 'center');
        set(el, 'padding', '0');
        set(el, 'box-shadow', 'none');
        el.querySelectorAll('svg, path').forEach(function(p) { set(p, 'fill', NEON); });
      });

      var total = popup.querySelector('.cart-total');
      if (total) {
        set(total, 'background', 'rgba(8,238,188,0.03)');
        set(total, 'border-top', '1px solid rgba(8,238,188,0.1)');
        set(total, 'padding', '12px 16px');
        set(total, 'display', 'flex');
        set(total, 'justify-content', 'space-between');
        set(total, 'align-items', 'center');
        var tt = total.querySelectorAll('.cart-total-text');
        if (tt[0]) {
          set(tt[0], 'color', 'rgba(255,255,255,0.6)');
          set(tt[0], 'font-size', '0.8rem');
          set(tt[0], 'text-transform', 'uppercase');
          set(tt[0], 'letter-spacing', '1px');
        }
        if (tt[1]) {
          set(tt[1], 'color', NEON);
          set(tt[1], 'font-size', '1.15rem');
          set(tt[1], 'font-weight', '700');
        }
      }

      var btns = popup.querySelector('.cart-btns');
      if (btns) {
        set(btns, 'display', 'flex');
        set(btns, 'flex-direction', 'row');
        set(btns, 'gap', '8px');
        set(btns, 'padding', '12px 16px 16px');
        set(btns, 'background', 'transparent');
      }
      popup.querySelectorAll('.cart-btn').forEach(styleNeonBtn);
    }

    function applyDarkModal(modal) {
      if (!modal) return;
      /* Permite reaplicar sempre que chamado (modal pode abrir varias vezes) */
      modal.removeAttribute(STYLED);
      if (modal.getAttribute(STYLED)) return;
      modal.setAttribute(STYLED, '1');

      var set = function(el, p, v) { if (el) el.style.setProperty(p, v, 'important'); };

      set(modal, 'z-index',         '10100');
      set(modal, 'display',         'flex');
      set(modal, 'align-items',     'center');
      set(modal, 'justify-content', 'center');
      set(modal, 'padding',         '20px');
      set(modal, 'overflow-y',      'auto');

      var dialog = modal.querySelector('.modal-dialog');
      if (dialog) {
        set(dialog, 'position',  'relative');
        set(dialog, 'margin',    'auto');
        set(dialog, 'top',       'auto');
        set(dialog, 'left',      'auto');
        set(dialog, 'transform', 'none');
        set(dialog, 'max-width', '480px');
        set(dialog, 'width',     '100%');
      }

      var backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        set(backdrop, 'z-index',    '10050');
        set(backdrop, 'background', 'rgba(0,4,13,0.82)');
        set(backdrop, 'opacity',    '1');
      }

      var content = modal.querySelector('.modal-content') || modal;
      set(content, 'background',       DARK);
      set(content, 'background-color', DARK);
      set(content, 'border',           '1px solid rgba(8,238,188,0.25)');
      set(content, 'border-radius',    '14px');
      set(content, 'box-shadow',       '0 20px 50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(8,238,188,0.1)');
      set(content, 'color',            '#fff');

      var mHeader = modal.querySelector('.modal-header');
      if (mHeader) {
        set(mHeader, 'background',    'transparent');
        set(mHeader, 'border-bottom', '1px solid rgba(8,238,188,0.1)');
        set(mHeader, 'padding',       '16px 20px');
        mHeader.querySelectorAll('h1,h2,h3,h4,h5,h6,.modal-title').forEach(function(el) {
          set(el, 'color', '#fff');
          set(el, 'font-weight', '600');
        });
        var closeBtn = mHeader.querySelector('.close, [data-dismiss="modal"], button');
        if (closeBtn) {
          set(closeBtn, 'color',       'rgba(255,255,255,0.5)');
          set(closeBtn, 'background',  'transparent');
          set(closeBtn, 'border',      'none');
          set(closeBtn, 'font-size',   '1.4rem');
          set(closeBtn, 'opacity',     '1');
          set(closeBtn, 'text-shadow', 'none');
        }
      }

      var mBody = modal.querySelector('.modal-body');
      if (mBody) {
        set(mBody, 'background', 'transparent');
        set(mBody, 'padding',    '24px 20px');
        mBody.querySelectorAll('p, span, label').forEach(function(el) {
          set(el, 'color', 'rgba(255,255,255,0.85)');
        });
        mBody.querySelectorAll('h2, h3, h4').forEach(function(el) {
          set(el, 'color', '#fff');
          set(el, 'font-weight', '600');
        });
        mBody.querySelectorAll('svg').forEach(function(el) {
          set(el, 'color', NEON);
          set(el, 'fill',  NEON);
        });
      }

      var mFooter = modal.querySelector('.modal-footer');
      if (mFooter) {
        set(mFooter, 'background',   'transparent');
        set(mFooter, 'border-top',   '1px solid rgba(8,238,188,0.1)');
        set(mFooter, 'padding',      '12px 20px 16px');
        set(mFooter, 'display',      'flex');
        set(mFooter, 'gap',          '10px');
        mFooter.querySelectorAll('a, button, .btn').forEach(styleNeonBtn);
      } else {
        modal.querySelectorAll('a.btn, button.btn, .btn').forEach(styleNeonBtn);
      }

      console.log('[AQ] Modal dark theme applied');
    }

    function styleNeonBtn(btn) {
      var set = function(p, v) { btn.style.setProperty(p, v, 'important'); };
      set('background',       'transparent');
      set('background-image', 'none');
      set('border',           '1.5px solid ' + NEON);
      set('border-radius',    '6px');
      set('color',            NEON);
      set('box-shadow',       'none');
      set('text-shadow',      'none');
      set('flex',             '1');
      set('padding',          '11px 10px');
      set('font-size',        '0.72rem');
      set('font-weight',      '700');
      set('text-transform',   'uppercase');
      set('letter-spacing',   '1.5px');
      set('text-decoration',  'none');
      set('display',          'flex');
      set('align-items',      'center');
      set('justify-content',  'center');
      set('text-align',       'center');
      set('cursor',           'pointer');

      if (!btn._aqHover) {
        btn._aqHover = true;
        btn.addEventListener('mouseenter', function() {
          btn.style.setProperty('background', NEON, 'important');
          btn.style.setProperty('color', DARK, 'important');
          btn.style.setProperty('box-shadow', '0 0 16px rgba(8,238,188,0.4)', 'important');
        });
        btn.addEventListener('mouseleave', function() {
          btn.style.setProperty('background', 'transparent', 'important');
          btn.style.setProperty('color', NEON, 'important');
          btn.style.setProperty('box-shadow', 'none', 'important');
        });
      }
    }

    function updateBadge() {
      var link = document.querySelector('.link-cart');
      if (!link) return;
      var hasProducts = link.classList.contains('has-products') ||
        document.querySelectorAll('.cart-list .cart-item').length > 0;
      var badge = link.querySelector('.aq-cart-badge');
      if (!hasProducts) { if (badge) badge.remove(); return; }
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'aq-cart-badge';
        link.appendChild(badge);
      }
      badge.textContent = '!';
    }

    /*
     * Polling leve: verifica a cada 200ms se algum .modal esta visivel.
     * So corre durante 5s apos um clique em botao de compra, depois para.
     * Muito mais eficiente que attributes+subtree no MutationObserver.
     */
    function watchForModal() {
      var attempts = 0;
      var interval = setInterval(function() {
        attempts++;
        var modal = document.querySelector('.modal.show, .modal.in');
        if (!modal) {
          /* Bootstrap 4 usa display:block sem classe show em alguns temas */
          var all = document.querySelectorAll('.modal');
          for (var i = 0; i < all.length; i++) {
            if (all[i].style.display === 'block') { modal = all[i]; break; }
          }
        }
        if (modal) {
          applyDarkModal(modal);
          clearInterval(interval);
          return;
        }
        if (attempts >= 25) clearInterval(interval); /* para apos 5s */
      }, 200);
    }

    /* Escuta cliques em botoes de compra para iniciar o polling */
    function listenBuyButtons() {
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action="cart.add"], .btn-cart, .add-to-cart, [class*="add-cart"], form[action*="cart"] button[type="submit"]');
        if (btn) watchForModal();
      }, true);
    }

    /* Garante que "Continuar a comprar" / qualquer [data-dismiss=modal] fecha
       mesmo o modal de adicionado-ao-carrinho. O Bootstrap nem sempre processa
       este modal (e o backdrop pode intercetar cliques), por isso fechamos a
       mao via delegacao no document — robusto a timing e a re-renderizacoes. */
    var DISMISS_BOUND = false;
    function ensureModalDismiss() {
      if (DISMISS_BOUND) return;
      DISMISS_BOUND = true;

      function closeCartModal(modal) {
        if (!modal) return;
        /* tentar via Bootstrap primeiro */
        if (window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
          try { window.jQuery(modal).modal('hide'); } catch (e) {}
        }
        /* forcar o fecho via CSS/classes */
        modal.classList.remove('show', 'in');
        modal.style.setProperty('display', 'none', 'important');
        /* remover backdrops residuais que bloqueiam cliques */
        document.querySelectorAll('.modal-backdrop').forEach(function (b) {
          b.style.setProperty('display', 'none', 'important');
          if (b.parentNode) b.parentNode.removeChild(b);
        });
        /* restaurar o body */
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
      }

      // Enquanto um modal do carrinho estiver aberto, garante que nenhum backdrop
      // residual intercepta cliques (deixa o backdrop visivel mas "atravessavel").
      function unblockBackdrops() {
        var openModal = document.querySelector('.modal.show, .modal.in');
        if (!openModal) return;
        document.querySelectorAll('.modal-backdrop').forEach(function (b) {
          b.style.setProperty('pointer-events', 'none', 'important');
        });
        // o proprio modal nao deve bloquear cliques fora do dialog
        openModal.style.setProperty('pointer-events', 'auto', 'important');
      }
      setInterval(unblockBackdrops, 400);

      document.addEventListener('click', function (e) {
        var trigger = e.target.closest(
          '[data-dismiss="modal"], .modal-footer .btn, .modal a, .modal button'
        );
        if (!trigger) return;
        var txt = (trigger.textContent || '').trim().toLowerCase();
        var isDismiss = trigger.getAttribute('data-dismiss') === 'modal'
                     || /continuar a comprar/.test(txt);
        /* "Ver carrinho" tem href proprio: deixamos navegar normalmente */
        var isViewCart = /ver carrinho/.test(txt) || (trigger.getAttribute('href') || '').indexOf('/cart') !== -1;
        if (isDismiss && !isViewCart) {
          var modal = trigger.closest('.modal');
          /* nao bloquear o comportamento nativo, so garantir o fecho a seguir */
          setTimeout(function () { closeCartModal(modal); }, 0);
        }
      }, true);
    }

    function initCartStyles() {
      killGeoModal();
      ensureModalDismiss();
      document.querySelectorAll('.cart-list').forEach(applyDarkCart);
      document.querySelectorAll('.modal.show, .modal.in').forEach(applyDarkModal);
      updateBadge();
      listenBuyButtons();

      /* Observer leve: so childList no body direto, sem subtree nos atributos */
      new MutationObserver(function(mutations) {
        var needsBadge = false;
        mutations.forEach(function(m) {
          m.addedNodes.forEach(function(node) {
            if (node.nodeType !== 1) return;
            /* Mini-cart adicionado */
            if (node.classList && node.classList.contains('cart-list')) {
              applyDarkCart(node);
              needsBadge = true;
            }
            if (node.querySelectorAll) {
              node.querySelectorAll('.cart-list').forEach(function(el) {
                applyDarkCart(el);
                needsBadge = true;
              });
            }
            /* Modal adicionado dinamicamente */
            if (node.classList && node.classList.contains('modal')) {
              watchForModal();
            }
            /* Backdrop */
            if (node.classList && node.classList.contains('modal-backdrop')) {
              /* Verificar se e do geo modal -- se for, eliminar */
              var geoModal = document.getElementById('user-geolocation-modal');
              if (geoModal && (geoModal.classList.contains('in') || geoModal.style.display === 'block')) {
                setTimeout(function() {
                  var geo2 = document.getElementById('user-geolocation-modal');
                  if (geo2) { geo2.style.setProperty('display', 'none', 'important'); }
                  node.style.setProperty('display', 'none', 'important');
                  document.body.classList.remove('modal-open');
                }, 50);
              } else {
                node.style.setProperty('z-index', '10050', 'important');
                node.style.setProperty('background', 'rgba(0,4,13,0.82)', 'important');
                node.style.setProperty('opacity', '1', 'important');
                /* Modal de carrinho a abrir */
                watchForModal();
              }
            }
          });
        });
        if (needsBadge) updateBadge();
      }).observe(document.body, { childList: true, subtree: true });
    }

    /* Neutraliza o modal de geolocalizacao do Shopkit que bloqueia cliques */
    function killGeoModal() {
      function dismiss() {
        var geo = document.getElementById('user-geolocation-modal');
        if (!geo) return;
        /* Fechar via Bootstrap se disponivel */
        if (window.jQuery && window.jQuery.fn.modal) {
          try { window.jQuery('#user-geolocation-modal').modal('hide'); } catch(e) {}
        }
        /* Forcado via CSS */
        geo.style.setProperty('display', 'none', 'important');
        geo.style.setProperty('pointer-events', 'none', 'important');
        /* Remover backdrop residual */
        document.querySelectorAll('.modal-backdrop').forEach(function(b) {
          b.style.setProperty('display', 'none', 'important');
          b.style.setProperty('pointer-events', 'none', 'important');
          if (b.parentNode) b.parentNode.removeChild(b);
        });
        /* Restaurar body */
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
      }

      /* Tentar imediatamente */
      dismiss();

      /* E quando o DOM estiver pronto */
      if (document.readyState !== 'complete') {
        window.addEventListener('load', dismiss);
      }

      /* Observer: se o Shopkit adicionar backdrop dinamicamente, remover */
      new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
          m.addedNodes.forEach(function(node) {
            if (!node.classList) return;
            if (node.classList.contains('modal-backdrop')) {
              /* Verificar se e o geo modal (nao o carrinho) */
              var geoOpen = document.getElementById('user-geolocation-modal');
              if (geoOpen && (geoOpen.classList.contains('in') || geoOpen.style.display === 'block')) {
                setTimeout(dismiss, 50);
              }
            }
          });
        });
      }).observe(document.body, { childList: true });
    }

    /**
     * brandsSection.js – v8
     * Só marcas com logo. Cores originais com opacidade + hover neon.
     */

    const BASE = 'https://www.aquariumlife.pt/brand/';

    const BRANDS_MAP = [
      { label: 'Oase',          href: `${BASE}oase`,           img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/1e9e814-155547-oase.png' },
      { label: 'UNS',           href: `${BASE}uns`,            img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/bf1a5d4-223057-uns.png' },
      { label: 'ME',            href: `${BASE}me`,             img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/25baccc-224313-meaquarist.png' },
      { label: 'Easy Life',     href: `${BASE}easy-life`,      img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/58cd74f-224703-easy-life-logo-white.svg' },
      { label: 'Seachem',       href: `${BASE}seachem`,        img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/81c433b-230814-logo2x.png' },
      { label: 'Hikari',        href: `${BASE}hiraki`,         img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/c6662f4-230041-hikari_logo.png' },
      { label: 'WeekAqua',      href: `${BASE}weekaqua`,       img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/d26904d-225829-weekaqua.png' },
      { label: 'Tropica',       href: `${BASE}tropica-plants`, img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/82414e4-225722-tropica.png' },
      { label: 'Milwaukee',     href: `${BASE}milwaukee`,      img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/b191a88-232705-logo-white.png' },
      { label: 'Salifert',      href: `${BASE}salifert`,       img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/40e8d92-232153-salifert.png' },
      { label: 'ICA',           href: `${BASE}ica`,            img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/248e14a-231838-ica_logo_vertical.svg' },
      { label: 'ESHA',          href: `${BASE}esha`,           img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/68ba01d-231641-esha-logo-white-2020.svg' },
      { label: 'Sera',          href: `${BASE}sera`,           img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/641f247-231444-sera.png' },
      { label: 'Superfish',     href: `${BASE}superfish`,      img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/b5a9cb8-234638-superfish.png' },
      { label: 'Colombo',       href: `${BASE}colombo`,        img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/3ee83b1-233903-logo-colombo-awg.svg' },
      { label: 'Tropical',      href: `${BASE}tropical`,       img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/d106650-233758-tropical.png' },
    ];

    function hideNativeBrands() {
      const native = document.querySelector('section.brands-block, section.brands.section');
      if (native) {
        native.style.setProperty('display', 'none', 'important');
        return true;
      }
      return false;
    }

    function buildBrandItem({ label, img: imgSrc, href }) {
      const el = document.createElement('a');
      el.className = 'aq-brand-item';
      el.title = label;
      el.href = href;
      el.rel = 'noopener';

      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = label;
      img.loading = 'lazy';
      img.onerror = function () {
        el.style.display = 'none'; // esconde se imagem falhar
      };
      el.appendChild(img);
      return el;
    }

    async function buildBrandsSection() {
      if (document.getElementById('aq-brands')) return null;

      const section = document.createElement('section');
      section.id = 'aq-brands';

      const header = document.createElement('div');
      header.className = 'aq-section-header';
      header.innerHTML = `
    <span class="aq-section-tag">Parceiros</span>
    <h2 class="aq-section-title">As Melhores <span class="aq-neon">Marcas</span></h2>
    <p class="aq-section-sub">Trabalhamos apenas com marcas de referência mundial em aquarismo</p>
  `;
      section.appendChild(header);

      const track = document.createElement('div');
      track.className = 'aq-brands-track';
      const inner = document.createElement('div');
      inner.className = 'aq-brands-inner';
      [...BRANDS_MAP, ...BRANDS_MAP].forEach(brand => inner.appendChild(buildBrandItem(brand)));
      track.appendChild(inner);
      section.appendChild(track);

      return section;
    }

    function initBrandsSection() {
      if (hideNativeBrands()) return;
      const obs = new MutationObserver(() => {
        if (hideNativeBrands()) obs.disconnect();
      });
      obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
    }

    /**
     * blogSection.js - v10
     * Blog listing: hero injectado imediatamente, cards preenchidos com MutationObserver
     */

    var BLOG_HREF = '/blog';
    var VISIBLE_CARDS = 6;

    function truncate(str, max) {
      if (!max) max = 130;
      if (!str || str.length <= max) return str || '';
      return str.slice(0, max).replace(/\s\S*$/, '') + '...';
    }

    function estimateReadTime(text) {
      if (!text) return null;
      var words = text.trim().split(/\s+/).length;
      return Math.max(1, Math.round(words / 220)) + ' min';
    }

    // Estrutura real Shopkit Boxie confirmada ao vivo:
    // img:     .blog-image img[data-src]
    // titulo:  .blog-post a.link-inherit  (ou img[title])
    // data:    .post-details span  (remover SVG/i)
    // excerpt: .blog-excerpt
    function extractPost(item) {
      var imgEl    = item.querySelector('.blog-image img');
      var linkEl   = item.querySelector('.blog-post a.link-inherit, .blog-post > a');
      var dateEl   = item.querySelector('.post-details span');
      var excerptEl = item.querySelector('.blog-excerpt');

      var img   = imgEl ? (imgEl.getAttribute('data-src') || imgEl.src || '') : '';
      var href  = linkEl ? linkEl.href : BLOG_HREF;
      var title = linkEl ? linkEl.textContent.trim() : '';
      if (!title && imgEl) title = imgEl.getAttribute('title') || imgEl.getAttribute('alt') || '';

      var date = '';
      if (dateEl) {
        var clone = dateEl.cloneNode(true);
        Array.from(clone.querySelectorAll('svg, i')).forEach(function(el) { el.remove(); });
        date = clone.textContent.trim();
      }

      var excerpt = excerptEl ? excerptEl.textContent.trim() : '';
      return { img: img, href: href, title: title, date: date, excerpt: excerpt };
    }

    function buildCard$1(post) {
      var card = document.createElement('a');
      card.href = post.href;
      card.className = 'aq-bl-card';
      card.setAttribute('aria-label', 'Ler artigo: ' + post.title);

      var rt = estimateReadTime(post.excerpt);

      card.innerHTML =
        '<div class="aq-bl-card-img">' +
          (post.img ? '<img src="' + post.img + '" alt="' + post.title.replace(/"/g,'') + '" loading="lazy"/>'
                    : '<div class="aq-bl-card-img-ph"><svg viewBox="0 0 48 48" fill="none"><rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" stroke-width="2"/></svg></div>') +
          '<span class="aq-bl-card-tag">Aquarismo</span>' +
        '</div>' +
        '<div class="aq-bl-card-body">' +
          '<div class="aq-bl-card-meta">' +
            (post.date ? '<time class="aq-bl-card-date">' + post.date + '</time>' : '') +
            (rt ? '<span class="aq-bl-card-rt">' + rt + ' leitura</span>' : '') +
          '</div>' +
          '<h3 class="aq-bl-card-title">' + post.title + '</h3>' +
          (post.excerpt ? '<p class="aq-bl-card-excerpt">' + truncate(post.excerpt) + '</p>' : '') +
          '<span class="aq-bl-card-cta">Ler artigo ' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
          '</span>' +
        '</div>';
      return card;
    }

    function injectCards(posts) {
      var grid = document.getElementById('aq-bl-grid');
      if (!grid) return;

      // Limpar qualquer conteudo anterior
      grid.innerHTML = '';

      var wrap = grid.parentElement;

      posts.forEach(function(post, idx) {
        var card = buildCard$1(post);
        if (idx >= VISIBLE_CARDS) card.classList.add('aq-bl-hidden');
        grid.appendChild(card);
      });

      // Botao ver mais
      if (posts.length > VISIBLE_CARDS && wrap) {
        var existing = wrap.querySelector('.aq-bl-more');
        if (!existing) {
          var moreWrap = document.createElement('div');
          moreWrap.className = 'aq-bl-more';
          moreWrap.innerHTML =
            '<button class="aq-bl-more-btn">Ver mais artigos ' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>' +
            '</button>';
          wrap.appendChild(moreWrap);
          moreWrap.querySelector('.aq-bl-more-btn').addEventListener('click', function() {
            Array.from(grid.querySelectorAll('.aq-bl-hidden')).forEach(function(c) {
              c.classList.remove('aq-bl-hidden');
              c.classList.add('aq-bl-revealed');
            });
            moreWrap.style.display = 'none';
          });
        }
      }

      console.log('[AQ] Blog v10: ' + posts.length + ' cards injectados');
    }

    function waitForPostsAndFill() {
      // Tentar imediatamente
      var items = Array.from(document.querySelectorAll('.blog-item'));
      var posts = items.map(extractPost).filter(function(p) { return !!p.title; });
      if (posts.length) { injectCards(posts); return; }

      // Usar MutationObserver para detectar quando .blog-item aparece
      var observer = new MutationObserver(function() {
        var items2 = Array.from(document.querySelectorAll('.blog-item'));
        var posts2 = items2.map(extractPost).filter(function(p) { return !!p.title; });
        if (posts2.length) {
          observer.disconnect();
          injectCards(posts2);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      // Timeout de seguranca: 5 segundos
      setTimeout(function() {
        observer.disconnect();
        var items3 = Array.from(document.querySelectorAll('.blog-item'));
        var posts3 = items3.map(extractPost).filter(function(p) { return !!p.title; });
        if (posts3.length) injectCards(posts3);
        else console.warn('[AQ] Blog: timeout — sem .blog-item');
      }, 5000);
    }

    function redesignBlogListing() {
      var path = window.location.pathname;
      if (path !== '/blog' && path !== '/blog/') return;
      if (document.body.classList.contains('aq-blog-styled')) return;
      document.body.classList.add('aq-blog-styled', 'aq-page-blog');

      // Ocultar elementos nativos do Shopkit
      var blogTitle = document.querySelector('h1.blog-title, .blog-title');
      if (blogTitle) blogTitle.style.setProperty('display', 'none', 'important');

      // Container
      var containerFluid = document.querySelector('.blog-page .container-fluid, .blog-page.section .container-fluid')
        || document.querySelector('.main')
        || document.body;

      // Injectar hero imediatamente
      var hero = document.createElement('div');
      hero.className = 'aq-bl-hero';
      hero.innerHTML =
        '<div class="aq-bl-hero-orbs">' +
          '<div class="aq-bl-orb aq-bl-orb--1"></div>' +
          '<div class="aq-bl-orb aq-bl-orb--2"></div>' +
        '</div>' +
        '<div class="aq-bl-hero-inner">' +
          '<span class="aq-section-tag">Blogue</span>' +
          '<h1 class="aq-bl-hero-title">Mundo do <span class="aq-neon">Aquarismo</span></h1>' +
          '<p class="aq-bl-hero-sub">Guias e dicas de especialistas sobre peixes, plantas, aquascaping e manutencao.</p>' +
        '</div>';

      // Injectar grid wrapper imediatamente (vazio)
      var gridWrap = document.createElement('div');
      gridWrap.className = 'aq-bl-wrap';
      var grid = document.createElement('div');
      grid.className = 'aq-bl-grid';
      grid.id = 'aq-bl-grid';
      gridWrap.appendChild(grid);

      containerFluid.insertBefore(gridWrap, containerFluid.firstChild);
      containerFluid.insertBefore(hero, containerFluid.firstChild);

      // Ocultar blog-row nativo (depois de injectar o nosso)
      var blogRow = document.querySelector('.blog-row, .blog-col');
      if (blogRow) blogRow.style.setProperty('display', 'none', 'important');

      // Aguardar posts e preencher
      waitForPostsAndFill();
    }

    // ── Secao Blog na Home ────────────────────────────────────────────────────────
    function buildHomeCard(post) {
      var card = document.createElement('a');
      card.href = post.href;
      card.className = 'aq-blog-card';
      card.setAttribute('aria-label', 'Ler artigo: ' + post.title);
      card.innerHTML =
        '<div class="aq-blog-card-img">' +
          (post.img ? '<img src="' + post.img + '" alt="' + post.title.replace(/"/g,'') + '" loading="lazy"/>'
                    : '<div class="aq-blog-card-img-placeholder"></div>') +
          '<span class="aq-blog-card-tag">Aquarismo</span>' +
        '</div>' +
        '<div class="aq-blog-card-body">' +
          (post.date ? '<div class="aq-blog-card-meta"><time class="aq-blog-card-date">' + post.date + '</time></div>' : '') +
          '<h3 class="aq-blog-card-title">' + post.title + '</h3>' +
          (post.excerpt ? '<p class="aq-blog-card-excerpt">' + truncate(post.excerpt) + '</p>' : '') +
          '<span class="aq-blog-card-cta">Ler artigo <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>' +
        '</div>';
      return card;
    }

    // Extrair post da home — estrutura diferente do /blog
    // Na home: a.blog-item > div.blog-preview (bg-image) + h3.blog-info + div.blog-status
    function extractHomePost(item) {
      // O proprio item e o <a> na home
      var href = item.href || BLOG_HREF;

      // Titulo: h3.blog-info
      var infoEl = item.querySelector('.blog-info, h3, h2');
      var title = infoEl ? infoEl.textContent.trim() : '';

      // Fallback: img title/alt
      if (!title) {
        var imgEl = item.querySelector('img');
        if (imgEl) title = imgEl.getAttribute('title') || imgEl.getAttribute('alt') || '';
      }

      // Imagem: background-image no .blog-preview
      var preview = item.querySelector('.blog-preview');
      var img = '';
      if (preview) {
        var bg = preview.style.backgroundImage || '';
        var match = bg.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (match) img = match[1];
      }
      // Fallback: img src/data-src
      if (!img) {
        var imgEl2 = item.querySelector('img');
        if (imgEl2) img = imgEl2.getAttribute('data-src') || imgEl2.src || '';
      }

      // Data/categoria: div.blog-status
      var statusEl = item.querySelector('.blog-status, .blog-date, time');
      var date = statusEl ? statusEl.textContent.trim() : '';

      return { href: href, title: title, img: img, date: date, excerpt: '' };
    }

    async function buildBlogSection() {
      if (document.getElementById('aq-blog-home')) return null;
      var section = document.createElement('section');
      section.id = 'aq-blog-home';
      section.innerHTML =
        '<div class="aq-section-header">' +
          '<span class="aq-section-tag">Do nosso blogue</span>' +
          '<h2 class="aq-section-title">Mergulha no Mundo do <span class="aq-neon">Aquarismo</span></h2>' +
          '<p class="aq-section-sub">Dicas de especialistas, guias passo a passo e novidades sobre peixes, plantas e aquascaping.</p>' +
        '</div>' +
        '<div class="aq-blog-grid" id="aq-blog-grid"></div>' +
        '<div class="aq-blog-home-cta">' +
          '<a href="' + BLOG_HREF + '" class="aq-btn-outline">Ver todos os artigos ' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
          '</a>' +
        '</div>';

      var grid = section.querySelector('#aq-blog-grid');
      var items = Array.from(document.querySelectorAll('.blog-item'));
      // Usar extractHomePost pois na home o .blog-item e o proprio <a>
      var posts = items.map(extractHomePost).filter(function(p) { return !!p.title; });

      if (posts.length) {
        posts.slice(0, 3).forEach(function(p) { grid.appendChild(buildHomeCard(p)); });
      } else {
        grid.innerHTML = '<div class="aq-blog-empty"><p>Em breve novos artigos sobre aquarismo!</p></div>';
      }
      return section;
    }

    // ── Post Individual ────────────────────────────────────────────────────────────
    function applyPostStyles() {
      var titleEl  = document.querySelector('.blog-post-title, h1.title, .post-title');
      var metaEl   = document.querySelector('.post-details');
      var imgEl    = document.querySelector('.image-post');
      var bodyEl   = document.querySelector('.post-content');
      if (!titleEl && !bodyEl) return false;

      if (titleEl) titleEl.classList.add('aq-post-title');
      if (metaEl)  metaEl.classList.add('aq-post-meta');
      if (imgEl)   imgEl.classList.add('aq-post-featured-img');
      if (bodyEl)  bodyEl.classList.add('aq-post-body');

      var rt = estimateReadTime(bodyEl ? bodyEl.textContent : '');
      if (rt && metaEl && !metaEl.querySelector('.aq-post-read-time')) {
        var tag = document.createElement('span');
        tag.className = 'aq-post-read-time';
        tag.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' +
          rt + ' de leitura';
        metaEl.appendChild(tag);
      }

      if (!document.getElementById('aq-post-back')) {
        var btn = document.createElement('a');
        btn.id = 'aq-post-back'; btn.href = BLOG_HREF; btn.className = 'aq-post-back-btn';
        btn.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Voltar ao Blog';
        var wrapper = document.querySelector('.content, .post-detail, article');
        if (wrapper) wrapper.insertBefore(btn, wrapper.firstChild);
      }
      return true;
    }

    function redesignBlogPost() {
      var path = window.location.pathname;
      if (!path.startsWith('/post/') && !path.startsWith('/blog/')) return;
      if (document.body.classList.contains('aq-post-styled')) return;
      document.body.classList.add('aq-post-styled', 'aq-page-post');

      if (!document.getElementById('aq-read-progress')) {
        var bar = document.createElement('div');
        bar.id = 'aq-read-progress';
        bar.innerHTML = '<div class="aq-read-progress-fill" id="aq-read-progress-fill"></div>';
        document.body.insertBefore(bar, document.body.firstChild);
      }

      if (!document.getElementById('aq-read-pct')) {
        var badge = document.createElement('div');
        badge.id = 'aq-read-pct';
        badge.innerHTML = '<span id="aq-read-pct-num">0</span><span class="aq-read-pct-label">%</span>';
        document.body.appendChild(badge);
        window.addEventListener('scroll', function() {
          var doc = document.documentElement;
          var pct = doc.scrollHeight - doc.clientHeight > 0
            ? Math.min(100, Math.round(((window.scrollY || doc.scrollTop) / (doc.scrollHeight - doc.clientHeight)) * 100))
            : 0;
          var fill = document.getElementById('aq-read-progress-fill');
          if (fill) fill.style.width = pct + '%';
          var num = document.getElementById('aq-read-pct-num');
          if (num) num.textContent = pct;
          if (pct >= 5) badge.classList.add('visible');
        }, { passive: true });
      }

      if (!applyPostStyles()) {
        var attempts = 0;
        var iv = setInterval(function() {
          attempts++;
          if (applyPostStyles() || attempts >= 20) clearInterval(iv);
        }, 300);
      }
    }

    function initBlogSection() {
      var path = window.location.pathname;
      if (path === '/blog' || path === '/blog/') redesignBlogListing();
      else if (path.startsWith('/post/') || path.startsWith('/blog/')) redesignBlogPost();
    }

    /**
     * pagesSection.js - v2
     * Redesign das paginas estaticas do Shopkit (/page/*)
     * Fundo escuro forcado via JS + hero + resumo para leigos
     */

    var PAGE_CONFIG = {
      'politica-de-devolucao': {
        icon: 'fas fa-undo-alt',
        title: 'Política de Devolução',
        subtitle: 'Os teus direitos de devolução e reembolso, explicados de forma simples.',
        summary: [
          { icon: 'fas fa-calendar-check', label: '14 dias para devolver', desc: 'Tens 14 dias após receberes a encomenda para devolver qualquer produto, sem precisares de justificar o motivo.' },
          { icon: 'fas fa-box', label: 'Embalagem original', desc: 'O produto deve ser devolvido na embalagem original e sem sinais de uso ou danos.' },
          { icon: 'fas fa-money-bill-wave', label: 'Reembolso total', desc: 'Ao devolveres o produto em boas condições, reembolsamos o valor total, incluindo os portes de envio originais.' },
          { icon: 'fas fa-fish', label: 'Seres vivos excluídos', desc: 'Peixes, plantas e invertebrados não podem ser devolvidos por razões de bem-estar animal e legislação em vigor.' }
        ]
      },
      'politica-de-entrega': {
        icon: 'fas fa-shipping-fast',
        title: 'Política de Entrega',
        subtitle: 'Como e quando recebes a tua encomenda, sem surpresas.',
        summary: [
          { icon: 'fas fa-clock', label: '2 a 5 dias úteis', desc: 'Equipamentos e produtos secos chegam entre 2 a 5 dias úteis após a confirmação do pagamento.' },
          { icon: 'fas fa-leaf', label: 'Seres vivos: Terças e Quartas', desc: 'Plantas, peixes e invertebrados são enviados às Terças e Quartas-feiras para chegarem frescos, evitando atrasos de fim de semana.' },
          { icon: 'fas fa-truck', label: 'Portes gratuitos acima de 50€', desc: 'Encomendas com valor superior a 50€ têm portes gratuitos para Portugal continental.' },
          { icon: 'fas fa-map-marker-alt', label: 'Enviamos para todo o país', desc: 'Entregamos em Portugal continental, Madeira e Açores. Os prazos e custos variam consoante o destino.' }
        ]
      },
      'politica-de-privacidade-e-cookies': {
        icon: 'fas fa-shield-alt',
        title: 'Privacidade e Cookies',
        subtitle: 'Como protegemos os teus dados pessoais e respeitamos a tua privacidade.',
        summary: [
          { icon: 'fas fa-lock', label: 'Os teus dados estão seguros', desc: 'Os teus dados — nome, morada e e-mail — são usados exclusivamente para processar encomendas e contactar-te.' },
          { icon: 'fas fa-cookie', label: 'O que são cookies?', desc: 'Cookies são pequenos ficheiros que melhoram a tua navegação. Podes recusá-los nas definições do teu browser.' },
          { icon: 'fas fa-ban', label: 'Sem partilha com terceiros', desc: 'Nunca vendemos nem partilhamos os teus dados com terceiros para fins comerciais ou publicitários.' },
          { icon: 'fas fa-user-shield', label: 'Os teus direitos', desc: 'Podes solicitar a qualquer momento que apaguemos, corrijamos ou te enviemos uma cópia dos teus dados.' }
        ]
      },
      'resolucao-de-litigios': {
        icon: 'fas fa-balance-scale',
        title: 'Resolução de Litígios',
        subtitle: 'O que fazer se tiveres algum problema connosco.',
        summary: [
          { icon: 'fas fa-comments', label: '1.º Fala connosco', desc: 'O primeiro passo é contactares-nos directamente. Resolvemos a grande maioria dos problemas de forma rápida e amigável.' },
          { icon: 'fas fa-handshake', label: '2.º Mediação', desc: 'Se não chegarmos a acordo, podes recorrer a entidades de mediação de conflitos de consumo reconhecidas em Portugal.' },
          { icon: 'fas fa-globe', label: 'Plataforma europeia (ODR)', desc: 'Enquanto loja europeia, também podes usar a plataforma online de resolução de litígios da União Europeia.' },
          { icon: 'fas fa-gavel', label: '3.º Tribunal', desc: 'Em último recurso, podes recorrer aos tribunais portugueses. O tribunal competente é o da tua área de residência.' }
        ]
      },
      'termos-e-condicoes': {
        icon: 'fas fa-file-contract',
        title: 'Termos e Condições',
        subtitle: 'As regras que regem as compras na nossa loja, de forma transparente.',
        summary: [
          { icon: 'fas fa-shopping-cart', label: 'Ao finalizar uma compra', desc: 'Ao concluíres uma encomenda, estás a aceitar estes termos e a celebrar um contrato de compra e venda connosco.' },
          { icon: 'fas fa-credit-card', label: 'Meios de pagamento', desc: 'Aceitamos cartão de crédito, débito, MB Way e transferência bancária. O pagamento é confirmado antes do envio.' },
          { icon: 'fas fa-tag', label: 'Preços com IVA incluído', desc: 'Todos os preços incluem IVA à taxa legal em vigor. Reservamo-nos o direito de actualizar preços sem aviso prévio.' },
          { icon: 'fas fa-star', label: 'Garantia de qualidade', desc: 'Todos os produtos são verificados antes do envio. Em caso de defeito, substituímos ou reembolsamos sem custo.' }
        ]
      },
      'livro-de-reclamacoes': {
        icon: 'fas fa-book-open',
        title: 'Livro de Reclamações',
        subtitle: 'A tua opinião é importante para nós. Aqui explicamos como reclamar.',
        summary: [
          { icon: 'fas fa-pencil-alt', label: 'Como apresentar uma reclamação', desc: 'Podes reclamar através do Livro de Reclamações Electrónico ou presencialmente na nossa loja em Porto Salvo.' },
          { icon: 'fas fa-reply', label: 'Resposta em 5 dias úteis', desc: 'Comprometemo-nos a analisar e responder a todas as reclamações no prazo máximo de 5 dias úteis.' },
          { icon: 'fas fa-heart', label: 'O nosso compromisso', desc: 'Encaramos cada reclamação como uma oportunidade de melhorar. A tua satisfação é a nossa prioridade.' },
          { icon: 'fas fa-envelope', label: 'Contacto directo', desc: 'Podes também contactar-nos por e-mail ou telefone para resolvermos o problema de forma mais rápida.' }
        ]
      }
    };

    function getPageSlug() {
      var match = window.location.pathname.match(/\/page\/([^\/]+)/);
      return match ? match[1] : null;
    }

    function forceDark() {
      var sels = ['.main','.page.section','.page-content','.well','.well-featured','.well-shadow','.page .col','.page .row','.page .container-fluid'];
      sels.forEach(function(s) {
        Array.from(document.querySelectorAll(s)).forEach(function(el) {
          el.style.setProperty('background','#00040D','important');
          el.style.setProperty('background-color','#00040D','important');
          el.style.setProperty('box-shadow','none','important');
          el.style.setProperty('color','rgba(255,255,255,0.88)','important');
        });
      });
    }

    function styleContent(el) {
      el.style.setProperty('background','#00040D','important');
      el.style.setProperty('color','rgba(255,255,255,0.88)','important');
      el.style.setProperty('box-shadow','none','important');
      el.style.setProperty('border','1px solid rgba(8,238,188,0.1)','important');
      el.style.setProperty('border-radius','16px','important');
      el.style.setProperty('padding','40px','important');
      Array.from(el.querySelectorAll('h2,h3,h4,h5')).forEach(function(h) {
        h.style.setProperty('color','#FFFFFF','important');
        h.style.setProperty('font-family',"'Poppins',sans-serif",'important');
        h.style.setProperty('margin-top','2em','important');
      });
      Array.from(el.querySelectorAll('h3,h5')).forEach(function(h) {
        h.style.setProperty('color','#08EEBC','important');
      });
      Array.from(el.querySelectorAll('p,li')).forEach(function(p) {
        p.style.setProperty('color','rgba(255,255,255,0.85)','important');
        p.style.setProperty('line-height','1.8','important');
      });
      Array.from(el.querySelectorAll('a')).forEach(function(a) {
        a.style.setProperty('color','#08EEBC','important');
      });
      Array.from(el.querySelectorAll('strong,b')).forEach(function(b) {
        b.style.setProperty('color','#FFFFFF','important');
      });
      Array.from(el.querySelectorAll('ul,ol')).forEach(function(u) {
        u.style.setProperty('padding-left','1.5em','important');
      });
    }

    function buildCard(item) {
      return '<div class="aq-pg-card">' +
        '<div class="aq-pg-card-icon"><i class="' + item.icon + '"></i></div>' +
        '<div class="aq-pg-card-content">' +
          '<strong class="aq-pg-card-label">' + item.label + '</strong>' +
          '<p class="aq-pg-card-desc">' + item.desc + '</p>' +
        '</div>' +
      '</div>';
    }

    function redesignPage() {
      if (!window.location.pathname.startsWith('/page/')) return;
      if (document.body.classList.contains('aq-page-styled')) return;
      document.body.classList.add('aq-page-styled');

      var slug = getPageSlug();
      var cfg = slug ? PAGE_CONFIG[slug] : null;

      forceDark();

      var nativeTitle = document.querySelector('h1.page-title, h1.title');
      if (nativeTitle) nativeTitle.style.setProperty('display','none','important');

      var container = document.querySelector('.page.section .container-fluid, .page .container-fluid')
        || document.querySelector('.main') || document.body;

      var pageContent = document.querySelector('.page-content');
      if (pageContent) {
        pageContent.classList.add('aq-pg-content');
        styleContent(pageContent);
      }

      if (!cfg) return;

      var hero = document.createElement('div');
      hero.className = 'aq-pg-hero';
      hero.innerHTML =
        '<div class="aq-pg-hero-bg"></div>' +
        '<div class="aq-pg-hero-inner">' +
          '<div class="aq-pg-hero-icon"><i class="' + cfg.icon + '"></i></div>' +
          '<h1 class="aq-pg-hero-title">' + cfg.title + '</h1>' +
          '<p class="aq-pg-hero-sub">' + cfg.subtitle + '</p>' +
        '</div>';
      container.insertBefore(hero, container.firstChild);

      if (pageContent && cfg.summary) {
        var box = document.createElement('div');
        box.className = 'aq-pg-summary';
        box.innerHTML =
          '<div class="aq-pg-summary-header"><i class="fas fa-lightbulb"></i><span>Em linguagem simples</span></div>' +
          '<div class="aq-pg-summary-grid">' + cfg.summary.map(buildCard).join('') + '</div>';
        pageContent.parentNode.insertBefore(box, pageContent);
      }

      console.log('[AQ] Pages v2: ' + slug);
    }

    function initPagesSection() {
      if (!window.location.pathname.startsWith('/page/')) return;
      forceDark();
      redesignPage();
      setTimeout(forceDark, 500);
      setTimeout(forceDark, 1500);
    }

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

    function initThemeToggle() {
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

    /**
     * trustSeals.js - v3
     * - Selos de confianca no footer
     * - Move redes sociais para coluna de Contactos
     * - Remove selos nativos Shopkit
     * - Injeta assinatura no copyright
     */

    var SEALS = [
      {
        id: 'ssl',
        label: 'SSL Seguro',
        sub: 'Loja certificada',
        icon: '<svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="18" width="32" height="26" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 18V13a8 8 0 0116 0v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="20" cy="31" r="3" fill="currentColor"/><line x1="20" y1="34" x2="20" y2="39" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      },
      {
        id: 'secure',
        label: 'Compra Segura',
        sub: 'Dados protegidos',
        icon: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4L8 10v12c0 10.5 6.8 20.3 16 23.4C33.2 42.3 40 32.5 40 22V10L24 4z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 24l5 5 11-11" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      },
      {
        id: 'mb',
        label: 'Multibanco',
        sub: 'Pagamento aceite',
        icon: '<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><rect x="6" y="10" width="8" height="12" rx="1" fill="currentColor" opacity=".4"/><rect x="16" y="10" width="8" height="12" rx="1" fill="currentColor" opacity=".7"/><rect x="26" y="10" width="8" height="12" rx="1" fill="currentColor"/><text x="24" y="26" text-anchor="middle" font-size="5" fill="currentColor" font-family="sans-serif" opacity=".7">MULTIBANCO</text></svg>',
      },
      {
        id: 'mbway',
        label: 'MB WAY',
        sub: 'Pagamento aceite',
        icon: '<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><text x="24" y="14" text-anchor="middle" font-size="8" fill="#08EEBC" font-family="sans-serif" font-weight="bold">MB</text><text x="24" y="25" text-anchor="middle" font-size="7" fill="currentColor" font-family="sans-serif" opacity=".8">WAY</text></svg>',
      },
      {
        id: 'cards',
        label: 'Visa / Mastercard',
        sub: 'Cartao aceite',
        icon: '<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="16" r="8" fill="#EA4335" opacity=".7"/><circle cx="30" cy="16" r="8" fill="#FBBC05" opacity=".7"/></svg>',
      },
    ];

    function buildSealsBar() {
      var bar = document.createElement('div');
      bar.id = 'aq-trust-seals';
      var inner = document.createElement('div');
      inner.className = 'aq-seals-inner';
      SEALS.forEach(function(seal) {
        var item = document.createElement('div');
        item.className = 'aq-seal-item aq-seal-' + seal.id;
        item.innerHTML =
          '<div class="aq-seal-icon">' + seal.icon + '</div>' +
          '<div class="aq-seal-text"><strong>' + seal.label + '</strong><span>' + seal.sub + '</span></div>';
        inner.appendChild(item);
      });
      bar.appendChild(inner);
      return bar;
    }

    function moveSocialToContacts(footer) {
      var social = footer.querySelector('.footer-social, .social');
      if (!social) return;

      var contactsCol = null;
      footer.querySelectorAll('.footer-category').forEach(function(el) {
        if (el.textContent.trim().toLowerCase().includes('contacto')) {
          contactsCol = el.closest('.col-lg-3, .col-md-6, [class*="col"]');
        }
      });

      if (!contactsCol) return;

      var socialWrap = document.createElement('div');
      socialWrap.className = 'aq-footer-social';
      socialWrap.style.cssText = 'display:flex;gap:12px;margin-top:16px;';

      social.querySelectorAll('a').forEach(function(a) {
        var clone = a.cloneNode(true);
        clone.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;border:1px solid rgba(8,238,188,0.25);color:rgba(255,255,255,0.7);transition:all 0.2s ease;text-decoration:none;';
        clone.addEventListener('mouseenter', function() {
          clone.style.borderColor = '#08EEBC';
          clone.style.color = '#08EEBC';
          clone.style.boxShadow = '0 0 10px rgba(8,238,188,0.3)';
        });
        clone.addEventListener('mouseleave', function() {
          clone.style.borderColor = 'rgba(8,238,188,0.25)';
          clone.style.color = 'rgba(255,255,255,0.7)';
          clone.style.boxShadow = 'none';
        });
        socialWrap.appendChild(clone);
      });

      contactsCol.appendChild(socialWrap);
      social.style.setProperty('display', 'none', 'important');
    }

    function removeSiteSeal(footer) {
      footer.querySelectorAll('.secure-site, .site-seal, [class*="secure-site"]').forEach(function(el) {
        el.style.setProperty('display', 'none', 'important');
      });
    }

    function injectSignature(footer) {
      if (footer.querySelector('.aq-signature')) return;
      var copyright = footer.querySelector('.copyright, .footer-bottom');
      if (!copyright) return;

      var sig = document.createElement('div');
      sig.className = 'aq-signature';
      sig.innerHTML =
        'Loja feita com ' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:13px;height:13px;display:inline-block;vertical-align:middle;margin:0 3px;fill:#08EEBC;">' +
        '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>' +
        '</svg>' +
        ' por <a href="https://kaueramone.dev" target="_blank" rel="noopener noreferrer">Kaue Ramone</a>';

      copyright.appendChild(sig);
    }

    function moveCopyrightToContainer(footer) {
      var copyright = footer.querySelector('.copyright, .footer-bottom');
      if (!copyright) return;
      // Ja esta no nivel certo (filho direto do container)
      var container = footer.querySelector('.container, .container-fluid, .footer-inner');
      if (!container) return;
      // Se o copyright esta dentro de uma coluna, move-o para o container
      if (copyright.closest('.col-lg-3, .col-md-6, .col-xs-12, [class*="col-"]')) {
        container.appendChild(copyright);
      }
    }

    function build() {
      if (document.getElementById('aq-trust-seals')) return true;

      var footer = document.querySelector('footer, #footer, .footer');
      if (!footer) return false;

      moveCopyrightToContainer(footer);

      var copyright = footer.querySelector('.copyright, .footer-bottom');
      var bar = buildSealsBar();
      if (copyright && copyright.parentNode) {
        copyright.parentNode.insertBefore(bar, copyright);
      } else {
        var col = footer.querySelector('.col-lg-3, [class*="col"]');
        if (col) col.appendChild(bar);
      }

      moveSocialToContacts(footer);
      removeSiteSeal(footer);
      injectSignature(footer);

      console.log('[AQ] Trust seals v3 aplicados');
      return true;
    }

    function initTrustSeals() {
      if (build()) return;
      var attempts = 0;
      var interval = setInterval(function() {
        attempts++;
        if (build() || attempts >= 20) clearInterval(interval);
      }, 300);
    }

    /**
     * specialPages.js
     * Injeta heroes e layouts nas páginas /sales, /new e /contact
     */

    // ── Hero genérico ─────────────────────────────────────────────
    function injectHero(tag, icon, title, titleHighlight, sub, afterEl) {
      var hero = document.createElement('div');
      hero.className = 'aq-sp-hero';
      hero.innerHTML =
        '<div class="aq-sp-tag"><i class="' + icon + '"></i>' + tag + '</div>' +
        '<h1 class="aq-sp-title">' + title + (titleHighlight ? ' <span>' + titleHighlight + '</span>' : '') + '</h1>' +
        '<p class="aq-sp-sub">' + sub + '</p>';
      if (afterEl && afterEl.parentNode) {
        afterEl.parentNode.insertBefore(hero, afterEl);
      }
    }

    // ── /SALES ────────────────────────────────────────────────────
    function initSales() {
      if (!document.body.classList.contains('page-sales')) return;
      var section = document.querySelector('.products.section');
      if (!section) return;
      injectHero(
        'Promoções',
        'ri-price-tag-3-line',
        'As Melhores',
        'Ofertas',
        'Produtos selecionados com descontos especiais para o teu aquário. Qualidade premium a preços que fazem sentido.',
        section
      );
    }

    // ── /NEW ──────────────────────────────────────────────────────
    function initNew() {
      if (!document.body.classList.contains('page-new')) return;
      var section = document.querySelector('.products.section');
      if (!section) return;
      injectHero(
        'Novidades',
        'ri-sparkling-line',
        'Acabou de',
        'Chegar',
        'Os produtos mais recentes para o teu aquário. Equipamentos, decoração e acessórios frescos do mercado.',
        section
      );
    }

    // ── /CONTACT ─────────────────────────────────────────────────
    function initContact() {
      if (!document.body.classList.contains('page-contact')) return;
      var section = document.querySelector('.contacts.section');
      if (!section) return;

      // Ocultar titulo nativo
      var nativeTitle = section.querySelector('.contacts-title');
      if (nativeTitle) nativeTitle.style.display = 'none';

      // Injetar hero
      injectHero(
        'Fala Connosco',
        'ri-map-pin-line',
        'Estamos',
        'Aqui para Ti',
        'Visita-nos em Porto Salvo, envia-nos uma mensagem ou liga diretamente. Respondemos sempre com prazer.',
        section
      );

      // Encontrar o formulário nativo e o mapa
      var contactsDetails = section.querySelector('.contacts-details');
      var nativeForm = section.querySelector('form, .contacts-form, .contact-form');
      var nativeMap = section.querySelector('iframe, .contact-map');

      // Criar layout de dois painéis
      var body = document.createElement('div');
      body.className = 'aq-contact-body';

      // -- Painel esquerdo: info --
      var infoPanel = document.createElement('div');
      infoPanel.className = 'aq-contact-info';

      // Card: morada + telefone
      var infoCard = document.createElement('div');
      infoCard.className = 'aq-contact-card';
      infoCard.innerHTML =
        '<div class="aq-contact-card-title">Informações</div>' +
        '<div class="aq-contact-row"><i class="ri-map-pin-2-line"></i><span>Praceta José Afonso nº3A<br>2740-192 Porto Salvo, Oeiras</span></div>' +
        '<div class="aq-contact-row"><i class="ri-phone-line"></i><a href="tel:+351964331915">+351 964 331 915</a></div>' +
        '<div class="aq-contact-row"><i class="ri-mail-line"></i><a href="mailto:geral@aquariumlife.pt">geral@aquariumlife.pt</a></div>';
      infoPanel.appendChild(infoCard);

      // Card: horário
      var scheduleCard = document.createElement('div');
      scheduleCard.className = 'aq-contact-card';
      scheduleCard.innerHTML =
        '<div class="aq-contact-card-title">Horário de Funcionamento</div>' +
        '<div class="aq-schedule-row"><span class="aq-day">Segunda – Sexta</span><span class="aq-hours">10:00 – 19:00</span></div>' +
        '<div class="aq-schedule-row"><span class="aq-day">Sábado</span><span class="aq-hours">10:00 – 13:00</span></div>' +
        '<div class="aq-schedule-row"><span class="aq-day">Domingo</span><span class="aq-closed">Encerrado</span></div>';
      infoPanel.appendChild(scheduleCard);

      // Card: redes sociais
      var socialCard = document.createElement('div');
      socialCard.className = 'aq-contact-card';
      socialCard.innerHTML =
        '<div class="aq-contact-card-title">Redes Sociais</div>' +
        '<div class="aq-footer-social" style="display: flex; gap: 12px; margin-top: 16px;">' +
          '<a href="https://www.facebook.com/profile.php?id=100057636542230" class="social-link link-social-facebook" target="_blank" title="Facebook" style="display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(8, 238, 188, 0.25); color: rgba(255, 255, 255, 0.7); transition: 0.2s; text-decoration: none; box-shadow: none;">' +
            '<svg class="svg-inline--fa fa-facebook fa-w-16" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="facebook" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path></svg>' +
          '</a>' +
          '<a href="https://www.instagram.com/aquariumlifept?igsh=ZjdkeG15ZmFzNWdj" class="social-link link-social-instagram" target="_blank" title="Instagram" style="display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(8, 238, 188, 0.25); color: rgba(255, 255, 255, 0.7); transition: 0.2s; text-decoration: none;">' +
            '<svg class="svg-inline--fa fa-instagram fa-w-14" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="instagram" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>' +
          '</a>' +
        '</div>';
      infoPanel.appendChild(socialCard);

      // Mapa nativo (se existir)
      if (nativeMap) {
        infoPanel.appendChild(nativeMap);
      }

      // -- Painel direito: formulário --
      var formWrap = document.createElement('div');
      formWrap.className = 'aq-contact-form-wrap';

      var formTitle = document.createElement('div');
      formTitle.className = 'aq-form-title';
      formTitle.innerHTML = 'Enviar <span>Mensagem</span>';
      formWrap.appendChild(formTitle);

      if (nativeForm) {
        formWrap.appendChild(nativeForm);
      } else {
        // Fallback se o form não existir ainda
        var placeholder = document.createElement('p');
        placeholder.style.color = 'rgba(255,255,255,0.4)';
        placeholder.style.textAlign = 'center';
        placeholder.style.padding = '40px 0';
        placeholder.textContent = 'Formulário de contacto em breve.';
        formWrap.appendChild(placeholder);
      }

      body.appendChild(infoPanel);
      body.appendChild(formWrap);

      // Limpar o conteúdo nativo e inserir o novo layout
      if (contactsDetails) {
        contactsDetails.innerHTML = '';
        contactsDetails.appendChild(body);
      } else {
        section.appendChild(body);
      }
    }

    // ── /PRODUCT ─────────────────────────────────────────────────
    function initProductPage() {
      if (!document.body.classList.contains('page-product')) return;
      var relatedSection = document.querySelector('.related-products');
      if (relatedSection) {
        // 1. Mudar o título
        var title = relatedSection.querySelector('.title, h1, h2, h3, .section-title');
        if (title) {
          title.textContent = 'Podes também gostar de:';
          title.style.display = 'block'; // garantir que não foi oculto
        }
        
        // 2. Limitar a 3 produtos e desligar as funções de slide visuais
        // (Ocultar nav via CSS, mas aqui vamos forçar a remoção das setas e clones se possível)
        setTimeout(function() {
          var owlStage = relatedSection.querySelector('.owl-stage');
          if (owlStage) {
            // Desativar transform
            owlStage.style.setProperty('transform', 'none', 'important');
            owlStage.style.setProperty('width', '100%', 'important');
            owlStage.style.setProperty('display', 'flex', 'important');
            owlStage.style.setProperty('flex-wrap', 'wrap', 'important');
            owlStage.style.setProperty('gap', '20px', 'important');

            // Limpar clones e ocultar extras
            var items = owlStage.children;
            var realCount = 0;
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              if (item.classList.contains('cloned')) {
                item.style.setProperty('display', 'none', 'important');
              } else {
                realCount++;
                if (realCount > 3) {
                  item.style.setProperty('display', 'none', 'important');
                } else {
                  item.style.setProperty('width', 'calc(33.333% - 14px)', 'important');
                }
              }
            }
          }
        }, 500); // aguardar o owlCarousel inicializar
      }
    }

    function initSpecialPages() {
      initSales();
      initNew();
      initContact();
      initProductPage();
    }

    // categoryFilters.js v6
    // - Carrega JSON da categoria actual (products-cat-{catId}.json)
    // - Filtra todos os produtos, renderiza com paginação propria
    // - Dropdown de categorias criado do zero com pre-seleccao

    const REPO     = 'kaueramone/aquariumlife';
    const JSON_CATS = 'dist/categories.json';
    const PER_PAGE  = 12;

    // ================================================================
    // Self-heal de imagens (v7)
    // ----------------------------------------------------------------
    // Os JSON 'products-cat-*.json' guardam um campo 'img' fixo no momento
    // do crawl. Se um produto for criado sem foto (img = no-img) e a foto
    // for adicionada depois na loja, o JSON fica desactualizado e o card
    // mostra o placeholder. Para nunca mostrar no-img quando a imagem ja
    // existe, resolvemos a imagem real AO VIVO a partir da propria loja
    // (og:image da pagina do produto), com cache e fallback gracioso.
    // Funciona mesmo sem regenerar o JSON.
    // ================================================================
    const NO_IMG     = 'https://cdn-shopkit.com/assets/store/img/no-img.png';
    const NO_IMG_RE  = /no-img/;
    const SS_KEY     = 'aqImgCacheV1';

    const imgCache    = Object.create(null);  // path do produto -> URL real (positivos; persistido)
    const imgNeg      = Object.create(null);  // path -> true (sem imagem; so nesta carga de pagina)
    const imgInflight = Object.create(null);  // path -> Promise em curso

    try { Object.assign(imgCache, JSON.parse(sessionStorage.getItem(SS_KEY) || '{}')); } catch (e) {}
    function persistImgCache() { try { sessionStorage.setItem(SS_KEY, JSON.stringify(imgCache)); } catch (e) {} }

    function aqIsPlaceholder(src) { return !src || NO_IMG_RE.test(src); }
    function aqProductPath(u) {
      try { return new URL(u, location.origin).pathname.replace(/\/$/, ''); }
      catch (e) { return u || ''; }
    }
    // Thumbnail 'square' a partir da imagem cheia (mesmo padrao das cards nativas)
    function aqSquare(u) {
      return (u && u.indexOf('/media/images/') !== -1 && u.indexOf('/square/') === -1)
        ? u.replace('/media/images/', '/media/images/square/') : u;
    }

    // Reaproveita as imagens que o Shopkit ja renderizou nativamente (gratis, 0 pedidos)
    function seedNativeImages() {
      document.querySelectorAll(
        '.products-list .product-preview, .products .product-preview, [class*="products"] .product-preview'
      ).forEach(function (a) {
        const img = a.querySelector('img');
        if (!img) return;
        const real = img.getAttribute('data-src') || img.getAttribute('src') || '';
        if (!aqIsPlaceholder(real)) imgCache[aqProductPath(a.getAttribute('href'))] = real;
      });
      persistImgCache();
    }

    // Resolve a imagem real de um produto pela sua propria pagina (og:image).
    function resolveProductImage(url) {
      const key = aqProductPath(url);
      if (imgCache[key])    return Promise.resolve(imgCache[key]);
      if (imgNeg[key])      return Promise.resolve(null);
      if (imgInflight[key]) return imgInflight[key];

      const p = (async function () {
        try {
          const res = await fetch(url, { cache: 'no-store' });
          if (!res.ok) { imgNeg[key] = true; return null; }
          const html = await res.text();
          const m = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
                 || html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
          const img = m && m[1];
          if (img && !aqIsPlaceholder(img)) { imgCache[key] = img; persistImgCache(); return img; }
          imgNeg[key] = true;
          return null;
        } catch (e) {
          imgNeg[key] = true;
          return null;
        } finally {
          delete imgInflight[key];
        }
      })();

      imgInflight[key] = p;
      return p;
    }

    // Aplica a imagem real: usa a thumbnail 'square' e cai para a imagem
    // cheia e depois para no-img se algo falhar (nunca icone partido).
    function applyHealedImage(img, real) {
      img.dataset.aqFull = real;
      img.src = aqSquare(real);
    }
    function aqOnImgError(img) {
      const full = img.dataset.aqFull;
      const cur  = img.getAttribute('src') || '';
      if (full && full !== cur && !aqIsPlaceholder(full)) {
        img.src = full;        // square falhou -> tenta a imagem cheia
      } else if (!aqIsPlaceholder(cur)) {
        img.src = NO_IMG;      // imagem cheia falhou -> placeholder (sem loop)
      }
    }

    // Percorre os cards renderizados, garante fallback de erro e cura os placeholders.
    async function healCardImages(list) {
      const cards = Array.from(list.querySelectorAll('.product-preview'))
        .map(function (a) { return { a: a, img: a.querySelector('img.product-pic') }; })
        .filter(function (o) { return o.img; });

      cards.forEach(function (o) {
        o.img.addEventListener('error', function () { aqOnImgError(o.img); });
      });

      const pending = cards.filter(function (o) { return aqIsPlaceholder(o.img.getAttribute('src')); });

      // 1) Instantaneo via cache/seed
      const toFetch = [];
      pending.forEach(function (o) {
        const cached = imgCache[aqProductPath(o.a.getAttribute('href'))];
        if (cached) applyHealedImage(o.img, cached); else toFetch.push(o);
      });

      // 2) Restantes: og:image com concorrencia limitada
      let i = 0;
      const CONCURRENCY = 4;
      async function worker() {
        while (i < toFetch.length) {
          const o = toFetch[i++];
          const real = await resolveProductImage(o.a.getAttribute('href'));
          if (real) applyHealedImage(o.img, real);
        }
      }
      await Promise.all(Array.from({ length: Math.min(CONCURRENCY, toFetch.length) }, worker));
    }

    function initCategoryFilters() {
      var isCategory = document.body.classList.contains('page-category');
      var isCatalog  = document.body.classList.contains('page-catalog');
      if (!isCategory && !isCatalog) return;

      // No catalogo usamos o JSON global 'all'; na categoria usamos o catId.
      const catId = isCatalog ? 'all' : getCategoryId();
      if (!catId) return;

      const ready = () => {
        rebuildCategoryDropdown();
        initPriceFilter(catId);
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ready);
      } else {
        setTimeout(ready, 200);
      }
    }

    function getCategoryId() {
      const m = document.body.className.match(/category-id-(\d+)/);
      return m ? m[1] : null;
    }

    // ----------------------------------------------------------------
    // Container de produtos nativo
    // ----------------------------------------------------------------
    function getProductsList() {
      return document.querySelector('.products-list')
          || document.querySelector('.products .row')
          || document.querySelector('[class*="products"] .row');
    }

    // ----------------------------------------------------------------
    // Loader overlay
    // ----------------------------------------------------------------
    function showGridLoader() {
      const list = getProductsList();
      if (!list) return;
      list.style.opacity = '0.3';
      list.style.pointerEvents = 'none';
      let loader = document.getElementById('aq-grid-loader');
      if (!loader) {
        loader = document.createElement('div');
        loader.id = 'aq-grid-loader';
        loader.innerHTML = '<div class="aq-loader-spinner"></div><span>A filtrar...</span>';
        const parent = list.parentElement;
        parent.style.position = 'relative';
        parent.appendChild(loader);
      }
      loader.style.display = 'flex';
    }

    function hideGridLoader() {
      const list = getProductsList();
      if (list) { list.style.opacity = ''; list.style.pointerEvents = ''; }
      const loader = document.getElementById('aq-grid-loader');
      if (loader) loader.style.display = 'none';
    }

    // ----------------------------------------------------------------
    // Dropdown de categorias
    // ----------------------------------------------------------------
    async function rebuildCategoryDropdown() {
      const filtersSorting = document.querySelector('.filters-sorting');
      if (!filtersSorting) return;

      const currentHandle = window.location.pathname
        .replace(/^\/category\//, '').replace(/\/$/, '');

      let cats = [];
      try {
        const res = await fetch(`https://cdn.jsdelivr.net/gh/${REPO}@main/${JSON_CATS}`);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        cats = (await res.json()).categories || [];
      } catch (e) {
        console.warn('[AQ] Erro categorias:', e);
        return;
      }

      function findLabel(handle) {
        for (const cat of cats) {
          if (cat.handle === handle) return cat.title;
          for (const ch of (cat.children || [])) {
            if (ch.handle === handle) return ch.title;
          }
        }
        return 'Categorias';
      }

      const activeLabel = findLabel(currentHandle);

      // Remover dropdown nativo de categoria se existir
      const native = document.querySelector('.dropdown.filter[data-type="category"]');
      if (native) native.remove();
      // Ocultar dropdown nativo de preco
      const nativePrice = document.querySelector('.dropdown.filter[data-type="price"]');
      if (nativePrice) nativePrice.style.display = 'none';

      // Criar dropdown
      const dropWrap = document.createElement('div');
      dropWrap.className = 'dropdown filter aq-cat-dropdown';
      dropWrap.setAttribute('data-type', 'category');

      const toggle = document.createElement('a');
      toggle.className = 'dropdown-toggle';
      toggle.setAttribute('aria-haspopup', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = activeLabel;

      const menu = document.createElement('div');
      menu.className = 'dropdown-menu';

      // Item "Todas"
      const allItem = document.createElement('a');
      allItem.className = 'dropdown-item' + (currentHandle === 'equipamento' ? ' active' : '');
      allItem.href = '/category/equipamento';
      allItem.textContent = 'Todas';
      menu.appendChild(allItem);

      const sep = document.createElement('div');
      sep.style.cssText = 'height:1px;background:rgba(8,238,188,0.1);margin:4px 6px;';
      menu.appendChild(sep);

      cats.forEach(cat => {
        const item = document.createElement('a');
        item.className = 'dropdown-item' + (currentHandle === cat.handle ? ' active' : '');
        item.href = cat.url;
        item.textContent = cat.title;
        menu.appendChild(item);
        (cat.children || []).forEach(ch => {
          const child = document.createElement('a');
          child.className = 'dropdown-item' + (currentHandle === ch.handle ? ' active' : '');
          child.href = ch.url;
          child.style.paddingLeft = '22px';
          child.textContent = '↳ ' + ch.title;
          menu.appendChild(child);
        });
      });

      // Toggle manual
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const open = menu.classList.contains('show');
        menu.classList.toggle('show', !open);
        toggle.setAttribute('aria-expanded', String(!open));
        if (!open) {
          const close = function() {
            menu.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
            document.removeEventListener('click', close);
          };
          setTimeout(function() { document.addEventListener('click', close); }, 0);
        }
      });

      dropWrap.appendChild(toggle);
      dropWrap.appendChild(menu);

      // Inserir antes do .filters-wrap
      const filtersWrap = filtersSorting.querySelector('.filters-wrap');
      if (filtersWrap) {
        filtersSorting.insertBefore(dropWrap, filtersWrap);
      } else {
        filtersSorting.insertBefore(dropWrap, filtersSorting.firstChild);
      }
    }

    // ----------------------------------------------------------------
    // Filtro de preco + paginacao propria
    // ----------------------------------------------------------------
    function initPriceFilter(catId) {
      // Ocultar paginacao nativa do Shopkit
      const nativePag = document.querySelector('.pagination');
      if (nativePag) nativePag.style.display = 'none';

      // Slider HTML
      const wrap = document.createElement('div');
      wrap.id = 'aq-price-filter';
      wrap.innerHTML = `
    <div class="aq-pf-label">
      <span class="aq-pf-title">Preço</span>
      <span class="aq-pf-range" id="aq-pf-range">–</span>
    </div>
    <div class="aq-pf-track-wrap">
      <div class="aq-pf-track"></div>
      <div class="aq-pf-fill" id="aq-pf-fill"></div>
      <input type="range" id="aq-pf-min" min="0" max="100" value="0" step="0.5">
      <input type="range" id="aq-pf-max" min="0" max="100" value="100" step="0.5">
    </div>
    <div class="aq-pf-status" id="aq-pf-status">A carregar...</div>
  `;

      const filtersSorting = document.querySelector('.filters-sorting');
      const filtersWrap = filtersSorting && filtersSorting.querySelector('.filters-wrap');
      if (filtersWrap) {
        filtersSorting.insertBefore(wrap, filtersWrap);
      } else if (filtersSorting) {
        filtersSorting.appendChild(wrap);
      }

      const minInput   = document.getElementById('aq-pf-min');
      const maxInput   = document.getElementById('aq-pf-max');
      const rangeLabel = document.getElementById('aq-pf-range');
      const fill       = document.getElementById('aq-pf-fill');
      const status     = document.getElementById('aq-pf-status');

      let allProducts  = [];
      let originalOrder = [];
      let filtered     = [];
      let globalMin    = 0;
      let globalMax    = 100;
      let currentMin   = 0;
      let currentMax   = 100;
      let currentPage  = 1;
      let applyTimer   = null;

      function fmt(v) { return v.toFixed(2).replace('.', ',') + '€'; }

      function updateFill() {
        const range = globalMax - globalMin || 1;
        fill.style.left  = ((currentMin - globalMin) / range * 100) + '%';
        fill.style.width = (Math.max(0, currentMax - currentMin) / range * 100) + '%';
      }

      function updateLabel() {
        rangeLabel.textContent = fmt(currentMin) + ' – ' + fmt(currentMax);
      }

      function onInput() {
        currentMin = parseFloat(minInput.value);
        currentMax = parseFloat(maxInput.value);
        if (currentMin > currentMax - 0.5) {
          currentMin = Math.max(globalMin, currentMax - 0.5);
          minInput.value = currentMin;
        }
        updateFill();
        updateLabel();
      }

      function onSliderChange() {
        currentPage = 1;
        clearTimeout(applyTimer);
        applyTimer = setTimeout(applyFilter, 400);
      }

      function applyFilter() {
        filtered = allProducts.filter(p => p.price >= currentMin && p.price <= currentMax);
        renderPage(currentPage);
      }

      // ---- Renderizar uma pagina de produtos ----
      function renderPage(page) {
        showGridLoader();
        setTimeout(function() {
          const list = getProductsList();
          if (!list) { hideGridLoader(); return; }

          const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
          currentPage = Math.min(page, totalPages);

          const start = (currentPage - 1) * PER_PAGE;
          const slice = filtered.slice(start, start + PER_PAGE);

          const noImg = NO_IMG;

          list.innerHTML = '';
          slice.forEach(function(p) {
            const priceHTML = p.pp
              ? '<del>' + p.pf + '</del><span class="product-actual">' + p.ppf + '</span>'
              : '<span class="product-actual">' + p.pf + '</span>';

            const col = document.createElement('div');
            col.className = 'col';
            col.innerHTML =
              '<div class="product active hover-effect-floating" data-id="' + p.id + '">'
              + '<div class="card-shadow-hover">'
              + '<div class="product-view">'
              + '<span class="product-badges" data-position="top-left"></span>'
              + '<a class="product-preview" href="' + p.url + '" data-thumbnail-type="square">'
              + '<img class="product-pic" src="' + (p.img || noImg) + '" alt="' + p.title.replace(/"/g,'') + '" loading="lazy">'
              + '</a>'
              + '</div>'
              + '<a class="product-name" href="' + p.url + '">' + p.title + '</a>'
              + '<div class="product-details">'
              + '<div class="product-price">' + priceHTML + '</div>'
              + '</div>'
              + '<a class="product-btn btn btn-primary" href="' + p.cart + '">Comprar</a>'
              + '</div></div>';
            list.appendChild(col);
          });

          // Self-heal: injecta a imagem real nos cards que ficaram com placeholder
          // (JSON antigo / produto que ganhou foto depois). Nao bloqueia o render.
          healCardImages(list);

          // Actualizar status
          status.textContent = filtered.length + ' produto' + (filtered.length !== 1 ? 's' : '');

          // Renderizar paginacao
          renderPagination(totalPages);
          hideGridLoader();
        }, 80);
      }

      // ---- Paginacao propria ----
      function renderPagination(totalPages) {
        let pag = document.getElementById('aq-pagination');
        if (!pag) {
          pag = document.createElement('ul');
          pag.id = 'aq-pagination';
          pag.className = 'pagination';
          // Inserir apos o container de produtos
          const list = getProductsList();
          if (list && list.parentElement) {
            list.parentElement.insertAdjacentElement('afterend', pag);
          }
        }

        pag.innerHTML = '';
        if (totalPages <= 1) return;

        function pageBtn(label, page, disabled, active) {
          const li = document.createElement('li');
          if (active) li.className = 'active';
          if (disabled) li.className = 'disabled';
          const a = document.createElement('a');
          a.href = '#';
          a.innerHTML = label;
          a.addEventListener('click', function(e) {
            e.preventDefault();
            if (!disabled && !active) {
              currentPage = page;
              renderPage(currentPage);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          });
          li.appendChild(a);
          pag.appendChild(li);
        }

        pageBtn('&laquo;', currentPage - 1, currentPage === 1, false);

        const maxButtons = 7;
        let startP = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endP   = Math.min(totalPages, startP + maxButtons - 1);
        if (endP - startP < maxButtons - 1) startP = Math.max(1, endP - maxButtons + 1);

        for (let i = startP; i <= endP; i++) {
          pageBtn(i, i, false, i === currentPage);
        }

        pageBtn('&raquo;', currentPage + 1, currentPage === totalPages, false);
      }

      // ---- Carregar JSON da categoria ----
      async function loadProducts() {
        const jsonFile = (catId === 'all')
          ? 'dist/products-all.json'
          : 'dist/products-cat-' + catId + '.json';
        const url = 'https://cdn.jsdelivr.net/gh/' + REPO + '@main/' + jsonFile;
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const data = await res.json();

          allProducts = data.products || [];
          originalOrder = [...allProducts];
          globalMin   = Math.round((data.min || 0) * 10) / 10;
          globalMax   = Math.ceil(data.max || 100);
          currentMin  = globalMin;
          currentMax  = globalMax;

          [minInput, maxInput].forEach(function(inp) {
            inp.min = globalMin; inp.max = globalMax; inp.step = '0.5';
          });
          minInput.value = globalMin;
          maxInput.value = globalMax;

          updateFill();
          updateLabel();

          // Aproveita as imagens nativas do Shopkit antes de substituir a grelha
          seedNativeImages();

          filtered = allProducts;
          renderPage(1);
        } catch (e) {
          console.warn('[AQ] Erro ao carregar produtos:', e);
          status.textContent = 'Erro ao carregar';
        }
      }

      minInput.addEventListener('input', onInput);
      maxInput.addEventListener('input', onInput);
      minInput.addEventListener('change', onSliderChange);
      maxInput.addEventListener('change', onSliderChange);

      // ---- Ordenação ----
      function initSortDropdown() {
        const filtersField = document.querySelector('.filters-field');
        if (!filtersField) return;

        // Criar dropdown
        const dropWrap = document.createElement('div');
        dropWrap.className = 'dropdown filter aq-sort-dropdown';
        dropWrap.setAttribute('data-type', 'sort');

        const toggle = document.createElement('a');
        toggle.className = 'dropdown-toggle';
        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Relevância';

        const menu = document.createElement('div');
        menu.className = 'dropdown-menu';

        const options = [
          { val: 'position', label: 'Relevância' },
          { val: 'price_asc', label: 'Mais baratos' },
          { val: 'price_desc', label: 'Mais caros' },
          { val: 'title_asc', label: 'A - Z' },
          { val: 'title_desc', label: 'Z - A' }
        ];

        options.forEach(opt => {
          const item = document.createElement('a');
          item.className = 'dropdown-item' + (opt.val === 'position' ? ' active' : '');
          item.href = '#';
          item.dataset.sort = opt.val;
          item.textContent = opt.label;
          menu.appendChild(item);
        });

        // Toggle manual
        toggle.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const open = menu.classList.contains('show');
          menu.classList.toggle('show', !open);
          toggle.setAttribute('aria-expanded', String(!open));
          if (!open) {
            const close = function() {
              menu.classList.remove('show');
              toggle.setAttribute('aria-expanded', 'false');
              document.removeEventListener('click', close);
            };
            setTimeout(function() { document.addEventListener('click', close); }, 0);
          }
        });

        // Selecionar opcao
        menu.addEventListener('click', function(e) {
          e.preventDefault();
          if (!e.target.classList.contains('dropdown-item')) return;

          const sortVal = e.target.dataset.sort;
          toggle.textContent = e.target.textContent;

          Array.from(menu.children).forEach(c => c.classList.remove('active'));
          e.target.classList.add('active');

          // Ordenar allProducts
          if (sortVal === 'position') {
            allProducts = [...originalOrder];
          } else if (sortVal === 'price_asc') {
            allProducts.sort((a,b) => a.price - b.price);
          } else if (sortVal === 'price_desc') {
            allProducts.sort((a,b) => b.price - a.price);
          } else if (sortVal === 'title_asc') {
            allProducts.sort((a,b) => a.title.localeCompare(b.title));
          } else if (sortVal === 'title_desc') {
            allProducts.sort((a,b) => b.title.localeCompare(a.title));
          }

          // Re-aplicar filtro e pagina1
          currentPage = 1;
          applyFilter();
        });

        dropWrap.appendChild(toggle);
        dropWrap.appendChild(menu);

        filtersField.innerHTML = '';
        filtersField.appendChild(dropWrap);
      }

      initSortDropdown();
      updateFill();
      loadProducts();
    }

    // imageFix.js
    // Corrige a "borda preta" das miniaturas. O Shopkit gera a variante /square/
    // (400x400) preenchendo com PRETO quando a foto original e' menor que 400px;
    // esse preto fica queimado no ficheiro da miniatura. Aqui detectamos so' esses
    // casos (os 4 cantos pretos numa imagem /square/) e trocamos pela imagem
    // ORIGINAL (sem padding), com fundo branco para eventuais barras. Imagens
    // correctas (original >= 400px) nao sao tocadas.

    const SQUARE_SEG = '/media/images/square/';

    function originalOf(src) {
      return src.replace(SQUARE_SEG, '/media/images/');
    }

    // Mede a espessura da moldura preta (linhas/colunas inteiras pretas) em cada lado.
    function blackFrame(imgEl) {
      const w = imgEl.naturalWidth, h = imgEl.naturalHeight;
      if (!w || !h) return null;
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      ctx.drawImage(imgEl, 0, 0);
      const D = ctx.getImageData(0, 0, w, h).data;
      const isBlack = function (x, y) {
        const i = (y * w + x) * 4;
        return D[i + 3] > 200 && D[i] < 28 && D[i + 1] < 28 && D[i + 2] < 28;
      };
      const N = 20;
      const rowBlack = function (y) {
        for (let k = 0; k <= N; k++) { if (!isBlack(Math.min(w - 1, Math.round(k * (w - 1) / N)), y)) return false; }
        return true;
      };
      const colBlack = function (x) {
        for (let k = 0; k <= N; k++) { if (!isBlack(x, Math.min(h - 1, Math.round(k * (h - 1) / N)))) return false; }
        return true;
      };
      let top = 0; while (top < h && rowBlack(top)) top++;
      let bot = 0; while (bot < h && rowBlack(h - 1 - bot)) bot++;
      let left = 0; while (left < w && colBlack(left)) left++;
      let right = 0; while (right < w && colBlack(w - 1 - right)) right++;
      return { w: w, h: h, top: top, bot: bot, left: left, right: right };
    }

    // E' "padding" do thumbnail quando ha' uma moldura preta uniforme e simetrica
    // (cima/baixo e/ou esquerda/direita) ocupando < ~45% (logo ha' conteudo no meio).
    // Baseia-se na MOLDURA, nao no centro -> funciona com produtos escuros.
    function isPadded(r) {
      if (!r) return false;
      const sym = function (a, b) { return a >= 3 && b >= 3 && Math.abs(a - b) <= Math.max(4, 0.3 * Math.max(a, b)); };
      const vert = sym(r.top, r.bot) && Math.max(r.top, r.bot) <= 0.45 * r.h;
      const horiz = sym(r.left, r.right) && Math.max(r.left, r.right) <= 0.45 * r.w;
      return vert || horiz;
    }

    function fixOne(img) {
      const src = img.getAttribute('src') || '';
      if (src.indexOf(SQUARE_SEG) === -1) return;     // so' miniaturas /square/
      if (img.dataset.aqBorder === src) return;        // ja' verificado este src
      img.dataset.aqBorder = src;

      const probe = new Image();
      probe.crossOrigin = 'anonymous';
      probe.onload = function () {
        let r = null;
        try { r = blackFrame(probe); } catch (e) { return; }  // CORS/tainted: ignora
        if (!isPadded(r)) return;                             // nao e' moldura preta (padding)
        const original = originalOf(src);
        if (original === src) return;
        img.style.background = '#fff';
        img.style.objectFit = 'contain';
        img.src = original;                 // imagem original, sem o padding preto
      };
      probe.onerror = function () {};
      probe.src = src;                      // mesmo URL ja' carregado pelo <img> visivel
    }

    function scan() {
      document.querySelectorAll('img.product-pic, img.card-pic').forEach(fixOne);
    }

    function initImageFix() {
      let t = null;
      const schedule = function () { clearTimeout(t); t = setTimeout(scan, 150); };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', schedule);
      } else {
        schedule();
      }
      // Apanha lazy-load (src trocado) e grelhas re-renderizadas (paginacao/filtros)
      const obs = new MutationObserver(schedule);
      obs.observe(document.documentElement, {
        childList: true, subtree: true, attributes: true, attributeFilter: ['src']
      });
    }

    /**
     * nativeFixes.js
     * Correcoes de conteudo gerado nativamente pelo Shopkit que nao se conseguem
     * fazer so com CSS. Cada fix e idempotente e seguro.
     */

    // 1. Concordancia singular/plural do stock
    function fixStockText() {
      if (!document.body.classList.contains('page-product')) return;
      document.querySelectorAll('.stock-number, .stock, .card-stock .stock').forEach(function (el) {
        var txt = el.textContent;
        var fixed = txt.replace(/\b1\s+unidades\b/i, '1 unidade');
        if (fixed !== txt) el.textContent = fixed;
      });
    }

    // 2. Botao CHECKOUT -> Finalizar compra
    function fixCheckoutButton() {
      var candidates = document.querySelectorAll(
        '.btn-checkout, a[href*="/cart/data"], a[href*="checkout"], .cart .btn-primary, .cart-summary a.btn'
      );
      candidates.forEach(function (el) {
        var t = (el.textContent || '').trim();
        if (/^check\s*out$/i.test(t)) {
          el.textContent = 'Finalizar compra';
        }
      });
    }

    // 3. SEO: titulo / H1 / meta description da homepage
    var SEO_TITLE = 'AquariumLife — Loja de Aquariofilia e Aquascaping em Portugal';
    var SEO_DESC  = 'Equipamento, plantas, peixes, hardscape e acessorios para o teu aquario. '
                  + 'As melhores marcas de aquarismo com envio para todo o pais.';

    function fixHomeSeo() {
      var path = window.location.pathname;
      var isHome = path === '/' || path === '' || path === '/index';
      if (!isHome) return;

      if (/^aquariumlife$/i.test((document.title || '').trim())) {
        document.title = SEO_TITLE;
      }

      var meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      if (!meta.getAttribute('content')) {
        meta.setAttribute('content', SEO_DESC);
      }

      var h1 = document.querySelector('h1');
      if (h1 && /^aquariumlife$/i.test(h1.textContent.trim())) {
        var sr = document.createElement('span');
        sr.className = 'aq-visually-hidden';
        sr.textContent = SEO_TITLE;
        h1.appendChild(sr);
      }
    }

    // 4. Pagina 404 — marca o body e injeta atalhos uteis (se o nosso codigo correr la)
    function fixErrorPage() {
      if (document.getElementById('aq-404-actions')) return;

      var txt = (document.body.textContent || '').toLowerCase();
      var looks404 = /ooops|p[áa]gina n[ãa]o encontrada|n[ãa]o se encontra dispon/i.test(txt)
                  && !document.querySelector('header, .header, .aq-nav-bar');
      if (!looks404) return;

      document.body.classList.add('page-404');

      var anchor = document.querySelector('.main, .container, body');
      if (!anchor) return;

      var box = document.createElement('div');
      box.id = 'aq-404-actions';
      box.className = 'aq-404-actions';
      box.innerHTML =
        '<a href="/">Voltar à página inicial</a>' +
        '<a href="/catalog">Ver todos os produtos</a>' +
        '<a href="/category/equipamento">Equipamento</a>' +
        '<a href="/category/plantas">Plantas</a>' +
        '<a href="/contact">Contactar-nos</a>';
      anchor.appendChild(box);
    }

    // 5. Perfil/checkout: idioma PT-PT e Pais Portugal Continental por defeito,
    //    e sincronizar os widgets niceSelect (que mostravam "vazio" por o texto
    //    branco ficar sobre fundo branco / por nao refletirem o <select> nativo).
    function setSelectDefault(id, preferredValues) {
      var sel = document.getElementById(id);
      if (!sel) return false;
      var cur = sel.value;
      // so define defeito se estiver vazio ou num valor que queremos corrigir
      var needsDefault = !cur || preferredValues.indexOf(cur) === -1;
      if (needsDefault) {
        for (var i = 0; i < preferredValues.length; i++) {
          var pv = preferredValues[i];
          var opt = Array.prototype.find
            ? Array.prototype.find.call(sel.options, function (o) { return o.value === pv; })
            : null;
          if (opt) { sel.value = pv; return true; }
        }
      }
      return false;
    }

    function fixProfileDefaults() {
      if (!document.body.classList.contains('page-account') &&
          !document.body.classList.contains('page-cart')) return;

      // Idioma: preferir pt_PT; corrigir se estiver vazio, pt_BR ou pt generico
      setSelectDefault('locale', ['pt_PT']);
      // Pais: preferir Portugal Continental (PRT)
      setSelectDefault('delivery_country', ['PRT']);
      setSelectDefault('billing_country', ['PRT']);

      // Sincronizar os widgets niceSelect com os <select> nativos
      var $ = window.jQuery;
      if ($ && $.fn && $.fn.niceSelect) {
        ['#locale', '#gender', '#delivery_country', '#billing_country'].forEach(function (sel) {
          try { $(sel).niceSelect('update'); } catch (e) {}
        });
      }
    }

    function runFixes() {
      fixStockText();
      fixCheckoutButton();
      fixHomeSeo();
      fixErrorPage();
      fixProfileDefaults();
    }

    function initNativeFixes() {
      runFixes();
      var attempts = 0;
      var interval = setInterval(function () {
        attempts++;
        runFixes();
        if (attempts >= 15) clearInterval(interval);
      }, 300);
    }

    /**
     * cartQuantity.js
     * Recalculo do valor do carrinho ao mudar a quantidade.
     *
     * Nesta loja, os botoes +/- nativos do Shopkit nao alteram a quantidade nem
     * recalculam o total. Aqui assumimos o controlo: ao clicar +/- (ou editar o
     * input) incrementamos/decrementamos, recalculamos o subtotal de cada linha e
     * o total geral na hora, e persistimos no servidor em segundo plano.
     *
     * Estrutura de cada linha editavel (.cart-item.well-featured):
     *   .js-counter-minus  .js-counter-input  .js-counter-plus
     *   .semi-bold   -> preco unitario
     *   .cart-actual -> subtotal da linha (preco unitario x qty)
     * Totais: .cart-total-text (total)  /  .total-taxes-value (IVA incluido)
     */

    var IVA_RATE = 0.23;

    function parsePrice(txt) {
      if (!txt) return 0;
      var n = txt.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
      var v = parseFloat(n);
      return isNaN(v) ? 0 : v;
    }
    function formatPrice(v) {
      var parts = v.toFixed(2).split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return parts[0] + ',' + parts[1] + ' €';
    }

    function recalcCart() {
      var rows = document.querySelectorAll('.cart-item.well-featured');
      if (!rows.length) return;

      var grandTotal = 0;
      rows.forEach(function (row) {
        var input = row.querySelector('.js-counter-input');
        var unitEl = row.querySelector('.semi-bold');
        var subEl = row.querySelector('.cart-actual');
        if (!input || !unitEl || !subEl) return;

        var qty = parseInt(input.value, 10);
        if (isNaN(qty) || qty < 1) qty = 1;

        // preco unitario: fixado na 1a passagem (subtotal inicial / qty inicial)
        var unit = parseFloat(row.getAttribute('data-aq-unit'));
        if (isNaN(unit)) {
          var initialQty = parseInt(input.getAttribute('data-aq-iq') || input.value, 10) || 1;
          unit = parsePrice(unitEl.textContent) / initialQty;
          row.setAttribute('data-aq-unit', unit);
          input.setAttribute('data-aq-iq', input.value);
        }

        var sub = unit * qty;
        subEl.textContent = formatPrice(sub);
        grandTotal += sub;
      });

      var totalEl = document.querySelector('.cart-total-text');
      if (totalEl) totalEl.textContent = formatPrice(grandTotal);

      var taxEl = document.querySelector('.total-taxes-value');
      if (taxEl) taxEl.textContent = formatPrice(grandTotal - grandTotal / (1 + IVA_RATE));
    }

    // --- persistir no servidor (silencioso) --------------------------------
    var saveTimer = null;
    function persistQuantities() {
      var form = document.querySelector('form[action*="cart/post/data"]');
      if (!form) return;
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
        try {
          fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'same-origin',
            redirect: 'manual'
          }).catch(function () {});
        } catch (e) {}
      }, 700);
    }

    function step(input, dir) {
      var q = parseInt(input.value, 10);
      if (isNaN(q)) q = 1;
      q = dir > 0 ? q + 1 : Math.max(1, q - 1);
      input.value = q;
      recalcCart();
      persistQuantities();
    }

    function initCartQuantity() {
      if (!document.body.classList.contains('page-cart')) return;

      // calculo inicial (estabelece precos unitarios) — tentar ate o carrinho existir
      var attempts = 0;
      var iv = setInterval(function () {
        attempts++;
        if (document.querySelector('.cart-item.well-featured .js-counter-input')) {
          recalcCart();
          clearInterval(iv);
        } else if (attempts >= 20) {
          clearInterval(iv);
        }
      }, 250);

      if (document.body.hasAttribute('data-aq-qty-bound')) return;
      document.body.setAttribute('data-aq-qty-bound', '1');

      // Delegacao no document em CAPTURE: sobrevive a re-renders do Shopkit e
      // corre antes do (inativo) handler nativo. Assumimos o +/- por completo.
      document.addEventListener('click', function (e) {
        var btn = e.target.closest('.js-counter-plus, .js-counter-minus');
        if (!btn) return;
        var row = btn.closest('.cart-item.well-featured');
        if (!row) return;
        var input = row.querySelector('.js-counter-input');
        if (!input) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        step(input, btn.classList.contains('js-counter-plus') ? 1 : -1);
      }, true);

      // edicao manual do input
      document.addEventListener('input', function (e) {
        if (e.target.classList && e.target.classList.contains('js-counter-input')) {
          recalcCart();
          persistQuantities();
        }
      }, false);
      document.addEventListener('change', function (e) {
        if (e.target.classList && e.target.classList.contains('js-counter-input')) {
          recalcCart();
          persistQuantities();
        }
      }, false);
    }

    /**
     * storeSection.js - v4
     * - Endereco correto: Praceta Jose Afonso 3A, 2740-192 Porto Salvo, Portugal
     * - Botao "Como chegar": abre rotas do Google Maps ate a loja
     * - Badge Google Reviews e clicavel (substitui botao "Avaliar no Google")
     */

    const REVIEW_URL = 'https://g.page/r/CXlxMPCWpRf3EAE/review';
    const MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.6698765065166!2d-9.31225998837219!3d38.72538765671719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1ecf2d390fc4f5%3A0xf717a596f0307179!2sAquariumlife!5e0!3m2!1spt-PT!2spt!4v1778773494142!5m2!1spt-PT!2spt';

    /* Link de direcoes: abre rota da localizacao atual ate a loja */
    const DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1&destination=Praceta+Jos%C3%A9+Afonso+3A+2740-192+Porto+Salvo+Portugal&destination_place_id=ChIJ9U8ME9Py7UcReXEw8JalF_c';

    function starSVG() {
      return '<svg viewBox="0 0 24 24" class="aq-star filled" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/></svg>';
    }

    function googleLogoSVG() {
      return '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="aq-google-logo" aria-hidden="true"><path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.2z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.9 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.6v6.2C6.6 43.2 14.7 48 24 48z"/><path fill="#FBBC05" d="M10.8 28.8c-.5-1.4-.7-2.8-.7-4.3s.3-2.9.7-4.3v-6.2H2.6C.9 17.3 0 20.6 0 24s.9 6.7 2.6 9.5l8.2-4.7z"/><path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.4 30.4 0 24 0 14.7 0 6.6 4.8 2.6 12.5l8.2 4.7c1.9-5.6 7.1-9.7 13.2-9.7z"/></svg>';
    }

    function buildStoreSection() {
      if (document.getElementById('aq-store')) return null;

      var section = document.createElement('section');
      section.id = 'aq-store';

      section.innerHTML =
        '<div class="aq-store-inner">' +
          '<div class="aq-store-map">' +
            '<iframe' +
              ' src="' + MAPS_EMBED + '"' +
              ' width="100%" height="100%"' +
              ' style="border:0;" allowfullscreen="" loading="lazy"' +
              ' referrerpolicy="no-referrer-when-downgrade"' +
              ' title="Localizacao Aquariumlife no Google Maps"' +
            '></iframe>' +
          '</div>' +
          '<div class="aq-store-info">' +
            '<div class="aq-section-header aq-store-header">' +
              '<span class="aq-section-tag">Loja Fisica</span>' +
              '<h2 class="aq-section-title">Visita-nos <span class="aq-neon">Pessoalmente</span></h2>' +
              '<p class="aq-section-sub">Vem conhecer o nosso espaco, ver os produtos ao vivo e receber aconselhamento especializado da nossa equipa.</p>' +
            '</div>' +
            '<ul class="aq-store-details">' +
              '<li>' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
                '<span>Praceta Jose Afonso 3A, 2740-192 Porto Salvo, Portugal</span>' +
              '</li>' +
              '<li>' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' +
                '<span>Horarios disponiveis no nosso perfil Google</span>' +
              '</li>' +
              '<li>' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.92z"/></svg>' +
                '<span>Atendimento presencial e online</span>' +
              '</li>' +
            '</ul>' +
            '<div class="aq-store-ctas">' +
              '<a href="' + DIRECTIONS_URL + '" target="_blank" rel="noopener noreferrer" class="aq-btn-primary">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>' +
                'Como chegar' +
              '</a>' +
            '</div>' +
            '<div class="aq-google-rating">' +
              '<a href="' + REVIEW_URL + '" target="_blank" rel="noopener noreferrer" class="aq-rating-badge aq-rating-badge--link">' +
                googleLogoSVG() +
                '<div class="aq-rating-info">' +
                  '<div class="aq-rating-stars">' + starSVG() + starSVG() + starSVG() + starSVG() + starSVG() + '</div>' +
                  '<span class="aq-rating-text">Deixa a tua avaliacao no Google</span>' +
                '</div>' +
              '</a>' +
            '</div>' +
          '</div>' +
        '</div>';

      return section;
    }

    /**
     * faqSection.js – v2
     * Exporta buildFAQSection() para uso pelo homeOrchestrator.
     */

    const FAQS = [
      { q: 'Fazem envios para todo Portugal continental e ilhas?',
        a: 'Sim! Enviamos para todo o Portugal continental, Madeira e Açores. Os prazos e custos de envio variam consoante o destino — consulta as condições de envio na página do carrinho.' },
      { q: 'Vendem peixes, plantas e invertebrados vivos?',
        a: 'Sim, trabalhamos com seres vivos! As encomendas de animais e plantas são cuidadosamente embaladas com materiais específicos para garantir a chegada em segurança. Em caso de problema na chegada, contacta-nos em até 2 horas com foto/vídeo.' },
      { q: 'Qual o prazo de entrega habitual?',
        a: 'Para equipamento e produtos secos, o prazo habitual é de 2 a 5 dias úteis. Para encomendas com seres vivos, os envios são feitos às terças e quartas-feiras para evitar atrasos no fim de semana.' },
      { q: 'Posso visitar a vossa loja física?',
        a: 'Claro! A nossa loja física fica na Praceta José Afonso 3A, 2740-192 Porto Salvo, Portugal. Podes vir ver os produtos ao vivo, pedir aconselhamento especializado e até trazer o teu aquário para diagnóstico. Consulta o nosso perfil no Google Maps para horários atualizados.' },
      { q: 'Que marcas comercializam?',
        a: 'Trabalhamos com marcas de referência mundial como Tropica, ADA, JBL, Fluval, Oase, Dennerle, Eheim e Seachem, entre outras. Temos sempre stock renovado e acesso a encomenda especial.' },
      { q: 'Como escolher o filtro certo para o meu aquário?',
        a: 'Recomendamos um filtro capaz de filtrar pelo menos 4× o volume do aquário por hora. Por exemplo, para um aquário de 100L, procura um filtro com débito mínimo de 400 L/h. A nossa equipa pode ajudar-te a escolher a melhor solução — basta contactar-nos!' },
      { q: 'Devo usar CO₂ no meu aquário plantado?',
        a: 'Depende das plantas que pretendes manter. Para plantações simples (Anubias, Java Fern, Musgo), o CO₂ líquido ou fertilizantes são suficientes. Para aquascaping intensivo com plantas exigentes, um sistema de CO₂ gasoso faz toda a diferença.' },
      { q: 'Aceitam devoluções?',
        a: 'Sim, tens 14 dias para devolver produtos em bom estado, conforme a legislação europeia de comércio eletrónico. Para seres vivos, a política é diferente — lê com atenção as condições na página de Termos e Condições.' },
    ];

    function buildFAQSchema() {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    function buildFAQSection() {
      if (document.getElementById('aq-faq')) return null;

      buildFAQSchema();

      const section = document.createElement('section');
      section.id = 'aq-faq';

      const header = document.createElement('div');
      header.className = 'aq-section-header';
      header.innerHTML = `
    <span class="aq-section-tag">Dúvidas</span>
    <h2 class="aq-section-title">Perguntas <span class="aq-neon">Frequentes</span></h2>
    <p class="aq-section-sub">Tudo o que precisas de saber antes de comprar</p>
  `;
      section.appendChild(header);

      const list = document.createElement('div');
      list.className = 'aq-faq-list';

      FAQS.forEach(({ q, a }, i) => {
        const item = document.createElement('div');
        item.className = 'aq-faq-item';

        const btn = document.createElement('button');
        btn.className = 'aq-faq-q';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', `aq-faq-a-${i}`);
        btn.innerHTML = `
      <span>${q}</span>
      <svg class="aq-faq-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

        const answer = document.createElement('div');
        answer.className = 'aq-faq-a';
        answer.id = `aq-faq-a-${i}`;
        const p = document.createElement('p');
        p.textContent = a;
        answer.appendChild(p);

        btn.addEventListener('click', () => {
          const isOpen = btn.getAttribute('aria-expanded') === 'true';
          list.querySelectorAll('.aq-faq-q[aria-expanded="true"]').forEach(other => {
            if (other !== btn) {
              other.setAttribute('aria-expanded', 'false');
              other.closest('.aq-faq-item').classList.remove('open');
            }
          });
          btn.setAttribute('aria-expanded', String(!isOpen));
          item.classList.toggle('open', !isOpen);
        });

        item.appendChild(btn);
        item.appendChild(answer);
        list.appendChild(item);
      });

      section.appendChild(list);
      return section;
    }

    /**
     * homeOrchestrator.js – v7
     * Sem MutationObserver. Oculta nativos via CSS no SCSS.
     * Injeta secções premium em ordem no container principal.
     */


    function getContainer() {
      return document.querySelector('main, #main, .main, [role="main"], #content, .content')
        || document.body;
    }

    function append(section, id) {
      if (!section) return;
      if (document.getElementById(id)) return;
      getContainer().appendChild(section);
      console.log('[AQ] injetado:', id);
    }

    async function initHome() {
      const container = getContainer();
      console.log('[AQ] initHome v7 — container:', container.tagName, container.id || container.className.slice(0,30));

      try { append(await buildBrandsSection(), 'aq-brands'); } catch(e) { console.warn('[AQ] brands:', e); }
      try { append(buildStoreSection(),        'aq-store');  } catch(e) { console.warn('[AQ] store:', e);  }
      try { append(buildFAQSection(),          'aq-faq');    } catch(e) { console.warn('[AQ] faq:', e);    }
      try { append(await buildBlogSection(),   'aq-blog-home'); } catch(e) { console.warn('[AQ] blog:', e); }

      console.log('[AQ] Home completa ✓');
    }

    // JS Entry Point for AquariumLife Custom Layer


    function init() {
      initAnimations();
      injectMenuIcons();
      buildDesktopNav();
      initCategorySection();
      initProductsSection();
      initCartStyles();
      initTrustSeals();

      // Oculta bloco nativo de marcas independentemente do orquestrador
      initBrandsSection();

      // Redesign de /blog e post individual
      initBlogSection();

      // Redesign de paginas estaticas /page/*
      initPagesSection();

      // Redesign de /sales, /new e /contact
      initSpecialPages();

      // Slider de preco + layout filtros nas paginas de categoria
      initCategoryFilters();

      // Corrige a borda preta das miniaturas (thumbnails /square/ de fotos pequenas)
      initImageFix();

      // Correcoes de conteudo nativo Shopkit (stock, botao checkout, SEO home)
      initNativeFixes();

      // Recalculo de quantidade no carrinho
      initCartQuantity();

      // Toggle dark/light mode (lampada flutuante)
      initThemeToggle();

      // Orquestrador: injeta seções da home em ordem garantida
      // brands → store → faq → blog
      const path = window.location.pathname;
      if (path === '/' || path === '' || path === '/index') {
        initHome();
      }

      console.log('[AQ] Premium Layer Loaded — readyState:', document.readyState);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
    // build Thu May 14 21:12:37 HVGMT 2026
    // build Thu May 14 21:19:10 HVGMT 2026
    // build Thu May 14 21:28:05 HVGMT 2026
    // build Thu May 14 21:35:19 HVGMT 2026
    // build Thu May 14 21:42:27 HVGMT 2026
    // build Thu May 14 21:46:56 HVGMT 2026
    // Thu May 14 21:59:55 HVGMT 2026
    // Thu May 14 22:11:14 HVGMT 2026
    // Thu May 14 23:49:01 HVGMT 2026
    // Thu May 14 23:52:33 HVGMT 2026

})();
