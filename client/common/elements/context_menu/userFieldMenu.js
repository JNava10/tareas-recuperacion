import {createElementFromString} from "../../services/common.service.js";
import {getAssignedTasks, getRealizedTasks} from "../../api/task.api.js";
import {createModal, openModal} from "../../services/modal.service.js";
import {isShowing} from "./contextMenu.js";

export const getUserFieldMenu = (user) => {
    const html =
        `<ul class="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li class="showAssigned w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600  cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-800">Ver tareas asignadas</li>
            <li class="showRealized w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600 cursor-pointer hover:bg-gray-800 hover:dark:bg-gray-800">Ver tareas realizadas</li>
        </ul>`;

    const element = createElementFromString(html);

    element.querySelector(`.showAssigned`).onclick = () => openAssignedTasks(user);
    element.querySelector(`.showRealized`).onclick = () => openRealizedTasks(user);

    return element;
}

export const openAssignedTasks = async (user) => {
    if (!isShowing) return;

    const {tasks} = await getAssignedTasks(user.id)


    const assignedTasksListHtml =
        `<div>
            <form class="max-w-md mx-auto sticky top-3">   
                    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div class="relative">
                        <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Busca una tarea" required />
                        <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                    </div>
                </form>
            <div class="assignedTaskList"></div>
        </div>`;

    const assignedTaskListElement  = createElementFromString(assignedTasksListHtml);


    tasks.forEach(task => {
        const html =
            `<a class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl dark:border-gray-700 dark:bg-gray-800">
                <div class="flex flex-col justify-between p-4 leading-normal">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${task.name}</h5>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${task.description}</p>
                </div>
            </a>`;

        const element = createElementFromString(html);

        assignedTaskListElement.querySelector('.assignedTaskList').append(element);
    });

    const modal = createModal(assignedTaskListElement)

    openModal(modal);
};

const openRealizedTasks = async (user) => {
    if (!isShowing) return;

    const {tasks} = await getRealizedTasks(user.id)


    const assignedTasksListHtml =
        `<div>
            <form class="max-w-md mx-auto sticky top-3">   
                    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div class="relative">
                        <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Busca una tarea" required />
                        <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                    </div>
                </form>
            <div class="realizedTaskList"></div>
        </div>`;

    const realizedTaskListElement  = createElementFromString(assignedTasksListHtml);

    tasks.forEach(task => {
        const html =
            `<a class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl dark:border-gray-700 dark:bg-gray-800">
                <div class="flex flex-col justify-between p-4 leading-normal">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${task.name}</h5>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${task.description}</p>
                </div>
            </a>`;

        const element = createElementFromString(html);

        realizedTaskListElement.querySelector('.realizedTaskList').append(element);
    });

    const modal = createModal(realizedTaskListElement)

    openModal(modal);
};