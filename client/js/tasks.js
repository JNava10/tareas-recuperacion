import {getAllTasks} from "../common/api/task.api.js";
import {capitalize, createElementString} from "../common/services/common.service.js";
import {closeModal, openModal} from "../common/services/modal.service.js";

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
    const taskCardHtml = `<div class="card">
      <div class="card-content">
        <p class="title">${task.name}</p>
        <p class="subtitle">${task.description}</p>
        <div class="has-background-info is-flex">
            <progress class="progress" value="${tasks}" max="100"></progress>
            <span class="tag">${task.difficulty.name}</span>  
        </div>
      </div>
      
    </div>`

    const taskCardElement = createElementString(taskCardHtml);

    taskList.append(taskCardElement);
};