import http from "@/api/http/xhHttp.js";

// 获取维修单列表
export function getPlanListApi(data, authBack) {
    return http.request({
        url: "/mro/maintenance_plan/list",
        method: "post",
        data,
        authBack
    });
}

// 保养计划-标记启用或停用
export function updEnableStatusApi(data) {
    return http.request({
        url: "/mro/maintenance_plan/updEnableStatus",
        method: "post",
        data,
    });
}

// 保养计划-删除
export function planDelApi(data) {
    return http.request({
        url: "/mro/maintenance_plan/del",
        method: "post",
        data,
    });
}

// 保养详情
export function planDetailApi(data) {
    return http.request({
        url: "/mro/maintenance_plan/details",
        method: "post",
        data,
    });
}



// 驳回
export function rejectOrderApi(data) {
    return http.request({
        url: "/mro/Repair/rejectOrder",
        method: "post",
        data,
    });
}

// 撤回
export function revokeOrderApi(data) {
    return http.request({
        url: "/mro/Repair/revokeOrder",
        method: "post",
        data,
    });
}
// 删除
export function deleteOrderApi(data) {
    return http.request({
        url: "/mro/Repair/deleteOrder",
        method: "post",
        data,
    });
}

// 创建/提审维修单/驳回修改
export function repairOrderApi(data) {
    return http.request({
        url: "/mro/Repair/repairOrder",
        method: "post",
        data,
    });
}
// 维修单编辑数据
export function getRepairDetailApi(data) {
    return http.request({
        url: "/mro/Repair/Repairinfo",
        method: "post",
        data,
    });
}

// 班次的获取
export function getClasstimeMap(data) {
    return http.request({
        url: "/qlty/Post/getClasstimeMap",
        method: "post",
        data,
    });
}

// 获取故障原因
export function getRepairReasonList(data) {
    return http.request({
        url: "/mro/Basics/getRepairReasonList",
        method: "post",
        data,
    });
}
// 获取外委单位options
export function getReBaseSelect(data) {
    return http.request({
        url: "/mro/Post/getReBaseSelect",
        method: "post",
        data,
    });
}

// 换上领用单
export function getWarehouseRecDetailApi(data) {
    return http.request({
        url: "/mro/Post/getWarehouseRecDetail",
        method: "post",
        data,
    });
}
// 换下领用单
export function getDownEqListApi(data) {
    return http.request({
        url: "/mro/Post/getDownEqList",
        method: "post",
        data,
    });
}

// 获取库存明细唯一标签码
export function getStocksUniqueLabelApi(data) {
    return http.request({
        url: "/apios/post/getStocksUniqueLabel",
        method: "post",
        data,
    });
}

export function getLabelInfoMroApi(data) {
    return http.request({
        url: "/apios/home/getLabelInfoMro",
        method: "post",
        data,
    });
}
