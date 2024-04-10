import {getAllUsers} from "../common/api/user.api.js";
import {createElementString} from "../common/services/common.service.js";

const usersTableBody = document.querySelector('#usersTable tbody');
const usersTableHeaders = document.querySelectorAll('#usersTable th');

onload = async () => {
    const data = await getAllUsers();

    console.log(data)

    data.users.forEach(user => {
        addUser(user)
    })
}

const addUser = (user) => {
    // Cogemos las cabeceras dentro de la tabla, y haciendo un bucle, comprobamos que campo pertenece a cada uno para
    // poder introducir los datos del objeto en su columna correspondiente.

    const row = document.createElement('tr');
    row.classList.add('is-vcentered')

    for (const header of usersTableHeaders) {
        addRow(header, user, row);
    }

    usersTableBody.append(row);
};

function addRow(header, user, row) {
    const headerFieldname = header.getAttribute('field');
    const isProfilePic = header.getAttribute('profilePic') !== null;
    const field = user[headerFieldname];

    if (field) {
        const column = document.createElement('td');

        if (isProfilePic) {
            console.log(field)
            const image = createElementString(`<figure class="image is-square is-32x32"><img class="is-rounded" src="${field}"></figure>`)
            column.append(image)
        } else {
            column.innerHTML = field;
        }

        row.append(column);
    }
}
