import config from '../config.json';
const closeWhenEnd = false; //whether to close the browser after shxt.
const showViewPort = true; //whether to show the browser that you can see how it's going

//  select the mode below
//  SHXT: "rob" the courses
//  MINE: repeatedly check & try to fill the f'ckn'g p'ssy

//  please fill in the courses you need when using MINE mode
const course_ids: string[] = [];

require(`./mine`)({
    id: config.student_id,
    pwd: config.password,
    closeWhenEnd: closeWhenEnd,
    showViewPort: showViewPort,
    course_ids: course_ids
});

