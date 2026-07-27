#!/usr/bin/env node
/**
 * converter-webp.cjs — converte as imagens de produto para WebP (roda no GitHub Actions).
 *
 * FONTE: dist/products-all.json (NÃO usa a API Shopkit — ela bloqueia o datacenter
 * do GitHub). As imagens vêm do CDN (cdn-shopkit.com), que serve o GitHub OK.
 * IMPORTANTE: corre o AtualizarLoja/robô ANTES, para o products-all.json refletir
 * as imagens atuais (ex.: as ampliadas pelo upscale).
 *
 * O quê:
 *   1) lê os produtos de dist/products-all.json;
 *   2) seleciona os que NÃO são já .webp (e têm imagem);
 *   3) baixa do CDN, redimensiona (lado maior <= MAXLADO) e grava .webp em dist/img-webp/.
 *
 * Depois: aplicar aos produtos via PUT /product/{id} {images:[<jsDelivr img-webp>]}
 * (a Shopkit preserva o WebP — confirmado). Resume: o que já está em dist/img-webp/
 * não se repete (para reconverter uma imagem alterada, apaga o .webp respetivo).
 *
 * env: IDS="1,2" (opcional; vazio = todas não-webp) · MAXLADO=1400 · QUALIDADE=82
 * Requer: npm i sharp (o workflow instala).
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', '..');
const DATA = path.join(ROOT, 'dist', 'products-all.json');
const OUT = path.join(ROOT, 'dist', 'img-webp');
const IDS = (process.env.IDS || '').split(',').map(s => s.trim()).filter(Boolean);
const MAX = parseInt(process.env.MAXLADO || '1400', 10);
const Q = parseInt(process.env.QUALIDADE || '82', 10);
const CONC = 12;

function lerProdutos() {
  if (!fs.existsSync(DATA)) {
    throw new Error('dist/products-all.json não encontrado — corre o AtualizarLoja (ou o robô) antes.');
  }
  return JSON.parse(fs.readFileSync(DATA, 'utf8')).products || [];
}

async function converter(p) {
  try {
    const r = await fetch(p.img, { headers: { 'User-Agent': 'Mozilla/5.0 AquariumLifeWebp/1.0' } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const buf = Buffer.from(await r.arrayBuffer());
    await sharp(buf)
      .resize(MAX, MAX, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: Q })
      .toFile(path.join(OUT, p.id + '.webp'));
    return true;
  } catch (e) {
    console.log('falha', p.id, (e.message || '').slice(0, 50));
    return false;
  }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const feitos = new Set(fs.readdirSync(OUT).map(f => f.replace(/\..*/, '')));
  const prods = lerProdutos();
  const alvo = prods.filter(p => {
    if (!p.img || p.img.includes('no-img')) return false;
    if (/\.webp(\?|$)/i.test(p.img)) return false;         // já é webp
    if (IDS.length && !IDS.includes(String(p.id))) return false;
    if (feitos.has(String(p.id))) return false;            // resume
    return true;
  });
  console.log('a converter', alvo.length, 'imagens (lado <= ' + MAX + 'px, q' + Q + ')' + (feitos.size ? ' | já feitas: ' + feitos.size : ''));
  let ok = 0;
  for (let i = 0; i < alvo.length; i += CONC) {
    const res = await Promise.all(alvo.slice(i, i + CONC).map(converter));
    ok += res.filter(Boolean).length;
    process.stderr.write('.');
  }
  console.log('\nconvertidas:', ok, 'de', alvo.length);
})().catch(e => { console.error('FALHA:', e.message); process.exit(1); });
