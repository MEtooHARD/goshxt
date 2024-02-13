interface pwd_id {
    id: string
    pwd: string
}
const pwd_id_ready = ({ id, pwd }: pwd_id) => {
    return (Boolean(pwd.length) && Boolean(id.length))
}

export {
    pwd_id_ready
}