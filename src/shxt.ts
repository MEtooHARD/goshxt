import chalk from 'chalk';
import puppeteer, { ElementHandle } from 'puppeteer';
import { delay } from './functions/misc';
import config from '../config.json';

export const shxt = async () => {
    console.log('if the program doesn\'t start right after the course system starts, just click the button on your own.');
    console.log('the reason is that I can\'t sync with the server so this program don\'t actually .');

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--window-size=1920,1080']
    });
    const page = (await browser.newPage()).on('dialog', _ => _.accept());

    await page.goto('https://sys.ndhu.edu.tw/AA/CLASS/subjselect/Default.aspx');

    await (await page.waitForSelector(`#ContentPlaceHolder1_ed_StudNo`) as ElementHandle<Node>).type(config.student_id);

    await (await page.waitForSelector(`#ContentPlaceHolder1_ed_pass`) as ElementHandle<Node>).type(config.password);

    await (await page.waitForSelector(`#ContentPlaceHolder1_BtnLoginNew`) as ElementHandle<Element>).click();

    page.waitForSelector(`#ContentPlaceHolder1_Button7`, { timeout: 5000 })
        .then(async switchBTN => {
            await (switchBTN as ElementHandle<Element>).click();
            const timeLeft = (new Date(config.time)).getTime() - Date.now();
            let courses: ElementHandle<HTMLTableRowElement>[] = [], waiting_try_count = 0, course_handled = 0;
            do {
                await delay(25);
                waiting_try_count++;
                courses = await page.$$('#ContentPlaceHolder1_grd_subjs > tbody > tr');
            } while (courses.length <= 1 && waiting_try_count < 100);
            console.log('Found ' + chalk.green(courses.length - 1) + ' courses, please check.');
            console.log(`${chalk.yellow((timeLeft / 1000 / 60).toFixed(1).toString())} minuts till the open time. Get ready.`);
            if (!config.fullauto) console.log(`${chalk.yellow('[warning]')} you\'re ${chalk.yellow('not')} set to ${chalk.yellow('fullauto')}, this program will ${chalk.yellow('not add the courses')} for you`);
            if (Boolean(config.fullauto)) {
                setTimeout(async () => {
                    console.log('Found scheduled course(s):');
                    courses.slice(1).forEach(async tr => {
                        let backend_output = '';
                        const add_btn = await tr.$('input');
                        if (((await page.evaluate(add_btn => (add_btn as HTMLInputElement).className, add_btn)).includes('hide')))
                            backend_output += chalk.yellow('added');
                        else {
                            await (add_btn as ElementHandle<HTMLInputElement>).click();
                            backend_output += chalk.green('new add');
                        }
                        console.log(backend_output + '\t' + (await tr.$$eval('td', x => x[1].innerText + '\t' + x[2].innerText)) + '\t');
                        course_handled++;
                    });
                    // while (course_handled != courses.length - 1) await delay(100);
                    console.log('\n' + chalk.yellow('hint: the ') + chalk.green('new add ') + chalk.yellow('may be a clashed one.' + '\n'
                        + 'To be on the safe side, please CHECK AGAIN all the courses you want are added correctly.'));
                }, timeLeft > 0 ? timeLeft : 0);
            }
        })
        .catch(x => {
            console.log(chalk.red('The PASSWORD or ID you provided was wrong.'));
            process.exit(1);
        });

    await delay(5 * 60 * 1000);
}