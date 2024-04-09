export const regex = {
    email: /[A-Za-z0-9]{4,25}@[A-Za-z]{3,10}.[A-Za-z]{2,7}$/,
    password: /[\w!"·$%&\/(\\)=?*¿+\-`<>.:,;|@#~½¬{\[\]}ªº]{3,20}/m,
    userName: /[A-Za-z]{3,12}/,
    recoverCode: /[0-9]{6}$/
}