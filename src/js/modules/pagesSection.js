/**
 * pagesSection.js - v2
 * Redesign das paginas estaticas do Shopkit (/page/*)
 * Fundo escuro forcado via JS + hero + resumo para leigos
 */

var PAGE_CONFIG = {
  'politica-de-devolucao': {
    icon: 'fas fa-undo-alt',
    title: 'Política de Devolução',
    subtitle: 'Os teus direitos de devolução e reembolso, explicados de forma simples.',
    summary: [
      { icon: 'fas fa-calendar-check', label: '14 dias para devolver', desc: 'Tens 14 dias após receberes a encomenda para devolver qualquer produto, sem precisares de justificar o motivo.' },
      { icon: 'fas fa-box', label: 'Embalagem original', desc: 'O produto deve ser devolvido na embalagem original e sem sinais de uso ou danos.' },
      { icon: 'fas fa-money-bill-wave', label: 'Reembolso total', desc: 'Ao devolveres o produto em boas condições, reembolsamos o valor total, incluindo os portes de envio originais.' },
      { icon: 'fas fa-fish', label: 'Seres vivos excluídos', desc: 'Peixes, plantas e invertebrados não podem ser devolvidos por razões de bem-estar animal e legislação em vigor.' }
    ]
  },
  'politica-de-entrega': {
    icon: 'fas fa-shipping-fast',
    title: 'Política de Entrega',
    subtitle: 'Como e quando recebes a tua encomenda, sem surpresas.',
    summary: [
      { icon: 'fas fa-clock', label: '2 a 5 dias úteis', desc: 'Equipamentos e produtos secos chegam entre 2 a 5 dias úteis após a confirmação do pagamento.' },
      { icon: 'fas fa-leaf', label: 'Seres vivos: Terças e Quartas', desc: 'Plantas, peixes e invertebrados são enviados às Terças e Quartas-feiras para chegarem frescos, evitando atrasos de fim de semana.' },
      { icon: 'fas fa-truck', label: 'Portes gratuitos acima de 50€', desc: 'Encomendas com valor superior a 50€ têm portes gratuitos para Portugal continental.' },
      { icon: 'fas fa-map-marker-alt', label: 'Enviamos para todo o país', desc: 'Entregamos em Portugal continental, Madeira e Açores. Os prazos e custos variam consoante o destino.' }
    ]
  },
  'politica-de-privacidade-e-cookies': {
    icon: 'fas fa-shield-alt',
    title: 'Privacidade e Cookies',
    subtitle: 'Como protegemos os teus dados pessoais e respeitamos a tua privacidade.',
    summary: [
      { icon: 'fas fa-lock', label: 'Os teus dados estão seguros', desc: 'Os teus dados — nome, morada e e-mail — são usados exclusivamente para processar encomendas e contactar-te.' },
      { icon: 'fas fa-cookie', label: 'O que são cookies?', desc: 'Cookies são pequenos ficheiros que melhoram a tua navegação. Podes recusá-los nas definições do teu browser.' },
      { icon: 'fas fa-ban', label: 'Sem partilha com terceiros', desc: 'Nunca vendemos nem partilhamos os teus dados com terceiros para fins comerciais ou publicitários.' },
      { icon: 'fas fa-user-shield', label: 'Os teus direitos', desc: 'Podes solicitar a qualquer momento que apaguemos, corrijamos ou te enviemos uma cópia dos teus dados.' }
    ]
  },
  'resolucao-de-litigios': {
    icon: 'fas fa-balance-scale',
    title: 'Resolução de Litígios',
    subtitle: 'O que fazer se tiveres algum problema connosco.',
    summary: [
      { icon: 'fas fa-comments', label: '1.º Fala connosco', desc: 'O primeiro passo é contactares-nos directamente. Resolvemos a grande maioria dos problemas de forma rápida e amigável.' },
      { icon: 'fas fa-handshake', label: '2.º Mediação', desc: 'Se não chegarmos a acordo, podes recorrer a entidades de mediação de conflitos de consumo reconhecidas em Portugal.' },
      { icon: 'fas fa-globe', label: 'Plataforma europeia (ODR)', desc: 'Enquanto loja europeia, também podes usar a plataforma online de resolução de litígios da União Europeia.' },
      { icon: 'fas fa-gavel', label: '3.º Tribunal', desc: 'Em último recurso, podes recorrer aos tribunais portugueses. O tribunal competente é o da tua área de residência.' }
    ]
  },
  'termos-e-condicoes': {
    icon: 'fas fa-file-contract',
    title: 'Termos e Condições',
    subtitle: 'As regras que regem as compras na nossa loja, de forma transparente.',
    summary: [
      { icon: 'fas fa-shopping-cart', label: 'Ao finalizar uma compra', desc: 'Ao concluíres uma encomenda, estás a aceitar estes termos e a celebrar um contrato de compra e venda connosco.' },
      { icon: 'fas fa-credit-card', label: 'Meios de pagamento', desc: 'Aceitamos cartão de crédito, débito, MB Way e transferência bancária. O pagamento é confirmado antes do envio.' },
      { icon: 'fas fa-tag', label: 'Preços com IVA incluído', desc: 'Todos os preços incluem IVA à taxa legal em vigor. Reservamo-nos o direito de actualizar preços sem aviso prévio.' },
      { icon: 'fas fa-star', label: 'Garantia de qualidade', desc: 'Todos os produtos são verificados antes do envio. Em caso de defeito, substituímos ou reembolsamos sem custo.' }
    ]
  },
  'livro-de-reclamacoes': {
    icon: 'fas fa-book-open',
    title: 'Livro de Reclamações',
    subtitle: 'A tua opinião é importante para nós. Aqui explicamos como reclamar.',
    summary: [
      { icon: 'fas fa-pencil-alt', label: 'Como apresentar uma reclamação', desc: 'Podes reclamar através do Livro de Reclamações Electrónico ou presencialmente na nossa loja em Porto Salvo.' },
      { icon: 'fas fa-reply', label: 'Resposta em 5 dias úteis', desc: 'Comprometemo-nos a analisar e responder a todas as reclamações no prazo máximo de 5 dias úteis.' },
      { icon: 'fas fa-heart', label: 'O nosso compromisso', desc: 'Encaramos cada reclamação como uma oportunidade de melhorar. A tua satisfação é a nossa prioridade.' },
      { icon: 'fas fa-envelope', label: 'Contacto directo', desc: 'Podes também contactar-nos por e-mail ou telefone para resolvermos o problema de forma mais rápida.' }
    ]
  }
};

function getPageSlug() {
  var match = window.location.pathname.match(/\/page\/([^\/]+)/);
  return match ? match[1] : null;
}

function forceDark() {
  var sels = ['.main','.page.section','.page-content','.well','.well-featured','.well-shadow','.page .col','.page .row','.page .container-fluid'];
  sels.forEach(function(s) {
    Array.from(document.querySelectorAll(s)).forEach(function(el) {
      el.style.setProperty('background','#00040D','important');
      el.style.setProperty('background-color','#00040D','important');
      el.style.setProperty('box-shadow','none','important');
      el.style.setProperty('color','rgba(255,255,255,0.88)','important');
    });
  });
}

function styleContent(el) {
  el.style.setProperty('background','#00040D','important');
  el.style.setProperty('color','rgba(255,255,255,0.88)','important');
  el.style.setProperty('box-shadow','none','important');
  el.style.setProperty('border','1px solid rgba(8,238,188,0.1)','important');
  el.style.setProperty('border-radius','16px','important');
  el.style.setProperty('padding','40px','important');
  Array.from(el.querySelectorAll('h2,h3,h4,h5')).forEach(function(h) {
    h.style.setProperty('color','#FFFFFF','important');
    h.style.setProperty('font-family',"'Poppins',sans-serif",'important');
    h.style.setProperty('margin-top','2em','important');
  });
  Array.from(el.querySelectorAll('h3,h5')).forEach(function(h) {
    h.style.setProperty('color','#08EEBC','important');
  });
  Array.from(el.querySelectorAll('p,li')).forEach(function(p) {
    p.style.setProperty('color','rgba(255,255,255,0.85)','important');
    p.style.setProperty('line-height','1.8','important');
  });
  Array.from(el.querySelectorAll('a')).forEach(function(a) {
    a.style.setProperty('color','#08EEBC','important');
  });
  Array.from(el.querySelectorAll('strong,b')).forEach(function(b) {
    b.style.setProperty('color','#FFFFFF','important');
  });
  Array.from(el.querySelectorAll('ul,ol')).forEach(function(u) {
    u.style.setProperty('padding-left','1.5em','important');
  });
}

function buildCard(item) {
  return '<div class="aq-pg-card">' +
    '<div class="aq-pg-card-icon"><i class="' + item.icon + '"></i></div>' +
    '<div class="aq-pg-card-content">' +
      '<strong class="aq-pg-card-label">' + item.label + '</strong>' +
      '<p class="aq-pg-card-desc">' + item.desc + '</p>' +
    '</div>' +
  '</div>';
}

function redesignPage() {
  if (!window.location.pathname.startsWith('/page/')) return;
  if (document.body.classList.contains('aq-page-styled')) return;
  document.body.classList.add('aq-page-styled');

  var slug = getPageSlug();
  var cfg = slug ? PAGE_CONFIG[slug] : null;

  forceDark();

  var nativeTitle = document.querySelector('h1.page-title, h1.title');
  if (nativeTitle) nativeTitle.style.setProperty('display','none','important');

  var container = document.querySelector('.page.section .container-fluid, .page .container-fluid')
    || document.querySelector('.main') || document.body;

  var pageContent = document.querySelector('.page-content');
  if (pageContent) {
    pageContent.classList.add('aq-pg-content');
    styleContent(pageContent);
  }

  if (!cfg) return;

  var hero = document.createElement('div');
  hero.className = 'aq-pg-hero';
  hero.innerHTML =
    '<div class="aq-pg-hero-bg"></div>' +
    '<div class="aq-pg-hero-inner">' +
      '<div class="aq-pg-hero-icon"><i class="' + cfg.icon + '"></i></div>' +
      '<h1 class="aq-pg-hero-title">' + cfg.title + '</h1>' +
      '<p class="aq-pg-hero-sub">' + cfg.subtitle + '</p>' +
    '</div>';
  container.insertBefore(hero, container.firstChild);

  if (pageContent && cfg.summary) {
    var box = document.createElement('div');
    box.className = 'aq-pg-summary';
    box.innerHTML =
      '<div class="aq-pg-summary-header"><i class="fas fa-lightbulb"></i><span>Em linguagem simples</span></div>' +
      '<div class="aq-pg-summary-grid">' + cfg.summary.map(buildCard).join('') + '</div>';
    pageContent.parentNode.insertBefore(box, pageContent);
  }

  console.log('[AQ] Pages v2: ' + slug);
}

export function initPagesSection() {
  if (!window.location.pathname.startsWith('/page/')) return;
  forceDark();
  redesignPage();
  setTimeout(forceDark, 500);
  setTimeout(forceDark, 1500);
}
