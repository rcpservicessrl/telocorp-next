@echo off
echo ========================================
echo  Telo' Corp Group — Deploy a Vercel
echo ========================================
echo.

REM Step 1: Set environment variables
echo [1/3] Configurando variables de entorno...
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production < nul
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production < nul
npx vercel env add NEXT_PUBLIC_SITE_URL production < nul
npx vercel env add NEXT_PUBLIC_GOOGLE_MAPS_KEY production < nul

echo.
echo [2/3] Ejecutando build y deploy...
npx vercel --prod

echo.
echo [3/3] Deploy completado!
echo.
echo Recuerda configurar el dominio telocg.com en Vercel Dashboard:
echo   Settings > Domains > Add "telocg.com"
echo.
pause
