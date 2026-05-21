// categoryFilters.js v5
// - Dropdown de categorias criado do zero em qualquer page-category
// - Pre-selecciona a categoria da URL actual
// - Slider filtra .products-list filhos diretos por data-id

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
// Dropdown de categorias
// Cria o elemento se nao existir (ex: /category/alimentacao nao tem
// o dropdown nativo porque nao tem subcategorias)
// ----------------------------------------------------------------
async function rebuildCategoryDropdown() {
  const filtersSorting = document.querySelector('.filters-sorting');
  if (!filtersSorting) return;

  // Categoria activa: extraida da URL
  const currentHandle = window.location.pathname
    .replace(/^\/category\//, '')
    .replace(/\/$/, '');

  // Carregar categorias do JSON estatico
  let cats = [];
  try {
    const res = await fetch(`https://cdn.jsdelivr.net/gh/${REPO}@main/${JSON_CATS}`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    cats = data.categories || [];
  } catch (e) {
    console.warn('[AQ] Erro ao carregar categorias:', e);
    return;
  }

  // Determinar label da categoria activa
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

  // Remover dropdown nativo de categoria se existir (vamos substituir)
  const nativeCatDrop = document.querySelector('.dropdown.filter[data-type="category"]');
  if (nativeCatDrop) nativeCatDrop.remove();

  // Ocultar dropdown nativo de preco
  const nativePriceDrop = document.querySelector('.dropdown.filter[data-type="price"]');
  if (nativePriceDrop) nativePriceDrop.style.display = 'none';

  // Construir o novo dropdown
  const dropWrap = document.createElement('div');
  dropWrap.className = 'dropdown filter aq-cat-dropdown';
  dropWrap.setAttribute('data-type', 'category');

  dropWrap.innerHTML = `
    <a class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      ${activeLabel}
    </a>
    <div class="dropdown-menu"></div>
  `;

  const menu = dropWrap.querySelector('.dropdown-menu');

  // "Todas" — aponta para equipamento (maior categoria)
  const allItem = document.createElement('a');
  allItem.className = 'dropdown-item' + (currentHandle === 'equipamento' ? ' active' : '');
  allItem.href = '/category/equipamento';
  allItem.textContent = 'Todas';
  menu.appendChild(allItem);

  const sep = document.createElement('div');
  sep.style.cssText = 'height:1px;background:rgba(8,238,188,0.1);margin:4px 6px;';
  menu.appendChild(sep);

  cats.forEach(cat => {
    const isActive = currentHandle === cat.handle;
    const item = document.createElement('a');
    item.className = 'dropdown-item' + (isActive ? ' active' : '');
    item.href = cat.url;
    item.textContent = cat.title;
    menu.appendChild(item);

    (cat.children || []).forEach(ch => {
      const chActive = currentHandle === ch.handle;
      const child = document.createElement('a');
      child.className = 'dropdown-item' + (chActive ? ' active' : '');
      child.href = ch.url;
      child.style.paddingLeft = '22px';
      child.textContent = '↳ ' + ch.title;
      menu.appendChild(child);
    });
  });

  // Toggle manual (Bootstrap dropdown pode nao estar a funcionar para elementos injectados)
  const toggle = dropWrap.querySelector('.dropdown-toggle');
  toggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !expanded);
    menu.classList.toggle('show', !expanded);
    if (!expanded) {
      const close = () => {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('show');
        document.removeEventListener('click', close);
      };
      setTimeout(() => document.addEventListener('click', close), 0);
    }
  });

  // Inserir antes do .filters-wrap (ou no inicio do .filters-sorting)
  const filtersWrap = filtersSorting.querySelector('.filters-wrap');
  if (filtersWrap) {
    filtersSorting.insertBefore(dropWrap, filtersWrap);
  } else {
    filtersSorting.insertBefore(dropWrap, filtersSorting.firstChild);
  }
}

// ----------------------------------------------------------------
// Slider de preco — hide/show colunas nativas por data-id
// ----------------------------------------------------------------
function injectPriceSlider() {
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

  // Inserir antes do .filters-wrap
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

  let allProducts = null;
  let globalMin = 0, globalMax = 370;
  let currentMin = 0, currentMax = 370;
  let applyTimer = null;

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

      let visible = 0;
      Array.from(list.children).forEach(col => {
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
      const res = await fetch(`https://cdn.jsdelivr.net/gh/${REPO}@main/${JSON_PRODS}`);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();

      allProducts = data.products;
      globalMin   = Math.round(data.min * 10) / 10;
      globalMax   = Math.ceil(data.max);
      currentMin  = globalMin;
      currentMax  = globalMax;

      [minInput, maxInput].forEach(inp => {
        inp.min = globalMin; inp.max = globalMax; inp.step = '0.5';
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
