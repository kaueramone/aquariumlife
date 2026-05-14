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

    function tryBuild() {
      if (window.innerWidth < 992) return;
      if (document.getElementById('aq-nav-bar')) return;

      // Seletores por prioridade — o <header> semântico primeiro,
      // sem [class*="header"] que faz match em .section-header, .footer-header, etc.
      const header =
        document.querySelector('body > header') ||
        document.querySelector('body > #header') ||
        document.querySelector('body > .header') ||
        document.querySelector('#wrapper > header') ||
        document.querySelector('#wrapper > .header') ||
        document.querySelector('#header') ||
        document.querySelector('header');

      if (!header) return false;

      // Segurança extra: nunca injetar dentro do footer
      if (header.closest('footer, #footer, .footer')) return false;

      // Esconder bolinha hamburguer real do Boxie
      header.querySelectorAll(
        '.trigger-header-menu, .menu-toggle, .mobile-menu-btn, .burger, .btn-menu, .navbar-toggler'
      ).forEach(el => el.style.setProperty('display', 'none', 'important'));

      // Construir nav
      const nav = document.createElement('nav');
      nav.id = 'aq-nav-bar';
      nav.setAttribute('aria-label', 'Menu Principal');
      nav.setAttribute('role', 'navigation');

      const ul = document.createElement('ul');
      ul.setAttribute('role', 'menubar');
      MENU.forEach(item => ul.appendChild(createNavItem(item)));
      nav.appendChild(ul);

      header.appendChild(nav);
      console.log('[AQ] Nav v5 inserida —', MENU.length, 'itens no header:', header.tagName, header.className);
      return true;
    }

    function buildDesktopNav() {
      // Tenta imediatamente
      if (tryBuild()) return;

      // Retry por polling (até 5 segundos)
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        console.log('[AQ] Tentativa', attempts, 'de encontrar o header...');
        if (tryBuild() || attempts >= 10) clearInterval(interval);
      }, 500);

      // Também usa MutationObserver como segurança extra
      const observer = new MutationObserver(() => {
        if (tryBuild()) observer.disconnect();
      });
      observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
      });
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

    const VER_TODOS_HREF = '/products';

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
          if (!el.closest('.card-shadow-hover')) {
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
     * cartStyles.js — v3
     * - Tema escuro no mini-cart popup (.cart-list)
     * - Badge ! no ícone do carrinho
     * - Tema escuro + z-index no popup pós-compra (modal Bootstrap/Shopkit)
     */

    const NEON = '#08EEBC';
    const DARK = '#001531';
    const STYLED = 'aq-styled';

    // ── Mini-cart popup (.cart-list) ─────────────────────────────
    function applyDarkCart(popup) {
      if (!popup || popup.getAttribute(STYLED)) return;
      popup.setAttribute(STYLED, '1');

      const set = (el, p, v) => el && el.style.setProperty(p, v, 'important');

      set(popup, 'background',       DARK);
      set(popup, 'background-color', DARK);
      set(popup, 'border',           '1px solid rgba(8,238,188,0.25)');
      set(popup, 'border-radius',    '14px');
      set(popup, 'box-shadow',       '0 20px 50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(8,238,188,0.1)');
      set(popup, 'overflow',         'hidden');
      set(popup, 'color',            '#fff');

      popup.querySelectorAll('.cart-item').forEach(el => {
        set(el, 'border-bottom', '1px solid rgba(8,238,188,0.08)');
        set(el, 'background', 'transparent');
      });
      popup.querySelectorAll('.item-image img').forEach(el => {
        set(el, 'border-radius', '8px');
        set(el, 'background', 'rgba(0,8,20,0.6)');
        set(el, 'border', '1px solid rgba(8,238,188,0.12)');
        set(el, 'padding', '4px');
      });
      popup.querySelectorAll('.item-product').forEach(el => {
        set(el, 'color', '#cde4f8');
        set(el, 'font-weight', '500');
      });
      popup.querySelectorAll('.details .price').forEach(el => {
        set(el, 'color', NEON);
        set(el, 'font-weight', '700');
      });
      popup.querySelectorAll('a.remove').forEach(el => {
        set(el, 'background', 'transparent');
        set(el, 'border', '1px solid rgba(8,238,188,0.2)');
        set(el, 'border-radius', '50%');
        set(el, 'width', '30px'); set(el, 'height', '30px');
        set(el, 'display', 'flex');
        set(el, 'align-items', 'center');
        set(el, 'justify-content', 'center');
        set(el, 'padding', '0');
        set(el, 'box-shadow', 'none');
        el.querySelectorAll('svg, path').forEach(p => set(p, 'fill', NEON));
      });

      const total = popup.querySelector('.cart-total');
      if (total) {
        set(total, 'background', 'rgba(8,238,188,0.03)');
        set(total, 'border-top', '1px solid rgba(8,238,188,0.1)');
        set(total, 'padding', '12px 16px');
        set(total, 'display', 'flex');
        set(total, 'justify-content', 'space-between');
        set(total, 'align-items', 'center');
        const tt = total.querySelectorAll('.cart-total-text');
        if (tt[0]) { set(tt[0], 'color', 'rgba(255,255,255,0.6)'); set(tt[0], 'font-size', '0.8rem'); set(tt[0], 'text-transform', 'uppercase'); set(tt[0], 'letter-spacing', '1px'); }
        if (tt[1]) { set(tt[1], 'color', NEON); set(tt[1], 'font-size', '1.15rem'); set(tt[1], 'font-weight', '700'); }
      }

      const btns = popup.querySelector('.cart-btns');
      if (btns) {
        set(btns, 'display', 'flex'); set(btns, 'flex-direction', 'row');
        set(btns, 'gap', '8px'); set(btns, 'padding', '12px 16px 16px');
        set(btns, 'background', 'transparent');
      }
      popup.querySelectorAll('.cart-btn').forEach(btn => styleNeonBtn(btn));

      console.log('[AQ] Cart dark theme applied');
    }

    // ── Popup pós-compra (modal Bootstrap/Shopkit) ───────────────
    function applyDarkModal(modal) {
      if (!modal || modal.getAttribute(STYLED)) return;
      modal.setAttribute(STYLED, '1');

      const set = (el, p, v) => el && el.style.setProperty(p, v, 'important');

      // Z-index acima do header (9999) e do overlay
      set(modal, 'z-index', '10100');

      // Overlay do modal
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        set(backdrop, 'z-index', '10050');
        set(backdrop, 'background', 'rgba(0,4,13,0.75)');
      }

      // Caixa interna do modal
      const content = modal.querySelector('.modal-content') || modal;
      set(content, 'background',       DARK);
      set(content, 'background-color', DARK);
      set(content, 'border',           '1px solid rgba(8,238,188,0.25)');
      set(content, 'border-radius',    '14px');
      set(content, 'box-shadow',       '0 20px 50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(8,238,188,0.1)');
      set(content, 'color',            '#fff');

      // Header do modal
      const mHeader = modal.querySelector('.modal-header');
      if (mHeader) {
        set(mHeader, 'background',   'transparent');
        set(mHeader, 'border-bottom','1px solid rgba(8,238,188,0.1)');
        set(mHeader, 'padding',      '16px 20px');
        mHeader.querySelectorAll('h1,h2,h3,h4,h5,h6,.modal-title').forEach(el => {
          set(el, 'color', '#fff');
          set(el, 'font-weight', '600');
        });
        // Botão fechar (X)
        const closeBtn = mHeader.querySelector('.close, [data-dismiss="modal"], button');
        if (closeBtn) {
          set(closeBtn, 'color', 'rgba(255,255,255,0.5)');
          set(closeBtn, 'background', 'transparent');
          set(closeBtn, 'border', 'none');
          set(closeBtn, 'font-size', '1.4rem');
          set(closeBtn, 'opacity', '1');
        }
      }

      // Body do modal
      const mBody = modal.querySelector('.modal-body');
      if (mBody) {
        set(mBody, 'background', 'transparent');
        set(mBody, 'padding', '16px 20px');
        mBody.querySelectorAll('p, span, div, label').forEach(el => set(el, 'color', 'rgba(255,255,255,0.85)'));
        mBody.querySelectorAll('img').forEach(el => {
          set(el, 'border-radius', '8px');
          set(el, 'background', 'rgba(0,8,20,0.6)');
          set(el, 'border', '1px solid rgba(8,238,188,0.12)');
          set(el, 'padding', '4px');
        });
        mBody.querySelectorAll('[class*="price"], .price, strong').forEach(el => {
          set(el, 'color', NEON);
          set(el, 'font-weight', '700');
        });
      }

      // Footer do modal — botões
      const mFooter = modal.querySelector('.modal-footer');
      if (mFooter) {
        set(mFooter, 'background', 'transparent');
        set(mFooter, 'border-top', '1px solid rgba(8,238,188,0.1)');
        set(mFooter, 'padding', '12px 20px 16px');
        set(mFooter, 'display', 'flex');
        set(mFooter, 'gap', '8px');
        mFooter.querySelectorAll('a, button, .btn').forEach(btn => styleNeonBtn(btn));
      }

      // Se não tiver footer, procurar botões no body
      if (!mFooter) {
        modal.querySelectorAll('a.btn, button.btn, .btn').forEach(btn => styleNeonBtn(btn));
      }

      console.log('[AQ] Modal dark theme applied');
    }

    // ── Estilo neon para botões ───────────────────────────────────
    function styleNeonBtn(btn) {
      const set = (p, v) => btn.style.setProperty(p, v, 'important');
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
        btn.addEventListener('mouseenter', () => {
          btn.style.setProperty('background', NEON, 'important');
          btn.style.setProperty('color', DARK, 'important');
          btn.style.setProperty('box-shadow', '0 0 16px rgba(8,238,188,0.4)', 'important');
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.setProperty('background', 'transparent', 'important');
          btn.style.setProperty('color', NEON, 'important');
          btn.style.setProperty('box-shadow', 'none', 'important');
        });
      }
    }

    // ── Badge ! no ícone do carrinho ─────────────────────────────
    function updateBadge() {
      const link = document.querySelector('.link-cart');
      if (!link) return;

      const hasProducts = link.classList.contains('has-products') ||
        document.querySelectorAll('.cart-list .cart-item').length > 0;

      let badge = link.querySelector('.aq-cart-badge');

      if (!hasProducts) {
        if (badge) badge.remove();
        return;
      }
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'aq-cart-badge';
        link.appendChild(badge);
      }
      badge.textContent = '!';
    }

    // ── Init ─────────────────────────────────────────────────────
    function initCartStyles() {
      document.querySelectorAll('.cart-list').forEach(applyDarkCart);
      document.querySelectorAll('.modal.show, .modal.in, [class*="cart-modal"]').forEach(applyDarkModal);
      updateBadge();

      new MutationObserver((mutations) => {
        let needsBadge = false;
        mutations.forEach(m => {
          m.addedNodes.forEach(node => {
            if (node.nodeType !== 1) return;
            // Mini-cart
            if (node.classList?.contains('cart-list')) { applyDarkCart(node); needsBadge = true; }
            node.querySelectorAll?.('.cart-list').forEach(el => { applyDarkCart(el); needsBadge = true; });
            // Modal pós-compra
            if (node.classList?.contains('modal') || node.classList?.contains('modal-dialog')) {
              applyDarkModal(node.classList.contains('modal') ? node : node.closest('.modal') || node);
            }
            node.querySelectorAll?.('.modal').forEach(applyDarkModal);
            // Backdrop
            if (node.classList?.contains('modal-backdrop')) {
              node.style.setProperty('z-index', '10050', 'important');
              node.style.setProperty('background', 'rgba(0,4,13,0.75)', 'important');
            }
          });
        });
        if (needsBadge) updateBadge();
      }).observe(document.body, { childList: true, subtree: true });
    }

    /**
     * brandsSection.js – v6
     * Extrai marcas do DOM nativo do Shopkit (já presentes na página),
     * oculta a section nativa e injeta o carrossel premium.
     */

    const BRANDS_FALLBACK = [
      'Tropica','ADA','JBL','Fluval','Oase',
      'Dennerle','Eheim','Seachem','Aquael','Tetra',
    ];

    // Oculta a section nativa — seletor preciso baseado no HTML real do Shopkit
    function hideNativeBrands() {
      const native = document.querySelector('section.brands-block, section.brands.section');
      if (native) {
        native.style.setProperty('display', 'none', 'important');
        console.log('[AQ] brands nativo ocultado');
        return true;
      }
      return false;
    }

    // Extrai marcas do DOM nativo (mais fiável que a API)
    function extractBrandsFromDOM() {
      const items = document.querySelectorAll(
        'section.brands-block .brands-item:not(.slick-cloned), ' +
        'section.brands.section .brands-item:not(.slick-cloned)'
      );
      if (!items.length) return null;
      const brands = [];
      items.forEach(item => {
        const img = item.querySelector('img');
        const label = img?.alt || img?.title || item.querySelector('a')?.textContent?.trim() || '';
        const src = img?.src || '';
        // Ignora imagens de placeholder do Shopkit
        const imgFinal = src.includes('no-img') ? null : src;
        if (label) brands.push({ label, img: imgFinal });
      });
      return brands.length ? brands : null;
    }

    function buildBrandItem({ label, img: imgSrc }) {
      const div = document.createElement('div');
      div.className = 'aq-brand-item';
      div.title = label;
      if (imgSrc) {
        const img = document.createElement('img');
        img.src = imgSrc; img.alt = label; img.loading = 'lazy';
        img.onerror = function () {
          this.style.display = 'none';
          const s = document.createElement('span');
          s.className = 'aq-brand-fallback'; s.textContent = label;
          div.appendChild(s);
        };
        div.appendChild(img);
      } else {
        const s = document.createElement('span');
        s.className = 'aq-brand-fallback'; s.textContent = label;
        div.appendChild(s);
      }
      return div;
    }

    async function buildBrandsSection() {
      if (document.getElementById('aq-brands')) return null;

      // Extrai do DOM nativo (já disponível); fallback para lista estática
      const extracted = extractBrandsFromDOM();
      const items = extracted || BRANDS_FALLBACK.map(label => ({ label, img: null }));

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
      // Duplica para scroll infinito
      [...items, ...items].forEach(item => inner.appendChild(buildBrandItem(item)));
      track.appendChild(inner);
      section.appendChild(track);

      console.log('[AQ] brands extraídas do DOM:', items.length);
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
     * blogSection.js – v4
     * Cards premium com imagem destacada, leitura estimada e design melhorado.
     */

    const BLOG_API  = '/api/json/blog/posts?limit=3&page=1';
    const BLOG_HREF = '/blog';

    function formatDate(dateStr) {
      try {
        return new Date(dateStr).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
      } catch { return dateStr; }
    }

    function truncate(str, max = 120) {
      if (!str || str.length <= max) return str || '';
      return str.slice(0, max).replace(/\s\S*$/, '') + '…';
    }

    function readingTime(text) {
      if (!text) return '1 min';
      const words = text.trim().split(/\s+/).length;
      const mins = Math.max(1, Math.round(words / 200));
      return `${mins} min de leitura`;
    }

    function buildPostCard(post) {
      const card = document.createElement('a');
      card.href = post.url || `${BLOG_HREF}/${post.handle}`;
      card.className = 'aq-blog-card';
      card.setAttribute('aria-label', `Ler artigo: ${post.title}`);

      const thumb = post.image?.url || post.featured_image || post.image_url || '';
      const excerpt = post.excerpt || post.body_plain || post.summary || '';
      const date = formatDate(post.created_at || post.published_at);
      const time = readingTime(excerpt);

      card.innerHTML = `
    <div class="aq-blog-card-img">
      ${thumb
        ? `<img src="${thumb}" alt="${post.title}" loading="lazy"/>`
        : `<div class="aq-blog-card-img-placeholder">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" stroke-width="2"/>
              <circle cx="18" cy="22" r="4" stroke="currentColor" stroke-width="2"/>
              <path d="M6 34l10-10 6 6 8-8 12 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
           </div>`}
      <span class="aq-blog-card-tag">Aquarismo</span>
    </div>
    <div class="aq-blog-card-body">
      <div class="aq-blog-card-meta">
        <time class="aq-blog-card-date">${date}</time>
        <span class="aq-blog-card-read">${time}</span>
      </div>
      <h3 class="aq-blog-card-title">${post.title}</h3>
      <p class="aq-blog-card-excerpt">${truncate(excerpt)}</p>
      <span class="aq-blog-card-cta">
        Ler artigo
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </span>
    </div>
  `;
      return card;
    }

    function buildSkeletonCard() {
      const card = document.createElement('div');
      card.className = 'aq-blog-card aq-blog-skeleton';
      card.innerHTML = `
    <div class="aq-blog-card-img aq-skel-img"></div>
    <div class="aq-blog-card-body">
      <div class="aq-skel-line aq-skel-short"></div>
      <div class="aq-skel-line aq-skel-full"></div>
      <div class="aq-skel-line aq-skel-medium"></div>
    </div>
  `;
      return card;
    }

    async function fetchPosts() {
      try {
        const res = await fetch(BLOG_API);
        if (!res.ok) return null;
        const data = await res.json();
        return Array.isArray(data) ? data : (data.posts || data.data || null);
      } catch { return null; }
    }

    async function buildBlogSection() {
      if (document.getElementById('aq-blog-home')) return null;

      const section = document.createElement('section');
      section.id = 'aq-blog-home';
      section.innerHTML = `
    <div class="aq-section-header">
      <span class="aq-section-tag">Do nosso blogue</span>
      <h2 class="aq-section-title">Mergulha no Mundo do <span class="aq-neon">Aquarismo</span></h2>
      <p class="aq-section-sub">Dicas de especialistas, guias passo a passo, novidades do hobby e tudo sobre peixes, plantas e aquascaping — escrito por quem vive o aquarismo todos os dias.</p>
    </div>
    <div class="aq-blog-grid" id="aq-blog-grid"></div>
    <div class="aq-blog-home-cta">
      <a href="${BLOG_HREF}" class="aq-btn-outline">
        Ver todos os artigos
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  `;

      const grid = section.querySelector('#aq-blog-grid');
      for (let i = 0; i < 3; i++) grid.appendChild(buildSkeletonCard());

      fetchPosts().then(posts => {
        grid.innerHTML = '';
        if (posts && posts.length) {
          posts.slice(0, 3).forEach(p => grid.appendChild(buildPostCard(p)));
        } else {
          grid.innerHTML = `<div class="aq-blog-empty"><p>Em breve novos artigos sobre aquarismo!</p></div>`;
        }
        console.log('[AQ] Blog posts carregados:', posts?.length || 0);
      });

      return section;
    }

    // ── Redesign /blog e post individual ─────────────────────────────────────────

    function redesignBlogListing() {
      const path = window.location.pathname;
      if (path !== '/blog' && path !== '/blog/') return;
      if (document.body.classList.contains('aq-blog-styled')) return;
      document.body.classList.add('aq-blog-styled', 'aq-page-blog');

      const pageTitle = document.querySelector('.page-title, .blog-title, h1.title, .section-title');
      if (pageTitle) {
        const wrap = document.createElement('div');
        wrap.className = 'aq-blog-page-header';
        wrap.innerHTML = `
      <span class="aq-section-tag">Blog</span>
      <h1 class="aq-section-title">Mundo do <span class="aq-neon">Aquarismo</span></h1>
      <p class="aq-section-sub">Dicas de especialistas, guias passo-a-passo e novidades do mundo aquático</p>
    `;
        const container = pageTitle.closest('section, .container, .row');
        container?.parentNode?.insertBefore(wrap, container);
        pageTitle.style.setProperty('display', 'none', 'important');
      }

      setTimeout(() => {
        document.querySelectorAll('.post, .blog-item, [class*="post-item"]').forEach(card => {
          card.classList.add('aq-blog-native-card');
        });
      }, 500);
    }

    function redesignBlogPost() {
      const path = window.location.pathname;
      if (!path.startsWith('/blog/') || path === '/blog/') return;
      if (document.body.classList.contains('aq-post-styled')) return;
      document.body.classList.add('aq-post-styled', 'aq-page-post');

      document.querySelector('.post-title, .article-title, h1.title, .blog-post-title')?.classList.add('aq-post-title');
      document.querySelectorAll('.post-date, .post-meta, .article-meta').forEach(el => el.classList.add('aq-post-meta'));
      document.querySelectorAll('.post-image, .post-thumbnail, .article-image').forEach(el => el.classList.add('aq-post-featured-img'));
      document.querySelectorAll('.post-body, .post-content, .article-body').forEach(el => el.classList.add('aq-post-body'));

      if (!document.getElementById('aq-post-back')) {
        const btn = document.createElement('a');
        btn.id = 'aq-post-back'; btn.href = BLOG_HREF; btn.className = 'aq-post-back-btn';
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Voltar ao Blog`;
        document.querySelector('article, .post-wrapper, main > .container')?.prepend(btn);
      }
    }

    function initBlogSection() {
      const path = window.location.pathname;
      if (path === '/blog' || path === '/blog/') redesignBlogListing();
      else if (path.startsWith('/blog/')) redesignBlogPost();
    }

    /**
     * trustSeals.js – v1
     * Injeta barra de selos de confiança antes do copyright do footer.
     * Selos: SSL Shopkit | Compra Segura | Google Business | MB | MB WAY | Visa/MC
     */

    const SEALS = [
      {
        id: 'ssl',
        label: 'SSL Seguro',
        sub: 'Loja certificada',
        icon: `<svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="18" width="32" height="26" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M12 18V13a8 8 0 0116 0v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="20" cy="31" r="3" fill="currentColor"/>
      <line x1="20" y1="34" x2="20" y2="39" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
      },
      {
        id: 'secure',
        label: 'Compra Segura',
        sub: 'Dados protegidos',
        icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L8 10v12c0 10.5 6.8 20.3 16 23.4C33.2 42.3 40 32.5 40 22V10L24 4z" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M16 24l5 5 11-11" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
      },
      {
        id: 'google',
        label: 'Google Business',
        sub: 'Perfil verificado',
        icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.2z"/>
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.9 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.6v6.2C6.6 43.2 14.7 48 24 48z"/>
      <path fill="#FBBC05" d="M10.8 28.8c-.5-1.4-.7-2.8-.7-4.3s.3-2.9.7-4.3v-6.2H2.6C.9 17.3 0 20.6 0 24s.9 6.7 2.6 9.5l8.2-4.7z"/>
      <path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.4 30.4 0 24 0 14.7 0 6.6 4.8 2.6 12.5l8.2 4.7c1.9-5.6 7.1-9.7 13.2-9.7z"/>
    </svg>`,
      },
      {
        id: 'mb',
        label: 'Multibanco',
        sub: 'Pagamento aceite',
        icon: `<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
      <rect x="6" y="10" width="8" height="12" rx="1" fill="currentColor" opacity=".4"/>
      <rect x="16" y="10" width="8" height="12" rx="1" fill="currentColor" opacity=".7"/>
      <rect x="26" y="10" width="8" height="12" rx="1" fill="currentColor"/>
      <text x="24" y="26" text-anchor="middle" font-size="5" fill="currentColor" font-family="sans-serif" opacity=".7">MULTIBANCO</text>
    </svg>`,
      },
      {
        id: 'mbway',
        label: 'MB WAY',
        sub: 'Pagamento aceite',
        icon: `<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
      <text x="24" y="14" text-anchor="middle" font-size="8" fill="#08EEBC" font-family="sans-serif" font-weight="bold">MB</text>
      <text x="24" y="25" text-anchor="middle" font-size="7" fill="currentColor" font-family="sans-serif" opacity=".8">WAY</text>
    </svg>`,
      },
      {
        id: 'cards',
        label: 'Visa / Mastercard',
        sub: 'Cartão aceite',
        icon: `<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="18" cy="16" r="8" fill="#EA4335" opacity=".7"/>
      <circle cx="30" cy="16" r="8" fill="#FBBC05" opacity=".7"/>
    </svg>`,
      },
    ];

    function buildSealsBar() {
      const bar = document.createElement('div');
      bar.id = 'aq-trust-seals';

      const inner = document.createElement('div');
      inner.className = 'aq-seals-inner';

      SEALS.forEach(seal => {
        const item = document.createElement('div');
        item.className = `aq-seal-item aq-seal-${seal.id}`;
        item.innerHTML = `
      <div class="aq-seal-icon">${seal.icon}</div>
      <div class="aq-seal-text">
        <strong>${seal.label}</strong>
        <span>${seal.sub}</span>
      </div>
    `;
        inner.appendChild(item);
      });

      bar.appendChild(inner);
      return bar;
    }

    function build() {
      if (document.getElementById('aq-trust-seals')) return true;

      const footer = document.querySelector('footer, #footer, .footer');
      if (!footer) return false;

      // Tentar inserir antes do copyright; se não existir, appenda ao footer
      const copyright = footer.querySelector(
        '.copyright, .footer-bottom, .footer-copyright, [class*="copyright"]'
      );

      const bar = buildSealsBar();

      if (copyright) {
        footer.insertBefore(bar, copyright);
      } else {
        footer.appendChild(bar);
      }

      console.log('[AQ] Trust seals injetados');
      return true;
    }

    function initTrustSeals() {
      if (build()) return;

      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (build() || attempts >= 20) clearInterval(interval);
      }, 300);
    }

    /**
     * storeSection.js – v3
     * Exporta buildStoreSection() para uso pelo homeOrchestrator.
     */

    const MAPS_URL   = 'https://maps.app.goo.gl/6uvfMJofFLiB5yZi6';
    const REVIEW_URL = 'https://maps.app.goo.gl/6uvfMJofFLiB5yZi6';
    const MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.6698765065166!2d-9.31225998837219!3d38.72538765671719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1ecf2d390fc4f5%3A0xf717a596f0307179!2sAquariumlife!5e0!3m2!1spt-PT!2spt!4v1778773494142!5m2!1spt-PT!2spt';

    function starSVG() {
      return `<svg viewBox="0 0 24 24" class="aq-star filled" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/></svg>`;
    }

    function buildStoreSection() {
      if (document.getElementById('aq-store')) return null;

      const section = document.createElement('section');
      section.id = 'aq-store';

      section.innerHTML = `
    <div class="aq-store-inner">
      <div class="aq-store-map">
        <iframe
          src="${MAPS_EMBED}"
          width="100%" height="100%"
          style="border:0;" allowfullscreen="" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Localização Aquariumlife no Google Maps"
        ></iframe>
      </div>
      <div class="aq-store-info">
        <div class="aq-section-header aq-store-header">
          <span class="aq-section-tag">Loja Física</span>
          <h2 class="aq-section-title">Visita-nos <span class="aq-neon">Pessoalmente</span></h2>
          <p class="aq-section-sub">Vem conhecer o nosso espaço, ver os produtos ao vivo e receber aconselhamento especializado da nossa equipa.</p>
        </div>
        <ul class="aq-store-details">
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>Rinchoa, Rio de Mouro — Sintra, Portugal</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <span>Horários disponíveis no nosso perfil Google</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.92z"/></svg>
            <span>Atendimento presencial e online</span>
          </li>
        </ul>
        <div class="aq-store-ctas">
          <a href="${MAPS_URL}" target="_blank" rel="noopener noreferrer" class="aq-btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Como chegar
          </a>
          <a href="${REVIEW_URL}" target="_blank" rel="noopener noreferrer" class="aq-btn-outline aq-btn-review">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Avaliar no Google
          </a>
        </div>
        <div class="aq-google-rating">
          <div class="aq-rating-badge">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="aq-google-logo" aria-hidden="true">
              <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.2z"/>
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.9 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.6v6.2C6.6 43.2 14.7 48 24 48z"/>
              <path fill="#FBBC05" d="M10.8 28.8c-.5-1.4-.7-2.8-.7-4.3s.3-2.9.7-4.3v-6.2H2.6C.9 17.3 0 20.6 0 24s.9 6.7 2.6 9.5l8.2-4.7z"/>
              <path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.4 30.4 0 24 0 14.7 0 6.6 4.8 2.6 12.5l8.2 4.7c1.9-5.6 7.1-9.7 13.2-9.7z"/>
            </svg>
            <div class="aq-rating-info">
              <div class="aq-rating-stars">${starSVG()}${starSVG()}${starSVG()}${starSVG()}${starSVG()}</div>
              <span class="aq-rating-text">Avalia-nos no Google</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

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
        a: 'Claro! Temos loja física em Sintra onde podes ver os produtos ao vivo, pedir aconselhamento especializado e até trazer o teu aquário para diagnóstico. Consulta o nosso Google Maps para morada e horários.' },
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
     * homeOrchestrator.js – v6
     * Oculta secções nativas do Shopkit e injeta as nossas em ordem.
     */


    // Seletores das secções nativas do Shopkit a ocultar
    const NATIVE_SECTIONS = [
      'section.brands-block',
      'section.brands.section',
      '[data-section-type="blog"]',
      'section.blog-section',
      '.blog-posts-section',
      '.section-blog',
      '#blog',
    ];

    function hideNativeSections() {
      NATIVE_SECTIONS.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          el.style.setProperty('display', 'none', 'important');
          console.log('[AQ] ocultado nativo:', sel);
        });
      });
    }

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
      // Oculta secções nativas antes de injetar as nossas
      hideNativeSections();

      // Observa o DOM para ocultar secções nativas que apareçam depois
      const obs = new MutationObserver(() => hideNativeSections());
      obs.observe(document.body, { childList: true, subtree: true });
      // Para o observer após 5s (já não é necessário)
      setTimeout(() => obs.disconnect(), 5000);

      // 1. Marcas
      try {
        const brands = await buildBrandsSection();
        append(brands, 'aq-brands');
      } catch(e) { console.warn('[AQ] brands erro:', e); }

      // 2. Loja
      try {
        append(buildStoreSection(), 'aq-store');
      } catch(e) { console.warn('[AQ] store erro:', e); }

      // 3. FAQ
      try {
        append(buildFAQSection(), 'aq-faq');
      } catch(e) { console.warn('[AQ] faq erro:', e); }

      // 4. Blog
      try {
        const blog = await buildBlogSection();
        append(blog, 'aq-blog-home');
      } catch(e) { console.warn('[AQ] blog erro:', e); }

      console.log('[AQ] Home completa: brands → store → faq → blog');
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

      // Redesign de /blog e post individual (não faz nada na home)
      initBlogSection();

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

})();
