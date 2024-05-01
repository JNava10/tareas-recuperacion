import {getAllTasks} from "../common/api/task.api.js";
import {capitalize, createElementString} from "../common/services/common.service.js";
import {closeModal, openModal} from "../common/services/modal.service.js";
import {colors} from "../common/consts.js";

let tasks = [];

const taskList = document.querySelector('#taskList');

onload = async () => {
    const data = await getAllTasks();

    console.log(data)

    tasks = data.tasks;

    tasks.forEach(task => {
        addTask(task)
    });
}

const addTask = (task) => {
    const progressColor = calculateProgressColor(task.progress)

    const taskCardHtml = `<div class="card">
      <div class="card-content">
        <p class="title">${task.name}</p>
        <p class="subtitle">${task.description}</p>
        
        <div class="is-flex is-align-items-center">
            <progress class="progress m-0 is-${progressColor} mr-2" value="15" max="100"></progress>
            <span class="tag m-0 is-${progressColor}">${task.progress}</span>
        </div>
        
        <span class="tag mt-3">${task.difficulty.name}</span>
        
      </div>
    </div>`

    const taskCardElement = createElementString(taskCardHtml);

    taskList.append(taskCardElement);
};

const calculateProgressColor = (progress) => {
    if (progress > 0 && progress <= 25) return colors.primary;
    else if (progress > 25 && progress <= 50) return colors.info;
    else if (progress > 50 && progress <= 75) return colors.link;
    else if (progress > 75 && progress <= 100) return colors.success;
};