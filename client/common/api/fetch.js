import * as CONSTANTS from "../consts.js";
import {TOKEN_STORAGE_KEY} from "../consts.js";

export class Fetch {
    static async post(route, jsonBody, sendToken = true) {
        let url = `${CONSTANTS.API_URL}/${route}`

        const options = {
            "method": CONSTANTS.REST_METHODS.POST,
            "headers": {
                "Content-Type": "application/json",
            },

            "body": JSON.stringify(jsonBody)
        };

        if (sendToken === true) {
            const token = localStorage.getItem(TOKEN_STORAGE_KEY);

            if (!token) return false;

            options.headers["Authorization"] = `Bearer ${token}`
        }

        try {
            const response = await fetch(url, options);

            // if (response.status === 403) Common.redirectTo('public/login');
            console.log(JSON.stringify(jsonBody))

            let body = await response.json();
            let data = await body.data;

            if (!data) {
                return body;
            }

            data.message = body.message

            return data;
        } catch (error) {
            console.log(error)

            return false;
        }
    }

    static async get(route, args, sendToken = true) {
        let uri = String(route);

        if (!uri.endsWith('/')) uri += '/';

        const options = {
            "method": CONSTANTS.REST_METHODS.GET,
            headers: {}
        };

        if (sendToken === true) {
            const token = localStorage.getItem(TOKEN_STORAGE_KEY) || null;

            if (!token) return false;

            options.headers["Authorization"] = `Bearer ${token}`
        }


        let url = `${CONSTANTS.API_URL}/${uri}`;

        if (args instanceof Array) {
            args.forEach(arg => {
                url += `${arg}/`
            });
        }

        let body;

        try {
            let response = await fetch(url, options);

            // if (response.status === 403) Common.redirectTo('public/login');
            body = await response.json();
        } catch (error) {
            console.log(error);

            return null;
        }

        if (body.data) {
            return await body.data;
        } else {
            return await body;
        }
    }

    static async put(route, jsonBody, args, sendToken = true) {
        let uri = String(route);

        if (!uri.endsWith('/')) uri += '/';

        let url = `${CONSTANTS.API_URL}/${uri}`;

        if (args) {
            args.forEach(arg => {
                url += `${arg}/`
            });
        }

        const options = {
            "method": CONSTANTS.REST_METHODS.PUT,
            "headers": {
                "Content-Type": "application/json",
            },

            "body": JSON.stringify(jsonBody)
        };

        if (sendToken === true) {
            const token = localStorage.getItem(TOKEN_STORAGE_KEY) || null;

            if (!token) return false;

            options.headers["Authorization"] = `Bearer ${token}`
        }

        try {
            const response = await fetch(url, options);
            const body = await response.json();

            return await body;
        } catch (error) {
            console.log(error)

            return false;
        }
    }

    static async delete(route, body, args, sendToken = true) {
        let url = `${CONSTANTS.API_URL}/${route}`;

        const options = {
            method: CONSTANTS.REST_METHODS.DELETE,
            headers: {}
        };

        if (body) {
            options.headers = {};
            options.headers["Content-Type"] = "application/json"
            options.body = JSON.stringify(body);
        }

        if (args) url += `${args}`;

        console.log(url);

        if (sendToken === true) {
            const token = localStorage.getItem(TOKEN_STORAGE_KEY) || null;

            if (!token) return false;

            options.headers["Authorization"] = `Bearer ${token}`
        }

        try {
            console.log(options);
            const response = await fetch(url, options);
            const body = await response.json();

            return await body;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}