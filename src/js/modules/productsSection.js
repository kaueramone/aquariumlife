/**
 * productsSection.js – v4
 * - Oculta titulo nativo "Produtos"
 * - Move botao Comprar para filho direto de .card-shadow-hover (apos .product-details)
 * - Injeta botao "Ver todos os nossos produtos"
 */

const VER_TODOS_HREF = '/products';

// Mover botoes ────────────────────────────────────────────────────────────────
function moveComprarButtons() {
  const btns = document.querySelectorAll(
    '.product-view a.product-btn, .product-view .product-btn'
  );
  if (!btns.length) return false;

  btns.forEach(btn => {
    const card = btn.closest('.card-shadow-hover');
    if (!card) return;
    // Ultimo filho de .card-shadow-hover = depois de .product-details
    // Fica no fluxo flex do card, abaixo do preco, dentro da borda visual
    card.appendChild(btn);
  });

  console.log('[AQ] Botoes Comprar movidos:', btns.length);
  return true;
}

// Ocultar titulo da seccao ────────────────────────────────────────────────────
function hideProductsTitle() {
  const firstView = document.querySelector('.product-view');
  if (!firstView) return false;

  let section = firstView;
  while (section.parentElement && section.parentElement.tagName !== 'BODY') {
    section = section.parentElement;
    if (section.tagName === 'SECTION' || section.classList.contains('section')) break;
  }

  ['.title', '.title_mb-lg', 'h1', 'h2', 'h3', '.section-title', '.block-title']
    .forEach(sel => section.querySelectorAll(sel).forEach(el => {
      if (!el.closest('.card-shadow-hover')) {
        el.style.setProperty('display', 'none', 'important');
      }
    }));

  return true;
}

// Injetar "Ver todos" ─────────────────────────────────────────────────────────
function injectVerTodos() {
  if (document.getElementById('aq-ver-todos')) return true;

  const firstView = document.querySelector('.product-view');
  if (!firstView) return false;

  let insertAfter = firstView;
  for (let i = 0; i < 6; i++) {
    const parent = insertAfter.parentElement;
    if (!parent || parent.tagName === 'BODY') break;
    insertAfter = parent;
    if (insertAfter.tagName === 'SECTION' || insertAfter.classList.contains('section')) break;
  }

  const wrapper = document.createElement('div');
  wrapper.id = 'aq-ver-todos';
  const a = document.createElement('a');
  a.href = VER_TODOS_HREF;
  const span = document.createElement('span');
  span.textContent = 'Ver todos os nossos produtos';
  a.appendChild(span);
  wrapper.appendChild(a);
  insertAfter.parentNode.insertBefore(wrapper, insertAfter.nextSibling);

  return true;
}

// Build principal ─────────────────────────────────────────────────────────────
function build() {
  const t = hideProductsTitle();
  const m = moveComprarButtons();
  const v = injectVerTodos();
  return t && m && v;
}

export function initProductsSection() {
  if (build()) return;

  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (build() || attempts >= 25) clearInterval(interval);
  }, 250);

  const observer = new MutationObserver(() => {
    if (document.querySelector('.product-view a.product-btn')) {
      moveComprarButtons();
    }
  });
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
  });
}
