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



/**
 * 额外设置一条 `key__expires__: 时间戳` 的storage来判断过期时间
 * @param {string} key
 * @param {any} value
 * @param {number} expired 过期时间 以毫秒为单位
 * @returns {any}
 */

export function setExpiredStorage(key, value, expired) {

	uni.setStorageSync(key, JSON.stringify(value))
	if (expired) {
		uni.setStorageSync(`${key}__expires__`, expired)
	}
	return value;
}

export function getExpiredStorage(key) {
	let expired = uni.getStorageSync(`${key}__expires__`) || Date.now + 1
	const now = Date.now();
	if (now >= expired) {
		uni.removeStorageSync(key)
		uni.removeStorageSync(`${key}__expires__`)
		return;
	}

	let retval = uni.getStorageSync(key)

	return retval ? JSON.parse(retval) : retval;
}