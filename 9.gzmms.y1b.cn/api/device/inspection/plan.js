import http from "@/api/http/xhHttp.js";

// 获取点巡检计划列表API
export function getInspectionPlanListApi(data) {
	return http.request({
		url: "/mro/point_inspect_plan/list",
		method: "post",
		data,
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