const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const source = readFileSync('src/js/modules/cartShipping.js', 'utf8')
  .replace('export function', 'function');

function setup(path = '/cart', price = 'A calcular', noticeText = '') {
  const ship = { textContent: price };
  const notice = { textContent: noticeText };
  const attributes = new Set();
  let shippingNodes = [ship];
  let callback;
  let observers = 0;
  const context = vm.createContext({
    window: { location: { pathname: path } },
    document: {
      body: {
        hasAttribute: name => attributes.has(name),
        setAttribute: name => attributes.add(name)
      },
      querySelectorAll(selector) {
        if (selector === '.store-notice-text') return [notice];
        if (selector === '.cart-receipt .total-shipping') return shippingNodes;
        throw new Error('Unexpected access to native content: ' + selector);
      }
    },
    MutationObserver: class {
      constructor(fn) { callback = fn; observers++; }
      observe() {}
    }
  });
  vm.runInContext(source, context);
  return {
    ship, notice,
    init: () => context.initCartShipping(),
    mutate: () => callback(),
    setNodes: nodes => { shippingNodes = nodes; },
    observers: () => observers
  };
}

test('clarifies pending shipping and preserves a later native quotation', () => {
  const page = setup();
  page.init();
  assert.match(page.ship.textContent, /após indicar a morada/);
  page.mutate();
  page.ship.textContent = '5,66 €';
  page.mutate();
  assert.equal(page.ship.textContent, '5,66 €');
  page.ship.textContent = '7,20 €';
  page.mutate();
  assert.equal(page.ship.textContent, '7,20 €');
});

test('preserves free shipping, unavailable states and native values', () => {
  for (const value of ['0,00 €', 'Grátis', '3,96 €', 'Sem métodos disponíveis', '']) {
    const page = setup('/cart', value);
    page.init();
    assert.equal(page.ship.textContent, value);
  }
});

test('handles late or replaced summaries and binds only once', () => {
  const page = setup('/cart/');
  page.setNodes([]);
  page.init();
  page.init();
  assert.equal(page.observers(), 1);
  const replacement = { textContent: 'A calcular' };
  page.setNodes([replacement]);
  page.mutate();
  assert.match(replacement.textContent, /checkout/);
});

test('never rewrites shipping on checkout steps', () => {
  for (const path of ['/cart/data', '/cart/payment', '/cart/confirm', '/']) {
    const page = setup(path);
    page.init();
    assert.equal(page.ship.textContent, 'A calcular');
    assert.equal(page.observers(), 0);
  }
});

test('replaces only the known legacy notice, preserving new merchant messages', () => {
  const page = setup('/', '', 'Portes grátis para encomendas superiores a 50 euros*');
  page.init();
  assert.equal(page.notice.textContent, 'Consulta os portes e as condições de entrega no checkout.');
  const updated = setup('/', '', 'Entregas com condições especiais esta semana');
  updated.init();
  assert.equal(updated.notice.textContent, 'Entregas com condições especiais esta semana');
});

test('quantity changes update pending summaries but preserve quoted totals', () => {
  const quantitySource = readFileSync('src/js/modules/cartQuantity.js', 'utf8')
    .replace('export function', 'function');
  for (const price of ['A calcular', 'Portes calculados no checkout após indicar a morada.', '5,66 €', '0,00 €']) {
    const input = { value: '2' };
    const line = { textContent: '10,00 €' };
    const subtotal = { textContent: '10,00 €' };
    const total = { textContent: '15,66 €' };
    const tax = { textContent: '2,93 €' };
    const wrap = {
      querySelector: selector => selector.includes('margin-bottom-0') ? total : subtotal
    };
    const row = {
      getAttribute: () => '10',
      querySelector: selector => ({
        '.js-counter-input': input, '.semi-bold': { textContent: '10,00 €' }, '.cart-actual': line
      })[selector]
    };
    const context = vm.createContext({
      document: {
        querySelectorAll: () => [row],
        querySelector: selector => ({
          '.cart-receipt .total-shipping': { textContent: price, closest: () => wrap },
          '.cart-total-text': total, '.total-taxes-value': tax
        })[selector]
      }
    });
    vm.runInContext(quantitySource, context);
    context.recalcCart();
    assert.equal(line.textContent, '20,00 €');
    if (price.endsWith('€')) {
      assert.equal(total.textContent, '15,66 €');
      assert.equal(tax.textContent, '2,93 €');
    } else {
      assert.equal(total.textContent, '20,00 €');
      assert.equal(subtotal.textContent, '20,00 €');
    }
  }
});
