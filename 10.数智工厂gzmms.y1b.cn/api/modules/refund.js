import http from "../http/xhHttp.js"

// 获取采购退货单列表API
export function getRefundListApi(data) {
	return http.request({
		url: "/apios/procure_ret/getList",
		method: "post",
		data,
	});
}

// 获取采购退货单详情
export function detailRefundApi(data) {
	return http.request({
		url: "/apios/procure_ret/details",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 作废采购退货单
 */
export function voidRefundApi(data) {
	return http.request({
		url: "/apios/procure_ret/nullify",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 删除采购退货单
 */
export function delRefundApi(data) {
	return http.request({
		url: "/apios/procure_ret/delete",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 提交审核采购退货单
 */
export function submitRefunApi(data) {
	return http.request({
		url: "/apios/procure_ret/review",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 撤回采购退货单
 */
export function recallRefundApi(data) {
	return http.request({
		url: "/apios/procure_ret/withdrawal",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {reason,id} 驳回采购退货单
 */
export function rejectRefundApi(data) {
	return http.request({
		url: "/apios/procure_ret/reject",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 通过采购退货单
 */
export function approveRefundApi(data) {
	return http.request({
		url: "/apios/procure_ret/approve",
		method: "post",
		data,
	});
}