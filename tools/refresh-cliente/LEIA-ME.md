# Atualizar Loja — executável para o cliente

Programa para o **cliente** correr no PC dele e atualizar a grelha da loja
(imagens, títulos, preços, stock) depois de editar produtos no painel Shopkit,
**sem depender de ninguém**.

## Porque é que isto existe

A grelha das categorias (a montada pela nossa camada) é feita a partir de um
"snapshot" (ficheiros JSON) que tem de ser regenerado. A API da Shopkit **só
aceita pedidos de IPs residenciais portugueses** e bloqueia servidores de
datacenter (por isso a automação na nuvem não funciona). O PC do cliente, em
Portugal, tem um IP aceite — por isso é ele que corre a atualização.

O programa: lê os dados da Shopkit → publica-os no GitHub → limpa a cache.
Em ~1 minuto a loja reflete as alterações.

---

## Preparação (uma vez, feita pelo Kaue)

0. **Gerar o executável** (precisa de Node.js instalado — https://nodejs.org, versão LTS):
   duplo-clique em **`GERAR-EXE.bat`**. Ao fim de 1-2 min fica criado o
   `Atualizar-Loja.exe` nesta pasta. (Faz-se só uma vez; ou sempre que o
   `generate-data.cjs` mudar.)

1. **Gerar um token do GitHub** (dá permissão para o programa publicar):
   - GitHub → *Settings* → *Developer settings* → *Personal access tokens* →
     *Fine-grained tokens* → *Generate new token*.
   - *Resource owner*: a conta dona do repositório; *Repository access*: só o
     repositório `aquariumlife`.
   - *Permissions* → *Repository permissions* → **Contents: Read and write**.
   - Gerar e copiar o token (só aparece uma vez).

2. **Preencher o `config.json`** (copiar o `config.exemplo.json` para
   `config.json` e preencher):
   - `shopkitApiKey`: a chave da API da loja (a mesma do `.env.local`).
   - `githubToken`: o token do passo 1.
   - (o `githubRepo` e `branch` já vêm certos.)

3. **Enviar ao cliente** a pasta com **dois ficheiros**: o
   `Atualizar-Loja.exe` e o `config.json` preenchido. O cliente deixa a pasta
   no ambiente de trabalho.

> Segurança: o token dá escrita **apenas** neste repositório e pode ser
> revogado/rotacionado a qualquer momento no GitHub. Não publiques o
> `config.json` em sítios públicos.

---

## Uso (pelo cliente)

1. Duplo-clique em **`Atualizar-Loja.exe`**.
2. Abre uma janela preta e mostra o progresso.
3. Quando aparecer **"PRONTO! A loja foi atualizada."**, pode fechar.
4. Ao fim de ~1 minuto, a loja mostra as alterações (fazer *refresh* à página).

Se aparecer um erro, o programa diz o que verificar (internet, chave ou token).

---

## Como é feito (nota técnica)

- `refresh.cjs` reutiliza o `generate-data.cjs` do repositório para gerar os
  JSON a partir da API Shopkit, e publica-os via **GitHub Git Data API**
  (1 commit atómico), depois faz *purge* ao jsDelivr.
- Empacotado num único `.exe` com [`@yao-pkg/pkg`](https://github.com/yao-pkg/pkg)
  (Node embutido — o cliente não instala nada).
- Reconstruir o executável: `pkg refresh.cjs --targets node18-win-x64 --output Atualizar-Loja.exe`
  (com o `generate-data.cjs` na mesma pasta).
