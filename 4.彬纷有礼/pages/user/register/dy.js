const utils = require('../../../utils/util');
const http = require('../../../utils/api');
const log = require('../../../utils/log');
const util = require('../../../utils/util');
const app = getApp();
const COS_URL = app.globalData.COS_URL;
// //获取用户信息
var userdata = wx.getStorageSync('userdata');
let phaseIII_count = '';
let sid = '';
let token = '';
let _repeated = false;
let hnTypeArr = app.globalData.hnTypeArr; //红牛箱内码红包类型
let zmTypeArr = app.globalData.zmTypeArr; //战马箱内码红包类型
let hn2in1 = app.globalData.hn2in1; //红牛箱内码红包类型：红包卡券2选1

import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime.js';
Page({
  data: {
    pageReady: false,
    logoimg: COS_URL + '/public/img/bfyl/assets/store/dydf.png',
    shopInfo: '',
    userInfo: '',
    storeRankingPop: false, //兑奖活动正在进行中，已报名用户不可以转店、入驻其他店铺
    storeRankingImg: COS_URL + "/public/img/storeRank/202108/pop/bg.png", //店铺信息确认背景
    iKnowImg: COS_URL + "/public/img/storeRank/20210121/iKnow0128.png", //店铺信息确认背景

  },
  onLoad: function (options) {
    //根据页面参数信息，判断用户被邀请的方式：面对面扫一扫/转发
    console.log('获取页面参数：', options);
    log.setFilterMsg("dy");
    log.info("加店员页面传参：", options);
    var that = this;
    //扫码进入得情况
    if (options.q) {
      var para = decodeURIComponent(options.q);
      let params = utils.getUrlObj(para);
      if (params.HY) {
        sid = params.HY;
      }
      if (params.sid) {
        sid = params.sid
      }
      if (params.HY && params.token) {
        sid = params.HY;
        token = params.token;
      }
      wx.setStorageSync('sid', sid)
      wx.setStorageSync('sid_token', token)

    }
    //分享进入得情况
    if (options.sid) {
      this.setData({
        sid: options.sid
      })
      sid = options.sid;
      wx.setStorageSync('sid', options.sid)

    }
    if (options.token) {
      this.setData({
        token: options.token
      })
      token = options.token;
      wx.setStorageSync('sid_token', options.token)

    }




  },
  onShow: function () {
    // wx.showLoading({
    //   title: '加载中',
    // })
    userdata = wx.getStorageSync('userdata');

    var that = this;
    if (!wx.getStorageSync('token')) {
      app.tokenReadyCallback = res => {
        that.getShopInfo();
        utils.getUserInfoNew().then(res => {
          userdata = res;
          that.setData({
            userInfo: res
          });
        })

      }
    } else {
      if (!this.data.shopInfo) {
        that.getShopInfo();
      }
      if (userdata) {
        this.setData({
          userInfo: userdata, //有用户信息，接受邀请按钮不获取用户信息·······
        });
      } else {
        utils.getUserInfoNew().then(res => {
          userdata = res;
          that.setData({
            userInfo: res
          });
        })
      }
    }

  },
  onReady: function () {
    app.watch(function (val, name) {
      if (name === "phaseIII") {
        wx.setStorageSync('phaseIII', val)
        // wx.showModal({
        //   title: 'PhaseIII',
        //   content:'phaseIII:'+val,
        //   showCancel:false
        // })
      }
    }.bind(this));

  },
  //获取店铺信息
  getShopInfo: function () {
    var that = this;
    if (!sid) {
      sid = wx.getStorageSync('sid');
    }
    if (!sid) {
      wx.showModal({
        title: '温馨提示',
        content: "未识别到店铺ID,请重新扫码或从最新版小程序的分享链接进入",
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/tabBar/shouye/index',
            })
          }
        }
      })
      return
    }

    util.getShopInfoMini(sid).then(data => {
      that.setData({
        shopInfo: data,
        pageReady: true
      })
      this.getcountcard()
    }).catch(err => {
      console.log("getShopInfoMini err:", err);
      //code:-1 认证无效，重新请求登录,让用户点击刷新页面
      that.setData({
        pageReady: true,
        shopInfo: ''
      })
      if (err && err.code == 0) {
        wx.showModal({
          title: '温馨提示',
          content: err.msg ? err.msg : '店铺信息不存在',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/tabBar/shouye/index',
              })
            }
          }
        })
      }
    })

  },
  getcountcard: function () {
    http.post("/api/card/getcountcard", false, false).then(res => {
      if (res.code == 1) {
        phaseIII_count = res.data;
        wx.setStorageSync('phaseIII_count', phaseIII_count);
      }
    }).catch(err => {
      console.error("getcountcard:", err);

    })

  },
  async beforeAccept() {
    try {
      let userInfo = this.data.userInfo;
      // 判断店长身份
      if (userInfo.condition == 1) {
        // 判断是否禁止转让店铺
        const inAct = this.selectComponent('#forbiddenTransShop').isForbiddenTransShop({
          tips: '暂不可加入其它门店'
        });
        if (inAct) return;
      }
      this.accept();
    } catch (error) {
      console.log("beforeAccept error:", error)
    }


  },
  //接受加入店铺邀请
  accept: function () {
    if (!phaseIII_count) {
      phaseIII_count = wx.getStorageSync('phaseIII_count');
    }
    let condition = wx.getStorageSync('who') || wx.getStorageSync('userdata').condition;
    if (condition && condition == 1) {
      if (phaseIII_count.order_0 > 0 || phaseIII_count.order_1 > 0) {
        wx.showModal({
          title: '温馨提示',
          content: '您有未完成返货订单，无法入驻他人门店',
          showCancel: false
        })
        return
      }

    }
    if (!token || !sid) {
      wx.showModal({
        title: '温馨提示',
        content: "此链接已失效，请从最新版小程序的分享链接进入",
        showCancel: false
      })
      return
    }
    this.jion();
  },
  async jion() {
    if (_repeated) {
      return
    }
    _repeated = true;
    var that = this
    let shopInfo = this.data.shopInfo;
    let myShopInfo = '';
    await utils.getShopInfo().then(data => {
      myShopInfo = data
    }).catch(err => {
      myShopInfo = '';
    });
    var userdata = wx.getStorageSync('userdata');
    var phone = wx.getStorageSync('phone') || userdata?.mobile;
    let msg = '您确定加入【' + shopInfo.shop_name + '】？';
    if (myShopInfo && myShopInfo.alias_id) {
      msg = '入驻后，您店铺绑定的纸质码将失效，\n' + msg
    }
    wx.showModal({
      title: '温馨提示',
      content: msg,
      cancelText: '不了',
      confirmText: '确定',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在提交',
            // mask: true
          })
          var data = {
            sid: sid ? sid : wx.getStorageSync('sid'),
            token: token ? token : wx.getStorageSync('sid_token')
          }
          http.post('/api/shop/join', data).then(res => {
            console.log('/api/shop/join then:', res);
            _repeated = false;
            switch (res.code) {
              //加入失败
              case '0':
                wx.showModal({
                  title: '温馨提示',
                  content: res.msg,
                  showCancel: false
                })
                if (!userdata.mobile && !phone) {
                  wx.showModal({
                    title: '温馨提示',
                    content: '绑定手机号码即可加入他人店铺' + '\n' + '是否立即绑定',
                    cancelText: '暂不考虑',
                    confirmText: '立即绑定',
                    success: function (res) {
                      if (res.confirm) {
                        wx.reLaunch({
                          url: '/pages/user/register/index',
                        })
                      } else {
                        wx.reLaunch({
                          url: '/pages/tabBar/shouye/index',
                        })
                      }
                    }
                  })
                }
                _repeated = false;
                break;
                //加入成功
              case '1':
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 2000,
                })
                //加入成功以后用户信息变更，清除 userdata
                wx.removeStorageSync('userdata');
                //判断用户是否绑定手机号
                if (userdata.mobile || phone) {
                  utils.getUserInfoNew().then(res => {

                    wx.reLaunch({
                      url: '/pages/tabBar/dianyuan/add',
                    })
                  })
                } else {
                  wx.showModal({
                    title: '温馨提示',
                    content: '绑定手机号码即可加入他人店铺' + '\n' + '是否立即绑定',
                    cancelText: '暂不考虑',
                    confirmText: '立即绑定',
                    success: function (res) {
                      if (res.confirm) {
                        wx.reLaunch({
                          url: '/pages/user/register/index',
                        })
                      } else {
                        wx.reLaunch({
                          url: '/pages/tabBar/shouye/index',
                        })
                      }
                    }
                  })
                }
                break;
                //还有余额未提现,弹出选择框用户选择是否跳转至提现页
              case '2':
                wx.showModal({
                  title: '温馨提示',
                  content: res.msg,
                  success: function (res) {
                    if (res.confirm) {
                      //跳转至提现页
                      wx.navigateTo({
                        url: '/pages/zhongduan/geren/yuer/tixian/index',
                      })
                      // wx.reLaunch({
                      //   url: '/pages/zhongduan/geren/yuer/tixian/index',
                      // })
                    }
                  }
                })
                break;
              case '3':
                //还有红包未拆,跳转至拆红包页面 hbdata:拆红包页面参数
                wx.showModal({
                  title: '温馨提示',
                  content: res.msg,
                  success: function (result) {
                    if (result.confirm) {
                      var hongbao = res.data;
                      // let boxdata = encodeURIComponent(JSON.stringify(res.data));
                      //根据type:1 旧活动，2 二期红包
                      var data = hongbao.qr;
                      var param = encodeURIComponent(data);
                      //判断data里的type值：1，一期红包，2，二期红包
                      if (hongbao.type == 1) {
                        wx.navigateTo({
                          url: '/pages/zongduan/saoma/hongbao/index?hbdata=' + param,
                        })
                      }
                      if (hnTypeArr.includes(+hongbao.type)) {
                        // 红牛箱内码61 是红包卡券2选一
                        // if (hn2in1.includes(+hongbao.type)) {
                        //   wx.navigateTo({
                        //     url: `/pages/storeAllowance/cashorCoupon/index?boxdata=${boxdata}`,
                        //   })
                        //   return
                        // }
                        wx.redirectTo({
                          url: '/pages/randomdraw/index/index?hbdata=' + param + '&hbtype=' + hongbao.type,
                        })
                      }
                      if (zmTypeArr.includes(+hongbao.type)) {
                        wx.redirectTo({
                          url: '/pages/warhorse/index/index?hbdata=' + param + '&hbtype=' + hongbao.type,
                        })
                      }

                      // wx.navigateTo({
                      //   url: '/pages/zongduan/saoma/hongbao/index?hbdata=' + res.data.data,
                      // })
                    }
                  }
                })
                break;
              default:
                wx.showModal({
                  title: '温馨提示',
                  content: res.msg,
                  showCancel: false
                })
            }
          }).catch(err => {
            _repeated = false;
          })

        } else {
          _repeated = false;
        }
      },
    })

  },
  //关闭弹窗
  close: function () {
    this.setData({
      storeRankingPop: false
    })
  },

  onHide: function () {


  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('sid');
    wx.removeStorageSync('sid_token');
    sid = '';
    token = '';
    _repeated = false;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    var prevPage = pages[pages.length - 2]; //获取上一个页面
    //小程序后台报错seData of undefined
    log.setFilterMsg("dy");
    log.info("上一个页面:", prevPage);
    if (prevPage) {
      prevPage.setData({ //修改上一个页面的变量
        hided: true
      })
    }

  },
  refresh: function () {

    util.getShopInfoMini(sid).then(data => {
      this.setData({
        shopInfo: data,
      })
      this.getcountcard()
    }).catch(err => {
      console.log("refresh getShopInfoMini err:", err);

    })
  },

})