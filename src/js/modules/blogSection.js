/**
 * blogSection.js – v1
 * Três responsabilidades:
 *  1. Home: injeta seção "Do Nosso Blog" com os últimos posts (via API Shopkit)
 *  2. Página /blog: redesenha a listagem de posts
 *  3. Página de post: redesenha o layout do artigo
 *
 * O Shopkit expõe a API pública em /api/json/blog/posts
 */

const BLOG_API  = '/api/json/blog/posts?limit=3&page=1';
const BLOG_HREF = '/blog';

// ─── Utilitários ─────────────────────────────────────────────────────────────

function isPage(path) {
  return window.location.pathname.startsWith(path);
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch { return dateStr; }
}

function truncate(str, max = 120) {
  if (!str || str.length <= max) return str || '';
  return str.slice(0, max).replace(/\s\S*$/, '') + '…';
}

// ─── 1. Seção "Do Nosso Blog" na Home ────────────────────────────────────────

function buildPostCard(post) {
  const card = document.createElement('a');
  card.href = post.url || `${BLOG_HREF}/${post.handle}`;
  card.className = 'aq-blog-card';
  card.setAttribute('aria-label', `Ler artigo: ${post.title}`);

  const thumb = post.image?.url || '';

  card.innerHTML = `
    <div class="aq-blog-card-img">
      ${thumb
        ? `<img src="${thumb}" alt="${post.title}" loading="lazy"/>`
        : `<div class="aq-blog-card-img-placeholder">
             <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M6 38V14a2 2 0 012-2h32a2 2 0 012 2v24" stroke="currentColor" stroke-width="2"/>
               <circle cx="18" cy="22" r="4" stroke="currentColor" stroke-width="2"/>
               <path d="M6 38l10-10 6 6 8-8 12 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
             </svg>
           </div>`}
      <span class="aq-blog-card-tag">Aquarismo</span>
    </div>
    <div class="aq-blog-card-body">
      <time class="aq-blog-card-date">${formatDate(post.created_at)}</time>
      <h3 class="aq-blog-card-title">${post.title}</h3>
      <p class="aq-blog-card-excerpt">${truncate(post.excerpt || post.body_plain)}</p>
      <span class="aq-blog-card-cta">Ler artigo <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
    </div>
  `;
  return card;
}

async function fetchPosts() {
  try {
    const res = await fetch(BLOG_API);
    if (!res.ok) return null;
    const data = await res.json();
    // Shopkit retorna { posts: [...] } ou diretamente array
    return Array.isArray(data) ? data : (data.posts || data.data || null);
  } catch { return null; }
}

function buildBlogHomeSection(posts) {
  const section = document.createElement('section');
  section.id = 'aq-blog-home';

  const header = document.createElement('div');
  header.className = 'aq-section-header';
  header.innerHTML = `
    <span class="aq-section-tag">Conteúdo</span>
    <h2 class="aq-section-title">Do Nosso <span class="aq-neon">Blog</span></h2>
    <p class="aq-section-sub">Dicas, guias e novidades do mundo do aquarismo</p>
  `;
  section.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'aq-blog-grid';

  if (posts && posts.length) {
    posts.slice(0, 3).forEach(p => grid.appendChild(buildPostCard(p)));
  } else {
    // Fallback estático se API não responder
    grid.innerHTML = `<p class="aq-blog-empty">Em breve novos artigos sobre aquarismo!</p>`;
  }

  section.appendChild(grid);

  const cta = document.createElement('div');
  cta.className = 'aq-blog-home-cta';
  cta.innerHTML = `<a href="${BLOG_HREF}" class="aq-btn-outline">Ver todos os artigos <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>`;
  section.appendChild(cta);

  return section;
}

async function initBlogHome() {
  if (document.getElementById('aq-blog-home')) return true;

  const faq    = document.getElementById('aq-faq');
  const store  = document.getElementById('aq-store');
  const footer = document.querySelector('footer, #footer, .footer');
  // Inserir antes do FAQ se existir, senão antes da loja, senão antes do footer
  const anchor = faq || store || footer;
  if (!anchor) return false;

  const posts = await fetchPosts();
  const section = buildBlogHomeSection(posts);
  anchor.parentNode.insertBefore(section, anchor);
  console.log('[AQ] Blog home section injetada');
  return true;
}

// ─── 2. Redesign da listagem /blog ───────────────────────────────────────────

function redesignBlogListing() {
  // Verificar se é página de blog
  if (!isPage('/blog')) return;
  if (document.body.classList.contains('aq-blog-styled')) return;
  document.body.classList.add('aq-blog-styled');

  // Adicionar classe ao body para ativar os estilos SCSS
  document.body.classList.add('aq-page-blog');

  // Injetar cabeçalho premium da página
  const pageTitle = document.querySelector('.page-title, .blog-title, h1.title, .section-title');
  if (pageTitle) {
    const wrap = document.createElement('div');
    wrap.className = 'aq-blog-page-header';
    wrap.innerHTML = `
      <span class="aq-section-tag">Blog</span>
      <h1 class="aq-section-title">Mundo do <span class="aq-neon">Aquarismo</span></h1>
      <p class="aq-section-sub">Dicas de especialistas, guias passo-a-passo e novidades do mundo aquático</p>
    `;
    pageTitle.closest('section, .container, .row')?.parentNode?.insertBefore(wrap, pageTitle.closest('section, .container, .row'));
    pageTitle.style.setProperty('display', 'none', 'important');
  }

  // Estilizar os cards nativos do Shopkit/Boxie
  // Classes nativas: .post, .post-item, .blog-post, .card
  setTimeout(() => {
    document.querySelectorAll('.post, .blog-item, [class*="post-item"]').forEach(card => {
      card.classList.add('aq-blog-native-card');
    });
  }, 500);

  console.log('[AQ] Blog listing redesigned');
}

// ─── 3. Redesign de post individual ──────────────────────────────────────────

function redesignBlogPost() {
  if (!isPage('/blog/') || window.location.pathname === '/blog/') return;
  if (document.body.classList.contains('aq-post-styled')) return;
  document.body.classList.add('aq-post-styled', 'aq-page-post');

  // Cabeçalho do post
  const postTitle = document.querySelector('.post-title, .article-title, h1.title, .blog-post-title');
  if (postTitle) {
    postTitle.classList.add('aq-post-title');
  }

  // Meta (data, autor)
  document.querySelectorAll('.post-date, .post-meta, .article-meta, .blog-meta').forEach(el => {
    el.classList.add('aq-post-meta');
  });

  // Imagem de destaque
  document.querySelectorAll('.post-image, .post-thumbnail, .article-image, .blog-post-image').forEach(el => {
    el.classList.add('aq-post-featured-img');
  });

  // Corpo do artigo
  document.querySelectorAll('.post-body, .post-content, .article-body, .blog-post-body').forEach(el => {
    el.classList.add('aq-post-body');
  });

  // Botão voltar ao blog
  const backBtn = document.querySelector('a[href="/blog"], a[href*="blog"]');
  if (backBtn && !document.getElementById('aq-post-back')) {
    const btn = document.createElement('a');
    btn.id = 'aq-post-back';
    btn.href = BLOG_HREF;
    btn.className = 'aq-post-back-btn';
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Voltar ao Blog`;
    backBtn.closest('section, .container, article')?.prepend(btn);
  }

  console.log('[AQ] Blog post redesigned');
}

// ─── Init ─────────────────────────────────────────────────────────────────────

export function initBlogSection() {
  const path = window.location.pathname;

  if (path === '/' || path === '/index' || path === '') {
    // Home: tentar logo e retry se o DOM ainda não estiver pronto
    const tryHome = async () => {
      const footer = document.querySelector('footer, #footer, .footer');
      if (footer) { await initBlogHome(); return; }
      setTimeout(tryHome, 400);
    };
    tryHome();
  }

  if (path.startsWith('/blog')) {
    if (path === '/blog' || path === '/blog/') {
      redesignBlogListing();
    } else {
      redesignBlogPost();
    }
  }
}
