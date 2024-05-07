import {getAllTasks} from "../common/api/task.api.js";
import {capitalize, createElementFromString} from "../common/services/common.service.js";
import {closeModalById, openModalById, openModal, closeModal, createModal} from "../common/services/modal.service.js";
import {colors} from "../common/consts.js";
import * as taskApi from "../common/api/task.api.js"
import {showAlert} from "../common/services/message.service.js";
import {changeProgressValue} from "../common/services/input.service.js"
import * as userApi from "../common/api/user.api.js";

const userRoles = [];

onload = async () => {
    const userRoles = await userApi.getUserRoles();
}