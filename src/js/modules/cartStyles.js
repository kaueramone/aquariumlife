/**
 * cartStyles.js
 * Aplica o tema escuro ao popup do carrinho via JS (inline styles)
 * e injeta badge com número no ícone do carrinho.
 * Necessário porque o Shopkit usa inline style="background:#fff" no popup.
 */

// ── Tema escuro no popup ─────────────────────────────────────
function applyDarkCart(popup) {
  if (!popup || popup.dataset.aqStyled === '1') return;
  popup.dataset.aqStyled = '1';

  const s = popup.style;
  s.setProperty('background',       '#001531',                            'important');
  s.setProperty('background-color', '#001531',                            'important');
  s.setProperty('border',           '1px solid rgba(8,238,188,0.25)',     'important');
  s.setProperty('border-radius',    '14px',                               'important');
  s.setProperty('box-shadow',       '0 20px 50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(8,238,188,0.1)', 'important');
  s.setProperty('overflow',         'hidden',                             'important');
  s.setProperty('color',            '#fff',                               'important');

  // Item linha
  popup.querySelectorAll('.cart-item').forEach(el => {
    el.style.setProperty('border-bottom', '1px solid rgba(8,238,188,0.08)', 'important');
    el.style.setProperty('background',    'transparent',                    'important');
  });

  // Imagem produto
  popup.querySelectorAll('.item-image img').forEach(el => {
    el.style.setProperty('border-radius', '8px',                          'important');
    el.style.setProperty('background',    'rgba(0,8,20,0.6)',              'important');
    el.style.setProperty('border',        '1px solid rgba(8,238,188,0.15)','important');
    el.style.setProperty('padding',       '4px',                           'important');
  });

  // Nome produto
  popup.querySelectorAll('.item-product').forEach(el => {
    el.style.setProperty('color',       '#cde4f8', 'important');
    el.style.setProperty('font-weight', '500',     'important');
  });

  // Preço item
  popup.querySelectorAll('.details .price').forEach(el => {
    el.style.setProperty('color',       '#08EEBC', 'important');
    el.style.setProperty('font-weight', '700',     'important');
  });

  // Botão remover (lixo)
  popup.querySelectorAll('a.remove').forEach(el => {
    el.style.setProperty('background',    'transparent',                    'important');
    el.style.setProperty('border',        '1px solid rgba(8,238,188,0.2)', 'important');
    el.style.setProperty('border-radius', '50%',                            'important');
    el.style.setProperty('color',         '#08EEBC',                        'important');
    el.style.setProperty('width',         '30px',                           'important');
    el.style.setProperty('height',        '30px',                           'important');
    el.style.setProperty('display',       'flex',                           'important');
    el.style.setProperty('align-items',   'center',                         'important');
    el.style.setProperty('justify-content','center',                        'important');
    el.style.setProperty('box-shadow',    'none',                           'important');
    // SVG dentro do botão remover
    el.querySelectorAll('svg path, svg').forEach(p => {
      p.style.setProperty('fill', '#08EEBC', 'important');
    });
  });

  // Área total
  const totalRow = popup.querySelector('.cart-total');
  if (totalRow) {
    totalRow.style.setProperty('background',    'rgba(8,238,188,0.03)',          'important');
    totalRow.style.setProperty('border-top',    '1px solid rgba(8,238,188,0.1)', 'important');
    totalRow.style.setProperty('padding',       '12px 16px',                     'important');
    totalRow.style.setProperty('display',       'flex',                          'important');
    totalRow.style.setProperty('justify-content','space-between',                'important');
    totalRow.style.setProperty('align-items',   'center',                        'important');

    const texts = totalRow.querySelectorAll('.cart-total-text');
    if (texts[0]) { // "Total:" label
      texts[0].style.setProperty('color',       'rgba(255,255,255,0.6)', 'important');
      texts[0].style.setProperty('font-size',   '0.8rem',                'important');
      texts[0].style.setProperty('font-weight', '500',                   'important');
      texts[0].style.setProperty('text-transform','uppercase',           'important');
      texts[0].style.setProperty('letter-spacing','1px',                 'important');
    }
    if (texts[1]) { // valor
      texts[1].style.setProperty('color',       '#08EEBC', 'important');
      texts[1].style.setProperty('font-size',   '1.15rem', 'important');
      texts[1].style.setProperty('font-weight', '700',     'important');
    }
  }

  // Área de botões
  const btns = popup.querySelector('.cart-btns');
  if (btns) {
    btns.style.setProperty('background',       'transparent', 'important');
    btns.style.setProperty('padding',          '12px 16px 16px', 'important');
    btns.style.setProperty('display',          'flex',      'important');
    btns.style.setProperty('flex-direction',   'row',       'important');
    btns.style.setProperty('gap',              '8px',       'important');
  }

  popup.querySelectorAll('.cart-btn').forEach(btn => {
    btn.style.setProperty('background',        'transparent',              'important');
    btn.style.setProperty('background-image',  'none',                     'important');
    btn.style.setProperty('border',            '1.5px solid #08EEBC',      'important');
    btn.style.setProperty('border-radius',     '6px',                      'important');
    btn.style.setProperty('color',             '#08EEBC',                  'important');
    btn.style.setProperty('box-shadow',        'none',                     'important');
    btn.style.setProperty('text-shadow',       'none',                     'important');
    btn.style.setProperty('width',             '100%',                     'important');
    btn.style.setProperty('padding',           '11px 20px',                'important');
    btn.style.setProperty('font-size',         '0.72rem',                  'important');
    btn.style.setProperty('font-weight',       '700',                      'important');
    btn.style.setProperty('text-transform',    'uppercase',                'important');
    btn.style.setProperty('letter-spacing',    '1.8px',                    'important');
    btn.style.setProperty('text-decoration',   'none',                     'important');
    btn.style.setProperty('display',           'flex',                     'important');
    btn.style.setProperty('align-items',       'center',                   'important');
    btn.style.setProperty('justify-content',   'center',                   'important');

    btn.addEventListener('mouseenter', () => {
      btn.style.setProperty('background', '#08EEBC', 'important');
      btn.style.setProperty('color',      '#001531', 'important');
      btn.style.setProperty('box-shadow', '0 0 16px rgba(8,238,188,0.4)', 'important');
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.setProperty('background', 'transparent', 'important');
      btn.style.setProperty('color',      '#08EEBC',     'important');
      btn.style.setProperty('box-shadow', 'none',        'important');
    });
  });

  console.log('[AQ] Cart popup dark theme applied');
}

function scanAndStyle() {
  document.querySelectorAll('.cart-list').forEach(applyDarkCart);
}

// ── Badge com número ─────────────────────────────────────────
function updateBadge() {
  const link = document.querySelector('.link-cart');
  if (!link) return;

  let count = 0;

  // 1. data-count / data-qty no próprio link
  const raw = link.dataset.count ?? link.dataset.qty ?? link.dataset.cartCount;
  if (raw !== undefined) {
    count = parseInt(raw, 10) || 0;
  }

  // 2. Elemento filho com texto de contagem
  if (!count) {
    const el = link.querySelector('.count, .qty, [class*="count"], [class*="qty"]');
    if (el) count = parseInt(el.textContent.trim(), 10) || 0;
  }

  // 3. Fallback: contar .cart-item no popup aberto
  if (!count) {
    const items = document.querySelectorAll('.cart-list .cart-item');
    count = items.length;
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

  badge.textContent = count > 0 ? String(count) : '';
}

export function initCartStyles() {
  // Estilizar popup existente
  scanAndStyle();

  // Observar quando o popup aparece ou muda
  new MutationObserver((mutations) => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node.classList?.contains('cart-list')) applyDarkCart(node);
        node.querySelectorAll?.('.cart-list').forEach(applyDarkCart);
      });
      // Também re-estilizar se atributos mudarem (Shopkit pode resetar)
      if (m.type === 'attributes' && m.target.classList?.contains('cart-list')) {
        applyDarkCart(m.target);
      }
    });
    // Badge
    updateBadge();
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'data-count', 'data-qty'] });

  // Badge inicial
  updateBadge();
}
