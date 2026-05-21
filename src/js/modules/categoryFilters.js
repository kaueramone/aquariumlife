// categoryFilters.js v2
// Carrega produtos de JSON estatico no jsDelivr (sem CORS)
// Slider 0.50EUR-370EUR, loader no grid, filtra sem reload

const REPO = 'kaueramone/aquariumlife';
const JSON_FILE = 'dist/products-cat-527348.json';

export function initCategoryFilters() {
  if (!document.body.classList.contains('page-category')) return;
  const catId = getCategoryId();
  if (!catId) return;

  const ready = () => {
    injectPriceSlider(catId);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    setTimeout(ready, 150);
  }
}

function getCategoryId() {
  const m = document.body.className.match(/category-id-(\d+)/);
  return m ? m[1] : null;
}

// ----------------------------------------------------------------
// Loader no grid de produtos
// ----------------------------------------------------------------
function showGridLoader() {
  const grid = getProductsContainer();
  if (!grid) return;
  grid.style.opacity = '0.4';
  grid.style.pointerEvents = 'none';

  let loader = document.getElementById('aq-grid-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'aq-grid-loader';
    loader.innerHTML = `
      <div class="aq-loader-spinner"></div>
      <span>A filtrar...</span>
    `;
    grid.parentElement.style.position = 'relative';
    grid.parentElement.appendChild(loader);
  }
  loader.style.display = 'flex';
}

function hideGridLoader() {
  const grid = getProductsContainer();
  if (grid) {
    grid.style.opacity = '';
    grid.style.pointerEvents = '';
  }
  const loader = document.getElementById('aq-grid-loader');
  if (loader) loader.style.display = 'none';
}

function getProductsContainer() {
  return document.querySelector('.products.section .row') ||
         document.querySelector('.products-list') ||
         document.querySelector('.products .row');
}

// ----------------------------------------------------------------
// Slider de preco
// ----------------------------------------------------------------
function injectPriceSlider(catId) {
  const priceDropdown = document.querySelector('.dropdown.filter[data-type="price"]');
  if (!priceDropdown) return;

  // Ocultar dropdown nativo
  priceDropdown.style.display = 'none';

  const wrap = document.createElement('div');
  wrap.id = 'aq-price-filter';
  wrap.innerHTML = `
    <div class="aq-pf-label">
      <span class="aq-pf-title">Preco</span>
      <span class="aq-pf-range" id="aq-pf-range">0&#8364; &ndash; 370&#8364;</span>
    </div>
    <div class="aq-pf-track-wrap">
      <div class="aq-pf-track">
        <div class="aq-pf-fill" id="aq-pf-fill"></div>
      </div>
      <input type="range" id="aq-pf-min" min="0" max="370" value="0" step="1">
      <input type="range" id="aq-pf-max" min="0" max="370" value="370" step="1">
    </div>
    <div class="aq-pf-status" id="aq-pf-status">A carregar produtos...</div>
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

  let allProducts = null;
  let globalMin = 0;
  let globalMax = 370;
  let currentMin = 0;
  let currentMax = 370;
  let applyTimer = null;
  let isFiltered = false;

  function updateFill() {
    const pct = (v) => ((v - globalMin) / (globalMax - globalMin)) * 100;
    fill.style.left = pct(currentMin) + '%';
    fill.style.width = (pct(currentMax) - pct(currentMin)) + '%';
  }

  function updateLabel() {
    rangeLabel.textContent = currentMin.toFixed(2).replace('.', ',') + '€ – ' + currentMax.toFixed(2).replace('.', ',') + '€';
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
    clearTimeout(applyTimer);
    applyTimer = setTimeout(() => applyFilter(), 400);
  }

  function applyFilter() {
    if (!allProducts) {
      status.textContent = 'Ainda a carregar...';
      return;
    }

    const filtered = allProducts.filter(p => p.price >= currentMin && p.price <= currentMax);
    isFiltered = true;
    renderProducts(filtered);
  }

  function renderProducts(products) {
    showGridLoader();

    // Pequeno delay para o loader aparecer antes do render
    setTimeout(() => {
      const container = getProductsContainer();
      if (!container) { hideGridLoader(); return; }

      container.innerHTML = '';

      if (!products.length) {
        container.innerHTML = `
          <div style="flex:1;text-align:center;padding:60px 20px;color:rgba(255,255,255,0.5);font-family:'Open Sans',sans-serif;width:100%;">
            <i class="fas fa-search" style="font-size:2rem;margin-bottom:12px;display:block;opacity:0.3;"></i>
            Nenhum produto neste intervalo de preco.
          </div>`;
        hideGridLoader();
        status.textContent = '0 produtos';
        return;
      }

      const noImg = 'https://cdn-shopkit.com/assets/store/img/no-img.png';

      products.forEach(p => {
        const priceHTML = p.pp
          ? `<del style="opacity:0.5;font-size:0.82em;margin-right:4px;">${p.pf}</del><span class="price" style="color:#08EEBC;">${p.ppf}</span>`
          : `<span class="price">${p.pf}</span>`;

        const col = document.createElement('div');
        col.className = 'col-6 col-sm-4 col-md-4';
        col.innerHTML = `
          <div class="product active hover-effect-floating fade-in-on-scroll" data-id="${p.id}">
            <div class="card-shadow-hover">
              <div class="product-view">
                <span class="product-badges" data-position="top-left"></span>
                <a class="product-preview" href="${p.url}" data-thumbnail-type="square">
                  <img class="product-pic" src="${p.img || noImg}" alt="${p.title}" loading="lazy">
                </a>
                <div class="product-info">
                  <a class="product-title" href="${p.url}">${p.title}</a>
                  <div class="product-price">${priceHTML}</div>
                </div>
                <div class="product-actions">
                  <a class="btn btn-primary" href="${p.cart}">Comprar</a>
                </div>
              </div>
            </div>
          </div>`;
        container.appendChild(col);
      });

      hideGridLoader();
      status.textContent = products.length + ' produto' + (products.length !== 1 ? 's' : '');

      // Trigger animacoes
      setTimeout(() => {
        container.querySelectorAll('.fade-in-on-scroll').forEach(el => el.classList.add('is-visible'));
      }, 50);
    }, 80);
  }

  // Carregar JSON estatico via jsDelivr (sem CORS)
  async function loadProducts() {
    try {
      // Usar o hash mais recente via @latest -- jsDelivr resolve automaticamente
      const url = `https://cdn.jsdelivr.net/gh/${REPO}@main/${JSON_FILE}?t=${Date.now()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();

      allProducts = data.products;
      globalMin = Math.floor(data.min * 10) / 10;
      globalMax = Math.ceil(data.max);

      // Atualizar slider com valores reais
      minInput.min = globalMin;
      minInput.max = globalMax;
      minInput.value = globalMin;
      minInput.step = '0.5';
      maxInput.min = globalMin;
      maxInput.max = globalMax;
      maxInput.value = globalMax;
      maxInput.step = '0.5';
      currentMin = globalMin;
      currentMax = globalMax;

      updateFill();
      updateLabel();
      status.textContent = data.total + ' produtos';

    } catch (e) {
      console.warn('[AQ] Erro ao carregar produtos:', e);
      status.textContent = '';
    }
  }

  minInput.addEventListener('input', onSliderInput);
  maxInput.addEventListener('input', onSliderInput);
  minInput.addEventListener('change', onSliderChange);
  maxInput.addEventListener('change', onSliderChange);

  updateFill();
  loadProducts();
}
