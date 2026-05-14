/**
 * brandsSection.js – v2
 * - Busca marcas via API Shopkit (/api/json/brands) em vez de URLs hardcoded
 * - Fallback para lista estática se API não responder
 * - Sem links (apenas visuais)
 */

const BRANDS_API = '/api/json/brands';

// Fallback estático com apenas nomes (imagens virão da API)
const BRANDS_FALLBACK = [
  'Tropica', 'ADA', 'JBL', 'Fluval', 'Oase',
  'Dennerle', 'Eheim', 'Seachem', 'Aquael', 'Tetra',
];

const BRANDS_NATIVE_SELECTORS = [
  '.brands-item',
  '[class*="brands"]',
];

async function fetchBrands() {
  try {
    const res = await fetch(BRANDS_API);
    if (!res.ok) return null;
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.brands || data.data || null);
    if (!list || !list.length) return null;
    return list;
  } catch { return null; }
}

function hideNativeBrands() {
  for (const sel of BRANDS_NATIVE_SELECTORS) {
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
    console.log('[AQ] Brands nativo ocultado:', target.tagName, target.className);
    return target;
  }
  return null;
}

function buildBrandItem(label, imgSrc) {
  const div = document.createElement('div');
  div.className = 'aq-brand-item';
  div.title = label;

  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = label;
    img.loading = 'lazy';
    img.onerror = function () {
      this.style.display = 'none';
      const fallback = document.createElement('span');
      fallback.className = 'aq-brand-fallback';
      fallback.textContent = label;
      div.appendChild(fallback);
    };
    div.appendChild(img);
  } else {
    const span = document.createElement('span');
    span.className = 'aq-brand-fallback';
    span.textContent = label;
    div.appendChild(span);
  }

  return div;
}

function buildBrandsSection(brands) {
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

  // Duplicar lista para loop infinito via CSS
  const items = brands.map(b => ({
    label: b.title || b.name || b,
    img:   b.image?.url || b.logo || b.img || null,
  }));

  [...items, ...items].forEach(({ label, img }) => {
    inner.appendChild(buildBrandItem(label, img));
  });

  track.appendChild(inner);
  section.appendChild(track);
  return section;
}

async function build() {
  if (document.getElementById('aq-brands')) return true;

  const nativeHidden = hideNativeBrands();
  if (!nativeHidden) return false;

  // Tentar API; fallback para lista estática
  let brands = await fetchBrands();
  if (!brands) brands = BRANDS_FALLBACK;

  const newSection = buildBrandsSection(brands);
  nativeHidden.parentNode.insertBefore(newSection, nativeHidden.nextSibling);
  console.log('[AQ] Brands section v2 injetada —', brands.length, 'marcas');
  return true;
}

export function initBrandsSection() {
  const nativeItem = document.querySelector(BRANDS_NATIVE_SELECTORS[0]);
  if (nativeItem) { build(); return; }

  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    const found = BRANDS_NATIVE_SELECTORS.some(s => document.querySelector(s));
    if (found || attempts >= 20) {
      clearInterval(interval);
      if (found) build();
    }
  }, 300);

  const observer = new MutationObserver(() => {
    const found = BRANDS_NATIVE_SELECTORS.some(s => document.querySelector(s));
    if (found) { observer.disconnect(); build(); }
  });
  observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
}
