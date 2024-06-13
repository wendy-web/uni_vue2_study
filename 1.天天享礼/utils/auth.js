const baseUrl = getBaseUrl();
export function setGift(data) {
    setStorage('gift', data);
}
export function getGift() {
    return getStorage('gift');
}
export function getAutoPrivacy() {
    return getStorage('isAutoPrivacy');
}
export function setAutoPrivacy(data) {
    setStorage('isAutoPrivacy', data);
}
export function setAutoLogin(data) {
    setStorage(`${baseUrl}_isAutoLogin`, data);
}
export function getAutoLogin() {
    let isAutoLogin = getStorage(`${baseUrl}_isAutoLogin`);
    return isAutoLogin;
}
// 只展示一次领现的弹窗
export function setDrawShowDiaStorage() {
    setStorage(`${baseUrl}_drawDiaShow`, 1);
}
export function getDrawShowDiaStorage() {
    let isAutoLogin = getStorage(`${baseUrl}_drawDiaShow`);
    return isAutoLogin;
}
export function setToken(data) {
    setStorage('token', data);
}
export function getToken() {
    return getStorage('token');
}

// 弹窗的类别
export function setDiaType(data) {
    setStorage('diaType', data);
}
export function getDiaType() {
    return getStorage('diaType');
}
export function setCardNewShow(data) {
    setStorage('cardNewShow', data);
}

export function getCardNewShow() {
    return getStorage('cardNewShow') || false;
}

export function removeToken() {
    uni.removeStorageSync('token');
}

export function getUserInfo() {
    let userInfo = getStorage('/api/profile/myInfo');
    if (userInfo) {
        return JSON.parse(userInfo).data;
    }
    return {
        avatar_url: null,
        birthday: null,
        constellation: 0,
        create_time: "",
        credits: "0",
        disable: 0,
        id: null,
        language: null,
        mobile: null,
        nick_name: null,
        openid: "",
        unionid: ""
    };
}

export function removeGetUserInfo() {
    uni.removeStorageSync('/api/profile/myInfo');
}
/*获取经纬度*/
export function getLocation() {
    let cache = getStorage('getUserLocation');
    cache = cache && JSON.parse(cache);
    return cache && cache.data;
}

export function setStorage(key, data) {
    try {
        uni.setStorageSync(key, data);
    } catch (e) {
        //TODO handle the exception
    }
}

export function getStorage(key) {
    let cache = null;
    try {
        cache = uni.getStorageSync(key);
    } catch (e) {
        cache = '';
    }
    return cache;
}
export function getSocketUrl() {
    const SOCKETURL = 'wss://ttxl-test.y1b.cn/ttxl/'; //测试
    // const SOCKETURL = 'wss://socket.y1b.cn/ttxl/'; //正式
    return SOCKETURL;
}
export function getENV() {
    // const getENV = 'loca'; // 本地
    const getENV = 'test'; // 测试
    // const getENV = 'production'; // 正式
    return getENV;
}
export function getBaseUrl() {
    const env = getENV();
    let BASEURL = '';
    if (env == 'test') {
        BASEURL = 'https://ttxl-test.y1b.cn'; // 测试
    } else if (env == 'production') {
        BASEURL = 'https://ttxl.y1b.cn'; // 正式
    } else {
        BASEURL = 'http://192.168.1.68:82'; // 本地
    }
    return BASEURL
}
// 彬纷享礼
export function bfAppid() {
    let bfAppid = 'wxbb29c5aec6891525';
    return bfAppid;
}
export function getFileUrl() {
    return 'https://file.y1b.cn';
}
// 腾讯云COS上的url地址
export function getImgUrl() {
    return 'https://file.y1b.cn/public/img/ttxl/';
}

// 当前的设备
export function getPlatform() {
    let platform = wx.getSystemInfoSync().platform;
    const env = getENV();
    if (env == 'loca') {
        platform = "ios";
    }
    // platform = "android";
    // platform = "ios";
    if (env == 'production') {
        platform = wx.getSystemInfoSync().platform;
    }
    return platform;
}
export function formatPrice(price, type) {
    // 先转类型为数字，再保留2位小数
    price = Number(price).toFixed(2);
    if (!price) return;
    let splitPrice = price.split(".");
    if (type == 1) {
        return `¥<span style="font-weight:600;font-size: 16px">${splitPrice[0]}.<span style="font-size: 13px;">${splitPrice[1]}</span></span>`;
    }
    if (type == 2) {
        return `¥<span style="font-weight:600;font-size: 20px">${splitPrice[0]}.<span style="font-size: 14px;">${splitPrice[1]}</span></span>`;
    }
    if (type == 3) {
        return `¥<span style="font-weight:600;font-size: 24px">${splitPrice[0]}.<span style="font-size: 15px;">${splitPrice[1]}</span></span>`;
    }
    if (type == 4) {
        return `¥<span style="font-weight:600;font-size: 26px">${splitPrice[0]}.<span style="font-size: 15px;">${splitPrice[1]}</span></span>`;
    }
    if (type == 5) {
        return `¥<span style="font-weight:600;font-size: 28px">${splitPrice[0]}.<span style="font-size: 16px;">${splitPrice[1]}</span></span>`;
    }
}
// 翻看webview的协议
export function toAgreeLook(link) {
    const linkUrl = getBaseUrl() + link;
    this.$go(`/pages/webview/webview?link=${linkUrl}#ISLOGIN`);
}

export function getUrlKey(pageUrl, name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(pageUrl) || [, ""])[1].replace(/\+/g, '%20')) || null;
}
