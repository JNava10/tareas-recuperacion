import {Fetch} from "./fetch.js";
import {EditedUser} from "../class/user/editedUser.js";
import {PasswordEdited} from "../class/user/passwordEdited.js";


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