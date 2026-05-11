/**
 * productsSection.js – v1
 * - Oculta o título nativo "Produtos" da secção de produtos
 * - Injeta o botão "Ver todos os nossos produtos" após a grelha
 */

const VER_TODOS_HREF = '/products';

function hideProductsTitle() {
  // Tenta encontrar o título dentro da secção que contém produtos
  const firstProduct = document.querySelector('.product, .product-item, .product-view');
  if (!firstProduct) return false;

  // Sobe até encontrar a secção
  let section = firstProduct;
  while (section && section.tagName !== 'SECTION' && !section.classList.contains('section')) {
    if (!section.parentElement || section.parentElement.tagName === 'BODY') break;
    section = section.parentElement;
  }

  // Oculta títulos dentro dessa secção
  const titleSelectors = ['.title', '.title_mb-lg', 'h1', 'h2', 'h3', '.section-title', '.block-title'];
  titleSelectors.forEach(sel => {
    section.querySelectorAll(sel).forEach(el => {
      // Só oculta se não estiver dentro de um card de produto
      if (!el.closest('.product, .product-item')) {
        el.style.setProperty('display', 'none', 'important');
      }
    });
  });

  return true;
}

function injectVerTodos() {
  if (document.getElementById('aq-ver-todos')) return true;

  const firstProduct = document.querySelector('.product, .product-item, .product-view');
  if (!firstProduct) return false;

  // Encontra o container da grelha de produtos (pai do primeiro produto)
  const grid = firstProduct.parentElement;
  if (!grid) return false;

  // Sobe mais um nível para encontrar a secção completa e injetar depois dela
  let insertAfter = grid;
  for (let i = 0; i < 4; i++) {
    const parent = insertAfter.parentElement;
    if (!parent || parent.tagName === 'BODY' || parent.tagName === 'MAIN') break;
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

  console.log('[AQ] Botão VER TODOS injetado');
  return true;
}

function build() {
  const titleDone = hideProductsTitle();
  const btnDone   = injectVerTodos();
  return titleDone && btnDone;
}

export function initProductsSection() {
  if (build()) return;

  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (build() || attempts >= 20) clearInterval(interval);
  }, 300);

  const observer = new MutationObserver(() => {
    if (build()) observer.disconnect();
  });
  observer.observe(document.body || document.documentElement, {
    childList: true, subtree: true,
  });
}
