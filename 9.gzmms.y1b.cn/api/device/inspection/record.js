import http from "@/api/http/xhHttp.js";

// 获取点巡检记录列表API
export function getInspecRecordListApi(data) {
	return http.request({
		url: "/mro/PointCheck/getList",
		method: "post",
		data,
	});
}

// 点巡检记录-创建/编辑
export function getInspecRecordAddEditApi(data) {
	return http.request({
		url: "/mro/PointCheck/createPointCheckTask",
		method: "post",
		data,
	});
}

// 点巡检记录-获取详情
export function getInspecRecordDetailApi(data) {
	return http.request({
		url: "/mro/PointCheck/details",
		method: "post",
		data,
	});
}



// 点巡检记录-审批通过
export function getInspecRecordApproveApi(data) {
	return http.request({
		url: "/mro/PointCheck/finishOrder",
		method: "post",
		data,
	});
}

// 点巡检记录-提审
export function getInspecRecordSubmitApi(data) {
	return http.request({
		url: "/mro/PointCheck/commitAcceptOrder",
		method: "post",
		data,
	});
}

// 点巡检记录-撤回
export function getInspecRecordRecallApi(data) {
	return http.request({
		url: "/mro/PointCheck/revokeOrder",
		method: "post",
		data,
	});
}
// 点巡检记录-撤回
export function getInspecRecordRejectApi(data) {
	return http.request({
		url: "/mro/PointCheck/rejectOrder",
		method: "post",
		data,
	});
}