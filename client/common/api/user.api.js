import {Fetch} from "./fetch.js";
import {EditedUser} from "../class/user/req/editedUser.js";
import {PasswordEdited} from "../class/user/req/passwordEdited.js";
import {getUserId} from "../services/common.service.js";

export const editUserRoles = async (user) => {
    const {id, roles} = user;
    return await Fetch.put('user/roles', {roles},[id], true);
};

export const getSelfRoles = async () => {
    const userId = getUserId();

    return await Fetch.get('user/roles', [userId], true);
};

export const getAllUsers = async () => {
    return await Fetch.get('user', [], true);
};

export const getSelfData = async () => {
    const userId = getUserId();
    return await Fetch.get('user/', [userId], true);
};

/**
 *
 * @param {EditedUser} editedUser
 * @returns {Promise<boolean|null|*>}
 */
export const editUser = async (editedUser) => {
    return await Fetch.put('user/data', editedUser, [],  true);
};

/**
 *
 * @param {PasswordEdited} passwordEdited
 * @returns {Promise<boolean|*|undefined>}
 */
export const editUserPassword = async (passwordEdited) => {
    return await Fetch.put('user/password', passwordEdited, [],  true);
};

export const deleteUser = async (userId) => {
    return await Fetch.delete('user/', null, [userId],  true);
};

export const restoreUser = async (userId) => {
    return await Fetch.post('user/restore', {id: userId},  true);
};

export const createUser = async (user) => {
    return await Fetch.post('user', user,  true);
};

export const searchUsers = async (searchInput) => {
    return await Fetch.get('user', [searchInput],  true);
};

export const changeProfilePic = async (file) => {
    const userId = getUserId();
    const formData = new FormData();

    formData.append('image', file);

    console.log(formData.get('image'))

    return await Fetch.postFormData(`user/profile_pic/${userId}`, formData, true);
};

export const registerUser = async (user) => {
    return await Fetch.post('user/register', user,  true);
};
