import {getAllTasks, removeTask} from "../common/api/task.api.js";
import {capitalize, createElementFromString} from "../common/services/common.service.js";
import {closeModalById, openModalById, openModal, closeModal, createModal} from "../common/services/modal.service.js";
import {colors} from "../common/consts.js";
import * as taskApi from "../common/api/task.api.js"
import {showAlert} from "../common/services/message.service.js";
import {changeProgressValue} from "../common/services/input.service.js"
import * as userApi from "../common/api/user.api.js";
import {createUserList, createUserListItem} from "../common/services/flowbite.service.js";
import {buildNavbar} from "../common/services/navbar.service.js";

let tasks = [];
let users = [];
const difficultyList = new Map();

const taskList = document.querySelector('#taskList');
const mainContainer = document.querySelector('#mainContainer');

let difficultySelect;
let timeout;

onload = async () => {
    await buildNavbar();
    await showAllTasks();

    const {difficulties} = await taskApi.getAllDifficulties();
    const userData = await userApi.getAllUsers();

    users = userData.users;

    let options = "";

    difficulties.forEach(difficulty => {
        difficultyList.set(difficulty.name, difficulty);
        options = options.concat(`<option value="${difficulty.id}">${difficulty.name}</option>`)
    });

    const diffSelectHtml = `<div class="select">
        <select field="diffId">${options}</select>
    </div>`

    difficultySelect = createElementFromString(diffSelectHtml);

    const createButton = buildCreateButton();

    mainContainer.append(createButton);
}

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
                <input class="input" type="number" field="scheduledHours">
              </div>
            </div>
            <div class="field">
              <label class="label">Progreso</label>
              <div class="control">
                <progress class="progress" value="0" field="progress" max="100"></progress>
              </div>
            </div>
            <div class="field">
              <label class="label">Dificultad</label>
              <div class="control" id="diffSelectContainer">
              </div>
            </div>
            <button class="button" id="submitCreateForm">Guardar cambios</button>
        </div>`;

        const createFormElement = createElementFromString(createFormHtml);
        createFormElement.querySelector(`#diffSelectContainer`).append(difficultySelect);

        const modal = createModal(createFormElement);

        createFormElement.querySelector('progress').onclick = (event) => changeProgressValue(event);

        createFormElement.querySelector('#submitCreateForm').onclick = async () => {
            const name = createFormElement.querySelector('input[field="name"]').value;
            const description = createFormElement.querySelector('input[field="description"]').value;
            const scheduledHours = createFormElement.querySelector('input[field="scheduledHours"]').value;
            const progress = createFormElement.querySelector('progress[field="progress"]').value;
            const diffId = createFormElement.querySelector('select[field="diffId"]').value;

            await sendCreateData(
                null,
                name,
                description,
                Number(scheduledHours),
                null,
                Number(progress),
                Number(diffId)
            );

            closeModal(modal);

            await showAllTasks();
        }

        openModal(modal);
    }

    return buttonElement;
};


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
            <div class="buttons">
                <button class="button is-danger is-dark remove-task"><i class="fa-solid fa-trash"></i></button>
            </div>
            <span class="tag">${task.difficulty.name}</span>
        </div>
      </div>
    </div>`

    const taskCardElement = createElementFromString(taskCardHtml);
    const buttonsDiv = taskCardElement.querySelector('.buttons');

    const assignToAffine = createElementFromString(`<button class="button is-success"><i class="fa-solid fa-user"></i></button>`);

    assignToAffine.onclick = async () => {
        const {message, data} = await taskApi.assignToAffine(task.id)

        if (data.executed) {
            showAlert(message, colors.success);
        } else {
            showAlert(message, colors.danger);
        }

        await showAllTasks();
    }

    buttonsDiv.append(assignToAffine);

    let assignButtonElement;

    if (task.assigned_to) {
        assignButtonElement = createElementFromString(`<button class ="button is-success is-dark assign-task dropdown-trigger"><i class="fa-solid fa-user-check"></i></button>`)
    } else {
        assignButtonElement = createElementFromString(`<button class="button is-primary is-dark assign-task dropdown-trigger"><i class="fa-solid fa-user"></i></button>`)
    }

    buttonsDiv.append(assignButtonElement)

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

        await showAllTasks();
    }

    assignTaskButton.onclick = () => {
        const mostSkilledUsers = users // Temporal
        const searchUserContentHtml = `<div class="mb-3">
            <div id="searchedList"></div>
        </div>`;

        const assignTaskContentElement = createElementFromString(searchUserContentHtml);

        if (task.assigned_to) {
            const unassignButton = createElementFromString(`<button class="button unassignTask is-danger"><i class="fa-solid fa-user-xmark"></i></button>`)
            assignTaskContentElement.append(unassignButton);

            assignTaskContentElement.querySelector('.unassignTask').onclick = async () => {
                const {message, data} = await taskApi.unassignTask(task.id);

                closeModal(searchModal);

                if (data.executed) showAlert(message);
                else showAlert(message, colors.danger);

                setTimeout(async () => await showAllTasks(), 800) // Aplicamos un timeout para que dé tiempo a leer el mensaje.
            }
        }

        const searchModal = createModal(assignTaskContentElement);

        const userList = createUserList();

        mostSkilledUsers.forEach(user => {
            const userItem = createUserListItem(user.name, user.first_lastname, user.second_lastname, user.pic_url);

            userItem.onclick = async () => {
                const {message, data} = await taskApi.assignTask(task.id, user.id);

                closeModal(searchModal);

                if (data.executed) showAlert(message);
                else showAlert(message, colors.danger);

                setTimeout(async () => await showAllTasks(), 800) // Aplicamos un timeout para que dé tiempo a leer el mensaje.
            }

            userList.append(userItem);
        });

        assignTaskContentElement.append(userList)

        openModal(searchModal);
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

const sendCreateData = async (id, name, description, scheduledHours, realizedHours, progress, diffId) => {
    const createdTask = {
        name,
        description,
        scheduledHours,
        progress,
        diffId
    }

    const {message, data} = await taskApi.createTask(createdTask);

    if (data.executed) showAlert(message);
    else showAlert(message, colors.danger);
};