import {colors, emailRegex, passwordRegex} from "../common/consts.js";
import * as authService from "../common/api/auth.api.js";
import * as msgService from "../common/services/message.service.js";
import * as storageService from "../common/services/storage.service.js";
import {redirectTo} from "../common/services/common.service.js";
import {showAlert} from "../common/services/message.service.js";

const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');
const loginBtn = document.querySelector('#login-btn');
const loginForm = document.querySelector('form');

const handleLogin = async (event) => {
    event.preventDefault();
    const emailValid = emailRegex.test(emailInput.value);
    const passwordValid = passwordRegex.test(passwordInput.value);

    if (!emailValid)  {
        showAlert('El email introducido no es valido', colors.danger)
        return
    } else if (!passwordValid) {
        showAlert('La contraseña introducida no es valida', colors.danger)
        return
    }

    const emailValue = emailInput.value;

    const {data, message} = await authService.login(emailValue, passwordInput.value)

    if (!data.logged) {
        msgService.showAlert('Credenciales invalidas, intentalo de nuevo.',  colors.danger)
    }

    if (data.token) {
        msgService.setInputSuccess(emailInput)
        msgService.setInputSuccess(passwordInput)

        storageService.addCookie('token', data.token);
        document.cookie = ""
        storageService.deleteCookie('token');

        redirectTo('');
    }
};

loginForm.addEventListener('submit', (event) => event.preventDefault())
loginBtn.addEventListener('click', handleLogin)

