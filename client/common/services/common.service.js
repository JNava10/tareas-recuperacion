
export const redirectTo = (path) => {
    const serverRoot = window.location.host;
    window.location.href = `http://${serverRoot}/public/${path}`;
}

export const wait = (milisecs) => {
    setTimeout(() => {}, milisecs);
}