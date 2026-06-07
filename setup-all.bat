@echo off
setlocal

echo Installing World Cup Predictor website dependencies...
cd /d "%~dp0website"
call npm.cmd ci

echo.
echo Setup complete. Start development with:
echo cd /d "%~dp0website"
echo npm.cmd run dev
