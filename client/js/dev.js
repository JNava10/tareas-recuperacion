import * as taskApi from "../common/api/task.api.js";
import {createElementFromString, getUserId} from "../common/services/common.service.js";
import {colors} from "../common/consts.js";
import {getAssignedTaskCard, getReleaseTaskButton, getTaskProgressField} from "../common/elements/tasks.elements.js";
import {showAlert} from "../common/services/message.service.js";
import {buildNavbar} from "../common/services/navbar.service.js";

const mainContainer = document.querySelector('.main.container');
const userId = getUserId()

onload = async () => {
    await buildNavbar();
    await getAssignedTasks();
}
async function getAssignedTasks() {
    const panel = document.querySelector('#taskList');

    panel.innerHTML = ""

    const {tasks} = await taskApi.getAssignedTasks(userId);

    if (tasks.length === 0) {
        const noTasksHtml = `<div><span>No tienes tareas asignadas</span></div>`;
        const noTasksElement = createElementFromString(noTasksHtml);

        mainContainer.append(noTasksElement);
    } else buildAssignedTasksPanel(tasks)
}

const buildAssignedTasksPanel = (tasks) => {
    const panel = document.querySelector('#taskList');

    tasks.forEach(task => {
        const taskCard = getAssignedTaskCard(task).element;
        const progressField = getTaskProgressField(task).element;

        const removeButton = getReleaseTaskButton().element;

        removeButton.onclick = async () => {
            const {data, message} = await taskApi.releaseTask(task.id);

            if (data.executed) showAlert(message);
            else showAlert(message, colors.danger);

            setTimeout(async () => getAssignedTasks(), 800)
        }

        taskCard.querySelector('.buttons').append(removeButton);
        taskCard.querySelector('.progress-field').append(progressField);

        panel.append(taskCard);
    })
};