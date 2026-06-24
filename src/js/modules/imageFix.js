// imageFix.js
// Corrige a "borda preta" das miniaturas. O Shopkit gera a variante /square/
// (400x400) preenchendo com PRETO quando a foto original e' menor que 400px;
// esse preto fica queimado no ficheiro da miniatura. Aqui detectamos so' esses
// casos (os 4 cantos pretos numa imagem /square/) e trocamos pela imagem
// ORIGINAL (sem padding), com fundo branco para eventuais barras. Imagens
// correctas (original >= 400px) nao sao tocadas.

const SQUARE_SEG = '/media/images/square/';

function originalOf(src) {
  return src.replace(SQUARE_SEG, '/media/images/');
}

// Mede a espessura da moldura preta (linhas/colunas inteiras pretas) em cada lado.
function blackFrame(imgEl) {
  const w = imgEl.naturalWidth, h = imgEl.naturalHeight;
  if (!w || !h) return null;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.drawImage(imgEl, 0, 0);
  const D = ctx.getImageData(0, 0, w, h).data;
  const isBlack = function (x, y) {
    const i = (y * w + x) * 4;
    return D[i + 3] > 200 && D[i] < 28 && D[i + 1] < 28 && D[i + 2] < 28;
  };
  const N = 20;
  const rowBlack = function (y) {
    for (let k = 0; k <= N; k++) { if (!isBlack(Math.min(w - 1, Math.round(k * (w - 1) / N)), y)) return false; }
    return true;
  };
  const colBlack = function (x) {
    for (let k = 0; k <= N; k++) { if (!isBlack(x, Math.min(h - 1, Math.round(k * (h - 1) / N)))) return false; }
    return true;
  };
  let top = 0; while (top < h && rowBlack(top)) top++;
  let bot = 0; while (bot < h && rowBlack(h - 1 - bot)) bot++;
  let left = 0; while (left < w && colBlack(left)) left++;
  let right = 0; while (right < w && colBlack(w - 1 - right)) right++;
  return { w: w, h: h, top: top, bot: bot, left: left, right: right };
}

// E' "padding" do thumbnail quando ha' uma moldura preta uniforme e simetrica
// (cima/baixo e/ou esquerda/direita) ocupando < ~45% (logo ha' conteudo no meio).
// Baseia-se na MOLDURA, nao no centro -> funciona com produtos escuros.
function isPadded(r) {
  if (!r) return false;
  const sym = function (a, b) { return a >= 3 && b >= 3 && Math.abs(a - b) <= Math.max(4, 0.3 * Math.max(a, b)); };
  const vert = sym(r.top, r.bot) && Math.max(r.top, r.bot) <= 0.45 * r.h;
  const horiz = sym(r.left, r.right) && Math.max(r.left, r.right) <= 0.45 * r.w;
  return vert || horiz;
}

function fixOne(img) {
  const src = img.getAttribute('src') || '';
  if (src.indexOf(SQUARE_SEG) === -1) return;     // so' miniaturas /square/
  if (img.dataset.aqBorder === src) return;        // ja' verificado este src
  img.dataset.aqBorder = src;

  const probe = new Image();
  probe.crossOrigin = 'anonymous';
  probe.onload = function () {
    let r = null;
    try { r = blackFrame(probe); } catch (e) { return; }  // CORS/tainted: ignora
    if (!isPadded(r)) return;                             // nao e' moldura preta (padding)
    const original = originalOf(src);
    if (original === src) return;
    img.style.background = '#fff';
    img.style.objectFit = 'contain';
    img.src = original;                 // imagem original, sem o padding preto
  };
  probe.onerror = function () {};
  probe.src = src;                      // mesmo URL ja' carregado pelo <img> visivel
}

function scan() {
  document.querySelectorAll('img.product-pic, img.card-pic').forEach(fixOne);
}

export function initImageFix() {
  let t = null;
  const schedule = function () { clearTimeout(t); t = setTimeout(scan, 150); };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
  // Apanha lazy-load (src trocado) e grelhas re-renderizadas (paginacao/filtros)
  const obs = new MutationObserver(schedule);
  obs.observe(document.documentElement, {
    childList: true, subtree: true, attributes: true, attributeFilter: ['src']
  });
}
