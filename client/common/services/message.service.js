

const setInputSuccess = (input, message = '') => {
    // Seleccionamos la etiqueta asociada al input introducido, para cambiar su estilo.
    const label = document.querySelector(`label[for=${input.id}]`);

    if (label) {
        label.className = 'block mb-2 text-sm font-medium text-green-700 dark:text-green-500';
    }

    input.className = 'bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500'

    if (message.length > 0) {
        const foot = `
            <p className="mt-2 text-sm text-red-600 dark:text-red-500">Some error message.</p>`

        input.after()
    }
}