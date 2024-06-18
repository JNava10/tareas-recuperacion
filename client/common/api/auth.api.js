import {Fetch} from "./fetch.js";

export const sendPassword = async (passwordValue, key, email) => {
    const body = {password: passwordValue, key: key, email: email}
    console.log(body)
    return await Fetch.post('auth/change_password', body, false);
};

export const sendRecoverCode = async (email, code) => {
    const body = {email, code}
    return await Fetch.post('auth/check_recover_code', body, false);
};

export const sendRecoverRequest = async (email) => {
    const body = {email}
    return await Fetch.post('auth/gen_recover_code', body, false);
};


export const login = async (email, password) => {
    const body = {email, password}
    return await Fetch.post('auth/login', body, false);
}


export const logout = async () => {
    return await Fetch.post('auth/logout', {}, true);
}
