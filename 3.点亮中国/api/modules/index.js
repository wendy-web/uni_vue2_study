import http from '../http.js';

//扫码
export function qrCode(data) {
	return http({
		url: '/api/scan/qrCode',
		method: 'post',
		data
	});
}
//攻略
export function getStrategy() {
	return http({
		url: '/api/tools/getStrategy',
		method: 'post'
	});
}
//扫彩膜码
export function qr(data) {
	return http({
		url: '/api/scan/qr',
		method: 'post',
		data
	});
}