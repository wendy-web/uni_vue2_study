export function go(url) {
    if (this.$isClick) return;
    this.$isClick = true;
    uni.navigateTo({
        url: url,
        complete: () => {
            this.$isClick = false;
        }
    });
}
export function leftBack(delta = 1, failUrl = '/pages/tabBar/shopMall/index') {
    if (this.$isClick) return;
    this.$isClick = true;
    uni.navigateBack({
        delta: delta,
        fail: () => {
            this.$isClick = false;
            switchTab.call(this, failUrl);
        },
        complete: () => {
            this.$isClick = false;
        }
    });
}
export function redirectTo(url) {
    if (this.$isClick) return;
    this.$isClick = true;
    uni.redirectTo({
        url,
        complete: () => {
            this.$isClick = false;
        }
    });
}

export function reLaunch(url) {
    if (this.$isClick) return;
    this.$isClick = true;
    uni.reLaunch({
        url,
        complete: () => {
            this.$isClick = false;
        }
    });
}

export function switchTab(url) {
    if (this.$isClick) return;
    this.$isClick = true;
    uni.switchTab({
        url,
        complete: () => {
            this.$isClick = false;
        }
    });
}