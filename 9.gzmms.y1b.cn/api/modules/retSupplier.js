import http from "../http/xhHttp.js"


// 获取退料入库单列表API
export function getRetSupInListApi(data) {
	return http.request({
		url: "/apios/warehouse_rec_in/getList",
		method: "post",
		data,
	});
}


/**  获取退料入库单详情API  */
export function detailRetSupInApi(data) {
	return http.request({
		url: "/apios/warehouse_rec_in/details",
		method: "post",
		data,
	});
}



/**
 * @param {Object} {id} 提审退料入库单API
 */
export function submitRetSupInApi(data) {
	return http.request({
		url: "/apios/warehouse_rec_in/review",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 撤回退料入库单API
 */
export function recallRetSupInApi(data) {
	return http.request({
		url: "/apios/warehouse_rec_in/withdrawal",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 作废退料入库单API
 */
export function voidRetSupInApi(data) {
	return http.request({
		url: "/apios/warehouse_rec_in/nullify",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 删除退料入库单API
 */
export function delRetSupInApi(data) {
	return http.request({
		url: "/apios/warehouse_rec_in/delete",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {reason,id} 驳回退料入库单API
 */
export function rejectRetSupInApi(data) {
	return http.request({
		url: "/apios/warehouse_rec_in/reject",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 通过退料入库单API
 */
export function approveRetSupInApi(data) {
	return http.request({
		url: "/apios/warehouse_rec_in/approve",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {reason,id} 仓库驳回退料入库单API
 */
export function rejectRetSupInWhApi(data) {
	return http.request({
		url: "/apios/warehouse_rec_in/whReject",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 仓库通过退料入库单API
 */
export function approveRetSupInWhApi(data) {
	return http.request({
		url: "/apios/warehouse_rec_in/whApprove",
		method: "post",
		data,
	});
}