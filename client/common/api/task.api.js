import {Fetch} from "./fetch.js";
import {EditedUser} from "../class/user/req/editedUser.js";
import {PasswordEdited} from "../class/user/req/passwordEdited.js";

export const unassignTask = async (id) => {
    return await Fetch.post(`task/unassign/${id}`, null, false);
};


export const assignTask = async (taskId, userId) => {
    return await Fetch.post(`task/assign/${taskId}`, {userId}, false);
};


export const createTask = async (createdTask) => {
    return await Fetch.post('task', createdTask, false);
};


export const editTask = async (editedTask, id) => {
    return await Fetch.put('task', editedTask, [id], false);
};

export const getAllTasks = async () => {
    return await Fetch.get('task', [], false);
};

export const getAllDifficulties = async () => {
    return await Fetch.get('task/difficulties', [], false);
};

export const removeTask = async (id) => {
    return await Fetch.delete('task', [], [id],false);
};