/**
 * blogSection.js - v6
 * - Home: grid de 3 cards com skeleton loader
 * - /blog: hero sofisticado, featured post, filtros por categoria, cards ricos
 * - /blog/*: barra de progresso de leitura, tempo de leitura, indicador de % de conclusao
 */

const BLOG_HREF = '/blog';

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return ''; }
}

function truncate(str, max) {
  if (max === undefined) max = 120;
  if (!str || str.length <= max) return str || '';
  return str.slice(0, max).replace(/\s\S*$/, '') + '…';
}

function estimateReadTime(text) {
  if (!text) return null;
  var words = text.trim().split(/\s+/).length;
  var mins = Math.max(1, Math.round(words / 220));
  return mins + ' min de leitura';
}

// Extrai posts do DOM nativo do Shopkit
function extractPostsFromDOM() {
  var items = document.querySelectorAll('.blog-item');
  if (!items.length) return null;

  var posts = [];
  items.forEach(function(item) {
    var title = item.querySelector('.blog-info, h3, h2');
    title = title ? title.textContent.trim() : '';
    if (!title) return;

    var linkEl = item.closest('a') || item.querySelector('a') ||
                 item.parentElement && item.parentElement.closest('a');
    var href = linkEl ? linkEl.href : BLOG_HREF;

    var preview = item.querySelector('.blog-preview');
    var img = '';
    if (preview) {
      var bg = preview.style.backgroundImage || '';
      var match = bg.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (match) img = match[1];
    }

    var dateEl = item.querySelector('time, .blog-date, .date, .blog-status');
    var date = dateEl ? (dateEl.getAttribute('datetime') || dateEl.textContent.trim()) : '';

    var excerptEl = item.querySelector('p, .blog-excerpt, .blog-text');
    var excerpt = excerptEl ? excerptEl.textContent.trim() : '';

    // Categoria: tenta extrair do link ou de data-attributes
    var catEl = item.querySelector('.blog-category, .category, [data-category]');
    var category = catEl ? (catEl.getAttribute('data-category') || catEl.textContent.trim()) : 'Aquarismo';

    posts.push({ title: title, href: href, img: img, date: date, excerpt: excerpt, category: category });
  });

  return posts.length ? posts : null;
}

// ── Secao Blog na Home ────────────────────────────────────────────────────────
function buildPostCard(post) {
  var title = post.title;
  var href = post.href;
  var img = post.img;
  var date = post.date;
  var excerpt = post.excerpt;
  var category = post.category || 'Aquarismo';

  var card = document.createElement('a');
  card.href = href;
  card.className = 'aq-blog-card';
  card.setAttribute('aria-label', 'Ler artigo: ' + title);

  card.innerHTML = '<div class="aq-blog-card-img">' +
    (img
      ? '<img src="' + img + '" alt="' + title + '" loading="lazy"/>'
      : '<div class="aq-blog-card-img-placeholder">' +
          '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" stroke-width="2"/>' +
            '<circle cx="18" cy="22" r="4" stroke="currentColor" stroke-width="2"/>' +
            '<path d="M6 34l10-10 6 6 8-8 12 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' +
          '</svg>' +
        '</div>') +
    '<span class="aq-blog-card-tag">' + category + '</span>' +
    '</div>' +
    '<div class="aq-blog-card-body">' +
      '<div class="aq-blog-card-meta">' +
        (date ? '<time class="aq-blog-card-date">' + date + '</time>' : '') +
      '</div>' +
      '<h3 class="aq-blog-card-title">' + title + '</h3>' +
      (excerpt ? '<p class="aq-blog-card-excerpt">' + truncate(excerpt) + '</p>' : '') +
      '<span class="aq-blog-card-cta">Ler artigo ' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M5 12h14M12 5l7 7-7 7"/>' +
        '</svg>' +
      '</span>' +
    '</div>';
  return card;
}

export async function buildBlogSection() {
  if (document.getElementById('aq-blog-home')) return null;

  var section = document.createElement('section');
  section.id = 'aq-blog-home';
  section.innerHTML =
    '<div class="aq-section-header">' +
      '<span class="aq-section-tag">Do nosso blogue</span>' +
      '<h2 class="aq-section-title">Mergulha no Mundo do <span class="aq-neon">Aquarismo</span></h2>' +
      '<p class="aq-section-sub">Dicas de especialistas, guias passo a passo, novidades do hobby e tudo sobre peixes, plantas e aquascaping — escrito por quem vive o aquarismo todos os dias.</p>' +
    '</div>' +
    '<div class="aq-blog-grid" id="aq-blog-grid"></div>' +
    '<div class="aq-blog-home-cta">' +
      '<a href="' + BLOG_HREF + '" class="aq-btn-outline">' +
        'Ver todos os artigos' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M5 12h14M12 5l7 7-7 7"/>' +
        '</svg>' +
      '</a>' +
    '</div>';

  var grid = section.querySelector('#aq-blog-grid');
  var posts = extractPostsFromDOM();

  if (posts && posts.length) {
    posts.slice(0, 3).forEach(function(p) { grid.appendChild(buildPostCard(p)); });
    console.log('[AQ] Blog: extraidos', posts.length, 'posts do DOM');
  } else {
    grid.innerHTML = '<div class="aq-blog-empty"><p>Em breve novos artigos sobre aquarismo!</p></div>';
    console.warn('[AQ] Blog: sem posts no DOM');
  }

  return section;
}

// ── Redesign /blog ────────────────────────────────────────────────────────────
function redesignBlogListing() {
  var path = window.location.pathname;
  if (path !== '/blog' && path !== '/blog/') return;
  if (document.body.classList.contains('aq-blog-styled')) return;
  document.body.classList.add('aq-blog-styled', 'aq-page-blog');

  // Hero header sofisticado
  var heroWrap = document.createElement('div');
  heroWrap.className = 'aq-blog-hero';
  heroWrap.innerHTML =
    '<div class="aq-blog-hero-bg">' +
      '<div class="aq-blog-hero-orb aq-blog-hero-orb--1"></div>' +
      '<div class="aq-blog-hero-orb aq-blog-hero-orb--2"></div>' +
      '<div class="aq-blog-hero-orb aq-blog-hero-orb--3"></div>' +
    '</div>' +
    '<div class="aq-blog-hero-content">' +
      '<span class="aq-section-tag">Blog</span>' +
      '<h1 class="aq-blog-hero-title">Mundo do <span class="aq-neon">Aquarismo</span></h1>' +
      '<p class="aq-blog-hero-sub">Dicas de especialistas, guias passo-a-passo e novidades do mundo aquatico — escritos por quem vive isto todos os dias.</p>' +
      '<div class="aq-blog-hero-stats">' +
        '<div class="aq-blog-hero-stat"><span class="aq-blog-hero-stat-num" id="aq-blog-post-count">0</span><span class="aq-blog-hero-stat-label">Artigos</span></div>' +
        '<div class="aq-blog-hero-stat"><span class="aq-blog-hero-stat-num">5+</span><span class="aq-blog-hero-stat-label">Categorias</span></div>' +
        '<div class="aq-blog-hero-stat"><span class="aq-blog-hero-stat-num">2+</span><span class="aq-blog-hero-stat-label">Anos de conteudo</span></div>' +
      '</div>' +
    '</div>';

  // Filtros de categoria
  var filterBar = document.createElement('div');
  filterBar.className = 'aq-blog-filters';
  filterBar.id = 'aq-blog-filters';
  var cats = ['Todos', 'Aquascaping', 'Peixes', 'Plantas', 'Equipamentos', 'Manutencao'];
  filterBar.innerHTML = cats.map(function(c, i) {
    return '<button class="aq-blog-filter-btn' + (i === 0 ? ' active' : '') + '" data-cat="' + c + '">' + c + '</button>';
  }).join('');

  // Inject no inicio do main/container da pagina
  var pageTitle = document.querySelector('.page-title, .blog-title, h1.title, .section-title');
  var container = pageTitle ? (pageTitle.closest('section, .container, .row') || document.querySelector('main, #content')) : document.querySelector('main, #content');
  var parent = container ? container.parentNode : document.body;
  var insertBefore = container || document.body.firstChild;

  parent.insertBefore(heroWrap, insertBefore);
  parent.insertBefore(filterBar, insertBefore);
  if (pageTitle) pageTitle.style.setProperty('display', 'none', 'important');

  // Aplicar estilos nos cards nativos e contagem
  setTimeout(function() {
    var cards = document.querySelectorAll('.post, .blog-item, [class*="post-item"]');
    var count = document.getElementById('aq-blog-post-count');
    if (count) count.textContent = cards.length || '...';

    cards.forEach(function(card, idx) {
      card.classList.add('aq-blog-native-card');
      // Dar destaque ao primeiro card
      if (idx === 0) card.classList.add('aq-blog-native-card--featured');
    });

    // Filtros: esconder/mostrar por categoria data-attribute
    filterBar.querySelectorAll('.aq-blog-filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBar.querySelector('.active') && filterBar.querySelector('.active').classList.remove('active');
        btn.classList.add('active');
        var cat = btn.getAttribute('data-cat');
        cards.forEach(function(card) {
          if (cat === 'Todos') {
            card.style.display = '';
          } else {
            var cardCat = card.getAttribute('data-category') || '';
            card.style.display = (cardCat.toLowerCase().indexOf(cat.toLowerCase()) !== -1) ? '' : 'none';
          }
        });
      });
    });
  }, 600);
}

// ── Post Individual ───────────────────────────────────────────────────────────
function redesignBlogPost() {
  var path = window.location.pathname;
  if (!path.startsWith('/blog/') && !path.startsWith('/post/')) return;
  if (document.body.classList.contains('aq-post-styled')) return;
  document.body.classList.add('aq-post-styled', 'aq-page-post');

  // Barra de progresso de leitura (sticky no topo)
  var progressBar = document.createElement('div');
  progressBar.id = 'aq-read-progress';
  progressBar.innerHTML = '<div class="aq-read-progress-fill" id="aq-read-progress-fill"></div>';
  document.body.prepend(progressBar);

  // Indicador flutuante de % de conclusao
  var pctBadge = document.createElement('div');
  pctBadge.id = 'aq-read-pct';
  pctBadge.innerHTML = '<span id="aq-read-pct-num">0</span><span class="aq-read-pct-label">%</span>';
  document.body.appendChild(pctBadge);

  // Scroll listener para progresso
  function onScroll() {
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var scrollHeight = doc.scrollHeight - doc.clientHeight;
    var pct = scrollHeight > 0 ? Math.min(100, Math.round((scrollTop / scrollHeight) * 100)) : 0;

    var fill = document.getElementById('aq-read-progress-fill');
    if (fill) fill.style.width = pct + '%';

    var num = document.getElementById('aq-read-pct-num');
    if (num) num.textContent = pct;

    // Mostrar badge so apos 5% de scroll
    if (pct >= 5) {
      pctBadge.classList.add('visible');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Botao voltar
  if (!document.getElementById('aq-post-back')) {
    var btn = document.createElement('a');
    btn.id = 'aq-post-back'; btn.href = BLOG_HREF; btn.className = 'aq-post-back-btn';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Voltar ao Blog';
    var art = document.querySelector('article, .post-wrapper, main > .container');
    if (art) art.prepend(btn);
  }

  // Classes para styling
  document.querySelector('.post-title, .article-title, h1.title, .blog-post-title') &&
    document.querySelector('.post-title, .article-title, h1.title, .blog-post-title').classList.add('aq-post-title');
  document.querySelectorAll('.post-date, .post-meta, .article-meta').forEach(function(el) { el.classList.add('aq-post-meta'); });
  document.querySelectorAll('.post-image, .post-thumbnail, .article-image').forEach(function(el) { el.classList.add('aq-post-featured-img'); });
  var bodyEls = document.querySelectorAll('.post-body, .post-content, .article-body');
  bodyEls.forEach(function(el) { el.classList.add('aq-post-body'); });

  // Tempo de leitura
  var bodyEl = document.querySelector('.post-body, .post-content, .article-body');
  var readTime = estimateReadTime(bodyEl ? bodyEl.textContent : '');
  var metaEls = document.querySelectorAll('.aq-post-meta, .post-meta, .article-meta');
  if (readTime && metaEls.length) {
    var timeTag = document.createElement('span');
    timeTag.className = 'aq-post-read-time';
    timeTag.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>' +
      '</svg>' + readTime;
    metaEls[0].appendChild(timeTag);
  }
}

export function initBlogSection() {
  var path = window.location.pathname;
  if (path === '/blog' || path === '/blog/') redesignBlogListing();
  else if (path.startsWith('/blog/') || path.startsWith('/post/')) redesignBlogPost();
}
