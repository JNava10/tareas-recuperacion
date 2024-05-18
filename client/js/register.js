import {regex} from "../common/regex.js";
import {showAlert} from "../common/services/message.service.js";

// Elementos del DOM
const submitBtn = document.querySelector('button[type=submit]');
const registerForm = document.querySelector('#registerForm');
const validIconHtml = `<i class="fa-solid fa-check"></i>`;
const invalidIconHtml = `<i class="fa-solid fa-ban"></i>`;

// Eventos
submitBtn.onclick = (event) => submitRegister(event)

const submitRegister = (event) => {
    event.preventDefault();

    const fields = document.querySelectorAll('.field');

    const fieldsValid = validateFields(fields);

    if (!fieldsValid) {
        showAlert('Comprueba de nuevo los campos introducidos.');
        return;
    }
};

const validateFields = (fields) => {
    const validations = [];

    fields.forEach(field => {
        const regex = formRegex[field.id];

        const isValid = regex.test(field.value);
        const validationElement = document.querySelector(`.validation[for=${field.id}]`);
        const iconHtml = isValid ? validIconHtml : invalidIconHtml;

        validations.push(isValid);
    });

    return validations.every(validation => validation === true);
};

const formRegex = {
    email: regex.email,
    password: regex.password,
    confirmPassword: regex.password,
    name: regex.commonTextField,
    firstLastname: regex.commonTextField,
    secondLastname: regex.commonTextField
}
