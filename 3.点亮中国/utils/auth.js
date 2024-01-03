export function setToken(data) {
    setStorage('token', data);
}

export function getToken() {
    return getStorage('token');
}

export function setAuthorization(data) {
    setStorage('authorization', data);
}

export function getAuthorization() {
    return getStorage('authorization');
}

export function removeToken() {
    uni.removeStorageSync('token');
}

export function setScanNow(data) {
    setStorage('scanNow', data);
}

export function getScanNow() {
    return getStorage('scanNow');
}
export function setAutoLogin(data) {
    setStorage(`isAutoLogin`, data);
}
export function getAutoLogin() {
    return getStorage(`isAutoLogin`);
}
export function setAppLaunchNum(isClear) {
    if (isClear) return setStorage('AppLaunchNum', null);
    let num = getStorage('AppLaunchNum') || 0
    setStorage('AppLaunchNum', ++num);
}

export function getAppLaunchNum() {
    return getStorage('AppLaunchNum') || 0;
}

export function setUserGuide() {
    setStorage('UserGuide', true);
}

export function getUserGuide() {
    return getStorage('UserGuide') || false
}

export function getUserInfo() {
    let userInfo = getStorage('/api/user');
    if (userInfo) {
        return JSON.parse(userInfo).data;
    }
    return {
        avatar_url: '',
        balance: "",
        city_num: 0,
        com_cert_num: 0,
        condition: 0,
        credits: "0",
        gender: 0,
        love: 0,
        medal_num: 0,
        mobile: '',
        nick_name: '',
        team_id: ''
    };
}

export function removeGetUserInfo() {
    uni.removeStorageSync('/api/user');
}


/*获取经纬度*/
export function getLocation() {
    let cache = getStorage('getUserLocation');
    cache = cache && JSON.parse(cache);
    return cache && cache.data;
}

/*设置h5传递的用户信息*/
export function getH5UserInfo() {
    let cache = getStorage('h5UserInfo');
    cache = cache && JSON.parse(cache);
    return cache;
}

/*获取经纬度*/
export function setH5UserInfo(data) {
    if (data) {
        return setStorage('h5UserInfo', JSON.stringify(data));
    }
}


export function setCurrMedal(data) {
    setStorage('currMedal', data);
}

export function getCurrMedal() {
    let cache = getStorage('currMedal');
    return cache
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