/**
 * brandsSection.js – v8
 * Só marcas com logo. Cores originais com opacidade + hover neon.
 */

const BASE = 'https://www.aquariumlife.pt/brand/';

const BRANDS_MAP = [
  { label: 'Oase',          href: `${BASE}oase`,           img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/1e9e814-155547-oase.png' },
  { label: 'UNS',           href: `${BASE}uns`,            img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/bf1a5d4-223057-uns.png' },
  { label: 'ME',            href: `${BASE}me`,             img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/25baccc-224313-meaquarist.png' },
  { label: 'Easy Life',     href: `${BASE}easy-life`,      img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/58cd74f-224703-easy-life-logo-white.svg' },
  { label: 'Seachem',       href: `${BASE}seachem`,        img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/81c433b-230814-logo2x.png' },
  { label: 'Hikari',        href: `${BASE}hiraki`,         img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/c6662f4-230041-hikari_logo.png' },
  { label: 'WeekAqua',      href: `${BASE}weekaqua`,       img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/d26904d-225829-weekaqua.png' },
  { label: 'Tropica',       href: `${BASE}tropica-plants`, img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/82414e4-225722-tropica.png' },
  { label: 'Milwaukee',     href: `${BASE}milwaukee`,      img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/b191a88-232705-logo-white.png' },
  { label: 'Salifert',      href: `${BASE}salifert`,       img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/40e8d92-232153-salifert.png' },
  { label: 'ICA',           href: `${BASE}ica`,            img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/248e14a-231838-ica_logo_vertical.svg' },
  { label: 'ESHA',          href: `${BASE}esha`,           img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/68ba01d-231641-esha-logo-white-2020.svg' },
  { label: 'Sera',          href: `${BASE}sera`,           img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/641f247-231444-sera.png' },
  { label: 'Superfish',     href: `${BASE}superfish`,      img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/b5a9cb8-234638-superfish.png' },
  { label: 'Colombo',       href: `${BASE}colombo`,        img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/3ee83b1-233903-logo-colombo-awg.svg' },
  { label: 'Tropical',      href: `${BASE}tropical`,       img: 'https://cdn-shopkit.com/usercontent/aquariumlife/media/images/d106650-233758-tropical.png' },
];

function hideNativeBrands() {
  const native = document.querySelector('section.brands-block, section.brands.section');
  if (native) {
    native.style.setProperty('display', 'none', 'important');
    return true;
  }
  return false;
}

function buildBrandItem({ label, img: imgSrc, href }) {
  const el = document.createElement('a');
  el.className = 'aq-brand-item';
  el.title = label;
  el.href = href;
  el.rel = 'noopener';

  const img = document.createElement('img');
  img.src = imgSrc;
  img.alt = label;
  img.loading = 'lazy';
  img.onerror = function () {
    el.style.display = 'none'; // esconde se imagem falhar
  };
  el.appendChild(img);
  return el;
}

export async function buildBrandsSection() {
  if (document.getElementById('aq-brands')) return null;

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
  [...BRANDS_MAP, ...BRANDS_MAP].forEach(brand => inner.appendChild(buildBrandItem(brand)));
  track.appendChild(inner);
  section.appendChild(track);

  return section;
}

export function initBrandsSection() {
  if (hideNativeBrands()) return;
  const obs = new MutationObserver(() => {
    if (hideNativeBrands()) obs.disconnect();
  });
  obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
}
