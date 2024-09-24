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
