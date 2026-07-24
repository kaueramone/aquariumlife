#!/usr/bin/env node
/**
 * refresh.cjs — "Atualizar Loja" (executável do cliente)
 *
 * Corre no PC do CLIENTE (IP residencial PT, que a API Shopkit aceita — ao
 * contrário dos servidores de datacenter, que ela bloqueia). Fluxo:
 *   1) lê config.json (ao lado do .exe): chave Shopkit + token GitHub;
 *   2) gera os JSON da grelha a partir da API Shopkit (reusa generate-data.cjs);
 *   3) publica-os no repositório GitHub via Git Data API (1 commit atómico);
 *   4) purga o cache do jsDelivr → a loja reflete em ~1 min.
 *
 * Empacotado com pkg num único .exe (Node embutido; o cliente não instala nada).
 */

const fs   = require('fs');
const path = require('path');
const os   = require('os');

const GH = 'https://api.github.com';

// ---- utilitários de consola --------------------------------------------
function log(msg) { process.stdout.write(msg + '\n'); }
function erro(msg) { process.stdout.write('\n[ERRO] ' + msg + '\n'); }

// pausa no fim para a janela não fechar de repente (duplo-clique)
function pausar(cb) {
  log('\nPodes fechar esta janela. (ou carrega ENTER)');
  try {
    const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });
    rl.question('', function () { rl.close(); cb(); });
  } catch (e) { cb(); }
}
function sair(code) { pausar(function () { process.exit(code); }); }

// ---- config (ao lado do .exe) ------------------------------------------
function baseDir() {
  // no pkg, process.execPath é o .exe; senão, a pasta do script
  return process.pkg ? path.dirname(process.execPath) : __dirname;
}
function lerConfig() {
  const p = path.join(baseDir(), 'config.json');
  if (!fs.existsSync(p)) {
    erro('Falta o ficheiro config.json ao lado do programa.');
    log('Cria um config.json com: shopkitApiKey, githubToken, githubRepo, branch.');
    return null;
  }
  try {
    const c = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (!c.shopkitApiKey || !c.githubToken || !c.githubRepo) {
      erro('config.json incompleto (precisa de shopkitApiKey, githubToken, githubRepo).');
      return null;
    }
    c.branch = c.branch || 'main';
    return c;
  } catch (e) {
    erro('config.json inválido: ' + e.message);
    return null;
  }
}

// ---- GitHub Git Data API -----------------------------------------------
async function gh(cfg, method, url, body) {
  const r = await fetch(GH + '/repos/' + cfg.githubRepo + url, {
    method: method,
    headers: {
      'Authorization': 'Bearer ' + cfg.githubToken,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'AquariumLife-Refresh/1.0',
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const txt = await r.text();
  let data = null; try { data = txt ? JSON.parse(txt) : null; } catch (e) {}
  if (!r.ok) {
    const msg = (data && data.message) || txt.slice(0, 160) || ('HTTP ' + r.status);
    throw new Error('GitHub ' + method + ' ' + url + ' -> ' + r.status + ': ' + msg);
  }
  return data;
}

async function publicarNoGitHub(cfg, ficheiros) {
  const branch = cfg.branch;
  log('  a ligar ao GitHub...');
  const ref = await gh(cfg, 'GET', '/git/ref/heads/' + branch);
  const baseCommit = ref.object.sha;
  const baseCommitObj = await gh(cfg, 'GET', '/git/commits/' + baseCommit);
  const baseTree = baseCommitObj.tree.sha;

  log('  a enviar ' + ficheiros.length + ' ficheiros...');
  const tree = [];
  for (const f of ficheiros) {
    const blob = await gh(cfg, 'POST', '/git/blobs', { content: f.content, encoding: 'utf-8' });
    tree.push({ path: 'dist/' + f.name, mode: '100644', type: 'blob', sha: blob.sha });
  }

  const novaTree = await gh(cfg, 'POST', '/git/trees', { base_tree: baseTree, tree: tree });
  const commit = await gh(cfg, 'POST', '/git/commits', {
    message: 'data: atualizar loja (refresh do cliente)',
    tree: novaTree.sha,
    parents: [baseCommit]
  });
  await gh(cfg, 'PATCH', '/git/refs/heads/' + branch, { sha: commit.sha });
  return commit.sha;
}

// ---- jsDelivr purge -----------------------------------------------------
async function purgar(cfg, ficheiros) {
  for (const f of ficheiros) {
    const u = 'https://purge.jsdelivr.net/gh/' + cfg.githubRepo + '@' + cfg.branch + '/dist/' + f.name;
    try { await fetch(u); } catch (e) {}
  }
}

// ---- principal ----------------------------------------------------------
(async function () {
  log('====================================================');
  log('   AquariumLife — Atualizar Loja');
  log('====================================================\n');

  const cfg = lerConfig();
  if (!cfg) return sair(1);

  // 1) gerar os JSON a partir da API Shopkit (reusa generate-data.cjs)
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aqrefresh-'));
  process.env.SHOPKIT_API_KEY = cfg.shopkitApiKey;
  process.env.AQ_OUT_DIR = outDir;

  try {
    const gen = require('./generate-data.cjs');
    await gen.main();
  } catch (e) {
    erro('Não consegui obter os dados da Shopkit.');
    log('Detalhe: ' + (e && e.message ? e.message : e));
    log('\nVerifica a ligação à internet e a chave da Shopkit no config.json.');
    return sair(1);
  }

  // 2) recolher os ficheiros gerados
  const ficheiros = fs.readdirSync(outDir)
    .filter(function (n) { return n.endsWith('.json'); })
    .map(function (n) { return { name: n, content: fs.readFileSync(path.join(outDir, n), 'utf8') }; });
  if (!ficheiros.length) { erro('Nenhum ficheiro gerado.'); return sair(1); }

  // 3) publicar no GitHub
  let sha;
  try {
    sha = await publicarNoGitHub(cfg, ficheiros);
  } catch (e) {
    erro('Não consegui publicar no GitHub.');
    log('Detalhe: ' + (e && e.message ? e.message : e));
    log('\nVerifica o token do GitHub no config.json (precisa de permissão de escrita no repositório).');
    return sair(1);
  }

  // 4) purgar cache
  log('  a limpar a cache (jsDelivr)...');
  await purgar(cfg, ficheiros);

  log('\n====================================================');
  log('   PRONTO! A loja foi atualizada.');
  log('   Commit: ' + sha.slice(0, 7));
  log('   A grelha reflete as alterações em ~1 minuto.');
  log('====================================================');
  sair(0);
})();
