@echo off
setlocal
cd /d "%~dp0"
echo.
echo ==============================================
echo   DK SHOP - LOCAL SERVER
echo ==============================================
echo URL: http://localhost:5500
echo Tekan CTRL+C untuk stop server.
echo.
start "" http://localhost:5500
where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server 5500
) else (
  python -m http.server 5500
)
endlocal
