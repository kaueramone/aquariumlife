/**
 * cartQuantity.js
 * Recalculo do valor do carrinho ao mudar a quantidade.
 *
 * Nesta loja, os botoes +/- nativos do Shopkit nao alteram a quantidade nem
 * recalculam o total. Aqui assumimos o controlo: ao clicar +/- (ou editar o
 * input) incrementamos/decrementamos, recalculamos o subtotal de cada linha e
 * o total geral na hora, e persistimos no servidor em segundo plano.
 *
 * Estrutura de cada linha editavel (.cart-item.well-featured):
 *   .js-counter-minus  .js-counter-input  .js-counter-plus
 *   .semi-bold   -> preco unitario
 *   .cart-actual -> subtotal da linha (preco unitario x qty)
 * Totais: .cart-total-text (total)  /  .total-taxes-value (IVA incluido)
 */

var IVA_RATE = 0.23;

function parsePrice(txt) {
  if (!txt) return 0;
  var n = txt.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  var v = parseFloat(n);
  return isNaN(v) ? 0 : v;
}
function formatPrice(v) {
  var parts = v.toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts[0] + ',' + parts[1] + ' €';
}

function recalcCart() {
  var rows = document.querySelectorAll('.cart-item.well-featured');
  if (!rows.length) return;

  var grandTotal = 0;
  rows.forEach(function (row) {
    var input = row.querySelector('.js-counter-input');
    var unitEl = row.querySelector('.semi-bold');
    var subEl = row.querySelector('.cart-actual');
    if (!input || !unitEl || !subEl) return;

    var qty = parseInt(input.value, 10);
    if (isNaN(qty) || qty < 1) qty = 1;

    // preco unitario: fixado na 1a passagem (subtotal inicial / qty inicial)
    var unit = parseFloat(row.getAttribute('data-aq-unit'));
    if (isNaN(unit)) {
      var initialQty = parseInt(input.getAttribute('data-aq-iq') || input.value, 10) || 1;
      unit = parsePrice(unitEl.textContent) / initialQty;
      row.setAttribute('data-aq-unit', unit);
      input.setAttribute('data-aq-iq', input.value);
    }

    var sub = unit * qty;
    subEl.textContent = formatPrice(sub);
    grandTotal += sub;
  });

  var totalEl = document.querySelector('.cart-total-text');
  if (totalEl) totalEl.textContent = formatPrice(grandTotal);

  var taxEl = document.querySelector('.total-taxes-value');
  if (taxEl) taxEl.textContent = formatPrice(grandTotal - grandTotal / (1 + IVA_RATE));
}

// --- persistir no servidor (silencioso) --------------------------------
var saveTimer = null;
function persistQuantities() {
  var form = document.querySelector('form[action*="cart/post/data"]');
  if (!form) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(function () {
    try {
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin',
        redirect: 'manual'
      }).catch(function () {});
    } catch (e) {}
  }, 700);
}

function step(input, dir) {
  var q = parseInt(input.value, 10);
  if (isNaN(q)) q = 1;
  q = dir > 0 ? q + 1 : Math.max(1, q - 1);
  input.value = q;
  recalcCart();
  persistQuantities();
}

export function initCartQuantity() {
  if (!document.body.classList.contains('page-cart')) return;

  // calculo inicial (estabelece precos unitarios) — tentar ate o carrinho existir
  var attempts = 0;
  var iv = setInterval(function () {
    attempts++;
    if (document.querySelector('.cart-item.well-featured .js-counter-input')) {
      recalcCart();
      clearInterval(iv);
    } else if (attempts >= 20) {
      clearInterval(iv);
    }
  }, 250);

  if (document.body.hasAttribute('data-aq-qty-bound')) return;
  document.body.setAttribute('data-aq-qty-bound', '1');

  // Delegacao no document em CAPTURE: sobrevive a re-renders do Shopkit e
  // corre antes do (inativo) handler nativo. Assumimos o +/- por completo.
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.js-counter-plus, .js-counter-minus');
    if (!btn) return;
    var row = btn.closest('.cart-item.well-featured');
    if (!row) return;
    var input = row.querySelector('.js-counter-input');
    if (!input) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    step(input, btn.classList.contains('js-counter-plus') ? 1 : -1);
  }, true);

  // edicao manual do input
  document.addEventListener('input', function (e) {
    if (e.target.classList && e.target.classList.contains('js-counter-input')) {
      recalcCart();
      persistQuantities();
    }
  }, false);
  document.addEventListener('change', function (e) {
    if (e.target.classList && e.target.classList.contains('js-counter-input')) {
      recalcCart();
      persistQuantities();
    }
  }, false);
}
