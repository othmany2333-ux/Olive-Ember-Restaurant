@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Download it from https://nodejs.org/
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo npm is missing. Install Node.js from https://nodejs.org/
  pause
  exit /b 1
)
echo Installing dependencies. Internet access may be needed on the first run.
call npm install
if errorlevel 1 (
  echo Installation failed. Check your internet connection and try again.
  pause
  exit /b 1
)
echo Starting Olive and Ember. Open the local link printed below.
call npm run dev
pause
