/*token*/
export function setToken(data) {
	setStorage('H5_token', data);
}

export function getToken() {
	return getStorage('H5_token');
}

export function removeToken() {
	window.localStorage.removeItem('H5_token')
}


/*用户信息*/
// export function setUserInfo(data) {//由接口缓存取代
// 	setStorage('userInfo', JSON.stringify(data))
// }

export function getUserInfo() {
	let userInfo = getStorage('/app/ad/citicinfo');
	if (userInfo) {
		return userInfo.data;
	}
	return undefined;
}

export function removeGetUserInfo() {
	window.localStorage.removeItem('/app/ad/citicinfo')
}


export function removeWxUserInfo() {
	window.localStorage.removeItem('wxUserInfo')
}

export function setStorage(key, data) {

	try {
		window.localStorage.setItem(key, JSON.stringify(data))
	} catch (e) {
		//TODO handle the exception
	}
}

export function getStorage(key) {
	let cache = null;
	try {
		cache = JSON.parse(window.localStorage.getItem(key)) || null
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
