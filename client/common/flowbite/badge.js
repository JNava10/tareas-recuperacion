import {createElementFromString} from "../services/common.service.js";

export const getDefaultBadge = (content, color) => {
    const badgeHtml = `<span class="bg-${color}-100 text-${color}-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-${color}-900 dark:text-${color}-300">${content}</span>`;

    return {
        html: badgeHtml,
        element: createElementFromString(badgeHtml)
    }
}

export const getRoundedBadge = (content, color) => {
    const badgeHtml = `<span class="bg-${color}-100 text-${color}-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-${color}-900 dark:text-${color}-300">${content}</span>`;

    return {
        html: badgeHtml,
        element: createElementFromString(badgeHtml)
    }
}

export const getLargeBadge = (content, color) => {
    const badgeHtml = `<span class="bg-${color}-800 dark:text-${color}-300-100 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-${color}-900 dark:text-${color}-300">${content}</span>`;

    console.log(badgeHtml)

    return {
        html: badgeHtml,
        element: createElementFromString(badgeHtml)
    }
}