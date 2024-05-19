import {getSelfData} from "../common/api/user.api.js";
import {showAlert} from "../common/services/message.service.js";
import {colors} from "../common/consts.js";
import * as userApi from "../common/api/user.api.js";

async function getUserData() {
    const user = (await getSelfData())[0];

    handleUserData(user)
}

onload = async () => {
    await getUserData();
}

const handleUserData = (user) => {
    document.querySelector('#userProfilePic').src = user.pic_url;
    document.querySelector('#uploadProfilePhoto').onclick = () => showUploadInput()
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