import dayjs from "./dayjs.min.js";

/**
 * @param {string} date 需要进行YYYY-MM-DD格式化日期的参数
 * @returns YYYY-MM-DD格式日期
 */
export function formartDate(date) {
    return date ? dayjs(date).format("YYYY-MM-DD") : "";
}
/**
 * @example 判断date 是否在 diffDate 之前
 */
export function checkIsBeforeDate(date, diffDate, formatStr) {
    let result = false;
    if (formatStr) {
        result = dayjs(date).isBefore(dayjs(diffDate).format(formatStr));
    } else {
        result = dayjs(date).isBefore(dayjs(diffDate));
    }
    return result;
}

/**
 * @example 判断date 是否在 diffDate 之后
 */
export function checkIsAfterDate(date, diffDate) {
    let result = dayjs(date).isAfter(dayjs(diffDate));
    return result;
}
