import http from "@/api/http/xhHttp.js";

// 获取设备档案列表API
export function getEquipmentListApi(data) {
	return http.request({
		url: "/mro/Equipment/equipment",
		method: "post",
		data,
	});
}


// 获取设备档案详情API
export function getEquipmentInfoApi(data) {
	return http.request({
		url: "/mro/Equipment/getEquipmentInfo",
		method: "post",
		data,
	});
}