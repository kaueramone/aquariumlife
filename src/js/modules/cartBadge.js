/**
 * cartBadge.js
 * Injeta badge verde com número de itens no ícone do carrinho.
 * Lê a contagem do .link-cart via data-count, texto ou DOM.
 */

function getCartCount() {
  // Tenta data-count / data-qty no link-cart
  const link = document.querySelector('.link-cart');
  if (!link) return 0;

  const fromData =
    link.dataset.count ||
    link.dataset.qty   ||
    link.dataset.cartCount;
  if (fromData) return parseInt(fromData, 10) || 0;

  // Tenta um elemento filho com classe de count/qty
  const countEl = link.querySelector(
    '.cart-count, .cart-qty, .count, .qty, [class*="count"], [class*="qty"]'
  );
  if (countEl) return parseInt(countEl.textContent, 10) || 0;

  // Se tem classe has-products, pelo menos 1 item
  if (link.classList.contains('has-products')) return null; // mostra sem número
  return 0;
}

function updateCartBadge() {
  const link = document.querySelector('.link-cart');
  if (!link) return;

  let badge = link.querySelector('.aq-cart-badge');

  const count = getCartCount();
  const hasProducts = link.classList.contains('has-products');

  if (!hasProducts && count === 0) {
    if (badge) badge.remove();
    return;
  }

  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'aq-cart-badge';
    link.appendChild(badge);
  }

  badge.textContent = count !== null ? String(count) : '';
}

export function initCartBadge() {
  updateCartBadge();

  // Observa mudanças no .link-cart (Shopkit atualiza atributos e classes ao adicionar)
  const link = document.querySelector('.link-cart');
  if (link) {
    new MutationObserver(updateCartBadge).observe(link, {
      attributes: true,
      subtree: true,
      childList: true,
    });
  }

  // Observa o body para quando o link for injetado dinamicamente
  new MutationObserver(() => {
    updateCartBadge();
  }).observe(document.body, { childList: true, subtree: false });
}
