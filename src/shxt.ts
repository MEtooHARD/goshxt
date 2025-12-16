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

    const SS = async () => {
        console.log(`======SS====== ${++SSCT}`);
        if (SSing) {
            console.log(chalk.yellow("SS is already running, pls wait"));
        } else {
            SSing = true;
            await new Promise(resolve => setTimeout(resolve, 3000));
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

            const timeLeft = (new Date(config.time)).getTime() - Date.now();
            if (timeLeft > 0) {
                setTimeout(async () => {
                    await SS();
                }, timeLeft);
                console.log(`SS will be executed in ${Math.floor(timeLeft / 1000 / 60)} minutes`);
            } else {
                if (calls.length > 0) {
                    console.log(chalk.cyan("Execute SS immediately."));
                    try {
                        await SS();
                    } catch (e: any) {
                        console.log(chalk.red(`[Error in SS execution]:`, e?.message));
                    }
                }
            }

            /* trigger */
            // 將 SS 調用邏輯注入頁面
            try {
                const buttonScript = `
                    (function() {
                        const callsList = ${JSON.stringify(calls)};
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
                            for (const call of callsList) {
                                if (call === null) continue;
                                const func = new Function(call);
                                func();
                            }
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