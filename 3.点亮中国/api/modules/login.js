import http from '../http.js';
import { BASEURL } from '@/config';
//微信登录
export function wxLogin(data) {
	return http({
		url: '/api/login/wxlogin',
		method: 'post',
		data,
		isNoLoading: true
	});
}
//获取用户信息
export function getUser() {
	return http({
		url: '/api/user',
		method: 'post',
		type: 'cache',
		isNoLoading: true
		// isCache,
		// cacheMaxAge:5//缓存有效时间  单位秒
	});
}
//新版授权登录
export function userprofile(data) {
	return http({
		url: '/api/user/wxUserProfile2',
		method: 'post',
		data
	});
}

//上传图片
export function imgupload() {
	return `${BASEURL}/api/tools/imgUpload`
}
