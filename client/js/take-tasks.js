import {createElementFromString, getUserId} from "../common/services/common.service.js";
import * as taskApi from "../common/api/task.api.js";
import { getAssignedTaskCard, getUnassignedTaskCard} from "../common/elements/tasks.elements.js";
import {showAlert} from "../common/services/message.service.js";
import {colors} from "../common/consts.js";

const mainContainer = document.querySelector('.main.container');

let tasks = [];

async function getAvailableTasks() {
    const data = await taskApi.getAvailableTasks();
    tasks = [];


    if (data.tasks.length === 0) {
        const noTasksHtml = `<div><span>No hay mas tareas disponibles por el momento</span></div>`;
        const noTasksElement = createElementFromString(noTasksHtml);

        mainContainer.append(noTasksElement);
    } else {
        tasks = data.tasks;

        buildAvailableTasksPanel(tasks)
    }
}

onload = async () => {
    await getAvailableTasks();
}

const buildAvailableTasksPanel = (tasks) => {
    const panel = document.querySelector('#taskList');
    panel.innerHTML = ""

    tasks.forEach(task => {
        const taskCard = getUnassignedTaskCard(task).element

        taskCard.onclick = async () => {
            const clientUserId = getUserId();

            const {data, message} = await taskApi.assignTask(task.id, clientUserId)

            if (data.executed) showAlert(message);
            else showAlert(message, colors.danger);

            setTimeout(async () => await getAvailableTasks(), 800)
        }

        panel.append(taskCard);
    })
};