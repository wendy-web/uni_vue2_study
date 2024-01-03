//index.js
//获取应用实例
const app = getApp();
const utils = require('../../../../utils/util.js');
const http = require('../../../../utils/http.js');
const log = require("../../../../utils/log.js");
const getLocation = require('../../../../utils/location');
// 在页面中定义插屏广告
let interstitialAd = null;
const yinsi = require("../../../user/register/rich");
let latitude = '';
let longitude = '';
let checkA = false;
let checkB = false;
let _request = false;
let route = '';
const COS_URL = app.globalData.COS_URL;
Page({
  data: {
    userdata: null,
    canIUse: wx.getUserProfile ? true : false,
    bdimg: COS_URL + '/public/img/Tian/202101/login.png',
    systemInfo: app.globalData.systemInfo,
    yinsiPop: false,
    yinsiChecked: false,
    checkItem: [{
      name: '1',
      value: '1'
    }, ],
    supportAvatarInput: true,//是否支持头像输入2.27.0以上
    default_url:'https://file.y1b.cn/public/yl_login.png',//默认用户头像
    icon_camer:COS_URL+ '/public/img/bfyl/assets/login/icon_camer.png',
    icon_wechat:COS_URL+ '/public/img/bfyl/assets/login/icon_wechat.png',
  },

  onLoad: function (options) {
    // 在页面onLoad回调事件中创建插屏广告实例
    // if (wx.createInterstitialAd) {
    //   interstitialAd = wx.createInterstitialAd({
    //     adUnitId: 'adunit-99ae24c8a28cbe02'
    //   })
    //   interstitialAd.onLoad(() => {})
    //   interstitialAd.onError((err) => {})
    //   interstitialAd.onClose(() => {})
    // }
    //获取跳转路由
    console.log("登录页 options:", options);
    if (options.route) {
      route = options.route;
    } else {
      route = '';
    }
    let userdata = wx.getStorageSync('userdata');
    // 如果支持头像输入，获取用户信息：无头像更新默认头像
    if (this.data.supportAvatarInput) {
      if (userdata) {
        this.setData({
          userdata
        });

      } else {
        utils.getUserInfoNew().then(res => {
          this.setData({
            userdata: res
          });
        })
      }
    }
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: "绑定微信"
    })
    // 在适合的场景显示插屏广告
    this.showAd(true);
    // if (interstitialAd && utils.blockAd()) {
    //   setTimeout(() => {
    //     interstitialAd.show().catch((err) => {
    //       console.error(err)
    //     })
    //   }, 100)
    // }
    // 更新版本库判断
    let {systemInfo} = this.data;
    if(systemInfo){
      this.setData({
        supportAvatarInput:utils.compareVersion(app.globalData.systemInfo.SDKVersion, '2.27.0') >= 0
      })
    }
  },
  onHide: function () {
    _request = false;
  },
  onUnload: function () {
    _request = false;
    route = '';
  },
  bindGetUserInfo: function (e) {
    var that = this;
    getLocation.getUserLocation(true).then(getUserLocation => {
      latitude = getUserLocation.data.latitude
      longitude = getUserLocation.data.longitude
      //缓存定位信息
      wx.setStorageSync('location', getUserLocation.data);
      log.info("wx.getLocation 成功：", getUserLocation);
      //登录/更新用户信息,需要传经纬度参数
      that.login();
    }).catch(err => {
      //getUserLocation 不传参true以下不执行
      log.addFilterMsg("bindGetUserInfo");
      log.error("getUserLocation err：", err)
      //先判断系统定位、微信定位是否授权
      wx.getSystemInfo({
        success: (_getSystemInfo) => {
          console.log("_getSystemInfo:", _getSystemInfo);
          that.setData({
            systemInfo: _getSystemInfo
          });
          if (!_getSystemInfo.locationEnabled || !_getSystemInfo.locationAuthorized) {
            wx.showModal({
              title: '温馨提示',
              content: '请您确保手机已打开定位且已授权微信获取定位信息。',
              showCancel: false
            })
            return false;
          } else {

            utils.getSetting().then(getSetting => {
              if (typeof (getSetting.authSetting["scope.userLocation"]) != 'undefined' && !getSetting.authSetting["scope.userLocation"]) {
                wx.showModal({
                  title: '定位授权',
                  content: '请允许小程序获取定位权限后再操作',
                  success: (showModal) => {
                    if (showModal.confirm) {
                      wx.openSetting({
                        success: (openSetting) => {
                          if (openSetting.authSetting["scope.userLocation"]) {
                            getLocation.getUserLocation(true).then(getUserLocation => {
                              latitude = getUserLocation.data.latitude
                              longitude = getUserLocation.data.longitude
                              //缓存定位信息
                              wx.setStorageSync('location', getUserLocation.data);
                              that.setData({
                                longitude: longitude,
                                latitude: latitude
                              })
                              log.info("wx.getLocation 成功：", getUserLocation);
                              //登录/更新用户信息,需要传经纬度参数
                              that.login();
                            }).catch(err => {
                              let str = JSON.stringify(err);

                              wx.showModal({
                                title: '温馨提示',
                                content: "定位失败\n当前网络不稳定,请切换Wi-Fi网络重试;\n" + str,
                                showCancel: false,
                                success: function (_result) {}
                              })
                            })

                          }

                        }
                      })
                    }
                  }
                })
              } else {
                getLocation.getUserLocationWGS().then(wgs => {
                  log.setFilterMsg("getUserLocationWGS");
                  log.error("getUserLocationWGS：", wgs);
                  const latitude = wgs.data.latitude
                  const longitude = wgs.data.longitude
                  //缓存定位信息
                  wx.setStorageSync('location', wgs)
                  that.setData({
                    longitude: longitude,
                    latitude: latitude
                  })
                  that.login();
                }).catch(wgsErr => {
                  let str = JSON.stringify(wgsErr);
                  wx.showModal({
                    title: '温馨提示',
                    content: "定位失败\n当前网络不稳定,请切换Wi-Fi网络重试;\n" + str,
                    showCancel: false,
                    success: function (_result) {}
                  })
                })
              }
            }).catch(err => {

            });
          }
        }
      })
    });

  },
  //用户授权登录/更新资料封装
  login: function () {
    var that = this;
    if (longitude && latitude) {
      that.updateUserInfo(longitude, latitude);
    } else {
      getLocation.getUserLocation().then(res => {
        longitude = res.data.longitude;
        latitude = res.data.latitude;
        that.updateUserInfo(longitude, latitude);
      });
    }
  },
  updateUserInfo: function (_longitude, _latitude) {
    let that = this;
    log.setFilterMsg("updateUserInfo");
    wx.getUserInfo({
      withCredentials: "true",
      lang: 'zh_CN',
      success: function (res) {
        //登录中
        wx.showLoading({
          title: '登陆中'
        });
        //获取用户信息
        if (res.errMsg == 'getUserInfo:ok') {
          console.log('获取到的用户信息115：', res);
          let originalUserInfo = res.userInfo;
          wx.setStorageSync('originalUserInfo', JSON.stringify(originalUserInfo));
          var data = {
            'encryptedData': res.encryptedData,
            'iv': res.iv,
            'longitude': _longitude,
            'latitude': _latitude
          }

          // console.log('post data:', data);
          that.updatePost(data)
        }
      },
      fail: function (res) {
        console.log('getuser fail：', res);
        log.info(" wx.getUserInfo fail:", res)
        wx.showModal({
          title: '微信绑定授权',
          content: '请允许获取个人信息后重新进入绑定页面',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {
                  if (res.authSetting['scope.userInfo']) {
                    //获取用户信息
                    wx.getUserInfo({
                      complete: (res) => {
                        log.info(" wx.getUserInfo 重新授权:", res)
                        var data = {
                          'encryptedData': res.encryptedData,
                          'iv': res.iv,
                          'longitude': longitude,
                          'latitude': latitude
                        }

                        that.updatePost(data)
                      },
                    })

                  }
                }
              })
            }
          }
        })

      },
    })
  },
  updatePost: function (data) {
    let that = this;
    utils.updateUserInfo(data).then(res => {
      log.info("更新用户信息返回:", res)
      //更新用户信息返回：
      console.log('更新用户信息返回：', res)
      if (res.code == '1') {
        wx.setStorageSync('islogin', 1);
        //绑定微信更新用户信息成功跳转
        that.goscan();
      } else {
        wx.showModal({
          title: '提示',
          content: res.msg,
          showCancel: false
        })
      }
    }).catch(err => {
      wx.hideLoading({
        success: (res) => {},
      })
      console.error("更新用户信息失败：", err)
    })

  },
  //登录成功以后跳转扫码
  goscan: function (parse) {

    console.log("route:", route);
    if (wx.getStorageSync('qrcode')) {
      wx.redirectTo({
        url: '/pages/zongduan/saoma/index',
      })
      return
    }
    if (route) {
      wx.reLaunch({
        url: '/' + route,
      })
    } else {
      wx.switchTab({
        url: '/pages/tabBar/shouye/index',
      })
    }
  },
  //定位获取失败，跳转到首页
  goHome: function () {
    wx.setStorageSync('islogin', 1);
    wx.switchTab({
      url: '/pages/tabBar/shouye/index',
    })
  },
  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)

  },
  checkSession: function () {
    var yinsiChecked = this.data.yinsiChecked;
    var that = this;
    if (!yinsiChecked) {
      wx.showToast({
        title: '请阅读相关协议',
        icon: 'none'
      })
      return
    }
    //session判断是否登录失效重新执行登录流程
    wx.checkSession({
      success: res => {
        console.log("登录检测session success：", res);
        log.addFilterMsg("loginCheckSession");
        log.info("loginCheckSession sucess token:", wx.getStorageSync('token'));
        if (!wx.getStorageSync('token')) {
          console.log("bangding checkSession 无token");
          http.wxlogin(true).then(res => {
            console.log("L331:", res);
            that.bindGetUserInfo();
          }).catch(err => {
            console.log("L334:", err);

          });
          return
        }
        this.bindGetUserInfo();
      },
      fail: res => {
        wx.removeStorageSync('token');
        console.log("登录检测session fail：", res);
        log.addFilterMsg("loginCheckSessionFail");
        log.info("loginCheckSessionFail :", res);
        http.wxlogin(true).catch(err => {
          let str = JSON.stringify(err);
          wx.showModal({
            title: '温馨提示',
            content: "登录失败：" + str,
            showCancel: false
          })
        });
      }
    })
  },
  yinsiPop: function () {
    this.setData({
      yinsiPop: true,
      nodes: yinsi,
    });
  },
  iKnow: function () {
    this.setData({
      yinsiPop: false,
      yinsiChecked: true,
    });
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checked = e.detail.value;
    if (checked[0] == 1) {
      this.setData({
        yinsiChecked: true
      });
    } else {
      this.setData({
        yinsiChecked: false
      });
      checkA = false;
      checkB = false;
    }
  },
  cancel: function () {
    wx.switchTab({
      url: '/pages/tabBar/shouye/index',
    })
  },
  checkDeal: function (e) {
    let id = e.currentTarget.dataset.id;
    console.log("id:", id);
    let urlA = 'https://txc.y1b.cn/index/index/ysxy.html';
    urlA = encodeURIComponent(urlA);
    let urlB = 'https://txc.y1b.cn/index/index/bfylfl.html';
    urlB = encodeURIComponent(urlB);
    if (id == 1) {
      checkA = true;
      if (checkA && checkB) {
        this.setData({
          yinsiChecked: true
        })
      }
      wx.navigateTo({
        url: '/pages/tabBar/shouye/webview/index?link=' + urlA,
      })
    } else {
      checkB = true;
      if (checkA && checkB) {
        this.setData({
          yinsiChecked: true
        })
      }
      wx.navigateTo({
        url: '/pages/tabBar/shouye/webview/index?link=' + urlB,
      })
    }
  },
  onUnload: function () {},
  contactService: function () {
    let url = "/pages/zhongduan/geren/guanyu/index";
    wx.navigateTo({
      url: url,
    })
  },

  //获取用户信息新接口：wx.getUserProfile
  getUserProfile: function () {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    if (_request) return;
    _request = true;
    let timeStart = Date.now();
    log.addFilterMsg("startgetUserProfile");
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '获取你的昵称、头像、地区及性别',
      success: function (res) {
        _request = false;
        wx.hideLoading();
        let userProfile = res.userInfo;
        log.info("getUserProfile success耗时：", (Date.now() - timeStart) / 1000 + "秒", );
        //session判断是否登录失效重新执行登录流程
        wx.checkSession({
          success: res => {
            log.addFilterMsg("loginCheckSession");
            log.info("loginCheckSession sucess token:", wx.getStorageSync('token'));
            if (!wx.getStorageSync('token')) {
              console.log("bangding checkSession 无token");
              http.wxlogin(true).then(res => {
                console.log("login 448:", res)
                that.updateUserProfile(userProfile);
              }).catch(err => {
                console.log("login 451:", err)
              });
              return
            }
            that.updateUserProfile(userProfile);

          },
          fail: res => {
            wx.removeStorageSync('token');
            console.log("登录检测session fail：", res);
            log.addFilterMsg("loginCheckSessionFail");
            log.info("loginCheckSessionFail :", res);

            http.wxlogin(true).then(res => {
              that.updateUserProfile(userProfile);
            });
          }
        })
      },
      fail: function (result) {
        console.log(result);
        _request = false;
        wx.hideLoading();
        log.info("getUserProfile fail耗时：", (Date.now() - timeStart) / 1000 + "秒");
        let findIndex = result.errMsg ? result.errMsg.indexOf("auth deny") : -1;
        console.log("findIndex:", findIndex)
        if (result.errMsg && findIndex != -1) {
          wx.showModal({
            title: '温馨提示',
            content: "请允许获取用户信息",
            showCancel: false
          })
        } else {

          log.addFilterMsg("getUserProfileFail");
          log.info("getUserProfileFail:", result)
          wx.showModal({
            title: '温馨提示',
            // content: "微信接口异常请重试\n异常信息:" + result.errMsg,
            content: "微信获取授权信息失败，请重试",
            showCancel: false
          })

        }
      }
    })



  },
  updateUserProfile: function (userInfo) {
    let that = this;

    http.post('/api/user/userprofile', userInfo).then(res => {
      wx.setStorageSync('islogin', 1);
      wx.removeStorageSync('newUser');
      that.goscan();
    })
  },
  yinsiCheck: function () {
    var yinsiChecked = this.data.yinsiChecked;
    if (!yinsiChecked) {
      wx.showToast({
        title: '请阅读相关协议',
        icon: 'none'
      })
      return
    }
  },
  //初始化插屏广告
  showAd: function (isShow = false) {
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-99ae24c8a28cbe02' //线上版
      })
      interstitialAd.onLoad(() => {
        if (isShow) {
          interstitialAd.show().catch((err) => {
            console.error("adShow err:", err);
          })
        }
      })
      interstitialAd.onError((err) => {
        console.error("插屏广告onError:", err);
      })
      interstitialAd.onClose(() => {})
    }
  },
  // 刷新登录状态
  refreshToken() {
    wx.showLoading({
      title: '加载中···',
    })
    let that = this
    //session判断是否登录失效重新执行登录流程
    wx.checkSession({
      success: res => {
        console.log("refreshToken 登录检测session success：", res);
        log.addFilterMsg("refreshToken");
        if (!wx.getStorageSync('token') || wx.getStorageSync('islogin') != 1) {
          http.wxlogin(true).then(res => {
            log.info("refreshToken sucess token:", wx.getStorageSync('token'));
            that.goscan();
          }).catch(err => {

          });
          return
        }
        
        wx.hideLoading();
        log.info("refreshToken sucess token:", wx.getStorageSync('token'));
        this.goscan();
      },
      fail: res => {
        wx.removeStorageSync('token');
        console.log("登录检测session fail：", res);
        log.addFilterMsg("refreshTokenCheckSessionFail");
        log.info("refreshTokenCheckSessionFail :", res);
        http.wxlogin(true).then(res=>{
          log.info("refreshToken sucess token:", wx.getStorageSync('token'));
          that.goscan();
        }).catch(err => {
          let str = JSON.stringify(err);
          wx.showModal({
            title: '温馨提示',
            content: "登录失败：" + str,
            showCancel: false
          })
        });
      }
    })
  }

})