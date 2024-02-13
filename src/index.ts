import { MODE } from "./config";

const id = '411221308'; //your id
const pwd = '940Chiu301'; //your password
const closeWhenEnd = false; //whether to close the browser after shxt.
const showViewPort = true; //whether to show the browser that you can see how it's going

//  select the mode below
//  SHXT: "rob" the courses
//  MINE: repeatedly check & try to fill the f'ckn'g p'ssy
require(`./${MODE["MINE"]}`)({
    id: id,
    pwd: pwd,
    closeWhenEnd: closeWhenEnd,
    showViewPort: showViewPort
});

