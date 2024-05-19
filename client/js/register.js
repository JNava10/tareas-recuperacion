import {regex} from "../common/regex.js";
import {showAlert} from "../common/services/message.service.js";
import {createElementFromString} from "../common/services/common.service.js";
import * as userApi from "../common/api/user.api.js";
import {colors} from "../common/consts.js";

// Elementos del DOM
const validIconHtml = `<i class="fa-solid fa-check"></i>`;
const invalidIconHtml = `<i class="fa-solid fa-ban"></i>`;

const submitBtn = document.querySelector('button[type=submit]');

// Eventos
submitBtn.onclick = (event) => submitRegister(event)

const submitRegister = async (event) => {
    event.preventDefault();

    const fields = document.querySelectorAll('.field');

    setInputListeners(fields)

    const fieldsValid = validateFields(fields);

    if (!fieldsValid) {
        showAlert('Comprueba de nuevo los campos introducidos.');
        return;
    }

    const user = createUserFromFields(fields);

    const {message, data} = await userApi.registerUser(user);

    const alertColor = data.executed ? colors.success : colors.danger;

    showAlert(message, alertColor);
};
const validateFields = (fields) => {
    const validations = [];

    fields.forEach(field => {
        const regex = formRegex[field.id];
        let isValid = regex.test(field.value);

        if (field.id === 'confirmPassword') {

            const passwordsValid = validatePasswords()
            isValid = isValid && passwordsValid;
        }

        const validationElement = document.querySelector(`.validation[for=${field.id}]`);

        if (!validationElement) return;

        validationElement.innerHTML = '';

        const iconHtml = isValid ? validIconHtml : invalidIconHtml;
        const iconElement = createElementFromString(iconHtml);

        validationElement.append(iconElement);

        validations.push(isValid);
    });

    return validations.every(validation => validation === true);
};
const setInputListeners = (fields) => {
    fields.forEach(field => {
        field.oninput = (event) => {
            hideValidationIcon(event.target);
        }
    });
};
const hideValidationIcon = (field) => {
    const validationElement = document.querySelector(`.validation[for=${field.id}]`);

    validationElement.innerHTML = "";
};

const createUserFromFields = (fields) => {
    const user = {};

    fields.forEach(field => {
        const isIgnore = field.getAttribute('ignore') !== null;

        if (!isIgnore) user[field.id] = field.value;
    })

    return user;
};

const validatePasswords = () => {
    const passwordField = document.querySelector('#password');
    const confirmPasswordField = document.querySelector('#confirmPassword');

    return passwordField.value === confirmPasswordField.value;
};

const formRegex = {
    email: regex.email,
    password: regex.password,
    confirmPassword: regex.password,
    name: regex.commonTextField,
    firstLastname: regex.commonTextField,
    secondLastname: regex.commonTextField
}
