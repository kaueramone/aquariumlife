# Upscale de imagens com Real-ESRGAN (Windows)

Ferramenta para a **Camada B** do PLANO_QUALIDADE_IMAGENS.md — só para imagens sem fonte oficial melhor.

## Instalação (uma vez)

1. Descarregue o executável Windows: https://github.com/xinntao/Real-ESRGAN/releases (ficheiro `realesrgan-ncnn-vulkan-*-windows.zip`);
2. Extraia o conteúdo para esta pasta (`tools\upscale\`) — deve ficar `realesrgan-ncnn-vulkan.exe` ao lado deste ficheiro;
3. Funciona em qualquer placa gráfica razoável (NVIDIA/AMD/Intel, via Vulkan). Sem GPU dedicada também corre, só mais lento.

## Uso

1. Coloque as imagens pequenas na pasta `entrada\` (eu preparo este lote para si quando chegarmos à fase 4);
2. Dê dois cliques em `upscale.bat`;
3. Os resultados saem em `..\..\dist\img-hd\` já no sítio certo para publicar;
4. Corra o `publicar_dados.bat` da raiz → as imagens ficam servidas via jsDelivr → eu aplico nos produtos via API e valido uma a uma.

## Notas

- Modelo usado: `realesrgan-x4plus` (4×). Um 300×300 vira 1200×1200;
- Rótulos com texto pequeno podem sair "derretidos" — a minha validação visual apanha e devolve esses para substituição manual;
- Não use nas fotos que têm fonte oficial melhor — substituir é sempre superior a inventar pixels.
