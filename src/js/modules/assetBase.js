// assetBase.js
// Base URL dos nossos assets estáticos (ícones/logos WebP) servidos via jsDelivr.
//
// É derivada do <script src> do próprio app.js — que o template da Shopkit carrega
// PINADO no commit hash (ex.: .../aquariumlife@f311fed/dist/app.js). Assim os WebP
// herdam o MESMO hash imutável do app.js, evitando o lag de cache do @main para
// ficheiros novos (o mesmo motivo pelo qual os JSON são carregados via SHA).
//
// Corre uma vez, no arranque síncrono do script (currentScript ainda válido).

function computeBase() {
  try {
    var s = document.currentScript;
    if (s && s.src && s.src.indexOf('/dist/app.js') !== -1) {
      return s.src.replace(/\/dist\/app\.js.*$/, '/dist/');
    }
    // fallback: procurar o <script> do app.js no DOM
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src || '';
      if (src.indexOf('/dist/app.js') !== -1) {
        return src.replace(/\/dist\/app\.js.*$/, '/dist/');
      }
    }
  } catch (e) {}
  // último recurso: @main (pode ter lag de cache, mas o onerror faz fallback à Shopkit)
  return 'https://cdn.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/';
}

export const AQ_ASSET_BASE = computeBase();
