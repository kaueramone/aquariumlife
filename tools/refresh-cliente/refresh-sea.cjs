#!/usr/bin/env node
/**
 * refresh-sea.cjs — "Atualizar Loja" (versão para EXECUTÁVEL ÚNICO / Node SEA).
 *
 * Igual ao refresh.cjs, mas com a configuração EMBUTIDA (a chave Shopkit e o
 * token GitHub são injetados no build, nos placeholders abaixo) — o cliente
 * não mexe em nenhum ficheiro: recebe UM .exe e clica.
 *
 * Empacotado com Node SEA (Single Executable Application): o generate-data.cjs
 * é bundled junto (esbuild) e o blob é injetado no node.exe (postject).
 */

const fs   = require('fs');
const path = require('path');
const os   = require('os');

// ---- CONFIG EMBUTIDA (injetada no build; NÃO editar à mão) --------------
const CONFIG = {
  shopkitApiKey: '__SHOPKIT_API_KEY__',
  githubToken:   '__GITHUB_TOKEN__',
  githubRepo:    '__GITHUB_REPO__',
  branch:        '__BRANCH__'
};

const GH = 'https://api.github.com';
function log(m){ process.stdout.write(m + '\n'); }
function erro(m){ process.stdout.write('\n[ERRO] ' + m + '\n'); }
function pausar(cb){
  log('\nPodes fechar esta janela. (ou carrega ENTER)');
  try { const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });
    rl.question('', function(){ rl.close(); cb(); }); } catch(e){ cb(); }
}
function sair(c){ pausar(function(){ process.exit(c); }); }

async function gh(method, url, body){
  const r = await fetch(GH + '/repos/' + CONFIG.githubRepo + url, {
    method: method,
    headers: {
      'Authorization': 'Bearer ' + CONFIG.githubToken,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'AquariumLife-Refresh/1.0',
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const txt = await r.text(); let data = null; try { data = txt ? JSON.parse(txt) : null; } catch(e){}
  if (!r.ok) throw new Error('GitHub ' + method + ' ' + url + ' -> ' + r.status + ': ' + ((data && data.message) || txt.slice(0,140)));
  return data;
}

async function publicar(ficheiros){
  log('  a ligar ao GitHub...');
  const ref = await gh('GET', '/git/ref/heads/' + CONFIG.branch);
  const baseCommit = ref.object.sha;
  const baseTree = (await gh('GET', '/git/commits/' + baseCommit)).tree.sha;
  log('  a enviar ' + ficheiros.length + ' ficheiros...');
  const tree = [];
  for (const f of ficheiros){
    const blob = await gh('POST', '/git/blobs', { content: f.content, encoding: 'utf-8' });
    tree.push({ path: 'dist/' + f.name, mode: '100644', type: 'blob', sha: blob.sha });
  }
  const novaTree = await gh('POST', '/git/trees', { base_tree: baseTree, tree: tree });
  const commit = await gh('POST', '/git/commits', { message: 'data: atualizar loja (refresh do cliente)', tree: novaTree.sha, parents: [baseCommit] });
  await gh('PATCH', '/git/refs/heads/' + CONFIG.branch, { sha: commit.sha });
  return commit.sha;
}

async function purgar(ficheiros){
  for (const f of ficheiros){
    try { await fetch('https://purge.jsdelivr.net/gh/' + CONFIG.githubRepo + '@' + CONFIG.branch + '/dist/' + f.name); } catch(e){}
  }
}

(async function(){
  log('====================================================');
  log('   AquariumLife — Atualizar Loja');
  log('====================================================\n');

  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aqrefresh-'));
  process.env.SHOPKIT_API_KEY = CONFIG.shopkitApiKey;
  process.env.AQ_OUT_DIR = outDir;

  try {
    const gen = require('./generate-data.cjs');
    await gen.main();
  } catch(e){
    erro('Não consegui obter os dados da Shopkit.'); log('Detalhe: ' + (e && e.message ? e.message : e));
    log('\nVerifica a ligação à internet.'); return sair(1);
  }

  const ficheiros = fs.readdirSync(outDir).filter(n => n.endsWith('.json'))
    .map(n => ({ name: n, content: fs.readFileSync(path.join(outDir, n), 'utf8') }));
  if (!ficheiros.length){ erro('Nenhum ficheiro gerado.'); return sair(1); }

  let sha;
  try { sha = await publicar(ficheiros); }
  catch(e){ erro('Não consegui publicar no GitHub.'); log('Detalhe: ' + (e && e.message ? e.message : e)); return sair(1); }

  log('  a limpar a cache (jsDelivr)...');
  await purgar(ficheiros);

  log('\n====================================================');
  log('   PRONTO! A loja foi atualizada.');
  log('   Commit: ' + sha.slice(0, 7));
  log('   A grelha reflete as alterações em ~1 minuto.');
  log('====================================================');
  sair(0);
})();
