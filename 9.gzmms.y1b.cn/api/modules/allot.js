import http from "../http/xhHttp.js"

// 获取调拨单列表API
export function getAllotListApi(data) {
	return http.request({
		url: "/apios/warehouse_tra/getList",
		method: "post",
		data,
	});
}


/** 获取调拨单详情API  */
export function detailAllotApi(data) {
	return http.request({
		url: "/apios/warehouse_tra/details",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 提审调拨单API
 */
export function submitAllotApi(data) {
	return http.request({
		url: "/apios/warehouse_tra/review",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 撤回调拨单API
 */
export function recallAllotApi(data) {
	return http.request({
		url: "/apios/warehouse_tra/withdrawal",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 作废调拨单API
 */
export function voidAllotApi(data) {
	return http.request({
		url: "/apios/warehouse_tra/nullify",
		method: "post",
		data,
	});
}


/**
 * @param {Object} {id} 删除调拨单API
 */
export function delAllotApi(data) {
	return http.request({
		url: "/apios/warehouse_tra/delete",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {reason,id} 驳回调拨单API
 */
export function rejectAllotApi(data) {
	return http.request({
		url: "/apios/warehouse_tra/reject",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 通过调拨单API
 */
export function approveAllotApi(data) {
	return http.request({
		url: "/apios/warehouse_tra/approve",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {reason,id} 仓库驳回调拨单API
 */
export function rejectAllotWhApi(data) {
	return http.request({
		url: "/apios/warehouse_tra/whReject",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id}仓库通过调拨单API
 */
export function approveAllotWhApi(data) {
	return http.request({
		url: "/apios/warehouse_tra/whApprove",
		method: "post",
		data,
	});
}