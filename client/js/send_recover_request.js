import {colors, emailRegex, passwordRegex} from "../common/consts.js";
import * as authService from "../common/api/auth.api.js";
import * as msgService from "../common/services/message.service.js";
import * as storageService from "../common/services/storage.service.js";
import {redirectTo, wait} from "../common/services/common.service.js";
import {showAlert} from "../common/services/message.service.js";
import {regex} from "../common/regex.js";

const emailInput = document.querySelector('input[type="email"]');
const sendEmailBtn = document.querySelector('#send-email-btn');
const codeInput = document.querySelector('#code-input');
const sendCodeBtn = document.querySelector('#send-code-btn');
const emailForm = document.querySelector('#email-form');
const codeForm = document.querySelector('#code-form');

const handleEmailSubmit = async (event) => {
    event.preventDefault();
    const emailValid = emailRegex.test(emailInput.value);

    if (!emailValid)  {
        showAlert('El email introducido no es valido', colors.danger);
        return
    }

    const emailValue = emailInput.value;
    const data = await authService.sendRecoverRequest(emailValue);

    if (!data.executed) {
        msgService.showAlert('Email invalido, intentalo de nuevo.',  colors.danger);
        return;
    }

    const success = data.executed === true;

    if (success) {
        msgService.showAlert(data.message,  colors.success);
        sendCodeBtn.disabled = false;
        codeInput.disabled = false;
    }
};

const handeCodeSubmit = async (event) => {
    event.preventDefault();

    const codeValid = regex.recoverCode.test(codeInput.value);

    if (!codeValid)  {
        showAlert('El email introducido no es valido', colors.danger);
        return;
    }

    const emailValue = emailInput.value;
    const codeValue = codeInput.value;

    const data = await authService.sendRecoverCode(emailValue, codeValue);

    if (!data.executed) {
        msgService.showAlert(data.message,  colors.danger);
        return;
    }

    const success = data.executed === true;

    if (success) {
        msgService.showAlert(data.message,  colors.success);

        storageService.add('recover_key', data.key);
        storageService.add('recover_email', emailValue);

        redirectTo('login/send_password');
    }
}

emailForm.addEventListener('submit', (event) => event.preventDefault());
codeForm.addEventListener('submit', (event) => event.preventDefault());

sendEmailBtn.addEventListener('click', handleEmailSubmit);
sendCodeBtn.addEventListener('click', handeCodeSubmit);

