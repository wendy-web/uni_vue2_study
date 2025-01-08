import http from "../http/xhHttp.js"

/** 采购换货单列表api */
export function getSwapListApi(data) {
	return http.request({
		url: "/apios/pro_replacement/index",
		method: "post",
		data,
	});
}

/** 采购换货单详情api */
export function getSwapDetailApi(data) {
	return http.request({
		url: "/apios/pro_replacement/detail",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 作废采购换货单api
 */
export function voidSwapApi(data) {
	return http.request({
		url: "/apios/pro_replacement/invalid",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 删除采购换货单api
 */
export function delSwapApi(data) {
	return http.request({
		url: "/apios/pro_replacement/delete",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 提审采购换货单api
 */
export function submitSwapApi(data) {
	return http.request({
		url: "/apios/pro_replacement/submit",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 撤回采购换货单api
 */
export function recallSwapApi(data) {
	return http.request({
		url: "/apios/pro_replacement/recall",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {reason,id} 驳回采购换货单api
 */
export function rejectSwapApi(data) {
	return http.request({
		url: "/apios/pro_replacement/reject",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 通过采购换货单api
 */
export function approveSwapApi(data) {
	return http.request({
		url: "/apios/pro_replacement/approve",
		method: "post",
		data,
	});
}