@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Install Node.js 22.4 or newer from https://nodejs.org/ then try again.
 pause
 exit /b 1
)
node voyager-launcher.mjs --versus
pause
