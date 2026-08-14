@echo off
title Enviar IT SCOPE para GitHub
color 0a

echo ======================================================================
echo    SINCRONIZANDO C:\Projects\ITSCOPE COM O GITHUB (projectitscope/company)
echo ======================================================================
echo.

cd /d "C:\Projects\ITSCOPE"

echo [1/3] Verificando status do Git...
git status
echo.

echo [2/3] Adicionando e confirmando arquivos...
git add -A
git commit -m "feat: sincronizacao completa de propostas, artes e codigo do portal IT SCOPE" 2>nul
echo.

echo [3/3] Enviando para o repositorio remoto no GitHub...
git push -u origin main

echo.
echo ======================================================================
echo    SINCRONIZACAO CONCLUIDA!
echo ======================================================================
echo.
pause
