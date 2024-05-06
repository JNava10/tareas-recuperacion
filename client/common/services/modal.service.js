// Basado en la documentación de Bulma: https://bulma.io/documentation/components/modal/#javascript-implementation-example

import {createElementString} from "./common.service.js";

export const openModalById = elementId => {
    const element = document.querySelector(`#${elementId}`);
    element.classList.add('is-active');
};

export const closeModalById = elementId => {
    const element = document.querySelector(`#${elementId}`);
    element.classList.remove('is-active');
};

export const openModal = element => {
    element.classList.add('is-active');
};

export const closeModal = element => {
    element.classList.remove('is-active');
};

export const createModal = bodyHtml => {
    const modalHtml = `<div id="task-modal" class="modal">
          <div class="modal-background"></div>
          <div class="modal-content">
            <div class="box">
            ${bodyHtml}
            </div>
          </div>
          <button class="modal-close is-large" aria-label="close"></button>
        </div>`;


    const modalElement = createElementString(modalHtml);

    document.body.append(modalElement);

    return modalElement
};



