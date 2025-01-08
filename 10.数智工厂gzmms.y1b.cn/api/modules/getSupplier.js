import http from "../http/xhHttp.js"

// 获取领料出库单列表API
export function getGetSupListApi(data) {
	return http.request({
		url: "/apios/warehouse_rec/getList",
		method: "post",
		data,
	});
}

// 获取领料出库单详情API
export function detailGetSupApi(data) {
	return http.request({
		url: "/apios/warehouse_rec/details",
		method: "post",
		data,
	});
}

// 新建领料出库单API
export function addGetSupApi(data) {
	return http.request({
		url: "/apios/warehouse_rec/create",
		method: "post",
		data,
	});
}

// 编辑领料出库单API
export function editGetSupApi(data) {
	return http.request({
		url: "/apios/warehouse_rec/edit",
		method: "post",
		data,
	});
}

// 提审领料出库单API
export function submitGetSupApi(data) {
	return http.request({
		url: "/apios/warehouse_rec/review",
		method: "post",
		data,
	});
}

// 撤回领料出库单API
export function recallGetSupApi(data) {
	return http.request({
		url: "/apios/warehouse_rec/withdrawal",
		method: "post",
		data,
	});
}

// 作废领料出库单API
export function voidGetSupApi(data) {
	return http.request({
		url: "/apios/warehouse_rec/nullify",
		method: "post",
		data,
	});
}

// 删除领料出库单API
export function delGetSupApi(data) {
	return http.request({
		url: "/apios/warehouse_rec/delete",
		method: "post",
		data,
	});
}

// 驳回领料出库单API
export function rejectGetSupApi(data) {
	return http.request({
		url: "/apios/warehouse_rec/reject",
		method: "post",
		data,
	});
}

// 通过领料出库单API
export function approveGetSupApi(data) {
	return http.request({
		url: "/apios/warehouse_rec/approve",
		method: "post",
		data,
	});
}

// 仓库驳回领料出库单API
export function rejectGetSupWhApi(data) {
	return http.request({
		url: "/apios/warehouse_rec/whReject",
		method: "post",
		data,
	});
}




/**
 * @example  详情页-领取确认
 * @@param {Object} {id:number,goods:[]}  
 */
export function confirmReceiveApi(data) {
	return http.request({
		url: "/apios/warehouse_rec/whReceiverApprove",
		method: "post",
		data,
	});
}

/**
 * @example  详情页-领料完结ap
 * @@param {Object} {id:number}  
 */
export function overGetSupApi(data) {
	return http.request({
		url: "/apios/warehouse_rec/whReceiverComplete",
		method: "post",
		data,
	});
}

// 仓库通过领料出库单API
export function approveGetSupWhApi(data) {
	return http.request({
		url: "/apios/warehouse_rec/whApprove",
		method: "post",
		data,
	});
}

/** 详情页-发料撤回api */
export function recallGiveApi(data) {
	return http.request({
		url: "/apios/warehouse_rec/issuanceWithDrawal",
		method: "post",
		data,
	});
}