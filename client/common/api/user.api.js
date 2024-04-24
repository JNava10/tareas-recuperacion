import {Fetch} from "./fetch.js";
import {EditedUser} from "../class/user/editedUser.js";

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