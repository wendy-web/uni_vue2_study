import API from '../http/xhHttp.js';

//溯源附近店铺
export function nearby(data) {
	return API.request({
		url: '/api2/ctrace/nearby',
		method: 'post',
		data,
		isNoLoading: true
	});

}
//溯源扫码记录
export function scanLog(data) {
	return API.request({
		url: '/api2/ctrace/scanLog',
		method: 'post',
		data,
		isNoLoading: true
	});

}