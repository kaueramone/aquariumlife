/**
 * brandsSection.js – v3
 * Exporta buildBrandsSection() para uso pelo homeOrchestrator.
 * initBrandsSection() oculta o bloco nativo (chamado independentemente).
 */

const BRANDS_API = '/api/json/brands';

const BRANDS_FALLBACK = [
  'Tropica','ADA','JBL','Fluval','Oase',
  'Dennerle','Eheim','Seachem','Aquael','Tetra',
];

const NATIVE_SELECTORS = ['.brands-item','[class*="brands"]'];

async function fetchBrands() {
  try {
    const res = await fetch(BRANDS_API);
    if (!res.ok) return null;
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.brands || data.data || null);
    return (list && list.length) ? list : null;
  } catch { return null; }
}

function hideNativeBrands() {
  for (const sel of NATIVE_SELECTORS) {
    const el = document.querySelector(sel);
    if (!el) continue;
    let target = el;
    for (let i = 0; i < 6; i++) {
      const p = target.parentElement;
      if (!p || p.tagName === 'BODY') break;
      target = p;
      if (target.tagName === 'SECTION' || target.classList.contains('section') || target.classList.contains('block')) break;
    }
    target.style.setProperty('display', 'none', 'important');
    return true;
  }
  return false;
}

function buildBrandItem(label, imgSrc) {
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

  const rawBrands = await fetchBrands();
  const brands = rawBrands || BRANDS_FALLBACK;

  const items = brands.map(b => ({
    label: b.title || b.name || b,
    img:   b.image?.url || b.logo || b.img || null,
  }));

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
  [...items, ...items].forEach(({ label, img }) => inner.appendChild(buildBrandItem(label, img)));
  track.appendChild(inner);
  section.appendChild(track);

  return section;
}

export function initBrandsSection() {
  const tryHide = () => {
    const found = NATIVE_SELECTORS.some(s => document.querySelector(s));
    if (found) { hideNativeBrands(); return; }
    const obs = new MutationObserver(() => {
      if (NATIVE_SELECTORS.some(s => document.querySelector(s))) {
        obs.disconnect(); hideNativeBrands();
      }
    });
    obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
  };
  tryHide();
}
