import http from "@/api/http/xhHttp.js";

// 获取列表
export function getOrderListApi(data) {
    return http.request({
        url: "/mro/maintenance_order/list",
        method: "post",
        data,
    });
}
// 获取列表-无校验登录列表
export function getScanOrderListApi(data) {
    return http.request({
        url: "/mro/Scan/MaintenanceOrderList",
        method: "post",
        data,
    });
}

// 提交验证
export function commitAcceptOrderApi(data) {
    return http.request({
        url: "/mro/maintenance_order/approve",
        method: "post",
        data,
    });
}
// 撤回
export function withdrawalOrderApi(data) {
    return http.request({
        url: "/mro/maintenance_order/withdrawal",
        method: "post",
        data,
    });
}
// 验收通过
export function finishOrderApi(data) {
    return http.request({
        url: "/mro/maintenance_order/approve",
        method: "post",
        data,
    });
}

// 驳回
export function rejectOrderApi(data) {
    return http.request({
        url: "/mro/maintenance_order/reject",
        method: "post",
        data,
    });
}

// 详情
export function OrderDetailsApi(data) {
    return http.request({
        url: "/mro/maintenance_order/details",
        method: "post",
        data,
    });
}
// 获取详情 - 无权限列表
export function scanOrderDetailsApi(data) {
    return http.request({
        url: "/mro/Scan/maintenanceOrderDetails",
        method: "post",
        data,
    });
}

// 编辑
export function OrderEditApi(data) {
    return http.request({
        url: "/mro/maintenance_order/edit",
        method: "post",
        data,
    });
}
// 新建
export function OrderCreateApi(data) {
    return http.request({
        url: "/mro/maintenance_order/create",
        method: "post",
        data,
    });
}
// 获取到保养的单
export function getMaintenancePlanApi(data) {
    return http.request({
        url: "/mro/post/getMaintenancePlan",
        method: "post",
        data,
    });
}
