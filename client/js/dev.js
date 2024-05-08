import * as taskApi from "../common/api/task.api.js";
import {createElementFromString, getUserId} from "../common/services/common.service.js";
import {colors} from "../common/consts.js";

const mainContainer = document.querySelector('.container');

let assignedTasks = [];

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

    console.log(tasks)

    tasks.forEach(task => {
        const progressColor = calculateProgressColor(task.progress)
        const taskCardHtml = `<div class="card" id="${task.id}">
          <div class="card-content">
            <p class="title">${task.name}</p>
            <p class="subtitle">${task.description}</p>
            
            <div class="is-flex is-align-items-center">
                <progress class="progress m-0 is-${progressColor} mr-2" value="${task.progress}" max="100"></progress>
                <span class="tag m-0 is-${progressColor}">${task.progress}</span>
            </div>
            
            <div class="mt-3 is-flex is-align-items-center is-justify-content-space-between">
                <div class="buttons">
                    <button class="button is-danger is-dark remove-task"><i class="fa-solid fa-trash"></i></button>
                </div>
                <span class="tag">${task.difficulty.name}</span>
            </div>
          </div>
        </div>`

        const taskCard = createElementFromString(taskCardHtml);
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
