import {Fetch} from "./fetch.js";

export const getAllUsers = async () => {
    return await Fetch.get('user', [], false);
};