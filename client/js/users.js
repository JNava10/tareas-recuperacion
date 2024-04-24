import {getAllUsers} from "../common/api/user.api.js";
import {createElementString} from "../common/services/common.service.js";
import {openModal} from "../common/services/modal.service.js";
import {EditedUser} from "../common/class/user/editedUser.js";
import * as userApi from "../common/api/user.api.js"
import {showAlert} from "../common/services/message.service.js";

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

        if (user[field]) input.value = user[field];
    });

    const editUserPic = document.querySelector('#userPicEdit')
    editUserPic.src = user.pic_url

    openModal(editModalId)
};

// Aqui se crea la peticion y se manda, despues de haber clickado el botón.
submitEdit.addEventListener('click',async  () => {
    let user = users.find(user => user.id === userEditing);
    let formFields = {};

    // Pasamos a array los resultados para poder filtrar.
    const modalFieldsFilled = Array.from(document.querySelectorAll(`#${editModalId} div input[field]`)).filter(input => input.value !== "");

    // Metemos los datos del formulario en el objeto.
    modalFieldsFilled.forEach(input => {
        const field = input.getAttribute('field');

        formFields[field] = input.value;
    });

    console.log(formFields)

    const editedUser = new EditedUser(
        user.id.toString(),
        formFields['name'] || "",
        formFields['first_lastname'] || "",
        formFields['second_lastname'] || "",
        formFields['password'] || "",
        formFields['profile_pic'] || "",
    );

    console.log('Edited user', editedUser)

    const keys = Object.keys(editedUser);


    // Recorremos las propiedades del objeto, quitando los vacios. Esto limpia el objeto quitando las propiedades que no tienen ningun valor.
    for (const field of keys) {
        if (editedUser[field] === "") delete editedUser[field];
    }

    const body = await userApi.editUser(editedUser);
    console.log(body.data)

    if (body.data.executed) showAlert('Usuario creado');
})