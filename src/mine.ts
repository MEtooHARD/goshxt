import chalk from 'chalk';
import puppeteer, { ElementHandle } from 'puppeteer';
import { delay, saveScrenShot } from './functions/misc';
import { pwd_id_ready } from './functions/prepare';

module.exports = async ({ id = '', pwd = '', closeWhenEnd = false, showViewPort = true }) => {

    if (!pwd_id_ready({ pwd: pwd, id: id })) {
        console.log(chalk.red('PLEASE FILL IN YOUR ID & PASSWORD FIRST'));
        process.exit(1);
    }

    const browser = await puppeteer.launch({
        headless: !showViewPort,
        defaultViewport: null
    });

    const page = (await browser.newPage()).on('dialog', _ => _.accept());

    await page.goto('https://sys.ndhu.edu.tw/AA/CLASS/subjselect/Default.aspx');

    await (await page.waitForXPath(`//*[@id="ContentPlaceHolder1_ed_StudNo"]`))?.type(id);

    await (await page.waitForXPath(`//*[@id="ContentPlaceHolder1_ed_pass"]`))?.type(pwd);

    await (await page.waitForXPath(`//*[@id="ContentPlaceHolder1_BtnLoginNew"]`) as ElementHandle<Element>).click();

    const switchBTN = await page.waitForXPath(`//*[@id="ContentPlaceHolder1_Button7"]`);
    if (!(switchBTN instanceof ElementHandle)) {
        console.log(chalk.red('The PASSWORD or ID you provided is wrong.'));
        process.exit(1);
    } else
        await (switchBTN as ElementHandle<Element>).click();
    //ContentPlaceHolder1_Button3
    //
    await delay(500);

    const selectable = await (await page.$('.courses > tbody > tr > .selectable'));

    console.log(await page.evaluate(el => el?.textContent, selectable));
    // const courseRows = (await page.$$('#ContentPlaceHolder1_grd_subjs > tbody > tr')).slice(1);

    /* console.log(`detected unselected courses: ${courseRows.length}, please check.\n` +
        `there should be some screenshots of all your unselected courses. please check`);

    for (const tr of courseRows) saveScrenShot(await tr.screenshot());

    for (const tr of courseRows) {
        // await delay(150); // just ensure that the table loads properly after accepted dialog
        const tds = await tr.$$('td');

        // reserve for the real add-button(s)
        // const add_btn = await tds[0].waitForSelector('input');  
        // await add_btn.click(); 

        const courseID = await page.evaluate(el => el?.innerText, await tds[1].$('a'));
        const courseName = await page.evaluate(el => el.innerText, tds[2]);
        console.log(`Selected ${chalk.green(courseID)}, \tcourse name: ${chalk.blue(courseName)}`);
    } */

    if (closeWhenEnd) {
        await delay(5000);
        for (const page of (await browser.pages())) {
            await page.close();
            await delay(1000);
        }
        await delay(2000);
        await browser.close();
    }
};