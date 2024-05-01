export const regex = {
    email: /[A-Za-z0-9]{4,25}@[A-Za-z]{3,10}.[A-Za-z]{2,7}$/,
    password: /[\w!"·$%&\/(\\)=?*¿+\-`<>.:,;|@#~½¬{\[\]}ªº]{3,20}/m,
    confirmPassword: /[\w!"·$%&\/(\\)=?*¿+\-`<>.:,;|@#~½¬{\[\]}ªº]{3,20}/m,
    name: /[A-Za-z]{1,15}/,
    first_lastname: /[A-Za-z]{1,15}/,
    second_lastname: /[A-Za-z]{1,15}/,
    recoverCode: /[0-9]{6}$/
}