
const alertClass = 'notification';

export const setInputSuccess = (input, message = '') => {
    // Seleccionamos la etiqueta asociada al input introducido, para cambiar su estilo.
    const label = document.querySelector(`label[for=${input.id}]`);

    if (label) {
        label.className += 'has-text-success';
    }

    input.className += 'is-success'

    if (message.length > 0) {
        const foot = document.createElement('p');
        foot.innerHTML = `<p class="mt-2 text-sm text-red-600 dark:text-red-500">${message}</p>`;

        input.after(foot);
    }
}

/**
 *
 * @param text {string}
 * @param style {string}
 */
export const showAlert = (text, style) => {
    const alertLifeSecs = 3; // Segundos que durará en pantalla el alert.
    let alertExists = document.querySelector(`.${alertClass}`) !== null;

    if (alertExists) return

    const alert = document.createElement('div');

    alert.innerHTML = `<div class="notification is-danger is-light">${text}</div>`;

    document.body.append(alert.firstChild);

    const alertInserted = document.querySelector(`.${alertClass}`);

    setTimeout(() => alertInserted.remove(), alertLifeSecs * 1000);
}