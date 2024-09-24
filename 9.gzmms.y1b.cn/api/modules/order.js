import http from "../http/xhHttp.js"


/** 获取采购单列表API */
export function getOrderListApi(data) {
	return http.request({
		url: "/apios/procure/getList",
		method: "post",
		data,
	});
}

/** 采购单详情API */
export function orderDetailApi(data) {
	return http.request({
		url: "/apios/procure/details",
		method: "post",
		data,
	});
}


/**
 * @param {Object} {id} 作废采购单
 */
export function voidOrderApi(data) {
	return http.request({
		url: "/apios/procure/nullify",
		method: "post",
		data,
	});
}


/**
 * @param {Object} {id} 删除采购单
 */
export function delOrderApi(data) {
	return http.request({
		url: "/apios/procure/delete",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 提交审核采购单
 */
export function submitOrderApi(data) {
	return http.request({
		url: "/apios/procure/review",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 撤回采购单
 */
export function recallOrderApi(data) {
	return http.request({
		url: "/apios/procure/withdrawal",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 驳回采购单
 */
export function rejectOrderApi(data) {
	return http.request({
		url: "/apios/procure/reject",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 通过采购单
 */
export function approveOrderApi(data) {
	return http.request({
		url: "/apios/procure/approve",
		method: "post",
		data,
	});
}
/**
 * @param {Object} data {procure_id} 发送邮件api,提审和确认通过时,如果单据状态为已完成则调用
 */
export function sendSupEmailApi(data){
	return http.request({
		url: "/apios/post/sendMail",
		method: "post",
		data,
	});
}