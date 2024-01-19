const puppeteer = require('puppeteer');
const { delay } = require('./functions');

module.exports = async ({ id = '', pwd = '', closeWhenEnd = false }) => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        // userDataDir: './tmp'
    });
    const page = await browser.newPage();

    page.on('dialog', async dialog => {
        await dialog.accept();
    });

    const elearning = 'http://www.elearn.ndhu.edu.tw/moodle/index.php?lang=en_utf8';
    const chipichipichapachapa = 'https://youtu.be/0tOXxuLcaog';
    const ndhu = 'https://www.ndhu.edu.tw/'
    const ndhuCours = 'https://sys.ndhu.edu.tw/AA/CLASS/subjselect/Default.aspx'

    const url = ndhuCours;

    await page.goto(url);

    const idInput = await page.waitForXPath(`//*[@id="ContentPlaceHolder1_ed_StudNo"]`);
    await idInput.type(id);
    const pwdInput = await page.waitForXPath(`//*[@id="ContentPlaceHolder1_ed_pass"]`);
    await pwdInput.type(pwd);

    const login_btn = await page.waitForXPath(`//*[@id="ContentPlaceHolder1_BtnLoginNew"]`);
    await login_btn.click();

    const pre_sched_btn = await page.waitForXPath(`//*[@id="ContentPlaceHolder1_Button7"]`);
    await pre_sched_btn.click();



    //  wait a period then close.
    if (closeWhenEnd) {
        await delay(5000);
        for (const page of (await browser.pages())) {
            await page.close();
            await delay(2000);
        }
        await delay(2000);
        await browser.close();
    }
};