import http from "../http/xhHttp.js"


// 获取拆箱单列表API
export function getSplitListApi(data) {
	return http.request({
		url: "/apios/split_assemble/index",
		method: "post",
		data,
	});
}

// 获取拆箱单详情API
export function detailSplitApi(data) {
	return http.request({
		url: "/apios/split_assemble/detail",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 提审拆箱单API
 */
export function submitSplitApi(data) {
	return http.request({
		url: "/apios/split_assemble/submit",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 撤回拆箱单API
 */
export function recallSplitApi(data) {
	return http.request({
		url: "/apios/split_assemble/recall",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 作废拆箱单API
 */
export function voidSplitApi(data) {
	return http.request({
		url: "/apios/split_assemble/invalid",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 删除拆箱单API
 */
export function delSplitApi(data) {
	return http.request({
		url: "/apios/split_assemble/delete",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {reason,id} 驳回拆箱单API
 */
export function rejectSplitApi(data) {
	return http.request({
		url: "/apios/split_assemble/reject",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 通过拆箱单API
 */
export function approveSplitApi(data) {
	return http.request({
		url: "/apios/split_assemble/approve",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {reason,id} 仓库驳回拆箱单API
 */
export function rejectSplitWhApi(data) {
	return http.request({
		url: "/apios/split_assemble/whReject",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 仓库通过拆箱单API
 */
export function approveSplitWhApi(data) {
	return http.request({
		url: "/apios/split_assemble/whApprove",
		method: "post",
		data,
	});
}