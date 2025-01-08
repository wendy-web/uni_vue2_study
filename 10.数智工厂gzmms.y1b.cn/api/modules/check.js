import http from "../http/xhHttp.js"

// 获取盘点单列表API
export function getCheckListApi(data) {
	return http.request({
		url: "/apios/warehouse_inv/getList",
		method: "post",
		data,
	});
}

/** 获取盘点单详情API  */
export function detailCheckApi(data) {
	return http.request({
		url: "/apios/warehouse_inv/details",
		method: "post",
		data,
	});
}

/**
 * @param {Object}  新建盘点单API
 */
export function addCheckApi(data) {
	return http.request({
		url: "/apios/warehouse_inv/create",
		method: "post",
		data,
	});
}

/**
 * @param {Object}  编辑盘点单API
 */
export function editCheckApi(data) {
  return http.request({
    url: "/apios/warehouse_inv/edit",
    method: "post",
    data,
  });
}

/**
 * @param {Object} {id} 提审盘点单API
 */
export function submitCheckApi(data) {
	return http.request({
		url: "/apios/warehouse_inv/review",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 撤回盘点单API
 */
export function recallCheckApi(data) {
	return http.request({
		url: "/apios/warehouse_inv/withdrawal",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 作废盘点单API
 */
export function voidCheckApi(data) {
	return http.request({
		url: "/apios/warehouse_inv/nullify",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 删除盘点单API
 */
export function delCheckApi(data) {
	return http.request({
		url: "/apios/warehouse_inv/delete",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {reason,id} 驳回盘点单API
 */
export function rejectCheckApi(data) {
	return http.request({
		url: "/apios/warehouse_inv/reject",
		method: "post",
		data,
	});
}

/**
 * @param {Object} {id} 通过盘点单API
 */
export function approveCheckApi(data) {
	return http.request({
		url: "/apios/warehouse_inv/approve",
		method: "post",
		data,
	});
}