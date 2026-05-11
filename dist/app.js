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
     * cartStyles.js
     * Aplica o tema escuro ao popup do carrinho via JS (inline styles)
     * e injeta badge com número no ícone do carrinho.
     * Necessário porque o Shopkit usa inline style="background:#fff" no popup.
     */

    // ── Tema escuro no popup ─────────────────────────────────────
    function applyDarkCart(popup) {
      if (!popup || popup.dataset.aqStyled === '1') return;
      popup.dataset.aqStyled = '1';

      const s = popup.style;
      s.setProperty('background',       '#001531',                            'important');
      s.setProperty('background-color', '#001531',                            'important');
      s.setProperty('border',           '1px solid rgba(8,238,188,0.25)',     'important');
      s.setProperty('border-radius',    '14px',                               'important');
      s.setProperty('box-shadow',       '0 20px 50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(8,238,188,0.1)', 'important');
      s.setProperty('overflow',         'hidden',                             'important');
      s.setProperty('color',            '#fff',                               'important');

      // Item linha
      popup.querySelectorAll('.cart-item').forEach(el => {
        el.style.setProperty('border-bottom', '1px solid rgba(8,238,188,0.08)', 'important');
        el.style.setProperty('background',    'transparent',                    'important');
      });

      // Imagem produto
      popup.querySelectorAll('.item-image img').forEach(el => {
        el.style.setProperty('border-radius', '8px',                          'important');
        el.style.setProperty('background',    'rgba(0,8,20,0.6)',              'important');
        el.style.setProperty('border',        '1px solid rgba(8,238,188,0.15)','important');
        el.style.setProperty('padding',       '4px',                           'important');
      });

      // Nome produto
      popup.querySelectorAll('.item-product').forEach(el => {
        el.style.setProperty('color',       '#cde4f8', 'important');
        el.style.setProperty('font-weight', '500',     'important');
      });

      // Preço item
      popup.querySelectorAll('.details .price').forEach(el => {
        el.style.setProperty('color',       '#08EEBC', 'important');
        el.style.setProperty('font-weight', '700',     'important');
      });

      // Botão remover (lixo)
      popup.querySelectorAll('a.remove').forEach(el => {
        el.style.setProperty('background',    'transparent',                    'important');
        el.style.setProperty('border',        '1px solid rgba(8,238,188,0.2)', 'important');
        el.style.setProperty('border-radius', '50%',                            'important');
        el.style.setProperty('color',         '#08EEBC',                        'important');
        el.style.setProperty('width',         '30px',                           'important');
        el.style.setProperty('height',        '30px',                           'important');
        el.style.setProperty('display',       'flex',                           'important');
        el.style.setProperty('align-items',   'center',                         'important');
        el.style.setProperty('justify-content','center',                        'important');
        el.style.setProperty('box-shadow',    'none',                           'important');
        // SVG dentro do botão remover
        el.querySelectorAll('svg path, svg').forEach(p => {
          p.style.setProperty('fill', '#08EEBC', 'important');
        });
      });

      // Área total
      const totalRow = popup.querySelector('.cart-total');
      if (totalRow) {
        totalRow.style.setProperty('background',    'rgba(8,238,188,0.03)',          'important');
        totalRow.style.setProperty('border-top',    '1px solid rgba(8,238,188,0.1)', 'important');
        totalRow.style.setProperty('padding',       '12px 16px',                     'important');
        totalRow.style.setProperty('display',       'flex',                          'important');
        totalRow.style.setProperty('justify-content','space-between',                'important');
        totalRow.style.setProperty('align-items',   'center',                        'important');

        const texts = totalRow.querySelectorAll('.cart-total-text');
        if (texts[0]) { // "Total:" label
          texts[0].style.setProperty('color',       'rgba(255,255,255,0.6)', 'important');
          texts[0].style.setProperty('font-size',   '0.8rem',                'important');
          texts[0].style.setProperty('font-weight', '500',                   'important');
          texts[0].style.setProperty('text-transform','uppercase',           'important');
          texts[0].style.setProperty('letter-spacing','1px',                 'important');
        }
        if (texts[1]) { // valor
          texts[1].style.setProperty('color',       '#08EEBC', 'important');
          texts[1].style.setProperty('font-size',   '1.15rem', 'important');
          texts[1].style.setProperty('font-weight', '700',     'important');
        }
      }

      // Área de botões
      const btns = popup.querySelector('.cart-btns');
      if (btns) {
        btns.style.setProperty('background',       'transparent', 'important');
        btns.style.setProperty('padding',          '12px 16px 16px', 'important');
        btns.style.setProperty('display',          'flex',      'important');
        btns.style.setProperty('flex-direction',   'row',       'important');
        btns.style.setProperty('gap',              '8px',       'important');
      }

      popup.querySelectorAll('.cart-btn').forEach(btn => {
        btn.style.setProperty('background',        'transparent',              'important');
        btn.style.setProperty('background-image',  'none',                     'important');
        btn.style.setProperty('border',            '1.5px solid #08EEBC',      'important');
        btn.style.setProperty('border-radius',     '6px',                      'important');
        btn.style.setProperty('color',             '#08EEBC',                  'important');
        btn.style.setProperty('box-shadow',        'none',                     'important');
        btn.style.setProperty('text-shadow',       'none',                     'important');
        btn.style.setProperty('width',             '100%',                     'important');
        btn.style.setProperty('padding',           '11px 20px',                'important');
        btn.style.setProperty('font-size',         '0.72rem',                  'important');
        btn.style.setProperty('font-weight',       '700',                      'important');
        btn.style.setProperty('text-transform',    'uppercase',                'important');
        btn.style.setProperty('letter-spacing',    '1.8px',                    'important');
        btn.style.setProperty('text-decoration',   'none',                     'important');
        btn.style.setProperty('display',           'flex',                     'important');
        btn.style.setProperty('align-items',       'center',                   'important');
        btn.style.setProperty('justify-content',   'center',                   'important');

        btn.addEventListener('mouseenter', () => {
          btn.style.setProperty('background', '#08EEBC', 'important');
          btn.style.setProperty('color',      '#001531', 'important');
          btn.style.setProperty('box-shadow', '0 0 16px rgba(8,238,188,0.4)', 'important');
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.setProperty('background', 'transparent', 'important');
          btn.style.setProperty('color',      '#08EEBC',     'important');
          btn.style.setProperty('box-shadow', 'none',        'important');
        });
      });

      console.log('[AQ] Cart popup dark theme applied');
    }

    function scanAndStyle() {
      document.querySelectorAll('.cart-list').forEach(applyDarkCart);
    }

    // ── Badge com número ─────────────────────────────────────────
    function updateBadge() {
      const link = document.querySelector('.link-cart');
      if (!link) return;

      let count = 0;

      // 1. data-count / data-qty no próprio link
      const raw = link.dataset.count ?? link.dataset.qty ?? link.dataset.cartCount;
      if (raw !== undefined) {
        count = parseInt(raw, 10) || 0;
      }

      // 2. Elemento filho com texto de contagem
      if (!count) {
        const el = link.querySelector('.count, .qty, [class*="count"], [class*="qty"]');
        if (el) count = parseInt(el.textContent.trim(), 10) || 0;
      }

      // 3. Fallback: contar .cart-item no popup aberto
      if (!count) {
        const items = document.querySelectorAll('.cart-list .cart-item');
        count = items.length;
      }

      const hasProducts = link.classList.contains('has-products') || count > 0;

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

      badge.textContent = count > 0 ? String(count) : '';
    }

    function initCartStyles() {
      // Estilizar popup existente
      scanAndStyle();

      // Observar quando o popup aparece ou muda
      new MutationObserver((mutations) => {
        mutations.forEach(m => {
          m.addedNodes.forEach(node => {
            if (node.nodeType !== 1) return;
            if (node.classList?.contains('cart-list')) applyDarkCart(node);
            node.querySelectorAll?.('.cart-list').forEach(applyDarkCart);
          });
          // Também re-estilizar se atributos mudarem (Shopkit pode resetar)
          if (m.type === 'attributes' && m.target.classList?.contains('cart-list')) {
            applyDarkCart(m.target);
          }
        });
        // Badge
        updateBadge();
      }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'data-count', 'data-qty'] });

      // Badge inicial
      updateBadge();
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
