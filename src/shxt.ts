import chalk from 'chalk';
import puppeteer, { ElementHandle } from 'puppeteer';
import { delay, pwd_id_ready } from './functions/misc';
import { ModeOptions } from './type';
import config from '../config.json';

module.exports = async ({ id = '', pwd = '', showViewPort = true, manual = false }: ModeOptions) => {
    if (!pwd_id_ready({ pwd: pwd, id: id })) {
        console.log(chalk.red('PLEASE FILL IN YOUR ID & PASSWORD FIRST'));
        process.exit(1);
    }
    const browser = await puppeteer.launch({
        headless: !showViewPort,
        defaultViewport: null,
        args: ['--window-size=1920,1080']
    });

    const page = (await browser.newPage()).on('dialog', _ => _.accept());
    await page.goto('https://sys.ndhu.edu.tw/AA/CLASS/subjselect/Default.aspx');

    await (await page.waitForXPath(`//*[@id="ContentPlaceHolder1_ed_StudNo"]`) as ElementHandle<Node>).type(id);
    await (await page.waitForXPath(`//*[@id="ContentPlaceHolder1_ed_pass"]`) as ElementHandle<Node>).type(pwd);
    await (await page.waitForXPath(`//*[@id="ContentPlaceHolder1_BtnLoginNew"]`) as ElementHandle<Element>).click();
    const switchBTN = await page.waitForXPath(`//*[@id="ContentPlaceHolder1_Button7"]`);

    if (!(switchBTN instanceof ElementHandle)) {
        console.log(chalk.red('The PASSWORD or ID you provided is wrong.'));
        process.exit(1);
    } else {
        await (switchBTN as ElementHandle<Element>).click();
        await delay(500);
        const timeLeft = (new Date(config.time)).getTime() - Date.now();
        if (!manual) {
            console.log(`There\'s ${(timeLeft / 1000 / 60).toFixed(1).toString()} minuts left before the open time. Get ready`);
            setTimeout(async () => {
                console.log('Found scheduled course(s):');
                for (const tr of (await page.$$('#ContentPlaceHolder1_grd_subjs > tbody > tr')).slice(1)) {
                    let backend_output = '';
                    const add_btn = await tr.$('input');
                    if (((await page.evaluate(add_btn => (add_btn as HTMLInputElement).className, add_btn)).includes('hide')))
                        backend_output += chalk.yellow('added');
                    else {
                        await (add_btn as ElementHandle<HTMLInputElement>).click();
                        backend_output += chalk.green('new add');
                    }
                    console.log(backend_output + '\t' + (await page.evaluate(x => x?.innerText, (await tr.$$('td'))[1])) +
                        '\t' + (await page.evaluate(x => x?.innerText, (await tr.$$('td'))[2])) + '\t');
                };
                console.log('\n' + chalk.yellow('hint: the ') + chalk.green('new add ') + chalk.yellow('may be a clashed one.' + '\n'
                    + 'To be on the safe side, please CHECK AGAIN all the courses you want are added correctly.'));
            }, timeLeft > 0 ? timeLeft : 0);
        }
    }
};