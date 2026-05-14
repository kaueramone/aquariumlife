/**
 * brandsSection.js – v1
 * Oculta o bloco nativo "Nossas Marcas" do Shopkit
 * e injeta uma seção premium de marcas com carrossel infinito.
 */

const BRANDS = [
  { label: 'Tropica',       href: '/products?brand=tropica',       img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/tropica-logo.png' },
  { label: 'ADA',           href: '/products?brand=ada',           img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/ada-logo.png' },
  { label: 'JBL',           href: '/products?brand=jbl',           img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/jbl-logo.png' },
  { label: 'Fluval',        href: '/products?brand=fluval',        img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/fluval-logo.png' },
  { label: 'Oase',          href: '/products?brand=oase',          img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/oase-logo.png' },
  { label: 'Dennerle',      href: '/products?brand=dennerle',      img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/dennerle-logo.png' },
  { label: 'Eheim',         href: '/products?brand=eheim',         img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/eheim-logo.png' },
  { label: 'Seachem',       href: '/products?brand=seachem',       img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/seachem-logo.png' },
];

// Nomes de classes/texto para identificar o bloco nativo de marcas
const BRANDS_NATIVE_SELECTORS = [
  '.brands-item',
  '[class*="brands"]',
];

function hideNativeBrands() {
  for (const sel of BRANDS_NATIVE_SELECTORS) {
    const el = document.querySelector(sel);
    if (!el) continue;

    // Sobe até a <section> contenedora
    let target = el;
    for (let i = 0; i < 6; i++) {
      const p = target.parentElement;
      if (!p || p.tagName === 'BODY') break;
      target = p;
      if (target.tagName === 'SECTION' || target.classList.contains('section') || target.classList.contains('block')) break;
    }
    target.style.setProperty('display', 'none', 'important');
    console.log('[AQ] Brands nativo ocultado:', target.tagName, target.className);
    return target;
  }
  return null;
}

function buildBrandsSection() {
  const section = document.createElement('section');
  section.id = 'aq-brands';

  // Cabeçalho
  const header = document.createElement('div');
  header.className = 'aq-section-header';
  header.innerHTML = `
    <span class="aq-section-tag">Parceiros</span>
    <h2 class="aq-section-title">As Melhores <span class="aq-neon">Marcas</span></h2>
    <p class="aq-section-sub">Trabalhamos apenas com marcas de referência mundial em aquarismo</p>
  `;
  section.appendChild(header);

  // Wrapper do carrossel (duplicamos para loop infinito via CSS)
  const track = document.createElement('div');
  track.className = 'aq-brands-track';

  const inner = document.createElement('div');
  inner.className = 'aq-brands-inner';

  // Duplicar itens para criar loop contínuo
  [...BRANDS, ...BRANDS].forEach((brand) => {
    const a = document.createElement('a');
    a.href = brand.href;
    a.className = 'aq-brand-item';
    a.title = `Ver produtos ${brand.label}`;
    a.setAttribute('aria-label', `Filtrar por marca ${brand.label}`);

    const img = document.createElement('img');
    img.src = brand.img;
    img.alt = brand.label;
    img.loading = 'lazy';
    // Fallback: se a imagem não carregar, mostra o nome
    img.onerror = function () {
      this.style.display = 'none';
      const fallback = document.createElement('span');
      fallback.className = 'aq-brand-fallback';
      fallback.textContent = brand.label;
      a.appendChild(fallback);
    };

    a.appendChild(img);
    inner.appendChild(a);
  });

  track.appendChild(inner);
  section.appendChild(track);

  return section;
}

function build() {
  if (document.getElementById('aq-brands')) return true;

  const nativeHidden = hideNativeBrands();
  if (!nativeHidden) return false;

  const newSection = buildBrandsSection();
  nativeHidden.parentNode.insertBefore(newSection, nativeHidden.nextSibling);
  console.log('[AQ] Brands section injetada');
  return true;
}

export function initBrandsSection() {
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
    childList: true,
    subtree: true,
  });
}
