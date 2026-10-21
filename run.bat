@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title AdoptLuck

where node >nul 2>&1
if errorlevel 1 (
  echo [AdoptLuck] Node.js not found. Install Node 18+ from https://nodejs.org/
  goto :done
)

if not exist ".env.local" if exist ".env.example" (
  copy /Y ".env.example" ".env.local" >nul
  echo [AdoptLuck] Created .env.local — add your Supabase keys when ready.
)

if not exist "node_modules\" (
  echo [AdoptLuck] First run: installing dependencies...
  call npm install
  if errorlevel 1 goto :done
)

if /I "%~1"=="--prod" goto :prod
if /I "%~1"=="-p" goto :prod

echo [AdoptLuck] Dev server: http://localhost:3000
echo [AdoptLuck] Leave this window OPEN. Stop with Ctrl+C.
echo.
start "" "http://localhost:3000"
call npm run dev
goto :done

:prod
echo [AdoptLuck] Building for production...
call npm run build
if errorlevel 1 goto :done
echo [AdoptLuck] http://localhost:3000
start "" "http://localhost:3000"
call npm run start
goto :done

:done
echo.
if errorlevel 1 (
  echo [AdoptLuck] Exited with an error. Read the messages above.
) else (
  echo [AdoptLuck] Server stopped.
)
pause
