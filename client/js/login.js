import {colors, emailRegex, passwordRegex} from "../common/consts.js";
import * as authService from "../common/api/auth.api.js";
import * as msgService from "../common/services/message.service.js";
import * as storageService from "../common/services/storage.service.js";
import {redirectTo} from "../common/services/common.service";

const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');
const loginBtn = document.querySelector('#login-btn');
const loginForm = document.querySelector('form');

const handleLogin = async (event) => {
    event.preventDefault();
    const emailValid = emailRegex.test(emailInput.value);
    const passwordValid = passwordRegex.test(passwordInput.value);

    if (!emailValid || !passwordValid) {
        console.log(`Email: ${emailValid}, pass: ${passwordValid}`);
        // TODO: Invalid alert.
        return;
    }

    const emailValue = emailInput.value;

    const data = await authService.login(emailValue, passwordInput.value)

    if (!data.logged) {
        msgService.showAlert('Credenciales invalidas, intentalo de nuevo.',  colors.danger)
    }

    if (data.token) {
        msgService.setInputSuccess(emailInput)
        msgService.setInputSuccess(passwordInput)

        storageService.addCookie('token', data.token);

        redirectTo('public/main')
    }
};

loginForm.addEventListener('submit', (event) => event.preventDefault())
loginBtn.addEventListener('click', handleLogin)

