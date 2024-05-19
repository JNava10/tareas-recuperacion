import * as taskApi from "../common/api/task.api.js";
import {getAllTasks, getAllTasksWithAssignedBy} from "../common/api/task.api.js";
import {getAssignedTaskCard, getUnassignedTaskCard} from "../common/elements/tasks.elements.js";

const taskList = document.querySelector('#taskList');
const showOnlyAssignedToggle = document.querySelector('#showOnlyAssigned');

let tasks = [];
let showingTasks = [];

onload = async () => {

    await showAllTasks();

    const {difficulties} = await taskApi.getAllDifficulties();
}

const clearTasks = () => {
    taskList.innerHTML = "";
    tasks = [];
};

function showTasks() {
    showingTasks.forEach(task => {
        let taskElement;

        if (!task.assigned_by) taskElement = getUnassignedTaskCard(task).element;
        else taskElement = getAssignedTaskCard(task).element;

        taskList.append(taskElement);
    });
}

const showAllTasks = async () => {
    if (tasks.length > 0) clearTasks();

    const data = await getAllTasksWithAssignedBy();

    tasks = data.tasks;
    showingTasks = tasks;

    showTasks();
};

const filterOnlyAssigned = () => {
    clearTasks();
    showingTasks = tasks.find(task => task.assignedBy);
}

const toggleAssignedTasks = () => (event) => {
    const isChecked = event.target.checked;

    if (isChecked) filterOnlyAssigned()
};

showOnlyAssignedToggle.onchange = toggleAssignedTasks();