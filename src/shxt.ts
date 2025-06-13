import chalk from 'chalk';
import puppeteer, { ElementHandle, EvaluateFunc, Page } from 'puppeteer';
import { delay } from './functions/misc';
import config from '../config.json';

declare global {
    interface Window {
        bSS: () => Promise<void>;
    }
}

let SSing: boolean = false;
let dialogCT: number = 0;
let SSCT: number = 0;

export const shxt = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--window-size=1080,720']
    });
    const page = (await browser.newPage());

    page.on('dialog', _ => {
        _.accept();
        console.log("AC MSG:", chalk.yellow(_.message()));
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
    const SSed: boolean = false;

    const SS = async () => {
        console.log(`======SS====== ${++SSCT}`);
        if (SSing) {
            console.log(chalk.yellow("SS is already running, pls wait"));
        } else {
            SSing = true;
            await new Promise(resolve => setTimeout(resolve, 3000));
            await page.evaluate((calls) => {
                for (const call of calls) {
                    if (call === null) continue;
                    const func = new Function(call);

                    func();
                }
            }, calls);
            SSing = false;
        }
        console.log(`======SS====== ${SSCT}`);
    }

    page.waitForSelector(`#ContentPlaceHolder1_Button7`, { timeout: 5000 })
        .then(async switchBTN => {
            await (switchBTN as ElementHandle<Element>).click();
            console.log("switched to preselect");

            console.log("fetching courses");
            let courses: ElementHandle<HTMLInputElement>[] = [], waiting_try_count = 0;
            do {
                await delay(25);
                waiting_try_count++;
                courses = await page.$$('#ContentPlaceHolder1_grd_subjs > tbody > tr > td > input');
            } while (courses.length <= 1 && waiting_try_count < 100);
            console.log("fetched", courses.length, "courses");

            console.log("extract ss call");
            calls.push(...(await Promise.all(courses.map(c => c.evaluate(e => e.getAttribute('onclick')))))
                .filter(x => x !== null) as string[]);

            console.log(`ss calls: \n\t${calls
                .map(x => x.replace("return", "").trim())
                .join('\n\t')}`
            );

            const timeLeft = (new Date(config.time)).getTime() - Date.now();
            setTimeout(async () => {
                if (SSed) await SS();
                else console.log("scheduled SS skipped");
            }, timeLeft > 0 ? timeLeft : 0);
            console.log("SS will be executed in",
                timeLeft > 0 ? `${Math.floor(timeLeft / 1000 / 60)} minutes` : "0 minutes");

            /* trigger */
            await page.exposeFunction('bSS', SS);
            await page.evaluate(() => {
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

                ssButton.onclick = () => { window.bSS(); };

                document.body.appendChild(ssButton);
            })
            console.log("button insert");
            /* trigger */
        })
        .catch(x => {
            console.log(chalk.red('The PASSWORD or ID you provided was wrong.'));
            process.exit(1);
        })

    await delay(20 * 60 * 1000);
}