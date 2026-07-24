@echo off
REM ============================================================
REM  Gera o "Atualizar-Loja.exe" (uma vez, no teu Windows).
REM  Requer Node.js instalado (https://nodejs.org - versao LTS).
REM ============================================================
cd /d "%~dp0"

echo A copiar o gerador de dados...
copy /Y "..\..\generate-data.cjs" "generate-data.cjs" >nul

echo A preparar o empacotador (pkg)... (pode demorar 1-2 min)
call npm i @yao-pkg/pkg --no-save --no-fund --no-audit

echo A gerar o executavel...
call npx pkg refresh.cjs --targets node18-win-x64 --output "Atualizar-Loja.exe"

echo.
if exist "Atualizar-Loja.exe" (
  echo ============================================================
  echo  PRONTO! "Atualizar-Loja.exe" foi criado nesta pasta.
  echo  Agora: preenche o config.json e envia os DOIS ficheiros
  echo  ^(Atualizar-Loja.exe + config.json^) ao cliente.
  echo ============================================================
) else (
  echo FALHOU. Verifica se o Node.js esta instalado ^(nodejs.org^).
)
echo.
pause
