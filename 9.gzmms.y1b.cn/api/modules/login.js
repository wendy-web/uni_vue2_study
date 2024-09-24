import http from "../http/xhHttp.js"

//微信登录
/** 
 * code:xxx
 **/
export function wxLogin(data) {
	return http.request({
		url: '/apios/login/check',
		method: 'post',
		data
	});
}

/**
 * @example 手机号一键登录
 * @param {Object} {mobile_code}
 */
export function wxMobileLoginApi(data) {
	return http.request({
		url: '/apios/login/phoneLogin',
		method: 'post',
		data
	});
}


/**
 * @example 静默绑定微信,传入wx.login的code
 * @param {Object} {code}
 */
export function mobileBindApi(data) {
	return http.request({
		url: '/apios/post/bind',
		method: 'post',
		data
	});
}