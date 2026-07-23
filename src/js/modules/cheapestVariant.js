/**
 * cheapestVariant.js
 * Na pagina de produto com variantes, pre-seleciona a variante MAIS BARATA
 * ao abrir. O ShopKit abria conforme o slug/URL (ex.: as-visitherm-300w
 * mostrava a 300W a 21,50 EUR em vez da 25W a 18,20 EUR). Assim a pagina fica
 * alinhada com o "desde <menor preco>" dos cards da grelha.
 *
 * Como: o <select> de variante ja traz o preco no texto de cada option
 * ("25W - 18,20 EUR"). Escolhemos a mais barata (entre as disponiveis) e
 * disparamos 'change' — o ShopKit trata de actualizar preco, imagem, SKU e URL.
 *
 * Seguranca:
 *  - So actua quando ha UM unico <select> de variante (com >=2 options com
 *    preco). Com multiplos selects (cor+tamanho) a "mais barata" seria uma
 *    combinacao — nao arriscamos e saimos.
 *  - Corre uma vez no load (dataset.aqCheapest). Nao mexe se o utilizador ja
 *    escolheu (dataset.aqUserPicked, so eventos isTrusted).
 */

function parsePrice(txt) {
  var m = String(txt).match(/(\d+(?:[.,]\d{1,2})?)\s*€/);
  return m ? parseFloat(m[1].replace(',', '.')) : null;
}

function variantSelects() {
  return Array.prototype.filter.call(document.querySelectorAll('select'), function (sel) {
    var withPrice = Array.prototype.filter.call(sel.options, function (o) {
      return parsePrice(o.textContent) != null;
    });
    return withPrice.length >= 2;
  });
}

function pickCheapest() {
  var sels = variantSelects();
  if (sels.length !== 1) return sels.length === 0 ? false : true; // 0=ainda a hidratar; >1=nao arriscar
  var sel = sels[0];
  if (sel.dataset.aqCheapest) return true;
  sel.dataset.aqCheapest = '1';

  if (sel.dataset.aqUserPicked) return true;   // utilizador ja escolheu

  var best = null;
  Array.prototype.forEach.call(sel.options, function (o) {
    if (o.disabled) return;                     // salta esgotadas/indisponiveis
    var p = parsePrice(o.textContent);
    if (p == null) return;
    if (best === null || p < best.p) best = { o: o, p: p };
  });
  if (best && sel.value !== best.o.value) {
    sel.value = best.o.value;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  }
  return true;
}

export function initCheapestVariant() {
  if (!document.body.classList.contains('page-product')) return;

  // Se o utilizador escolher antes de nos, respeitamos (so eventos reais).
  document.addEventListener('change', function (e) {
    if (e.isTrusted && e.target && e.target.tagName === 'SELECT') {
      e.target.dataset.aqUserPicked = '1';
    }
  }, true);

  var n = 0;
  var iv = setInterval(function () {
    n++;
    if (pickCheapest() || n >= 25) clearInterval(iv);
  }, 200);
}
