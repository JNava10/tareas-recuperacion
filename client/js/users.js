import {deleteUser, getAllUsers} from "../common/api/user.api.js";
import {capitalize, createElementFromString} from "../common/services/common.service.js";
import {closeModalById, openModalById} from "../common/services/modal.service.js";
import {EditedUser} from "../common/class/user/req/editedUser.js";
import * as userApi from "../common/api/user.api.js"
import * as roleApi from "../common/api/role.api.js"
import {showAlert, createControlHelp, resetControl, changeInputColor} from "../common/services/message.service.js";
import {colors} from "../common/consts.js";
import {regex} from "../common/regex.js";
import {PasswordEdited} from "../common/class/user/req/passwordEdited.js";
import {open} from "../common/elements/context_menu/contextMenu.js";
import {getUserFieldMenu} from "../common/elements/context_menu/userFieldMenu.js";
import {buildNavbar} from "../common/services/navbar.service.js";

const usersTableBody = document.querySelector('#usersTable tbody');
const usersTableHeaders = document.querySelectorAll('#usersTable th');
const submitEdit = document.querySelector('#submitEditBtn');
const sendPasswordBtn = document.querySelector('#sendPassword');
const deleteUserBtn = document.querySelector('#deleteUserConfirm');
const restoreUserBtn = document.querySelector('#restoreUserConfirm');
const createUserBtn = document.querySelector('#createUserBtn');
const showPasswordButtons = document.querySelectorAll('.show-password');
const createUserRoleList = document.querySelector('#createUserRoleList');
const editUserRoleList = document.querySelector('#editUserRoleList');
const submitCreateBtn = document.querySelector('#submitCreateBtn');
const submitEditRolesBtn = document.querySelector('#submitEditRolesBtn');


const createUserModalId = 'createUserModal';
const editModalId = 'editUser';
const deleteModalId = 'confirmDeleteModal';
const restoreModalId = 'confirmRestoreModal';

let userEditing = 0; // ID del usuario que se está editando.
let userEditingRoles = new Set();

let userToDelete = 0; // ID del usuario que va a borrar.
let userToRestore = 0; // ID del usuario que se va a reactivar.

let userCreating = {};

let users = [];
let roles = [];

onload = async () => {
    await buildNavbar();
    const data = await getAllUsers();

    users = data.users;

    users.forEach(user => {
        addRow(user)
    });

    const roleData = await roleApi.getAllRoles();

    roles = roleData.roles;

    console.log(roles)
}

const openUserSummary = () => {
    // const userSummary =
};

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
                const image = createElementFromString(profilePicHtml);

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
    const editButtonElement = createElementFromString(editButtonHtml);

    editButtonElement.onclick = () => openEditModal(user);

    row.append(editButtonElement);

    // Añadimos un botón de borrar o reactivar según si el usuario está borrado o no.
    if (user.deleted_at !== null) {
        const restoreButtonHtml = `<td><button data-target=${restoreModalId} class="button is-small js-modal-trigger">Activar</button></td>`;
        const restoreButtonElement = createElementFromString(restoreButtonHtml);

        restoreButtonElement.onclick = () => openRestoreModal(user);

        row.append(restoreButtonElement)
    } else {
        const deleteButtonHtml = `<td><button data-target="confirmDeleteModal" class="button is-small js-modal-trigger">Borrar</button></td>`;

        const deleteButtonElement = createElementFromString(deleteButtonHtml);
        deleteButtonElement.onclick = () => openDeleteModal(user);

        row.append(deleteButtonElement)
    }

    row.oncontextmenu = (event) => {
        event.preventDefault();

        const assignedTasksMenu = getUserFieldMenu(user);

        open(assignedTasksMenu, event)
    }

    usersTableBody.append(row);
};

const openEditModal = (user) => {
    editUserRoleList.innerHTML = '';

    userEditing = user.id;
    userEditingRoles = new Set();

    // Buscamos todos los inputs del HTML dentro del modal que tengan campos asociados.
    const modalFields = document.querySelectorAll(`#${editModalId} div input[field]`);

    modalFields.forEach(input => {
        const field = input.getAttribute('field');

        if (user[field]) input.value = user[field];
    });

    roles.forEach(role => {
        const roleItem = createElementFromString(`<button class="button is-dark is-primary cell ">${capitalize(role.name)}</input>`);

        roleItem.onclick = () => {
            const active = roleItem.classList.contains('is-active');

            if (!active) {
                roleItem.classList.add('is-active');
                userEditingRoles.add(role.id)
            } else {
                roleItem.classList.remove('is-active');
                userEditingRoles.delete(role.id)
            }
        }

        editUserRoleList.append(roleItem);
    });

    const editUserPic = document.querySelector('#userPicEdit')
    editUserPic.src = user.pic_url

    openModalById(editModalId)
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
submitEditRolesBtn.onclick = async () => {
    const user = users.find(user => user.id === userEditing);
    user.roles = [...userEditingRoles.values()]

    if (user.roles.length === 0) {
        showAlert('No tienes ningun rol seleccionado');
        return;
    }

    const {message, data} = await userApi.editUserRoles(user);

    if (data.executed === true) {
        showAlert(message, colors.success);
        setTimeout(() => location.reload(), 800); // Añadimos un tiempo de espera para que sea posible leer el mensaje.
        
    }
    else showAlert(message, colors.danger);
}

// Botón de borrar usuario dentro del modal.
deleteUserBtn.onclick = async () => {
    const {message, data} = await userApi.deleteUser(userToDelete);

    if (data.executed) showAlert(message, colors.success);
    else showAlert(message, colors.danger);

    closeModalById(deleteModalId);

    setTimeout(() => location.reload(), 800); // Añadimos un tiempo de espera para que sea posible leer el mensaje.
}

// Botón de restaurar usuario dentro del modal.
restoreUserBtn.onclick = async () => {
    const {message, data} = await userApi.restoreUser(userToDelete);

    if (data.executed) showAlert(message, colors.success);
    else showAlert(message, colors.danger);

    closeModalById(restoreModalId);

    setTimeout(() => location.reload(), 800); // Añadimos un tiempo de espera para que sea posible leer el mensaje.
}

const openDeleteModal = (user) => {
    userToDelete = user.id;

    openModalById(deleteModalId);
};

const openRestoreModal = (user) => {
    userToDelete = user.id;

    openModalById(restoreModalId)
};

createUserBtn.onclick = async () => {
    openModalById(createUserModalId);

    roles.forEach(role => {
        userCreating.roles = new Set();

        const roleItem = createElementFromString(`<li class="button is-dark is-primary cell ">${capitalize(role.name)}</li>`);

        roleItem.onclick = () => {
            const active = roleItem.classList.contains('is-active');

            if (!active) {
                roleItem.classList.add('is-active');
                userCreating.roles.add(role.id)
            } else {
                roleItem.classList.remove('is-active');
                userCreating.roles.delete(role.id)
            }
        }

        createUserRoleList.append(roleItem);
    });
}

// Con esto conseguimos poder mostrar las contraseñas en los campos que queramos.
showPasswordButtons.forEach((button) => {
    const targetId = button.getAttribute('for'); // Este es el atributo for que se menciona en el HTML.
    const target = document.querySelector(`#${targetId}`);

    button.onclick = () =>  {
        if (target.type === 'password') {
            target.type = 'text';
            button.classList.add('is-active');
        } else {
            target.type = 'password';
            button.classList.remove('is-active');
        }
    }
});

submitCreateBtn.onclick = async () => {
    const fields = document.querySelectorAll('input.create-user')
    const fieldsArray = [...fields]; // Convertimos los campos obtenidos a array para poder filtrar despues. Usar el spread operator (...) es igual que usar Array.from().
    const passwordField = fieldsArray.find(field => field.getAttribute('field') === 'password');
    const confirmPasswordField = fieldsArray.find(field => field.getAttribute('field') === 'confirmPassword');

    // Guardamos las validaciones en un Map para poder guardar los datos de los campos que se necesiten, y luego se puedan recuperar facilmente.
    const fieldsValid = new Map();
    const fieldsInvalid = new Map();

    // Recorremos todos los campos del formulario, para poder obtener su valor y validarlos.
    fields.forEach(field => {
        const fieldName = field.getAttribute('field');
        const value = field.value;
        const isValid = regex[fieldName].test(value);

        if (isValid) {
            fieldsValid.set(fieldName, {field: field, isValid: isValid});
            changeInputColor(field, colors.success);
        } else {
            fieldsInvalid.set(fieldName, {field: field, isValid: isValid});
            changeInputColor(field, colors.danger);
        }

        if (!field.getAttribute('ignore')) userCreating[fieldName] = value;
    });

    if (fieldsInvalid.size > 0) {
        showAlert('Formulario invalido. Revisa los campos marcados en rojo.', colors.danger);
    } else if (userCreating.roles.size === 0) {
        showAlert('Debes seleccionar como minimo un rol.', colors.danger);
    } else if (passwordField.value !== confirmPasswordField.value) {
        showAlert('Las contraseñas no coinciden.', colors.success);
    } else if (fieldsValid.size === fields.length && fieldsInvalid.size === 0) {
        userCreating.roles = Array.from(userCreating.roles) // Convertimos el Set a array para que la API lo interprete correctamente.

        const createdResponse = await userApi.createUser(userCreating);

        if (createdResponse.data.executed) showAlert(createdResponse.message, colors.success);
        else showAlert(createdResponse.message, colors.danger);
    }
}