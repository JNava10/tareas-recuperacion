import {Fetch} from "./fetch.js";
import {EditedUser} from "../class/user/req/editedUser.js";
import {PasswordEdited} from "../class/user/req/passwordEdited.js";


export const getAllTasks = async () => {
    return await Fetch.get('task', [], false);
};