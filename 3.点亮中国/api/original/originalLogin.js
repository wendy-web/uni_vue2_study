import http from '../http.js';

//扫码
export function qrCode(data) {
	return http({
		url: '/api/scan/qr',
		method: 'post',
		data
	});
}
