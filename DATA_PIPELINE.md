# Camada custom AquariumLife — dados e imagens das categorias

## Como funciona
As páginas de categoria/catálogo são montadas pelo nosso `app.js` (compilado de `src/js/`) a partir de JSON estáticos em `dist/`, servidos via jsDelivr:
- `dist/products-cat-<id>.json` — produtos de cada categoria
- `dist/products-all.json` — catálogo completo
- `dist/categories.json` — árvore do dropdown

O ShopKit (template) carrega `app.js`/`style.css` fixados num **commit** (`@<hash>`) e os JSON em `@main`.

## Correções (2026-06-24)
1. **Self-heal de imagem** em `src/js/modules/categoryFilters.js`: se um card cair em `no-img`, o código busca a imagem real ao vivo (`og:image` da página do produto → miniatura `/square/`), com cache em `sessionStorage` e fallback gracioso. Resolve imagem mesmo com JSON antigo ou foto adicionada depois.
2. **Gerador de dados** `generate-data.cjs`: regenera todos os JSON a partir da **API Shopkit** (`api.shopk.it/v1`), trazendo a imagem real (`image.square`). Fonte de verdade — produtos novos e imagens entram corretos.
3. **GitHub Action** `.github/workflows/refresh-data.yml`: roda o gerador a cada 6h (e manualmente), commita os JSON no `main` e purga o cache do jsDelivr.

## Setup único (uma vez)
No GitHub: **Settings → Secrets and variables → Actions → New repository secret**
- Nome: `SHOPKIT_API_KEY`  ·  Valor: a chave da API (a mesma do `.env.local`)

## Rodar o gerador localmente
```bash
npm run data        # lê SHOPKIT_API_KEY do .env.local e reescreve dist/*.json
git add dist/*.json && git commit -m "chore(data): refresh" && git push
```

## Deploy do app.js (quando mudar o código JS)
```bash
npm run build       # rollup -> dist/app.js
git add dist/app.js src && git commit -m "fix: ..." && git push
```
Depois, no **template do ShopKit**, atualizar o `@<hash>` da tag `<script>` do `app.js` para o novo commit (commit novo = URL nova e imutável no jsDelivr, sem precisar purgar). O `style.css` segue o mesmo padrão se mudar.

## Notas
- O jsDelivr cacheia `@main` por ~12h; a Action já purga os ficheiros alterados. Mesmo sem purga, o self-heal mantém as imagens corretas no entretanto.
- Se o `main` tiver branch protection, libere push do GitHub Actions (ou aponte a Action para um branch de dados).
