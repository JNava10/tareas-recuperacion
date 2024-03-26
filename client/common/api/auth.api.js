import {Fetch} from "./fetch.js";

export const login = async (email, password) => {
    const body = {email, password}
    return await Fetch.post('auth/login', body, false);
}

