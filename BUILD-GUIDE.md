# goshxt - NDHU Course Registration Assistant

東華大學選課自動化工具

## 編譯說明

### Windows 單平台編譯
```batch
build.bat
```
輸出到 `dist-release\`

### 多平台編譯
```batch
build-all.bat
```
輸出到：
- `dist-release-win\` - Windows 版本
- `dist-release-mac\` - macOS 版本  
- `dist-release-linux\` - Linux 版本

## 使用說明

### Windows
1. 雙擊 `goshxt.exe` 啟動
2. 瀏覽器會自動開啟 http://localhost:3000
3. 填寫學號、密碼、選課時間後點擊「Start Registration」

### macOS

**雙擊啟動：**
在 Finder 中雙擊 `start.command`

**或使用終端：**
```bash
bash run.sh
```

### Linux

```bash
bash run.sh
```

瀏覽器會自動開啟 http://localhost:3000

## 系統需求

- **Windows**: Chrome 瀏覽器
- **macOS**: Chrome 瀏覽器
- **Linux**: Chrome 或 Chromium 瀏覽器

不需要安裝 Node.js！

## 開發模式

如果你有 Node.js：

### 安裝依賴
```bash
npm install
# 或
./install.sh  # macOS/Linux
install.bat   # Windows
```

### 啟動開發伺服器
```bash
npm start
# 或
./start.sh  # macOS/Linux
start.bat   # Windows
```

## 功能說明

- ✅ 自動登入選課系統
- ✅ 檢測預選課程
- ✅ 定時批量選課（繞過單次點擊限制）
- ✅ Web 介面設定
- ✅ 跨平台支援

## 技術架構

- TypeScript + Node.js
- Express - Web 伺服器
- Puppeteer - 瀏覽器自動化
- pkg - 單檔案打包
