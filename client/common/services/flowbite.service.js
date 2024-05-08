// Basado en la documentación de Bulma: https://bulma.io/documentation/components/modal/#javascript-implementation-example

import {createElementFromString} from "./common.service.js";

// Usuarios //

export const createUserList = () => {
    const html = `<ul class="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white>"</ul>`

    console.log(html)

    return createElementFromString(html);
}


export const createUserListItem = (userName, userFirstLastname, userSecondLastname, userProfilePicUrl) => {
    const html = `<li class="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600 ">
            <img class="w-10 h-10 rounded-full" src="${userProfilePicUrl}">
            <span>${userName} </span> 
            <span>${userFirstLastname}</span>
            <span>${userSecondLastname}</span>
        </li>>`

    const itemElement = createElementFromString(html);

    return itemElement;
}

