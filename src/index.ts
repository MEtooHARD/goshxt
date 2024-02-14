import { MODE } from "./config";

const id = '411221308'; //your id
const pwd = '940Chiu301'; //your password
const closeWhenEnd = false; //whether to close the browser after shxt.
const showViewPort = true; //whether to show the browser that you can see how it's going

//  select the mode below
//  SHXT: "rob" the courses
//  MINE: repeatedly check & try to fill the f'ckn'g p'ssy

//  please fill in the courses you need when using MINE mode
const course_ids = ['YY__1010AB', 'GC__6232AL', 'PHYS1020AH', 'CSIE1090AA', 'PHYS1030AD'];

require(`./${MODE["MINE"]}`)({
    id: id,
    pwd: pwd,
    closeWhenEnd: closeWhenEnd,
    showViewPort: showViewPort,
    course_ids: course_ids
});

