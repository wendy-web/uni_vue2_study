const utils = require("./util");
import {wgs84togcj02} from './coordtransform.js';
module.exports = {
    //获取用户定位信息
    getUserLocation(isFailBack = false) { //isFailBack 为true 时，函数不自行处理异常，移交给调用者

        return new Promise((resolve, reject) => {
            let cache = getStorage('getUserLocation')
            cache = cache && JSON.parse(cache)

            //判断是否有缓存，并且在缓存有效期
            if (cache && VALID_CACHE(60 * 30, cache.lastModified)) {
                return resolve({
                    data: cache.data,
                    isold: true //true代表缓存数据，false代表新获取的数据
                })
            }
            //不在缓存有效期,直接重新获取        
            wx.getLocation({
                type: 'gcj02',
                success: (res) => {

                    let parmas = {
                        longitude: res.longitude,
                        latitude: res.latitude
                    }
                    //成功返回结果
                    resolve({
                        data: parmas
                    })

                    setStorage('getUserLocation', JSON.stringify({
                        lastModified: Date.now(),
                        data: parmas
                    }))

                },
                fail: function (err) {
                    if (isFailBack) { //异常自行处理
                        return reject(err)
                    }
                    // 2023年8月30日 用户隐私保护提示
                    let {errno=''} = err;
                    if(errno&&errno == 104){
                      return reject(err);
                    };
                    wx.showModal({
                        title: '定位授权',
                        content: '微信未授权定位或网络信号差(微信内设置无效时，可能需要前往“系统设置”允许微信定位权限)',
                        success: (res) => {
                            reject(err);
                            if (res.confirm) {
                                wx.openSetting({
                                    success: (res) => {
                                        if (!res.authSetting["scope.userLocation"]) {
                                            return wx.showToast({
                                                title: '您未允许获取定位权限',
                                                icon: 'none',
                                                duration: 1500
                                            })
                                        }
                                    }
                                })
                            }
                            // //取消直接去新闻页
                            // wx.reLaunch({
                            //     url: '/pages/xxx'
                            // })
                        }
                    })
                }
            })

        })
    },
    //获取用户定位：type="wgs84",极端情况下使用，该定位非精准定位，用户打开所有权限都获取不到时再调用该方法
    getUserLocationWGS() {

        return new Promise((resolve, reject) => {
            let cache = getStorage('getUserLocation')
            cache = cache && JSON.parse(cache)

            //判断是否有缓存，并且在缓存有效期
            if (cache && VALID_CACHE(60 * 2, cache.lastModified)) {
                return resolve({
                    data: cache.data,
                    isold: true //true代表缓存数据，false代表新获取的数据
                })
            }
            //不在缓存有效期,直接重新获取        
            wx.getLocation({
                type: 'wgs84',
                success: (res) => {
                    let gcj02 = wgs84togcj02(res.longitude,res.latitude);
                    let parmas = {
                        longitude: gcj02.longitude,
                        latitude: gcj02.latitude
                    }
                    //成功返回结果
                    resolve({
                        data: parmas
                    })

                    setStorage('getUserLocation', JSON.stringify({
                        lastModified: Date.now(),
                        data: parmas
                    }))

                },
                fail: function (err) {

                    reject(err)
                }
            })

        })
    },
    // ip地址转换经纬度
    ipAddress() {
        return new Promise((resolve, reject) => {
            utils.isHide().then(res => {
                if(res.lat&&res.lng&&res.city){
                    resolve({
                        latitude:res.lat,
                        longitude:res.lng
                    });
                }else{
                    reject(res);
                }
            }).catch(err=>{
                reject(err);
            })
        })
    }
}

//缓存时间是否在有效期
function VALID_CACHE(cacheMaxAge, lastModified) {

    return lastModified + cacheMaxAge * 1000 >= Date.now()

}

function setStorage(key, data) {

    try {
        wx.setStorageSync(key, data)
    } catch (e) {
        //TODO handle the exception
    }
}

function getStorage(key) {
    let cache = null
    try {
        cache = wx.getStorageSync(key)
    } catch (e) {
        //TODO handle the exception
    }
    return cache
}