import * as storageService from "./storage.service.js";

export const redirectTo = (path) => {
    const serverRoot = window.location.host;
    window.location.href = `http://${serverRoot}/public/${path}`;
}

export const wait = (milisecs) => {
    setTimeout(() => {}, milisecs);
}

// Podemos usar esta funcion para crear elementos HTML de forma mas visual y rapida.
/**
 *
 * @returns {HTMLElement}
 */
export const createElementFromString = (html) => {
    let temp = document.createElement('div');

    temp.innerHTML = html;
    temp = temp.firstElementChild;

    return temp;
}

export const capitalize = (string) => {
    return `${string[0].toUpperCase()}${string.slice(1)}`
}

export const getUserId = () => {
    return Number(storageService.get('id'));
}