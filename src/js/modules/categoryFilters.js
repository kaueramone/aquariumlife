// categoryFilters.js
// Slider de preco com dados reais da API Shopkit
// Carrega todos os produtos da categoria em background, filtra sem reload

const API_KEY = '8b7fe50a1dc3989465fadc39b7def6994c3d75fb';
const PRICE_MIN_GLOBAL = 0.5;
const PRICE_MAX_GLOBAL = 370;

export function initCategoryFilters() {
  if (!document.body.classList.contains('page-category')) return;

  const ready = () => {
    const catId = getCategoryId();
    if (!catId) return;

    injectPriceSlider(catId);
    equalizeFilterLayout();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    setTimeout(ready, 150);
  }
}

// Extrair category ID do body class (ex: category-id-527348)
function getCategoryId() {
  const match = document.body.className.match(/category-id-(\d+)/);
  return match ? match[1] : null;
}

// ----------------------------------------------------------------
// Slider de preco
// ----------------------------------------------------------------
function injectPriceSlider(catId) {
  const priceDropdown = document.querySelector('.dropdown.filter[data-type="price"]');
  if (!priceDropdown) return;

  // Ocultar dropdown nativo
  priceDropdown.style.display = 'none';

  // Criar slider com range global
  const wrap = document.createElement('div');
  wrap.id = 'aq-price-filter';
  wrap.innerHTML = `
    <div class="aq-pf-label">
      <span class="aq-pf-title">Preco</span>
      <span class="aq-pf-range" id="aq-pf-range">${PRICE_MIN_GLOBAL.toFixed(0)}&#8364; &ndash; ${PRICE_MAX_GLOBAL.toFixed(0)}&#8364;</span>
    </div>
    <div class="aq-pf-track-wrap">
      <div class="aq-pf-track">
        <div class="aq-pf-fill" id="aq-pf-fill"></div>
      </div>
      <input type="range" id="aq-pf-min" min="${PRICE_MIN_GLOBAL}" max="${PRICE_MAX_GLOBAL}" value="${PRICE_MIN_GLOBAL}" step="0.5">
      <input type="range" id="aq-pf-max" min="${PRICE_MIN_GLOBAL}" max="${PRICE_MAX_GLOBAL}" value="${PRICE_MAX_GLOBAL}" step="0.5">
    </div>
    <div class="aq-pf-status" id="aq-pf-status"></div>
  `;

  const filtersWrap = document.querySelector('.filters-wrap');
  if (filtersWrap) {
    filtersWrap.parentElement.insertBefore(wrap, filtersWrap);
  }

  const minInput = document.getElementById('aq-pf-min');
  const maxInput = document.getElementById('aq-pf-max');
  const rangeLabel = document.getElementById('aq-pf-range');
  const fill = document.getElementById('aq-pf-fill');
  const status = document.getElementById('aq-pf-status');

  // Estado
  let allProducts = null; // null = ainda a carregar
  let currentMin = PRICE_MIN_GLOBAL;
  let currentMax = PRICE_MAX_GLOBAL;
  let applyTimer = null;

  // Guardar grid original para restaurar
  const productsGrid = document.querySelector('.products.section, .products-list, [class*="products-grid"], .main .row');

  function updateFill() {
    const pct = (v) => ((v - PRICE_MIN_GLOBAL) / (PRICE_MAX_GLOBAL - PRICE_MIN_GLOBAL)) * 100;
    fill.style.left = pct(currentMin) + '%';
    fill.style.width = (pct(currentMax) - pct(currentMin)) + '%';
  }

  function updateLabel() {
    rangeLabel.textContent = currentMin.toFixed(0) + '€ – ' + currentMax.toFixed(0) + '€';
  }

  function onSliderInput() {
    currentMin = parseFloat(minInput.value);
    currentMax = parseFloat(maxInput.value);
    if (currentMin > currentMax - 1) {
      currentMin = currentMax - 1;
      minInput.value = currentMin;
    }
    updateFill();
    updateLabel();
  }

  function onSliderChange() {
    // Ao soltar -- aplicar filtro
    clearTimeout(applyTimer);
    applyTimer = setTimeout(() => applyFilter(), 300);
  }

  function applyFilter() {
    if (!allProducts) {
      // Ainda a carregar -- aguardar
      status.textContent = 'A carregar produtos...';
      status.style.display = 'block';
      return;
    }
    const filtered = allProducts.filter(p => p.price >= currentMin && p.price <= currentMax);
    renderProducts(filtered);
  }

  function renderProducts(products) {
    // Encontrar o container dos produtos
    const grid = document.querySelector('.products.section');
    if (!grid) return;

    const container = grid.querySelector('.row, .products-grid, ul');
    if (!container) return;

    // Limpar e reinjetar
    container.innerHTML = '';

    if (!products.length) {
      container.innerHTML = '<div class="col-12" style="text-align:center;padding:60px 20px;color:rgba(255,255,255,0.5);font-family:Open Sans,sans-serif;">Nenhum produto neste intervalo de preco.</div>';
      status.style.display = 'none';
      return;
    }

    products.forEach(p => {
      const priceDisplay = p.price_promo
        ? `<del style="opacity:0.5;font-size:0.85em;">${p.price_formatted}</del> <span class="price">${p.price_promo_formatted}</span>`
        : `<span class="price">${p.price_formatted}</span>`;

      const imgUrl = p.image_square || 'https://cdn-shopkit.com/assets/store/img/no-img.png';

      const col = document.createElement('div');
      col.className = 'col-6 col-sm-4 col-md-4 col-lg-4';
      col.innerHTML = `
        <div class="product active hover-effect-floating fade-in-on-scroll" data-id="${p.id}">
          <div class="card-shadow-hover">
            <div class="product-view">
              <a class="product-preview" href="${p.url}" data-thumbnail-type="square">
                <img class="product-pic" src="${imgUrl}" alt="${p.title}">
              </a>
              <div class="product-info">
                <a class="product-title" href="${p.url}">${p.title}</a>
                <div class="product-price">${priceDisplay}</div>
              </div>
              <div class="product-actions">
                <a class="btn btn-primary add-cart" href="${p.add_cart_url}">Comprar</a>
              </div>
            </div>
          </div>
        </div>
      `;
      container.appendChild(col);
    });

    status.textContent = filtered.length + ' produto' + (filtered.length !== 1 ? 's' : '');
    status.style.display = 'block';

    // Re-aplicar animacoes
    setTimeout(() => {
      container.querySelectorAll('.fade-in-on-scroll').forEach(el => el.classList.add('is-visible'));
    }, 50);
  }

  // Referencia para applyFilter apos carregar
  let filtered = [];

  // Carregar todos os produtos da API em background
  async function loadAllProducts(catId) {
    status.textContent = 'A carregar...';
    status.style.display = 'block';

    try {
      const products = [];
      let page = 1;
      const baseUrl = `https://api.shopk.it/v1/product?category=${catId}&limit=50`;

      while (true) {
        const res = await fetch(`${baseUrl}&page=${page}`, {
          headers: { 'X-API-KEY': API_KEY }
        });
        if (!res.ok) break;
        const data = await res.json();
        const items = Object.entries(data)
          .filter(([k]) => !isNaN(k))
          .map(([, v]) => v)
          .filter(v => v.status === 1);

        if (!items.length) break;

        items.forEach(p => {
          products.push({
            id: p.id,
            title: p.title,
            price: p.price || 0,
            price_formatted: p.price_formatted,
            price_promo: p.price_promo,
            price_promo_formatted: p.price_promo_formatted,
            url: p.url,
            add_cart_url: p.add_cart_url,
            image_square: p.image && p.image.square ? p.image.square : null
          });
        });

        if (!data.paging || !data.paging.next) break;
        page++;
      }

      allProducts = products;
      status.style.display = 'none';

      // Se o utilizador ja moveu o slider, aplicar agora
      if (currentMin > PRICE_MIN_GLOBAL || currentMax < PRICE_MAX_GLOBAL) {
        applyFilter();
      }
    } catch (e) {
      status.textContent = 'Erro ao carregar produtos.';
      console.warn('[AQ] categoryFilters API error:', e);
    }
  }

  minInput.addEventListener('input', onSliderInput);
  maxInput.addEventListener('input', onSliderInput);
  minInput.addEventListener('change', onSliderChange);
  maxInput.addEventListener('change', onSliderChange);

  updateFill();
  updateLabel();
  loadAllProducts(catId);
}

// ----------------------------------------------------------------
// Layout igual para os 3 elementos da barra
// ----------------------------------------------------------------
function equalizeFilterLayout() {
  const filtersOpen = document.querySelector('.filters-open.js-filters-open');
  if (filtersOpen) filtersOpen.style.flex = '0 0 auto';
}
