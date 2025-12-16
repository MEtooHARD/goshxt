@echo off
echo Building goshxt for distribution...
echo.

REM 編譯 TypeScript
echo [1/4] Compiling TypeScript...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b 1
)

REM 打包成 exe
echo [2/4] Packaging with pkg...
call npm run package:win
if %ERRORLEVEL% NEQ 0 (
    echo Packaging failed!
    pause
    exit /b 1
)

REM 創建發布資料夾
echo [3/4] Creating distribution folder...
if exist dist-release rmdir /s /q dist-release
mkdir dist-release
mkdir dist-release\public

REM 複製檔案
echo [4/4] Copying files...
copy goshxt.exe dist-release\
xcopy /E /I public dist-release\public

REM 創建說明檔
echo goshxt - NDHU Course Registration Assistant > dist-release\README.txt
echo. >> dist-release\README.txt
echo Requirements: >> dist-release\README.txt
echo - Google Chrome must be installed >> dist-release\README.txt
echo. >> dist-release\README.txt
echo Usage: >> dist-release\README.txt
echo 1. Double-click goshxt.exe to start >> dist-release\README.txt
echo 2. Browser will open automatically >> dist-release\README.txt
echo 3. Configure your settings and click Start Registration >> dist-release\README.txt

echo.
echo ========================================
echo Build completed successfully!
echo Output: dist-release\
echo ========================================
echo.
pause
