import * as taskApi from "../common/api/task.api.js";
import {createElementFromString, getUserId} from "../common/services/common.service.js";
import {colors} from "../common/consts.js";
import {getAssignedTaskCard} from "../common/elements/tasks.js";

const mainContainer = document.querySelector('.main.container');

onload = async () => {
    const userId = getUserId()

    const {tasks} = await taskApi.getAssignedTasks(userId);

    if (tasks.length === 0) {
        const noTasksHtml = `<div><span>No tienes tareas asignadas</span></div>`;
        const noTasksElement = createElementFromString(noTasksHtml);

        mainContainer.append(noTasksElement);
    } else buildAssignedTasksPanel(tasks)
}

const buildAssignedTasksPanel = (tasks) => {
    const panelHtml = `<div class="grid is-col-min-12" id="taskList"></div>`;
    const panel = createElementFromString(panelHtml);
    mainContainer.append(panel);

    tasks.forEach(task => {
        const progressColor = calculateProgressColor(task.progress)
        const taskCard = getAssignedTaskCard(task).element

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
