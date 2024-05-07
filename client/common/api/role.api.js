import {Fetch} from "./fetch.js";
import {EditedUser} from "../class/user/req/editedUser.js";
import {PasswordEdited} from "../class/user/req/passwordEdited.js";
export const getAllRoles = async () => {
    return await Fetch.get('role', [], false);
};
