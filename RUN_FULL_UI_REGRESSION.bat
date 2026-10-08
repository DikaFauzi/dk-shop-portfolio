@echo off
setlocal
cd /d "%~dp0"

echo.
echo ============================================================
echo   DK SHOP - FULL UI REGRESSION TESTER
echo ============================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js tidak ditemukan.
  echo Install Node.js terlebih dahulu, lalu jalankan file ini lagi.
  pause
  exit /b 1
)

if not exist node_modules\@playwright\test (
  echo [1/3] Install dependency Playwright...
  call npm install
  if errorlevel 1 goto :failed
) else (
  echo [1/3] Dependency Playwright sudah tersedia.
)

echo.
echo [2/3] Pastikan Chromium Playwright tersedia...
call npx playwright install chromium
if errorlevel 1 goto :failed

echo.
echo [3/3] Menjalankan CORE + FULL UI REGRESSION...
call npm run test:all
if errorlevel 1 goto :failed

echo.
echo ============================================================
echo   PASS - CORE DAN FULL UI REGRESSION SELESAI
echo ============================================================
echo.
echo HTML report:
echo   playwright-report\index.html
echo.
pause
exit /b 0

:failed
echo.
echo ============================================================
echo   FAIL - ADA REGRESSION YANG HARUS DIPERBAIKI
echo ============================================================
echo.
echo Cek output terminal dan folder:
echo   test-results\
echo   playwright-report\
echo.
pause
exit /b 1
