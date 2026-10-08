@echo off
setlocal
cd /d "%~dp0"
title DK SHOP - Ethernet Print Bridge
echo DK SHOP Ethernet Print Bridge
echo Tanpa install driver printer.
where py >nul 2>nul
if %errorlevel%==0 (
  py print_bridge.py
) else (
  python print_bridge.py
)
endlocal
