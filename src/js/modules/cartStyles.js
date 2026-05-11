/**
 * cartStyles.js — v2
 * Aplica tema escuro ao popup do carrinho.
 * Observer apenas para childList (sem attributes) para evitar loop infinito.
 */

const NEON   = '#08EEBC';
const DARK   = '#001531';
const STYLED = 'aq-styled';

// ── Tema escuro no popup ─────────────────────────────────────
function applyDarkCart(popup) {
  if (!popup || popup.getAttribute(STYLED)) return;
  popup.setAttribute(STYLED, '1');   // marca para não re-aplicar

  const set = (el, prop, val) => el && el.style.setProperty(prop, val, 'important');

  // Fundo principal
  set(popup, 'background',        DARK);
  set(popup, 'background-color',  DARK);
  set(popup, 'border',            '1px solid rgba(8,238,188,0.25)');
  set(popup, 'border-radius',     '14px');
  set(popup, 'box-shadow',        '0 20px 50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(8,238,188,0.1)');
  set(popup, 'overflow',          'hidden');
  set(popup, 'color',             '#fff');

  // Cart items
  popup.querySelectorAll('.cart-item').forEach(el => {
    set(el, 'border-bottom', '1px solid rgba(8,238,188,0.08)');
    set(el, 'background',    'transparent');
  });

  // Imagens
  popup.querySelectorAll('.item-image img').forEach(el => {
    set(el, 'border-radius', '8px');
    set(el, 'background',    'rgba(0,8,20,0.6)');
    set(el, 'border',        '1px solid rgba(8,238,188,0.12)');
    set(el, 'padding',       '4px');
  });

  // Nome
  popup.querySelectorAll('.item-product').forEach(el => {
    set(el, 'color',       '#cde4f8');
    set(el, 'font-weight', '500');
  });

  // Preço item
  popup.querySelectorAll('.details .price').forEach(el => {
    set(el, 'color',       NEON);
    set(el, 'font-weight', '700');
  });

  // Botão remover
  popup.querySelectorAll('a.remove').forEach(el => {
    set(el, 'background',      'transparent');
    set(el, 'border',          '1px solid rgba(8,238,188,0.2)');
    set(el, 'border-radius',   '50%');
    set(el, 'width',           '30px');
    set(el, 'height',          '30px');
    set(el, 'display',         'flex');
    set(el, 'align-items',     'center');
    set(el, 'justify-content', 'center');
    set(el, 'padding',         '0');
    set(el, 'box-shadow',      'none');
    el.querySelectorAll('svg, path').forEach(p => set(p, 'fill', NEON));
  });

  // Total
  const total = popup.querySelector('.cart-total');
  if (total) {
    set(total, 'background',      'rgba(8,238,188,0.03)');
    set(total, 'border-top',      '1px solid rgba(8,238,188,0.1)');
    set(total, 'padding',         '12px 16px');
    set(total, 'display',         'flex');
    set(total, 'justify-content', 'space-between');
    set(total, 'align-items',     'center');

    const tt = total.querySelectorAll('.cart-total-text');
    if (tt[0]) {
      set(tt[0], 'color',          'rgba(255,255,255,0.6)');
      set(tt[0], 'font-size',      '0.8rem');
      set(tt[0], 'text-transform', 'uppercase');
      set(tt[0], 'letter-spacing', '1px');
    }
    if (tt[1]) {
      set(tt[1], 'color',      NEON);
      set(tt[1], 'font-size',  '1.15rem');
      set(tt[1], 'font-weight','700');
    }
  }

  // Botões — lado a lado
  const btns = popup.querySelector('.cart-btns');
  if (btns) {
    set(btns, 'display',         'flex');
    set(btns, 'flex-direction',  'row');
    set(btns, 'gap',             '8px');
    set(btns, 'padding',         '12px 16px 16px');
    set(btns, 'background',      'transparent');
  }

  popup.querySelectorAll('.cart-btn').forEach(btn => {
    set(btn, 'background',       'transparent');
    set(btn, 'background-image', 'none');
    set(btn, 'border',           '1.5px solid ' + NEON);
    set(btn, 'border-radius',    '6px');
    set(btn, 'color',            NEON);
    set(btn, 'box-shadow',       'none');
    set(btn, 'text-shadow',      'none');
    set(btn, 'flex',             '1');
    set(btn, 'padding',          '11px 10px');
    set(btn, 'font-size',        '0.7rem');
    set(btn, 'font-weight',      '700');
    set(btn, 'text-transform',   'uppercase');
    set(btn, 'letter-spacing',   '1.5px');
    set(btn, 'text-decoration',  'none');
    set(btn, 'display',          'flex');
    set(btn, 'align-items',      'center');
    set(btn, 'justify-content',  'center');
    set(btn, 'text-align',       'center');

    btn.addEventListener('mouseenter', () => {
      btn.style.setProperty('background', NEON,  'important');
      btn.style.setProperty('color',      DARK,  'important');
      btn.style.setProperty('box-shadow', '0 0 16px rgba(8,238,188,0.4)', 'important');
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.setProperty('background', 'transparent', 'important');
      btn.style.setProperty('color',      NEON,          'important');
      btn.style.setProperty('box-shadow', 'none',        'important');
    });
  });

  console.log('[AQ] Cart dark theme applied');
}

// ── Badge com número ─────────────────────────────────────────
function updateBadge() {
  const link = document.querySelector('.link-cart');
  if (!link) return;

  // Tentar ler contagem de várias fontes
  let count = 0;
  const raw = link.dataset.count ?? link.dataset.qty ?? link.dataset.cartCount;
  if (raw !== undefined) {
    count = parseInt(raw, 10) || 0;
  }
  if (!count) {
    const el = link.querySelector('.count, .qty, [class*="count"], [class*="qty"]');
    if (el) count = parseInt(el.textContent.trim(), 10) || 0;
  }
  // Fallback: contar itens no popup se estiver aberto
  if (!count) {
    count = document.querySelectorAll('.cart-list .cart-item').length;
  }

  const hasProducts = link.classList.contains('has-products') || count > 0;
  let badge = link.querySelector('.aq-cart-badge');

  if (!hasProducts) {
    if (badge) badge.remove();
    return;
  }
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'aq-cart-badge';
    link.appendChild(badge);
  }
  if (count > 0) badge.textContent = String(count);
}

// ── Init ─────────────────────────────────────────────────────
export function initCartStyles() {
  // Estilizar popups já presentes
  document.querySelectorAll('.cart-list').forEach(applyDarkCart);
  updateBadge();

  // Observer APENAS para childList — sem attributes para evitar loop infinito
  new MutationObserver((mutations) => {
    let needsBadge = false;

    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node.classList?.contains('cart-list')) {
          applyDarkCart(node);
          needsBadge = true;
        }
        node.querySelectorAll?.('.cart-list').forEach(el => {
          applyDarkCart(el);
          needsBadge = true;
        });
      });
    });

    if (needsBadge) updateBadge();
  }).observe(document.body, {
    childList: true,
    subtree: true,
    // SEM attributes: true — evita o loop infinito!
  });
}
