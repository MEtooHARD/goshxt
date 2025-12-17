// Popup script for manual injection

document.getElementById('injectBtn').addEventListener('click', async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // 检查是否是 NDHU 网站
        if (!tab.url.includes('sys.ndhu.edu.tw')) {
            return;
        }

        // 注入 inject.js (alert override)
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['inject.js'],
            world: 'MAIN'
        });

        // 注入 CSS
        await chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ['content.css']
        });

        // 注入 content.js
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        });

    } catch (error) {
        // Silent fail
    }
});
