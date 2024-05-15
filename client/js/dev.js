import * as taskApi from "../common/api/task.api.js";
import {createElementFromString, getUserId} from "../common/services/common.service.js";
import {colors} from "../common/consts.js";
import {getAssignedTaskCard, getReleaseTaskButton, getTaskProgressField} from "../common/elements/tasks.elements.js";
import {showAlert} from "../common/services/message.service.js";
import {buildNavbar} from "../common/services/navbar.service.js";

const mainContainer = document.querySelector('.main.container');
const userId = getUserId()

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

onload = async () => {
    await buildNavbar();
    await getAssignedTasks();
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

const calculateProgressColor = (progress) => {
    if (progress > 0 && progress <= 25) return colors.danger;
    else if (progress > 25 && progress <= 50) return colors.warning;
    else if (progress > 50 && progress <= 75) return colors.info;
    else if (progress === 100) return colors.success;
    else if (progress > 75 && progress <= 100) return colors.primary;
};

const changeProgressValue = (event) => {
    const width = event.target.offsetWidth - event.target.style.borderWidth;
    const rect =  event.target.getBoundingClientRect();
    const x = Math.round(event.pageX - rect.left);

    const progress = Math.round(x / width * 100);

    // if (progress === event.target.value) return;

    event.target.value = progress;

    console.log(progress)
}
