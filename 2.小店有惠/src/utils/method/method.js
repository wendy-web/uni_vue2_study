import { getAuthorization, getBaseUrl } from '../auth.js';
const authorization = Number(Boolean(getAuthorization()));
const platform = wx.getSystemInfoSync().platform;
const BASEURL = getBaseUrl();
let devices = '';
if (platform == 'android') {
    devices = 0;
} else if (platform == 'ios') {
    devices = 1;
}
// 授权属性：authorization，0 代表未授权，1 代表已授权
// 设备属性：devices，0 代表Android，1 代表iOS
// 来源属性：source，0 代表优惠券详情进入，1 代表专属优惠券进入
export function wxReportEvent(eventId, paramsData) {
    let source = '';
    if (paramsData) {
        source = paramsData.source;
    }
    if (!eventId) return;
    wx.reportEvent(eventId, {
        authorization,
        devices,
        source
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

// 消息订阅
export function subscribeMessageHandle(tmplIds = []) {
    return new Promise((resolve, reject) => {
        uni.requestSubscribeMessage({
            tmplIds,
            complete: (event) => resolve(event),
        });

    }).catch((e) => {});
}
export function agreementLookHandle(link) {
    link = BASEURL + link;
    uni.navigateTo({
        url: `/pages/webview/index?link=${encodeURIComponent(link)}`
    });
}

export function saveImageToPhotosAlbum(filePath) {
    return new Promise((resolve, reject) => {
        if (!filePath) return;
        uni.saveImageToPhotosAlbum({ // 保存图片到系统相册。
            filePath, //图片文件路径
            success: () => {
                uni.showToast({
                    title: '素材保存成功',
                    icon: 'none',
                });
                resolve(true);
            },
            fail: async(res) => {
                let pattern = /fail auth deny/;
                if (pattern.test(res.errMsg)) {
                    const setWritePhotosResult = await setWritePhotosAlbum();
                    if (setWritePhotosResult) return saveImageToPhotosAlbum(filePath);
                    console.log(setWritePhotosResult, 'setWritePhotosResult');
                    resolve(false);
                    return;
                }
                uni.showToast({
                    title: '素材保存失败',
                    icon: 'none',
                });
                resolve(false);
            }
        });
    }).catch((e) => {});
}
export function getWritePhotosAlbum() {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            complete(res) {
                if (res.authSetting && !res.authSetting['scope.writePhotosAlbum']) {
                    return resolve(false);
                }
                return resolve(true);
            }
        })
    }).catch((e) => {});
}
export function setWritePhotosAlbum() {
    return new Promise(async(resolve, reject) => {
        const isWritePhotos = await getWritePhotosAlbum();
        console.log('isWritePhotos', isWritePhotos)
        if (!isWritePhotos) {
            wx.showModal({
                title: '信息授权提示',
                content: '需要访问您的相册，请到小程序的设置中授权',
                success: (res) => {
                    if (res.confirm) {
                        wx.openSetting({
                            success: (res) => {
                                if (!res.authSetting['scope.writePhotosAlbum']) {
                                    // uni.showToast({
                                    //     title: '您未允许访问相册权限',
                                    //     icon: 'none',
                                    //     duration: 3000
                                    // });
                                    return;
                                }
                                resolve(true);
                            }
                        });
                        return;
                    }
                    // uni.showToast({
                    //     title: '您未允许访问相册权限',
                    //     icon: 'none',
                    //     duration: 3000
                    // });
                }
            });
            return;
        }
        resolve(true);
    }).catch((e) => {});
}
export function downloadFile(filePath) {
    return new Promise((resolve, reject) => {
        if (!filePath) return;
        uni.downloadFile({
            url: filePath,
            complete: (res) => {
                resolve(res);
            }
        });
    }).catch((e) => {});
}
