/**
 * brandsSection.js – v6
 * Extrai marcas do DOM nativo do Shopkit (já presentes na página),
 * oculta a section nativa e injeta o carrossel premium.
 */

const BRANDS_FALLBACK = [
  'Tropica','ADA','JBL','Fluval','Oase',
  'Dennerle','Eheim','Seachem','Aquael','Tetra',
];

// Oculta a section nativa — seletor preciso baseado no HTML real do Shopkit
function hideNativeBrands() {
  const native = document.querySelector('section.brands-block, section.brands.section');
  if (native) {
    native.style.setProperty('display', 'none', 'important');
    console.log('[AQ] brands nativo ocultado');
    return true;
  }
  return false;
}

// Extrai marcas do DOM nativo (mais fiável que a API)
function extractBrandsFromDOM() {
  const items = document.querySelectorAll(
    'section.brands-block .brands-item:not(.slick-cloned), ' +
    'section.brands.section .brands-item:not(.slick-cloned)'
  );
  if (!items.length) return null;
  const brands = [];
  items.forEach(item => {
    const img = item.querySelector('img');
    const label = img?.alt || img?.title || item.querySelector('a')?.textContent?.trim() || '';
    const src = img?.src || '';
    // Ignora imagens de placeholder do Shopkit
    const imgFinal = src.includes('no-img') ? null : src;
    if (label) brands.push({ label, img: imgFinal });
  });
  return brands.length ? brands : null;
}

function buildBrandItem({ label, img: imgSrc }) {
  const div = document.createElement('div');
  div.className = 'aq-brand-item';
  div.title = label;
  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc; img.alt = label; img.loading = 'lazy';
    img.onerror = function () {
      this.style.display = 'none';
      const s = document.createElement('span');
      s.className = 'aq-brand-fallback'; s.textContent = label;
      div.appendChild(s);
    };
    div.appendChild(img);
  } else {
    const s = document.createElement('span');
    s.className = 'aq-brand-fallback'; s.textContent = label;
    div.appendChild(s);
  }
  return div;
}

export async function buildBrandsSection() {
  if (document.getElementById('aq-brands')) return null;

  // Extrai do DOM nativo (já disponível); fallback para lista estática
  const extracted = extractBrandsFromDOM();
  const items = extracted || BRANDS_FALLBACK.map(label => ({ label, img: null }));

  const section = document.createElement('section');
  section.id = 'aq-brands';

  const header = document.createElement('div');
  header.className = 'aq-section-header';
  header.innerHTML = `
    <span class="aq-section-tag">Parceiros</span>
    <h2 class="aq-section-title">As Melhores <span class="aq-neon">Marcas</span></h2>
    <p class="aq-section-sub">Trabalhamos apenas com marcas de referência mundial em aquarismo</p>
  `;
  section.appendChild(header);

  const track = document.createElement('div');
  track.className = 'aq-brands-track';
  const inner = document.createElement('div');
  inner.className = 'aq-brands-inner';
  // Duplica para scroll infinito
  [...items, ...items].forEach(item => inner.appendChild(buildBrandItem(item)));
  track.appendChild(inner);
  section.appendChild(track);

  console.log('[AQ] brands extraídas do DOM:', items.length);
  return section;
}

export function initBrandsSection() {
  if (hideNativeBrands()) return;
  const obs = new MutationObserver(() => {
    if (hideNativeBrands()) obs.disconnect();
  });
  obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
}
