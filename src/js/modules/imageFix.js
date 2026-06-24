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

function analyze(imgEl) {
  const w = imgEl.naturalWidth, h = imgEl.naturalHeight;
  if (!w || !h) return null;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.drawImage(imgEl, 0, 0);
  const isBlack = function (x, y) {
    const d = ctx.getImageData(x, y, 3, 3).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 200 && d[i] < 28 && d[i + 1] < 28 && d[i + 2] < 28) n++;
    }
    return n >= 6;
  };
  const corners = [[0, 0], [w - 3, 0], [0, h - 3], [w - 3, h - 3]]
    .filter(function (p) { return isBlack(p[0], p[1]); }).length;
  const centerBlack = isBlack((w >> 1) - 1, (h >> 1) - 1);
  return { corners: corners, centerBlack: centerBlack };
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
    try { r = analyze(probe); } catch (e) { return; }   // CORS/tainted: ignora
    if (!r || r.corners !== 4 || r.centerBlack) return;  // nao e' padding preto
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
