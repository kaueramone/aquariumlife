/**
 * cartShipping.js
 * Portes de envio no Resumo do carrinho (/cart) — MODO INFORMATIVO (2026-07-27).
 *
 * O Shopkit mostra "A calcular" e so revela/soma os portes no checkout (etapa
 * final, ao escolher pagamento + tipo de entrega). Aqui, no carrinho inicial,
 * apenas INFORMAMOS as duas opcoes com valor estimado — SEM entrar na soma:
 *   - Entrega em casa (Portugal continental) ......... 8,20 EUR
 *   - Pick Point mais perto de si (Portugal continental) 3,99 EUR
 * (Valores estimados; grátis acima de 50 EUR — a escolha real e' no checkout.)
 *
 * IMPORTANTE: o Total do resumo fica IGUAL ao subtotal dos produtos (os portes
 * NAO sao somados nesta fase). Antes tinhamos radios que somavam — revertido a
 * pedido do Kaue: a soma volta a ser so no checkout nativo.
 *
 * Estrutura do Resumo (validada em producao):
 *   .cart-receipt .cart-wrap
 *     .cart-line                 "Subtotal" + valor
 *     .cart-line.margin-top      "Portes de envio" + .total-shipping "A calcular"
 *     .cart-line.margin-bottom-0 "Total" + valor
 *     .tax-included .text-muted  "Inclui IVA a X" (.total-taxes-value)
 *   Fora do resumo: .cart-total-text (total grande + sticky).
 *
 * Convive com o cartQuantity.js: re-corre em setTimeout(0) DEPOIS do recalculo
 * de quantidades, lendo os subtotais de linha (.cart-actual) ja atualizados.
 */

var FREE_FROM = 50;
var OPCOES = [
  { id: 'casa', nome: 'Entrega em casa', zona: 'Portugal continental', valor: 8.20 },
  { id: 'pick', nome: 'Pick Point mais perto de si', zona: 'Portugal continental', valor: 3.99 }
];
var IVA_RATE = 0.23;

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

  // Celula dos portes: apenas INFORMATIVO (nao entra na soma). Reaplica se o
  // Shopkit reescreveu a celula para "A calcular" (ex.: apos mudar quantidade).
  if (ship && !ship.querySelector('.aq-portes-info')) {
    ship.innerHTML = '<div class="aq-portes-info">'
      + OPCOES.map(function (o) {
          return '<span class="aq-porte-op">'
            + '<span class="aq-porte-nome">' + o.nome + ' <em>(' + o.zona + ')</em></span>'
            + '<b class="aq-porte-preco">' + formatPrice(o.valor) + '</b>'
            + '</span>';
        }).join('')
      + '<small class="aq-porte-nota">Valores estimados — escolhes a entrega no checkout · Grátis acima de ' + FREE_FROM + ' €</small>'
      + '</div>';
  }

  // Total = SO os produtos (os portes NAO sao somados nesta fase).
  var total = sub;
  var linhas = wrap.querySelectorAll('.cart-line');
  if (linhas.length) {
    var v0 = linhas[0].querySelectorAll('.cart-text')[1];
    if (v0) v0.textContent = formatPrice(sub);
  }
  var linhaTotal = wrap.querySelector('.cart-line.margin-bottom-0');
  if (linhaTotal) {
    var vT = linhaTotal.querySelectorAll('.cart-text')[1];
    if (vT) vT.textContent = formatPrice(total);
  }
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
