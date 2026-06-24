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

export function initCategoryFilters() {
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
