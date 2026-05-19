/**
 * blogSection.js - v10
 * Blog listing: hero injectado imediatamente, cards preenchidos com MutationObserver
 */

var BLOG_HREF = '/blog';
var VISIBLE_CARDS = 6;

function truncate(str, max) {
  if (!max) max = 130;
  if (!str || str.length <= max) return str || '';
  return str.slice(0, max).replace(/\s\S*$/, '') + '...';
}

function estimateReadTime(text) {
  if (!text) return null;
  var words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220)) + ' min';
}

// Estrutura real Shopkit Boxie confirmada ao vivo:
// img:     .blog-image img[data-src]
// titulo:  .blog-post a.link-inherit  (ou img[title])
// data:    .post-details span  (remover SVG/i)
// excerpt: .blog-excerpt
function extractPost(item) {
  var imgEl    = item.querySelector('.blog-image img');
  var linkEl   = item.querySelector('.blog-post a.link-inherit, .blog-post > a');
  var dateEl   = item.querySelector('.post-details span');
  var excerptEl = item.querySelector('.blog-excerpt');

  var img   = imgEl ? (imgEl.getAttribute('data-src') || imgEl.src || '') : '';
  var href  = linkEl ? linkEl.href : BLOG_HREF;
  var title = linkEl ? linkEl.textContent.trim() : '';
  if (!title && imgEl) title = imgEl.getAttribute('title') || imgEl.getAttribute('alt') || '';

  var date = '';
  if (dateEl) {
    var clone = dateEl.cloneNode(true);
    Array.from(clone.querySelectorAll('svg, i')).forEach(function(el) { el.remove(); });
    date = clone.textContent.trim();
  }

  var excerpt = excerptEl ? excerptEl.textContent.trim() : '';
  return { img: img, href: href, title: title, date: date, excerpt: excerpt };
}

function buildCard(post) {
  var card = document.createElement('a');
  card.href = post.href;
  card.className = 'aq-bl-card';
  card.setAttribute('aria-label', 'Ler artigo: ' + post.title);

  var rt = estimateReadTime(post.excerpt);

  card.innerHTML =
    '<div class="aq-bl-card-img">' +
      (post.img ? '<img src="' + post.img + '" alt="' + post.title.replace(/"/g,'') + '" loading="lazy"/>'
                : '<div class="aq-bl-card-img-ph"><svg viewBox="0 0 48 48" fill="none"><rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" stroke-width="2"/></svg></div>') +
      '<span class="aq-bl-card-tag">Aquarismo</span>' +
    '</div>' +
    '<div class="aq-bl-card-body">' +
      '<div class="aq-bl-card-meta">' +
        (post.date ? '<time class="aq-bl-card-date">' + post.date + '</time>' : '') +
        (rt ? '<span class="aq-bl-card-rt">' + rt + ' leitura</span>' : '') +
      '</div>' +
      '<h3 class="aq-bl-card-title">' + post.title + '</h3>' +
      (post.excerpt ? '<p class="aq-bl-card-excerpt">' + truncate(post.excerpt) + '</p>' : '') +
      '<span class="aq-bl-card-cta">Ler artigo ' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
      '</span>' +
    '</div>';
  return card;
}

function injectCards(posts) {
  var grid = document.getElementById('aq-bl-grid');
  if (!grid) return;

  // Limpar qualquer conteudo anterior
  grid.innerHTML = '';

  var wrap = grid.parentElement;

  posts.forEach(function(post, idx) {
    var card = buildCard(post);
    if (idx >= VISIBLE_CARDS) card.classList.add('aq-bl-hidden');
    grid.appendChild(card);
  });

  // Botao ver mais
  if (posts.length > VISIBLE_CARDS && wrap) {
    var existing = wrap.querySelector('.aq-bl-more');
    if (!existing) {
      var moreWrap = document.createElement('div');
      moreWrap.className = 'aq-bl-more';
      moreWrap.innerHTML =
        '<button class="aq-bl-more-btn">Ver mais artigos ' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>' +
        '</button>';
      wrap.appendChild(moreWrap);
      moreWrap.querySelector('.aq-bl-more-btn').addEventListener('click', function() {
        Array.from(grid.querySelectorAll('.aq-bl-hidden')).forEach(function(c) {
          c.classList.remove('aq-bl-hidden');
          c.classList.add('aq-bl-revealed');
        });
        moreWrap.style.display = 'none';
      });
    }
  }

  console.log('[AQ] Blog v10: ' + posts.length + ' cards injectados');
}

function waitForPostsAndFill() {
  // Tentar imediatamente
  var items = Array.from(document.querySelectorAll('.blog-item'));
  var posts = items.map(extractPost).filter(function(p) { return !!p.title; });
  if (posts.length) { injectCards(posts); return; }

  // Usar MutationObserver para detectar quando .blog-item aparece
  var observer = new MutationObserver(function() {
    var items2 = Array.from(document.querySelectorAll('.blog-item'));
    var posts2 = items2.map(extractPost).filter(function(p) { return !!p.title; });
    if (posts2.length) {
      observer.disconnect();
      injectCards(posts2);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Timeout de seguranca: 5 segundos
  setTimeout(function() {
    observer.disconnect();
    var items3 = Array.from(document.querySelectorAll('.blog-item'));
    var posts3 = items3.map(extractPost).filter(function(p) { return !!p.title; });
    if (posts3.length) injectCards(posts3);
    else console.warn('[AQ] Blog: timeout — sem .blog-item');
  }, 5000);
}

function redesignBlogListing() {
  var path = window.location.pathname;
  if (path !== '/blog' && path !== '/blog/') return;
  if (document.body.classList.contains('aq-blog-styled')) return;
  document.body.classList.add('aq-blog-styled', 'aq-page-blog');

  // Ocultar elementos nativos do Shopkit
  var blogTitle = document.querySelector('h1.blog-title, .blog-title');
  if (blogTitle) blogTitle.style.setProperty('display', 'none', 'important');

  // Container
  var containerFluid = document.querySelector('.blog-page .container-fluid, .blog-page.section .container-fluid')
    || document.querySelector('.main')
    || document.body;

  // Injectar hero imediatamente
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
      '<p class="aq-bl-hero-sub">Guias e dicas de especialistas sobre peixes, plantas, aquascaping e manutencao.</p>' +
    '</div>';

  // Injectar grid wrapper imediatamente (vazio)
  var gridWrap = document.createElement('div');
  gridWrap.className = 'aq-bl-wrap';
  var grid = document.createElement('div');
  grid.className = 'aq-bl-grid';
  grid.id = 'aq-bl-grid';
  gridWrap.appendChild(grid);

  containerFluid.insertBefore(gridWrap, containerFluid.firstChild);
  containerFluid.insertBefore(hero, containerFluid.firstChild);

  // Ocultar blog-row nativo (depois de injectar o nosso)
  var blogRow = document.querySelector('.blog-row, .blog-col');
  if (blogRow) blogRow.style.setProperty('display', 'none', 'important');

  // Aguardar posts e preencher
  waitForPostsAndFill();
}

// ── Secao Blog na Home ────────────────────────────────────────────────────────
function buildHomeCard(post) {
  var card = document.createElement('a');
  card.href = post.href;
  card.className = 'aq-blog-card';
  card.setAttribute('aria-label', 'Ler artigo: ' + post.title);
  card.innerHTML =
    '<div class="aq-blog-card-img">' +
      (post.img ? '<img src="' + post.img + '" alt="' + post.title.replace(/"/g,'') + '" loading="lazy"/>'
                : '<div class="aq-blog-card-img-placeholder"></div>') +
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

// Extrair post da home — estrutura diferente do /blog
// Na home: a.blog-item > div.blog-preview (bg-image) + h3.blog-info + div.blog-status
function extractHomePost(item) {
  // O proprio item e o <a> na home
  var href = item.href || BLOG_HREF;

  // Titulo: h3.blog-info
  var infoEl = item.querySelector('.blog-info, h3, h2');
  var title = infoEl ? infoEl.textContent.trim() : '';

  // Fallback: img title/alt
  if (!title) {
    var imgEl = item.querySelector('img');
    if (imgEl) title = imgEl.getAttribute('title') || imgEl.getAttribute('alt') || '';
  }

  // Imagem: background-image no .blog-preview
  var preview = item.querySelector('.blog-preview');
  var img = '';
  if (preview) {
    var bg = preview.style.backgroundImage || '';
    var match = bg.match(/url\(['"]?([^'"]+)['"]?\)/);
    if (match) img = match[1];
  }
  // Fallback: img src/data-src
  if (!img) {
    var imgEl2 = item.querySelector('img');
    if (imgEl2) img = imgEl2.getAttribute('data-src') || imgEl2.src || '';
  }

  // Data/categoria: div.blog-status
  var statusEl = item.querySelector('.blog-status, .blog-date, time');
  var date = statusEl ? statusEl.textContent.trim() : '';

  return { href: href, title: title, img: img, date: date, excerpt: '' };
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
  var items = Array.from(document.querySelectorAll('.blog-item'));
  // Usar extractHomePost pois na home o .blog-item e o proprio <a>
  var posts = items.map(extractHomePost).filter(function(p) { return !!p.title; });

  if (posts.length) {
    posts.slice(0, 3).forEach(function(p) { grid.appendChild(buildHomeCard(p)); });
  } else {
    grid.innerHTML = '<div class="aq-blog-empty"><p>Em breve novos artigos sobre aquarismo!</p></div>';
  }
  return section;
}

// ── Post Individual ────────────────────────────────────────────────────────────
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

  var rt = estimateReadTime(bodyEl ? bodyEl.textContent : '');
  if (rt && metaEl && !metaEl.querySelector('.aq-post-read-time')) {
    var tag = document.createElement('span');
    tag.className = 'aq-post-read-time';
    tag.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' +
      rt + ' de leitura';
    metaEl.appendChild(tag);
  }

  if (!document.getElementById('aq-post-back')) {
    var btn = document.createElement('a');
    btn.id = 'aq-post-back'; btn.href = BLOG_HREF; btn.className = 'aq-post-back-btn';
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Voltar ao Blog';
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
