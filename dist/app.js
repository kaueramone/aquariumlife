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
    function build() {
      const t = hideProductsTitle();
      const m = moveComprarButtons();
      const v = injectVerTodos();
      return t && m && v;
    }

    function initProductsSection() {
      if (build()) return;

      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (build() || attempts >= 25) clearInterval(interval);
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

    // JS Entry Point for AquariumLife Custom Layer


    function init() {
      initAnimations();
      injectMenuIcons();
      buildDesktopNav();
      initCategorySection();
      initProductsSection();
      initCartStyles();
      console.log('[AQ] Premium Layer Loaded — readyState:', document.readyState);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

})();
