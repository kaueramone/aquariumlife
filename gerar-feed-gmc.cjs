#!/usr/bin/env node
/**
 * gerar-feed-gmc.cjs — Feed Google Merchant Center (RSS 2.0 / namespace g:)
 * Gera dist/gmc-feed.xml a partir da API Shopkit (produtos ativos com imagem).
 * Uso: node gerar-feed-gmc.cjs   (requer SHOPKIT_API_KEY em .env.local ou env)
 * URL publicada (após commit+push):
 *   https://cdn.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/gmc-feed.xml
 */
const fs = require('fs');
const path = require('path');

const API = 'https://api.shopk.it/v1';
function getKey() {
  if (process.env.SHOPKIT_API_KEY) return process.env.SHOPKIT_API_KEY.trim();
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  const m = env.match(/^\s*SHOPKIT_API_KEY\s*=\s*(.+)\s*$/m);
  return m[1].trim().replace(/^["']|["']$/g, '');
}
const KEY = getKey();

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const ENT = { aacute:'á', eacute:'é', iacute:'í', oacute:'ó', uacute:'ú', atilde:'ã', otilde:'õ',
  acirc:'â', ecirc:'ê', ocirc:'ô', agrave:'à', ccedil:'ç', Aacute:'Á', Eacute:'É', Ccedil:'Ç',
  Atilde:'Ã', Otilde:'Õ', ntilde:'ñ', uuml:'ü', ouml:'ö', auml:'ä', amp:'&', nbsp:' ',
  quot:'"', ndash:'–', mdash:'—', deg:'°', sup2:'²', sup3:'³', frac12:'½', times:'×' };
const limpa = h => String(h || '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&#x([0-9a-f]+);/gi, function (_, c) { return String.fromCharCode(parseInt(c, 16)); })
  .replace(/&#(\d+);/g, function (_, c) { return String.fromCharCode(+c); })
  .replace(/&([a-zA-Z]+);/g, function (m, e) { return ENT[e] !== undefined ? ENT[e] : ' '; })
  .replace(/\s+/g, ' ').trim().slice(0, 4900);

async function apiPage(page) {
  const r = await fetch(API + '/product?page=' + page + '&limit=50', {
    headers: { 'X-API-KEY': KEY, Accept: 'application/json' } });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const d = await r.json();
  return Object.keys(d).filter(function (k) { return k !== 'paging'; }).map(function (k) { return d[k]; });
}

(async function () {
  let page = 1, all = [];
  while (true) {
    const items = await apiPage(page);
    if (!items.length) break;
    all = all.concat(items);
    if (items.length < 50) break;
    page++;
  }
  const ativos = all.filter(function (p) {
    const img = p.image && (p.image.full || p.image.square);
    return p.status === 1 && img && img.indexOf('no-img') === -1;
  });

  const itens = ativos.map(function (p) {
    const gtin = /^\d{8,14}$/.test(String(p.barcode || '').trim()) ? String(p.barcode).trim() : '';
    const brand = (p.brand && (p.brand.title || p.brand.name)) || '';
    const disponivel = !p.stock || !p.stock.stock_enabled || (p.stock.stock_qty > 0) || p.stock.stock_backorder;
    const precoNum = (p.price_with_tax != null ? p.price_with_tax : (p.price != null ? p.price : 0));
    const preco = Number(precoNum).toFixed(2) + ' EUR';
    const linhas = [
      '  <item>',
      '    <g:id>' + p.id + '</g:id>',
      '    <g:title>' + esc(p.title) + '</g:title>',
      '    <g:description>' + esc(limpa(p.description) || p.title) + '</g:description>',
      '    <g:link>' + esc(p.url) + '</g:link>',
      '    <g:image_link>' + esc(p.image.full) + '</g:image_link>',
      '    <g:availability>' + (disponivel ? 'in_stock' : 'out_of_stock') + '</g:availability>',
      '    <g:price>' + preco + '</g:price>',
      '    <g:condition>new</g:condition>',
      gtin ? '    <g:gtin>' + gtin + '</g:gtin>' : '    <g:identifier_exists>false</g:identifier_exists>',
      brand ? '    <g:brand>' + esc(brand) + '</g:brand>' : '',
      '  </item>'
    ].filter(Boolean);
    return linhas.join('\n');
  });

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n<channel>\n' +
    '  <title>AquariumLife</title>\n' +
    '  <link>https://www.aquariumlife.pt</link>\n' +
    '  <description>Feed de produtos AquariumLife para Google Merchant Center</description>\n' +
    itens.join('\n') + '\n</channel>\n</rss>\n';

  const out = path.join(__dirname, 'dist', 'gmc-feed.xml');
  fs.writeFileSync(out, xml);
  console.log('Feed GMC: ' + ativos.length + ' produtos -> ' + out);
})().catch(function (e) { console.error('FALHA:', e.message); process.exit(1); });
