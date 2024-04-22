
export const redirectTo = (path) => {
    const serverRoot = window.location.host;
    window.location.href = `http://${serverRoot}/public/${path}`;
}

export const wait = (milisecs) => {
    setTimeout(() => {}, milisecs);
}

// Podemos usar esta funcion para crear elementos HTML de forma mas visual y rapida.
export const createElementString = (html) => {
    let temp = document.createElement('div');

    temp.innerHTML = html;
    temp = temp.firstChild;

    return temp;
}