import http from "@/api/http/xhHttp.js";

// 获取点检执行数据
export function getExecuteCheckApi(data) {
	return http.request({
		url: "/mro/post/getExecuteCheck",
		method: "post",
		data,
	});
}

/** 流程详情预览-设备系统所有单据 */
export function getReceiptProListApi(data) {
	return http.request({
		url: "/mro/Post/receiptProList",
		method: "post",
		data,
	});
}

/** 设备小程序-设备扫码 - 无需校验用户登录 */
export function getEquipmentScanNotTokenApi(data, rejectBack) {
	return http.request({
		url: "/mro/Scan/getEquipmentScan",
		method: "post",
		data,
		rejectBack
	});
}


// 获取模块权限
export function getModuleAuthApi(data) {
	return http.request({
		url: "/apios/post/getModuleAuth",
		method: "post",
		data,
	});
}