/**
 * storeSection.js - v4
 * - Endereco correto: Praceta Jose Afonso 3A, 2740-192 Porto Salvo, Portugal
 * - Botao "Como chegar": abre rotas do Google Maps ate a loja
 * - Badge Google Reviews e clicavel (substitui botao "Avaliar no Google")
 */

const REVIEW_URL = 'https://g.page/r/CXlxMPCWpRf3EAE/review';
const MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.6698765065166!2d-9.31225998837219!3d38.72538765671719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1ecf2d390fc4f5%3A0xf717a596f0307179!2sAquariumlife!5e0!3m2!1spt-PT!2spt!4v1778773494142!5m2!1spt-PT!2spt';

/* Link de direcoes: abre rota da localizacao atual ate a loja */
const DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1&destination=Praceta+Jos%C3%A9+Afonso+3A+2740-192+Porto+Salvo+Portugal&destination_place_id=ChIJ9U8ME9Py7UcReXEw8JalF_c';

function starSVG() {
  return '<svg viewBox="0 0 24 24" class="aq-star filled" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/></svg>';
}

function googleLogoSVG() {
  return '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="aq-google-logo" aria-hidden="true"><path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.2z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.9 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.6v6.2C6.6 43.2 14.7 48 24 48z"/><path fill="#FBBC05" d="M10.8 28.8c-.5-1.4-.7-2.8-.7-4.3s.3-2.9.7-4.3v-6.2H2.6C.9 17.3 0 20.6 0 24s.9 6.7 2.6 9.5l8.2-4.7z"/><path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.4 30.4 0 24 0 14.7 0 6.6 4.8 2.6 12.5l8.2 4.7c1.9-5.6 7.1-9.7 13.2-9.7z"/></svg>';
}

export function buildStoreSection() {
  if (document.getElementById('aq-store')) return null;

  var section = document.createElement('section');
  section.id = 'aq-store';

  section.innerHTML =
    '<div class="aq-store-inner">' +
      '<div class="aq-store-map">' +
        '<iframe' +
          ' src="' + MAPS_EMBED + '"' +
          ' width="100%" height="100%"' +
          ' style="border:0;" allowfullscreen="" loading="lazy"' +
          ' referrerpolicy="no-referrer-when-downgrade"' +
          ' title="Localizacao Aquariumlife no Google Maps"' +
        '></iframe>' +
      '</div>' +
      '<div class="aq-store-info">' +
        '<div class="aq-section-header aq-store-header">' +
          '<span class="aq-section-tag">Loja Fisica</span>' +
          '<h2 class="aq-section-title">Visita-nos <span class="aq-neon">Pessoalmente</span></h2>' +
          '<p class="aq-section-sub">Vem conhecer o nosso espaco, ver os produtos ao vivo e receber aconselhamento especializado da nossa equipa.</p>' +
        '</div>' +
        '<ul class="aq-store-details">' +
          '<li>' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
            '<span>Praceta Jose Afonso 3A, 2740-192 Porto Salvo, Portugal</span>' +
          '</li>' +
          '<li>' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' +
            '<span>Horarios disponiveis no nosso perfil Google</span>' +
          '</li>' +
          '<li>' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.92z"/></svg>' +
            '<span>Atendimento presencial e online</span>' +
          '</li>' +
        '</ul>' +
        '<div class="aq-store-ctas">' +
          '<a href="' + DIRECTIONS_URL + '" target="_blank" rel="noopener noreferrer" class="aq-btn-primary">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>' +
            'Como chegar' +
          '</a>' +
        '</div>' +
        '<div class="aq-google-rating">' +
          '<a href="' + REVIEW_URL + '" target="_blank" rel="noopener noreferrer" class="aq-rating-badge aq-rating-badge--link">' +
            googleLogoSVG() +
            '<div class="aq-rating-info">' +
              '<div class="aq-rating-stars">' + starSVG() + starSVG() + starSVG() + starSVG() + starSVG() + '</div>' +
              '<span class="aq-rating-text">Deixa a tua avaliacao no Google</span>' +
            '</div>' +
          '</a>' +
        '</div>' +
      '</div>' +
    '</div>';

  return section;
}

export function initStoreSection() {}
