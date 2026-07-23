/**
 * cartShipping.js
 * Portes de envio no Resumo do carrinho (/cart).
 *
 * O Shopkit mostra "A calcular" e so revela os portes no checkout. Como os
 * valores sao fixos para Portugal continental, mostramos ja as duas opcoes
 * (pedido Kaue 2026-07-23):
 *   - Entrega em casa (Portugal continental) ......... 8,20 EUR
 *   - Pick Point mais perto de si (Portugal continental) 3,99 EUR
 * O cliente escolhe e o Resumo atualiza na hora (portes + total + IVA).
 * Subtotal >= 50 EUR -> portes gratis (opcoes dao lugar a "Gratis").
 * Sem escolha feita, o total fica igual ao subtotal (como o nativo).
 *
 * Estrutura do Resumo (validada em producao 2026-07-23):
 *   .cart-receipt .cart-wrap
 *     .cart-line                 .cart-text "Subtotal" + .cart-text valor
 *     .cart-line.margin-top      .cart-text "Portes de envio" + .cart-text.total-shipping "A calcular"
 *     .cart-line.margin-bottom-0 .cart-text "Total" + .cart-text valor
 *     .tax-included .text-muted  "Inclui IVA a X" (.total-taxes-value)
 * Fora do resumo: .cart-total-text (2x, total grande + sticky).
 *
 * Convive com o cartQuantity.js (que corre em CAPTURE nos +/-): os nossos
 * listeners correm em bubble + setTimeout(0), sempre DEPOIS do recalculo
 * de quantidades, e leem os subtotais de linha (.cart-actual) ja atualizados.
 */

var FREE_FROM = 50;
var OPCOES = [
  { id: 'casa', nome: 'Entrega em casa', zona: 'Portugal continental', valor: 8.20 },
  { id: 'pick', nome: 'Pick Point mais perto de si', zona: 'Portugal continental', valor: 3.99 }
];
var IVA_RATE = 0.23;

var escolha = null; // 'casa' | 'pick' | null

function parsePrice(txt) {
  if (!txt) return 0;
  var n = String(txt).replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  var v = parseFloat(n);
  return isNaN(v) ? 0 : v;
}
function formatPrice(v) {
  var parts = v.toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts[0] + ',' + parts[1] + ' €';
}

function wrapResumo() {
  var ship = document.querySelector('.cart-receipt .total-shipping');
  return ship ? ship.closest('.cart-wrap') : null;
}

// Subtotal = soma dos subtotais de linha (mantidos pelo cartQuantity).
// Fallback: valor da propria linha "Subtotal" do resumo.
function subtotalAtual(wrap) {
  var subs = document.querySelectorAll('.cart-item.well-featured .cart-actual');
  var tot = 0;
  if (subs.length) {
    subs.forEach(function (el) { tot += parsePrice(el.textContent); });
    return tot;
  }
  var linha = wrap.querySelector('.cart-line .cart-text + .cart-text');
  return linha ? parsePrice(linha.textContent) : 0;
}

function render() {
  var wrap = wrapResumo();
  if (!wrap) return;
  var ship = wrap.querySelector('.total-shipping');
  var sub = subtotalAtual(wrap);
  var gratis = sub >= FREE_FROM;

  // celula dos portes: "Gratis" ou as duas opcoes
  if (gratis) {
    if (!ship.querySelector('.aq-porte-gratis')) {
      ship.innerHTML = '<span class="aq-porte-gratis">Grátis</span>';
    }
  } else if (!ship.querySelector('.aq-portes')) {
    ship.innerHTML = '<div class="aq-portes">' + OPCOES.map(function (o) {
      return '<label class="aq-porte">'
        + '<input type="radio" name="aq_porte" value="' + o.id + '"' + (escolha === o.id ? ' checked' : '') + '>'
        + '<span class="aq-porte-nome">' + o.nome + ' <em>(' + o.zona + ')</em></span>'
        + '<b class="aq-porte-preco">' + formatPrice(o.valor) + '</b>'
        + '</label>';
    }).join('') + '</div>';
  }

  var op = OPCOES.find(function (o) { return o.id === escolha; });
  var portes = (gratis || !op) ? 0 : op.valor;
  var total = sub + portes;

  // linha Subtotal (1a .cart-line do resumo)
  var linhas = wrap.querySelectorAll('.cart-line');
  if (linhas.length) {
    var v0 = linhas[0].querySelectorAll('.cart-text')[1];
    if (v0) v0.textContent = formatPrice(sub);
  }
  // linha Total
  var linhaTotal = wrap.querySelector('.cart-line.margin-bottom-0');
  if (linhaTotal) {
    var vT = linhaTotal.querySelectorAll('.cart-text')[1];
    if (vT) vT.textContent = formatPrice(total);
  }
  // totais grandes fora do resumo + IVA
  document.querySelectorAll('.cart-total-text').forEach(function (el) {
    el.textContent = formatPrice(total);
  });
  document.querySelectorAll('.total-taxes-value').forEach(function (el) {
    el.textContent = formatPrice(total - total / (1 + IVA_RATE));
  });
}

export function initCartShipping() {
  var b = document.body;
  if (!b.classList.contains('page-cart') || b.classList.contains('cart-data')) return;
  if (b.hasAttribute('data-aq-portes-bound')) return;
  b.setAttribute('data-aq-portes-bound', '1');

  try { escolha = sessionStorage.getItem('aq-porte') || null; } catch (e) {}
  if (escolha !== 'casa' && escolha !== 'pick') escolha = null;

  // escolha de portes
  document.addEventListener('change', function (e) {
    if (e.target && e.target.name === 'aq_porte') {
      escolha = e.target.value;
      try { sessionStorage.setItem('aq-porte', escolha); } catch (err) {}
      render();
    }
  }, false);

  // depois de qualquer mexida nas quantidades (cartQuantity corre primeiro)
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.js-counter-plus, .js-counter-minus')) {
      setTimeout(render, 0);
    }
  }, false);
  ['input', 'change'].forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      if (e.target.classList && e.target.classList.contains('js-counter-input')) {
        setTimeout(render, 0);
      }
    }, false);
  });

  // arranque: espera o resumo existir (mesmo padrao do cartQuantity)
  var attempts = 0;
  var iv = setInterval(function () {
    attempts++;
    if (wrapResumo()) {
      render();
      clearInterval(iv);
    } else if (attempts >= 20) {
      clearInterval(iv);
    }
  }, 250);
}
