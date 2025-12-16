import { existsSync } from 'fs';
import { platform } from 'os';
import { join } from 'path';

export function findChrome(): string | undefined {
    const plat = platform();

    if (plat === 'win32') {
        // Windows Chrome 路徑
        const paths = [
            process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        ];

        console.log('[Chrome Finder] Searching for Chrome on Windows...');
        for (const path of paths) {
            if (path && existsSync(path)) {
                console.log('[Chrome Finder] ✓ Found:', path);
                return path;
            } else {
                console.log('[Chrome Finder] ✗ Not found:', path);
            }
        }
    } else if (plat === 'darwin') {
        // macOS Chrome 路徑
        const paths = [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            join(process.env.HOME || '', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
        ];

        for (const path of paths) {
            if (existsSync(path)) {
                return path;
            }
        }
    } else if (plat === 'linux') {
        // Linux Chrome/Chromium 路徑
        const paths = [
            '/usr/bin/google-chrome',
            '/usr/bin/google-chrome-stable',
            '/usr/bin/chromium',
            '/usr/bin/chromium-browser',
            '/snap/bin/chromium',
        ];

        for (const path of paths) {
            if (existsSync(path)) {
                return path;
            }
        }
    }

    return undefined;
}
