import {getAllUsers} from "../common/api/user.api.js";
import {createElementString} from "../common/services/common.service.js";
import {openModal} from "../common/services/modal.service.js";

const usersTableBody = document.querySelector('#usersTable tbody');
const usersTableHeaders = document.querySelectorAll('#usersTable th');
const submitEdit = document.querySelector('#submitEditBtn');
const editModalId = 'editUser';
let userEditing = 0; // ID del usuario que se está editando.
let users = []

onload = async () => {
    const data = await getAllUsers();

    users = data.users;

    users.forEach(user => {
        addUser(user)
    });
}

const addUser = (user) => {
    // Cogemos las cabeceras dentro de la tabla, y haciendo un bucle, comprobamos que campo pertenece a cada uno para
    // poder introducir los datos del objeto en su columna correspondiente.

    const row = document.createElement('tr');
    row.classList.add('is-vcentered')

    for (const header of usersTableHeaders) {
        const headerFieldname = header.getAttribute('field');
        const isProfilePic = header.getAttribute('profilePic') !== null;
        const field = user[headerFieldname];

        if (field) {
            const column = document.createElement('td');

            if (isProfilePic) {
                const profilePicHtml = `<figure class="image is-square is-32x32"><img class="is-rounded" src="${field}"></figure>`;
                const image = createElementString(profilePicHtml);

                column.append(image);
            } else {
                column.innerHTML = field;
            }

            row.append(column);
        }
    }

    const editButtonHtml = `<td><button data-target="editUser" class="button is-small js-modal-trigger">Editar</button></td>`;
    const editButtonElement = createElementString(editButtonHtml);

    editButtonElement.onclick = () => openEditModal(user);

    row.append(editButtonElement)

    usersTableBody.append(row);
};

const openEditModal = (user) => {
    userEditing = user.id;

    // Buscamos todos los inputs del HTML dentro del modal que tengan campos asociados.
    const modalFields = document.querySelectorAll(`#${editModalId} div input[field]`);

    modalFields.forEach(input => {
        const field = input.getAttribute('field');
        console.log(user[field])

        if (user[field]) input.value = user[field];
    });

    openModal(editModalId)
};

submitEdit.addEventListener('click', () => {
    const user = users.find(user => user.id === userEditing);

    console.log(user);
})