import http from '../http.js';


export function getShareUrl() {
	return http({
		url: '/api/help/getShareUrl',
		method: 'post',
		isCache:true,//是否开启缓存
		type:'cache',//接口类型 cache 属于缓存类型
		cacheMaxAge:3,//缓存有效时间  单位秒
		isNoLoading:true
	 });
}

export function getBeHelpUserCity(data) {
	return http({
		url: '/api/help/getBeHelpUserCity',
		method: 'post',
		data
	 });
}

export function lit(data) {
	return http({
		url: '/api/help/lit',
		method: 'post',
		data
	 });
}


export function getTodayHelpUser(data) {
	return http({
		url: '/api/help/getTodayHelpUser',
		method: 'post',
		data,
		isNoLoading:true
	 });
}