// 校验姓名
export function checkName(name) {
    const reg = /^(?!.*?[\u3000-\u303F\u4DC0-\u4DFF\u2800-\u28FF\u3200-\u32FF\u3300-\u33FF\u2700-\u27BF\u2600-\u26FF\uFE10-\uFE1F\uFE30-\uFE4F])[\u4e00-\u9fbb\u2E80-\uFE4F.·]+$/;

    if (!reg.test(name)) {
        return false;
    }

    return true;
}
/**
 * 验证手机号格式
 * @param phone 要验证的手机号
 * @returns {boolean}
 */
export function checkUserPhone(phone) {
    if (!/^1[3456789]\d{9}$/.test(phone)) {
        return false;
    }
    return true;
}

export function getSearchName(name) {
    if (!name) return null;
    // 获取 URL 参数
    const queryString = window.location.search;
    // 创建 URLSearchParams 对象
    const searchParams = new URLSearchParams(queryString);
    return searchParams.get(name);
}
