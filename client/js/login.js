import {emailRegex, passwordRegex} from "../common/consts.js";
import * as authService from "../common/services/auth.service.js";

const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');
const loginBtn = document.querySelector('.login-btn');
const loginForm = document.querySelector('form');

console.log('a')

const handleLogin = async (event) => {
    const emailValid = emailRegex.test(emailInput.value);
    const passwordValid = passwordRegex.test(passwordInput.value);

    if (!emailValid || !passwordValid) {
        console.log(`Email: ${emailValid}, pass: ${passwordValid}`);
        // TODO: Invalid alert.
        console.log('invalido.')
        return;
    }

    const emailValue = emailInput.value;

    const logged = await authService.login(emailValue, passwordInput.value)

    console.log(logged);
};

loginForm.addEventListener('submit', (event) => event.preventDefault())
loginBtn.addEventListener('click', handleLogin)

