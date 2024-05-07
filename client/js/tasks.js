import {getAllTasks} from "../common/api/task.api.js";
import {capitalize, createElementFromString} from "../common/services/common.service.js";
import {closeModalById, openModalById, openModal, closeModal, createModal} from "../common/services/modal.service.js";
import {colors} from "../common/consts.js";
import * as taskApi from "../common/api/task.api.js"
import {showAlert} from "../common/services/message.service.js";
import {changeProgressValue} from "../common/services/input.service.js"

let tasks = [];

const taskList = document.querySelector('#taskList');
const mainContainer = document.querySelector('#mainContainer');

async function showAllTasks() {
    if (tasks.length > 0) {
        taskList.innerHTML = "";
        tasks = [];
    }

    const data = await getAllTasks();

    tasks = data.tasks;

    data.tasks.forEach(task => {
        const taskElement = createTaskElement(task);

        tasks.push(task);

        taskList.append(taskElement);
    });
}

const buildCreateButton = () => {
    const buttonHtml = `<button id="createTask" class="button">Crear tarea</button>`
    const buttonElement = createElementFromString(buttonHtml);

    buttonElement.onclick = () => {
        const createFormHtml =  `<div>
            <sup>*El diseño actual es temporal. Será revisado y cambiado de cara a la siguiente entrega.</sup>
            <h3 class="title is-3">Crear tarea</h3>
            <div class="field">
              <label class="label">Nombre</label>
              <div class="control">
                <input class="input" type="text" field="name">
              </div>
            </div>
            <div class="field">
              <label class="label">Descripción</label>
              <div class="control">
                <input class="input" type="text" field="description">
              </div>
            </div>
            <div class="field">
              <label class="label">Horas planeadas</label>
              <div class="control">
                <input class="input" type="text" field="scheduledHours">
              </div>
            </div>
             <div class="field">
              <label class="label">Horas realizadas</label>
              <div class="control">
                <input class="input" type="text" field="realizedHours">
              </div>
            </div>
            <div class="field">
              <label class="label">Progreso</label>
              <div class="control">
                <progress class="progress" value="0" field="progress" max="100"></progress>
              </div>
            </div>
            <button class="button" id="submitCreateForm">Guardar cambios</button>
        </div>`;

        const createFormElement = createElementFromString(createFormHtml);
        const modal = createModal(createFormElement);

        createFormElement.querySelector('progress').onclick = (event) => changeProgressValue(event);

        createFormElement.querySelector('#submitCreateForm').onclick = async () => {
            const name = createFormElement.querySelector('input[field="name"]').value;
            const description = createFormElement.querySelector('input[field="description"]').value;
            const scheduledHours = createFormElement.querySelector('input[field="scheduledHours"]').value;
            const realizedHours = createFormElement.querySelector('input[field="realizedHours"]').value;
            const progress = createFormElement.querySelector('progress[field="progress"]').value;

            await sendCreateData(
                null,
                name,
                description,
                Number(scheduledHours),
                Number(realizedHours),
                Number(progress)
            );

            closeModal(modal);

            await showAllTasks();
        }

        openModal(modal);
    }

    return buttonElement;
};

onload = async () => {
    await showAllTasks();

    const createButton = buildCreateButton();
    mainContainer.append(createButton);
}


function onClickCard(event, task) {
    if (event.target.tagName === 'BUTTON' || event.target.closest('button')) return;

    const editUserFormHtml = `<div>
            <sup>*El diseño actual es temporal. Será revisado y cambiado de cara a la siguiente entrega.</sup>
            <h3 class="title is-3">Editar tarea</h3>
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
        </div>`;

    const editUserForm = createElementFromString(editUserFormHtml);

    editUserForm.querySelector('.progress').onclick = (event) => changeProgressValue(event);

    editUserForm.querySelector('#submitEditForm').onclick = async () => {
        const name = editUserForm.querySelector('input[field="name"]').value;
        const description = editUserForm.querySelector('input[field="description"]').value;
        const scheduledHours = editUserForm.querySelector('input[field="scheduledHours"]').value;
        const realizedHours = editUserForm.querySelector('input[field="realizedHours"]').value;
        const progress = editUserForm.querySelector('progress[field="progress"]').value;

        await sendEditData(
            task.id,
            name,
            description,
            Number(scheduledHours),
            Number(realizedHours),
            Number(progress)
        );

        closeModal(modalElement);

        await showAllTasks();
    }

    const modalElement = createModal(editUserForm);

    openModal(modalElement);
}

const createTaskElement = (task) => {
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
            <div>
                <button class="button is-primary is-dark assign-task"><i class="fa-solid fa-user"></i></button>
                <button class="button is-danger is-dark remove-task"><i class="fa-solid fa-trash"></i></button>
            </div>
            <span class="tag">${task.difficulty.name}</span>
        </div>
      </div>
    </div>`

    const taskCardElement = createElementFromString(taskCardHtml);

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

        await showAllTasks()
    }

    return taskCardElement;
};

const sendEditData = async (id, name, description, scheduledHours, realizedHours, progress) => {
    const editedTask = {
        name,
        description,
        scheduledHours,
        realizedHours,
        progress
    }

    console.log(editedTask)

    const {message, data} = await taskApi.editTask(editedTask, id);

    if (data.executed) showAlert(message);
    else showAlert(message, colors.danger);
};


const calculateProgressColor = (progress) => {
    if (progress > 0 && progress <= 25) return colors.danger;
    else if (progress > 25 && progress <= 50) return colors.warning;
    else if (progress > 50 && progress <= 75) return colors.info;
    else if (progress === 100) return colors.success;
    else if (progress > 75 && progress <= 100) return colors.primary;
};

const sendCreateData = async (id, name, description, scheduledHours, realizedHours, progress) => {
    const createdTask = {
        name,
        description,
        scheduledHours,
        realizedHours,
        progress
    }

    const {message, data} = await taskApi.createTask(createdTask);

    if (data.executed) showAlert(message);
    else showAlert(message, colors.danger);
};