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
    '<div class="aq-schedule-row"><span class="aq-day">Segunda – Sexta</span><span class="aq-hours">14:00 – 18:00</span></div>' +
    '<div class="aq-schedule-row"><span class="aq-day">Sábado</span><span class="aq-hours">10:00 – 13:00</span></div>' +
    '<div class="aq-schedule-row"><span class="aq-day">Domingo</span><span class="aq-closed">Encerrado</span></div>';
  infoPanel.appendChild(scheduleCard);

  // Card: redes sociais
  var socialCard = document.createElement('div');
  socialCard.className = 'aq-contact-card';
  socialCard.innerHTML =
    '<div class="aq-contact-card-title">Redes Sociais</div>' +
    '<div class="aq-footer-social" style="display: flex; gap: 12px; margin-top: 16px;">' +
      '<a href="https://www.facebook.com/profile.php?id=100057636542230" class="social-link link-social-facebook" target="_blank" title="Facebook" style="display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(8, 238, 188, 0.25); color: rgba(255, 255, 255, 0.7); transition: 0.2s; text-decoration: none; box-shadow: none;">' +
        '<svg class="svg-inline--fa fa-facebook fa-w-16" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="facebook" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path></svg>' +
      '</a>' +
      '<a href="https://www.instagram.com/aquariumlifept?igsh=ZjdkeG15ZmFzNWdj" class="social-link link-social-instagram" target="_blank" title="Instagram" style="display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(8, 238, 188, 0.25); color: rgba(255, 255, 255, 0.7); transition: 0.2s; text-decoration: none;">' +
        '<svg class="svg-inline--fa fa-instagram fa-w-14" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="instagram" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>' +
      '</a>' +
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

// ── /PRODUCT ─────────────────────────────────────────────────
function initProductPage() {
  if (!document.body.classList.contains('page-product')) return;
  var relatedSection = document.querySelector('.related-products');
  if (relatedSection) {
    // 1. Mudar o título
    var title = relatedSection.querySelector('.title, h1, h2, h3, .section-title');
    if (title) {
      title.textContent = 'Podes também gostar de:';
      title.style.display = 'block'; // garantir que não foi oculto
    }
    
    // 2. Limitar a 3 produtos e desligar as funções de slide visuais
    // (Ocultar nav via CSS, mas aqui vamos forçar a remoção das setas e clones se possível)
    setTimeout(function() {
      var owlStage = relatedSection.querySelector('.owl-stage');
      if (owlStage) {
        // Desativar transform
        owlStage.style.setProperty('transform', 'none', 'important');
        owlStage.style.setProperty('width', '100%', 'important');
        owlStage.style.setProperty('display', 'flex', 'important');
        owlStage.style.setProperty('flex-wrap', 'wrap', 'important');
        owlStage.style.setProperty('gap', '20px', 'important');

        // Limpar clones e ocultar extras
        var items = owlStage.children;
        var realCount = 0;
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item.classList.contains('cloned')) {
            item.style.setProperty('display', 'none', 'important');
          } else {
            realCount++;
            if (realCount > 3) {
              item.style.setProperty('display', 'none', 'important');
            } else {
              item.style.setProperty('width', 'calc(33.333% - 14px)', 'important');
            }
          }
        }
      }
    }, 500); // aguardar o owlCarousel inicializar
  }
}

export function initSpecialPages() {
  initSales();
  initNew();
  initContact();
  initProductPage();
}
