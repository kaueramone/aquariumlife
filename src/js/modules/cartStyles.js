/**
 * cartStyles.js — v3
 * - Tema escuro no mini-cart popup (.cart-list)
 * - Badge ! no ícone do carrinho
 * - Tema escuro + z-index no popup pós-compra (modal Bootstrap/Shopkit)
 */

const NEON = '#08EEBC';
const DARK = '#001531';
const STYLED = 'aq-styled';

// ── Mini-cart popup (.cart-list) ─────────────────────────────
function applyDarkCart(popup) {
  if (!popup || popup.getAttribute(STYLED)) return;
  popup.setAttribute(STYLED, '1');

  const set = (el, p, v) => el && el.style.setProperty(p, v, 'important');

  set(popup, 'background',       DARK);
  set(popup, 'background-color', DARK);
  set(popup, 'border',           '1px solid rgba(8,238,188,0.25)');
  set(popup, 'border-radius',    '14px');
  set(popup, 'box-shadow',       '0 20px 50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(8,238,188,0.1)');
  set(popup, 'overflow',         'hidden');
  set(popup, 'color',            '#fff');

  popup.querySelectorAll('.cart-item').forEach(el => {
    set(el, 'border-bottom', '1px solid rgba(8,238,188,0.08)');
    set(el, 'background', 'transparent');
  });
  popup.querySelectorAll('.item-image img').forEach(el => {
    set(el, 'border-radius', '8px');
    set(el, 'background', 'rgba(0,8,20,0.6)');
    set(el, 'border', '1px solid rgba(8,238,188,0.12)');
    set(el, 'padding', '4px');
  });
  popup.querySelectorAll('.item-product').forEach(el => {
    set(el, 'color', '#cde4f8');
    set(el, 'font-weight', '500');
  });
  popup.querySelectorAll('.details .price').forEach(el => {
    set(el, 'color', NEON);
    set(el, 'font-weight', '700');
  });
  popup.querySelectorAll('a.remove').forEach(el => {
    set(el, 'background', 'transparent');
    set(el, 'border', '1px solid rgba(8,238,188,0.2)');
    set(el, 'border-radius', '50%');
    set(el, 'width', '30px'); set(el, 'height', '30px');
    set(el, 'display', 'flex');
    set(el, 'align-items', 'center');
    set(el, 'justify-content', 'center');
    set(el, 'padding', '0');
    set(el, 'box-shadow', 'none');
    el.querySelectorAll('svg, path').forEach(p => set(p, 'fill', NEON));
  });

  const total = popup.querySelector('.cart-total');
  if (total) {
    set(total, 'background', 'rgba(8,238,188,0.03)');
    set(total, 'border-top', '1px solid rgba(8,238,188,0.1)');
    set(total, 'padding', '12px 16px');
    set(total, 'display', 'flex');
    set(total, 'justify-content', 'space-between');
    set(total, 'align-items', 'center');
    const tt = total.querySelectorAll('.cart-total-text');
    if (tt[0]) { set(tt[0], 'color', 'rgba(255,255,255,0.6)'); set(tt[0], 'font-size', '0.8rem'); set(tt[0], 'text-transform', 'uppercase'); set(tt[0], 'letter-spacing', '1px'); }
    if (tt[1]) { set(tt[1], 'color', NEON); set(tt[1], 'font-size', '1.15rem'); set(tt[1], 'font-weight', '700'); }
  }

  const btns = popup.querySelector('.cart-btns');
  if (btns) {
    set(btns, 'display', 'flex'); set(btns, 'flex-direction', 'row');
    set(btns, 'gap', '8px'); set(btns, 'padding', '12px 16px 16px');
    set(btns, 'background', 'transparent');
  }
  popup.querySelectorAll('.cart-btn').forEach(btn => styleNeonBtn(btn));

  console.log('[AQ] Cart dark theme applied');
}

// ── Popup pós-compra (modal Bootstrap/Shopkit) ───────────────
function applyDarkModal(modal) {
  if (!modal || modal.getAttribute(STYLED)) return;
  modal.setAttribute(STYLED, '1');

  const set = (el, p, v) => el && el.style.setProperty(p, v, 'important');

  // Z-index acima do header (9999) e do overlay
  set(modal, 'z-index', '10100');

  // Overlay do modal
  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) {
    set(backdrop, 'z-index', '10050');
    set(backdrop, 'background', 'rgba(0,4,13,0.75)');
  }

  // Caixa interna do modal
  const content = modal.querySelector('.modal-content') || modal;
  set(content, 'background',       DARK);
  set(content, 'background-color', DARK);
  set(content, 'border',           '1px solid rgba(8,238,188,0.25)');
  set(content, 'border-radius',    '14px');
  set(content, 'box-shadow',       '0 20px 50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(8,238,188,0.1)');
  set(content, 'color',            '#fff');

  // Header do modal
  const mHeader = modal.querySelector('.modal-header');
  if (mHeader) {
    set(mHeader, 'background',   'transparent');
    set(mHeader, 'border-bottom','1px solid rgba(8,238,188,0.1)');
    set(mHeader, 'padding',      '16px 20px');
    mHeader.querySelectorAll('h1,h2,h3,h4,h5,h6,.modal-title').forEach(el => {
      set(el, 'color', '#fff');
      set(el, 'font-weight', '600');
    });
    // Botão fechar (X)
    const closeBtn = mHeader.querySelector('.close, [data-dismiss="modal"], button');
    if (closeBtn) {
      set(closeBtn, 'color', 'rgba(255,255,255,0.5)');
      set(closeBtn, 'background', 'transparent');
      set(closeBtn, 'border', 'none');
      set(closeBtn, 'font-size', '1.4rem');
      set(closeBtn, 'opacity', '1');
    }
  }

  // Body do modal
  const mBody = modal.querySelector('.modal-body');
  if (mBody) {
    set(mBody, 'background', 'transparent');
    set(mBody, 'padding', '16px 20px');
    mBody.querySelectorAll('p, span, div, label').forEach(el => set(el, 'color', 'rgba(255,255,255,0.85)'));
    mBody.querySelectorAll('img').forEach(el => {
      set(el, 'border-radius', '8px');
      set(el, 'background', 'rgba(0,8,20,0.6)');
      set(el, 'border', '1px solid rgba(8,238,188,0.12)');
      set(el, 'padding', '4px');
    });
    mBody.querySelectorAll('[class*="price"], .price, strong').forEach(el => {
      set(el, 'color', NEON);
      set(el, 'font-weight', '700');
    });
  }

  // Footer do modal — botões
  const mFooter = modal.querySelector('.modal-footer');
  if (mFooter) {
    set(mFooter, 'background', 'transparent');
    set(mFooter, 'border-top', '1px solid rgba(8,238,188,0.1)');
    set(mFooter, 'padding', '12px 20px 16px');
    set(mFooter, 'display', 'flex');
    set(mFooter, 'gap', '8px');
    mFooter.querySelectorAll('a, button, .btn').forEach(btn => styleNeonBtn(btn));
  }

  // Se não tiver footer, procurar botões no body
  if (!mFooter) {
    modal.querySelectorAll('a.btn, button.btn, .btn').forEach(btn => styleNeonBtn(btn));
  }

  console.log('[AQ] Modal dark theme applied');
}

// ── Estilo neon para botões ───────────────────────────────────
function styleNeonBtn(btn) {
  const set = (p, v) => btn.style.setProperty(p, v, 'important');
  set('background',       'transparent');
  set('background-image', 'none');
  set('border',           '1.5px solid ' + NEON);
  set('border-radius',    '6px');
  set('color',            NEON);
  set('box-shadow',       'none');
  set('text-shadow',      'none');
  set('flex',             '1');
  set('padding',          '11px 10px');
  set('font-size',        '0.72rem');
  set('font-weight',      '700');
  set('text-transform',   'uppercase');
  set('letter-spacing',   '1.5px');
  set('text-decoration',  'none');
  set('display',          'flex');
  set('align-items',      'center');
  set('justify-content',  'center');
  set('text-align',       'center');
  set('cursor',           'pointer');

  if (!btn._aqHover) {
    btn._aqHover = true;
    btn.addEventListener('mouseenter', () => {
      btn.style.setProperty('background', NEON, 'important');
      btn.style.setProperty('color', DARK, 'important');
      btn.style.setProperty('box-shadow', '0 0 16px rgba(8,238,188,0.4)', 'important');
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.setProperty('background', 'transparent', 'important');
      btn.style.setProperty('color', NEON, 'important');
      btn.style.setProperty('box-shadow', 'none', 'important');
    });
  }
}

// ── Badge ! no ícone do carrinho ─────────────────────────────
function updateBadge() {
  const link = document.querySelector('.link-cart');
  if (!link) return;

  const hasProducts = link.classList.contains('has-products') ||
    document.querySelectorAll('.cart-list .cart-item').length > 0;

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
  badge.textContent = '!';
}

// ── Init ─────────────────────────────────────────────────────
export function initCartStyles() {
  document.querySelectorAll('.cart-list').forEach(applyDarkCart);
  document.querySelectorAll('.modal.show, .modal.in, [class*="cart-modal"]').forEach(applyDarkModal);
  updateBadge();

  new MutationObserver((mutations) => {
    let needsBadge = false;
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        // Mini-cart
        if (node.classList?.contains('cart-list')) { applyDarkCart(node); needsBadge = true; }
        node.querySelectorAll?.('.cart-list').forEach(el => { applyDarkCart(el); needsBadge = true; });
        // Modal pós-compra
        if (node.classList?.contains('modal') || node.classList?.contains('modal-dialog')) {
          applyDarkModal(node.classList.contains('modal') ? node : node.closest('.modal') || node);
        }
        node.querySelectorAll?.('.modal').forEach(applyDarkModal);
        // Backdrop
        if (node.classList?.contains('modal-backdrop')) {
          node.style.setProperty('z-index', '10050', 'important');
          node.style.setProperty('background', 'rgba(0,4,13,0.75)', 'important');
        }
      });
    });
    if (needsBadge) updateBadge();
  }).observe(document.body, { childList: true, subtree: true });
}
