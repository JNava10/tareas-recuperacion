import {getAllTasks} from "../common/api/task.api.js";
import {capitalize, createElementString} from "../common/services/common.service.js";
import {closeModalById, openModalById, openModal, closeModal, createModal} from "../common/services/modal.service.js";
import {colors} from "../common/consts.js";
import * as taskApi from "../common/api/task.api.js"
import {showAlert} from "../common/services/message.service.js";

let tasks = [];

const taskList = document.querySelector('#taskList');

onload = async () => {
    const data = await getAllTasks();

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
            <progress class="progress m-0 is-${progressColor} mr-2" value="${task.progress}" max="100"></progress>
            <span class="tag m-0 is-${progressColor}">${task.progress}</span>
        </div>
        
        <div class="mt-3 is-flex is-align-items-center is-justify-content-space-between">
            <div>
                <button class="button is-primary is-dark assign-task"><i class="fa-solid fa-user"></i></button>
                <button class="button is-danger is-dark remove-task"><i class="fa-solid fa-trash"></i></button>
            </div>
            <span class="tag">${task.difficulty.name}</span>
        </div>
      </div>
    </div>`

    const taskCardElement = createElementString(taskCardHtml);

    const assignTaskButton = taskCardElement.querySelector('.assign-task');
    const removeTaskButton = taskCardElement.querySelector('.remove-task');

    taskCardElement.onclick = () => {
        const editUserForm = `<div>
            <h3>Editar tarea</h3>
            <div class="field">
              <label class="label">Nombre</label>
              <div class="control">
                <input class="input" type="text" placeholder="Text input">
              </div>
            </div>
            <div class="field">
              <label class="label">Descripción</label>
              <div class="control">
                <input class="input" type="text" placeholder="Text input">
              </div>
            </div>
            <div class="field">
              <label class="label">Horas planeadas</label>
              <div class="control">
                <input class="input" type="text" placeholder="Text input">
              </div>
            </div>
             <div class="field">
              <label class="label">Horas realizadas</label>
              <div class="control">
                <input class="input" type="text" placeholder="Text input">
              </div>
            </div>
            <div class="field">
              <label class="label">Progreso</label>
              <div class="control">
                <input class="input" type="text" placeholder="Text input">
              </div>
            </div>
        </div>`

        createModal()

        // taskCardElement.setAttribute('data-target', modalElement.id)
    }

    removeTaskButton.onclick = async () => {
        const {data, message} = await taskApi.removeTask(task.id);

        if (data.executed) {
            showAlert(message, colors.success);
        } else {
            showAlert(message, colors.danger);
        }
    }

    taskList.append(taskCardElement);
};

const calculateProgressColor = (progress) => {
    if (progress > 0 && progress <= 25) return colors.danger;
    else if (progress > 25 && progress <= 50) return colors.warning;
    else if (progress > 50 && progress <= 75) return colors.info;
    else if (progress === 100) return colors.success;
    else if (progress > 75 && progress <= 100) return colors.primary;
};