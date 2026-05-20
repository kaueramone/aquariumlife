/**
 * specialPages.js
 * Injeta heroes e layouts nas páginas /sales, /new e /contact
 */

// ── Hero genérico ─────────────────────────────────────────────
function injectHero(tag, icon, title, titleHighlight, sub, afterEl) {
  var hero = document.createElement('div');
  hero.className = 'aq-sp-hero';
  hero.innerHTML =
    '<div class="aq-sp-tag"><i class="' + icon + '"></i>' + tag + '</div>' +
    '<h1 class="aq-sp-title">' + title + (titleHighlight ? ' <span>' + titleHighlight + '</span>' : '') + '</h1>' +
    '<p class="aq-sp-sub">' + sub + '</p>';
  if (afterEl && afterEl.parentNode) {
    afterEl.parentNode.insertBefore(hero, afterEl);
  }
}

// ── /SALES ────────────────────────────────────────────────────
function initSales() {
  if (!document.body.classList.contains('page-sales')) return;
  var section = document.querySelector('.products.section');
  if (!section) return;
  injectHero(
    'Promoções',
    'ri-price-tag-3-line',
    'As Melhores',
    'Ofertas',
    'Produtos selecionados com descontos especiais para o teu aquário. Qualidade premium a preços que fazem sentido.',
    section
  );
}

// ── /NEW ──────────────────────────────────────────────────────
function initNew() {
  if (!document.body.classList.contains('page-new')) return;
  var section = document.querySelector('.products.section');
  if (!section) return;
  injectHero(
    'Novidades',
    'ri-sparkling-line',
    'Acabou de',
    'Chegar',
    'Os produtos mais recentes para o teu aquário. Equipamentos, decoração e acessórios frescos do mercado.',
    section
  );
}

// ── /CONTACT ─────────────────────────────────────────────────
function initContact() {
  if (!document.body.classList.contains('page-contact')) return;
  var section = document.querySelector('.contacts.section');
  if (!section) return;

  // Ocultar titulo nativo
  var nativeTitle = section.querySelector('.contacts-title');
  if (nativeTitle) nativeTitle.style.display = 'none';

  // Injetar hero
  injectHero(
    'Fala Connosco',
    'ri-map-pin-line',
    'Estamos',
    'Aqui para Ti',
    'Visita-nos em Porto Salvo, envia-nos uma mensagem ou liga diretamente. Respondemos sempre com prazer.',
    section
  );

  // Encontrar o formulário nativo e o mapa
  var contactsDetails = section.querySelector('.contacts-details');
  var nativeForm = section.querySelector('form, .contacts-form, .contact-form');
  var nativeMap = section.querySelector('iframe, .contact-map');

  // Criar layout de dois painéis
  var body = document.createElement('div');
  body.className = 'aq-contact-body';

  // -- Painel esquerdo: info --
  var infoPanel = document.createElement('div');
  infoPanel.className = 'aq-contact-info';

  // Card: morada + telefone
  var infoCard = document.createElement('div');
  infoCard.className = 'aq-contact-card';
  infoCard.innerHTML =
    '<div class="aq-contact-card-title">Informações</div>' +
    '<div class="aq-contact-row"><i class="ri-map-pin-2-line"></i><span>Praceta José Afonso nº3A<br>2740-192 Porto Salvo, Oeiras</span></div>' +
    '<div class="aq-contact-row"><i class="ri-phone-line"></i><a href="tel:+351964331915">+351 964 331 915</a></div>' +
    '<div class="aq-contact-row"><i class="ri-mail-line"></i><a href="mailto:geral@aquariumlife.pt">geral@aquariumlife.pt</a></div>';
  infoPanel.appendChild(infoCard);

  // Card: horário
  var scheduleCard = document.createElement('div');
  scheduleCard.className = 'aq-contact-card';
  scheduleCard.innerHTML =
    '<div class="aq-contact-card-title">Horário de Funcionamento</div>' +
    '<div class="aq-schedule-row"><span class="aq-day">Segunda – Sexta</span><span class="aq-hours">10:00 – 19:00</span></div>' +
    '<div class="aq-schedule-row"><span class="aq-day">Sábado</span><span class="aq-hours">10:00 – 13:00</span></div>' +
    '<div class="aq-schedule-row"><span class="aq-day">Domingo</span><span class="aq-closed">Encerrado</span></div>';
  infoPanel.appendChild(scheduleCard);

  // Card: redes sociais
  var socialCard = document.createElement('div');
  socialCard.className = 'aq-contact-card';
  socialCard.innerHTML =
    '<div class="aq-contact-card-title">Redes Sociais</div>' +
    '<div class="aq-contact-social">' +
      '<a href="https://www.facebook.com/aquariumlife.pt" target="_blank" rel="noopener" title="Facebook"><i class="ri-facebook-fill"></i></a>' +
      '<a href="https://www.instagram.com/aquariumlife.pt" target="_blank" rel="noopener" title="Instagram"><i class="ri-instagram-line"></i></a>' +
      '<a href="https://www.youtube.com/@aquariumlifept" target="_blank" rel="noopener" title="YouTube"><i class="ri-youtube-fill"></i></a>' +
    '</div>';
  infoPanel.appendChild(socialCard);

  // Mapa nativo (se existir)
  if (nativeMap) {
    infoPanel.appendChild(nativeMap);
  }

  // -- Painel direito: formulário --
  var formWrap = document.createElement('div');
  formWrap.className = 'aq-contact-form-wrap';

  var formTitle = document.createElement('div');
  formTitle.className = 'aq-form-title';
  formTitle.innerHTML = 'Enviar <span>Mensagem</span>';
  formWrap.appendChild(formTitle);

  if (nativeForm) {
    formWrap.appendChild(nativeForm);
  } else {
    // Fallback se o form não existir ainda
    var placeholder = document.createElement('p');
    placeholder.style.color = 'rgba(255,255,255,0.4)';
    placeholder.style.textAlign = 'center';
    placeholder.style.padding = '40px 0';
    placeholder.textContent = 'Formulário de contacto em breve.';
    formWrap.appendChild(placeholder);
  }

  body.appendChild(infoPanel);
  body.appendChild(formWrap);

  // Limpar o conteúdo nativo e inserir o novo layout
  if (contactsDetails) {
    contactsDetails.innerHTML = '';
    contactsDetails.appendChild(body);
  } else {
    section.appendChild(body);
  }
}

export function initSpecialPages() {
  initSales();
  initNew();
  initContact();
}
