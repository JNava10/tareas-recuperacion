const API_CONN =  {
    ipAddress: '127.0.0.1',
    port: 8000,
    rootEndpoint: 'api'
};

export const API_URL = `http://${API_CONN.ipAddress}:${API_CONN.port}/${API_CONN.rootEndpoint}`;
export const REST_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
};

// LOCAL STORAGE KEYS //

export const TOKEN_STORAGE_KEY = 'token';

// REGEXP //

export const emailRegex = /[A-Za-z0-9]{4,25}@[A-Za-z]{3,10}.[A-Za-z]{2,7}$/;
export const passwordRegex = /[\w!"·$%&\/(\\)=?*¿+\-`<>.:,;|@#~½¬{\[\]}ªº]{3,20}/;
export const userNameRegex = /[A-Za-z]{3,12}/;
export const userFirstSurnameRegex = userNameRegex;
export const userSecondSurnameRegex = userNameRegex;

// BULMA //

export const colors = {
    primary: 'is-primary',
    link: 'is-link',
    info: 'is-info',
    success: 'is-success',
    warning: 'is-warning',
    danger: 'is-danger',
}