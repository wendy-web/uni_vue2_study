import {
    cancelRepairOrderApi,
    deleteOrderApi,
    finishOrderApi,
    rejectOrderApi,
    revokeOrderApi
} from "@/api/device/maintain/repair.js";
// 撤回
export function cancelRequest(item) {
    return new Promise((resolve, reject) => {
        uni.showModal({
            title: "温馨提示",
            content: `确认作废该维修单`,
            showCancel: true,
            success: async(res) => {
                if (res.confirm) {
                    const { id } = item;
                    const res = await cancelRepairOrderApi({ id });
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
export function revokeRequest(item) {
    return new Promise((resolve, reject) => {
        uni.showModal({
            title: "温馨提示",
            content: `确认撤回该维修单`,
            showCancel: true,
            success: async(res) => {
                if (res.confirm) {
                    const { id } = item;
                    const res = await revokeOrderApi({ id });
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
export function passRequest(item) {
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


// 删除
export function deleteRequest(item) {
    return new Promise((resolve, reject) => {
        uni.showModal({
            title: "温馨提示",
            content: `确认删除该维修单`,
            showCancel: true,
            success: async(res) => {
                if (res.confirm) {
                    const { id } = item;
                    const res = await deleteOrderApi({ id });
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
