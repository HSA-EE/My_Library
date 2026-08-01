@echo off
cd /d "%~dp0"
start "The Quiet Split local server" /min cmd /k "npm.cmd run dev"
timeout /t 4 /nobreak >nul
start "" http://localhost:3000/
