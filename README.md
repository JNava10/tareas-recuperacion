# Proyecto de recuperación de la primera evaluación

## Instalación
1. Extraer el archivo .zip de la release.
2. Es recomendable copiar el .env de la entrega y pegarlo en el directorio `server/back-tareas`.
3. Introducir los siguientes comandos:
```
cd server/back-tareas
composer update
php artisan key:generate
cd ../../client
npm i
```
4. Instalar el archivo .sql de la entrega/release en cualquier servidor MySQL.

## Ejecución del proyecto
1. En el directorio `client/`: `npm run start`
2. En el directorio `server/`: `php artisan serve`
3. En cualquier navegador, abrir la ruta `http://localhost:8000/login`.

# Credenciales por defecto en el SQL (contraseña: `daw`):
1. juannr2002@gmail.com

# Endpoints de la API
## Autenticacion
### `/login` - Iniciar sesión en el sistema.
`POST`
JSON de entrada:
- Email (str): Email que se introduce como credencial 
- Contraseña (str): Contraseña en texto plano que se introduce como credencial 
```json
{
    "email": "juannr2002@gmail.com",
    "password": "daw"
}
```

JSON de salida:
- Logged: Indica si se ha iniciado sesión de forma correcta.
- Token: Token de Sanctum que servirá para iniciar sesión.
```json
{
    "message": "Se ha iniciado sesión correctamente",
    "data": {
        "logged": true,
        "token": true
    }
}
```

### `/gen_recover_code` - Generar codigo de recuperacion de contraseña
`POST`
JSON de entrada:
- Email (str): Email del correo de la cuenta a recuperar.
- Code (str): Codigo de recuperacion de la contraseña.
```json
{
    "email": "juannr2002@gmail.com",
    "code": "123456"
}
```

JSON de salida:
- Executed: Indica si todo ha salido bien, o ha habido algún fallo.
```json
{
    "message": "Se ha iniciado sesión correctamente",
    "data": {
        "executed": true
    }
}
```

### `/check_recover_code` - Comprobar codigo de recuperacion de contraseña
`POST`
JSON de entrada:
- Email (str): Email del correo de la cuenta a recuperar 
```json
{
    "email": "juannr2002@gmail.com"
}
```
JSON de salida:
- Executed (bool): Indica si se ha completado correctamente la operacion o no. 
- Key (str): Clave de un solo uso    con la que podremos cambiar la contraseña.
```json
{
    "executed": true,
    "key": "3m134d",
}
```

### `/change_password` - Cambiar contraseña de un usuario con un correo de recuperacion.
`POST`
JSON de entrada:
- Email (str): Email del correo de la cuenta a recuperar 
- Password (str): Contraseña nueva en texto plano de la cuenta a recuperar 
- Key (str): Clave de un solo uso proporcionada por la API.
```json
{
    "email": "juannr2002@gmail.com",
    "password": "daw1",
    "key": "3m134d",
}
```

### `/change_password` - Cambiar contraseña de un usuario con un correo de recuperacion.
`POST`
JSON de entrada:
- Email (str): Email del correo de la cuenta a recuperar 
```json
{
    "email": "juannr2002@gmail.com"
}
```
JSON de salida:
- Executed (bool): Indica si se ha completado correctamente la operacion o no. 
```json
{
    "executed": true,
}
```

## Usuarios (`/user`)
### `/admin` - Obtener todos los usuarios administradores existentes, borrados o no.
`GET`

JSON de salida:
- Executed (bool): Indica si se ha completado correctamente la operacion o no. 
```json
{
    "executed": true,
    "users": [
        {
            "id": 1
        }
    ],
}
```

### `/` - Obtener todos los usuarios administradores existentes, borrados o no.
`GET`

JSON de salida:
- Executed (bool): Indica si se ha completado correctamente la operacion o no. 
```json
{
    "executed": true,
    "users": [
        {
            "id": 1
        }
    ],
}
```

### `/dev` - Obtener todos los usuarios programadores existentes, borrados o no.
`GET`

JSON de salida:
- Executed (bool): Indica si se ha completado correctamente la operacion o no. 
```json
{
    "executed": true,
    "users": [
        {
            "id": 1
        }
    ],
}
```

### `/data` - Editar datos de un usuario
`PUT`
JSON de entrada:
- ID (str): Email del correo de la cuenta a recuperar 
- Name (str): Nombre nuevo del usuario 
- FirstSurname (str): Primer apellido nuevo del usuario
- SecondSurname (str): Segundo apellido nuevo del usuario
```json
{
    "id": "1",
    "name": "juan",
    "firstSurname": "navarrete",
    "secondSurname": "rivero",
}
```
JSON de salida:
- Executed (bool): Indica si se ha completado correctamente la operacion o no. 
```json
{
    "executed": true,
}
```

### `/password` - Editar contraseña de un usuario
`PUT`
JSON de entrada:
- ID (str): Email del correo de la cuenta a recuperar 
- Password (str): Contraseña nueva del usuario
```json
{
    "id": "1",
    "password": "juan"
}
```
JSON de salida:
- Executed (bool): Indica si se ha completado correctamente la operacion o no. 
```json
{
    "executed": true,
}
```

### `/password` - Editar contraseña de un usuario
`PUT`
JSON de entrada:
- ID (str): Email del correo de la cuenta a recuperar 
- Password (str): Contraseña nueva del usuario
```json
{
    "id": "1",
    "password": "juan"
}
```
JSON de salida:
- Executed (bool): Indica si se ha completado correctamente la operacion o no. 
```json
{
    "executed": true,
}
```

### `/{id}` - Borrar un usuario (soft-delete)
`DELETE`

JSON de salida:
- Executed (bool): Indica si se ha completado correctamente la operacion o no. 
```json
{
    "executed": true,
}
```

### `/restore` - Reactivar un usuario
`POST`
JSON de entrada:
- Id (str): Indica si se ha completado correctamente la operacion o no. 
```json
{
    "id": "1",
}
```

JSON de salida:
- Executed (bool): Indica si se ha completado correctamente la operacion o no. 
```json
{
    "executed": true,
}
```

### `/` - Crear un usuario
`POST`
- Name (str): Nombre del nuevo usuario. 
- Email (str): Email del nuevo usuario. 
- FirstSurname (str): Primer apellido del nuevo usuario. 
- SecondLastname (str): Nombre del nuevo usuario. 
- Roles (Array<int>): Array con los ID de los roles que se quieran poner. 
```json
{
    "name": "fernando",
    "email": "faranzabe@gmail.com",
    "first_lastname": "gomez",
    "second_lastname": "aranzabe",
    "password": "daw",
    "roles": [1, 2],
}
```

JSON de salida:
- Executed (bool): Indica si se ha completado correctamente la operacion o no. 
```json
{
    "message": "Se ha guardado el usuario correctamente."
    "data": {"executed": true}
}
```


### `/role` - Obtener los roles existentes 
`GET`


JSON de salida:
- Executed (bool): Indica si se ha completado correctamente la operacion o no. 
```json
{
    "message": "Se han obtenido los roles correctamente.",
    "data": {
        "executed": true,
        "roles": [
            {
                "id": 1,
                "name": "programador"
            }
        ]
    }
}
```

## Tareas
### `/` - Obtener todas las tareas
`GET`


JSON de salida:
- Tasks (array): Tareas que no están borradas en el sistema
```json
{
    "message": "Se han obtenido las tareas correctamente.",
    "data": {
        "executed": true,
        "tasks": [
            {
                "id": 1,
                "name": "tarea 1",
                "description": "descripción cualquiera",
                "scheduled_hours": "descripción cualquiera",
            }
        ]
    }
}
```

### `/{id}` - Borrar una tarea
`DELETE`


JSON de salida:
- Executed (bool): Indica si se ha completado correctamente la operacion o no. 
```json
{
    "message": "Se ha borrado la tarea correctamente.",
    "data": {
        "executed": true,
    }
}
```

### `/{id}` - Editar una tarea
`PUT`

JSON de entrada:
- Name (str): Nombre de la tarea
- Description (str): Descripcion de la tarea 
- ScheduledHours (int): Horas planeadas de la tarea 
- RealizedHours (int): Horas planeadas de la tarea 
- Progress (int): Progress
```json
{
    "name": "Tarea 2",
    "description": "cualquiera",
    "scheduledHours": 10,
    "realizedHours": 2,
    "progress": 12,
}
```

JSON de salida:
- Executed (bool): Indica si se ha completado correctamente la operacion o no. 
```json
{
    "message": "Se ha editado la tarea correctamente.",
    "data": {
        "executed": true,
    }
}
```

### `/` - Crear una tarea
`POST`

JSON de entrada:
- Name (str): Nombre de la tarea
- Description (str): Descripcion de la tarea 
- ScheduledHours (int): Horas planeadas de la tarea 
- Progress (int): Progress
```json
{
    "name": "Tarea 2",
    "description": "cualquiera",
    "scheduledHours": 10,
    "progress": 12,
}
```

JSON de salida:
- Executed (bool): Indica si se ha completado correctamente la operacion o no. 
```json
{
    "message": "Se ha creado la tarea correctamente.",
    "data": {
        "executed": true,
    }
}
```
