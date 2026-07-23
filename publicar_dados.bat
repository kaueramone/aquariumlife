@echo off
REM Publica os dados regenerados (dist/*.json) e purga o cache do jsDelivr
cd /d "%~dp0"
git add dist\*.json dist\*.xml dist\app.js dist\style.css generate-data.cjs package-lock.json gerar-feed-gmc.cjs publicar_dados.bat src tools .github
if exist dist\img-hd git add dist\img-hd
git commit -m "data: publicar dados e codigo"
git pull --rebase --autostash origin main
git push origin main
echo.
echo A purgar cache do jsDelivr (28 ficheiros)...
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/categories.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-all.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527348.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527349.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527350.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527351.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527352.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527353.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527486.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527487.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527488.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527489.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527490.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527491.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527492.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527493.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527494.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527495.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527496.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527497.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527498.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527499.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527705.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527710.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527711.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527713.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-527722.json" >nul
curl -s "https://purge.jsdelivr.net/gh/kaueramone/aquariumlife@main/dist/products-cat-534408.json" >nul
echo.
echo Concluido! As grelhas de categoria vao refletir as imagens novas.
pause
