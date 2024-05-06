import {Fetch} from "./fetch.js";
import {EditedUser} from "../class/user/req/editedUser.js";
import {PasswordEdited} from "../class/user/req/passwordEdited.js";

export const editTask = async (editedTask, id) => {
    return await Fetch.put('task', editedTask, [id], false);
};

export const getAllTasks = async () => {
    return await Fetch.get('task', [], false);
};

export const removeTask = async (id) => {
    return await Fetch.delete('task', [], [id],false);
};