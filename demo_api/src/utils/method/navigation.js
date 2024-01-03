export function go(url) {
    uni.navigateTo({
        url: url,
    });
}

export function back(delta = 1) {
    uni.navigateBack({
        delta: delta,
        fail() {
            uni.switchTab({
                url: '/pages/tabBar/shopMall/index'
            });
        }
    });
}
export function redirectTo(url) {
    uni.redirectTo({
        url: url,
    });
}

export function reLaunch(url) {
    uni.reLaunch({
        url: url,
    });
}

export function switchTab(url) {
    uni.switchTab({
        url: url,
    });
}
// 全屏打开
export function navigateToMiniProgram(data) {
    let openMiniProgram = uni.navigateToMiniProgram;
    openMiniProgram(data);
}

// 打开半屏
export function openEmbeddedMiniProgram(data) {
    let openMiniProgram = uni.navigateToMiniProgram;
    if (uni.canIUse('openEmbeddedMiniProgram')) {
        openMiniProgram = uni.openEmbeddedMiniProgram;
    }
    openMiniProgram(data);
}
