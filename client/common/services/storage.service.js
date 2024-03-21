export const add = (key, value) => {
    localStorage.setItem(key, value);
}

export const get = (key)  => {
    return JSON.parse(localStorage.getItem(key))
}

export const remove = (key)  => {
    return localStorage.removeItem(key)
}

export const addCookie = (key, value) => {
    const cookieExists = document.cookie.split(';').find(
        cookie => cookie.includes(key)
    ) !== null

    if (!cookieExists) {
        document.cookie += `${key}=${value};`
        return;
    }

    deleteCookie(key)
    document.cookie += `${key}=${value};`
}

export const getCookie = (key) => {
    const allCookies = document.cookie;
    const cookie = allCookies.split(';').find(
        cookie => cookie.includes(key)
    ) // Las cookies realmente son un string separados por ';'. Es mas sencillo buscar con un array.

    return cookie.split('=')[1] // Separamos la clave y el valor para devolver el valor.
}

export const deleteCookie = (key) => {
    const allCookies = document.cookie;
    const cookieArray = allCookies.split(';')

    const cookiesAlive = cookieArray.filter((cookie) => cookie.split('=')[1] !== key);

    document.cookie = cookiesAlive.join(";");
}