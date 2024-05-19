import * as taskApi from "../common/api/task.api.js";
import {getAllTasks, getAllTasksWithAssignedBy} from "../common/api/task.api.js";
import {getAssignedTaskCard, getUnassignedTaskCard} from "../common/elements/tasks.elements.js";

let tasks = [];
const taskList = document.querySelector('#taskList');

onload = async () => {

    await showAllTasks();

    const {difficulties} = await taskApi.getAllDifficulties();
}

async function showAllTasks() {
    if (tasks.length > 0) {
        taskList.innerHTML = "";
        tasks = [];
    }

    const data = await getAllTasksWithAssignedBy();

    tasks = data.tasks;

    data.tasks.forEach(task => {
        let taskElement;

        if (!task.assigned_by) taskElement = getUnassignedTaskCard(task).element;
        else taskElement = getAssignedTaskCard(task).element;

        tasks.push(task);

        taskList.append(taskElement);
    });
}