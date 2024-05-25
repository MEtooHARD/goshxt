import chalk from 'chalk';
import puppeteer, { ElementHandle } from 'puppeteer';
import { delay } from './functions/misc';
import config from '../config.json';

module.exports = async () => {
    const browser = await puppeteer.launch({
        headless: !config.showViewPort,
        defaultViewport: null,
        args: ['--window-size=1920,1080']
    });
    const page = (await browser.newPage())
        .on('dialog', async _ => {
            if (config.manual && config.dialog_delay_accept > 0)
                await delay(config.dialog_delay_accept);
            _.accept();
        });

    await page.goto('https://sys.ndhu.edu.tw/AA/CLASS/subjselect/Default.aspx');

    try {
        if (config.earthquakeNotice)
            await (await page.waitForXPath(`//*[@id="enterButton"]`, { timeout: 2000 }) as ElementHandle<Element>).click();
    } catch (e) { }

    await (await page.waitForXPath(`//*[@id="ContentPlaceHolder1_ed_StudNo"]`) as ElementHandle<Node>).type(config.student_id);

    await (await page.waitForXPath(`//*[@id="ContentPlaceHolder1_ed_pass"]`) as ElementHandle<Node>).type(config.password);

    await (await page.waitForXPath(`//*[@id="ContentPlaceHolder1_BtnLoginNew"]`) as ElementHandle<Element>).click();

    /* try {
        if (config.earthquakeNotice)
            await (await page.waitForXPath(`//*[@id="enterButton"]`, { timeout: 2000 }) as ElementHandle<Element>).click();
    } catch (e) { } */

    console.log('a')
    page.waitForXPath(`//*[@id="ContentPlaceHolder1_Button7"]`, { timeout: 5000 })
        .then(async switchBTN => {
            console.log('b')

            await (switchBTN as ElementHandle<Element>).click();
            const timeLeft = (new Date(config.time)).getTime() - Date.now();
            let courses: ElementHandle<HTMLTableRowElement>[] = [], waiting_try_count = 0, course_handled = 0;
            do {
                await delay(25);
                waiting_try_count++;
                courses = await page.$$('#ContentPlaceHolder1_grd_subjs > tbody > tr');
            } while (courses.length <= 1 && waiting_try_count < 100);
            console.log('Found ' + chalk.yellow(courses.length - 1) + ' courses, please check.');
            if (!config.manual) {
                console.log(`${chalk.yellow((timeLeft / 1000 / 60).toFixed(1).toString())} minuts till the open time. Get ready.`);
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
                    while (course_handled != courses.length - 1)
                        await delay(100);
                    console.log('\n' + chalk.yellow('hint: the ') + chalk.green('new add ') + chalk.yellow('may be a clashed one.' + '\n'
                        + 'To be on the safe side, please CHECK AGAIN all the courses you want are added correctly.'));
                }, timeLeft > 0 ? timeLeft : 0);
            }
        })
        .catch(x => {
            console.log(chalk.red('The PASSWORD or ID you provided was wrong.'));
            process.exit(1);
        });
}