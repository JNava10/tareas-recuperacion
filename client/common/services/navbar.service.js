import {createElementFromString, getUserId} from "./common.service.js";
import {hostPath} from "../consts.js";
import {getSelfData, signOut} from "../api/user.api.js";

export const buildNavbar = async () => {
    const navbarItemList = document.querySelector('.navbarItems');

    console.log(document.querySelector('.profileImg'))

    const {roles, pic_url} = (await getSelfData())[0];

    console.log(roles)

    document.querySelector('.profileImg').src = pic_url

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

    const profileDropdownList = document.querySelector('#profileDropdown ul');

    profileDropdownItems.forEach(item => {
        const itemHtml =
            `<li>
                <a class="block px-4 dark:text-gray-400 py-2 da hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">${item.name}</a>
            </li>`;

        const itemElement = createElementFromString(itemHtml);

        if (item['onClick']) itemElement.onclick = item['onClick'];

        if (item['icon']) {
            const iconElement = createElementFromString(item['icon']);

            itemElement.querySelector('a').before(iconElement);
        }

        if (item['publicPath']) itemElement.querySelector('a').href = `${hostPath}/${item['publicPath']}`;

        profileDropdownList.append(itemElement);
    })
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

const profileDropdownItems = [
    {icon: '', name: 'Cerrar sesión', onClick: async () => await signOut()},
    {icon: '', name: 'Editar perfil', publicPath: 'edit-profile'},
]