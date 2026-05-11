/**
 * categorySection.js – v1
 * Oculta a secção de categorias nativa do Shopkit e injeta a nossa versão premium.
 * Ícones com efeito neon glow no hover.
 */

const CATEGORIES = [
  {
    label: 'Equipamento',
    href: '/category/equipamento',
    img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/7753b01-160640-equipamentos-de-aquario.png',
  },
  {
    label: 'Alimentação',
    href: '/category/alimentacao',
    img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/8d9eaef-160632-alimentacao.png',
  },
  {
    label: 'Hardscape',
    href: '/category/hardscape',
    img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/d56453d-160643-hardscape.png',
  },
  {
    label: 'Plantas',
    href: '/category/plantas',
    img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/fca290c-160659-plantas.png',
  },
  {
    label: 'Peixes',
    href: '/category/peixes',
    img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/c380f2e-160654-peixes.png',
  },
  {
    label: 'Invertebrados',
    href: '/category/invertebrados',
    img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/904bd1c-160646-invertebrados.png',
  },
  {
    label: 'Condicionadores de Água',
    href: '/category/condicionadores-de-agua',
    img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/3a2d344-160638-condicionadores-de-agua.png',
  },
  {
    label: 'Aquascaping',
    href: '/category/aquascaping',
    img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/9977c3d-160634-aquascaping.png',
  },
  {
    label: 'Outros',
    href: '/category/outros',
    img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/41700fb-160651-outros.png',
  },
];

/**
 * Sobe na árvore DOM até encontrar o filho direto de body / #wrapper / main.
 * Esse é o container de secção do Shopkit que queremos ocultar.
 */
function findSectionAncestor(el) {
  const isRootChild = (node) => {
    const parent = node.parentElement;
    if (!parent) return true;
    return (
      parent.tagName === 'BODY' ||
      parent.tagName === 'MAIN' ||
      parent.id === 'wrapper' ||
      parent.classList.contains('wrapper') ||
      parent.classList.contains('main-content') ||
      parent.classList.contains('page-content') ||
      parent.classList.contains('store-content')
    );
  };

  let current = el;
  while (current.parentElement && !isRootChild(current)) {
    current = current.parentElement;
  }
  return current;
}

function buildSection() {
  // Já foi injetado?
  if (document.getElementById('aq-categories')) return true;

  // Encontrar o primeiro item de categoria nativo do Shopkit
  const nativeItem = document.querySelector('.categories-item, .categories-slide');
  if (!nativeItem) return false;

  // Localizar e ocultar o container nativo
  const nativeSection = findSectionAncestor(nativeItem);
  nativeSection.style.setProperty('display', 'none', 'important');

  // ── Construir a nova secção ──────────────────────────────────
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

  // Inserir imediatamente após o container nativo (agora oculto)
  nativeSection.parentNode.insertBefore(section, nativeSection.nextSibling);

  console.log('[AQ] Category section v1 injetada —', CATEGORIES.length, 'categorias');
  return true;
}

export function initCategorySection() {
  // Tenta imediatamente
  if (buildSection()) return;

  // Retry por polling (até ~6 segundos)
  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (buildSection() || attempts >= 20) clearInterval(interval);
  }, 300);

  // MutationObserver como segurança extra
  const observer = new MutationObserver(() => {
    if (buildSection()) observer.disconnect();
  });
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
  });
}
