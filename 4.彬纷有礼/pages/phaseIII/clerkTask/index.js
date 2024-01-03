// pages/phaseIII//clerkTask/index.js
const utils = require("../../../utils/util");
const log = require("../../../utils/log");
var getUserLocation = require('../../../utils/location');
let location = '';
let app = getApp();
const COS_URL = app.globalData.COS_URL;
let currentTime = ''; //当前核销时间
let requesting = false;
let next0 = 1;
let next1 = 1;
let next2 = 1;
const Api = require("../../../utils/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    titles: ['待受理', '待核销', '已核销'],
    activeTab: 0,
    checkPop: false, //核销确认弹窗
    successPop: false, //核销成功弹窗
    noMore0: false, //待受理无数据
    noMore1: false, //待核销无数据
    noMore2: false, //已核销无数据
    list0: [], //待受理列表
    list1: [], //待核销列表
    // list1: [0, 1, 2, 3, 4, 5, 6], //待核销列表
    list2: [], //已核销列表
    // next0: 1, //待受理下一页
    // next1: 1, //待核销下一页
    // next2: 1, //已核销下一页
    count: '', //统计
    checkMsg: '', //确认信息
    checkIndex: '', //核销的订单索引
    successMsg: '', //成功信息
    hxCheckImg: COS_URL + "/public/img/phaseIII/202104/hxCheck.png", //核销确认弹窗图
    successImg: COS_URL + "/public/img/phaseIII/202104/success0406.png",
    img_nopoint: COS_URL + "/public/img/bfyl/assets/hongbao/nopoint.png",
    currentTime: '', //核销时间
    triggered: false, //scroll-view 触发刷新
    hnTitle: app.globalData.hnTitle,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let activeTab = '';
    let that = this;
    next0 = 1;
    next1 = 1;
    next2 = 1;
    if (options.activeTab) {
      activeTab = options.activeTab;
      this.setData({
        activeTab
      })
    } else {
      activeTab = this.data.activeTab;
    }
    let param = {
      status: activeTab
    }
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    this.getCountCard();
    this.getOrderList(activeTab, param, this.dataRefresh);


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
    currentTime = utils.formatTime(new Date);
    this.setData({
      currentTime: currentTime
    });
    utils.getUserInfoNew();
  },
  /**
   * 统计接口：/api/card/getcountcard 
   * @param {
   * 待受理 order_0 
   * 待核销 order_1
   * 已核销 order_2
   * }  
   */
  getCountCard: function () {
    let tabs = [];
    let titles = this.data.titles;
    utils.getcountcard().then(res => {
      const {
        code,
        data
      } = res;
      if (code == 1) {
        for (var i = 0; i < titles.length; i++) {
          let obj = {};
          obj.title = titles[i];
          switch (i) {
            case 0:
              obj.badge = data.order_0
              break;
            case 1:
              obj.badge = data.order_1
              break;
            case 2:
              obj.badge = data.order_2
              break;
            default:
              break;
          }
          tabs.push(obj);
        }
        this.setData({
          tabs: tabs,
          count: data
        });
      }
    })
  },
  onTabCLick(e) {
    const index = e.detail.index
    this.setData({
      activeTab: index
    })
    console.log("onTabClick");
  },

  onChange(e) {
    const index = e.detail.index
    console.log("切换选项卡：", index);
    this.setData({
      activeTab: index
    })
    let param = {
      status: index
    }
    switch (index) {
      case 0:
        if (!this.data.noMore0 && this.data.list0.length == 0) {
          this.getOrderList(index, param, this.dataProcess);
        }
        break;
      case 1:
        if (!this.data.noMore1 && this.data.list1.length == 0) {
          this.getOrderList(index, param, this.dataProcess);
        }
        break;
      case 2:
        if (!this.data.noMore2 && this.data.list2.length == 0) {
          this.getOrderList(index, param, this.dataProcess);
        }
        break;

      default:
        break;
    }
  },
  /**
   * 商户核销列表：/api/card/getpacklog
   * 参数:next 下一页默认1
   * status 1 已受理，待核销
   * activeTab:选中的选项卡，
   */
  getOrderList: function (activeTab, params, callback) {
    if (requesting) return;
    requesting = true;
    Api.postBase({
      url: '/api/card/getpacklog',
      params
    }).then(res => callback(activeTab, res));
  },
  //初始化数据、加载更多
  dataProcess: function (activeTab, data) {
    let code = data.code;
    let list0 = this.data.list0;
    let list1 = this.data.list1;
    let list2 = this.data.list2;
    let newData = data.data.list;
    let limit = data.data.limit;
    let next = data.data.next;
    wx.hideLoading({
      success: (res) => {},
    })
    requesting = false;
    let reachBottom = false;
    if (newData) {
      switch (true) {
        case (activeTab == 0):
          this.setData({
            list0: list0.concat(newData),
          });
          next0 = next
          break;
        case (activeTab == 1):
          this.setData({
            list1: list1.concat(newData),
          });
          next1 = next
          break;
        case (activeTab == 2):
          newData.forEach(element => {
            if (element.note && element.note.search('我的卡包') > -1) {
              element.note = element.note.replace('我的卡包', '掌柜的卡包');
            }
          });
          console.log("dataProcess 已核销 处理后的newData： ", newData);
          this.setData({
            list2: list2.concat(newData),
          });
          next2 = next
          break;

        default:
          break;
      }

    }
    if (code == 0 || newData.length < limit) {
      console.log("没有更多数据了·······：", activeTab);
      switch (true) {
        case (activeTab == 0):
          this.setData({
            noMore0: true
          });
          break;
        case (activeTab == 1):
          this.setData({
            noMore1: true
          });
          break;
        case (activeTab == 2):
          this.setData({
            noMore2: true
          });
          break;

        default:
          break;
      }
      return
    }
  },
  //下拉刷新
  dataRefresh: function (activeTab, data) {
    let code = data.code;
    let list0 = this.data.list0;
    let list1 = this.data.list1;
    let list2 = this.data.list2;
    let newData = data.data.list;
    let limit = data.data.limit;
    let next = data.data.next;
    wx.hideLoading({
      success: (res) => {},
    })
    this.setData({
      triggered: false,
    })
    this._freshing = false
    requesting = false;
    //覆盖数据
    if (newData) {
      console.log("activeTab:", activeTab);
      switch (true) {
        case (activeTab == 0):
          this.setData({
            list0: newData,
            noMore0: false
          });
          next0 = next;
          break;
        case (activeTab == 1):
          this.setData({
            list1: newData,
            noMore1: false
          });
          next1 = next;
          break;
        case (activeTab == 2):
          this.setData({
            list2: newData,
            noMore2: false
          });
          next2 = next;
          break;
        default:
          console.log(333333);
          break;
      }

    } else {

      switch (true) {
        case (activeTab == 0):
          this.setData({
            list0: [],
            noMore0: true
          });
          next0 = next;
          break;
        case (activeTab == 1):
          this.setData({
            list1: [],
            noMore1: true
          });
          next1 = next;
          break;
        case (activeTab == 2):
          this.setData({
            list2: [],
            noMore2: true
          });
          next2 = next
          break;
        default:
          break;
      }
    }

    wx.stopPullDownRefresh({
      success: (res) => {},
    })

    if (code == 0 || newData.length < limit) {
      switch (true) {
        case (activeTab == 0):
          this.setData({
            noMore0: true
          });
          break;
        case (activeTab == 1):
          this.setData({
            noMore1: true
          });
          break;
        case (activeTab == 2):
          this.setData({
            noMore2: true
          });
          break;
        default:
          break;
      }
      return
    }
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
    let activeTab = this.data.activeTab;
    console.log("onPullDown  选中的选项卡索引:", activeTab);
    let param = {
      status: activeTab
    }
    this.getCountCard();
    this.getOrderList(activeTab, param, this.dataRefresh);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  bindscrolltolower: function () {
    let activeTab = this.data.activeTab;
    let param = {};
    param.status = activeTab;
    switch (true) {
      case (activeTab == 0):
        param.next = next0;
        if (this.data.noMore0 || reachBottom) return;

        break;
      case (activeTab == 1):
        param.next = next1;
        if (this.data.noMore1 || reachBottom) return;
        break;
      case (activeTab == 2):
        param.next = next2;
        if (this.data.noMore2 || reachBottom) return;
        break;

      default:
        break;
    }

    let reachBottom = true;
    wx.showLoading({
      title: '正在加载',
    })
    console.log("scrolltolower````````请求参数：", param);
    this.getOrderList(activeTab, param, this.dataProcess);
  },
  check: function (e) {
    let id = e.currentTarget.dataset.id;
    console.log("id:", id);
    console.log("list:", this.data.list1);
    let index = this.data.list1.findIndex(item => item.id == id);
    let list = this.data.list1;
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
    let index = this.data.list1.findIndex(item => item.id == id);
    let list1 = this.data.list1;
    if (index > -1) {
      this.setData({
        checkPop: true,
        checkMsg: list1[index]
      });
    }

  },
  //商户点击否取消核销:state 1确认  2取消
  close: function (e) {
    let check_no = e.currentTarget.dataset.num;
    var that = this;
    let param = {};

    console.log("定位信息：", location);
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
        //state = 1 确认，2取消
        if (param.state == 1) {
          this.setData({
            successPop: true
          });

        }
        let activeTab = this.data.activeTab;
        let params = {
          status: activeTab
        }
        this.getCountCard();
        this.getOrderList(activeTab, params, this.dataRefresh);
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
    })
  },
  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    let activeTab = this.data.activeTab;
    console.log("onPullDown  选中的选项卡索引:", activeTab);
    let param = {
      status: activeTab
    }
    wx.vibrateShort();
    this.getCountCard();
    this.getOrderList(activeTab, param, this.dataRefresh);
    // setTimeout(() => {
    //   this.setData({
    //     triggered: false,
    //   })
    //   this._freshing = false
    // }, 3000)
  },
  // 关闭核销确认弹窗
  colsePop: function () {
    this.setData({
      checkPop: false
    });
    requesting = false;
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
                              this.openCheck(idx)
                            }).catch(err => {
                              let str = JSON.stringify(err);
                              log.addFilterMsg("hxLocation");
                              log.error("getLocation fail:", str);
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
                  log.addFilterMsg("hxLocation");
                  log.error("getLocation fail:", str);
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
  onRestore(e) {
    console.log('onRestore:', e)
  },

  onAbort(e) {
    console.log('onAbort', e)
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})