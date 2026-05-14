/**
 * homeOrchestrator.js – v4
 * Debug panel + inserção ultra-defensiva
 */

import { buildBrandsSection }  from './brandsSection.js';
import { buildStoreSection }   from './storeSection.js';
import { buildFAQSection }     from './faqSection.js';
import { buildBlogSection }    from './blogSection.js';

// ── Debug Panel ───────────────────────────────────────────────────────────────
let debugPanel = null;
let debugLines = [];

function createDebugPanel() {
  const panel = document.createElement('div');
  panel.id = 'aq-debug';
  panel.style.cssText = `
    position: fixed; bottom: 12px; right: 12px; z-index: 99999;
    background: rgba(0,4,13,0.95); border: 1px solid #08EEBC;
    border-radius: 10px; padding: 12px 16px; min-width: 320px; max-width: 420px;
    font: 11px/1.5 monospace; color: #08EEBC;
    box-shadow: 0 0 20px rgba(8,238,188,0.2);
    max-height: 300px; overflow-y: auto;
  `;
  panel.innerHTML = `<div style="font-size:12px;font-weight:700;margin-bottom:8px;letter-spacing:1px;">
    🐟 AQ Debug — Home Orchestrator
    <span id="aq-debug-close" style="float:right;cursor:pointer;opacity:.6;">✕</span>
  </div><div id="aq-debug-log"></div>`;
  document.body.appendChild(panel);
  panel.querySelector('#aq-debug-close').addEventListener('click', () => panel.remove());
  debugPanel = panel.querySelector('#aq-debug-log');
  return panel;
}

function log(msg, type = 'info') {
  const colors = { info: '#08EEBC', warn: '#FFD700', error: '#FF4C4C', ok: '#00FF88' };
  const icons  = { info: '·', warn: '⚠', error: '✗', ok: '✓' };
  const line = `${icons[type]} ${msg}`;
  console.log(`[AQ Orch] ${line}`);
  debugLines.push({ line, color: colors[type] });
  if (debugPanel) {
    const d = document.createElement('div');
    d.style.color = colors[type];
    d.textContent = line;
    debugPanel.appendChild(d);
    debugPanel.scrollTop = debugPanel.scrollHeight;
  }
}

// ── Footer detection ──────────────────────────────────────────────────────────
function waitForFooter(maxMs = 8000) {
  return new Promise((resolve) => {
    const SELS = ['footer', '#footer', '.footer', '[id*="footer"]'];
    const find = () => {
      for (const s of SELS) {
        const el = document.querySelector(s);
        if (el) return el;
      }
      return null;
    };
    const el = find();
    if (el) { resolve(el); return; }
    const start = Date.now();
    const iv = setInterval(() => {
      const f = find();
      if (f) { clearInterval(iv); resolve(f); return; }
      if (Date.now() - start > maxMs) { clearInterval(iv); resolve(null); }
    }, 150);
  });
}

// ── Inserção ultra-defensiva ──────────────────────────────────────────────────
function safeInsert(section, id, footer) {
  if (!section) { log(`${id} — buildSection retornou null`, 'warn'); return; }
  if (document.getElementById(id)) { log(`${id} já existe, skip`, 'warn'); return; }

  // Tentativa 1: footer.before()
  if (footer && footer.isConnected) {
    try {
      footer.before(section);
      log(`${id} inserido via footer.before()`, 'ok');
      return;
    } catch (e) {
      log(`footer.before() falhou: ${e.message}`, 'warn');
    }
  }

  // Tentativa 2: parentNode.insertBefore com re-query do footer
  const freshFooter = document.querySelector('footer, #footer, .footer');
  if (freshFooter && freshFooter.parentNode) {
    try {
      freshFooter.parentNode.insertBefore(section, freshFooter);
      log(`${id} inserido via insertBefore (fresh footer)`, 'ok');
      return;
    } catch (e) {
      log(`insertBefore falhou: ${e.message}`, 'warn');
    }
  }

  // Tentativa 3: append ao main ou body
  const main = document.querySelector('main, #main, .main, [role="main"]') || document.body;
  main.appendChild(section);
  log(`${id} inserido via appendChild em ${main.tagName}`, 'warn');
}

// ── Orquestrador principal ────────────────────────────────────────────────────
export async function initHome() {
  createDebugPanel();
  log('initHome() iniciado');

  const footer = await waitForFooter();
  if (footer) {
    log(`footer encontrado: ${footer.tagName}#${footer.id}.${[...footer.classList].join('.')}`, 'info');
    log(`footer.isConnected: ${footer.isConnected}`, 'info');
    log(`footer.parentNode: ${footer.parentNode?.tagName}`, 'info');
  } else {
    log('footer NÃO encontrado — usando body', 'warn');
  }

  // 1. Marcas
  try {
    log('a construir brands...');
    const brands = await buildBrandsSection();
    safeInsert(brands, 'aq-brands', footer);
  } catch (e) { log(`brands ERRO: ${e.message}`, 'error'); }

  // Re-query footer antes de cada inserção (pode ter mudado)
  const f2 = document.querySelector('footer, #footer, .footer') || footer;

  // 2. Loja
  try {
    log('a construir store...');
    const store = buildStoreSection();
    safeInsert(store, 'aq-store', f2);
  } catch (e) { log(`store ERRO: ${e.message}`, 'error'); }

  const f3 = document.querySelector('footer, #footer, .footer') || footer;

  // 3. FAQ
  try {
    log('a construir faq...');
    const faq = buildFAQSection();
    safeInsert(faq, 'aq-faq', f3);
  } catch (e) { log(`faq ERRO: ${e.message}`, 'error'); }

  const f4 = document.querySelector('footer, #footer, .footer') || footer;

  // 4. Blog
  try {
    log('a construir blog...');
    const blog = await buildBlogSection();
    safeInsert(blog, 'aq-blog-home', f4);
  } catch (e) { log(`blog ERRO: ${e.message}`, 'error'); }

  log('orquestração completa ✓', 'ok');
}
