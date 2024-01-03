import ROOTVUE from "@/main.js";

export const isChinese = (str) => {
    if (/^[\u3220-\uFA29]+$/.test(str)) {
        return true;
    } else {
        return false;
    }
};

export const storageRead = (key) => {
    try {
        return uni.getStorageSync(key) || "";
    } catch (e) {}
};

export const storageSave = (key, value) => {
    try {
        uni.setStorageSync(key, value);
    } catch (e) {}
};

export const storageRemove = (key) => {
    try {
        uni.removeStorageSync(key);
    } catch (e) {}
};

export const storageClear = () => {
    try {
        uni.clearStorageSync();
    } catch (e) {}
};

export const setNavigationBarTitle = (title) => {
    try {
        uni.setNavigationBarTitle({
            title,
        });
    } catch (e) {}
};

export const stopPullDownRefresh = () => {
    try {
        uni.stopPullDownRefresh();
    } catch (e) {}
};

export const makePhoneCall = (phoneNumber) => {
    try {
        uni.makePhoneCall({
            phoneNumber,
        });
    } catch (e) {}
};

/**
 * @param {phone}  number 要验证的手机号
 * @description 验证手机号
 */

export function verifyPhone(phone) {
    if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)) {
        return false;
    }
    return true;
}

/**
 * @param {str}  string 要解码字符串
 * @description {*} LoRaWAN base64 解析函数集合
 */
export function loRaWANBase64Analysis(str) {
    return addReplace(
        clearReplace(
            clearReplace(
                clearReplace(hexTostring(charToHex(base64Decode(str))), "\r"),
                "\n"
            ),
            " "
        ).toUpperCase(),
        2,
        " "
    );
}

/**
 * @param {str}  string 要加码 hex
 * @description {*} LoRaWAN base64 加密
 */
export function loRaWANBase64Encryption(str) {
    return base64Encode(strToAscll(clearReplace(str, " ").toLowerCase()));
}

/**
 * @param {*} 字符转 hex字符
 */
export function charToHex(str) {
    var out, i, h;
    out = "";
    i = 0;
    while (i < str.length) {
        h = str.charCodeAt(i++).toString(16);
        h.length > 1 ? (h = h) : (h = "0" + h);
        out += "\\0x" + h;
        out += i > 0 && i % 8 == 0 ? "\r\n" : ", ";
    }
    return out;
}

/**
 * @param {*} hex 字符转字符串
 */
export function hexTostring(str) {
    let strs = str.split("\\0x").join("").split(",").join("").split("↵").join("");
    return strs.replace(/\s+$/, "");
}

/**
 * @param {*} 转换 ascill 码
 */
export function strToAscll(strs) {
    let result = "";
    for (let item = 0; item < strs.length / 2; item++) {
        result += String.fromCharCode(parseInt(strs.substr(2 * item, 2), 16));
    }
    return result;
}

/**
 * @param {*} String 按位增加字符
 * @param {lens} 间隔位数
 * @param {strs} 增加的字符
 */
export function addReplace(str, lens, strs) {
    let result = "";
    for (var i = 0, len = str.length; i < len; i++) {
        result += str[i].toString();
        if (i % lens == lens - 1) result += strs;
    }
    result = result.substring(0, result.lastIndexOf(strs));
    return result;
}

/**
 * @param {*} 清除 String，所有特定的字符
 */
export function clearReplace(str, strs) {
    let re = new RegExp("" + strs, "g");
    str = str.replace(re, "");
    return str;
}

/**
 * @param {*} base64 解码
 */
export function base64Decode(str) {
    var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        62, -1, -1, -1,
        63,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61, -1, -1, -1, -1, -1, -1, -1,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25, -1, -1, -1, -1, -1, -1,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51, -1, -1, -1, -1, -1
    );
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1) break;

        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1) break;

        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61) return out;
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1) break;

        out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2));

        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61) return out;
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1) break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

/**
 * @param {str}  string 要编码字符串
 * @description base64 编码
 */

export function base64Encode(str) {
    var base64EncodeChars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var out, i, len;
    var c1, c2, c3;

    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xf) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3f);
    }
    return out;
}

/**
 * @param {length}  Number 字符串长度
 * @description 随机生成字符串
 */

export function randomString(length) {
    length = length || 18;
    let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
    let a = t.length;
    let n = "";
    for (let i = 0; i < length; i++) {
        n += t.charAt(Math.floor(Math.random() * a));
    }
    return n;
}

/**
 * @param {length} Number
 * @description 将数组均等份分成多维数组
 */

export function averageCutArray(array, subLength) {
    let index = 0;
    let newArr = [];
    while (index < array.length) {
        newArr.push(array.slice(index, (index += subLength)));
    }
    return newArr;
}

/**
 * @param {str} type // h-full-navbar h-full-navbar-tabbar
 * @description 获取页面高度
 */

export function getPageContentHeight(type) {
    let style = {};
    // #ifdef H5
    if (type === 'h-full') {
        style = {
            height: `calc(100vh)`
        }
    }
    if (type === 'h-full-navbar') {
        style = {
            height: `calc(100vh - 44px)`
        }
    }
    if (type === 'h-full-navbar-tabbar') {
        style = {
            height: `calc(100vh - 44px - 50px)`
        }
    }
    // #endif
    let insetTop = ROOTVUE.$u.addUnit(ROOTVUE.$u.sys().statusBarHeight, 'px');
    // #ifdef APP-NVUE
    let insetBottom = ROOTVUE.$u.addUnit(ROOTVUE.$u.sys().safeAreaInsets.bottom, 'px');
    if (type === 'h-full') {
        style = {
            height: `calc(100vh)`
        }
    }
    if (type === 'h-full-navbar') {
        style = {
            height: `calc(100vh - ${insetTop} + ${insetBottom} - 44px)`
        }
    }
    if (type === 'h-full-navbar-tabbar') {
        style = {
            height: `calc(100vh - ${insetTop} + ${insetBottom} - 44px - 50px)`
        }
    }
    // #endif
    // #ifndef APP-NVUE || H5
    if (type === 'h-full') {
        style = {
            height: `calc(100vh)`,
            height1: `calc(100vh)`
        }
    }
    if (type === 'h-full-navbar') {
        style = {
            height: `calc(100vh - ${insetTop} - constant(safe-area-inset-bottom) - 44px)`,
            height1: `calc(100vh - ${insetTop} - env(safe-area-inset-bottom) - 44px)`
        }
    }
    if (type === 'h-full-navbar-tabbar') {
        style = {
            height: `calc(100vh - ${insetTop} - constant(safe-area-inset-bottom) - 44px - 50px)`,
            height1: `calc(100vh - ${insetTop} - env(safe-area-inset-bottom) - 44px - 50px)`
        }
    }
    // #endif
    return style
}

export function getTopBottom(topScroll) {
    let insetTop = ROOTVUE.$u.addUnit(ROOTVUE.$u.sys().statusBarHeight, 'px');
    // #ifdef APP-NVUE
    let style = {
            height: `calc(100vh - ${insetTop} - 44px - ${topScroll}rpx)`
        }
        // #endif
    return style;
}