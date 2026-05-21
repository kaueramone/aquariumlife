// categoryFilters.js v4
// Fix: container = .products-list, col = .col, filtra todas as pages de categoria

const REPO       = 'kaueramone/aquariumlife';
const JSON_PRODS = 'dist/products-cat-527348.json';
const JSON_CATS  = 'dist/categories.json';

export function initCategoryFilters() {
  if (!document.body.classList.contains('page-category')) return;

  const ready = () => {
    rebuildCategoryDropdown();
    injectPriceSlider();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    setTimeout(ready, 200);
  }
}

// ----------------------------------------------------------------
// Container de produtos
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
    list.parentElement.style.position = 'relative';
    list.parentElement.appendChild(loader);
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
// Dropdown de categorias — reconstruido com todas as categorias
// Funciona em qualquer pagina /category/*
// ----------------------------------------------------------------
async function rebuildCategoryDropdown() {
  const dropWrap = document.querySelector('.dropdown.filter[data-type="category"]');
  if (!dropWrap) return;

  const currentHandle = window.location.pathname
    .replace(/^\/category\//, '')
    .replace(/\/$/, '');

  let cats = [];
  try {
    const url = `https://cdn.jsdelivr.net/gh/${REPO}@main/${JSON_CATS}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    cats = data.categories || [];
  } catch (e) {
    console.warn('[AQ] Erro ao carregar categorias:', e);
    return;
  }

  let menu = dropWrap.querySelector('.dropdown-menu');
  if (!menu) {
    menu = document.createElement('div');
    menu.className = 'dropdown-menu';
    dropWrap.appendChild(menu);
  }
  menu.innerHTML = '';

  // "Todas" aponta para equipamento (categoria mais completa)
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

  // Actualizar label do toggle
  const toggle = dropWrap.querySelector('.dropdown-toggle');
  if (toggle) {
    const active = menu.querySelector('.dropdown-item.active');
    const label = active
      ? active.textContent.replace(/^↳\s*/, '')
      : 'Categorias';
    toggle.childNodes.forEach(n => { if (n.nodeType === 3) n.remove(); });
    toggle.insertAdjacentText('beforeend', label);
  }
}

// ----------------------------------------------------------------
// Slider de preco — filtra .col filhos de .products-list por data-id
// ----------------------------------------------------------------
function injectPriceSlider() {
  const priceDropdown = document.querySelector('.dropdown.filter[data-type="price"]');
  if (priceDropdown) priceDropdown.style.display = 'none';

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
      <input type="range" id="aq-pf-min" min="0" max="370" value="0" step="0.5">
      <input type="range" id="aq-pf-max" min="0" max="370" value="370" step="0.5">
    </div>
    <div class="aq-pf-status" id="aq-pf-status">A carregar...</div>
  `;

  const filtersWrap = document.querySelector('.filters-wrap');
  if (filtersWrap) {
    filtersWrap.parentElement.insertBefore(wrap, filtersWrap);
  } else {
    const filtersSorting = document.querySelector('.filters-sorting');
    if (filtersSorting) filtersSorting.prepend(wrap);
  }

  const minInput   = document.getElementById('aq-pf-min');
  const maxInput   = document.getElementById('aq-pf-max');
  const rangeLabel = document.getElementById('aq-pf-range');
  const fill       = document.getElementById('aq-pf-fill');
  const status     = document.getElementById('aq-pf-status');

  let allProducts = null;
  let globalMin = 0;
  let globalMax = 370;
  let currentMin = 0;
  let currentMax = 370;
  let applyTimer = null;

  function fmt(v) {
    return v.toFixed(2).replace('.', ',') + '€';
  }

  function updateFill() {
    const range = globalMax - globalMin || 1;
    const left  = ((currentMin - globalMin) / range) * 100;
    const width = ((currentMax - currentMin) / range) * 100;
    fill.style.left  = left + '%';
    fill.style.width = Math.max(0, width) + '%';
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
    clearTimeout(applyTimer);
    applyTimer = setTimeout(applyFilter, 400);
  }

  function applyFilter() {
    if (!allProducts) { status.textContent = 'Ainda a carregar...'; return; }

    const filteredIds = new Set(
      allProducts
        .filter(p => p.price >= currentMin && p.price <= currentMax)
        .map(p => String(p.id))
    );

    showGridLoader();

    setTimeout(() => {
      const list = getProductsList();
      if (!list) { hideGridLoader(); return; }

      // Cada filho direto do .products-list e uma coluna .col
      const cols = Array.from(list.children);
      let visible = 0;

      cols.forEach(col => {
        // O produto esta dentro da coluna com data-id
        const prod = col.querySelector('[data-id]');
        const pid  = prod ? prod.getAttribute('data-id') : null;

        if (!pid || filteredIds.has(pid)) {
          col.style.display = '';
          visible++;
        } else {
          col.style.display = 'none';
        }
      });

      hideGridLoader();
      status.textContent = visible + ' produto' + (visible !== 1 ? 's' : '') + ' (página actual)';
    }, 80);
  }

  async function loadProducts() {
    try {
      const url = `https://cdn.jsdelivr.net/gh/${REPO}@main/${JSON_PRODS}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();

      allProducts = data.products;
      globalMin   = Math.round(data.min * 10) / 10;
      globalMax   = Math.ceil(data.max);
      currentMin  = globalMin;
      currentMax  = globalMax;

      [minInput, maxInput].forEach(inp => {
        inp.min  = globalMin;
        inp.max  = globalMax;
        inp.step = '0.5';
      });
      minInput.value = globalMin;
      maxInput.value = globalMax;

      updateFill();
      updateLabel();
      status.textContent = data.total + ' produtos (loja)';

    } catch (e) {
      console.warn('[AQ] Erro ao carregar produtos:', e);
      status.textContent = 'Erro ao carregar';
    }
  }

  minInput.addEventListener('input', onInput);
  maxInput.addEventListener('input', onInput);
  minInput.addEventListener('change', onSliderChange);
  maxInput.addEventListener('change', onSliderChange);

  updateFill();
  loadProducts();
}
