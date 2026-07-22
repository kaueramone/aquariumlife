@echo off
REM Upscale 4x com Real-ESRGAN -> dist\img-hd\ (ver LEIA-ME.md)
cd /d "%~dp0"
if not exist realesrgan-ncnn-vulkan.exe (
  echo ERRO: falta o realesrgan-ncnn-vulkan.exe nesta pasta. Ver LEIA-ME.md
  pause & exit /b 1
)
if not exist entrada mkdir entrada
if not exist ..\..\dist\img-hd mkdir ..\..\dist\img-hd
echo A processar imagens de entrada\ ...
realesrgan-ncnn-vulkan.exe -i entrada -o ..\..\dist\img-hd -n realesrgan-x4plus -f jpg
echo.
echo Concluido! Resultados em dist\img-hd\ — agora corra o publicar_dados.bat da raiz.
pause
