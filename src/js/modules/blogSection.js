/**
 * blogSection.js – v4
 * Cards premium com imagem destacada, leitura estimada e design melhorado.
 */

const BLOG_API  = '/api/json/blog/posts?limit=3&page=1';
const BLOG_HREF = '/blog';

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return dateStr; }
}

function truncate(str, max = 120) {
  if (!str || str.length <= max) return str || '';
  return str.slice(0, max).replace(/\s\S*$/, '') + '…';
}

function readingTime(text) {
  if (!text) return '1 min';
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min de leitura`;
}

function buildPostCard(post) {
  const card = document.createElement('a');
  card.href = post.url || `${BLOG_HREF}/${post.handle}`;
  card.className = 'aq-blog-card';
  card.setAttribute('aria-label', `Ler artigo: ${post.title}`);

  const thumb = post.image?.url || post.featured_image || post.image_url || '';
  const excerpt = post.excerpt || post.body_plain || post.summary || '';
  const date = formatDate(post.created_at || post.published_at);
  const time = readingTime(excerpt);

  card.innerHTML = `
    <div class="aq-blog-card-img">
      ${thumb
        ? `<img src="${thumb}" alt="${post.title}" loading="lazy"/>`
        : `<div class="aq-blog-card-img-placeholder">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" stroke-width="2"/>
              <circle cx="18" cy="22" r="4" stroke="currentColor" stroke-width="2"/>
              <path d="M6 34l10-10 6 6 8-8 12 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
           </div>`}
      <span class="aq-blog-card-tag">Aquarismo</span>
    </div>
    <div class="aq-blog-card-body">
      <div class="aq-blog-card-meta">
        <time class="aq-blog-card-date">${date}</time>
        <span class="aq-blog-card-read">${time}</span>
      </div>
      <h3 class="aq-blog-card-title">${post.title}</h3>
      <p class="aq-blog-card-excerpt">${truncate(excerpt)}</p>
      <span class="aq-blog-card-cta">
        Ler artigo
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </span>
    </div>
  `;
  return card;
}

function buildSkeletonCard() {
  const card = document.createElement('div');
  card.className = 'aq-blog-card aq-blog-skeleton';
  card.innerHTML = `
    <div class="aq-blog-card-img aq-skel-img"></div>
    <div class="aq-blog-card-body">
      <div class="aq-skel-line aq-skel-short"></div>
      <div class="aq-skel-line aq-skel-full"></div>
      <div class="aq-skel-line aq-skel-medium"></div>
    </div>
  `;
  return card;
}

async function fetchPosts() {
  try {
    const res = await fetch(BLOG_API);
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : (data.posts || data.data || null);
  } catch { return null; }
}

export async function buildBlogSection() {
  if (document.getElementById('aq-blog-home')) return null;

  const section = document.createElement('section');
  section.id = 'aq-blog-home';
  section.innerHTML = `
    <div class="aq-section-header">
      <span class="aq-section-tag">Do nosso blogue</span>
      <h2 class="aq-section-title">Mergulha no Mundo do <span class="aq-neon">Aquarismo</span></h2>
      <p class="aq-section-sub">Dicas de especialistas, guias passo a passo, novidades do hobby e tudo sobre peixes, plantas e aquascaping — escrito por quem vive o aquarismo todos os dias.</p>
    </div>
    <div class="aq-blog-grid" id="aq-blog-grid"></div>
    <div class="aq-blog-home-cta">
      <a href="${BLOG_HREF}" class="aq-btn-outline">
        Ver todos os artigos
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  `;

  const grid = section.querySelector('#aq-blog-grid');
  for (let i = 0; i < 3; i++) grid.appendChild(buildSkeletonCard());

  fetchPosts().then(posts => {
    grid.innerHTML = '';
    if (posts && posts.length) {
      posts.slice(0, 3).forEach(p => grid.appendChild(buildPostCard(p)));
    } else {
      grid.innerHTML = `<div class="aq-blog-empty"><p>Em breve novos artigos sobre aquarismo!</p></div>`;
    }
    console.log('[AQ] Blog posts carregados:', posts?.length || 0);
  });

  return section;
}

// ── Redesign /blog e post individual ─────────────────────────────────────────

function redesignBlogListing() {
  const path = window.location.pathname;
  if (path !== '/blog' && path !== '/blog/') return;
  if (document.body.classList.contains('aq-blog-styled')) return;
  document.body.classList.add('aq-blog-styled', 'aq-page-blog');

  const pageTitle = document.querySelector('.page-title, .blog-title, h1.title, .section-title');
  if (pageTitle) {
    const wrap = document.createElement('div');
    wrap.className = 'aq-blog-page-header';
    wrap.innerHTML = `
      <span class="aq-section-tag">Blog</span>
      <h1 class="aq-section-title">Mundo do <span class="aq-neon">Aquarismo</span></h1>
      <p class="aq-section-sub">Dicas de especialistas, guias passo-a-passo e novidades do mundo aquático</p>
    `;
    const container = pageTitle.closest('section, .container, .row');
    container?.parentNode?.insertBefore(wrap, container);
    pageTitle.style.setProperty('display', 'none', 'important');
  }

  setTimeout(() => {
    document.querySelectorAll('.post, .blog-item, [class*="post-item"]').forEach(card => {
      card.classList.add('aq-blog-native-card');
    });
  }, 500);
}

function redesignBlogPost() {
  const path = window.location.pathname;
  if (!path.startsWith('/blog/') || path === '/blog/') return;
  if (document.body.classList.contains('aq-post-styled')) return;
  document.body.classList.add('aq-post-styled', 'aq-page-post');

  document.querySelector('.post-title, .article-title, h1.title, .blog-post-title')?.classList.add('aq-post-title');
  document.querySelectorAll('.post-date, .post-meta, .article-meta').forEach(el => el.classList.add('aq-post-meta'));
  document.querySelectorAll('.post-image, .post-thumbnail, .article-image').forEach(el => el.classList.add('aq-post-featured-img'));
  document.querySelectorAll('.post-body, .post-content, .article-body').forEach(el => el.classList.add('aq-post-body'));

  if (!document.getElementById('aq-post-back')) {
    const btn = document.createElement('a');
    btn.id = 'aq-post-back'; btn.href = BLOG_HREF; btn.className = 'aq-post-back-btn';
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Voltar ao Blog`;
    document.querySelector('article, .post-wrapper, main > .container')?.prepend(btn);
  }
}

export function initBlogSection() {
  const path = window.location.pathname;
  if (path === '/blog' || path === '/blog/') redesignBlogListing();
  else if (path.startsWith('/blog/')) redesignBlogPost();
}
