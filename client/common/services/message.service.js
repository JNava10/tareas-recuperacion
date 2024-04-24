import {colors} from "../consts.js";
import {createElementString} from "./common.service.js";

const alertClass = 'notification';

export const setInputSuccess = (input, message = '') => {
    // Seleccionamos la etiqueta asociada al input introducido, para cambiar su estilo.
    const label = document.querySelector(`label[for=${input.id}]`);

    if (label) {
        label.classList.add('has-text-success');
    }

    input.classList.add('has-text-success');
}

/**
 *
 * @param text {string}
 * @param style {string}
 */
export const showAlert = (text, style = colors.success) => {
    const alertLifeSecs = 3; // Segundos que durará en pantalla el alert.
    let alertExists = document.querySelector(`.${alertClass}`) !== null;

    if (alertExists) return

    const alert = document.createElement('div');

    alert.innerHTML = `<div style="z-index: 9999" class="container notification ${style} is-light">${text}</div>`;

    document.body.append(alert.firstChild);

    const alertInserted = document.querySelector(`.${alertClass}`);

    setTimeout(() => alertInserted.remove(), alertLifeSecs * 1000);
}

/** Cambia el tipo de un campo de formulario, segun se le indique (peligro, exito...)
 *
 * @param {HTMLInputElement} input
 * @param {string} message
 * @param {string<colors>} type
 */
export const createControlHelp = (input, message, type) => {
    // Esto comprueba si el siguiente elemento despues del <input> es un <span>.
    if (input.nextElementSibling) return;

    if (!input.parentElement.classList.contains('control')) {
        console.error('Not valid parent class. Parent must be control.')
    }

    const helpElement = createElementString(`<span class="help ${type}">${message}</span>`);
    input.after(helpElement);

    input.classList.add(type)
}

/** Cambia el tipo de un control de formulario a tipo vacío.
 *
 * @param {HTMLInputElement} input
 */
export const resetControl = (input) => {
    const nextElement = input.nextElementSibling;
    if (!nextElement) return;

    if (nextElement.tagName === 'SPAN') nextElement.remove();

    // Sacamos un array con todas las clases del input para buscar.
    const inputClasses = Array.from(input.classList);

    const type = inputClasses.find(className => className.startsWith('is-'));
    input.classList.remove(type);
}