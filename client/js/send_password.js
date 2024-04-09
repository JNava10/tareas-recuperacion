import {colors, emailRegex, passwordRegex} from "../common/consts.js";
import * as authService from "../common/api/auth.api.js";
import * as msgService from "../common/services/message.service.js";
import * as storageService from "../common/services/storage.service.js";
import {redirectTo, wait} from "../common/services/common.service.js";
import {showAlert} from "../common/services/message.service.js";
import {regex} from "../common/regex.js";

const showPasswordsBtn = document.querySelector('#showPasswords');
const passwordsForm = document.querySelector('form');
const passwordInput = document.querySelector('#password');
const confirmPasswordInput = document.querySelector('#confirmPassword');
const sendPasswordBtn = document.querySelector('#send-password-btn');

const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    const passwordValue = passwordInput.value;
    const confirmPasswordValue = confirmPasswordInput.value;

    const passwordValid = regex.password.test(passwordValue);
    const confirmPasswordValid = regex.password.test(confirmPasswordValue);

    if (!passwordValid || !confirmPasswordValid)  {
        showAlert('La contraseñas introducidas no son validas', colors.danger);
        return;
    }

    if (passwordValue !== confirmPasswordValue) {
        showAlert('La contraseñas introducidas no coinciden.', colors.danger);
        return;
    }

    const key = storageService.get('recover_key');
    const email = storageService.get('recover_email');
    const data = await authService.sendPassword(passwordValue, key, email);

    if (!data.executed) {
        msgService.showAlert('Email invalido, intentalo de nuevo.',  colors.danger);
        return;
    }

    const success = data.executed === true;

    if (success) {
        msgService.showAlert(data.message,  colors.success);
    }
};

const switchPasswords = (event) => {
    console.log(event.target.checked)
    passwordInput.type = event.target.checked ? 'text' : 'password';
    confirmPasswordInput.type = event.target.checked ? 'text' : 'password';
};

sendPasswordBtn.addEventListener('click', handlePasswordSubmit);
passwordsForm.addEventListener('submit', (event) => event.preventDefault());

showPasswordsBtn.addEventListener('click', switchPasswords);



