import http from "../http/xhHttp.js"


// 获取报废单列表API
export function getScrapListApi(data) {
	return http.request({
		url: "/apios/warehouse_scr/getList",
		method: "post",
		data,
	});
}


/** 获取报废单详情API  */
export function detailScrapApi(data) {
	return http.request({
		url: "/apios/warehouse_scr/details",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 提审报废单API
 */
export function submitScrapApi(data) {
	return http.request({
		url: "/apios/warehouse_scr/review",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 撤回报废单API
 */
export function recallScrapApi(data) {
	return http.request({
		url: "/apios/warehouse_scr/withdrawal",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 作废报废单API
 */
export function voidScrapApi(data) {
	return http.request({
		url: "/apios/warehouse_scr/nullify",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 删除报废单API
 */
export function delScrapApi(data) {
	return http.request({
		url: "/apios/warehouse_scr/delete",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {reason,id} 驳回报废单API
 */
export function rejectScrapApi(data) {
	return http.request({
		url: "/apios/warehouse_scr/reject",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 通过报废单API
 */
export function approveScrapApi(data) {
	return http.request({
		url: "/apios/warehouse_scr/approve",
		method: "post",
		data,
	});
}