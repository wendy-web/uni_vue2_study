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



/** 设备小程序-设备扫码*/
export function getEquipmentScanApi(data) {
	return http.request({
		url: "/mro/Post/getEquipmentScan",
		method: "post",
		data,
	});
}