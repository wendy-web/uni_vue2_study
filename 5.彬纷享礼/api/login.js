import API from './http/xhHttp.js';

//微信登录
export function wxLogin(data) {
	return API.request({
		url: '/api2/cpost/wxlogin',
		method: 'post',
		data
	});
}
//更新用户信息
export function updateUser(data) {
	return API.request({
		url: '/api2/cuser/update',
		method: 'post',
		data
	});
}
//获取用户信息 
export function getUser(data) {
	return API.request({
		url: '/api2/cuser/getuser',
		method: 'post',
		data,
		type: 'cache',
		cacheMaxAge: 10
		// ,
		// _delaySecond: 6
		// ,
		// isCache: true
	});
}
//C更新用户微信手机  
export function getUserMobile(data) {
	return API.request({
		url: '/api2/cuser/mobile',
		method: 'post',
		data,
		isNoLoading: true
	});
}
//新版授权登录
export function userprofile(data) {
	return API.request({
		url: '/api2/cweixin/userprofile',
		method: 'post',
		data
	});
}