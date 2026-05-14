/**
 * cartStyles.js - v4
 * - Tema escuro no mini-cart popup (.cart-list)
 * - Badge ! no icone do carrinho
 * - Tema escuro + centralizacao no popup pos-compra (modal Bootstrap/Shopkit)
 * - Observer escuta class e style para capturar modal ja existente no DOM
 */

var NEON = '#08EEBC';
var DARK = '#001531';
var STYLED = 'aq-styled';

function applyDarkCart(popup) {
  if (!popup || popup.getAttribute(STYLED)) return;
  popup.setAttribute(STYLED, '1');

  var set = function(el, p, v) { if (el) el.style.setProperty(p, v, 'important'); };

  set(popup, 'background',       DARK);
  set(popup, 'background-color', DARK);
  set(popup, 'border',           '1px solid rgba(8,238,188,0.25)');
  set(popup, 'border-radius',    '14px');
  set(popup, 'box-shadow',       '0 20px 50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(8,238,188,0.1)');
  set(popup, 'overflow',         'hidden');
  set(popup, 'color',            '#fff');

  popup.querySelectorAll('.cart-item').forEach(function(el) {
    set(el, 'border-bottom', '1px solid rgba(8,238,188,0.08)');
    set(el, 'background', 'transparent');
  });
  popup.querySelectorAll('.item-image img').forEach(function(el) {
    set(el, 'border-radius', '8px');
    set(el, 'background', 'rgba(0,8,20,0.6)');
    set(el, 'border', '1px solid rgba(8,238,188,0.12)');
    set(el, 'padding', '4px');
  });
  popup.querySelectorAll('.item-product').forEach(function(el) {
    set(el, 'color', '#cde4f8');
    set(el, 'font-weight', '500');
  });
  popup.querySelectorAll('.details .price').forEach(function(el) {
    set(el, 'color', NEON);
    set(el, 'font-weight', '700');
  });
  popup.querySelectorAll('a.remove').forEach(function(el) {
    set(el, 'background', 'transparent');
    set(el, 'border', '1px solid rgba(8,238,188,0.2)');
    set(el, 'border-radius', '50%');
    set(el, 'width', '30px');
    set(el, 'height', '30px');
    set(el, 'display', 'flex');
    set(el, 'align-items', 'center');
    set(el, 'justify-content', 'center');
    set(el, 'padding', '0');
    set(el, 'box-shadow', 'none');
    el.querySelectorAll('svg, path').forEach(function(p) { set(p, 'fill', NEON); });
  });

  var total = popup.querySelector('.cart-total');
  if (total) {
    set(total, 'background', 'rgba(8,238,188,0.03)');
    set(total, 'border-top', '1px solid rgba(8,238,188,0.1)');
    set(total, 'padding', '12px 16px');
    set(total, 'display', 'flex');
    set(total, 'justify-content', 'space-between');
    set(total, 'align-items', 'center');
    var tt = total.querySelectorAll('.cart-total-text');
    if (tt[0]) {
      set(tt[0], 'color', 'rgba(255,255,255,0.6)');
      set(tt[0], 'font-size', '0.8rem');
      set(tt[0], 'text-transform', 'uppercase');
      set(tt[0], 'letter-spacing', '1px');
    }
    if (tt[1]) {
      set(tt[1], 'color', NEON);
      set(tt[1], 'font-size', '1.15rem');
      set(tt[1], 'font-weight', '700');
    }
  }

  var btns = popup.querySelector('.cart-btns');
  if (btns) {
    set(btns, 'display', 'flex');
    set(btns, 'flex-direction', 'row');
    set(btns, 'gap', '8px');
    set(btns, 'padding', '12px 16px 16px');
    set(btns, 'background', 'transparent');
  }
  popup.querySelectorAll('.cart-btn').forEach(styleNeonBtn);

  console.log('[AQ] Cart dark theme applied');
}

function applyDarkModal(modal) {
  if (!modal || modal.getAttribute(STYLED)) return;
  modal.setAttribute(STYLED, '1');

  var set = function(el, p, v) { if (el) el.style.setProperty(p, v, 'important'); };

  set(modal, 'z-index',         '10100');
  set(modal, 'display',         'flex');
  set(modal, 'align-items',     'center');
  set(modal, 'justify-content', 'center');
  set(modal, 'padding',         '20px');
  set(modal, 'overflow-y',      'auto');

  var dialog = modal.querySelector('.modal-dialog');
  if (dialog) {
    set(dialog, 'position',  'relative');
    set(dialog, 'margin',    'auto');
    set(dialog, 'top',       'auto');
    set(dialog, 'left',      'auto');
    set(dialog, 'transform', 'none');
    set(dialog, 'max-width', '480px');
    set(dialog, 'width',     '100%');
  }

  var backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) {
    set(backdrop, 'z-index',    '10050');
    set(backdrop, 'background', 'rgba(0,4,13,0.82)');
    set(backdrop, 'opacity',    '1');
  }

  var content = modal.querySelector('.modal-content') || modal;
  set(content, 'background',       DARK);
  set(content, 'background-color', DARK);
  set(content, 'border',           '1px solid rgba(8,238,188,0.25)');
  set(content, 'border-radius',    '14px');
  set(content, 'box-shadow',       '0 20px 50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(8,238,188,0.1)');
  set(content, 'color',            '#fff');

  var mHeader = modal.querySelector('.modal-header');
  if (mHeader) {
    set(mHeader, 'background',    'transparent');
    set(mHeader, 'border-bottom', '1px solid rgba(8,238,188,0.1)');
    set(mHeader, 'padding',       '16px 20px');
    mHeader.querySelectorAll('h1,h2,h3,h4,h5,h6,.modal-title').forEach(function(el) {
      set(el, 'color', '#fff');
      set(el, 'font-weight', '600');
    });
    var closeBtn = mHeader.querySelector('.close, [data-dismiss="modal"], button');
    if (closeBtn) {
      set(closeBtn, 'color',       'rgba(255,255,255,0.5)');
      set(closeBtn, 'background',  'transparent');
      set(closeBtn, 'border',      'none');
      set(closeBtn, 'font-size',   '1.4rem');
      set(closeBtn, 'opacity',     '1');
      set(closeBtn, 'text-shadow', 'none');
    }
  }

  var mBody = modal.querySelector('.modal-body');
  if (mBody) {
    set(mBody, 'background', 'transparent');
    set(mBody, 'padding',    '24px 20px');
    mBody.querySelectorAll('p, span, label').forEach(function(el) {
      set(el, 'color', 'rgba(255,255,255,0.85)');
    });
    mBody.querySelectorAll('h2, h3, h4').forEach(function(el) {
      set(el, 'color', '#fff');
      set(el, 'font-weight', '600');
    });
    mBody.querySelectorAll('img').forEach(function(el) {
      set(el, 'border-radius', '8px');
      set(el, 'background',    'rgba(0,8,20,0.6)');
      set(el, 'border',        '1px solid rgba(8,238,188,0.12)');
      set(el, 'padding',       '4px');
    });
    mBody.querySelectorAll('[class*="price"], .price, strong').forEach(function(el) {
      set(el, 'color',       NEON);
      set(el, 'font-weight', '700');
    });
    /* Icone check verde -> neon */
    mBody.querySelectorAll('svg').forEach(function(el) {
      set(el, 'color', NEON);
      set(el, 'fill',  NEON);
    });
  }

  var mFooter = modal.querySelector('.modal-footer');
  if (mFooter) {
    set(mFooter, 'background',   'transparent');
    set(mFooter, 'border-top',   '1px solid rgba(8,238,188,0.1)');
    set(mFooter, 'padding',      '12px 20px 16px');
    set(mFooter, 'display',      'flex');
    set(mFooter, 'gap',          '10px');
    mFooter.querySelectorAll('a, button, .btn').forEach(styleNeonBtn);
  } else {
    modal.querySelectorAll('a.btn, button.btn, .btn').forEach(styleNeonBtn);
  }

  console.log('[AQ] Modal dark theme applied');
}

function styleNeonBtn(btn) {
  var set = function(p, v) { btn.style.setProperty(p, v, 'important'); };
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
    btn.addEventListener('mouseenter', function() {
      btn.style.setProperty('background', NEON, 'important');
      btn.style.setProperty('color', DARK, 'important');
      btn.style.setProperty('box-shadow', '0 0 16px rgba(8,238,188,0.4)', 'important');
    });
    btn.addEventListener('mouseleave', function() {
      btn.style.setProperty('background', 'transparent', 'important');
      btn.style.setProperty('color', NEON, 'important');
      btn.style.setProperty('box-shadow', 'none', 'important');
    });
  }
}

function updateBadge() {
  var link = document.querySelector('.link-cart');
  if (!link) return;

  var hasProducts = link.classList.contains('has-products') ||
    document.querySelectorAll('.cart-list .cart-item').length > 0;

  var badge = link.querySelector('.aq-cart-badge');

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

function handleVisibleModal(node) {
  if (!node || node.nodeType !== 1) return;
  if (node.classList && node.classList.contains('modal')) {
    var isVisible = node.classList.contains('show') ||
                    node.classList.contains('in') ||
                    node.style.display === 'block';
    if (isVisible) {
      node.removeAttribute(STYLED);
      applyDarkModal(node);
    }
    return;
  }
  if (node.closest) {
    var parent = node.closest('.modal');
    if (parent) {
      parent.removeAttribute(STYLED);
      applyDarkModal(parent);
    }
  }
}

export function initCartStyles() {
  document.querySelectorAll('.cart-list').forEach(applyDarkCart);
  document.querySelectorAll('.modal.show, .modal.in').forEach(applyDarkModal);
  updateBadge();

  new MutationObserver(function(mutations) {
    var needsBadge = false;
    mutations.forEach(function(m) {

      m.addedNodes.forEach(function(node) {
        if (node.nodeType !== 1) return;
        if (node.classList && node.classList.contains('cart-list')) {
          applyDarkCart(node);
          needsBadge = true;
        }
        if (node.querySelectorAll) {
          node.querySelectorAll('.cart-list').forEach(function(el) {
            applyDarkCart(el);
            needsBadge = true;
          });
        }
        handleVisibleModal(node);
        if (node.querySelectorAll) {
          node.querySelectorAll('.modal').forEach(handleVisibleModal);
        }
        if (node.classList && node.classList.contains('modal-backdrop')) {
          node.style.setProperty('z-index', '10050', 'important');
          node.style.setProperty('background', 'rgba(0,4,13,0.82)', 'important');
          node.style.setProperty('opacity', '1', 'important');
        }
      });

      if (m.type === 'attributes' && m.attributeName === 'class') {
        handleVisibleModal(m.target);
      }

      if (m.type === 'attributes' && m.attributeName === 'style') {
        var el = m.target;
        if (el.classList && el.classList.contains('modal') && el.style.display === 'block') {
          el.removeAttribute(STYLED);
          applyDarkModal(el);
        }
        if (el.classList && el.classList.contains('modal-backdrop')) {
          el.style.setProperty('z-index', '10050', 'important');
          el.style.setProperty('background', 'rgba(0,4,13,0.82)', 'important');
          el.style.setProperty('opacity', '1', 'important');
        }
      }
    });
    if (needsBadge) updateBadge();
  }).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });
}
