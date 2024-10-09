import store from '@/store';
import {
    getStorage,
    setStorage
} from '@/utils/auth.js';
import log from '@/utils/log.js';
import {
    VALID_CACHE
} from './index.js';
let _overtime = null;

const locationError = {
    'getLocation:fail:ERROR_NOCELL&WIFI_LOCATIONSWITCHOFF': '没有打开定位开关或WiFi进行定位',
    'getLocation:fail:ERROR_NETWORK': '网络异常',
    'getLocation:fail:auth denied': '用户在小程序中未授权',
    'getLocation:fail auth deny': '用户在小程序中未授权',
    'getLocation:fail authorize no response': '用户在小程序中未授权',
    'getLocation:fail:ERROR_SERVER_NOT_LOCATION': '微信服务器位置错误',
    'getLocation:fail system permission denied': '系统设置里面禁止了微信获取地理位置',
    'getLocation:fail:auth canceled': '用户取消授权',
    'getLocation:fail error': '未知异常',
    'getLocation:fail:timeout': '定位超时'
};

//错误信息转义
function getErrorMsg(err) {

    return locationError[err];

}

//判断是否是微信禁止了定位
function isWXPermission(err) {
    return {
        errText: getErrorMsg(err) || err
    };

}
export function getStorageLocation() {
    return new Promise((resolve, reject) => {
        let cache = getStorage('getUserLocation');
        cache = cache && JSON.parse(cache);
        //判断是否有缓存，并且在缓存有效期 - 3分钟
        if (cache && VALID_CACHE(cache.prescription || 60 * 3, cache.lastModified)) {
            //关闭loading
            // _closeLoading()
            return resolve({
                data: cache.data,
                isold: true
            });
        }
        return resolve();
    });
}
//获取用户定位信息
export function getUserLocation(isFailBack = false, isOverTime = true) {
    return new Promise((resolve, reject) => {
        let cache = getStorage('getUserLocation');
        cache = cache && JSON.parse(cache);
        //判断是否有缓存，并且在缓存有效期 - 3分钟
        if (cache && VALID_CACHE(cache.prescription || 60 * 3, cache.lastModified)) {
            //关闭loading
            // _closeLoading()
            return resolve({
                data: cache.data,
                isold: true
            });
        }
        //超时处理 超10秒没回调就宣布超时
        isOverTime && (_overtime = setTimeout(function() {
            log.setFilterMsg('getLocation-timeOut');
            log.error('getLocation：获取超时');
            reject({
                code: 10010,
                errText: '获取超时了~'
            });
        }, 10 * 1000));
        // return reject({ errText: '定位获取异常~' });

        // 不在缓存有效期,直接重新获取
        wx.getLocation({
            type: 'gcj02', // wgs84
            isHighAccuracy: true,
            success: (res) => {
                clearTimeout(_overtime);
                //特殊情况
                if (res.longitude <= 0 || res.latitude <= 0) {
                    return reject({ errText: '定位获取异常~' });
                }
                //坐标转化
                // let parmas = wgs84togcj02(res.longitude, res.latitude);wgs84
                let parmas = {
                    longitude: res.longitude,
                    latitude: res.latitude
                };

                //成功返回结果
                resolve({
                    data: parmas
                });
                //存储到全局
                store.commit('user/setLocation', parmas)
                    //保存到本地
                setStorage('getUserLocation', JSON.stringify({
                    lastModified: Date.now(),
                    data: parmas
                }));

                // _closeLoading()
            },
            fail: function(err) {
                clearTimeout(_overtime);
                //关闭loading
                // _closeLoading()
                //只打印异常情况
                log.setFilterMsg('getLocation');
                log.error('getLocation：' + JSON.stringify(err));

                // _locationType = 'wgs84'
                if (isFailBack) { //异常自行处理
                    return reject(isWXPermission(err.errMsg));
                }
                wx.showModal({
                    title: '定位授权',
                    content: '具体原因与网络、信号、手机定位权限等因素相关，请检查后再尝试，谢谢',
                    success: (res) => {
                        if (res.confirm) {
                            wx.getSetting({
                                complete(res) {
                                    if (res.authSetting && !res.authSetting['scope.userLocation']) {
                                        return wx.openSetting({
                                            success: (res) => {
                                                if (!res.authSetting['scope.userLocation']) {
                                                    reject();
                                                    return wx.showToast({
                                                        title: '您未允许获取定位权限',
                                                        icon: 'none',
                                                        duration: 1500
                                                    });
                                                }
                                            }
                                        });
                                    }
                                    wx.showToast({
                                        title: getErrorMsg(err.errMsg) || err.errMsg,
                                        icon: 'none',
                                        duration: 4000
                                    });
                                    reject();
                                }
                            });
                            return
                        }
                        reject();
                    }
                });
            }
        });
    });
}
