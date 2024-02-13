import fs from 'node:fs';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let num = 0;

const saveScrenShot = (data: string | NodeJS.ArrayBufferView) => {
    fs.writeFileSync(`scs${num}.png`, data);
    num++;
}

export {
    delay,
    saveScrenShot
}