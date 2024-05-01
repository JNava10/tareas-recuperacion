import {Fetch} from "./fetch.js";
import {EditedUser} from "../class/user/req/editedUser.js";
import {PasswordEdited} from "../class/user/req/passwordEdited.js";


export const getAllUsers = async () => {
    return await Fetch.get('user', [], false);
};

/**
 *
 * @param {EditedUser} editedUser
 * @returns {Promise<boolean|null|*>}
 */
export const editUser = async (editedUser) => {
    return await Fetch.put('user/data', editedUser, [],  false);
};

/**
 *
 * @param {PasswordEdited} passwordEdited
 * @returns {Promise<boolean|*|undefined>}
 */
export const editUserPassword = async (passwordEdited) => {
    return await Fetch.put('user/password', passwordEdited, [],  false);
};

export const deleteUser = async (userId) => {
    return await Fetch.delete('user/', null, [userId],  false);
};

export const restoreUser = async (userId) => {
    return await Fetch.post('user/restore', {id: userId},  false);
};

export const createUser = async (user) => {
    return await Fetch.post('user', user,  false);
};