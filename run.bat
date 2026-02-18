@echo off
title 3D-Robo Web - Dev Server
color 0A

echo ============================================
echo        3D-Robo Web - Starting Up...
echo ============================================
echo.

:: Navigate to the project directory
cd /d "%~dp0"

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node -v
echo.

:: Check if node_modules exists, install if not
if not exist "node_modules\" (
    echo [INFO] node_modules not found. Installing dependencies...
    echo.
    npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed successfully.
) else (
    echo [OK] Dependencies already installed.
)

echo.
echo ============================================
echo    Starting Vite Dev Server...
echo    Press Ctrl+C to stop the server.
echo ============================================
echo.

:: Start the dev server
npm run dev

:: If the server exits, pause to see any errors
pause
