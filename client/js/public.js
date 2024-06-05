import {buildNavbar} from "../common/services/navbar.service.js";

onload = async () => {
    await buildNavbar();
}