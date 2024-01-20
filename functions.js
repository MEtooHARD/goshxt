const fs = require('node:fs');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let num = 0;

const saveScrenShot = (data) => {
    fs.writeFileSync(`scs${num}.png`, data);
    num++;
}

module.exports = {
    delay,
    saveScrenShot
}