/**
 * categorySection.js – v2
 * Oculta apenas a secção de categorias nativa do Shopkit (sem tocar no resto da página)
 * e injeta a nossa versão premium com neon glow.
 */

const CATEGORIES = [
  { label: 'Equipamento',             href: '/category/equipamento',             img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/7753b01-160640-equipamentos-de-aquario.png' },
  { label: 'Alimentação',             href: '/category/alimentacao',             img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/8d9eaef-160632-alimentacao.png' },
  { label: 'Hardscape',               href: '/category/hardscape',               img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/d56453d-160643-hardscape.png' },
  { label: 'Plantas',                 href: '/category/plantas',                 img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/fca290c-160659-plantas.png' },
  { label: 'Peixes',                  href: '/category/peixes',                  img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/c380f2e-160654-peixes.png' },
  { label: 'Invertebrados',           href: '/category/invertebrados',           img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/904bd1c-160646-invertebrados.png' },
  { label: 'Condicionadores de Água', href: '/category/condicionadores-de-agua', img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/3a2d344-160638-condicionadores-de-agua.png' },
  { label: 'Aquascaping',             href: '/category/aquascaping',             img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/9977c3d-160634-aquascaping.png' },
  { label: 'Outros',                  href: '/category/outros',                  img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/41700fb-160651-outros.png' },
];

/**
 * Encontra o container a ocultar de forma cirúrgica.
 *
 * Estratégia (por ordem de preferência):
 *  1. <section> mais próximo — Shopkit/Boxie usa <section> por bloco
 *  2. Pai do .slick-initialized que contém .categories-item (slider block)
 *  3. Fallback: sobe no máximo 5 níveis desde o item, nunca passando
 *     body / main / #wrapper ou divs de conteúdo raiz
 */
function findCategoryContainer(item) {
  // 1) Tenta o <section> mais próximo
  const sec = item.closest('section');
  if (sec) return sec;

  // Containers que NÃO podemos ocultar (raiz da página)
  const isPageRoot = (el) =>
    !el ||
    el.tagName === 'BODY' ||
    el.tagName === 'HTML' ||
    el.tagName === 'MAIN' ||
    el.id === 'wrapper' ||
    el.id === 'page' ||
    el.id === 'content' ||
    el.id === 'app' ||
    el.classList.contains('wrapper') ||
    el.classList.contains('main-content') ||
    el.classList.contains('page-content') ||
    el.classList.contains('store-content');

  // 2) Parte do slider que contém categorias
  const slider =
    item.closest('.slick-initialized') ||
    item.closest('.slick-slider');

  let current = slider || item;

  // Sobe no máximo 4 níveis desde o slider
  for (let i = 0; i < 4; i++) {
    const parent = current.parentElement;
    if (!parent || isPageRoot(parent)) break; // para ANTES de ocultar o pai raiz
    current = parent;
    // Parar cedo se encontrar um div que parece um bloco de secção
    if (
      current.tagName === 'SECTION' ||
      current.classList.contains('section') ||
      current.classList.contains('block') ||
      current.classList.contains('home-section')
    ) break;
  }

  return current;
}

function buildNewSection() {
  const section = document.createElement('section');
  section.id = 'aq-categories';

  const grid = document.createElement('div');
  grid.className = 'aq-cat-grid';

  CATEGORIES.forEach((cat) => {
    const a = document.createElement('a');
    a.href = cat.href;
    a.className = 'aq-cat-item';

    const img = document.createElement('img');
    img.src = cat.img;
    img.alt = cat.label;
    img.className = 'aq-cat-icon';
    img.loading = 'lazy';

    const name = document.createElement('span');
    name.className = 'aq-cat-name';
    name.textContent = cat.label;

    a.appendChild(img);
    a.appendChild(name);
    grid.appendChild(a);
  });

  section.appendChild(grid);
  return section;
}

function buildSection() {
  if (document.getElementById('aq-categories')) return true;

  const nativeItem = document.querySelector('.categories-item');
  if (!nativeItem) return false;

  const hideTarget = findCategoryContainer(nativeItem);
  hideTarget.style.setProperty('display', 'none', 'important');

  const newSection = buildNewSection();
  hideTarget.parentNode.insertBefore(newSection, hideTarget.nextSibling);

  console.log('[AQ] Category section v2 —', hideTarget.tagName, hideTarget.className || hideTarget.id, '→ oculto');
  return true;
}

export function initCategorySection() {
  if (buildSection()) return;

  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (buildSection() || attempts >= 20) clearInterval(interval);
  }, 300);

  const observer = new MutationObserver(() => {
    if (buildSection()) observer.disconnect();
  });
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
  });
}
