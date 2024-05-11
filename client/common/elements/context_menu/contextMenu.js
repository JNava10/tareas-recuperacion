/**
 * @type {HTMLElement}
 */
let current;
export let isShowing = false;

export const open = (element, event) => {
    current = element;

    current.classList.add('context-menu')
    current.style.left = `${event.clientX}px`;
    current.style.top = `${event.clientY}px`;

    document.onclick = (event) => {
        element.remove();
    }

    document.body.append(current);
    isShowing = true;
}

export const close = () => {
    current.remove();
}