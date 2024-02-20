import config from '../config.json';
const closeWhenEnd = false; //whether to close the browser after shxt.
const showViewPort = true; //whether to show the browser that you can see how it's going

require(`./shxt`)({
    id: config.student_id,
    pwd: config.password,
    manual: config.manual,
    closeWhenEnd: closeWhenEnd,
    showViewPort: showViewPort,
});

