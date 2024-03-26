import {colors} from "../consts.js";

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

    alert.innerHTML = `<div class="notification is-danger is-light">${text}</div>`;

    document.body.append(alert.firstChild);

    const alertInserted = document.querySelector(`.${alertClass}`);

    setTimeout(() => alertInserted.remove(), alertLifeSecs * 1000);
}