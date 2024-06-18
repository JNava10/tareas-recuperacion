import {Fetch} from "./fetch.js";
import {getUserId} from "../services/common.service.js";

export const assignToAffine = async (id) => {
    const userId = getUserId()
    return await Fetch.post(`task/affine/${id}/${userId}`, null, true);
};

export const releaseTask = async (id) => {
    return await Fetch.post(`task/release/${id}`, null, true);
};

export const getAvailableTasks = async () => {
    return await Fetch.get(`task/available`, [], true);
};

export const unassignTask = async (id) => {
    return await Fetch.post(`task/unassign/${id}`, null, true);
};

export const assignTask = async (taskId, userToAssign) => {
    const clientUserId = getUserId();

    return await Fetch.post(`task/assign/${taskId}`, {assignTo: userToAssign, assignedBy: clientUserId}, true)
}

export const createTask = async (createdTask) => {
    return await Fetch.post('task', createdTask, true);
};


export const editTask = async (editedTask, id) => {
    return await Fetch.put('task', editedTask, [id], true);
};

export const changeTaskProgress = async (taskId, progress) => {
    return await Fetch.put('task/progress', {progress}, [taskId], true);
};

export const getAllTasks = async () => {
    return await Fetch.get('task', [], true);
};

export const getAllTasksWithAssignedTo = async () => {
    return await Fetch.get('task/with-assigned-to', [], true);
};


export const getAllDifficulties = async () => {
    return await Fetch.get('task/difficulties', [], true);
};

export const removeTask = async (id) => {
    return await Fetch.delete('task', [], [id],true);
};

export const getAssignedTasks = async (userId) => {
    return await Fetch.get('task/assigned', [userId],true);
};

export const getRealizedTasks = async (userId) => {
    return await Fetch.get('task/realized', [userId],true);
};