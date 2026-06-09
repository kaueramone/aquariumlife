/**
 * nativeFixes.js
 * Correcoes de conteudo gerado nativamente pelo Shopkit que nao se conseguem
 * fazer so com CSS. Cada fix e idempotente e seguro.
 */

// 1. Concordancia singular/plural do stock
function fixStockText() {
  if (!document.body.classList.contains('page-product')) return;
  document.querySelectorAll('.stock-number, .stock, .card-stock .stock').forEach(function (el) {
    var txt = el.textContent;
    var fixed = txt.replace(/\b1\s+unidades\b/i, '1 unidade');
    if (fixed !== txt) el.textContent = fixed;
  });
}

// 2. Botao CHECKOUT -> Finalizar compra
function fixCheckoutButton() {
  var candidates = document.querySelectorAll(
    '.btn-checkout, a[href*="/cart/data"], a[href*="checkout"], .cart .btn-primary, .cart-summary a.btn'
  );
  candidates.forEach(function (el) {
    var t = (el.textContent || '').trim();
    if (/^check\s*out$/i.test(t)) {
      el.textContent = 'Finalizar compra';
    }
  });
}

// 3. SEO: titulo / H1 / meta description da homepage
var SEO_TITLE = 'AquariumLife — Loja de Aquariofilia e Aquascaping em Portugal';
var SEO_DESC  = 'Equipamento, plantas, peixes, hardscape e acessorios para o teu aquario. '
              + 'As melhores marcas de aquarismo com envio para todo o pais.';

function fixHomeSeo() {
  var path = window.location.pathname;
  var isHome = path === '/' || path === '' || path === '/index';
  if (!isHome) return;

  if (/^aquariumlife$/i.test((document.title || '').trim())) {
    document.title = SEO_TITLE;
  }

  var meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    document.head.appendChild(meta);
  }
  if (!meta.getAttribute('content')) {
    meta.setAttribute('content', SEO_DESC);
  }

  var h1 = document.querySelector('h1');
  if (h1 && /^aquariumlife$/i.test(h1.textContent.trim())) {
    var sr = document.createElement('span');
    sr.className = 'aq-visually-hidden';
    sr.textContent = SEO_TITLE;
    h1.appendChild(sr);
  }
}

// 4. Pagina 404 — marca o body e injeta atalhos uteis (se o nosso codigo correr la)
function fixErrorPage() {
  if (document.getElementById('aq-404-actions')) return;

  var txt = (document.body.textContent || '').toLowerCase();
  var looks404 = /ooops|p[áa]gina n[ãa]o encontrada|n[ãa]o se encontra dispon/i.test(txt)
              && !document.querySelector('header, .header, .aq-nav-bar');
  if (!looks404) return;

  document.body.classList.add('page-404');

  var anchor = document.querySelector('.main, .container, body');
  if (!anchor) return;

  var box = document.createElement('div');
  box.id = 'aq-404-actions';
  box.className = 'aq-404-actions';
  box.innerHTML =
    '<a href="/">Voltar à página inicial</a>' +
    '<a href="/catalog">Ver todos os produtos</a>' +
    '<a href="/category/equipamento">Equipamento</a>' +
    '<a href="/category/plantas">Plantas</a>' +
    '<a href="/contact">Contactar-nos</a>';
  anchor.appendChild(box);
}

// 5. Perfil/checkout: idioma PT-PT e Pais Portugal Continental por defeito,
//    e sincronizar os widgets niceSelect (que mostravam "vazio" por o texto
//    branco ficar sobre fundo branco / por nao refletirem o <select> nativo).
function setSelectDefault(id, preferredValues) {
  var sel = document.getElementById(id);
  if (!sel) return false;
  var cur = sel.value;
  // so define defeito se estiver vazio ou num valor que queremos corrigir
  var needsDefault = !cur || preferredValues.indexOf(cur) === -1;
  if (needsDefault) {
    for (var i = 0; i < preferredValues.length; i++) {
      var pv = preferredValues[i];
      var opt = Array.prototype.find
        ? Array.prototype.find.call(sel.options, function (o) { return o.value === pv; })
        : null;
      if (opt) { sel.value = pv; return true; }
    }
  }
  return false;
}

function fixProfileDefaults() {
  if (!document.body.classList.contains('page-account') &&
      !document.body.classList.contains('page-cart')) return;

  // Idioma: preferir pt_PT; corrigir se estiver vazio, pt_BR ou pt generico
  setSelectDefault('locale', ['pt_PT']);
  // Pais: preferir Portugal Continental (PRT)
  setSelectDefault('delivery_country', ['PRT']);
  setSelectDefault('billing_country', ['PRT']);

  // Sincronizar os widgets niceSelect com os <select> nativos
  var $ = window.jQuery;
  if ($ && $.fn && $.fn.niceSelect) {
    ['#locale', '#gender', '#delivery_country', '#billing_country'].forEach(function (sel) {
      try { $(sel).niceSelect('update'); } catch (e) {}
    });
  }
}

function runFixes() {
  fixStockText();
  fixCheckoutButton();
  fixHomeSeo();
  fixErrorPage();
  fixProfileDefaults();
}

export function initNativeFixes() {
  runFixes();
  var attempts = 0;
  var interval = setInterval(function () {
    attempts++;
    runFixes();
    if (attempts >= 15) clearInterval(interval);
  }, 300);
}
