@echo off
setlocal EnableExtensions
chcp 65001 >nul
title PITL local server

rem ------------------------------------------------------------
rem  PITL local server (localhost:7878) setup and start
rem  - Inside the repo folder: uses that folder
rem  - Elsewhere: clones the repo into a "pitl" subfolder
rem  - Creates .env, runs npm start
rem ------------------------------------------------------------

set "REPO_URL=https://github.com/ndkkdn/pitl.git"
set "HERE=%~dp0"

rem 1. Check required tools
where node >nul 2>&1 || (echo [ERROR] Node.js is not installed. Install it from https://nodejs.org & goto :fail)
where npm  >nul 2>&1 || (echo [ERROR] npm was not found. Reinstall Node.js. & goto :fail)
where claude >nul 2>&1 || echo [WARN] claude CLI not found. Plan generation needs a logged-in "claude".

rem 2. Pick the project folder (clone it if missing)
if exist "%HERE%server.js" (
  set "APP=%HERE%"
) else (
  set "APP=%HERE%pitl\"
  if not exist "%HERE%pitl\server.js" (
    where git >nul 2>&1 || (echo [ERROR] git is required to download the code. & goto :fail)
    echo [1/4] Downloading code...
    git clone "%REPO_URL%" "%HERE%pitl" || goto :fail
  )
)
cd /d "%APP%" || goto :fail

rem 3. Install packages (first run only)
if not exist "node_modules" (
  echo [2/4] Installing packages...
  call npm install || goto :fail
) else (
  echo [2/4] Packages already installed
)

rem 4. Create .env
if not exist ".env" (
  echo [3/4] Creating .env from .env.example...
  copy /y ".env.example" ".env" >nul || goto :fail
) else (
  echo [3/4] Using existing .env
)


rem 5. Start the server
echo [4/4] Starting server: http://localhost:7878
echo        Open https://ndkkdn.github.io/pitl/demo.html (or http://localhost:7878) and click "Reconnect".
echo        If Chrome asks for local network access, click Allow.
echo        Keep this window open while you use it. Press Ctrl+C to stop.
echo.
call npm start
goto :end

:fail
echo.
echo Setup stopped. Check the message above.

:end
pause
endlocal
