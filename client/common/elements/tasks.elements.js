import {getLargeBadge} from "../flowbite/badge.js";
import {createElementFromString} from "../services/common.service.js";
import * as taskApi from "../api/task.api.js";
import {showAlert} from "../services/message.service.js";
import {colors} from "../consts.js";

export const getUnassignedTaskCard = (task) => {
    const cardHtml =
        `<div class="max-w-sm pb-5 p-5 bg-gray-100 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex">
                <div class="w-4/5 mr-2">
                <div>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${task.name}</h5>
                    <p class="font-normal text-gray-700 dark:text-gray-400">${task.description}</p>
                </div>
                <div class="mt-3">
                    <div class="mb-1">
                        <span><i class="fa-solid fa-clock"></i></span>
                        <span>Horas necesarias: </span>
                        <span class="font-medium">${task.scheduled_hours}</span>
                    </div>
                     <div>
                        <span><i class="fa-solid fa-calendar-days"></i></span>
                        <span>Creado el:</span>
                        <span class="font-medium">${new Date(task.created_at)}</span>
                    </div>
                </div>
            </div>
            <div>
                ${getLargeBadge(task.difficulty.name, 'gray').html}
            </div>
        </div>`

    return {
        html: cardHtml,
        element: createElementFromString(cardHtml)
    }
}

export const getAssignedTaskCard = (task) => {
    const cardHtml =
        `<div class="max-w-sm p-5 bg-gray-100 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex">
                <div class="w-4/5 mr-2">
                <div>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${task.name}</h5>
                    <p class="font-normal text-gray-700 dark:text-gray-400">${task.description}</p>
                </div>
                </div>
                <div>
                    ${getLargeBadge(task.difficulty.name, 'gray').html}
                </div>
            </div>
            <div class="flex assignedBy">
                <div class="flex align-items-center justify-content-between mt-4">
                    <img class="w-10 h-10 rounded-full mr-2" src="${task.assigned_by.pic_url}">
                    <span>${task.assigned_by.name} ${task.assigned_by.first_lastname} ${task.assigned_by.second_lastname}</span>
                </div>
            </div>
            <div class="field progress-field"></div>
            <div class="buttons"></div>
        </div>`

    return {
        html: cardHtml,
        element: createElementFromString(cardHtml)
    }
}

export const getReleaseTaskButton = () => {
    const html =
        `<button class="text-red-400 bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-900 dark:hover:bg-red-800 focus:outline-none"><i class="fa-solid fa-trash"></i></button>`

    return {
        html: html,
        element: createElementFromString(html)
    }
}

export const getTaskProgressField  = (task) => {
    const html =
        `<div>
            <span class="bg-gray-100 mb-3 text-gray-400 text-sm font-medium me-2 px-2 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400">
                ${task.progress}
                <i class="fa-solid fa-percent text-gray-400"></i>
            </span>
            <div class="w-full mt-2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 grid">
                 <div class="relative">
                    <div class="absolute z-10 bg-blue-600 h-2.5 rounded-full progress-bar" style="width: ${task.progress}%"></div>
                    <input id="minmax-range" type="range" min="1" max="99" value="${task.progress}" class="absolute bg-transparent z-20 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-700">
                 </div>
            </div>
        </div>`;

    const element =  createElementFromString(html);

    element.querySelector('input').oninput = (event) => {
        const progress = event.target.value;

        changeProgressValue(event, element);
    };

    let timeout;

    element.querySelector('input').onmouseup = (event) => {
        const progress = event.target.value;

        clearTimeout(timeout);

        timeout = setTimeout(async () => {
            const {message, data} = await taskApi.changeTaskProgress(task.id, progress);

            if (data.executed) showAlert(message);
            else showAlert(message, colors.danger);
        }, 400);
    };

    return {html, element}
}

const changeProgressValue = (event, element) => {
    const progress = event.target.value;

    element.querySelector('.progress-bar').style.width = `${progress}%`;
    element.querySelector('span').innerHTML = `${progress}&nbsp;<i class="fa-solid fa-percent text-gray-400"></i>`;
}

export const getProjectTaskCard = (task) => {
    const cardHtml =
        `<div class="max-w-sm p-5 bg-gray-100 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex">
                <div class="w-4/5 mr-2">
                <div>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${task.name}</h5>
                    <p class="font-normal text-gray-700 dark:text-gray-400">${task.description}</p>
                </div>
                </div>
                <div>
                    ${getLargeBadge(task.difficulty.name, 'gray').html}
                </div>
            </div>
            <div class="flex assignedTo">
                <div class="flex align-items-center justify-content-between mt-4">
                    <img class="w-10 h-10 rounded-full mr-2" src="${task.user_assigned.pic_url}">
                    <span>${task.user_assigned.name} ${task.user_assigned.first_lastname} ${task.user_assigned.second_lastname}</span>
                </div>
            </div>
            <div class="field progress-field"></div>
            <div class="buttons"></div>
        </div>`

    return {
        html: cardHtml,
        element: createElementFromString(cardHtml)
    }
}