export function go(url) {
    uni.navigateTo({
        url: url,
    });
}

export function back(delta = 1) {
    uni.navigateBack({
        delta: delta,
        fail: function fail() {
            uni.switchTab({
                url: '/pages/home/index'
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