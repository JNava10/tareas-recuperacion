import {getLargeBadge} from "../flowbite/badge.js";
import {createElementFromString} from "../services/common.service.js";

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
            <div class="flex">
                <div class="flex align-items-center justify-content-between mt-4">
                    <img class="w-10 h-10 rounded-full mr-2" src="${task.assigned_by.pic_url}">
                    <span>${task.assigned_by.name} ${task.assigned_by.first_lastname} ${task.assigned_by.second_lastname}</span>
                </div>
            </div>
        </div>`

    return {
        html: cardHtml,
        element: createElementFromString(cardHtml)
    }
}

export const getAddButton = (task) => {
    const html =
        `<button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Default</button>
<button type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Alternative</button>`


    return {
        html: html,
        element: createElementFromString(html)
    }
}

