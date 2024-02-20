enum MODE { SHXT = "shxt", MINE = "mine" };

interface ModeOptions {
    id: string,
    pwd: string,
    closeWhenEnd: boolean,
    showViewPort: boolean,
    course_ids?: string[]
}

export {
    MODE,
    ModeOptions
}