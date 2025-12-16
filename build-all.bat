@echo off
echo Building goshxt for all platforms...
echo.

echo [1/5] Compiling TypeScript...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo TypeScript compilation failed!
    pause
    exit /b 1
)

echo [2/5] Packaging for Windows...
call npm run package:win

echo [3/5] Packaging for macOS...
call npm run package:mac

echo [4/5] Packaging for Linux...
call npm run package:linux

echo [5/5] Creating distribution folders...
if not exist "dist-release-win" mkdir dist-release-win
if not exist "dist-release-mac" mkdir dist-release-mac
if not exist "dist-release-linux" mkdir dist-release-linux

echo Copying files...

REM Windows
copy goshxt.exe dist-release-win\ >nul
xcopy /E /I /Y public dist-release-win\public >nul
echo Windows: Created README.txt > dist-release-win\README.txt
echo goshxt - Course Registration Automation >> dist-release-win\README.txt
echo. >> dist-release-win\README.txt
echo Double-click goshxt.exe to start the application. >> dist-release-win\README.txt
echo The browser will open automatically at http://localhost:3000 >> dist-release-win\README.txt

REM macOS
copy goshxt-mac dist-release-mac\ >nul
xcopy /E /I /Y public dist-release-mac\public >nul
copy start.sh dist-release-mac\ >nul
copy run.sh dist-release-mac\ >nul
copy start.command dist-release-mac\ >nul
echo macOS: Created README.txt > dist-release-mac\README.txt
echo goshxt - Course Registration Automation >> dist-release-mac\README.txt
echo. >> dist-release-mac\README.txt
echo Quick Start (Double-click in Finder): >> dist-release-mac\README.txt
echo   start.command >> dist-release-mac\README.txt
echo. >> dist-release-mac\README.txt
echo Or use Terminal: >> dist-release-mac\README.txt
echo   bash run.sh >> dist-release-mac\README.txt
echo. >> dist-release-mac\README.txt
echo The browser will open automatically at http://localhost:3000 >> dist-release-mac\README.txt

REM Linux
copy goshxt-linux dist-release-linux\ >nul
xcopy /E /I /Y public dist-release-linux\public >nul
copy run.sh dist-release-linux\ >nul
echo Linux: Created README.txt > dist-release-linux\README.txt
echo goshxt - Course Registration Automation >> dist-release-linux\README.txt
echo. >> dist-release-linux\README.txt
echo Usage: >> dist-release-linux\README.txt
echo   bash run.sh >> dist-release-linux\README.txt
echo. >> dist-release-linux\README.txt
echo The browser will open automatically at http://localhost:3000 >> dist-release-linux\README.txt

echo.
echo ========================================
echo Build completed successfully!
echo Output:
echo   - Windows: dist-release-win\
echo   - macOS:   dist-release-mac\
echo   - Linux:   dist-release-linux\
echo ========================================
echo.
pause
