import config from '../config.json';

require(`./shxt`)({
    id: config.student_id,
    pwd: config.password,
    manual: config.manual,
    showViewPort: config.showViewPort,
});
