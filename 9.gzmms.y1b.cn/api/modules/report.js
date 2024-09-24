import http from "../http/xhHttp.js"


// 获取商品分类列表
export function goodsCateListApi() {
	return http.request({
		url: "/apios/get/goodsclasslist",
		method: "get",
	});
}

// 货品库存 获取仓库列表
export function getWarehouseApi() {
	return http.request({
		url: "/apios/get/getwarehouse",
		method: "get",
	});
}

// 货品库存列表接口
export function getStockApi(data) {
	return http.request({
		url: "/apios/inventory/getstock",
		method: "post",
		data: data,
	});
}