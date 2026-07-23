/**
 * breadcrumbFix.js
 * Insere os niveis intermedios em falta no breadcrumb da pagina de produto.
 *
 * O ShopKit constroi o breadcrumb apenas com a categoria de TOPO do produto:
 *   Home > Equipamento > AS Visitherm
 * mas o produto tambem esta na subcategoria "Termostatos" (filha de
 * Equipamento). O correcto e':
 *   Home > Equipamento > Termostatos > AS Visitherm
 *
 * A trilha vem do campo `bc` do products-all.json (gerado por generate-data.cjs:
 * bcChain) = [{t,u} do topo ... ate a subcategoria mais profunda]. Aqui
 * inserimos os niveis que ainda nao estao no breadcrumb, imediatamente antes
 * do ultimo <li> (o nome do produto). Idempotente (marca a lista com dataset).
 *
 * Estrutura nativa (validada em producao 2026-07-23):
 *   .breadcrumbs > .container-fluid > ul.breadcrumbs-list
 *     li.breadcrumbs-item > a.breadcrumbs-link[href]   (Home, categorias)
 *     li.breadcrumbs-item                              (produto, sem link)
 */

import { loadMap } from './nativeVariants.js';

function handleFromPath() {
  return (location.pathname.match(/\/product\/([^/?#]+)/) || [])[1] || '';
}

function catHandle(href) {
  return ((href || '').match(/\/category\/([^/?#]+)/) || [])[1] || '';
}

function lookupRec(map, handle) {
  if (!handle) return null;
  if (map[handle]) return map[handle];
  const hn = handle.replace(/^-+/, '').replace(/-+$/, '');
  if (map[hn]) return map[hn];
  // fallback: handle-pai que seja prefixo do handle da pagina
  let best = null, blen = 0;
  for (const k in map) {
    if ((hn === k || hn.indexOf(k + '-') === 0) && k.length > blen) { best = map[k]; blen = k.length; }
  }
  return best;
}

async function fixBreadcrumb() {
  const ul = document.querySelector('.breadcrumbs-list');
  if (!ul || ul.dataset.aqBc) return;

  const map = await loadMap();
  const rec = lookupRec(map, handleFromPath());
  if (!rec || !Array.isArray(rec.bc) || rec.bc.length < 2) return;

  const items = ul.querySelectorAll('.breadcrumbs-item');
  if (items.length < 2) return;
  ul.dataset.aqBc = '1';

  const last = items[items.length - 1];                 // nome do produto
  // handles de categoria ja presentes no breadcrumb
  const present = new Set();
  ul.querySelectorAll('.breadcrumbs-item a[href]').forEach(function (a) {
    const h = catHandle(a.getAttribute('href'));
    if (h) present.add(h);
  });

  // inserir, pela ordem da trilha, os niveis que ainda faltam
  rec.bc.forEach(function (c) {
    const h = catHandle(c.u);
    if (h && present.has(h)) return;                     // ja esta no breadcrumb
    const li = document.createElement('li');
    li.className = 'breadcrumbs-item';
    const a = document.createElement('a');
    a.className = 'breadcrumbs-link';
    a.href = c.u;
    a.textContent = c.t;
    li.appendChild(a);
    ul.insertBefore(li, last);
    if (h) present.add(h);
  });
}

export function initBreadcrumbFix() {
  if (!document.body.classList.contains('page-product')) return;

  fixBreadcrumb();
  // breadcrumb e' server-rendered (ja no DOM), mas re-tentamos caso o
  // tema re-renderize a zona; para depois de resolver (dataset) ou ao fim.
  let n = 0;
  const iv = setInterval(function () {
    n++;
    const ul = document.querySelector('.breadcrumbs-list');
    if ((ul && ul.dataset.aqBc) || n >= 12) { clearInterval(iv); return; }
    fixBreadcrumb();
  }, 400);
}
