export function showToast(title = "", duration = 2000, icon = "none") {
    uni.showToast({
        title,
        duration,
        icon,
    });
}

export function hideToast() {
    uni.hideToast();
}

export function showLoading(title = '加载中...', mask = true) {
    uni.showLoading({
        title,
        mask,
        complete: (res) => {
            console.log('res :>> ', res);
        }
    });
}

export function hideLoading() {
    uni.hideLoading();
}

export function showNavigationBarLoading() {
    uni.showNavigationBarLoading();
}

export function hideNavigationBarLoading() {
    uni.hideNavigationBarLoading();
}
export function hideHomeButton() {
    uni.hideHomeButton()
}
export function showModal(data) {
    let {
        title = "",
            content = "",
            showCancel = true,
            cancelText = "取消",
            confirmText = "确定",
            cancelColor = "#999999",
            confirmColor = "#586B95",
            confirm,
            cancel,
    } = data;
    uni.showModal({
        title,
        content,
        showCancel,
        cancelText,
        confirmText,
        cancelColor,
        confirmColor,
        success: (res) => {
            if (res.confirm) {
                confirm && confirm();
            } else if (res.cancel) {
                cancel && cancel();
            }
        },
    });
}
