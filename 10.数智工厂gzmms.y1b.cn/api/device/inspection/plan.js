import http from "@/api/http/xhHttp.js";

// 获取点巡检计划列表API
export function getInspectionPlanListApi(data, authBack) {
	return http.request({
		url: "/mro/point_inspect_plan/list",
		method: "post",
		data,
		authBack
	});
}


// 获取点巡检计划列表API
export function getInspectionPlanDetailApi(data) {
	return http.request({
		url: "/mro/point_inspect_plan/details",
		method: "post",
		data,
	});
}