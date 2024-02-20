import fs from 'node:fs';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let num = 0;

const saveScrenShot = (data: string | NodeJS.ArrayBufferView) => {
    fs.writeFileSync(`scs${num}.png`, data);
    num++;
}

interface pwd_id {
    id: string
    pwd: string
}
const pwd_id_ready = ({ id, pwd }: pwd_id) => {
    return (Boolean(pwd.length) && Boolean(id.length))
}

export {
    delay,
    saveScrenShot,
    pwd_id_ready
}