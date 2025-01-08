import http from "../http/xhHttp.js"

// 获取退货出库单列表API
export function getRetGoodsListApi(data) {
	return http.request({
		url: "/apios/warehouse_ret/getList",
		method: "post",
		data,
	});
}

/** 获取退货出库单详情API  */
export function detailRetGoodsApi(data) {
	return http.request({
		url: "/apios/warehouse_ret/details",
		method: "post",
		data,
	});
}


/**
 * @param {Object} {id} 提审退货出库单API
 */
export function submitRetGoodsApi(data) {
	return http.request({
		url: "/apios/warehouse_ret/review",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 撤回退货出库单API
 */
export function recallRetGoodsApi(data) {
	return http.request({
		url: "/apios/warehouse_ret/withdrawal",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 作废退货出库单API
 */
export function voidRetGoodsApi(data) {
	return http.request({
		url: "/apios/warehouse_ret/nullify",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 删除退货出库单API
 */
export function delRetGoodsApi(data) {
	return http.request({
		url: "/apios/warehouse_ret/delete",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {reason,id} 驳回退货出库单API
 */
export function rejectRetGoodsApi(data) {
	return http.request({
		url: "/apios/warehouse_ret/reject",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 通过退货出库单API
 */
export function approveRetGoodsApi(data) {
	return http.request({
		url: "/apios/warehouse_ret/approve",
		method: "post",
		data,
	});
}