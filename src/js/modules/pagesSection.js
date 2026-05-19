/**
 * pagesSection.js - v1
 * Redesign das paginas estaticas do Shopkit (/page/*)
 * - Forcca fundo escuro via JS (independente do CSS)
 * - Adiciona hero contextual por pagina
 * - Adiciona caixa resumo simples ("Em linguagem simples")
 * - Preserva o conteudo original intacto
 */

var PAGE_CONFIG = {
  'politica-de-devolucao': {
    icon: 'fas fa-undo-alt',
    title: 'Politica de Devolucao',
    subtitle: 'Os teus direitos de devolucao e reembolso',
    summary: [
      { icon: 'fas fa-calendar-check', label: '14 dias', desc: 'Tens 14 dias apos receber a encomenda para devolver qualquer produto, sem precisar de justificar.' },
      { icon: 'fas fa-box', label: 'Embalagem original', desc: 'O produto deve ser devolvido na embalagem original, sem sinais de uso.' },
      { icon: 'fas fa-money-bill-wave', label: 'Reembolso total', desc: 'Devolves o produto e nos devolvemos o dinheiro, incluindo os portes de envio originais.' },
      { icon: 'fas fa-fish', label: 'Seres vivos', desc: 'Peixes, plantas e invertebrados nao podem ser devolvidos por razoes de bem-estar animal.' }
    ]
  },
  'politica-de-entrega': {
    icon: 'fas fa-shipping-fast',
    title: 'Politica de Entrega',
    subtitle: 'Como e quando recebes a tua encomenda',
    summary: [
      { icon: 'fas fa-clock', label: '2-5 dias uteis', desc: 'Equipamentos e produtos secos chegam entre 2 a 5 dias uteis apos o pagamento.' },
      { icon: 'fas fa-leaf', label: 'Seres vivos', desc: 'Plantas, peixes e invertebrados sao enviados as teras e quartas para chegarem frescos.' },
      { icon: 'fas fa-truck', label: 'Portes gratuitos', desc: 'Encomendas acima de 50 euros tem portes gratuitos para Portugal continental.' },
      { icon: 'fas fa-map-marker-alt', label: 'Todo o pais', desc: 'Enviamos para Portugal continental, Madeira e Acores.' }
    ]
  },
  'politica-de-privacidade-e-cookies': {
    icon: 'fas fa-shield-alt',
    title: 'Privacidade e Cookies',
    subtitle: 'Como protegemos os teus dados pessoais',
    summary: [
      { icon: 'fas fa-lock', label: 'Dados seguros', desc: 'Os teus dados pessoais (nome, morada, email) sao usados apenas para processar as tuas encomendas.' },
      { icon: 'fas fa-cookie', label: 'Cookies', desc: 'Usamos cookies para melhorar a tua experiencia de navegacao. Podes recusa-los nas definicoes do browser.' },
      { icon: 'fas fa-ban', label: 'Sem partilha', desc: 'Nunca vendemos nem partilhamos os teus dados com terceiros para fins comerciais.' },
      { icon: 'fas fa-user-shield', label: 'Os teus direitos', desc: 'Podes pedir a qualquer momento que apaguemos os teus dados ou que te enviemos uma copia.' }
    ]
  },
  'resolucao-de-litigios': {
    icon: 'fas fa-balance-scale',
    title: 'Resolucao de Litigios',
    subtitle: 'Como resolver um problema connosco',
    summary: [
      { icon: 'fas fa-comments', label: '1. Fala connosco', desc: 'Primeiro contacta-nos diretamente. Resolvemos a maioria dos problemas rapidamente.' },
      { icon: 'fas fa-handshake', label: '2. Mediacao', desc: 'Se nao chegarmos a acordo, podes recorrer a entidades de mediacao de conflitos de consumo.' },
      { icon: 'fas fa-globe', label: 'Plataforma europeia', desc: 'Como loja europeia, tambem podes usar a plataforma online de resolucao de litigios da UE.' },
      { icon: 'fas fa-gavel', label: 'Tribunal', desc: 'Em ultimo recurso, podes recorrer aos tribunais. O tribunal competente e o da tua area de residencia.' }
    ]
  },
  'termos-e-condicoes': {
    icon: 'fas fa-file-contract',
    title: 'Termos e Condicoes',
    subtitle: 'As regras que regem as compras na nossa loja',
    summary: [
      { icon: 'fas fa-shopping-cart', label: 'Ao comprar', desc: 'Ao finalizar uma compra, aceitas estes termos e crias um contrato connosco.' },
      { icon: 'fas fa-credit-card', label: 'Pagamento', desc: 'Aceitamos cartao de credito, debito, MB Way e transferencia bancaria.' },
      { icon: 'fas fa-tag', label: 'Precos', desc: 'Os precos mostrados incluem IVA. Reservamo-nos o direito de alterar precos sem aviso previo.' },
      { icon: 'fas fa-star', label: 'Qualidade', desc: 'Todos os produtos sao verificados antes do envio. Em caso de defeito, substituimos sem custo.' }
    ]
  },
  'livro-de-reclamacoes': {
    icon: 'fas fa-book-open',
    title: 'Livro de Reclamacoes',
    subtitle: 'A tua opiniao e importante para nos',
    summary: [
      { icon: 'fas fa-pencil-alt', label: 'Como reclamar', desc: 'Podes apresentar uma reclamacao diretamente nesta pagina ou pelo Livro de Reclamacoes Eletronico.' },
      { icon: 'fas fa-reply', label: 'Resposta rapida', desc: 'Comprometemo-nos a responder a todas as reclamacoes em ate 5 dias uteis.' },
      { icon: 'fas fa-heart', label: 'O nosso objetivo', desc: 'Queremos que fiques satisfeito. Uma reclamacao e uma oportunidade de melhorar.' },
      { icon: 'fas fa-envelope', label: 'Contacto direto', desc: 'Podes tambem contactar-nos por email ou telefone para resolver o problema mais rapidamente.' }
    ]
  }
};

function getPageSlug() {
  var path = window.location.pathname;
  var match = path.match(/\/page\/([^\/]+)/);
  return match ? match[1] : null;
}

function forceDarkBackground() {
  // Forcar fundo escuro via JS inline style (ultrapassa qualquer CSS do Shopkit)
  var selectors = [
    '.main', '.page.section', '.page-content',
    '.well', '.well-featured', '.well-shadow',
    '.page .col', '.page .row', '.page .container-fluid'
  ];
  selectors.forEach(function(sel) {
    Array.from(document.querySelectorAll(sel)).forEach(function(el) {
      el.style.setProperty('background', '#00040D', 'important');
      el.style.setProperty('background-color', '#00040D', 'important');
      el.style.setProperty('box-shadow', 'none', 'important');
      el.style.setProperty('color', 'rgba(255,255,255,0.88)', 'important');
    });
  });
}

function buildSummaryCard(item) {
  return '<div class="aq-pg-card">' +
    '<div class="aq-pg-card-icon"><i class="' + item.icon + '"></i></div>' +
    '<div class="aq-pg-card-content">' +
      '<strong class="aq-pg-card-label">' + item.label + '</strong>' +
      '<p class="aq-pg-card-desc">' + item.desc + '</p>' +
    '</div>' +
  '</div>';
}

function buildHero(config) {
  var hero = document.createElement('div');
  hero.className = 'aq-pg-hero';
  hero.innerHTML =
    '<div class="aq-pg-hero-bg"></div>' +
    '<div class="aq-pg-hero-inner">' +
      '<div class="aq-pg-hero-icon"><i class="' + config.icon + '"></i></div>' +
      '<h1 class="aq-pg-hero-title">' + config.title + '</h1>' +
      '<p class="aq-pg-hero-sub">' + config.subtitle + '</p>' +
    '</div>';
  return hero;
}

function buildSummaryBox(config) {
  var box = document.createElement('div');
  box.className = 'aq-pg-summary';
  box.innerHTML =
    '<div class="aq-pg-summary-header">' +
      '<i class="fas fa-lightbulb"></i>' +
      '<span>Em linguagem simples</span>' +
    '</div>' +
    '<div class="aq-pg-summary-grid">' +
      config.summary.map(buildSummaryCard).join('') +
    '</div>';
  return box;
}

function redesignPage() {
  var path = window.location.pathname;
  if (!path.startsWith('/page/')) return;
  if (document.body.classList.contains('aq-page-styled')) return;
  document.body.classList.add('aq-page-styled');

  var slug = getPageSlug();
  var config = slug ? PAGE_CONFIG[slug] : null;

  // Forcar fundo escuro imediatamente
  forceDarkBackground();

  // Ocultar titulo nativo (vamos substituir pelo hero)
  var nativeTitle = document.querySelector('h1.page-title, h1.title');
  if (nativeTitle) nativeTitle.style.setProperty('display', 'none', 'important');

  // Encontrar container
  var container = document.querySelector('.page.section .container-fluid, .page .container-fluid')
    || document.querySelector('.main')
    || document.body;

  // Encontrar .page-content (conteudo original)
  var pageContent = document.querySelector('.page-content');
  if (pageContent) {
    // Estilizar o conteudo original
    pageContent.classList.add('aq-pg-content');
    // Forcar estilos inline no conteudo
    pageContent.style.setProperty('background', '#00040D', 'important');
    pageContent.style.setProperty('color', 'rgba(255,255,255,0.88)', 'important');
    pageContent.style.setProperty('box-shadow', 'none', 'important');
    pageContent.style.setProperty('border', '1px solid rgba(8,238,188,0.1)', 'important');
    pageContent.style.setProperty('border-radius', '16px', 'important');
    pageContent.style.setProperty('padding', '40px', 'important');

    // Estilizar elementos internos
    Array.from(pageContent.querySelectorAll('h2,h3,h4,h5')).forEach(function(el) {
      el.style.setProperty('color', '#FFFFFF', 'important');
      el.style.setProperty('font-family', "'Poppins', sans-serif", 'important');
      el.style.setProperty('margin-top', '2em', 'important');
    });
    Array.from(pageContent.querySelectorAll('h3,h5')).forEach(function(el) {
      el.style.setProperty('color', '#08EEBC', 'important');
    });
    Array.from(pageContent.querySelectorAll('p,li')).forEach(function(el) {
      el.style.setProperty('color', 'rgba(255,255,255,0.85)', 'important');
      el.style.setProperty('line-height', '1.8', 'important');
    });
    Array.from(pageContent.querySelectorAll('a')).forEach(function(el) {
      el.style.setProperty('color', '#08EEBC', 'important');
    });
    Array.from(pageContent.querySelectorAll('ul,ol')).forEach(function(el) {
      el.style.setProperty('padding-left', '1.5em', 'important');
    });
    Array.from(pageContent.querySelectorAll('strong,b')).forEach(function(el) {
      el.style.setProperty('color', '#FFFFFF', 'important');
    });
  }

  if (!config) return;

  // Inserir hero antes do conteudo
  var hero = buildHero(config);
  container.insertBefore(hero, container.firstChild);

  // Inserir caixa resumo antes do page-content
  if (pageContent) {
    var summaryBox = buildSummaryBox(config);
    pageContent.parentNode.insertBefore(summaryBox, pageContent);
  }

  console.log('[AQ] Page redesign: ' + slug);
}

export function initPagesSection() {
  if (!window.location.pathname.startsWith('/page/')) return;

  // Forcar fundo imediatamente
  forceDarkBackground();

  // Aplicar redesign quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      redesignPage();
      // Retry para elementos que carregam depois
      setTimeout(forceDarkBackground, 500);
      setTimeout(forceDarkBackground, 1500);
    });
  } else {
    redesignPage();
    setTimeout(forceDarkBackground, 500);
    setTimeout(forceDarkBackground, 1500);
  }
}
