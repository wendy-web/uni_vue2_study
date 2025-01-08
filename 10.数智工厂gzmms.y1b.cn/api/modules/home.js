// import http from '../http.js';
import http from "../http/xhHttp.js";

// 首页-获取菜单面板(获取用户左侧菜单列表)
export function getMenuListApi() {
    return http.request({
        url: "/apios/home/getRoleList",
        method: "post",
    });
}


/** 获取待办列表API */
export function getBacklogApi(data) {
    return http.request({
        url: "/apios/get/getMyWorkPending",
        method: "get",
        data: data,
    });
}

/** 获取消息列表API */
export function getWorkMsgApi(data) {
    return http.request({
        url: "/apios/get/getMyWorkMessage",
        method: "get",
        data: data,
    });
}

/** 设置消息为已读 */
export function setReadMsgApi(data) {
    return http.request({
        url: "/apios/post/markReadMessage",
        method: "post",
        data: data,
    });
}

/** 首页获取库存预警信息 */
export function getWarningDataApi(data) {
    return http.request({
        url: "/apios/home/getWarningData",
        method: "post",
        data: data,
    });
}

// 首页-获取保养、点巡检计划提醒统计
export function getPlanNoticeDataApi(data) {
    return http.request({
        url: "/apios/home/getPlanNoticeData",
        method: "post",
        data: data,
    });
}
