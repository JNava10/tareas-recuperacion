import {createElementFromString, getUserId} from "../../common/services/common.service.js";
import * as taskApi from "../../common/api/task.api.js";
import {getAssignedTaskCard, getUnassignedTaskCard} from "../../common/elements/tasks.js";

const mainContainer = document.querySelector('.main.container');

onload = async () => {
    const userId = getUserId()

    const {tasks} = await taskApi.getAvailableTasks(userId);

    if (tasks.length === 0) {
        const noTasksHtml = `<div><span>No hay mas tareas disponibles por el momento</span></div>`;
        const noTasksElement = createElementFromString(noTasksHtml);

        mainContainer.append(noTasksElement);
    } else buildAvailableTasksPanel(tasks)
}

const buildAvailableTasksPanel = (tasks) => {
    const panelHtml = `<div class="grid is-col-min-12 dark:border-blue-700 p-4" id="taskList"></div>`;
    const panel = createElementFromString(panelHtml);
    mainContainer.append(panel);

    tasks.forEach(task => {
        const taskCard = getUnassignedTaskCard(task).element

        panel.append(taskCard);
    })
};