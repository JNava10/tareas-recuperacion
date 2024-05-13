import {Fetch} from "./fetch.js";
import {EditedUser} from "../class/user/req/editedUser.js";
import {PasswordEdited} from "../class/user/req/passwordEdited.js";
import {getUserId} from "../services/common.service.js";

export const editUserRoles = async (user) => {
    const {id, roles} = user;
    return await Fetch.put('user/roles', {roles},[id], false);
};

export const getSelfRoles = async () => {
    const userId = getUserId();

    return await Fetch.get('user/roles', [userId], false);
};

export const getAllUsers = async () => {
    return await Fetch.get('user', [], false);
};

export const getSelfData = async () => {
    const userId = getUserId();
    return await Fetch.get('user/', [userId], false);
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

export const searchUsers = async (searchInput) => {
    return await Fetch.get('user', [searchInput],  false);
};