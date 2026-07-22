# Upscale de imagens — Real-ESRGAN

Camada B do `PLANO_QUALIDADE_IMAGENS.md` — só para imagens sem fonte oficial melhor.

## Modo padrão: GitHub Actions (nada para instalar)

Tudo roda na nuvem do GitHub, dentro do repositório:

1. **Uma vez só:** adicionar o secret `SHOPKIT_API_KEY` no GitHub
   (repositório → Settings → Secrets and variables → Actions → New repository secret
   — o valor é o mesmo do `.env.local`). *Este secret também destrava o refresh
   automático dos JSONs de 6 em 6 horas (`refresh-data.yml`).*
2. GitHub → aba **Actions** → workflow **"Upscale de imagens (Real-ESRGAN)"** → **Run workflow**:
   - campo `ids`: os produtos a ampliar (ex.: `5444865,5444866,5444891`), ou
   - vazio: modo automático (qualquer imagem do catálogo com lado menor < 300 px).
3. A Action busca as imagens na API, amplia 4× e **commita sozinha** em `dist/img-hd/`
   (já publicado via jsDelivr, com purge).
4. Avise o Fable: ele valida cada resultado (texto de rótulo derretido = rejeitado)
   e aplica nos produtos via API.

## Modo alternativo: local no Windows (offline/fallback)

1. Baixar https://github.com/xinntao/Real-ESRGAN/releases (`realesrgan-ncnn-vulkan-*-windows.zip`)
   e extrair o `.exe` para esta pasta;
2. Colocar as imagens em `entrada\`;
3. Dois cliques em `upscale.bat` → resultados em `..\..\dist\img-hd\`;
4. `publicar_dados.bat` na raiz → avisar o Fable.

## Notas

- Modelo `realesrgan-x4plus` (300×300 → 1200×1200). CPU da Action = mesma qualidade da GPU, só mais lenta;
- Substituir por packshot oficial é sempre superior a ampliar — o upscale é o último recurso;
- Nunca aplicar sem a validação visual do Fable.
