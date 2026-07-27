#!/usr/bin/env node
/**
 * selecionar-pequenas.cjs — prepara as entradas do upscale (roda no GitHub Actions)
 *
 * FONTE: dist/products-all.json (NÃO usa a API Shopkit — ela bloqueia o datacenter
 * do GitHub, o que fazia o passo falhar de forma intermitente). As imagens vêm do
 * CDN (cdn-shopkit.com), que serve o GitHub normalmente. O products-all.json é
 * mantido fresco pelo AtualizarLoja.exe / robô, por isso reflete o catálogo atual.
 *
 * 1) Lê os produtos de dist/products-all.json;
 * 2) Mede a dimensão real de cada imagem (download + image-size);
 * 3) Baixa para tools/upscale/entrada/ as que precisam de upscale.
 *
 * Seleção:
 *   - env IDS="123,456"  → só esses produtos (modo controlado);
 *   - sem IDS            → automático: lado menor < LIMIAR (default 300px).
 * Resume: o que já está em dist/img-hd não se repete.
 * Requer: npm i image-size (o workflow instala).
 */
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

const IDS = (process.env.IDS || '').split(',').map(s => s.trim()).filter(Boolean);
const LIMIAR = parseInt(process.env.LIMIAR || '300', 10);
const DEST = path.join(__dirname, 'entrada');
const DATA = path.join(__dirname, '..', '..', 'dist', 'products-all.json');
// resume: resultados que já estão em dist/img-hd não se repetem
const HD = path.join(__dirname, '..', '..', 'dist', 'img-hd');
const FEITOS = fs.existsSync(HD) ? fs.readdirSync(HD) : [];

function lerProdutos() {
  if (!fs.existsSync(DATA)) {
    throw new Error('dist/products-all.json não encontrado — corre o AtualizarLoja (ou o robô) antes do upscale.');
  }
  const d = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  return d.products || [];
}

async function baixa(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 AquariumLifeUpscale/2.0' } });
  if (!r.ok) throw new Error('img HTTP ' + r.status);
  return Buffer.from(await r.arrayBuffer());
}

(async () => {
  fs.mkdirSync(DEST, { recursive: true });
  const prods = lerProdutos();
  const alvo = IDS.length ? prods.filter(p => IDS.includes(String(p.id))) : prods;
  console.log('produtos a avaliar:', alvo.length, IDS.length ? '(modo IDS)' : '(modo automático < ' + LIMIAR + 'px)');
  let n = 0, saltados = 0;
  for (const p of alvo) {
    const img = p.img;
    if (!img || img.includes('no-img')) continue;
    if (FEITOS.some(f => f.startsWith(p.id + '.'))) { saltados++; continue; }
    try {
      const buf = await baixa(img);
      const dim = sizeOf(buf);
      const menor = Math.min(dim.width, dim.height);
      const precisa = IDS.length ? true : (menor < LIMIAR);
      if (!precisa) continue;
      const ext = (dim.type === 'png') ? 'png' : 'jpg';
      fs.writeFileSync(path.join(DEST, p.id + '.' + ext), buf);
      console.log('entrada:', p.id, dim.width + 'x' + dim.height, '|', (p.title || '').slice(0, 50));
      n++;
    } catch (e) { console.log('falha', p.id, e.message.slice(0, 60)); }
    await new Promise(r => setTimeout(r, 150));
  }
  if (saltados) console.log('já ampliados (resume), saltados:', saltados);
  console.log('total preparadas:', n);
  if (!n) console.log('Nada a fazer.');
})().catch(e => { console.error('FALHA:', e.message); process.exit(1); });
