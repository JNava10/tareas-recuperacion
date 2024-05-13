import * as storageService from "./storage.service.js";
import {createElementFromString, getUserId} from "./common.service.js";
import {hostPath} from "../consts.js";
import {getSelfRoles} from "../api/user.api.js";

export const buildNavbar = async () => {
    const navbarItemList = document.querySelector('.navbarItems');

    const {roles} = await getSelfRoles();
    const {user} = await userApi.getUser();

    if (roles.find(role => role.name === 'admin')) {
        adminNavItems.forEach(item => {
            const element = getNavbarItem(item.name, item.publicPath);

            navbarItemList.append(element);
        })
    }

    if (roles.find(role => role.name === 'desarrollador')) {
        devNavItems.forEach(item => {
            const element = getNavbarItem(item.name, item.publicPath);

            navbarItemList.append(element);
        })
    }
}

const getNavbarItem = (name, publicPath) => {
    const itemHtml =
        `<li>
        <a href="${hostPath}/${publicPath}" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">${name}</a>
      </li>`;

    return createElementFromString(itemHtml);
}

const adminNavItems = [
    {name: 'Gestionar usuarios', publicPath: 'admin/users'},
    {name: 'Gestionar tareas', publicPath: 'admin/tasks'},
    {name: 'Ranking', publicPath: 'admin/ranking'},
];

const devNavItems = [
    {name: 'Tareas asignadas', publicPath: 'dev'},
    {name: 'Coger tareas', publicPath: 'dev/take-tasks'},
    {name: 'Tareas del proyecto', publicPath: 'dev/all-tasks'},
]