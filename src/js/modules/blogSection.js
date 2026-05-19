/**
 * blogSection.js - v9
 * DOM real confirmado via inspecao ao vivo:
 *   .blog-page.section > .container-fluid > .blog-row > .blog-col > .col > .blog-item
 *   .blog-item > div.col-lg-3 > .blog-image > a > img.lazy
 *   .blog-item > .blog-post > h2 > a  (titulo+link)
 *   .blog-item > .blog-post > .date-post  (data)
 *   .blog-item > .blog-post > p  (excerpt)
 *   h1.blog-title  (titulo nativo a ocultar)
 */

var BLOG_HREF = '/blog';

function truncate(str, max) {
  if (!max) max = 130;
  if (!str || str.length <= max) return str || '';
  return str.slice(0, max).replace(/\s\S*$/, '') + '...';
}

function estimateReadTime(text) {
  if (!text) return null;
  var words = text.trim().split(/\s+/).length;
  var mins = Math.max(1, Math.round(words / 220));
  return mins + ' min';
}

// Extrai dados de um .blog-item nativo do Shopkit
function extractPost(item) {
  var imgEl   = item.querySelector('.blog-image img, img.lazy, img');
  var linkEl  = item.querySelector('.blog-post h2 a, h2 a, h3 a, a[href*="/post/"]');
  var dateEl  = item.querySelector('.date-post, time, .blog-date, .date');
  var excerptEl = item.querySelector('.blog-post p, p');

  var img    = imgEl  ? (imgEl.getAttribute('data-src') || imgEl.src || '') : '';
  var href   = linkEl ? linkEl.href : BLOG_HREF;
  var title  = linkEl ? linkEl.textContent.trim() : '';
  var date   = dateEl ? dateEl.textContent.trim() : '';
  var excerpt = excerptEl ? excerptEl.textContent.trim() : '';

  // Fallback: imagem do link pai
  if (!img) {
    var aImg = item.querySelector('a img');
    if (aImg) img = aImg.getAttribute('data-src') || aImg.src || '';
  }

  return { img: img, href: href, title: title, date: date, excerpt: excerpt };
}

// Cria card novo no nosso estilo
function buildCard(post, featured) {
  var card = document.createElement('a');
  card.href = post.href;
  card.className = 'aq-bl-card' + (featured ? ' aq-bl-card--featured' : '');
  card.setAttribute('aria-label', 'Ler artigo: ' + post.title);

  var readTime = estimateReadTime(post.excerpt);

  card.innerHTML =
    '<div class="aq-bl-card-img">' +
      (post.img
        ? '<img src="' + post.img + '" alt="' + post.title + '" loading="lazy"/>'
        : '<div class="aq-bl-card-img-ph"><svg viewBox="0 0 48 48" fill="none"><rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="22" r="4" stroke="currentColor" stroke-width="2"/><path d="M6 34l10-10 6 6 8-8 12 12" stroke="currentColor" stroke-width="2"/></svg></div>') +
      '<span class="aq-bl-card-tag">Aquarismo</span>' +
    '</div>' +
    '<div class="aq-bl-card-body">' +
      '<div class="aq-bl-card-meta">' +
        (post.date ? '<time class="aq-bl-card-date"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' + post.date + '</time>' : '') +
        (readTime ? '<span class="aq-bl-card-rt"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' + readTime + '</span>' : '') +
      '</div>' +
      '<h3 class="aq-bl-card-title">' + post.title + '</h3>' +
      (post.excerpt ? '<p class="aq-bl-card-excerpt">' + truncate(post.excerpt) + '</p>' : '') +
      '<span class="aq-bl-card-cta">Ler artigo <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>' +
    '</div>';

  return card;
}

function redesignBlogListing() {
  var path = window.location.pathname;
  if (path !== '/blog' && path !== '/blog/') return;
  if (document.body.classList.contains('aq-blog-styled')) return;
  document.body.classList.add('aq-blog-styled', 'aq-page-blog');

  // Ocultar titulo e estrutura nativa
  var blogTitle = document.querySelector('h1.blog-title, .blog-title');
  if (blogTitle) blogTitle.style.setProperty('display', 'none', 'important');

  // Recolher posts nativos
  var nativeItems = Array.from(document.querySelectorAll('.blog-item'));
  var posts = nativeItems.map(function(item) { return extractPost(item); }).filter(function(p) { return !!p.title; });

  // Ocultar a estrutura nativa do Shopkit
  var blogRow = document.querySelector('.blog-row, .blog-col');
  if (blogRow) blogRow.style.setProperty('display', 'none', 'important');

  // Container onde vamos injectar
  var containerFluid = document.querySelector('.blog-page .container-fluid, .blog-page.section .container-fluid');
  if (!containerFluid) containerFluid = document.querySelector('.main') || document.body;

  // ── Hero ────────────────────────────────────────────────────────────────────
  var hero = document.createElement('div');
  hero.className = 'aq-bl-hero';
  hero.innerHTML =
    '<div class="aq-bl-hero-orbs">' +
      '<div class="aq-bl-orb aq-bl-orb--1"></div>' +
      '<div class="aq-bl-orb aq-bl-orb--2"></div>' +
    '</div>' +
    '<div class="aq-bl-hero-inner">' +
      '<span class="aq-section-tag">Blogue</span>' +
      '<h1 class="aq-bl-hero-title">Mundo do <span class="aq-neon">Aquarismo</span></h1>' +
      '<p class="aq-bl-hero-sub">Guias, dicas de especialistas e novidades do hobby — escritos por quem vive o aquarismo todos os dias.</p>' +
    '</div>';

  // ── Grid ────────────────────────────────────────────────────────────────────
  var gridWrap = document.createElement('div');
  gridWrap.className = 'aq-bl-wrap';

  var grid = document.createElement('div');
  grid.className = 'aq-bl-grid';
  grid.id = 'aq-bl-grid';

  var VISIBLE = 6; // 2 linhas de 3

  posts.forEach(function(post, idx) {
    var card = buildCard(post, false);
    if (idx >= VISIBLE) card.classList.add('aq-bl-hidden');
    grid.appendChild(card);
  });

  // Botao ver mais (so aparece se houver mais de 6)
  var moreBtn = null;
  if (posts.length > VISIBLE) {
    moreBtn = document.createElement('div');
    moreBtn.className = 'aq-bl-more';
    moreBtn.innerHTML =
      '<button class="aq-bl-more-btn" id="aq-bl-more-btn">' +
        'Ver mais artigos <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>' +
      '</button>';
  }

  gridWrap.appendChild(grid);
  if (moreBtn) gridWrap.appendChild(moreBtn);

  // Injectar no container
  containerFluid.insertBefore(gridWrap, containerFluid.firstChild);
  containerFluid.insertBefore(hero, containerFluid.firstChild);

  // Evento ver mais
  if (moreBtn) {
    moreBtn.querySelector('#aq-bl-more-btn').addEventListener('click', function() {
      Array.from(grid.querySelectorAll('.aq-bl-hidden')).forEach(function(card) {
        card.classList.remove('aq-bl-hidden');
        card.classList.add('aq-bl-revealed');
      });
      moreBtn.style.display = 'none';
    });
  }

  console.log('[AQ] Blog v9 redesign — ' + posts.length + ' posts');
}

// Secao Blog na Home
function extractPostsFromDOM() {
  var items = document.querySelectorAll('.blog-item');
  if (!items.length) return null;
  var posts = [];
  items.forEach(function(item) {
    var p = extractPost(item);
    if (p.title) posts.push(p);
  });
  return posts.length ? posts : null;
}

function buildHomeCard(post) {
  var card = document.createElement('a');
  card.href = post.href;
  card.className = 'aq-blog-card';
  card.setAttribute('aria-label', 'Ler artigo: ' + post.title);
  card.innerHTML =
    '<div class="aq-blog-card-img">' +
      (post.img
        ? '<img src="' + post.img + '" alt="' + post.title + '" loading="lazy"/>'
        : '<div class="aq-blog-card-img-placeholder"><svg viewBox="0 0 48 48" fill="none"><rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="22" r="4" stroke="currentColor" stroke-width="2"/><path d="M6 34l10-10 6 6 8-8 12 12" stroke="currentColor" stroke-width="2"/></svg></div>') +
      '<span class="aq-blog-card-tag">Aquarismo</span>' +
    '</div>' +
    '<div class="aq-blog-card-body">' +
      (post.date ? '<div class="aq-blog-card-meta"><time class="aq-blog-card-date">' + post.date + '</time></div>' : '') +
      '<h3 class="aq-blog-card-title">' + post.title + '</h3>' +
      (post.excerpt ? '<p class="aq-blog-card-excerpt">' + truncate(post.excerpt) + '</p>' : '') +
      '<span class="aq-blog-card-cta">Ler artigo <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>' +
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
      '<p class="aq-section-sub">Dicas de especialistas, guias passo a passo e novidades sobre peixes, plantas e aquascaping.</p>' +
    '</div>' +
    '<div class="aq-blog-grid" id="aq-blog-grid"></div>' +
    '<div class="aq-blog-home-cta">' +
      '<a href="' + BLOG_HREF + '" class="aq-btn-outline">Ver todos os artigos ' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
      '</a>' +
    '</div>';

  var grid = section.querySelector('#aq-blog-grid');
  var posts = extractPostsFromDOM();
  if (posts && posts.length) {
    posts.slice(0, 3).forEach(function(p) { grid.appendChild(buildHomeCard(p)); });
  } else {
    grid.innerHTML = '<div class="aq-blog-empty"><p>Em breve novos artigos sobre aquarismo!</p></div>';
  }
  return section;
}

// Post individual
function applyPostStyles() {
  var titleEl  = document.querySelector('.blog-post-title, h1.title, .post-title');
  var metaEl   = document.querySelector('.post-details');
  var imgEl    = document.querySelector('.image-post');
  var bodyEl   = document.querySelector('.post-content');
  if (!titleEl && !bodyEl) return false;

  if (titleEl) titleEl.classList.add('aq-post-title');
  if (metaEl)  metaEl.classList.add('aq-post-meta');
  if (imgEl)   imgEl.classList.add('aq-post-featured-img');
  if (bodyEl)  bodyEl.classList.add('aq-post-body');

  var readTime = estimateReadTime(bodyEl ? bodyEl.textContent : '');
  if (readTime && metaEl && !metaEl.querySelector('.aq-post-read-time')) {
    var tag = document.createElement('span');
    tag.className = 'aq-post-read-time';
    tag.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' + readTime + ' de leitura';
    metaEl.appendChild(tag);
  }

  if (!document.getElementById('aq-post-back')) {
    var btn = document.createElement('a');
    btn.id = 'aq-post-back'; btn.href = BLOG_HREF; btn.className = 'aq-post-back-btn';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Voltar ao Blog';
    var wrapper = document.querySelector('.content, .post-detail, article');
    if (wrapper) wrapper.insertBefore(btn, wrapper.firstChild);
  }
  return true;
}

function redesignBlogPost() {
  var path = window.location.pathname;
  if (!path.startsWith('/post/') && !path.startsWith('/blog/')) return;
  if (document.body.classList.contains('aq-post-styled')) return;
  document.body.classList.add('aq-post-styled', 'aq-page-post');

  if (!document.getElementById('aq-read-progress')) {
    var bar = document.createElement('div');
    bar.id = 'aq-read-progress';
    bar.innerHTML = '<div class="aq-read-progress-fill" id="aq-read-progress-fill"></div>';
    document.body.insertBefore(bar, document.body.firstChild);
  }

  if (!document.getElementById('aq-read-pct')) {
    var badge = document.createElement('div');
    badge.id = 'aq-read-pct';
    badge.innerHTML = '<span id="aq-read-pct-num">0</span><span class="aq-read-pct-label">%</span>';
    document.body.appendChild(badge);
    window.addEventListener('scroll', function() {
      var doc = document.documentElement;
      var pct = doc.scrollHeight - doc.clientHeight > 0
        ? Math.min(100, Math.round(((window.scrollY || doc.scrollTop) / (doc.scrollHeight - doc.clientHeight)) * 100))
        : 0;
      var fill = document.getElementById('aq-read-progress-fill');
      if (fill) fill.style.width = pct + '%';
      var num = document.getElementById('aq-read-pct-num');
      if (num) num.textContent = pct;
      if (pct >= 5) badge.classList.add('visible');
    }, { passive: true });
  }

  if (!applyPostStyles()) {
    var attempts = 0;
    var iv = setInterval(function() {
      attempts++;
      if (applyPostStyles() || attempts >= 20) clearInterval(iv);
    }, 300);
  }
}

export function initBlogSection() {
  var path = window.location.pathname;
  if (path === '/blog' || path === '/blog/') redesignBlogListing();
  else if (path.startsWith('/post/') || path.startsWith('/blog/')) redesignBlogPost();
}
