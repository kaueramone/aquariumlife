// categoryFilters.js
// Slider de preco client-side + layout igual para os 3 filtros
// Funciona em todas as paginas .page-category

export function initCategoryFilters() {
  if (!document.body.classList.contains('page-category')) return;

  // Aguardar nice-select estar pronto
  const ready = () => {
    injectPriceSlider();
    equalizeFilterLayout();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    // nice-select pode ainda nao ter corrido
    setTimeout(ready, 100);
  }
}

// ----------------------------------------------------------------
// Slider de preco
// ----------------------------------------------------------------
function injectPriceSlider() {
  const priceDropdown = document.querySelector('.dropdown.filter[data-type="price"]');
  if (!priceDropdown) return;

  // Ler precos dos produtos no DOM
  const products = Array.from(document.querySelectorAll('.product[data-id]'));
  const prices = products.map(p => {
    const el = p.querySelector('[class*="price"]');
    if (!el) return null;
    const val = parseFloat(el.textContent.replace(/[^\d,]/g, '').replace(',', '.'));
    return isNaN(val) ? null : val;
  }).filter(Boolean);

  if (!prices.length) return;

  const globalMin = Math.floor(Math.min(...prices));
  const globalMax = Math.ceil(Math.max(...prices));

  // Guardar preco em cada produto como data attr para filtrar depois
  products.forEach(p => {
    const el = p.querySelector('[class*="price"]');
    if (!el) return;
    const val = parseFloat(el.textContent.replace(/[^\d,]/g, '').replace(',', '.'));
    if (!isNaN(val)) p.dataset.aqPrice = val;
  });

  // Ocultar dropdown nativo de preco
  priceDropdown.style.display = 'none';

  // Criar slider custom
  const wrap = document.createElement('div');
  wrap.id = 'aq-price-filter';
  wrap.innerHTML = `
    <div class="aq-pf-label">
      <span class="aq-pf-title">Preco</span>
      <span class="aq-pf-range" id="aq-pf-range">${globalMin}€ – ${globalMax}€</span>
    </div>
    <div class="aq-pf-track-wrap">
      <div class="aq-pf-track">
        <div class="aq-pf-fill" id="aq-pf-fill"></div>
      </div>
      <input type="range" id="aq-pf-min" min="${globalMin}" max="${globalMax}" value="${globalMin}" step="1">
      <input type="range" id="aq-pf-max" min="${globalMin}" max="${globalMax}" value="${globalMax}" step="1">
    </div>
  `;

  // Inserir antes do filters-wrap
  const filtersWrap = document.querySelector('.filters-wrap');
  if (filtersWrap) {
    filtersWrap.parentElement.insertBefore(wrap, filtersWrap);
  }

  const minInput = document.getElementById('aq-pf-min');
  const maxInput = document.getElementById('aq-pf-max');
  const rangeLabel = document.getElementById('aq-pf-range');
  const fill = document.getElementById('aq-pf-fill');

  function updateSlider() {
    let minVal = parseInt(minInput.value);
    let maxVal = parseInt(maxInput.value);

    // Garantir que min nao ultrapassa max
    if (minVal > maxVal - 1) {
      minVal = maxVal - 1;
      minInput.value = minVal;
    }

    // Atualizar fill
    const pct = (v) => ((v - globalMin) / (globalMax - globalMin)) * 100;
    fill.style.left = pct(minVal) + '%';
    fill.style.width = (pct(maxVal) - pct(minVal)) + '%';

    // Atualizar label
    rangeLabel.textContent = minVal + '€ – ' + maxVal + '€';

    // Filtrar produtos
    products.forEach(p => {
      const price = parseFloat(p.dataset.aqPrice || '0');
      if (price >= minVal && price <= maxVal) {
        p.style.display = '';
      } else {
        p.style.display = 'none';
      }
    });
  }

  minInput.addEventListener('input', updateSlider);
  maxInput.addEventListener('input', updateSlider);

  // Init
  updateSlider();
}

// ----------------------------------------------------------------
// Layout igual para os 3 elementos da barra
// ----------------------------------------------------------------
function equalizeFilterLayout() {
  const sortingEl = document.querySelector('.filters-sorting');
  const filtersWrap = document.querySelector('.filters-wrap.js-filters-wrap');
  const filtersField = document.querySelector('.filters-field');
  const priceFilter = document.getElementById('aq-price-filter');

  if (!sortingEl) return;

  // Aplicar flex igual nos 3 blocos
  [priceFilter, filtersWrap, filtersField].forEach(el => {
    if (!el) return;
    el.style.flex = '1';
    el.style.minWidth = '0';
  });

  // O botao "Filtros" (mobile) nao deve ocupar espaco igual
  const filtersOpen = document.querySelector('.filters-open.js-filters-open');
  if (filtersOpen) {
    filtersOpen.style.flex = '0 0 auto';
  }
}
