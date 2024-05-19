import * as taskApi from "../common/api/task.api.js";
import {getAllTasks, getAllTasksWithAssignedTo} from "../common/api/task.api.js";
import {getAssignedTaskCard, getProjectTaskCard, getUnassignedTaskCard} from "../common/elements/tasks.elements.js";

const taskList = document.querySelector('#taskList');
const showOnlyAssignedToggle = document.querySelector('#showOnlyAssigned');

let tasks = [];
let showingTasks = [];

onload = async () => {
    const data = await getAllTasksWithAssignedTo();

    console.log(data)

    tasks = data.tasks

    console.log(tasks)

    showAllTasks()
}

const clearTasks = () => {
    taskList.innerHTML = "";
    showingTasks = [];
};

function showTasks() {
    showingTasks.forEach(task => {
        let taskElement;

        if (!task.assigned_to) taskElement = getUnassignedTaskCard(task).element;
        else taskElement = getProjectTaskCard(task).element;

        taskList.append(taskElement);
    });
}

const showAllTasks = () => {
    if (tasks.length > 0) clearTasks();

    showingTasks = tasks;

    showTasks();
};

const filterOnlyAssigned = () => {
    clearTasks();

    showingTasks = tasks.filter(task => task.assigned_to != null);

    console.log(tasks)

    showTasks();
}

const toggleAssignedTasks = () => (event) => {
    const isChecked = event.target.checked;

    if (isChecked) filterOnlyAssigned()
    else showAllTasks()
};

showOnlyAssignedToggle.onchange = toggleAssignedTasks();