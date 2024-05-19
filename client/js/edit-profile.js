import {getSelfData} from "../common/api/user.api.js";
import {showAlert} from "../common/services/message.service.js";
import {colors} from "../common/consts.js";
import * as userApi from "../common/api/user.api.js";
import {regex} from "../common/regex.js";
import {setValidationIcon} from "../common/services/common.service.js";
const invalidIconHtml = `<i class="fa-solid fa-ban"></i>`;

const submitEditBtn = document.querySelector('#submitEditUser');
let user = {}

async function getUserData() {
    user = (await getSelfData())[0];

    handleUserData(user)
}

onload = async () => {
    await getUserData();
}


const handleUserData = (user) => {
    // Foto de perfil
    document.querySelector('#userProfilePic').src = user.pic_url;
    document.querySelector('#uploadProfilePhoto').onclick = () => showUploadInput()

    // Datos del perfil
    const userFields = document.querySelectorAll('input[field]');

    userFields.forEach(field => setUserData(field, user))
};


const showUploadInput = () => {
    const tempInput = document.createElement('input');

    tempInput.type = 'file';
    tempInput.onchange = event => handleFile(event.target.files[0])

    tempInput.click();
};

/**
 *
 * @param {File} file
 */
const handleFile = async (file) => {
    const maxMegaBytes = 2
    const maxSize = maxMegaBytes * Math.pow(10, 6); // Un MB son un millón de Bytes.
    const allowedMime = ['image/png', 'image/jpeg'] // Los Mime types son nomenclaturas estandar que corresponden con extensiones de archivo.

    if (file.size > maxSize) {
        showAlert('Has intentado subir un archivo demasiado grande.', colors.danger)
        return;
    } else if (!allowedMime.includes(file.type)) {
        showAlert('Has intentado subir un archivo no valido.', colors.danger)
        return;
    }

    const {data, message} = await userApi.changeProfilePic(file);

    await getUserData()
};

const setUserData = (field, user) => {
    const fieldName = field.getAttribute('field');

    if (!fieldName) return;

    field.value = user[fieldName];
};

const submitEditProfile = async (event) => {
    event.preventDefault();

    const userFields = document.querySelectorAll('input[field]');
    const editedUser = {};
    const validations = [];

    userFields.forEach(field => {
        const fieldName = field.getAttribute('field');

        if (!fieldName) return;

        const isValid = validateField(field);

        setValidationIcon(field, isValid)

        validations.push(isValid);

        editedUser[fieldName] = field.value;
    });

    const allFieldsValid = validations.every(validation => validation === true);

    if (!allFieldsValid) {
        showAlert(`Revisa de nuevo los campos marcados con ${invalidIconHtml}`, colors.danger)
        return;
    }

    editedUser.id = user.id;

    const {message, data} = await userApi.editUser(editedUser);

    const alertColor = data.executed ? colors.success : colors.danger;

    showAlert(message, alertColor);
};

const validateField = (field) => {
    const fieldName = field.getAttribute('field');

    const formRegex = {
        email: regex.email,
        name: regex.commonTextField,
        first_lastname: regex.commonTextField,
        second_lastname: regex.commonTextField
    };

    return formRegex[fieldName].test(field.value);
};

submitEditBtn.onclick = (event) => submitEditProfile(event)
