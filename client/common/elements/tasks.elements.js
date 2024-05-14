import {getLargeBadge} from "../flowbite/badge.js";
import {createElementFromString} from "../services/common.service.js";
import {colors} from "../consts";

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
    const progressColor = getProgressColor(task);

    const cardHtml =
        `<div class="field">
             <label class="label">Progreso</label>
             <div class="control">
               <progress class="progress" value="0" field="progress" max="100"></progress>
             </div>
        </div>
        <div class="max-w-sm p-5 bg-gray-100 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
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
        `<div class="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
            <div class="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500" style="width: ${task.progress}"></div>
        </div>
        <div class="max-w-xs mx-auto">
            <label for="bedrooms-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Choose quantity:</label>
            <div class="relative flex items-center max-w-[11rem]">
                <button type="button" id="decrement-button" data-input-counter-decrement="bedrooms-input" class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <i class="fa-solid fa-minus"></i>
                </button>
                <input type="text" field="progress" data-input-counter data-input-counter-min="1" data-input-counter-max="5" aria-describedby="helper-text-explanation" class="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" value="3" required />
                <div class="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
                    <i class="fa-solid fa-percent"></i>
                    Progreso
                </div>
                <button type="button" id="increment-button" data-input-counter-increment="bedrooms-input" class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        </div>`;

    const element =  createElementFromString(html);

    element.querySelector('.progress').onclick = (event) => changeProgressValue(event);

    return {html, element}
}

const getProgressColor = (progress) => {
    if (progress > 0 && progress <= 25) return colors.danger;
    else if (progress > 25 && progress <= 50) return colors.warning;
    else if (progress > 50 && progress <= 75) return colors.info;
    else if (progress === 100) return colors.success;
    else if (progress > 75 && progress <= 100) return colors.primary;
};

const changeProgressValue = (event) => {
    const width = event.target.offsetWidth - event.target.style.borderWidth;
    const rect =  event.target.getBoundingClientRect();
    const x = Math.round(event.pageX - rect.left);

    const progress = Math.round(x / width * 100);

    event.target.style.width = progress;
}
