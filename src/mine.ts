import chalk from 'chalk';
import puppeteer, { ElementHandle, Page } from 'puppeteer';
import { delay } from './functions/misc';
import { pwd_id_ready } from './functions/prepare';
import { ModeOptions } from './config';

module.exports = async ({ id = '', pwd = '', showViewPort = true, closeWhenEnd = false, course_ids = [] }: ModeOptions) => {
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

    if (!course_ids.length) {
        console.log('course_ids not provided. search from re-schedule list.')
        let course_names: string[] = [];
        if (!(switchBTN instanceof ElementHandle)) {
            console.log(chalk.red('The PASSWORD or ID you provided is wrong.'));
            process.exit(1);
        } else {
            await (switchBTN as ElementHandle<Element>).click();
            await delay(500);
            const pre_selects_trs = await page.$$('#ContentPlaceHolder1_grd_subjs > tbody > tr');
            pre_selects_trs.shift();
            course_ids = course_ids.concat(await get_dedicated_td_string(pre_selects_trs, page, 1));
            course_names = course_names.concat(await get_dedicated_td_string(pre_selects_trs, page, 2));
        }
        console.log('找到預排課程: \n\t' + course_ids.map((x, i) => x.concat('\t' + course_names[i])).join('\n\t'));
    }

    //  下半部分 i.e. 未選入之課程
    const selectable = await page.$('.courses > tbody > tr > .selectable');
    if (!selectable) process.exit(1);

    //  search and have some lovin'
    for (const ID of (course_ids as string[])) {
        console.log('doing for ' + ID);
        //  查詢開放課程
        const searchOpenedCourse = await selectable.$('#ContentPlaceHolder1_Button3');
        await (searchOpenedCourse as ElementHandle).click();
        //  type in course id
        const courseID_input = await selectable.$('#ContentPlaceHolder1_ed_sno');
        await (courseID_input as ElementHandle).click({ clickCount: 3 });
        await (courseID_input as ElementHandle).press('Backspace');
        await (courseID_input as ElementHandle).type(ID);
        //  check!
        const submit = await selectable.$('#ContentPlaceHolder1_btn_ok');
        await (submit as ElementHandle).click();

        await delay(100);
        const coursetable = await page.$$('#ContentPlaceHolder1_UpdatePanel2 > .gridDiv > div > #ContentPlaceHolder1_grd_subjs > tbody > tr');
        coursetable.shift();
        if (!coursetable.length) {
            await delay(500);
            const coursetable = await page.$$('#ContentPlaceHolder1_UpdatePanel2 > .gridDiv > div > #ContentPlaceHolder1_grd_subjs > tbody > tr');
            coursetable.shift();
        }
        console.log('search result got: ' + chalk.yellow(coursetable.length) + ' option');


        //  check quota and sign the course


        // await delay(1000);
    }


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

async function get_dedicated_td_string(courses: ElementHandle<HTMLTableRowElement>[], page: Page, index: number) {
    let result: string[] = [];
    for (const selection of courses) {
        const tds = await selection.$$('td');
        result.push((await page.evaluate(el => el.textContent, tds[index])) as string);
    }
    return result;
}
async function searchCourse(id: string) {
    
}