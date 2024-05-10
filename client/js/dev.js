import * as taskApi from "../common/api/task.api.js";
import {createElementFromString, getUserId} from "../common/services/common.service.js";
import {colors} from "../common/consts.js";
import {getAssignedTaskCard, getReleaseTaskButton} from "../common/elements/tasks.elements.js";
import {showAlert} from "../common/services/message.service.js";

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
    await getAssignedTasks();
}

const buildAssignedTasksPanel = (tasks) => {
    const panel = document.querySelector('#taskList');


    tasks.forEach(task => {
        const progressColor = calculateProgressColor(task.progress)
        const taskCard = getAssignedTaskCard(task).element

        // if (task.assigned_by.id !== userId) {
        //     const removeButton = getReleaseTaskButton().element;
        //
        //     taskCard.querySelector('.buttons').append(removeButton);
        // }

        const removeButton = getReleaseTaskButton().element;

        removeButton.onclick = async () => {
            const {data, message} = await taskApi.releaseTask(task.id);

            if (data.executed) showAlert(message);
            else showAlert(message, colors.danger);

            setTimeout(async () => getAssignedTasks(), 800)
        }

        taskCard.querySelector('.buttons').append(removeButton);

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
