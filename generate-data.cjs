#!/usr/bin/env node
/**
 * generate-data.cjs
 * Regenera os JSON da camada custom da AquariumLife a partir da API
 * oficial do Shopkit (fonte de verdade), incluindo a imagem REAL de cada
 * produto (image.square). Substitui o snapshot que ficava desactualizado
 * e causava no-img nas paginas de categoria.
 *
 * Saidas (em ./dist):
 *   - products-all.json
 *   - products-cat-<id>.json  (um por categoria)
 *   - categories.json
 *
 * Uso local:  cria .env.local com  SHOPKIT_API_KEY=...   e corre:  node generate-data.cjs
 * Uso no CI:  variavel de ambiente SHOPKIT_API_KEY (GitHub secret)
 *
 * Sem dependencias externas (usa o fetch nativo do Node >= 18).
 */
const fs = require('fs');
const path = require('path');

const API     = 'https://api.shopk.it/v1';
const SITE    = 'https://www.aquariumlife.pt';
const NO_IMG  = 'https://cdn-shopkit.com/assets/store/img/no-img.png';
const OUT_DIR = path.join(__dirname, 'dist');
const PAGE_LIMIT  = 50;     // maximo permitido pela API
const ONLY_ACTIVE = true;   // so produtos activos vao para as grelhas

function getApiKey() {
  if (process.env.SHOPKIT_API_KEY) return process.env.SHOPKIT_API_KEY.trim();
  try {
    const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
    const m = env.match(/^\s*SHOPKIT_API_KEY\s*=\s*(.+)\s*$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, '');
  } catch (e) {}
  return null;
}
const API_KEY = getApiKey();
if (!API_KEY) {
  console.error('ERRO: SHOPKIT_API_KEY nao definida (env ou .env.local).');
  process.exit(1);
}

const MAX_RETRIES = 5;       // tentativas por pedido
const REQ_TIMEOUT = 30000;   // 30s por tentativa
const sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

async function api(endpoint, params) {
  const url = new URL(API + endpoint);
  Object.entries(params || {}).forEach(function (e) {
    if (e[1] != null) url.searchParams.set(e[0], e[1]);
  });

  let lastErr;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(function () { ctrl.abort(); }, REQ_TIMEOUT);
    try {
      const res = await fetch(url, {
        headers: { 'X-API-KEY': API_KEY, 'Accept': 'application/json', 'User-Agent': 'AquariumLifeDataGen/1.0' },
        signal: ctrl.signal
      });
      clearTimeout(timer);

      // 429/5xx: erro temporario -> repetir
      if (res.status === 429 || res.status >= 500) {
        throw new Error('HTTP ' + res.status);
      }
      // outros 4xx (ex: 401 chave invalida): erro definitivo -> nao repetir
      if (!res.ok) {
        const body = await res.text().catch(function () { return ''; });
        throw Object.assign(
          new Error('API ' + endpoint + ' -> HTTP ' + res.status + ' ' + body.slice(0, 200)),
          { fatal: true }
        );
      }
      const total = parseInt(res.headers.get('x-total-count') || '', 10);
      return { data: await res.json(), total: isNaN(total) ? null : total };
    } catch (err) {
      clearTimeout(timer);
      if (err && err.fatal) throw err;           // 4xx definitivo: aborta ja
      lastErr = err;
      if (attempt < MAX_RETRIES) {
        const wait = Math.min(1000 * Math.pow(2, attempt - 1), 8000); // 1s,2s,4s,8s
        const why = (err && (err.code || err.message)) || 'erro de rede';
        console.warn('  aviso: ' + endpoint + ' tentativa ' + attempt + '/' + MAX_RETRIES +
                     ' falhou (' + why + '); nova tentativa em ' + wait + 'ms');
        await sleep(wait);
      }
    }
  }
  throw new Error('API ' + endpoint + ' falhou apos ' + MAX_RETRIES +
                  ' tentativas: ' + (lastErr && (lastErr.message || lastErr.code || lastErr)));
}

function asList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && typeof data === 'object') {
    return Object.keys(data).filter(function (k) { return k !== 'paging'; }).map(function (k) { return data[k]; });
  }
  return [];
}

async function fetchAll(endpoint, params) {
  const out = [];
  let total = null;
  for (let page = 1; page <= 500; page++) {
    const r = await api(endpoint, Object.assign({ page: page, limit: PAGE_LIMIT }, params || {}));
    if (total == null) total = r.total;
    const list = asList(r.data);
    if (list.length === 0) break;
    for (const it of list) out.push(it);
    if (total != null && out.length >= total) break;
    if (total == null && list.length < PAGE_LIMIT) break;
  }
  return out;
}

function fmtPrice(v) {
  return (typeof v === 'number') ? v.toFixed(2).replace('.', ',') + ' €' : null;
}

// Numero a partir de um preco que pode vir number ou string ("14,30")
function toNum(v) {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') { const n = parseFloat(v.replace(',', '.')); return isNaN(n) ? null : n; }
  return null;
}

// Variante com preco valido (>0, nao "sob consulta", ativa) — o stock NAO
// interessa aqui: o "desde" mostra sempre o mais barato da variacao
// (pedido do Kaue 2026-07-23; antes saltava esgotadas e o desde subia).
function optValida(o) {
  const n = toNum(o.price);
  if (n == null || n <= 0) return false;     // sem preco ou 0,00 -> ignorar
  if (o.price_on_request) return false;
  if (o.active === false) return false;
  // NAO checar is_vendible: e' so' o espelho do stock a zero (a variante
  // continua visivel na pagina) e o "desde" deve ser o mais barato sempre.
  return true;
}

// "desde": preco (formatado) da variante valida mais barata, com ou sem stock.
// Usa o price_formatted da propria opcao (formato identico ao do Shopkit).
// Devolve null se o produto nao tiver variantes ou nenhuma tiver preco valido.
function aPartirDe(p) {
  const groups = Array.isArray(p.option_groups) ? p.option_groups : [];
  const opts   = Array.isArray(p.options) ? p.options : [];
  const isVariant = groups.length > 0 || opts.length > 1;
  if (!isVariant) return null;

  let lo = null;
  for (const o of opts) {
    if (!optValida(o)) continue;
    const n = toNum(o.price);
    if (lo == null || n < lo.n) lo = { n: n, f: o.price_formatted || fmtPrice(n) };
  }
  return lo ? lo.f : null;
}

function mapProduct(p) {
  const handle = p.handle || '';
  const img = (p.image && (p.image.full || p.image.square || p.image.thumb)) || NO_IMG;
  return {
    id:    p.id,
    title: p.title,
    price: (typeof p.price === 'number') ? p.price : (parseFloat(p.price) || 0),
    pf:    p.price_formatted || fmtPrice(p.price),
    pp:    (p.price_promo != null) ? p.price_promo : null,
    ppf:   p.price_promo_formatted || null,
    af:    aPartirDe(p),   // "A partir de" (variante mais barata) ou null
    url:   p.url || (SITE + '/product/' + handle),
    cart:  p.add_cart_url || (SITE + '/cart/add/' + handle),
    img:   img,
    st:    emStock(p) ? 1 : 0   // 0 = esgotado (badge + compra bloqueada na grelha)
  };
}

// Sem stock quando: produto marcado "esgotado" (status 3) ou stock ativo a zero sem backorder.
function emStock(p) {
  if (p.status === 3) return false;
  const s = p.stock;
  if (s && s.stock_enabled && !s.stock_backorder && Number(s.stock_qty) <= 0) return false;
  return true;
}

function writeJson(file, obj) {
  fs.writeFileSync(path.join(OUT_DIR, file), JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function buildFile(catId, slug, rawList, today) {
  const sorted = rawList.slice().sort(function (a, b) {
    return ((a.position || 0) - (b.position || 0)) || (a.id - b.id);
  });
  const mapped = sorted.map(mapProduct);
  const prices = mapped.map(function (p) { return p.price; }).filter(function (n) { return typeof n === 'number'; });
  return {
    updated: today,
    cat: catId,
    slug: slug,
    total: mapped.length,
    min: prices.length ? Math.min.apply(null, prices) : 0,
    max: prices.length ? Math.max.apply(null, prices) : 0,
    products: mapped
  };
}

(async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);

  console.log('A obter produtos da API Shopkit...');
  // Inclui ativos (1) e esgotados (3): esgotado continua na grelha com badge, sem sumir.
  let products = await fetchAll('/product', {});
  if (ONLY_ACTIVE) products = products.filter(function (p) { return p.status === 1 || p.status === 3; });
  console.log('  ' + products.length + ' produtos.');

  console.log('A obter categorias...');
  const cats = await fetchAll('/category', {});
  console.log('  ' + cats.length + ' categorias.');
  const catById = new Map(cats.map(function (c) { return [c.id, c]; }));

  // Agrupar produtos por categoria, subindo ate aos pais (ex.: Equipamento)
  const byCat = new Map();
  for (const p of products) {
    const seen = new Set();
    for (const c of (Array.isArray(p.categories) ? p.categories : [])) {
      let id = c && c.id;
      while (id != null && !seen.has(id)) {
        seen.add(id);
        if (!byCat.has(id)) byCat.set(id, []);
        byCat.get(id).push(p);
        const node = catById.get(id) || c;
        id = node && node.parent ? node.parent : null;
        if (!id || id === 0) id = null;
      }
    }
  }

  let nFiles = 0;
  for (const entry of byCat) {
    const catId = entry[0];
    const c = catById.get(catId);
    const slug = (c && c.handle) || String(catId);
    writeJson('products-cat-' + catId + '.json', buildFile(catId, slug, entry[1], today));
    nFiles++;
  }

  writeJson('products-all.json', buildFile('all', 'all', products, today));

  // categories.json (arvore p/ o dropdown de categorias)
  const active = cats.filter(function (c) { return c.active !== false; });
  const byPos = function (a, b) { return (a.position || 0) - (b.position || 0); };
  const node = function (c) {
    return {
      id: c.id,
      title: c.title,
      url: c.url || (SITE + '/category/' + c.handle),
      handle: c.handle,
      count: (byCat.get(c.id) || []).length
    };
  };
  const parents = active.filter(function (c) { return !c.parent || c.parent === 0; }).sort(byPos);
  const categories = parents.map(function (p) {
    const obj = node(p);
    obj.children = active.filter(function (c) { return c.parent === p.id; }).sort(byPos).map(node);
    return obj;
  });
  writeJson('categories.json', { updated: today, total: active.length, categories: categories });

  console.log('Concluido: ' + nFiles + ' ficheiros products-cat-*.json + products-all.json + categories.json em dist/.');
})().catch(function (err) { console.error('FALHOU:', err); process.exit(1); });
