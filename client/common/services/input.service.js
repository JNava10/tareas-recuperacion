// Basado en la documentación de Bulma: https://bulma.io/documentation/components/modal/#javascript-implementation-example

export const changeProgressValue = (event) => {
    const width = event.target.offsetWidth - event.target.style.borderWidth;
    const rect =  event.target.getBoundingClientRect();
    const x = Math.round(event.pageX - rect.left);

    const progress = Math.round(x / width * 100);

    // if (progress === event.target.value) return;

    event.target.value = progress;
}