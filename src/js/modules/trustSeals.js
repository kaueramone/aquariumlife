/**
 * trustSeals.js - v3
 * - Selos de confianca no footer
 * - Move redes sociais para coluna de Contactos
 * - Remove selos nativos Shopkit
 * - Injeta assinatura no copyright
 */

var SEALS = [
  {
    id: 'ssl',
    label: 'SSL Seguro',
    sub: 'Loja certificada',
    icon: '<svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="18" width="32" height="26" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 18V13a8 8 0 0116 0v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="20" cy="31" r="3" fill="currentColor"/><line x1="20" y1="34" x2="20" y2="39" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  },
  {
    id: 'secure',
    label: 'Compra Segura',
    sub: 'Dados protegidos',
    icon: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4L8 10v12c0 10.5 6.8 20.3 16 23.4C33.2 42.3 40 32.5 40 22V10L24 4z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 24l5 5 11-11" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    id: 'mb',
    label: 'Multibanco',
    sub: 'Pagamento aceite',
    icon: '<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><rect x="6" y="10" width="8" height="12" rx="1" fill="currentColor" opacity=".4"/><rect x="16" y="10" width="8" height="12" rx="1" fill="currentColor" opacity=".7"/><rect x="26" y="10" width="8" height="12" rx="1" fill="currentColor"/><text x="24" y="26" text-anchor="middle" font-size="5" fill="currentColor" font-family="sans-serif" opacity=".7">MULTIBANCO</text></svg>',
  },
  {
    id: 'mbway',
    label: 'MB WAY',
    sub: 'Pagamento aceite',
    icon: '<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><text x="24" y="14" text-anchor="middle" font-size="8" fill="#08EEBC" font-family="sans-serif" font-weight="bold">MB</text><text x="24" y="25" text-anchor="middle" font-size="7" fill="currentColor" font-family="sans-serif" opacity=".8">WAY</text></svg>',
  },
  {
    id: 'cards',
    label: 'Visa / Mastercard',
    sub: 'Cartao aceite',
    icon: '<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="16" r="8" fill="#EA4335" opacity=".7"/><circle cx="30" cy="16" r="8" fill="#FBBC05" opacity=".7"/></svg>',
  },
];

function buildSealsBar() {
  var bar = document.createElement('div');
  bar.id = 'aq-trust-seals';
  var inner = document.createElement('div');
  inner.className = 'aq-seals-inner';
  SEALS.forEach(function(seal) {
    var item = document.createElement('div');
    item.className = 'aq-seal-item aq-seal-' + seal.id;
    item.innerHTML =
      '<div class="aq-seal-icon">' + seal.icon + '</div>' +
      '<div class="aq-seal-text"><strong>' + seal.label + '</strong><span>' + seal.sub + '</span></div>';
    inner.appendChild(item);
  });
  bar.appendChild(inner);
  return bar;
}

function moveSocialToContacts(footer) {
  var social = footer.querySelector('.footer-social, .social');
  if (!social) return;

  var contactsCol = null;
  footer.querySelectorAll('.footer-category').forEach(function(el) {
    if (el.textContent.trim().toLowerCase().includes('contacto')) {
      contactsCol = el.closest('.col-lg-3, .col-md-6, [class*="col"]');
    }
  });

  if (!contactsCol) return;

  var socialWrap = document.createElement('div');
  socialWrap.className = 'aq-footer-social';
  socialWrap.style.cssText = 'display:flex;gap:12px;margin-top:16px;';

  social.querySelectorAll('a').forEach(function(a) {
    var clone = a.cloneNode(true);
    clone.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;border:1px solid rgba(8,238,188,0.25);color:rgba(255,255,255,0.7);transition:all 0.2s ease;text-decoration:none;';
    clone.addEventListener('mouseenter', function() {
      clone.style.borderColor = '#08EEBC';
      clone.style.color = '#08EEBC';
      clone.style.boxShadow = '0 0 10px rgba(8,238,188,0.3)';
    });
    clone.addEventListener('mouseleave', function() {
      clone.style.borderColor = 'rgba(8,238,188,0.25)';
      clone.style.color = 'rgba(255,255,255,0.7)';
      clone.style.boxShadow = 'none';
    });
    socialWrap.appendChild(clone);
  });

  contactsCol.appendChild(socialWrap);
  social.style.setProperty('display', 'none', 'important');
}

function removeSiteSeal(footer) {
  footer.querySelectorAll('.secure-site, .site-seal, [class*="secure-site"]').forEach(function(el) {
    el.style.setProperty('display', 'none', 'important');
  });
}

function injectSignature(footer) {
  if (footer.querySelector('.aq-signature')) return;
  var copyright = footer.querySelector('.copyright, .footer-bottom');
  if (!copyright) return;

  var sig = document.createElement('div');
  sig.className = 'aq-signature';
  sig.innerHTML =
    'Loja feita com ' +
    '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:13px;height:13px;display:inline-block;vertical-align:middle;margin:0 3px;fill:#08EEBC;">' +
    '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>' +
    '</svg>' +
    ' por <a href="https://kaueramone.dev" target="_blank" rel="noopener noreferrer">Kaue Ramone</a>';

  copyright.appendChild(sig);
}

function build() {
  if (document.getElementById('aq-trust-seals')) return true;

  var footer = document.querySelector('footer, #footer, .footer');
  if (!footer) return false;

  var copyright = footer.querySelector('.copyright, .footer-bottom');
  var bar = buildSealsBar();
  if (copyright && copyright.parentNode) {
    copyright.parentNode.insertBefore(bar, copyright);
  } else {
    var col = footer.querySelector('.col-lg-3, [class*="col"]');
    if (col) col.appendChild(bar);
  }

  moveSocialToContacts(footer);
  removeSiteSeal(footer);
  injectSignature(footer);

  console.log('[AQ] Trust seals v3 aplicados');
  return true;
}

export function initTrustSeals() {
  if (build()) return;
  var attempts = 0;
  var interval = setInterval(function() {
    attempts++;
    if (build() || attempts >= 20) clearInterval(interval);
  }, 300);
}
