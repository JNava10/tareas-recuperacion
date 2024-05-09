import {getLargeBadge} from "../../flowbite/badge.js";
import {createElementFromString} from "../../services/common.service.js";

export const getUnassignedTaskCard = (task) => {
    const cardHtml =
        `<div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div class="flex">
                <div class="w-4/5">
                <div>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${task.name}</h5>
                    <p class="font-normal text-gray-700 dark:text-gray-400">${task.description}</p>
                </div>
            </div>
            <div>
                ${getLargeBadge(task.difficulty.name, 'dark').html}
            </div>
            </div>
            <div class="flex">
                <div class="flex align-items-center">
                    <img class="w-10 h-10 rounded-full m-2" src="${task.assigned_by.pic_url}">
                    <span>${task.assigned_by.name} ${task.assigned_by.first_lastname} ${task.assigned_by.second_lastname}</span>
                </div>
                <button type="button" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"><i class="fa-solid fa-trash"></i>  </button>
            </div>
        </div>`

    return {
        html: cardHtml,
        element: createElementFromString(cardHtml)
    }
}

export const getAssignedTaskCard = (task) => {
    const cardHtml =
        `<div class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div class="w-4/5">
                <div>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${task.name}</h5>
                    <p class="font-normal text-gray-700 dark:text-gray-400">${task.description}</p>
                </div>
                 <div>
                    <button type="button" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"><i class="fa-solid fa-trash"></i>  </button>
                </div>
            </div>
            <div>
                ${getLargeBadge(task.difficulty.name, 'dark').html}
            </div>
        </div>`

    return {
        html: cardHtml,
        element: createElementFromString(cardHtml)
    }
}