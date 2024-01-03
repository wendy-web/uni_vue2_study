/*token*/
export function setToken(data) {
	setStorage('token', data);
}

export function getToken() {
	return getStorage('token');
}

export function removeToken() {
	uni.removeStorageSync('token');
}

/*微信扫拉环进入时的二维码值*/
export function setWxScanQrCode(data) {

	setStorage('wxScanQrCode', data);

}
export function getWxScanQrCode() {
	return getStorage('wxScanQrCode');
}
export function removeWxScanQrCode() {
	try {
		uni.removeStorageSync('wxScanQrCode');
	} catch (e) {
		//异常情况
	}
}

/*用户信息*/
// export function setUserInfo(data) {//由接口缓存取代
// 	setStorage('userInfo', JSON.stringify(data))
// }

export function getUserInfo() {
	let userInfo = getStorage('/api2/cuser/getuser');
	if (userInfo) {
		return JSON.parse(userInfo).data;
	}
	return undefined;
}

export function removeGetUserInfo() {
	uni.removeStorageSync('/api2/cuser/getuser');
}

/*微信用户信息*/
export function setWxUserInfo(data) {
	setStorage('wxUserInfo', JSON.stringify(data));
}

export function getWxUserInfo() {
	let userInfo = getStorage('wxUserInfo');
	if (userInfo) {
		return JSON.parse(userInfo);
	}
	return undefined;
}

export function removeWxUserInfo() {
	uni.removeStorageSync('wxUserInfo');
}

/*获取经纬度*/
export function getLocation() {
	let cache = getStorage('getUserLocation');
	cache = cache && JSON.parse(cache);
	return cache && cache.data;
}

//获取广告
export function cacheAdData() {
	let cache = getStorage('/api/ad/get');
	if (cache) {
		return JSON.parse(cache).data;
	}
	return {
		A1: {
			value: []
		},
		A2: {
			value: []
		},
		A3: {
			value: []
		},
		A4: {
			value: []
		},
		A5: {
			value: []
		},
		A6: {
			value: [{
				position: 6,
				show: 1
			}]
		}
		// A7: {
		// 	value: [] 
		// },
		// A8: {
		// 	value: []
		// }
	};
}
//获取新闻
export function cacheArticle() {
	let cache = getStorage('/api2/ctools/article');
	if (cache) {
		let data = JSON.parse(cache).data.list;
		data.forEach(function(item) {
			item.isAnim = Boolean(item.is_give - 0);
		});
		return data;
	}
	return [];
}

export function setReferer(data) {
	setStorage('referer', data);
}

export function getReferer() {
	return getStorage('referer') || 0;
}

export function getMyCardBadAd() {
	let num = getStorage('myCardBadAd') || 0;
	num++;
	setStorage('myCardBadAd', num);
	return num;
}

export function getWelfareTime() {

	return getStorage('welfareTime') || 0;
}

export function setWelfareTime(time) {

	setStorage('welfareTime', time);
}

export function getScanSweepNum() {
	return getStorage('scanSweepNum') || 0;
}

export function setScanSweepNum(num) {
	setStorage('scanSweepNum', num);
}

export function getCheckCardVolume() {
	let cache = getStorage('checkCardVolume');
	if (cache) {
		return JSON.parse(cache);
	}
	return [];
}

export function setCheckCardVolume(data) {
	if (!data) return uni.removeStorageSync('checkCardVolume');
	setStorage('checkCardVolume', JSON.stringify(data));
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

export function setAuthorization(data) {
	setStorage('authorization', data);
}

export function getAuthorization() {
	return getStorage('authorization');
}

export function setLoginState(data) {
	setStorage('isLogin', data);
}

export function getLoginState() {
	return getStorage('isLogin');
}

export function setAppLaunchNum(isClear) {

	if (isClear) return setStorage('AppLaunchNum', null);

	let num = getStorage('AppLaunchNum') || 0

	setStorage('AppLaunchNum', ++num);
}

export function getAppLaunchNum() {

	let AppLaunchNum = getStorage('AppLaunchNum') || 0;

	setAppLaunchNum()

	return AppLaunchNum

}