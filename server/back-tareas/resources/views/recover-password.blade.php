<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
    </head>
    <body>
    <h1>Correo de recuperación de contraseña.</h1>
    <p>Buenas {{$user->name}}, hemos detectado una petición para cambiar la contraseña de tu cuenta.</p>
    <p>Si este email ha sido enviado de forma inesperada, simplemente ignoralo. De lo contrario, para continuar debes introducir un codigo de verificación en el cuadro de texto que se te indique en la pagina.</p>
    <p>El codigo es el siguiente:</p>
    <h2>{{$code}}</h2>
    </body>
</html>
