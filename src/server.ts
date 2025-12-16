import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { shxt } from './shxt';

// pkg 型別擴展
declare global {
    namespace NodeJS {
        interface Process {
            pkg?: any;
        }
    }
}

const app = express();
const PORT = 3000;

// 判斷是否在打包環境中
const isPackaged = process.pkg !== undefined;
const publicPath = isPackaged
    ? path.join(path.dirname(process.execPath), 'public')
    : path.join(__dirname, '../public');
const configPath = isPackaged
    ? path.join(path.dirname(process.execPath), 'config.json')
    : path.join(__dirname, '../config.json');

app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));

const CONFIG_PATH = configPath;

interface Config {
    student_id: string;
    password: string;
    time: string;
}

let isRunning = false;

// 讀取配置
app.get('/api/config', async (req, res) => {
    try {
        const data = await fs.readFile(CONFIG_PATH, 'utf-8');
        const config = JSON.parse(data);
        res.json(config);
    } catch (error) {
        // 檔案不存在時建立預設配置
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');

        const defaultConfig: Config = {
            student_id: '',
            password: '',
            time: `${year}-${month}-${day} 12:30`
        };
        try {
            await fs.writeFile(CONFIG_PATH, JSON.stringify(defaultConfig, null, 4), 'utf-8');
            res.json(defaultConfig);
        } catch (writeError) {
            res.status(500).json({ error: 'Failed to write config' });
        }
    }
});

// 儲存配置
app.post('/api/config', async (req, res) => {
    try {
        const config: Config = req.body;
        await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 4), 'utf-8');
        res.json({ success: true, message: 'Config saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save config' });
    }
});

// 啟動選課
app.post('/api/start', async (req, res) => {
    if (isRunning) {
        res.status(400).json({ error: 'Already running' });
        return;
    }

    try {
        isRunning = true;
        res.json({ success: true, message: 'Started' });

        // 在背景執行
        shxt()
            .catch((error) => {
                console.error('Error in shxt():', error);
            })
            .finally(() => {
                isRunning = false;
            });
    } catch (error) {
        isRunning = false;
        res.status(500).json({ error: 'Failed to start' });
    }
});

// 獲取執行狀態
app.get('/api/status', (req, res) => {
    res.json({ isRunning });
});

export const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);

        // 自動打開瀏覽器
        const url = `http://localhost:${PORT}`;
        const command = process.platform === 'win32' ? `start ${url}` :
            process.platform === 'darwin' ? `open ${url}` :
                `xdg-open ${url}`;

        exec(command, (error) => {
            if (error) {
                console.log(`Could not open browser automatically. Please navigate to ${url}`);
            } else {
                console.log(`Browser opened. Please check your browser for the configuration page.`);
            }
        });
    });
};
