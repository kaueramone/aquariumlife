#!/usr/bin/env node
/**
 * selecionar-pequenas.cjs — prepara as entradas do upscale (roda no GitHub Actions)
 * 1) Busca os produtos ativos na API Shopkit (SHOPKIT_API_KEY no ambiente);
 * 2) Mede a dimensão real de cada imagem (download parcial + image-size);
 * 3) Baixa para tools/upscale/entrada/ as que precisam de upscale.
 *
 * Seleção:
 *   - env IDS="123,456"  → só esses produtos (modo controlado, recomendado);
 *   - sem IDS            → automático: lado menor < LIMIAR (default 300px).
 * Requer: npm i image-size (o workflow instala).
 */
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

const KEY = (process.env.SHOPKIT_API_KEY || '').trim();
if (!KEY) { console.error('ERRO: SHOPKIT_API_KEY ausente.'); process.exit(1); }
const IDS = (process.env.IDS || '').split(',').map(s => s.trim()).filter(Boolean);
const LIMIAR = parseInt(process.env.LIMIAR || '300', 10);
const DEST = path.join(__dirname, 'entrada');

async function fetchAll() {
  let page = 1, all = [];
  while (true) {
    const r = await fetch('https://api.shopk.it/v1/product?page=' + page + '&limit=50', {
      headers: { 'X-API-KEY': KEY, Accept: 'application/json' } });
    if (!r.ok) throw new Error('API HTTP ' + r.status);
    const d = await r.json();
    const items = Object.keys(d).filter(k => k !== 'paging').map(k => d[k]);
    if (!items.length) break;
    all = all.concat(items);
    if (items.length < 50) break;
    page++;
  }
  return all.filter(p => p.status === 1 || p.status === 3);
}

async function baixa(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'AquariumLifeUpscale/1.0' } });
  if (!r.ok) throw new Error('img HTTP ' + r.status);
  return Buffer.from(await r.arrayBuffer());
}

(async () => {
  fs.mkdirSync(DEST, { recursive: true });
  const prods = await fetchAll();
  const alvo = IDS.length ? prods.filter(p => IDS.includes(String(p.id))) : prods;
  let n = 0;
  for (const p of alvo) {
    const img = p.image && (p.image.full || p.image.square);
    if (!img || img.includes('no-img')) continue;
    try {
      const buf = await baixa(img);
      const dim = sizeOf(buf);
      const menor = Math.min(dim.width, dim.height);
      const precisa = IDS.length ? true : (menor < LIMIAR);
      if (!precisa) continue;
      const ext = (dim.type === 'png') ? 'png' : 'jpg';
      fs.writeFileSync(path.join(DEST, p.id + '.' + ext), buf);
      console.log('entrada:', p.id, dim.width + 'x' + dim.height, '|', p.title.slice(0, 50));
      n++;
    } catch (e) { console.log('falha', p.id, e.message.slice(0, 60)); }
    await new Promise(r => setTimeout(r, 300));
  }
  console.log('total preparadas:', n);
  if (!n) console.log('Nada a fazer.');
})().catch(e => { console.error('FALHA:', e.message); process.exit(1); });
