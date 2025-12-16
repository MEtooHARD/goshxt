import chalk from 'chalk';
import puppeteer, { ElementHandle } from 'puppeteer';
import { delay } from './functions/misc';
import { findChrome } from './chromeFinder';
import fs from 'fs/promises';
import path from 'path';

// pkg 型別擴展
declare global {
    namespace NodeJS {
        interface Process {
            pkg?: any;
        }
    }
}

interface Config {
    student_id: string;
    password: string;
    time: string;
}

let SSing: boolean = false;
let dialogCT: number = 0;
let SSCT: number = 0;

export const shxt = async () => {
    // 動態讀取 config.json
    const isPackaged = process.pkg !== undefined;
    const configPath = isPackaged
        ? path.join(path.dirname(process.execPath), 'config.json')
        : path.join(__dirname, '../config.json');
    const configData = await fs.readFile(configPath, 'utf-8');
    const config: Config = JSON.parse(configData);

    // 自動偵測 Chrome 路徑
    const chromePath = process.env.CHROME_PATH || findChrome();
    if (!chromePath) {
        console.error(chalk.red('❌ Could not find Chrome browser!'));
        console.error(chalk.yellow('Please install Google Chrome from https://www.google.com/chrome/'));
        console.error(chalk.yellow('Or set CHROME_PATH environment variable to your Chrome executable.'));
        throw new Error('Chrome not found');
    }
    console.log(chalk.green('✓ Chrome found:'), chromePath);

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--window-size=1080,720'],
        executablePath: chromePath
    });
    const page = (await browser.newPage());

    page.on('dialog', _ => {
        _.accept();
        console.log("message:", chalk.yellow(_.message()));
        dialogCT++;
    });
    console.log("dialog fucker set");

    await page.goto('https://sys.ndhu.edu.tw/AA/CLASS/subjselect/Default.aspx');
    console.log("site loaded");

    await (await page.waitForSelector(`#ContentPlaceHolder1_ed_StudNo`) as ElementHandle<Node>).type(config.student_id);
    console.log("filled ID");

    await (await page.waitForSelector(`#ContentPlaceHolder1_ed_pass`) as ElementHandle<Node>).type(config.password);
    console.log("filled PWD");

    await (await page.waitForSelector(`#ContentPlaceHolder1_BtnLoginNew`) as ElementHandle<Element>).click();

    await page.waitForNavigation();
    console.log("logged in");

    const calls: string[] = [];

    // 測試用假資料
    // calls.push('console.log("Test call 1 executed!")');
    // calls.push('console.log("Test call 2 executed!")');
    // calls.push('alert("Test call 3 - Alert!")');

    const SS = async () => {
        console.log(`======SS====== ${++SSCT}`);
        if (SSing) {
            console.log(chalk.yellow("SS is already running, pls wait"));
        } else {
            SSing = true;
            // Execute all onclick calls using addScriptTag instead of evaluate
            try {
                const scriptContent = `
                    (function() {
                        const calls = ${JSON.stringify(calls)};
                        for (const call of calls) {
                            if (call === null) continue;
                            const func = new Function(call);
                            func();
                        }
                    })();
                `;
                await page.addScriptTag({ content: scriptContent });
            } catch (e: any) {
                console.log(chalk.red(`[Error in SS page.evaluate]:`, e?.message));
            }
            SSing = false;
        }
        console.log(`======SS====== ${SSCT}`);
    }

    page.waitForSelector(`#ContentPlaceHolder1_Button7`, { timeout: 15000 })
        .then(async switchBTN => {
            console.log("switch to pre-select tab");
            await (switchBTN as ElementHandle<Element>).click();

            console.log("check pre-selects");
            let courses: ElementHandle<HTMLTableRowElement>[] = [], waiting_try_count = 0;
            do {
                await delay(25);
                waiting_try_count++;
                courses = (await page.$$('#ContentPlaceHolder1_grd_subjs > tbody > tr')).slice(1);
            } while (courses.length < 1 && waiting_try_count < 100);
            console.log("found courses:");

            let selectableCount = 0;
            for (let i = 0; i < courses.length; i++) {
                const course = courses[i];
                try {
                    const nameCell = await course.$('td:nth-child(3)');
                    const codeCell = await course.$('td:nth-child(2)');

                    const courseName = nameCell ? (await (await nameCell.getProperty('textContent')).jsonValue() as string)?.trim() || '' : '';
                    const courseCode = codeCell ? (await (await codeCell.getProperty('textContent')).jsonValue() as string)?.trim() || '' : '';

                    const button = await course.$('td > input');
                    const validity = button !== null ? chalk.green("[OK]") : chalk.red("[NG]");
                    console.log(`\t${validity} ${courseCode}\t${courseName}`);

                    if (button) {
                        selectableCount++;
                        // Get outerHTML and parse onclick with regex to avoid evaluate()
                        const outerHTML = (await (await button.getProperty('outerHTML')).jsonValue()) as string;
                        const onclickMatch = outerHTML.match(/onclick="([^"]+)"/);
                        if (onclickMatch && onclickMatch[1]) {
                            calls.push(onclickMatch[1]);
                        }
                    }
                } catch (error: any) {
                    console.log(chalk.red(`Error processing course ${i + 1}:`), error?.message || error);
                }
            }

            console.log(`\nselectable: ${selectableCount}/${courses.length}`);

            if (calls.length === 0) {
                console.log(chalk.yellow("⚠ No selectable courses found! Nothing to add."));
            } else {
                console.log(`ss calls: \n\t${calls
                    .map(x => x.replace("return", "").trim())
                    .join('\n\t')}`
                );
            }

            /* trigger */
            // 等待 DOM 穩定
            await new Promise(resolve => setTimeout(resolve, 3000));

            // 計算目標時間
            const targetTime = (new Date(config.time)).getTime();

            // 將定時 + SS 調用邏輯注入頁面
            try {
                const buttonScript = `
                    (function() {
                        const targetTime = ${targetTime};
                        const earlyStart = 2000; // 提前 2 秒
                        const retryWindow = 4000; // 持續 4 秒
                        
                        // 執行 SS 的函數
                        const executeSSOnce = () => {
                            const rows = document.querySelectorAll('#ContentPlaceHolder1_grd_subjs > tbody > tr');
                            const freshCalls = [];
                            
                            for (let i = 1; i < rows.length; i++) {
                                const button = rows[i].querySelector('td > input');
                                if (button) {
                                    const onclick = button.getAttribute('onclick');
                                    if (onclick) {
                                        freshCalls.push(onclick);
                                    }
                                }
                            }
                            
                            console.log('[SS Auto] Executing', freshCalls.length, 'calls...');
                            
                            for (const call of freshCalls) {
                                if (call === null) continue;
                                try {
                                    const func = new Function(call);
                                    func();
                                } catch (e) {
                                    console.error('Error executing call:', e);
                                }
                            }
                        };
                        
                        // 定時執行邏輯
                        const timeLeft = targetTime - Date.now();
                        
                        if (timeLeft > earlyStart) {
                            console.log('[SS Auto] Will start in', Math.floor((timeLeft - earlyStart) / 1000), 'seconds');
                            console.log('[SS Auto] Target time:', new Date(targetTime).toLocaleTimeString());
                            
                            setTimeout(() => {
                                console.log('[SS Auto] Starting continuous retry...');
                                const endTime = Date.now() + retryWindow;
                                
                                const retryLoop = () => {
                                    if (Date.now() < endTime) {
                                        executeSSOnce();
                                        setTimeout(retryLoop, 0); // 立即重複
                                    } else {
                                        console.log('[SS Auto] Retry window ended.');
                                    }
                                };
                                
                                retryLoop();
                            }, timeLeft - earlyStart);
                        } else {
                            console.log('[SS Auto] Executing immediately...');
                            executeSSOnce();
                        }
                        
                        // 創建手動 SS 按鈕
                        const ssButton = document.createElement('button');
                        ssButton.id = 'ssButton';
                        ssButton.textContent = 'SS';
                        ssButton.style.position = 'fixed';
                        ssButton.style.bottom = '10px';
                        ssButton.style.right = '10px';
                        ssButton.style.zIndex = '1000';
                        ssButton.style.padding = '10px 20px';
                        ssButton.style.backgroundColor = '#007bff';
                        ssButton.style.color = '#fff';
                        ssButton.style.border = 'none';
                        ssButton.style.borderRadius = '5px';
                        ssButton.style.cursor = 'pointer';

                        ssButton.onclick = () => {
                            console.log('SS button clicked!');
                            
                            // 創建提示訊息
                            const showToast = (message, color) => {
                                const toast = document.createElement('div');
                                toast.textContent = message;
                                toast.style.position = 'fixed';
                                toast.style.top = '50%';
                                toast.style.left = '50%';
                                toast.style.transform = 'translate(-50%, -50%)';
                                toast.style.backgroundColor = color;
                                toast.style.color = '#fff';
                                toast.style.padding = '20px 40px';
                                toast.style.borderRadius = '10px';
                                toast.style.fontSize = '24px';
                                toast.style.fontWeight = 'bold';
                                toast.style.zIndex = '9999';
                                toast.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
                                toast.style.transition = 'opacity 0.3s';
                                document.body.appendChild(toast);
                                
                                setTimeout(() => {
                                    toast.style.opacity = '0';
                                    setTimeout(() => toast.remove(), 300);
                                }, 1500);
                            };
                            
                            showToast('🚀 Starting registration...', '#007bff');
                            
                            // 視覺反饋：按鈕變色 + 禁用
                            ssButton.disabled = true;
                            ssButton.textContent = 'Running...';
                            ssButton.style.backgroundColor = '#ffc107';
                            ssButton.style.transform = 'scale(0.95)';
                            
                            // 重新抓取所有課程的 onclick
                            const rows = document.querySelectorAll('#ContentPlaceHolder1_grd_subjs > tbody > tr');
                            const freshCalls = [];
                            
                            console.log('Found rows:', rows.length);
                            
                            for (let i = 1; i < rows.length; i++) {
                                const button = rows[i].querySelector('td > input');
                                if (button) {
                                    const onclick = button.getAttribute('onclick');
                                    if (onclick) {
                                        freshCalls.push(onclick);
                                        console.log('Added onclick:', onclick.substring(0, 50) + '...');
                                    }
                                }
                            }
                            
                            console.log('Total calls to execute:', freshCalls.length);
                            
                            // 執行所有 onclick
                            for (const call of freshCalls) {
                                if (call === null) continue;
                                try {
                                    const func = new Function(call);
                                    func();
                                } catch (e) {
                                    console.error('Error executing call:', e);
                                }
                            }
                            
                            console.log('SS execution completed!');
                            
                            showToast('✅ Completed! Executed ' + freshCalls.length + ' registration requests', '#28a745');
                            
                            // 完成反饋：按鈕變綠
                            ssButton.textContent = 'Done!';
                            ssButton.style.backgroundColor = '#28a745';
                            
                            // 1秒後恢復
                            setTimeout(() => {
                                ssButton.disabled = false;
                                ssButton.textContent = 'SS';
                                ssButton.style.backgroundColor = '#007bff';
                                ssButton.style.transform = 'scale(1)';
                            }, 1000);
                        };

                        document.body.appendChild(ssButton);
                    })();
                `;
                await page.addScriptTag({ content: buttonScript });
                console.log("button inserted");
            } catch (e: any) {
                console.log(chalk.red(`[Error injecting SS button]:`, e?.message));
            }
            /* trigger */
        })
        .catch(error => {
            console.log(chalk.red('Couldn\'t find the pre-select button!'));
            console.log(chalk.yellow('Error:'), error.message);
            console.log(chalk.yellow('The page might have changed or you may not have permission to access it.'));
        })

    await delay(20 * 60 * 1000);
}