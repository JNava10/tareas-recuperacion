import {getAllTasks} from "../common/api/task.api.js";
import {capitalize, createElementString} from "../common/services/common.service.js";
import {closeModalById, openModalById, openModal, closeModal, createModal} from "../common/services/modal.service.js";
import {colors} from "../common/consts.js";
import * as taskApi from "../common/api/task.api.js"
import {showAlert} from "../common/services/message.service.js";
import {changeProgressValue} from "../common/services/input.service.js"

let tasks = [];

const taskList = document.querySelector('#taskList');

onload = async () => {
    const data = await getAllTasks();

    tasks = data.tasks;

    tasks.forEach(task => {
        addTask(task)
    });
}


function onClickCard(event, task) {
    if (event.target.tagName === 'BUTTON' || event.target.closest('button')) return;

    const editUserFormHtml = `<div>
            <h3>Editar tarea</h3>
            <div class="field">
              <label class="label">Nombre</label>
              <div class="control">
                <input class="input" type="text" field="name" value="${task.name}">
              </div>
            </div>
            <div class="field">
              <label class="label">Descripción</label>
              <div class="control">
                <input class="input" type="text" field="description" value="${task.description}">
              </div>
            </div>
            <div class="field">
              <label class="label">Horas planeadas</label>
              <div class="control">
                <input class="input" type="text" field="scheduledHours" value="${task.scheduled_hours}">
              </div>
            </div>
             <div class="field">
              <label class="label">Horas realizadas</label>
              <div class="control">
                <input class="input" type="text" field="realizedHours" value="${task.realized_hours}">
              </div>
            </div>
            <div class="field">
              <label class="label">Progreso</label>
              <div class="control">
                <progress class="progress" field="progress" value="${task.progress}" max="100"></progress>
              </div>
            </div>
            <button class="button" id="submitEditForm">Guardar cambios</button>
        </div>`

    const editUserForm = createElementString(editUserFormHtml);

    editUserForm.querySelector('.progress').onclick = (event) => changeProgressValue(event);

    const name = editUserForm.querySelector('input[field="name"]').value;
    const description = editUserForm.querySelector('input[field="description"]').value;
    const scheduledHours = editUserForm.querySelector('input[field="scheduledHours"]').value;
    const realizedHours = editUserForm.querySelector('input[field="realizedHours"]').value;
    const progress = editUserForm.querySelector('progress[field="progress"]').value;

    editUserForm.querySelector('#submitEditForm').onclick = () => sendEditData(
        task.id,
        name,
        description,
        scheduledHours,
        realizedHours,
        progress
    )

    const modalElement = createModal(editUserForm);

    openModal(modalElement);
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

    taskCardElement.querySelector('.card-content').onclick = (event) => onClickCard(event, task);

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

const sendEditData = async (id, name, description, scheduledHours, realizedHours, progress) => {
    const editedTask = {
        name,
        description,
        scheduledHours,
        realizedHours,
        progress
    }

    const {message, data} = await taskApi.editTask(editedTask);
};


const calculateProgressColor = (progress) => {
    if (progress > 0 && progress <= 25) return colors.danger;
    else if (progress > 25 && progress <= 50) return colors.warning;
    else if (progress > 50 && progress <= 75) return colors.info;
    else if (progress === 100) return colors.success;
    else if (progress > 75 && progress <= 100) return colors.primary;
};