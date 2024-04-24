// Basado en la documentación de Bulma: https://bulma.io/documentation/components/modal/#javascript-implementation-example

export const openModal = elementId => {
    const element = document.querySelector(`#${elementId}`);
    element.classList.add('is-active');
};

export const closeModal = elementId => {
    const element = document.querySelector(`#${elementId}`);
    element.classList.remove('is-active');
};

