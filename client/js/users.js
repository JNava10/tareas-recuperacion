import {deleteUser, getAllUsers} from "../common/api/user.api.js";
import {createElementString} from "../common/services/common.service.js";
import {closeModal, openModal} from "../common/services/modal.service.js";
import {EditedUser} from "../common/class/user/req/editedUser.js";
import * as userApi from "../common/api/user.api.js"
import {showAlert, createControlHelp, resetControl} from "../common/services/message.service.js";
import {colors} from "../common/consts.js";
import {regex} from "../common/regex.js";
import {PasswordEdited} from "../common/class/user/req/passwordEdited.js";

const usersTableBody = document.querySelector('#usersTable tbody');
const usersTableHeaders = document.querySelectorAll('#usersTable th');
const submitEdit = document.querySelector('#submitEditBtn');
const sendPasswordBtn = document.querySelector('#sendPassword');
const deleteUserBtn = document.querySelector('#deleteUserConfirm');
const restoreUserBtn = document.querySelector('#restoreUserConfirm');

const editModalId = 'editUser';
const deleteModalId = 'confirmDeleteModal';
const restoreModalId = 'confirmRestoreModal';

let userEditing = 0; // ID del usuario que se está editando.
let userToDelete = 0; // ID del usuario que va a borrar.
let userToRestore = 0; // ID del usuario que se va a reactivar.

let users = []

onload = async () => {
    const data = await getAllUsers();

    users = data.users;

    users.forEach(user => {
        addRow(user)
    });
}

const addRow = (user) => {
    // Cogemos las cabeceras dentro de la tabla, y haciendo un bucle, comprobamos que campo pertenece a cada uno para
    // poder introducir los datos del objeto en su columna correspondiente.

    const row = document.createElement('tr');
    row.classList.add('is-vcentered') // Clase de Bulma para centrar las filas.

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

    // Botones //

    // Botón de editar
    const editButtonHtml = `<td><button data-target="editUser" class="button is-small js-modal-trigger">Editar</button></td>`;
    const editButtonElement = createElementString(editButtonHtml);

    editButtonElement.onclick = () => openEditModal(user);

    row.append(editButtonElement)

    // Añadimos un botón de borrar o reactivar según si el usuario está borrado o no.
    if (user.deleted_at !== null) {
        const restoreButtonHtml = `<td><button data-target=${restoreModalId} class="button is-small js-modal-trigger">Activar</button></td>`;

        const restoreButtonElement = createElementString(restoreButtonHtml);
        restoreButtonElement.onclick = () => openRestoreModal(user)

        row.append(restoreButtonElement)
    } else {
        const deleteButtonHtml = `<td><button data-target="confirmDeleteModal" class="button is-small js-modal-trigger">Borrar</button></td>`;

        const deleteButtonElement = createElementString(deleteButtonHtml);
        deleteButtonElement.onclick = () => openDeleteModal(user);

        row.append(deleteButtonElement)
    }

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
    const user = users.find(user => user.id === userEditing);
    let formFields = {};

    // Pasamos a array los resultados para poder filtrar.
    const modalFieldsFilled = Array.from(document.querySelectorAll(`#${editModalId} div input[field]`)).filter(input => input.value !== "");

    // Metemos los datos del formulario en el objeto.
    modalFieldsFilled.forEach(input => {
        const field = input.getAttribute('field');

        formFields[field] = input.value;
    });

    const userData = new EditedUser(
        user.id.toString(),
        user.name,
        user.first_lastname,
        user.second_lastname
    )

    const editedUser = new EditedUser(
        user.id.toString(),
        formFields['name'] || "",
        formFields['first_lastname'] || "",
        formFields['second_lastname'] || ""
    );


    if (userData === editedUser) { // TODO: No funciona.
        showAlert('No se ha cambiado ningun campo.');
        return;
    }

    const keys = Object.keys(editedUser);

    // Recorremos las propiedades del objeto, quitando los vacios. Esto limpia el objeto quitando las propiedades que no tienen ningun valor.
    for (const field of keys) {
        if (editedUser[field] === "") delete editedUser[field];
    }

    const {message, data} = await userApi.editUser(editedUser);

    if (data.executed === true) {
        showAlert(message);
        // setTimeout(() => location.load(), 800); // Añadimos un tiempo de espera para que sea posible leer el mensaje.
    } else {
        showAlert(message, colors.danger);
    }
});

sendPasswordBtn.onclick = async () => {
    const user = users.find(user => user.id === userEditing);
    const passwordField = document.querySelector('#userPassword');
    const confPasswordField = document.querySelector('#userPasswordConfirm');

    const passwordsInvalid = !regex.password.test(passwordField.value) || !regex.password.test(confPasswordField.value)

    if (passwordField.value === "") {
        showAlert('Debes introducir alguna contraseña.', colors.danger);
        return;
    } else if (passwordsInvalid) {
        showAlert('Debes introducir una contraseña valida.', colors.danger);
        return;
    }
    else if (passwordField.value !== confPasswordField.value) {
        showAlert('Las contraseñas no coinciden, comprueba de nuevo los campos.', colors.danger);
        return;
    }

    const passwordEdited = new PasswordEdited(user.id.toString(), passwordField.value)

    const {message, data} = await userApi.editUserPassword(passwordEdited);

    if (data.executed === true) showAlert(message, colors.success);
    else showAlert(message, colors.danger);
    setTimeout(() => location.reload(), 800); // Añadimos un tiempo de espera para que sea posible leer el mensaje.
}

// Botón de borrar usuario dentro del modal.
deleteUserBtn.onclick = async () => {
    const {message, data} = await userApi.deleteUser(userToDelete);

    if (data.executed) showAlert(message, colors.success);
    else showAlert(message, colors.danger);

    closeModal(deleteModalId);

    setTimeout(() => location.reload(), 800); // Añadimos un tiempo de espera para que sea posible leer el mensaje.
}

// Botón de restaurar usuario dentro del modal.
restoreUserBtn.onclick = async () => {
    const {message, data} = await userApi.restoreUser(userToDelete);

    if (data.executed) showAlert(message, colors.success);
    else showAlert(message, colors.danger);

    closeModal(restoreModalId);

    setTimeout(() => location.reload(), 800); // Añadimos un tiempo de espera para que sea posible leer el mensaje.
}

const openDeleteModal = (user) => {
    userToDelete = user.id;

    openModal(deleteModalId)
};

const openRestoreModal = (user) => {
    userToDelete = user.id;

    openModal(restoreModalId)
};