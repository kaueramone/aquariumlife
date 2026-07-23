// nativeVariants.js
// Melhorias em markup NATIVO do Shopkit (fora das grelhas do categoryFilters),
// usando os dados de products-all.json (mesmo ficheiro que alimenta as grelhas):
//
//  1) Cards nativos com variantes (home "destaques", relacionados, pesquisa)
//     mostram o intervalo de preco ("86,00 € — 185,00 €"). Passamos a mostrar
//     "desde <minimo disponivel>" — igual as grelhas, com stock ja considerado.
//
//  2) Carrinho: quando a variante escolhida nao tem imagem propria, o Shopkit
//     serve no-img.png. Substituimos pela imagem PRINCIPAL do produto.
//
// Fonte de dados: products-all.json, carregado pelo commit SHA (imune ao lag
// do @main no jsDelivr), com o mesmo cache de sessao usado no categoryFilters.

const REPO = 'kaueramone/aquariumlife';

let _refPromise = null;
function aqGetDataRef() {
  if (_refPromise) return _refPromise;
  _refPromise = (async function () {
    try {
      const cached = sessionStorage.getItem('aqDataRef');
      if (cached) return cached;
      const r = await fetch('https://api.github.com/repos/' + REPO + '/commits/main',
        { headers: { 'Accept': 'application/vnd.github.sha' } });
      const sha = (await r.text()).trim();
      const ref = /^[0-9a-f]{40}$/i.test(sha) ? sha : 'main';
      try { sessionStorage.setItem('aqDataRef', ref); } catch (e) {}
      return ref;
    } catch (e) { return 'main'; }
  })();
  return _refPromise;
}

let _mapPromise = null;
export function loadMap() {
  if (_mapPromise) return _mapPromise;
  _mapPromise = (async function () {
    const ref = await aqGetDataRef();
    const url = 'https://cdn.jsdelivr.net/gh/' + REPO + '@' + ref + '/dist/products-all.json';
    const data = await fetch(url).then(function (r) { return r.json(); });
    const map = {};
    (data.products || []).forEach(function (p) {
      const h = ((p.url || '').match(/\/product\/([^/?#]+)/) || [])[1];
      if (h) map[h] = { af: p.af || null, img: p.img || null, bc: p.bc || null };
    });
    return map;
  })().catch(function () { return {}; });
  return _mapPromise;
}

// handle sem tracos a mais nas pontas (alguns handles tem "-" inicial)
function norm(s) { return (s || '').replace(/^-+/, '').replace(/-+$/, ''); }

// Encontra o registo do produto a partir do handle da linha/card. Tenta:
// exacto -> normalizado -> handle-pai que seja prefixo do handle-variante.
function lookup(map, handle) {
  if (!handle) return null;
  if (map[handle]) return map[handle];
  const hn = norm(handle);
  if (map[hn]) return map[hn];
  let best = null, blen = 0;
  for (const k in map) {
    const kn = norm(k);
    if ((hn === kn || hn.indexOf(kn + '-') === 0) && kn.length > blen) { best = map[k]; blen = kn.length; }
  }
  return best;
}

function handleFromHref(href) {
  return ((href || '').match(/\/product\/([^/?#]+)/) || [])[1] || '';
}

const isZero = function (s) { return /^0([.,]0+)?\s*€?$/.test(String(s).trim()); };

// 1) Cards nativos com intervalo -> "desde <minimo>"
async function enhanceCards() {
  const cards = document.querySelectorAll('.product');
  if (!cards.length) return;
  const map = await loadMap();
  cards.forEach(function (card) {
    const pp = card.querySelector('.product-price');
    if (!pp || pp.dataset.aqDesde) return;
    const actual = pp.querySelector('.product-actual');
    if (!actual) return;
    // so' cards com INTERVALO de preco (variavel): "X € — Y €" / "X € – Y €"
    if (!/[—–]\s*\d/.test(actual.textContent)) return;
    const link = card.querySelector('a.product-name, a.product-preview, a[href*="/product/"]');
    const rec = lookup(map, handleFromHref(link && link.getAttribute('href')));
    if (!rec || !rec.af || isZero(rec.af)) return;
    pp.dataset.aqDesde = '1';
    pp.innerHTML = '<span class="product-from">desde</span> <span class="product-actual">' + rec.af + '</span>';
  });
}

// 2) Carrinho: no-img -> imagem principal do produto
async function enhanceCartImages() {
  const imgs = document.querySelectorAll('.cart-item img, img.cart-pic, .cart-list img');
  if (!imgs.length) return;
  const map = await loadMap();
  imgs.forEach(function (img) {
    if (img.dataset.aqImgDone) return;
    const src = img.getAttribute('src') || '';
    if (!/no-img/i.test(src)) return;              // so' quando esta sem imagem
    const row = img.closest('.cart-item, tr, li') || img.parentElement;
    const link = row && row.querySelector('a[href*="/product/"]');
    const rec = lookup(map, handleFromHref(link && link.getAttribute('href')));
    if (!rec || !rec.img || /no-img/i.test(rec.img)) return;
    img.dataset.aqImgDone = '1';
    img.removeAttribute('srcset');
    img.setAttribute('src', rec.img);
    img.classList.remove('lazy');
  });
}

export function initNativeVariants() {
  const run = function () { enhanceCards(); enhanceCartImages(); };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
  // Home e carrinho renderizam/hidratam de forma assincrona -> re-corre (debounce)
  let t = null;
  const obs = new MutationObserver(function () { clearTimeout(t); t = setTimeout(run, 200); });
  obs.observe(document.documentElement, { childList: true, subtree: true });
}
