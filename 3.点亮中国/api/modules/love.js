import http from '../http.js';

//微信登录
export function getUserLove(temp, data) {
	let url = '/api/commonweal/getUserLove'
	if (temp) {
		url += '?temp=' + temp
	}

	return http({
		url,
		method: 'post',
		data
	});
}

export function getTeamLove() {
	return http({
		url: '/api/commonweal/getTeamLove',
		method: 'post'
	});
}
export function getUserDetail(data, isNoLoading = false, temp) {
	let url = '/api/commonweal/getUserDetail';
	if (temp) {
		url += '?temp=' + temp
	}
	return http({
		url,
		method: 'post',
		data,
		isNoLoading
	});
}
// 点赞
export function like(data) {
	return http({
		url: '/api/commonweal/like',
		method: 'post',
		data,
		isNoLoading: true

	});
}
// 获取用户的top
export function getDonateUserTop(data) {
	return http({
		url: '/api/commonweal/getDonateUserTop',
		method: 'post',
		data
	});
}
// 捐赠用户列表（具体项目）
export function getDonateUserList(data) {
	return http({
		url: '/api/commonweal/getDonateUserList',
		method: 'post',
		data
	});
}

export function getTeamDetail(data) {
	return http({
		url: '/api/commonweal/getTeamDetail',
		method: 'post',
		data
	});
}

export function donate(data) {
	return http({
		url: '/api/commonweal/donate',
		method: 'post',
		data
	});
}
export function getTeamDonate(data) {
	return http({
		url: '/api/commonweal/getTeamDonate',
		method: 'post',
		data
	});
}
export function getUserDonate(data) {
	return http({
		url: '/api/commonweal/getUserDonate',
		method: 'post',
		data
	});
}
export function getUserDonateList(data) {
	return http({
		url: '/api/commonweal/getUserDonateList',
		method: 'post',
		data
	});
}
export function getTeamDonateList(data) {
	return http({
		url: '/api/commonweal/getTeamDonateList',
		method: 'post',
		data
	});
}


export function getUserCertList(data) {
	return http({
		url: '/api/commonweal/getUserCertList',
		method: 'post',
		data
	});
}
export function getTeamCertList(data) {
	return http({
		url: '/api/commonweal/getTeamCertList',
		method: 'post',
		data
	});
}
export function getCert(data) {
	return http({
		url: '/api/commonweal/getCert',
		method: 'post',
		data
	});
}

// 获取订阅信息的id
export function getCommonwealWxMsgId() {
	return http({
		url: '/api/tools/getCommonwealWxMsgId',
		method: 'post'
	});
}

// 提交收货地址
export function submitAddressApi(data) {
	return http({
		url: '/api/commonweal/parcel',
		method: 'post',
		data
	})
}