import { finishOrderApi, rejectOrderApi, withdrawalOrderApi } from "@/api/device/maintain/order.js";
// 驳回
export function rejectRequest(item) {
    return new Promise((resolve, reject) => {
        uni.showModal({
            title: "温馨提示",
            content: `确认驳回该维修单`,
            showCancel: true,
            success: async(res) => {
                if (res.confirm) {
                    const { id } = item;
                    const res = await rejectOrderApi({ id });
                    uni.showToast({
                        icon: "none",
                        title: res.msg,
                    });
                    resolve();
                }
            },
        });
    })
}
// 通过
export function finishRequest(item) {
    return new Promise((resolve, reject) => {
        uni.showModal({
            title: "温馨提示",
            content: `确认通过该维修单`,
            showCancel: true,
            success: async(res) => {
                if (res.confirm) {
                    const { id } = item;
                    const res = await finishOrderApi({ id });
                    uni.showToast({
                        icon: "none",
                        title: res.msg,
                    });
                    resolve();
                }
            },
        });
    })
}
// 撤回
export function withdrawalRequest(item) {
    return new Promise((resolve, reject) => {
        uni.showModal({
            title: "温馨提示",
            content: `确认撤回该维修单`,
            showCancel: true,
            success: async(res) => {
                if (res.confirm) {
                    const { id } = item;
                    const res = await withdrawalOrderApi({ id });
                    uni.showToast({
                        icon: "none",
                        title: res.msg,
                    });
                    resolve();
                }
            },
        });
    })
}
export const allScrollList = [
    {
        name: "计划信息",
        scrollId: "#one",
    },
    {
        name: "设备信息",
        scrollId: "#twe",
    },
    {
        name: "保养处理情况",
        scrollId: "#three",
    },
    {
        name: "保养项目",
        scrollId: "#four",
    },
    {
        name: "更换备件",
        scrollId: "#five",
    },
    {
        name: "流程",
        scrollId: "#six",
    },
]
export const scanScrollList = [
    {
        name: "设备信息",
        scrollId: "#twe",
    },
    {
        name: "保养项目",
        scrollId: "#four",
    },
    {
        name: "更换备件",
        scrollId: "#five",
    }
]