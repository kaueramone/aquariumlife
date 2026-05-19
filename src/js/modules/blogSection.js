/**
 * blogSection.js - v8
 * Classes reais do Shopkit Boxie confirmadas via inspecao DOM ao vivo:
 *   titulo:  .blog-post-title  (h1)
 *   meta:    .post-details      (div)
 *   imagem:  .image-post        (div > img.img-responsive)
 *   body:    .post-content      (div)
 *   wrapper: .content           (div dentro de .col)
 * /blog nao existe como pagina no Shopkit — removido redesignBlogListing
 */

const BLOG_HREF = '/blog';

function truncate(str, max) {
  if (max === undefined) max = 120;
  if (!str || str.length <= max) return str || '';
  return str.slice(0, max).replace(/\s\S*$/, '') + '...';
}

function estimateReadTime(text) {
  if (!text) return null;
  var words = text.trim().split(/\s+/).length;
  var mins = Math.max(1, Math.round(words / 220));
  return mins + ' min de leitura';
}

// Extrai posts do DOM nativo do Shopkit (home)
function extractPostsFromDOM() {
  var items = document.querySelectorAll('.blog-item');
  if (!items.length) return null;
  var posts = [];
  items.forEach(function(item) {
    var titleEl = item.querySelector('.blog-info, h3, h2');
    var title = titleEl ? titleEl.textContent.trim() : '';
    if (!title) return;
    var linkEl = item.closest('a') || item.querySelector('a') ||
                 (item.parentElement && item.parentElement.closest('a'));
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
    posts.push({ title: title, href: href, img: img, date: date, excerpt: excerpt });
  });
  return posts.length ? posts : null;
}

// Card para a home
function buildPostCard(post) {
  var card = document.createElement('a');
  card.href = post.href;
  card.className = 'aq-blog-card';
  card.setAttribute('aria-label', 'Ler artigo: ' + post.title);
  card.innerHTML =
    '<div class="aq-blog-card-img">' +
      (post.img
        ? '<img src="' + post.img + '" alt="' + post.title + '" loading="lazy"/>'
        : '<div class="aq-blog-card-img-placeholder">' +
            '<svg viewBox="0 0 48 48" fill="none"><rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" stroke-width="2"/>' +
            '<circle cx="18" cy="22" r="4" stroke="currentColor" stroke-width="2"/>' +
            '<path d="M6 34l10-10 6 6 8-8 12 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>' +
          '</div>') +
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

// Secao Blog na Home
export async function buildBlogSection() {
  if (document.getElementById('aq-blog-home')) return null;
  var section = document.createElement('section');
  section.id = 'aq-blog-home';
  section.innerHTML =
    '<div class="aq-section-header">' +
      '<span class="aq-section-tag">Do nosso blogue</span>' +
      '<h2 class="aq-section-title">Mergulha no Mundo do <span class="aq-neon">Aquarismo</span></h2>' +
      '<p class="aq-section-sub">Dicas de especialistas, guias passo a passo, novidades do hobby e tudo sobre peixes, plantas e aquascaping.</p>' +
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
    posts.slice(0, 3).forEach(function(p) { grid.appendChild(buildPostCard(p)); });
  } else {
    grid.innerHTML = '<div class="aq-blog-empty"><p>Em breve novos artigos sobre aquarismo!</p></div>';
  }
  return section;
}

// ── Post Individual ────────────────────────────────────────────────────────────
// Selectores confirmados via DOM ao vivo no Shopkit Boxie
function applyPostStyles() {
  // Titulo: h1.blog-post-title (ja tem a classe, mas garantimos)
  var titleEl = document.querySelector('.blog-post-title, h1.title, .post-title');
  // Meta/data: .post-details (div com data e categoria)
  var metaEl  = document.querySelector('.post-details');
  // Imagem: .image-post (div que contem a img)
  var imgEl   = document.querySelector('.image-post');
  // Body: .post-content (div com o corpo do artigo)
  var bodyEl  = document.querySelector('.post-content');

  // Sem titulo E sem body = DOM ainda nao pronto
  if (!titleEl && !bodyEl) return false;

  if (titleEl) titleEl.classList.add('aq-post-title');
  if (metaEl)  metaEl.classList.add('aq-post-meta');
  if (imgEl)   imgEl.classList.add('aq-post-featured-img');
  if (bodyEl)  bodyEl.classList.add('aq-post-body');

  // Tempo de leitura
  var readTime = estimateReadTime(bodyEl ? bodyEl.textContent : '');
  if (readTime && metaEl && !metaEl.querySelector('.aq-post-read-time')) {
    var timeTag = document.createElement('span');
    timeTag.className = 'aq-post-read-time';
    timeTag.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>' +
      '</svg>' + readTime;
    metaEl.appendChild(timeTag);
  }

  // Botao voltar: inserir no inicio do .content (wrapper real do Shopkit)
  if (!document.getElementById('aq-post-back')) {
    var btn = document.createElement('a');
    btn.id = 'aq-post-back';
    btn.href = BLOG_HREF;
    btn.className = 'aq-post-back-btn';
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M19 12H5M12 5l-7 7 7 7"/>' +
      '</svg> Voltar ao Blog';
    // .content e o wrapper real do Shopkit Boxie para post
    var wrapper = document.querySelector('.content, .post-detail, .blog-post .col, article');
    if (wrapper) wrapper.insertBefore(btn, wrapper.firstChild);
  }

  console.log('[AQ] v8 Post styled OK');
  return true;
}

function redesignBlogPost() {
  var path = window.location.pathname;
  if (!path.startsWith('/post/') && !path.startsWith('/blog/')) return;
  if (document.body.classList.contains('aq-post-styled')) return;
  document.body.classList.add('aq-post-styled', 'aq-page-post');

  // Barra de progresso sticky no topo
  if (!document.getElementById('aq-read-progress')) {
    var bar = document.createElement('div');
    bar.id = 'aq-read-progress';
    bar.innerHTML = '<div class="aq-read-progress-fill" id="aq-read-progress-fill"></div>';
    document.body.insertBefore(bar, document.body.firstChild);
  }

  // Badge flutuante de % de conclusao
  if (!document.getElementById('aq-read-pct')) {
    var badge = document.createElement('div');
    badge.id = 'aq-read-pct';
    badge.innerHTML = '<span id="aq-read-pct-num">0</span><span class="aq-read-pct-label">%</span>';
    document.body.appendChild(badge);

    window.addEventListener('scroll', function() {
      var doc = document.documentElement;
      var scrollTop = window.scrollY || doc.scrollTop;
      var scrollHeight = doc.scrollHeight - doc.clientHeight;
      var pct = scrollHeight > 0 ? Math.min(100, Math.round((scrollTop / scrollHeight) * 100)) : 0;
      var fill = document.getElementById('aq-read-progress-fill');
      if (fill) fill.style.width = pct + '%';
      var num = document.getElementById('aq-read-pct-num');
      if (num) num.textContent = pct;
      if (pct >= 5) badge.classList.add('visible');
    }, { passive: true });
  }

  // Aplicar estilos — com retry ate 20x cada 300ms
  if (!applyPostStyles()) {
    var attempts = 0;
    var interval = setInterval(function() {
      attempts++;
      if (applyPostStyles() || attempts >= 20) clearInterval(interval);
    }, 300);
  }
}

export function initBlogSection() {
  var path = window.location.pathname;
  if (path.startsWith('/post/') || path.startsWith('/blog/')) {
    redesignBlogPost();
  }
}
