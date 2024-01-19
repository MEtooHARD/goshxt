const puppeteer = require('puppeteer');
const { delay, saveScrenShot } = require('./functions');

module.exports = async ({ id = '', pwd = '', closeWhenEnd = false, showViewPort = true }) => {
    const browser = await puppeteer.launch({
        headless: !showViewPort,
        defaultViewport: false,
    });
    const page = await browser.newPage();

    page.on('dialog', async dialog => {
        await dialog.accept();
    });

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

    await delay(500); // wait for courses table to load

    const courseRows = await page.$$('#ContentPlaceHolder1_grd_subjs > tbody > tr');
    courseRows.shift();

    console.log(`detected unselected courses: ${courseRows.length}, please check.\n` +
        `there should be some screenshots of all your unselected courses. please check`);

    for (const tr of courseRows) {
        saveScrenShot(await tr.screenshot());
    }
    for (const tr of courseRows) {
        // await delay(150); // just ensure that the table loads properly after accepted dialog

        const tds = await tr.$$('td');
        saveScrenShot(await tds[0].screenshot());
    }


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