const envVersion = 'trial' //体验版

// 全屏打开
export function navigateToMiniProgram(data) {
    let openMiniProgram = uni.navigateToMiniProgram;
    data['envVersion'] = data.envVersion || envVersion
    openMiniProgram(data);
}

// 打开半屏
export function openEmbeddedMiniProgram(data) {
    let openMiniProgram = uni.navigateToMiniProgram;
    if (uni.canIUse('openEmbeddedMiniProgram')) {
        openMiniProgram = uni.openEmbeddedMiniProgram;
    }
    data['envVersion'] = data.envVersion || envVersion
    openMiniProgram(data);
}
