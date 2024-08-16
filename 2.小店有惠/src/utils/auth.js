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
    setStorage('isAutoLogin', data);
}
export function getAutoLogin() {
    return getStorage('isAutoLogin');
}
export function setUnionId(data) {
    setStorage('unionid', data);
}
export function getUnionId() {
    return getStorage('unionid');
}
export function setToken(data) {
    setStorage('token', data);
}

export function getToken() {
    return getStorage('token');
}

export function setCardNewShow(data) {
    setStorage('cardNewShow', data);
}

export function getCardNewShow() {
    return getStorage('cardNewShow') || false;
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

export function getUserInfo() {
    let userInfo = getStorage('/api/user/myInfo');
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
    uni.removeStorageSync('/api/user/myInfo');
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
// 当前的版本号
export function getVersion() {
    let version = wx.getAccountInfoSync().miniProgram.version
    version = 'v' + (version || '1.0.0')
    return version;
}
/**
 * develop	开发版
 * trial	体验版
 * release	正式版
 * @returns
 */
export function getENV() {
    let env = '';
    env = 'trial'; // 体验测试版
    // env = 'release';
    // env = 'loc';
    return env;
    let cache = getStorage('wechatAccountInfo')
    if (cache) {
        cache = JSON.parse(cache)
        return cache.miniProgram.envVersion
    } else {
        //获取小程序版本号
        const wechatAccountInfo = uni.getAccountInfoSync(wechatAccountInfo);
        setStorage('wechatAccountInfo', JSON.stringify(wechatAccountInfo))
        const envVersion = wechatAccountInfo.miniProgram.envVersion || 'release';
        return envVersion
    }
}
// export function getDevice(){
// 	let cache = getStorage('xh-navbar-system');
// 	let device = ''
// 	if(cache){
// 		device =  cache.platform
// 	}else{
// 		device =  wx.getSystemInfoAsync().platform
// 	}
// 	// 测试需删除
// 	device = getENV() == 'develop' ?'ios' : device
// 	return device
// }

export function getBaseUrl() {
    let env = getENV();
    let BASEURL = '';
    if (env == 'release') {
        BASEURL = 'https://xdyh.y1b.cn'; // 正式
    } else if (env == 'trial') {
        BASEURL = 'https://xdyh-dev.y1b.cn'; // 测试
    } else {
        BASEURL = 'http://192.168.1.68:82'; // 本地
    }
    return BASEURL;
}
// 彬纷有礼
export function bfAppid() {
    let env = getENV();
    let bfAppid = 'wx9c60968a55b21fdb';
    if (env == 'release') {
        bfAppid = 'wxfdeaae516b9559f2';
    }
    return bfAppid;
}

// 当前的设备
export function getPlatform() {
    let platform = wx.getSystemInfoSync().platform;
    const env = getENV();
    if (env == 'release') {
        platform = wx.getSystemInfoSync().platform;
    }
    (platform == 'devtools') && (platform = 'ios');
    // (platform == 'devtools') && (platform = 'android');
    return platform;
}