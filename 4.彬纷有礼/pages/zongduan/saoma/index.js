//index.js
const app = getApp(); //获取应用实例
const utils = require('../../../utils/util.js');
const http = require('../../../utils/api.js');
const _auth = require('../../../utils/auth');
const log = require('../../../utils/log.js');
const getLocation = require('../../../utils/location');
let longitude = '';
let latitude = '';
let qrCode = '';
let toscan = true; //相机打开状态
let videoAd = null; // 在页面中定义激励视频广告
let hided = false;
const COS = app.globalData.COS_URL;
let addScanTimesCode = '';
let _repeated = false;
let systemInfo = app.globalData.systemInfo;
let hnTypeArr = app.globalData.hnTypeArr; //红牛箱内码红包类型
let zmTypeArr = app.globalData.zmTypeArr; //战马箱内码红包类型
let hn2in1 = app.globalData.hn2in1; //红牛箱内码红包类型：红包卡券2选1
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime.js'
const shopActUtils = require('../../../api/shopActivity/utils');
const storeRankUtils = require("../../../api/storeRank/utils");

import {
  xdyhMini,
} from '../../../api/openMiniProgram'
Page({
  data: {
    backimg: COS + "/public/img/binfengift/scanBg0805.png",
    userInfo: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    scanCode: '',
    csPop: false,
    csPopUrl: COS + '/public/img/Tian/202101/hbPop.png',
    csPopBtl: COS + '/images/Pops/hbPopBtl.png',
    csPopBtr: COS + '/images/Pops/hbPopBtr.png',
    //三期
    getCouponPop: false, //核销成功领券弹窗
    oneenjoy1: COS + '/public/img/phaseIII/oneenjoy08192.png',
    disabled: false, //扫一扫防止重复打开相机
    btnurl: COS + "/images/Pops/addScanTimes.png",
    popImg: '',
    adShow: false,
    paper_code_pop: false, //纸质码状态弹窗
    shopInfoPop: false, //店铺信息弹窗
    shopInfo_btn: COS + '/public/img/phaseIII/oneenjoy0818.png',
    //2021年3月16日
    hxSuccessIcon: COS + '/public/img/phaseIII/202103/success.png',
    hxSuccessBG: COS + '/public/img/phaseIII/202103/bg.png',
    hxFailIcon: COS + '/public/img/phaseIII/202103/warn.png',
    blockAd: false, //广告屏蔽
    unexpired: false, //店铺排行榜活动未过期
    end_more_seven: false, //活动结束7天内
    unlock_display: false, //解锁陈列弹窗
    displayInfo: null, //陈列活动信息
    actInfo: null, //开箱活动信息
    rankInfo: null, //冲榜活动信息
    hxWarnIcon: `${COS}/public/img/bfyl/2023/07/icon_warn.png`, // 2023年7月10日 重复扫核销码警示图标
    isBackPage: false, //从其它页面返回
  },

  onLoad: function (options) {
    _repeated = false;
    console.log('获取页面携带参数：', options);
    let scanCode = '';
    //获取页面传参
    if (options.q) {
      scanCode = options.q;
      this.setData({
        scanCode
      })
      toscan = false;
      hided = false;
      //缓存至本地，未登录用户获取跳转
      console.log("微信扫码跳转小程序携带参数：", options);
      const code = decodeURIComponent(options.q);
      wx.setStorageSync('qrcode', code);
    } else {
      this.setData({
        scanCode
      })
    }
    if (options.hide) {
      hided = false
    }
    this.initRewardedVideoAd()
  },
  onReady: function () {
    systemInfo = app.globalData.systemInfo;
    if (systemInfo) {
      let screenHeight = systemInfo.windowHeight;
      this.setData({
        screenHeight: screenHeight,
      });
    } else {
      wx.getSystemInfo({
        success: (result) => {
          systemInfo = result;
          let screenHeight = systemInfo.windowHeight;
          this.setData({
            screenHeight: screenHeight,
          });
        },
      })
    }

  },
  // 初始化激励视频广告
  initRewardedVideoAd() {
    let that = this;
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd && !videoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-07646d607734aff9', //正式版
        multiton: true
        // adUnitId: 'adunit-8beb956de976f9ae' //测试版
      })
      videoAd.onLoad((res) => {})
      videoAd.onError((err) => {
        if (!that.data.csPop) return;
        that.setData({
          csPop: false
        });
        if (err.errCode == '1002' || err.errCode == '1004' || err.errCode == '1005' || err.errCode == '1006' || err.errCode == '1007' || err.errCode == '1008') {
          wx.hideLoading();
          wx.showModal({
            title: '温馨提示',
            content: '广告展示异常已为您跳过',
            showCancel: false,
            success(res) {
              //请求加次数
              that.addScanTimes();
            }
          })

        } else {
          wx.hideLoading()
          //其它错误情况记录实时日志
          log.addFilterMsg('Ad error');
          log.info(err.errCode, ":", err.errMsg);
        }
      })
      videoAd.onClose((res) => {
        that.setData({
          csPop: false
        });
        if (res && res.isEnded) {
          wx.showLoading({
            title: '正在加载',
          })
          //广告看完···请求+扫码次数
          that.addScanTimes();
        }
      })
    }
  },

  onShow() {
    let islogin = wx.getStorageSync('islogin');
    // 从上一页返回
    let {
      isBackPage
    } = this.data;
    if (isBackPage) {
      hided = false;
      this.setData({
        isBackPage: false
      })
    }
    if (islogin && islogin == 1) {
      this.initData()
    } else {
      app.tokenReadyCallback = (res) => {
        this.initData()
      }
    }
  },
  //初始化数据
  initData() {
    app.globalData.toscan = true;
    this.setData({
      blockAd: utils.blockAd()
    })
    //页面隐藏（打开了扫一扫）
    if (hided) {
      // if (!wx.getStorageSync('unlock_display')) {
      //   this.actCouponGetInfo();
      // }
      let {
        actInfo,
        actInfoGZ
      } = this.data;
      if (!actInfo) this.actCouponGetInfo();
      if (!actInfoGZ) this.gzUnboxActInfo();

      return
    }
    var code = wx.getStorageSync('qrcode')
    if (code) {
      this.setData({
        disabled: true
      });
      wx.showLoading({
        title: '正在提交',
        mask: false
      })
      this.postOption(code);
    } else {
      //判断用户是否授权获取定位信息,并打开扫一扫
      this.location();
    }
    //获取用户信息
    let userdata = wx.getStorageSync('userdata');
    if (userdata) {
      this.setData({
        userInfo: userdata, //有用户信息，接受邀请按钮不获取用户信息·······
      });
    } else {
      utils.getUserInfoNew().then(res => {
        userdata = res;
        this.setData({
          userInfo: res
        });
      })
    }
    //app.watch
    let cosAddress = _auth.getCosAddress();
    app.watch(function (val, name) {
      if (!cosAddress && name == "cosAddress") {
        if (typeof val === 'string') {
          _auth.setCosAddress(JSON.parse(val));
        }
        if (typeof val === 'object') {
          _auth.setCosAddress(val);
        }
      }
    }.bind(this), "cosAddress")
    if (cosAddress && !toscan && !this.data.disabled) {
      let redbull = cosAddress.A9.value;
      let popImg = [];
      popImg[0] = redbull[Math.floor((Math.random() * redbull.length))];
      this.setData({
        popImg
      });
    }
    if (app.globalData.toscan) {
      toscan = true
    }

    let phaseIII = wx.getStorageSync('phaseIII');
    let mylbs = wx.getStorageSync('mylbs') && JSON.parse(wx.getStorageSync('mylbs'));
    //判断当前位置所在城市是否在活动范围内
    if (mylbs && utils.isStoreRankArea(mylbs.province)) {
      this.setData({
        activitySZ: true,
        phaseIII: phaseIII
      })
    } else {
      utils.isHide().then(data => {
        this.setData({
          activitySZ: data.act_time.show,
          phaseIII: data.show,
          blockAd: data.ad_show
        })

      })

    }
    let isHide = wx.getStorageSync('isHide');
    if (isHide) {
      isHide = JSON.parse(isHide);
      let expireTime = isHide.data.act_time.end + isHide.data.act_time.expire;
      if ((new Date() - expireTime) > 0) {
        this.setData({
          unexpired: false
        })
      }

    }
  },
  //获取定位并打开扫一扫
  location: function () {
    var that = this;
    this.setData({
      disabled: false
    })
    getLocation.getUserLocation(true).then(res => {
      longitude = res.data.longitude;
      latitude = res.data.latitude;
      if (toscan) {
        //打开扫一扫
        if (!wx.getStorageSync('token')) {
          app.tokenReadyCallback = res => {
            that.openScan();
            return false;
          }
        } else {
          that.openScan();
          return false;
        }
      } else {
        toscan = true;
      }
    }).catch(res => {
      console.log("307````:", res)
      // 2023年8月29日 用户隐私授权判断
      let {
        errno = ''
      } = res;
      if (errno && errno == 104) {
        this.setData({
          disabled: false
        })
        return;
      }
      if (!systemInfo.locationEnabled || !systemInfo.locationAuthorized) {
        wx.showModal({
          title: '温馨提示',
          content: '请您确保手机已打开系统定位且已授权微信获取定位权限.',
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
                          if (toscan) {
                            //打开扫一扫
                            if (!wx.getStorageSync('token')) {
                              app.tokenReadyCallback = res => {
                                that.openScan();
                                return false;
                              }
                            } else {
                              that.openScan();
                              return false;
                            }
                          } else {
                            toscan = true;
                          }
                        }).catch(err => {
                          let str = JSON.stringify(err);
                          log.addFilterMsg("locationFailed");
                          log.error("locationFailed", str);
                          console.log(err)
                          wx.showModal({
                            title: '定位失败',
                            content: "当前网络不稳定,请稍后重试",
                            showCancel: false,
                            success: function (_result) {}
                          })
                          // getLocation.ipAddress().then(ipaddress => {
                          //     latitude = ipaddress.latitude;
                          //     longitude = ipaddress.longitude;
                          //     that.openScan();
                          // }).catch(errs=>{
                          //     wx.showModal({
                          //         title: '温馨提示',
                          //         content: "定位失败\n当前网络不稳定,请切换Wi-Fi网络重试;\n" + str,
                          //         showCancel: false,
                          //         success: function (_result) {}
                          //     })
                          // })
                        })

                      }

                    }
                  })
                }
              }
            })
          } else {
            getLocation.getUserLocationWGS().then(wgs => {
              log.addFilterMsg("getUserLocationWGS");
              log.error("getUserLocationWGS：", wgs);

              latitude = wgs.data.latitude
              longitude = wgs.data.longitude
              if (toscan) {
                //打开扫一扫
                if (!wx.getStorageSync('token')) {
                  app.tokenReadyCallback = res => {
                    that.openScan();
                    return false;
                  }
                } else {
                  that.openScan();
                  return false;
                }
              } else {
                toscan = true;
              }
            }).catch(wgsErr => {
              let str = JSON.stringify(wgsErr);
              log.addFilterMsg("locationFailed");
              log.error("locationFailedWGS", str);
              console.log("wgsErr:", wgsErr)
              wx.showModal({
                title: '定位失败',
                content: "当前网络不稳定,请稍后重试",
                showCancel: false,
                success: function (_result) {}
              })


            })
          }
        }).catch(err => {
          that.setData({
            disabled: false
          })
        });
      }

    });
    return

  },
  //打开扫一扫
  openScan: function () {
    var that = this
    if (this.data.disabled) {
      return
    }
    this.setData({
      disabled: true
    });
    getLocation.getUserLocation(true).then(getUserLocation => {
      latitude = getUserLocation.data.latitude;
      longitude = getUserLocation.data.longitude;
      that.wxScanCode();
    }).catch(err => {
      log.addFilterMsg("getLocationErr");
      log.info("getLocationErr:", err)
      // 2023年8月29日 用户隐私授权判断
      let {
        errno = ''
      } = err;
      if (errno && errno == 104) {
        this.setData({
          disabled: false
        })
        return;
      }

      console.log("438:", err)
      wx.getSystemInfo({
        success: (_getSystemInfo) => {
          that.setData({
            systemInfo: _getSystemInfo,
            disabled: false
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
                that.setData({
                  disabled: false
                });
                wx.showModal({
                  title: '定位授权',
                  content: '请允许小程序获取定位权限后再操作',
                  success: (showModal) => {
                    if (showModal.confirm) {
                      wx.openSetting({
                        success: (openSetting) => {
                          if (openSetting.authSetting["scope.userLocation"]) {
                            getLocation.getUserLocation(true).then(getUserLocation => {
                              latitude = getUserLocation.data.latitude;
                              longitude = getUserLocation.data.longitude;
                              that.wxScanCode();
                            }).catch(err => {
                              let str = JSON.stringify(err);
                              log.addFilterMsg("locationFailed");
                              log.error("locationFailed", str);
                              wx.showModal({
                                title: '定位失败',
                                content: "当前网络不稳定,请稍后重试",
                                showCancel: false,
                                success: function (_result) {}
                              })
                              // getLocation.ipAddress().then(ipaddress => {
                              //     latitude = ipaddress.latitude;
                              //     longitude = ipaddress.longitude;
                              //     that.wxScanCode();
                              // }).catch(errs => {
                              //     wx.showModal({
                              //         title: '温馨提示',
                              //         content: "定位失败\n当前网络不稳定,请切换Wi-Fi网络重试;\n" + str,
                              //         showCancel: false,
                              //         success: function (_result) {}
                              //     })
                              // })

                            })

                          }

                        }
                      })
                    }
                  }
                })
              } else {
                getLocation.getUserLocation(true).then(res => {
                  longitude = res.data.longitude;
                  latitude = res.data.latitude;
                  that.wxScanCode();
                }).catch(err => {
                  getLocation.getUserLocationWGS().then(wgs => {
                    log.addFilterMsg("getUserLocationWGS");
                    log.error("getUserLocationWGS：", wgs);
                    latitude = wgs.data.latitude
                    longitude = wgs.data.longitude
                    that.wxScanCode();
                  }).catch(wgsErr => {
                    that.setData({
                      disabled: false
                    })
                    let str = JSON.stringify(wgsErr);
                    log.addFilterMsg("locationFailed");
                    log.error("locationFailedWGS", str);
                    wx.showModal({
                      title: '定位失败',
                      content: "当前网络不稳定,请稍后重试",
                      showCancel: false,
                      success: function (_result) {}
                    })
                    // getLocation.ipAddress().then(ipaddress => {
                    //     latitude = ipaddress.latitude;
                    //     longitude = ipaddress.longitude;
                    //     that.wxScanCode();
                    // }).catch(errs => {
                    //     wx.showModal({
                    //         title: '温馨提示',
                    //         content: "定位失败\n当前网络不稳定,请切换Wi-Fi网络重试;\n" + str,
                    //         showCancel: false,
                    //         success: function (_result) {}
                    //     })
                    // })

                  })
                })


              }
            }).catch(err => {
              that.setData({
                disabled: false
              })
            });
          }
        },
        fail: (err) => {
          log.info("getSystemInfoErr:", err)
          that.setData({
            disabled: false
          });
        }
      })
    })



  },
  //扫码识别结果处理业务
  wxScanCode: function () {
    var that = this;
    toscan = false;
    app.globalData.toscan = false;
    wx.scanCode({
      success: (res) => {
        wx.showLoading({
          title: '正在提交',
          mask: false
        })
        var code = res.result;
        that.setData({
          scanCode: code
        })
        qrCode = res.result;
        let str = JSON.stringify(res);
        if (!longitude || !latitude) {
          wx.hideLoading({
            complete: (res) => {},
          })
          wx.showModal({
            title: '温馨提示',
            content: '未获取到您的定位信息，请您确保手机已打开定位后重新进入小程序再次尝试。',
            showCancel: false
          })
          return false;
        }
        var search = code.search('HX=');
        if (search != -1) {
          //是核销码 请求接口
          var hxCode = code.split('HX=')[1];
          var data = {
            order: hxCode,
          }
          that.checkHX(data);
          return

        }
        //Cannot read property 'split' of null
        log.addFilterMsg('扫码code');
        log.info("wx.scanCode:", res);

        let getUrlObj = utils.getUrlObj(code);
        if (getUrlObj.HY && getUrlObj.token) {
          wx.hideLoading({
            complete: (res) => {},
          })
          wx.removeStorageSync('qrcode');
          wx.navigateTo({
            url: '/pages/user/register/dy?sid=' + getUrlObj.HY + '&token=' + getUrlObj.token,
          })
          return false;
        }
        //码值存在sid需要判断是否是纸质码
        if (getUrlObj && getUrlObj.sid) {
          wx.hideLoading({
            complete: (res) => {},
          })
          let userdata = this.data.userInfo;
          utils.paperCodeExchangeShopId(getUrlObj.sid).then(res => {
            /** 
             *  code=0 请创建店铺后再扫纸质码 已处理
                code=1 //纸质码已被绑定
                code=2 //您的店铺已绑定纸质码，是否需要更换纸质码？
                code=3 //您所在的店铺已绑定纸质码，若需更换，请联系掌柜 已处理
                code=4 //绑定后，不影响原有彬纷有礼-店铺码的使用。
                code=5 //您无权限绑定该纸质码，请联系您所在店铺掌柜绑定。 已处理
            */
            if (res.code == 1) {
              wx.removeStorageSync('qrcode');


              utils.getShopInfoMini(res.data.sid).then(data => {
                data.isPaperCode = true;
                if (userdata.shop_id !== data.sid) {
                  this.setData({
                    notMyShop: true,
                    shopInfo: data,
                    // shopInfoPop:true,
                    bindedShopInfo: true,
                    alias_id: getUrlObj.sid
                  })
                } else {
                  this.setData({
                    notMyShop: false,
                    shopInfo: data,
                    // shopInfoPop:true,
                    bindedShopInfo: true,
                    alias_id: getUrlObj.sid
                  })
                }
                // utils.getUserInfoNew().then(userdata=>{
                // })
                // this.setData({
                //     shopInfo: data,
                //     shopInfoPop:true,
                //     bindedShopInfo: true,
                // })
              }).catch(err => {
                if (err && err.msg) {
                  wx.showModal({
                    title: '温馨提示',
                    content: err.msg,
                    showCancel: false
                  })
                }
              })
              return
            }
            if (res.code == 2) {
              this.setData({
                paper_code_pop: true,
                paper_codeInfo: res,
                paperSid: getUrlObj.sid,
                paper_code_cancelText: "否",
                paper_code_confirmText: "是",
                onlyOnce: true
              })
              return
            }
            if (res.code == 4) {
              this.setData({
                paper_code_title: '确定绑定该纸质码？',
                paper_code_pop: true,
                paper_codeInfo: res,
                paperSid: getUrlObj.sid,
                paper_code_cancelText: "否",
                paper_code_confirmText: "是",
                onlyOnce: true
              })
              return
            }
          }).catch(err => {
            wx.removeStorageSync('qrcode');
            utils.getShopInfoMini(getUrlObj.sid).then(data => {
              data.isPaperCode = false;
              if (userdata.shop_id !== data.sid) {
                this.setData({
                  notMyShop: true,
                  shopInfo: data,
                  // shopInfoPop:true,
                  bindedShopInfo: true,
                })
              } else {
                this.setData({
                  notMyShop: false,
                  shopInfo: data,
                  // shopInfoPop:true,
                  bindedShopInfo: true,
                })
              }

            }).catch(err => {
              if (err && err.msg) {
                wx.showModal({
                  title: '温馨提示',
                  content: err.msg,
                  showCancel: false
                })
              }
            })
          })
          return false;
        }

        //缓存到本地qrcode：token登录状态失效时候扫一扫····
        wx.setStorageSync('qrcode', code);
        var auth = wx.getStorageSync('token');
        var data = {
          code: code,
          longitude: longitude,
          latitude: latitude
        }

        wx.showLoading({
          title: "正在提交",
          mask: false
        })
        that.scanQrPost(data);
      },
      fail: (err) => {
        log.addFilterMsg("scanCodeErr");
        log.info("scanCodeErr:", err);
      },
      complete: (res) => {
        console.log("wxScanCode complete:", res);
        wx.removeStorageSync('qrcode');
        toscan = false;
        app.globalData.toscan = false;
        that.setData({
          disabled: false
        });

      }
    })
  },

  //页面传参，获取定位，请求接口
  postOption: function (code) {
    var that = this;
    this.setData({
      code: code,
      disabled: false
    });
    getLocation.getUserLocation(true).then(res => {
      longitude = res.data.longitude;
      latitude = res.data.latitude;
      var code = that.data.code;
      var auth = wx.getStorageSync('token');
      var data = {
        code: code,
        longitude: longitude,
        latitude: latitude
      }
      //判断是否是核销码：'HX=' 
      var search = code.search('HX=');
      if (search != -1) {
        //是核销码 请求接口
        var hxCode = code.split('HX=')[1];
        //获取定位错误情况记录实时日志
        log.addFilterMsg('HX');
        log.info("postOption L557:", data);
        var data = {
          order: hxCode,
        }
        that.checkHX(data);
        return


      }
      that.scanQrPost(data);
    }).catch(res => {
      wx.hideLoading({
        complete: (res) => {},
      })
      //获取定位错误情况记录实时日志
      log.addFilterMsg('saoma location');
      log.info("扫码页面获取定位失败L693:", res);
      // 判断用户是否授权隐私保护
      let {
        errno = ''
      } = res;
      if (errno && errno == 104) {
        return
      }
      if (!systemInfo.locationEnabled || !systemInfo.locationAuthorized) {
        wx.showModal({
          title: '温馨提示',
          content: '请您确保手机已打开系统定位且已授权微信获取定位权限...',
          showCancel: false
        })
        return false;
      }
      //申请获取用户授权定位信息
      wx.showModal({
        title: '定位授权',
        content: '请允许获取定位权限以便使用扫码...',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success(res) {
                if (res.authSetting["scope.userLocation"]) {
                  getLocation.getUserLocation().then(res => {
                    longitude = res.data.longitude;
                    latitude = res.data.latitude;
                    var code = that.data.code;
                    var auth = wx.getStorageSync('token');
                    var data = {
                      code: code,
                      longitude: longitude,
                      latitude: latitude
                    }
                    //判断是否是核销码：'HX=' 
                    var search = code.search('HX=');
                    if (search != -1) {
                      //是核销码 请求接口
                      var hxCode = code.split('HX=')[1];
                      log.addFilterMsg('HX');
                      log.info("postOption param L743:", data);
                      var data = {
                        order: hxCode,
                      }
                      that.checkHX(data);
                      return

                    }
                    log.addFilterMsg('scan/qr param');
                    log.info("postOption scan/qr param L743:", data);
                    that.scanQrPost(data);
                  })
                }

              }
            })
          }
        }
      })
    });

  },
  //扫码获取红包请求
  scanQrPost: function (data) {
    let that = this;
    if (_repeated) return;
    _repeated = true;
    log.addFilterMsg('scanQrPost');
    log.info(`scanQrPost data:`, data)
    return http.post('/api/scan/qr', data).then(res => {
      log.info(`scanQrPost return:`, res);
      _repeated = false;
      let data = res.data;
      //清除本地qrcode缓存
      wx.removeStorageSync('qrcode');
      //2022年8月8日现金券 接口改动：优先根据RewardType判断流程默认0红包码，1现金券
      let RewardType = data.RewardType || 0;
      //红包码逻辑：0红包 2产品券 3未领取
      if ([0, 2, 3].includes(+RewardType)) {
        // if (RewardType == 0) {
        this.redPacketLogic(res)
        return
      }
      //现金券逻辑
      if (RewardType == 1) {
        this.allowanceLogic(res)
        return
      }
    }).catch(err => {
      _repeated = false;
      toscan = false;
      app.globalData.toscan = false;
      that.setData({
        disabled: false
      });
    });
  },
  //红包码原有逻辑
  redPacketLogic: function (res) {
    let that = this;
    let result = res.data;
    let route = encodeURIComponent('/pages/zongduan/saoma/index?q=' + this.data.scanCode);
    let boxdata = encodeURIComponent(JSON.stringify(res));
    switch (res.code) {
      case '0':
        var msg = res.msg;
        if (result.tips) {
          msg += '&tips=' + result.tips;

        }
        if (result.type) {
          msg += '&type=' + result.type;
        }
        if (result.type) {
          // 红牛箱内码61 是红包卡券2选一
          if (hn2in1.includes(+result.type)) {
            wx.navigateTo({
              url: `/pages/storeAllowance/cashorCoupon/index?boxdata=${boxdata}`,
            })
            return
          }
          wx.navigateTo({
            url: '/pages/zongduan/saoma/hongbao/error?msg=' + msg,
          })
        } else {
          let remindMsg = res.msg;
          if (result.tips) {
            remindMsg += '\n' + result.tips;
          }

          wx.showModal({
            title: '温馨提示',
            content: remindMsg,
            showCancel: false,
            success: (res) => {
              if (res.confirm && that.data.popImg) {
                that.setData({
                  adShow: true
                })
              }
            }
          })
        }
        break;
      case '1':
        //code=1要根据data码值跳转拆红包页面
        var data = result.qr;
        var param = encodeURIComponent(data);
        //判断data里的type值：1，一期红包，2，二期红包
        if (result.type == 1) {
          wx.navigateTo({
            url: '/pages/zongduan/saoma/hongbao/index?hbdata=' + param,
          })
          return
        }
        //hnTypeArr = [2,3,50,51,52,53,54,55]红牛箱内码任务红包
        if (hnTypeArr.includes(+result.type)) {
          // 红牛箱内码61 是红包卡券2选一
          if (hn2in1.includes(+result.type)) {
            wx.navigateTo({
              url: `/pages/storeAllowance/cashorCoupon/index?boxdata=${boxdata}`,
            })
            return
          }
          wx.navigateTo({
            url: '/pages/randomdraw/index/index?hbdata=' + param + '&hbtype=' + result.type,
          })
          return
        }
        //zmTypeArr=[4,5,6,7]战马箱内码任务红包
        if (zmTypeArr.includes(+result.type)) {
          wx.navigateTo({
            url: '/pages/warhorse/index/index?hbdata=' + param + '&hbtype=' + result.type,
          })
          return
        }

        log.addFilterMsg('TypeError_1')
        log.info("TypeError:", res);
        /**
        走到这里说明类型没判断到，有可能是新增的类型，也有可能是进了旧版本（部分ios用户反馈过这个问题）
        尝试更新小程序版本
        * 
        */
        that.checkUpdate(res);



        break;
      case '2':
        addScanTimesCode = 2;
        //code = 2 战马需要看广告,看完后请求加次数接口传参code
        that.setData({
          csPop: true
        });
        break;
      case '3':
        //code=3，showModal 有红包未拆，带码值跳转拆红包
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false,
          success(_res) {
            if (_res.confirm) {
              //跳转拆红包页面
              // var data = JSON.stringify(result.data);
              var param = encodeURIComponent(result.qr);
              //判断data里的type值：1，一期红包，2，二期红包
              if (result.type == 1) {
                wx.navigateTo({
                  url: '/pages/zongduan/saoma/hongbao/index?hbdata=' + param,
                })
                return
              }
              if (hnTypeArr.includes(+result.type)) {
                // 红牛箱内码61 是红包卡券2选一
                if (hn2in1.includes(+result.type)) {
                  wx.navigateTo({
                    url: `/pages/storeAllowance/cashorCoupon/index?boxdata=${boxdata}`,
                  })
                  return
                }
                wx.navigateTo({
                  url: '/pages/randomdraw/index/index?hbdata=' + param + '&hbtype=' + result.type,
                })
                return
              }
              //zmTypeArr=[4,5,6,7] 战马箱内码任务红包
              if (zmTypeArr.includes(+result.type)) {
                wx.navigateTo({
                  url: '/pages/warhorse/index/index?hbdata=' + param + '&hbtype=' + result.type,
                })
                return
              }

              log.addFilterMsg('TypeError_2')
              log.info("TypeError:", res);
              /**
               走到这里说明类型没判断到，有可能是新增的类型，也有可能是进了旧版本（部分ios用户反馈过这个问题）
               尝试更新小程序版本
               * 
               */
              that.checkUpdate(res);
            }
          }
        })
        break;

      case '4':
        addScanTimesCode = 4;
        //code = 4 红牛需要看广告,看完后请求加次数接口传参code
        that.setData({
          csPop: true
        });
        break;
      case '5':
        //code = 5 unionid不存在需一键登录重新获取

        wx.reLaunch({
          // url: '/pages/zongduan/geren/bangding/index',
          url: `/pages/user/register/index?route=${route}`, //新版授权手机号登录页
        })
        break;
      case '6':
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false,
          success: (_result) => {
            if (_result.confirm) {
              wx.navigateTo({
                url: `/pages/zhongduan/geren/mendian/renzhen/index?route=${route}`,
              })
            }
          }
        })
        break;
      case '-1':
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 4000
        })
        break;
      default:
        if (res.msg) {
          wx.showModal({
            title: '温馨提示',
            content: res.msg,
            showCancel: false
          })
        }

    }
  },
  //现金券逻辑
  allowanceLogic: function (res) {
    let {
      data
    } = res;
    let result = encodeURIComponent(JSON.stringify(res));
    wx.navigateTo({
      url: '/pages/storeAllowance/scanQr/index?qrResult=' + result + '&qrtype=' + data.type,
    })

  },
  //增加扫一扫获取红包次数
  addScanTimes: function () {
    if (!addScanTimesCode) {
      let data = {
        code: qrCode,
        longitude: longitude,
        latitude: latitude
      }
      http.post('/api/scan/qr', data).then(res => {
        var result = res.data;
        //清除本地qrcode缓存
        wx.removeStorageSync('qrcode');
        switch (res.code) {
          case '2':
            addScanTimesCode = 2;
            http.post('/api/scan/addqr', {
              code: addScanTimesCode
            }).then(res => {
              if (res.code == 1) {
                addScanTimesCode = '';
                qrCode = '';
              }
            });
            break;
          case '4':
            addScanTimesCode = 4;
            http.post('/api/scan/addqr', {
              code: addScanTimesCode
            }).then(res => {

              if (res.code == 1) {
                addScanTimesCode = '';
                qrCode = '';
              }
            });
            break;


          default:


        }
      }).catch(err => {});
      return
    };
    let data = {
      code: addScanTimesCode
    }
    return http.post('/api/scan/addqr', data).then(res => {
      if (res.code == 1) {
        addScanTimesCode = '';
      }
    });
  },
  //核销请求
  HXPost: function (data) {
    let that = this;
    this._HXend = false;
    return http.post("/api/card/verifyqr", data).then(res => {
      //清除本地qrcode缓存
      wx.removeStorageSync('qrcode');
      this._HXend = true;
      if (res.code == 1) {
        //弹出领券弹窗
        that.setData({
          getCouponPop: true,
          writeOffInfo: res.data
        });
        return;
      }
      if (res.code == 0) {
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false,
          success: (res) => {
            if (res.confirm && that.data.popImg) {
              that.setData({
                adShow: true
              })
            }
          }
        })
        return
      }
    }).catch(err => {
      this._HXend = true;
    });
  },
  checkHX: function (data) {
    let that = this;
    this._HXend = false;
    return http.post("/api/card/getorder", data).then(res => {
      //清除本地qrcode缓存
      wx.removeStorageSync('qrcode');
      this._HXend = true;
      if (res.code == 1) {
        //弹出领券弹窗
        let result = res.data;
        result.code = 1;
        // 红牛
        if (result.type == 1) {
          let  unit = result.call_money ? '元' : '罐';
          result.bonus = Number(result.card_count * 0.15).toFixed(2);
          result.bonus = result.bonus + unit;
          result.title = '红牛换购券';
          result.exc_title = '红牛换购奖励';
        }
        // 战马核销
        if (result.type == 2) {
          result.title = '战马换购券';
          result.exc_title = '战马换购奖励';
          result.bonus = Number(result.exc_num * 0.15).toFixed(2);
          result.bonus = result.bonus + '(罐)';
          // 如果有exc_num :战马红包的个数，需要 拿
          result.half_y_count = 0;
          if (result.call_money) {
            result.half_y_count = result.card_count - result.exc_num;
            if (result.half_y_count == 0) {
              result.half_y_count == result.card_count
            }
            result.bonus_y = Number(result.half_y_count * 0.5).toFixed(2);
            result.bonus_y = result.bonus_y + '(元)';
          }
        }

        that.setData({
          getCouponPop: true,
          writeOffInfo: result
        });
        return;
      }
      if (res.code == 2) {
        that.setData({
          getCouponPop: true,
          writeOffInfo: res
        });
        return;
      }
      if (res.code == 0) {
        that.setData({
          getCouponPop: true,
          writeOffInfo: res
        });
        return;

      }

    }).catch(err => {
      this._HXend = true;
    });
  },
  onHide: function () {
    hided = true;
    _repeated = false;
    wx.hideLoading({
      success: (res) => {},
    })
    this.setData({
      csPop: false,
      getCouponPop: false,
      shopInfoPop: false,
      bindedShopInfo: false,
      disabled: false,
      unlock_display: false, //解锁陈列弹窗
      isBackPage: false
    })
  },
  close: function () {
    this.setData({
      csPop: false,
      getCouponPop: false,
      shopInfoPop: false,
      bindedShopInfo: false,
    });

  },
  wtachAd: function () {
    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      wx.showLoading({
        title: '正在加载',
      })
      videoAd.show().then(() => {

        wx.hideLoading({
          complete: (res) => {},
        })
      }).catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show().then(() => {
            wx.hideLoading({
              complete: (res) => {},
            })
          }))
          .catch(err => {
            wx.hideLoading({
              complete: (res) => {},
            })
          })
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '暂无激励视频广告',
        showCancel: false
      })
    }
  },
  imgLoaded: function () {
    wx.hideLoading({
      complete: (res) => {},
    })
  },
  menuItemClick: function (res) {
    //获取点击事件的信息
    let clickInfo = res.detail.iteminfo

  },
  goCoupon: function () {
    //跳转到核销 红包，引导用户开红包
    var url = '/pages/phaseIII/write-off/reward';
    let userInfo = this.data.userInfo;
    let condition = userInfo.condition;
    if (condition == 2) {
      url = '/pages/zhongduan/geren/storesRecord/index';
    }
    this.setData({
      getCouponPop: false
    });
    wx.showLoading({
      title: '正在加载',
    })
    wx.navigateTo({
      url: url,
    })
  },
  onTabItemTap() {
    wx.setNavigationBarTitle({
      title: "扫一扫"
    })
  },
  checkPaperCodeStatus: function (e) {
    let code = e.currentTarget.dataset.code;
    let sid = e.currentTarget.dataset.sid;
    let confirm = e.currentTarget.dataset.confirm;
    let type = e.type;
    //confirm确认， cancel取消
    if (type && type == "confirm") {
      //code == 2 修改纸质码  code == 4 请求绑定
      if (code == 2) {
        if (confirm) {
          utils.bindChangePaperCode(sid).then(res => {
            if (res.msg) {
              wx.showModal({
                title: '温馨提示',
                content: res.msg,
                showCancel: false
              })
            }
          })
        } else {
          let paper_codeInfo = {};
          paper_codeInfo.confirm = true;
          paper_codeInfo.code = code;
          paper_codeInfo.msg = "更换成功后，之前绑定的纸质码失效";

          this.setData({
            paper_codeInfo: paper_codeInfo,
            paper_code_confirmText: '是',
            paper_code_cancelText: '否',
            paper_code_title: "确定更换为此纸质码？",
            paperSid: sid,
            onlyOnce: false,
            paper_code_pop: true
          })
        }
      }
      if (code == 4) {
        if (confirm) {

          utils.bindChangePaperCode(sid).then(res => {
            if (res.msg) {
              wx.showModal({
                title: '温馨提示',
                content: res.msg,
                showCancel: false
              })
            }
          })
        } else {
          let paper_codeInfo = {};
          paper_codeInfo.confirm = true;
          paper_codeInfo.code = code;
          paper_codeInfo.msg = "确认绑定该纸质码？";

          this.setData({
            paper_codeInfo: paper_codeInfo,
            paper_code_confirmText: '是',
            paper_code_cancelText: '否',
            paper_code_title: " ",
            paperSid: sid,
            onlyOnce: false,
            paper_code_pop: true
          })
        }
      }
      return
    }
    if (type && type == "cancel") {
      this.setData({
        onlyOnce: false,
      })
      return
    }
  },
  previewImg: function (e) {
    let url = e.currentTarget.dataset.url;
    if (url) {
      wx.previewImage({
        urls: [url],
      })
    }
  },
  hxNavigate: function (e) {
    this.setData({
      getCouponPop: false
    })
    let {
      writeOffInfo
    } = this.data;
    if (this.data.userInfo.condition != 2) {
      wx.switchTab({
        url: '/pages/tabBar/geren/index',
      })
      return
    }
    if (this.data.userInfo.condition == 2) {
      wx.navigateTo({
        url: `/pages/zhongduan/geren/storesRecord/index?exc_type=${writeOffInfo.type}`,
      })
    }
  },
  onUnload: function () {
    longitude = '';
    latitude = '';
    hided = false;
    if (videoAd) {
      videoAd.destory();
      videoAd = null;
    }
    this.setData({
      disabled: false,
      isBackPage: false,
    })
  },
  switchTabBar: function (e) {
    let url = e.currentTarget.dataset.url;
    if (url) {
      wx.switchTab({
        url: url,
      })
    }
  },
  checkUpdate: async function (res) {
    let updateResult = await utils.updateManger();
    log.addFilterMsg("checkForUpdate");
    let systemInfo = wx.getSystemInfoSync() || '';
    log.info("设备信息：", systemInfo);
    log.info("checkForUpdate res:", updateResult);

    if (updateResult && !updateResult.hasUpdate) {
      let msg = res.msg ? " \n 扫码结果：" + res.msg : '';
      wx.showModal({
        title: '温馨提示',
        content: '红包类型异常，请联系客服处理;' + msg,
        showCancel: false,
      })
    }
  },
  // 开箱活动参与信息
  async actCouponGetInfo() {
    try {
      // 获取活动信息
      let result = await shopActUtils.act5_getinfo_sz();
      if (result.actInfo) {
        this.setData({
          actInfo: result.actInfo
        })
        return
      }
      this.setData({
        actInfo: null
      })
    } catch (err) {
      console.error("actCouponGetInfo err:", err);
    }

  },
  xdyhMini() {
    xdyhMini().catch(err => {})
  },
  async storeRankGetInfo(event) {

    try {
      // 获取活动信息
      let {
        rankInfo
      } = await storeRankUtils.unboxGetInfo();
      console.log("我的页面店铺排行榜参与信息：", rankInfo)
      if (rankInfo) {
        // 如果活动已结束，并且未报名：不显示
        let {
          act_state,
          status
        } = rankInfo;
        if (act_state.act_end && status == '未报名') return;
        this.setData({
          rankInfo
        })
        return
      }
      return this.setData({
        rankInfo: null
      })
    } catch (err) {
      console.error("storeRankGetInfo err:", err);
    }

  },
  // 2023年8月28日 广州开箱活动信息
  async gzUnboxActInfo() {
    try {
      // 获取活动信息
      let {
        actInfo
      } = await shopActUtils.gzUnboxActInfo();
      console.log("广州开箱活动信息：", actInfo)
      if (actInfo) {
        this.setData({
          actInfoGZ: actInfo
        })
        log.addFilterMsg('actInfoGZ');
        log.info(actInfo);
        return
      }
      return this.setData({
        actInfoGZ: null
      })
    } catch (err) {
      console.error("actInfoGZ err:", err);
    }
  },
})