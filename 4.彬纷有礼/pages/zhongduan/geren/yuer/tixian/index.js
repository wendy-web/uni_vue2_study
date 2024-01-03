const utils = require('../../../../../utils/util');
const http = require('../../../../../utils/api');
const log = require('../../../../../utils/log');
const auth = require('../../../../../utils/auth');
const app = getApp();
// 在页面中定义插屏广告
let interstitialAd = null;
// 在页面中定义激励视频广告
let videoAd = null;
let InnerAudio = null;
let balance = '';
let _request = false;

import {
  mnmobile
} from '../../../../../api/config';
import regeneratorRuntime from '../../../../../utils/regenerator-runtime/runtime.js';

Page({
  data: {
    pageReady: false,
    value: '',
    showClearBtn: false,
    cashNotice: false, //提现须知弹窗 1
    cashInfo: '',
    checked: '',
    Msg: false, //默认false,提现返回弹窗 2
    storeInfo: false, //完善店铺信息弹窗3
    txInfo: '',
    inputFocus: '',
    //提现成功失败弹窗图片 
    txSuccess: app.globalData.COS_URL + '/public/img/Tian/202101/txsuccess.png',
    txFail: app.globalData.COS_URL + '/public/img/Tian/202101/txfail.png',
    // txFail: app.globalData.COS_URL + '/public/img/Tian/202101/txfail.png',
    storePop: app.globalData.COS_URL + '/public/img/Tian/202101/store.png',
    txsPop: false, //提现4次弹窗
    txsBg: app.globalData.COS_URL + '/public/img/Tian/202101/txsPop.png', //提现4次弹窗背景
    txsPopBtl: app.globalData.COS_URL + '/images/Pops/jy0803.png',
    txsPopBtr: app.globalData.COS_URL + '/images/Pops/jbd0803.png',
    popImg: '',
    adShow: false,
    jarPop_bgImg: app.globalData.COS_URL + '/public/img/storeRank/202106/fill_shop_info.png', //完善店铺资料弹窗背景
    jarPop_txImg: app.globalData.COS_URL + '/public/img/storeRank/202106/withdraw_success.png', //提现成功弹窗背景
    supportGetPhoneCode: utils.compareVersion(app.globalData.systemInfo.SDKVersion, '2.21.2') >= 0, // getPhoneNumber 是否支持返回code 参数

  },
  onLoad: function (options) {
    var systemInfo = app.globalData.systemInfo;
    var sysHeight = systemInfo.windowHeight;
    var sysWidth = systemInfo.windowWidth;
    var that = this;

    this.setData({
      sysHeight: sysHeight,
      sysWidth: sysWidth,
    });
    wx.showLoading({
      title: '正在加载',
    })
    InnerAudio = this.InnerAudio({
      url: app.globalData.COS_URL + "/public/music/audio0901/4.mp3"
    })

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-55a9b93c6f99bbad'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }

    // 在适合的场景显示插屏广告
    if (interstitialAd && utils.blockAd()) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }




    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd && !videoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-c6d45dc1093494cb', //线上激励视频ID
        multiton: true
        // adUnitId: 'adunit-8beb956de976f9ae' //测试版激励视频ID
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {
        if (err.errCode == '1002' || err.errCode == '1004' || err.errCode == '1005' || err.errCode == '1006' || err.errCode == '1007' || err.errCode == '1008') {
          wx.hideLoading({
            complete: (res) => {},
          })
          if (!this.data.txsPop) return
          this.setData({
            txsPop: false
          });
          wx.showModal({
            title: '温馨提示',
            content: '广告展示异常已为您跳过',
            showCancel: false,
            success(res) {
              //请求提现
              // that.getMoney();
              var money = that.data.value;
              that.requestMoney(money);
            }
          })
        } else {
          wx.hideLoading({
            complete: (res) => {},
          })
          console.log("广告加载失败：", err);
          //其它错误情况记录实时日志
          log.setFilterMsg('Ad error');
          log.info(err.errCode, ":", err.errMsg);
        }
      })
      videoAd.onClose((res) => {
        console.log("广告关闭：", res);
        if (res && res.isEnded) {
          this.setData({
            txsPop: false
          });
          //请求提现
          // this.getMoney();
          var money = this.data.value;
          this.requestMoney(money);
        }
      })
    }

    //获取本地缓存cashNoticeReaded 判断是否弹窗提现须知
    if (!wx.getStorageSync('cashNoticeReaded') || wx.getStorageSync('cashNoticeReaded') == 0) {
      this.setData({
        cashNotice: true,
      });
    } else {
      this.setData({
        checked: true
      });
    }
    this.initOnload();
  },
  async initOnload() {
    let userInfo = await utils.getUserInfoNew();
    this.setData({
      userInfo
    });
  },
  onShow: function () {
    var that = this;
    // //获取本地缓存cashNoticeReaded 判断是否弹窗提现须知
    // if (!wx.getStorageSync('cashNoticeReaded') || wx.getStorageSync('cashNoticeReaded') == 0) {
    //   this.setData({
    //     cashNotice: true,
    //   });
    // } else {
    //   this.setData({
    //     checked: true
    //   });
    // }

    this.setData({
      pageReady: true
    });
    this.getYuer();
    let cosAddress = auth.getCosAddress();
    if (cosAddress) {
      let redbull = cosAddress.A9.value;
      let popImg = [];
      popImg[0] = redbull[Math.floor((Math.random() * redbull.length))];
      if (!this.data.cashNotice) {
        this.setData({
          adShow: true,
          popImg
        });
      }
    }
  },
  getYuer: function () {
    var that = this;
    //获取我的余额
    http.post('/api/user/getmybalance', false).then(res => {
      if (res.code == 0) {
        //请求失败，弹出失败信息
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2500
        })
        this.setData({
          pageReady: true
        });
      } else {
        if (res.data.balance) {
          balance = parseFloat(res.data.balance);
        } else {
          balance = 0;
        }
        wx.setStorageSync('localBalance', Number(res.data.balance))
        that.setData({
          cashInfo: res.data,
          pageReady: true

        });
      }
    })

  },
  //提现余额input
  onInput: function (evt) {
    var value = evt.detail.value;

    this.setData({
      value: value,
      showClearBtn: true
    });
  },
  //清除input value
  onClear: function () {
    var that = this;
    wx.hideKeyboard({
      complete: res => {
        that.setData({
          value: '',
          showClearBtn: false
        });
      }
    })

  },
  //提现须知弹窗
  cashNotice: function () {
    this.setData({
      cashNotice: true
    });
  },
  //关闭弹窗
  iKnow: function (e) {
    console.log(e)
    var popId = e.currentTarget.dataset.pop;
    var that = this;
    if (popId) {
      switch (popId) {
        case '1':
          this.setData({
            cashNotice: false
          })

          break;
        case '2':
          this.setData({
            Msg: false
          })
          break;
        case '3':
          this.setData({
            storeInfo: false
          })
          break;
      }
    } else {
      this.setData({
        cashNotice: false,
        Msg: false,
        storeInfo: false
      })
    }
    // if (!this.data.cashNotice) {
    //   this.setData({
    //     inputFocus: true
    //   });
    // }

  },

  checkBox: function (evt) {
    console.log(evt.detail.value[0]);
    if (evt.detail.value[0]) {
      //点击勾选
      wx.setStorageSync('cashNoticeReaded', '1');
      this.setData({
        checked: true
      });
    } else {
      wx.setStorageSync('cashNoticeReaded', '0');
      this.setData({
        checked: false
      });
    }
  },
  //点击全部提现
  all: function () {
    var cashInfo = this.data.cashInfo;
    var that = this;
    wx.hideKeyboard({
      complete: res => {
        if (cashInfo && cashInfo.sum) {

          balance = parseFloat(cashInfo.sum);
          that.setData({
            value: parseFloat(cashInfo.sum),
          })
        } else {
          balance = 0;

        }
      }
    })

  },
  //判断是否整形
  isInteger: function (obj) {
    return obj % 1 === 0
  },
  //提现之前判断次数，第四次看激励视频 pay_num-num==4
  checkTixian: function (money) {

    var that = this;
    var cashInfo = this.data.cashInfo;

    console.log("提现信息：", cashInfo);
    var value = this.data.value;
    log.info('checkTixian value:', value)
    log.info('checkTixian cashInfo:', cashInfo)

    if (!value) {
      return false;
    }
    utils.getMID(0).then(res => {
      var templateId = res;
      console.log('获取到的模板ID:', templateId);
      console.log('数组长度:', templateId.length);

      if (templateId) {
        //订阅消息授权
        wx.requestSubscribeMessage({
          //模板消息id，订阅类型：一次性
          tmplIds: templateId,
          success(res) {
            console.log("requestSubscribe````", res);
            console.log("授权结果：", JSON.stringify(res))
            //需要循环templateId 判断每一个授权是否允许订阅消息通知
            if (res[templateId[0]] == 'reject') {
              wx.showModal({
                title: '提示',
                content: '请打开订阅消息授权',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      withSubscriptions: true,
                      complete: (res) => {
                        log.setFilterMsg('打开订阅消息设置');
                        log.info("获取设置信息L269:", res);
                        console.log("openSetting success  res:", res);
                        if (res.subscriptionsSetting && res.subscriptionsSetting.itemSettings) {

                          if (res.subscriptionsSetting.itemSettings[templateId[0]] == 'reject' || res.subscriptionsSetting.itemSettings[templateId[1]] == 'reject') {
                            wx.showToast({
                              title: '请打开并允许订阅消息通知',
                              icon: 'none',
                              duration: 3000
                            })
                          }
                        }

                      },
                    })

                  } else {
                    wx.hideLoading({
                      complete: (res) => {},
                    })
                  }
                }
              })

            }


          },
          fail(res) {
            console.log('调用失败：', res)
            let {
              errCode = ''
            } = res;
            // 用户关闭了主开关，无法进行订阅
            if (+errCode != 20004) {
              // 记录除了用户关闭主开关以为的情况
              log.setFilterMsg("subscribeFail");
              log.info("error:", res);
              return;
            }

            wx.showModal({
              title: '提示',
              content: '请打开订阅消息授权',
              success(res) {
                if (res.confirm) {
                  wx.openSetting({
                    withSubscriptions: true,
                    complete: (res) => {
                      log.setFilterMsg('打开订阅消息设置');
                      log.info("获取设置信息L269:", res);
                      console.log("openSetting success  fail:", res);

                      if (res.subscriptionsSetting && res.subscriptionsSetting.itemSettings) {

                        if (res.subscriptionsSetting.itemSettings && res.subscriptionsSetting.itemSettings[templateId[0]] == 'reject') {
                          wx.showToast({
                            title: '请允许订阅消息授权',
                            icon: 'none',
                            duration: 3000
                          })
                        }

                      }

                    },
                  })

                } else {
                  wx.hideLoading({
                    complete: (res) => {},
                  })
                }
              }
            })
          }
        })

      }
    })

    var times = cashInfo.pay_num - cashInfo.num;
    if (times == 4) {
      this.setData({
        txsPop: true
      });

      return;
    }
    // this.getMoney();
    wx.showLoading({
      title: '正在提交',
      mask: true
    })
    this.requestMoney(money);
  },

  //确认提现
  getMoney: function () {
    log.setFilterMsg('getMoney')
    var that = this;
    var value = this.data.value;
    var max = this.data.cashInfo.pay_max;
    log.info("提现金额：", value)

    if (!value) {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none'
      })
      return
    }
    if (value <= 0) {
      return false;
    }
    if (value % 0.5 !== 0) {
      wx.showToast({
        title: '请输入 0.5 的倍数',
        icon: 'none',
        duration: 3000
      })
      return false
    }
    console.log("提现金额：", value);
    this.setData({
      inputFocus: false
    });
    wx.hideKeyboard({
      complete: res => {
        console.log('hideKeyboard res', res)
      }
    })
    this.checkTixian(value);
    // this.getSubscribeMessage(value);
    return;

  },
  //提现请求
  requestMoney: function (value) {
    var that = this;
    //请求数据
    var data = {
      amount: value
    };
    console.log("requestMoney 参数：", data);
    http.post('/api/task/draw', data).then(res => {
      //提现返回
      console.log('提现请求返回:', res)
      wx.hideLoading();
      if (res.code == '0' || res.code == '1') {
        that.setData({
          Msg: true,
          txInfo: res
        })
      } else if (res.code == '2') {
        that.setData({
          storeInfo: true,
          // txInfo:res.data.data
        })
      } else if (res.code == '5') {
        //code = 5 unionid不存在需一键登录重新获取
        wx.reLaunch({
          url: '/pages/user/register/index',
        })
      }
      //请求完7需要重新获取信息：成功时候余额会有变动
      if (res.code == '1') {
        InnerAudio.play();
        that.getYuer();
        that.setData({
          value: ''
        })
      }
    }).catch(err => {
      wx.hideLoading()
      log.setFilterMsg('requestMoneyCatch:', err);
    })

  },
  close: function () {
    this.setData({
      txsPop: false
    });
  },
  wtachAd: function () {
    wx.showLoading({
      title: '正在加载',
    })
    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
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

    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    var prevPage = pages[pages.length - 2]; //获取上一个页面
    if (prevPage) {
      prevPage.setData({ //修改上一个页面的变量
        hided: true
      })
    }
    console.log("页面卸载····");
    InnerAudio.destroy();
    if (videoAd) {
      videoAd.destory();
      videoAd = null;
    }
  },

  onHide: function () {

  },
  InnerAudio: function (config) {
    console.log("音频初始化``````````````")
    let innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = config.url;
    //音频开始播放
    innerAudioContext.onPlay((res) => {
      console.log("audio onPlay:", res);
      if (config.onPlay) config.onPlay();
    });
    //音频播放异常
    innerAudioContext.onError((res) => {
      console.log("audio onError:", res);
      if (config.onError) config.onError();
    });
    //音频播放自然结束
    innerAudioContext.onEnded((res) => {
      console.log("audio onEnded:", res);
      if (config.onEnded) config.onEnded();
    });
    return {
      innerAudioContext,
      play(url) { //播放
        //有新值，赋值播放
        if (url) this.innerAudioContext.src = config.url;
        console.log("play``````````````")
        //直接播放
        this.innerAudioContext.play()
      },
      pause() { //暂停
        this.innerAudioContext.pause()
      },
      stop() { //停止
        this.innerAudioContext.stop()
      },
      seek(seek) { //设置进度
        this.innerAudioContext.seek = seek;
      },
      destroy() {
        this.innerAudioContext.destroy();
      }
    }
  },
  // 提现之前先判断是否绑定手机号
  beforeWithdraw() {
    let {
      userInfo
    } = this.data;
    // 未绑定手机号提示绑定手机号
    if (!userInfo.mobile) {
      this.selectComponent('#bindPhonePop').showBindPhonePop();
      return
    }
    this.getMoney();
  },
  //调用微信绑定的手机号
  async getPhoneNumber(e) {
    console.log("获取手机号：", e.detail);
    let {
      iv,
      encryptedData,
      code = ''
    } = e.detail;
    try {

      // 低版本基础库（<=2.20.2）没有code
      if (code || (iv && encryptedData)) {
        wx.showLoading({
          title: '加载中···',
        })

        let params = {
          encryptedData,
          iv,
          code
        };
        if (_request) return wx.hideLoading();
        _request = true;
        log.addFilterMsg("api_user_mnmobile");
        log.info("api_user_mnmobile传参：", params);
        mnmobile(params).then(res => {
          log.info("绑定结果：", res);
          wx.hideLoading()
          _request = false;
          let {
            code,
            msg
          } = res;
          if (+code == 1) {
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 2000
            })

            this.bindPhoneSuccess()
            return
          } else {
            wx.showModal({
              title: '温馨提示',
              content: msg,
              showCancel: false
            })
          }
        }).catch(err => {
          log.info("api_user_mnmobile err:", err)
          wx.hideLoading()
          _request = false;
        })
      } else {
        _request = false;
        console.log(e.detail);
        let {
          errMsg = '',
            errno = ''
        } = e.detail;
        log.addFilterMsg("getPhoneNumberFailed");
        log.info("未获取到手机号:", e.detail);
        if (errno && errno == 104) return;
        const regex = /user deny|user cancel/;
        if (errMsg && !regex.test(errMsg)) {
          wx.showModal({
            title: '温馨提示',
            content: errMsg,
            showCancel: false
          })
          return
        }

      }
    } catch (err) {
      console.log("catch:", err)
      log.addFilterMsg("getPhoneNumberCatch");
      log.info("解析手机号catch:", err)
      if (err.msg) {
        wx.showModal({
          title: '温馨提示',
          content: err.msg,
          showCancel: false
        })
      }
    } finally {
      _request = false;
    }
  },
  // 手机号绑定成功
  async bindPhoneSuccess() {
    try {
      let userInfo = await utils.getUserInfoNew();
      console.log("bindPhoneSuccess 更新用户信息：", userInfo);
      this.setData({
        userInfo
      })
    } catch (error) {
      console.log("bindPhoneSuccess catch:", error)
    }
  },
  async getSubscribeMessage(money) {
    let getTemplateId = '';
    try {
      var value = this.data.value;
      log.setFilterMsg("getSubscribeMessageTap")
      if (!value) {
        return false;
      }
      getTemplateId = await utils.getMID(0);

      if (getTemplateId.length > 0) {
        let subscribeMessage = await wx.requestSubscribeMessage({
          tmplIds: getTemplateId
        });
        console.log("授权结果subscribeMessage：", JSON.stringify(subscribeMessage))
        if (subscribeMessage && subscribeMessage[getTemplateId[0]] == 'reject') {
          this.checkWithdrawal(money); //请求提现
          let getSetting = await wx.getSetting({
            withSubscriptions: true
          });
          if (getSetting && getSetting.subscriptionsSetting.mainSwitch === false) {

            wx.showModal({
              title: '提示',
              content: '请打开订阅消息通知管理授权',
              success(res) {
                if (res.confirm) {
                  wx.openSetting({
                    withSubscriptions: true,
                    complete: (res) => {
                      log.setFilterMsg('打开订阅消息设置');
                      log.info("获取设置信息L269:", res);
                      console.log("openSetting success  res:", res);
                    },
                  })

                } else {
                  wx.hideLoading({
                    complete: (res) => {},
                  })
                }
              }
            })

          }
          return
        }
      }
      this.checkWithdrawal(money); //请求提现

    } catch (error) {
      log.setFilterMsg("withdrawalTap")
      log.info('withdrawalTap catch:', error)
      console.log("getSubscribeMessage catch:", error)
      this.checkWithdrawal(money); //请求提现
      let {
        errCode = ''
      } = error;
      // 用户关闭了主开关，无法进行订阅
      if (errCode && errCode != 20004) {
        // 记录除了用户关闭主开关以为的情况
        log.setFilterMsg("subscribeFail");
        log.info("error:", error);
        return;
      }

      if (errCode && errCode === 20004) {
        wx.showModal({
          title: '提示',
          content: '请打开订阅消息授权。',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                withSubscriptions: true,
                complete: (res) => {
                  log.setFilterMsg('打开订阅消息设置');
                  log.info("获取设置信息L269:", res);
                  console.log("openSetting success  fail:", res);
                  console.log("getTemplateId.length:", getTemplateId.length);
                  // if (res.subscriptionsSetting && res.subscriptionsSetting.mainSwitch === true && getTemplateId.length) {
                  //   wx.requestSubscribeMessage({
                  //     tmplIds: getTemplateId,
                  //     complete:(res)=>{
                  //       console.log("授权以后再次拉起订阅消息通知：",res)
                  //     }
                  //   });
                  // }
                },
              })

            } else {
              wx.hideLoading({
                complete: (res) => {},
              })
            }
          }
        })
      }
    }
  },
  checkWithdrawal(money) {
    let {
      cashInfo
    } = this.data;
    var times = cashInfo.pay_num - cashInfo.num;
    if (times == 4) {
      this.setData({
        txsPop: true
      });
      return;
    }
    wx.showLoading({
      title: '正在提交',
      mask: true
    })
    this.requestMoney(money);
  }

})