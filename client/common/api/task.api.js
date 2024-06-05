import {Fetch} from "./fetch.js";
import {EditedUser} from "../class/user/req/editedUser.js";
import {PasswordEdited} from "../class/user/req/passwordEdited.js";
import {getUserId} from "../services/common.service.js";

export const releaseTask = async (id) => {
    return await Fetch.post(`task/release/${id}`, null, false);
};


export const getAvailableTasks = async () => {
    return await Fetch.get(`task/available`, [], false);
};

export const unassignTask = async (id) => {
    return await Fetch.post(`task/unassign/${id}`, null, false);
};

export const assignTask = async (taskId, userToAssign) => {
    const clientUserId = getUserId();

    return await Fetch.post(`task/assign/${taskId}`, {assignTo: userToAssign, assignedBy: clientUserId}, false);
};


export const createTask = async (createdTask) => {
    return await Fetch.post('task', createdTask, false);
};


export const editTask = async (editedTask, id) => {
    return await Fetch.put('task', editedTask, [id], false);
};

export const changeTaskProgress = async (taskId, progress) => {
    return await Fetch.put('task/progress', {progress}, [taskId], false);
};

export const getAllTasks = async () => {
    return await Fetch.get('task', [], false);
};

export const getAllTasksWithAssignedTo = async () => {
    return await Fetch.get('task/with-assigned-to', [], false);
};


export const getAllDifficulties = async () => {
    return await Fetch.get('task/difficulties', [], false);
};

export const removeTask = async (id) => {
    return await Fetch.delete('task', [], [id],false);
};

export const getAssignedTasks = async (userId) => {
    return await Fetch.get('task/assigned', [userId],false);
};

export const getRealizedTasks = async (userId) => {
    return await Fetch.get('task/realized', [userId],false);
};