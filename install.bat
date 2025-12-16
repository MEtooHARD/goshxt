@echo off
echo Installing dependencies...
echo.

cd /d "%~dp0"

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: npm is not installed.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Installation completed successfully!
    echo You can now run start.bat to launch the application.
) else (
    echo.
    echo Installation failed. Please check the error messages above.
)

echo.
pause
