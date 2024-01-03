// pages/phaseIII//write-off/index.js
const utils = require("../../../utils/util");
const log = require("../../../utils/log");
var getUserLocation = require('../../../utils/location');
let reachBottom = '';
let location = '';
let local_count = '';
const app = getApp();
const COS_URL = app.globalData.COS_URL;
let currentTime = ''; //当前核销时间
let requesting = false;
let next = 1;
const Api = require("../../../utils/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkPop: false, //核销确认弹窗
    successPop: false, //核销成功弹窗
    list: [], //待核销列表
    // list: [1, 2, 3, 4, 5, 6, 7], //待核销列表
    noMore: false, //没有更多
    checkMsg: '', //确认信息
    checkIndex: '', //核销的订单索引
    successMsg: '', //成功信息
    oneenjoyImg: COS_URL + "/public/img/phaseIII/oneenjoy080191.png",
    currentTime: '', //核销时间
    systemInfo: '',
    hxCheckImg: COS_URL + "/public/img/phaseIII/202104/hxCheck.png",
    successImg: COS_URL + "/public/img/phaseIII/202104/success0406.png",
    hnTitle: app.globalData.hnTitle,
    // 2023年9月19日 phaseIII的static 静态资源迁移至COS
    file_phase_static: `${COS_URL}/public/img/bfyl/phase/static`,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    next = 1;

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    if (!this.data.noMore && this.data.list.length == 0) {
      let param = {
        status: 1
      }
      wx.showLoading({
        title: '正在加载',
        // mask: true
      })
      this.getOrderList(param, this.dataProcess);
      this.getcountcard();
    }
    currentTime = utils.formatTime(new Date);
    this.setData({
      currentTime: currentTime
    });

  },
  /**
   * 商户核销列表：/api/card/getpacklog
   * 参数:next 下一页默认1
   * status 1 已受理，待核销
   */
  getOrderList: function (params, callback) {
    if (requesting) return;
    requesting = true;
    Api.postBase({
      url: '/api/card/getpacklog',
      params
    }).then(res => callback(res));
  },
  /**
   * 商家卡包统计：
   * open:已拆 -->我的兑换券
   * unopen:未拆 -->兑换奖励 开红包
   * unused:未核销-->待受理/待核销
   * used:已核销
   * uncard 已拆未核销
   */
  getcountcard: function () {
    utils.getcountcard().then(res => {
      const {
        code,
        data
      } = res;
      if (code == 1) {
        let phaseIII_count = data;
        local_count = wx.getStorageSync('local_count');
        if (local_count) {
          local_count.order_1 = phaseIII_count.order_1;
          wx.setStorageSync('local_count', local_count);
          wx.setStorageSync('phaseIII_count', phaseIII_count);
        }
      }
    });
  },
  //初始化数据、加载更多
  dataProcess: function (data) {
    let code = data.code;
    let list = this.data.list;
    let newData = data.data.list;
    let limit = data.data.limit;
    next = data.data.next ? data.data.next : 1;
    wx.hideLoading({
      success: (res) => {},
    })
    requesting = false;
    reachBottom = false;
    if (newData) {
      this.setData({
        list: list.concat(newData),
      });
    }
    if (code == 0 || newData.length < limit) {
      return this.setData({
        noMore: true
      });
    }
  },
  //下拉刷新
  dataRefresh: function (data) {
    let code = data.code;
    let newData = data.data.list;
    let limit = data.data.limit;
    next = data.data.next;
    wx.hideLoading({
      success: (res) => {},
    })
    requesting = false;
    //覆盖数据
    if (newData) {
      this.setData({
        list: newData,
        noMore: false
      });
    } else {
      next = 1;
      this.setData({
        list: '',
        noMore: true
      });
    }

    wx.stopPullDownRefresh({
      success: (res) => {},
    })

    if (code == 0 || newData.length < limit) {
      return this.setData({
        noMore: true
      });
    }
  },
  //刷新页面
  refresh: function () {
    wx.startPullDownRefresh({
      success: (res) => {
        console.log(res);
      },
    })
  },
  check: function (e) {
    //index  list 索引，根据index 取对应订单信息
    let id = e.currentTarget.dataset.id;
    let index = this.data.list.findIndex(item => item.id == id);
    let list = this.data.list;
    if (index > -1) {
      this.setData({
        checkPop: true,
        checkMsg: list[index]
      });
    }

  },
  openCheck: function (idx) {
    //index  list 索引，根据index 取对应订单信息
    requesting = false;
    let id = idx;
    let index = this.data.list.findIndex(item => item.id == id);
    let list = this.data.list;
    if (index > -1) {
      this.setData({
        checkPop: true,
        checkMsg: list[index]
      });
    }

  },
  //商户点击否取消核销:state 1确认  2取消
  close: function (e) {
    let check_no = e.currentTarget.dataset.num;
    var that = this;
    let param = {};

    param = {
      check_no: check_no,
      state: 2,
      longitude: location.longitude,
      latitude: location.latitude,
    }
    wx.showModal({
      title: '温馨提示',
      content: "您确定要取消核销？",
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在提交',
          })
          that.checkPage(param);
        }
      }
    })
    // wx.showLoading({
    //   title: '正在提交',
    // })
    // console.log("Line144 close  参数：",param);
    // this.checkPage(param);
  },
  closeSuccessPop: function () {
    this.setData({
      successPop: false
    });
    wx.redirectTo({
      url: '/pages/phaseIII/write-off/list',
    })
  },
  confirm: function (e) {
    let check_no = e.currentTarget.dataset.num;
    let param = {
      check_no: check_no,
      state: 1,
      longitude: location.longitude,
      latitude: location.latitude,
    }
    wx.showLoading({
      title: '正在提交',
    })
    this.checkPage(param);
  },
  //请求核销 
  checkPage: function (params) {
    let items = this.data.checkMsg;
    Api.postBase({
      url: '/api/card/checkpage',
      params
    }).then(res => {
      currentTime = utils.formatTime(new Date);
      const {
        code,
        msg
      } = res;
      if (code == 1) {
        this.setData({
          successMsg: items,
          checkPop: false,
          currentTime: currentTime
        })
        //status = 1 确认，2取消
        if (param.state == 1) {
          this.setData({
            successPop: true
          });
        }
        let params = {
          status: 1
        }
        this.getOrderList(params, this.dataRefresh);
        return
      }
      this.setData({
        checkPop: false
      });
      wx.showModal({
        title: '温馨提示',
        content: msg,
        showCancel: false
      })
    });
  },
  //取消申请
  cancelOrder: function (params, callback) {
    wx.showLoading({
      title: '正在请求',
    })
    var that = this;
    Api.postBase({
      url: '/api/card/cancelpack',
      params
    }).then(res => {
      const { code, msg } = res;
      if (code == 1) {
        wx.showModal({
          cancelColor: '温馨提示',
          content: msg,
          showCancel: false
        })
        let params = {
          status: 1
        }
        that.getcountcard();
        that.getOrderList(params, that.dataRefresh);
        local_count = wx.getStorageSync('local_count');
        local_count.order_0 = local_count.order_0 - 1;
        if (local_count.order_0 < 0) local_count.order_0 = 0;
        wx.setStorageSync('local_count', local_count);
        return
      }
      wx.showModal({
        title: '温馨提示',
        content: msg,
        showCancel: false
      })
    });

  },
  //取消核销
  cancelHX: function (e) {
    let check_no = e.currentTarget.dataset.check_no;
    var param = {
      check_no: check_no
    }
    var that = this;
    console.log("check_no:", check_no);
    wx.showModal({
      title: '温馨提示',
      content: "是否确定取消订单？",
      success: (res) => {
        if (res.confirm) {
          this.cancelOrder(param);
        }
      }
    })
  },
  getLocation: function (e) {
    let that = this;
    let idx = e.currentTarget.dataset.id;
    if (requesting) return;
    requesting = true;
    getUserLocation.getUserLocation(true).then(res => {
      location = res.data;
      this.openCheck(idx);
    }).catch(err => {
      wx.getSystemInfo({
        success: (result) => {
          if (!result.locationEnabled || !result.locationAuthorized) {
            wx.showModal({
              title: '温馨提示',
              content: '请您确保手机已打开系统定位且已授权微信获取定位权限.',
              showCancel: false
            })
            requesting = false;
            return false;
          } else {
            utils.getSetting().then(getSetting => {
              if (typeof (getSetting.authSetting["scope.userLocation"]) != 'undefined' && !getSetting.authSetting["scope.userLocation"]) {
                wx.showModal({
                  title: '定位授权',
                  content: '请允许小程序获取定位权限后再操作',
                  success: (showModal) => {
                    if (showModal.confirm) {
                      requesting = false;
                      wx.openSetting({
                        success: (openSetting) => {
                          if (openSetting.authSetting["scope.userLocation"]) {
                            getUserLocation.getUserLocation(true).then(getUserLocation => {
                              location = getUserLocation.data;
                              this.openCheck(idx);
                            }).catch(err => {
                              let str = JSON.stringify(err);

                              getUserLocation.ipAddress().then(ipaddress => {
                                location = ipaddress;
                                this.openCheck(idx);
                              }).catch(errs => {
                                wx.showModal({
                                  title: '温馨提示',
                                  content: "定位失败\n当前网络不稳定,请切换Wi-Fi网络重试;\n" + str,
                                  showCancel: false,
                                  success: function (_result) {}
                                })

                              })
                              log.addFilterMsg("hxLocation");
                              log.error("getLocation fail:", str);
                              requesting = false;

                            })

                          }

                        }
                      })
                    } else {
                      requesting = false;
                    }
                  },
                  fail: (err) => {
                    requesting = false;
                  }
                })
              } else {
                getUserLocation.getUserLocationWGS().then(wgs => {
                  location = wgs.data;
                  this.openCheck(idx);

                }).catch(wgsErr => {
                  let str = JSON.stringify(wgsErr);
                  getUserLocation.ipAddress().then(ipaddress => {
                    location = ipaddress;
                    this.openCheck(idx);
                  }).catch(errs => {
                    wx.showModal({
                      title: '温馨提示',
                      content: "定位失败\n当前网络不稳定,请切换Wi-Fi网络重试;\n" + str,
                      showCancel: false,
                      success: function (_result) {}
                    })
                  })
                  log.addFilterMsg("hxLocation");
                  log.error("getLocation fail:", str);

                  requesting = false;
                })
              }
            }).catch(err => {
              requesting = false;
            });

          }
        },
      })
    })




  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let param = {
      status: 1
    }
    this.getcountcard();
    this.getOrderList(param, this.dataRefresh);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom~");
    let param = {
      next: next,
      status: 1
    }
    if (this.data.noMore || reachBottom) return;
    reachBottom = true;
    wx.showLoading({
      title: '正在加载',
    })
    this.getcountcard();
    this.getOrderList(param, this.dataProcess);
  },
  // 关闭核销确认弹窗
  colsePop: function () {
    this.setData({
      checkPop: false
    });
    requesting = false;
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})