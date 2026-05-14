/**
 * trustSeals.js – v1
 * Injeta barra de selos de confiança antes do copyright do footer.
 * Selos: SSL Shopkit | Compra Segura | Google Business | MB | MB WAY | Visa/MC
 */

const SEALS = [
  {
    id: 'ssl',
    label: 'SSL Seguro',
    sub: 'Loja certificada',
    icon: `<svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="18" width="32" height="26" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M12 18V13a8 8 0 0116 0v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="20" cy="31" r="3" fill="currentColor"/>
      <line x1="20" y1="34" x2="20" y2="39" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'secure',
    label: 'Compra Segura',
    sub: 'Dados protegidos',
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L8 10v12c0 10.5 6.8 20.3 16 23.4C33.2 42.3 40 32.5 40 22V10L24 4z" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M16 24l5 5 11-11" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  {
    id: 'google',
    label: 'Google Business',
    sub: 'Perfil verificado',
    icon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.2z"/>
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.9 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.6v6.2C6.6 43.2 14.7 48 24 48z"/>
      <path fill="#FBBC05" d="M10.8 28.8c-.5-1.4-.7-2.8-.7-4.3s.3-2.9.7-4.3v-6.2H2.6C.9 17.3 0 20.6 0 24s.9 6.7 2.6 9.5l8.2-4.7z"/>
      <path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.4 30.4 0 24 0 14.7 0 6.6 4.8 2.6 12.5l8.2 4.7c1.9-5.6 7.1-9.7 13.2-9.7z"/>
    </svg>`,
  },
  {
    id: 'mb',
    label: 'Multibanco',
    sub: 'Pagamento aceite',
    icon: `<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
      <rect x="6" y="10" width="8" height="12" rx="1" fill="currentColor" opacity=".4"/>
      <rect x="16" y="10" width="8" height="12" rx="1" fill="currentColor" opacity=".7"/>
      <rect x="26" y="10" width="8" height="12" rx="1" fill="currentColor"/>
      <text x="24" y="26" text-anchor="middle" font-size="5" fill="currentColor" font-family="sans-serif" opacity=".7">MULTIBANCO</text>
    </svg>`,
  },
  {
    id: 'mbway',
    label: 'MB WAY',
    sub: 'Pagamento aceite',
    icon: `<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
      <text x="24" y="14" text-anchor="middle" font-size="8" fill="#08EEBC" font-family="sans-serif" font-weight="bold">MB</text>
      <text x="24" y="25" text-anchor="middle" font-size="7" fill="currentColor" font-family="sans-serif" opacity=".8">WAY</text>
    </svg>`,
  },
  {
    id: 'cards',
    label: 'Visa / Mastercard',
    sub: 'Cartão aceite',
    icon: `<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="18" cy="16" r="8" fill="#EA4335" opacity=".7"/>
      <circle cx="30" cy="16" r="8" fill="#FBBC05" opacity=".7"/>
    </svg>`,
  },
];

function buildSealsBar() {
  const bar = document.createElement('div');
  bar.id = 'aq-trust-seals';

  const inner = document.createElement('div');
  inner.className = 'aq-seals-inner';

  SEALS.forEach(seal => {
    const item = document.createElement('div');
    item.className = `aq-seal-item aq-seal-${seal.id}`;
    item.innerHTML = `
      <div class="aq-seal-icon">${seal.icon}</div>
      <div class="aq-seal-text">
        <strong>${seal.label}</strong>
        <span>${seal.sub}</span>
      </div>
    `;
    inner.appendChild(item);
  });

  bar.appendChild(inner);
  return bar;
}

function build() {
  if (document.getElementById('aq-trust-seals')) return true;

  const footer = document.querySelector('footer, #footer, .footer');
  if (!footer) return false;

  // Tentar inserir antes do copyright; se não existir, appenda ao footer
  const copyright = footer.querySelector(
    '.copyright, .footer-bottom, .footer-copyright, [class*="copyright"]'
  );

  const bar = buildSealsBar();

  if (copyright) {
    footer.insertBefore(bar, copyright);
  } else {
    footer.appendChild(bar);
  }

  console.log('[AQ] Trust seals injetados');
  return true;
}

export function initTrustSeals() {
  if (build()) return;

  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (build() || attempts >= 20) clearInterval(interval);
  }, 300);
}
