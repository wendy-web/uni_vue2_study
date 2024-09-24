import { dayjs } from "element-plus";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string) {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path);
  return isExternal;
}
/**
 * @description 获取当前日期前一天的23时59分59秒的时间戳 例: 6月6日前一天6月5日23时59分59秒的时间戳
 * @returns 时间戳(毫秒)
 *
 */
export function beforeTimestamp() {
  return dayjs().subtract(1, "day").hour(23).minute(59).second(59).valueOf();
}

/**
 *
 * @param date 需要获取时间戳的日期,例: 2023-06-07
 * @returns 时间戳(毫秒)
 */
export function getTimestamp(date: string) {
  return dayjs(date).valueOf();
}

/**
 * @param date 需要进行YYYY-MM-DD格式化日期的参数
 * @returns YYYY-MM-DD格式日期
 */
export function formartDate(date: string) {
  return date ? dayjs(date).format("YYYY-MM-DD") : "";
}

/**
 * @example 判断date 是否在 diffDate 之前
 */
export function checkIsBeforeDate(date: string, diffDate: string, formatStr?: string) {
  let result: boolean;
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
export function checkIsAfterDate(date: string, diffDate: string) {
  let result = dayjs(date).isAfter(dayjs(diffDate));
  return result;
}

/**
 * @example 判断date和diffDate 是否相同或之前
 */
export function checkIsSameOrBeforeDate(date: string, diffDate: string) {
  let result = dayjs(date).isSameOrBefore(dayjs(diffDate));
  return result;
}

/**
 * @example 判断date和diffDate 是否相同或之后
 */
export function checkIsSameOrAfterDate(date: string, diffDate: string) {
  let result = dayjs(date).isSameOrAfter(dayjs(diffDate));
  console.log("🚀 ~ checkIsSameOrAfterDate ~ result:", result);
  return result;
}
