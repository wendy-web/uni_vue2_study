// pages/phaseIII/order/order.js
let app = getApp();
let COS = app.globalData.COS_URL;
const http = require('../../../utils/api');
const {
  padLeft
} = require('../../../utils/util');
const utils = require('../../../utils/util');
var {getUserLocation,getUserLocationWGS} = require('../../../utils/location');

let reachBottom = '';
let requesting = false;
let next_0 = 1;
let next_1 = 1;
let next_2 = 1;
let next_3 = 1;
let next_4 = 1;
let param = {};
let location = '';
let currentTime = ''; //当前核销时间
let log = require('../../../utils/log');
let taped = false; //点击事件
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '我的订单',
    date_icon: COS + '/public/img/phaseIII/202103/date_icon.png',
    defaultDate: '', //默认页面初始化日期 最近一个月
    showCalendar: false, //日历弹窗：默认隐藏
    showTypePop: false, //类型选择弹窗，默认隐藏
    selectedDate: '', //选择的日期
    dateRange: '', //日历组件默认选中日期
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }], //日历弹窗按钮
    activeTab: 0, //默认全部：0，待受理：1，待核销：2，已核销：3，已取消：4
    list0: [], //全部
    list1: [], //待受理
    list2: [], //待核销
    list3: [], //已核销
    list4: [], //已取消
    condition: '', //用户身份
    noMore: false, //没有更多数据
    cancelPop: false, //取消订单弹窗
    successPop: false, //取消成功弹窗
    remindPop: false, //返货提醒弹窗
    checkPop: false, //核销确认弹窗
    hxSuccessPop: false, //核销成功弹窗
    successImg: COS + "/public/img/phaseIII/202104/success0406.png",
    cancelOrderImg: COS + "/public/img/phaseIII/202104/cancelOrder.png",
    remindImg: COS + "/public/img/phaseIII/202104/remind.png",
    hxCheckImg: COS + "/public/img/phaseIII/202104/hxCheck.png", //核销确认弹窗图
    hxSuccessImg: COS + "/public/img/phaseIII/202104/success0406.png",
    nodataImg: COS + "/public/img/phaseIII/202104/order_nodata.png",
    hnTitle: app.globalData.hnTitle,
    zmTitle: app.globalData.zmTitle,
    //2022年2月24日 根据type判断订单所用卡券标题
    voucherTitle: {
      1: {
        "title": "换购券",
        "class": "voucher-title-dh"
      },
      3: {
        "title": "惠让券",
        "class": "voucher-title-hr"
      },
      4: {
        "title": "活动券",
        "class": "voucher-title-hd"
      },
    }, //卡券类型标题、calss
    // 2023年9月19日 phaseIII的static 静态资源迁移至COS
    file_phase_static: `${COS}/public/img/bfyl/phase/static`,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 其它页面传参跳转，根据参数显示指定状态
    if (options.activeTab) {
      this.setData({
        activeTab: options.activeTab
      })
    }
    this.initDate();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //初始化数据：根据activeTab请求对应状态列表
    this.initData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    requesting = false;
    utils.getUserInfoNew().then(data => {
      this.setData({
        condition: data.condition
      })
      if (data.condition == 2) {
        wx.setNavigationBarTitle({
          title: '我的任务',
        })
      }
    })
  },
  callUp: function (e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      cancelPop: false,
      successPop: false,
      remindPop: false,
      checkPop: false,
      hxSuccessPop: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      cancelPop: false,
      successPop: false,
      remindPop: false,
      checkPop: false,
      hxSuccessPop: false
    })
    requesting = false;
    console.log("page order unload");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      noMore: false
    })
    // 初始化日期
    this.initDate();
    // 初始化数据
    this.initData(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let activeTab = this.data.activeTab;
    let date = this.data.selectedDate;
    if (activeTab == 0) {
      param.status = 4;
    } else {
      param.status = activeTab - 1;
    }
    // 判断是否选择时间，默认不传时间参数
    if(this.dateChoosed){
      param.start_time = date[0];
      param.end_time = date[1];
    }
    if (this.data.noMore) return;
    console.log("触底请求参数:", param);
    this.getOrderList(param, "load", activeTab)
  },
  // 初始化数据 nodate:清除日期筛选
  initData: function (nodate = false) {
    //下拉刷新初始化数据 
    let activeTab = this.data.activeTab;
    console.log("activeTab:", activeTab);
    if (activeTab == 0) {
      // 全部
      param.status = 4;
    } else {
      param.status = activeTab - 1;
    }
    console.log("param：", param);
    this.getOrderList(param, "refresh", activeTab, nodate);
    this.getCountCard();
    return
    if (activeTab == 1) {
      //待受理
      param.status = 0;
    }
    if (activeTab == 2) {
      //待核销
      param.status = 1;
    }
    if (activeTab == 3) {
      //已核销
      param.status = 2;
    }

  },
  chooseDate: function () {
    this.setData({
      showCalendar: true
    });
    let calendar = this.selectComponent("#calendar");
    let arr = this.data.defaultDate.split("~");
    console.log("arr:", arr);
    calendar.initDate();
  },
  initDate: function () {
    var recentMonth = utils.getLastMonth();
    var selectedDate = new Array();
    selectedDate.push(recentMonth.last);
    selectedDate.push(recentMonth.now);
    param.start_time = '';
    param.end_time = '';
    this.setData({
      defaultDate: recentMonth.last + "~" + recentMonth.now,
      selectedDate: selectedDate,
    })
  },
  onRangePick(event) {
    console.log('parent onRangePick', event)
    var selectedDate = event.detail;
    param.start_time = selectedDate[0];
    param.end_time = selectedDate[1];
    this.setData({
      selectedDate: selectedDate,
      defaultDate: selectedDate[0] + "~" + selectedDate[1],

    })

  },
  // 点击选择日历按钮
  tapDateButton: function (e) {
    //根据data 设置的button 顺序 ，默认左取消右确定
    let index = e.detail.index;
    if (index == 0) {
      //点击取消
      this.setData({
        showCalendar: false,
      });
      return
    }
    //关闭日历弹窗
    this.setData({
      showCalendar: false,
    });
    if (index == 1) {
      //点击确定
      //日期参数：
      let date = this.data.selectedDate;
      let activeTab = this.data.activeTab;
      param = {
        start_time: date[0],
        end_time: date[1],
        next: 1
      }
      if (activeTab == 0) {
        param.status = 4;
      } else {
        param.status = activeTab - 1;
      }
      this.dateChoosed=true;
      this.getOrderList(param, "refresh", activeTab);



    }
  },
  changeTab: function (e) {
    let activeTab = e.currentTarget.dataset.index;
    console.log("index:", activeTab, e);
    this.setData({
      activeTab,
      noMore: false
    })
    this.initDate();
    //重置参数
    switch (Number(activeTab)) {
      case 0:
        console.log("全部");
        if (this.data.list0.length < 1) {
          this.initData(true);
        }
        break;
      case 1:
        if (this.data.list1.length < 1) {
          this.initData(true);
        }
        console.log("待受理");
        break;
      case 2:
        if (this.data.list2.length < 1) {
          this.initData(true);
        }
        console.log("待核销");
        break;
      case 3:
        if (this.data.list3.length < 1) {
          this.initData(true);
        }
        console.log("已核销");
        break;
      case 4:
        if (this.data.list4.length < 1) {
          this.initData(true);
        }
        console.log("已取消");
        break;
      default:
        break;
    }
  },
  getOrderList: function (param, type = 'load', activeTab, nodate = false) {
    if (requesting) return;
    requesting = true;
    if (type == "refresh") {
      param.next = 1;
      if (nodate) {
        delete param.start_time;
        delete param.end_time;
      }
    } else {
      switch (Number(activeTab)) {
        case 0:
          param.next = next_0;
          break;
        case 1:
          param.next = next_1;
          break;
        case 2:
          param.next = next_2;
          break;
        case 3:
          param.next = next_3;
          break;
        case 4:
          param.next = next_4;
          break;

        default:
          break;
      }
    }
    console.log("请求参数：", param);
    log.addFilterMsg('getpacklogParam');
    log.info("请求参数:", JSON.stringify(param));
    http.post('/api/card/getpacklog', param, false).then(res => {
      console.log("getOrderList 返回结果：", res);
      // log.info("getpacklog 返回结果:", JSON.stringify(res));
      requesting = false;
      return this.dataProcess(res, type, activeTab)
    }).catch(err => {
      log.addFilterMsg("getpacklogErr");
      log.error('/api/card/getpacklog err:', JSON.stringify(err));
    })
  },
  //初始化数据、加载更多
  dataProcess: function (data, type, activeTab) {
    let code = data.code;
    let newData = data.data.list;
    let limit = data.data.limit;
    let next = data.data.next ? data.data.next : 1;
    if (type == "refresh") {

      //刷新数据：所有参数重置
      param.start_time = '';
      param.end_time = '';
      if (newData) {
        console.log("有数据:", activeTab, newData);
        switch (Number(activeTab)) {
          case 0:
            //全部
            next_0 = next;
            this.setData({
              list0: newData
            })
            break;
          case 1:
            //全部
            next_1 = next;
            this.setData({
              list1: newData
            })
            break;
          case 2:
            //全部
            next_2 = next;
            this.setData({
              list2: newData
            })
            break;
          case 3:
            //全部
            next_3 = next;
            this.setData({
              list3: newData
            })
            break;
          case 4:
            //全部
            next_4 = next;
            this.setData({
              list4: newData
            })
            break;

          default:
            break;
        }

      } else {
        console.log("无数据");
        this.setData({
          noMore: false
        })
        switch (Number(activeTab)) {
          case 0:
            //全部
            next_0 = next;
            this.setData({
              list0: []
            })
            break;
          case 1:
            //待受理
            next_1 = next;
            this.setData({
              list1: []
            })
            break;
          case 2:
            //待核销
            next_2 = next;
            this.setData({
              list2: []
            })
            break;
          case 3:
            //已核销
            next_3 = next;
            this.setData({
              list3: []
            })
            break;
          case 4:
            //已取消
            next_4 = next;
            this.setData({
              list4: []
            })
            break;

          default:
            break;
        }
      }
      wx.stopPullDownRefresh({
        success: (res) => {},
      })


    } else {
      // 加载数据
      if (newData) {
        switch (Number(activeTab)) {
          case 0:
            //全部
            this.setData({
              list0: this.data.list0.concat(newData),
            });
            break;
          case 1:
            //待受理
            this.setData({
              list1: this.data.list1.concat(newData),
            });
            break;
          case 2:
            //待核销
            this.setData({
              list2: this.data.list2.concat(newData),
            });
            break;
          case 3:
            //已核销
            this.setData({
              list3: this.data.list3.concat(newData),
            });
            break;
          case 4:
            //已取消
            this.setData({
              list4: this.data.list4.concat(newData),
            });
            break;

          default:
            break;
        }

      }
      switch (Number(activeTab)) {
        case 0:
          //全部
          next_0 = next;
          break;
        case 1:
          //待受理
          next_1 = next;
          break;
        case 2:
          //待核销
          next_2 = next;
          break;
        case 3:
          //已核销
          next_3 = next;
          break;
        case 4:
          //已取消
          next_4 = next;
          break;

        default:
          break;
      }
      reachBottom = false;
    }

    requesting = false;
    if (code == 0 || newData.length < limit) {
      return this.setData({
        noMore: true
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
  //取消订单弹窗:需要判断是从全部列表还是待受理列表点击，取对应list数据
  cancel: function (e) {
    let index = e.currentTarget.dataset.index;
    let activeTab = this.data.activeTab;
    let list = this.data.list0;
    if (activeTab == 1) {
      list = this.data.list1;
    }
    this.setData({
      cancelPop: true,
      orderMsg: list[index]
    });
  },
  //取消订单
  cancelOrder: function (e) {

    var check_no = e.currentTarget.dataset.check_no;
    var post_param = {
      check_no: check_no
    }
    this.cancelOrderPost(post_param).then(res => {
      if (res.code == 1) {
        //根据activeTab：0全部，1待受理 2待核销 3已核销 4已取消 刷新指定列表
        //param.status:4全部 
        let activeTab = this.data.activeTab;
        if (activeTab == 0) {
          param.status = 4;
          //清空待受理列表
          this.setData({
            list1: []
          })
        } else {
          param.status = activeTab - 1;
          //清空全部列表
          this.setData({
            list0: []
          })
        }
        let timer =  setTimeout(() => {
          clearTimeout(timer);
          this.getCountCard();
          this.getOrderList(param, "refresh", activeTab);
          
        }, 1000);
        //请求返回，关闭取消返货申请弹窗
        this.setData({
          cancelPop: false,
          cancelMsg: res,
          successPop: true,
        });

        return
      }
      if (res.code == 0) {
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false
        })
        this.setData({
          cancelPop: false
        });
      }
    })


  },
  //关闭弹窗
  close: function (e) {
    this.setData({
      cancelPop: false,
      successPop: false,
      remindPop: false,
      checkPop: false,
      hxSuccessPop: false
    });
  },
  //重新申请
  reapply: function (e) {
    this.setData({
      successPop: false
    })
    wx.redirectTo({
      // url: '/pages/phaseIII/exchange/index',
      url: '/pages/phaseIII/voucher/index',
    })
  },
  //提醒商家返货
  remindMerchant: function (e) {
    let check_no = e.currentTarget.dataset.check_no;
    let index = e.currentTarget.dataset.index;
    //根据activeTab判断 不同列表：全部、待受理
    let activeTab = this.data.activeTab;
    let list = this.data.list0;
    if (activeTab == 1) {
      list = this.data.list1
    }
    console.log("提醒单号：", check_no);

    var post_param = {
      check_no: check_no
    }
    http.post("/api/card/remind", post_param).then(res => {
      console.log("提醒审核申请返回结果：", res);
      if (res.code == 1) {
        //请求返回，关闭取消返货申请弹窗
        this.setData({
          remindMsg: list[index],
          remindPop: true,
        });
        return
      }
      if (res.code == 0) {
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false
        })
      }
    })

  },
  //取消核销
  cancelHX: function (e) {
    let check_no = e.currentTarget.dataset.check_no;
    var post_param = {
      check_no: check_no
    }
    var that = this;
    console.log("check_no:", check_no);
    wx.showModal({
      title: '温馨提示',
      content: "是否确定取消订单？",
      success: (res) => {
        if (res.confirm) {
          this.cancelOrderPost(post_param).then(res => {
            let activeTab = this.data.activeTab;
            //根据不同activeTab刷新列表，取消核销可能是在全部列表，或者待核销列表
            if (res.code == 1) {
              wx.showModal({
                cancelColor: '温馨提示',
                content: res.msg,
                showCancel: false,
                success:()=>{
                  if (activeTab == 0) {
                    param.status = 4;
                    //清空待核销列表
                    this.setData({
                      list2: []
                    })
                  } else {
                    //清空全部列表
                    this.setData({
                      list0: []
                    })
                    param.status = activeTab - 1;
                  }
                  //立即请求可能会导致数据异常：（同一秒）
                  that.getCountCard();
                  that.getOrderList(param, "refresh", activeTab);
                }
              })

              // if (activeTab == 0) {
              //   param.status = 4;
              //   //清空待核销列表
              //   this.setData({
              //     list2: []
              //   })
              // } else {
              //   //清空全部列表
              //   this.setData({
              //     list0: []
              //   })
              //   param.status = activeTab - 1;
              // }
              // //立即请求可能会导致数据异常：（同一秒）
              // that.getCountCard();
              // that.getOrderList(param, "refresh", activeTab);
              return
            }
            if (res.code == 0) {
              wx.showModal({
                title: '温馨提示',
                content: res.msg,
                showCancel: false
              })

            }
          });
        }
      }
    })
  },
  //订单取消请求
  cancelOrderPost(param) {
    return new Promise((resolve, reject) => {
      http.post("/api/card/cancelpack", param).then(res => {
        console.log("取消返回申请返回结果：", res);
        resolve(res)
      })
    })
  },
  //获取卡包统计
  getCountCard: function () {
    utils.getcountcard().then(res => {
      if (res.code == 1) {
        let count = res.data;
        if (count.order_0 > 99) {
          count.order_0 = "99+";
        }
        if (count.order_1 > 99) {
          count.order_1 = "99+";
        }
        this.setData({
          count
        });
      }
    })
  },
  //获取定位后立即核销
  getLocation: function (e) {
    log.info("点击立即核销");
    let {id:idx} = e.currentTarget.dataset;
    log.info("idx:",idx);
    console.log(idx);
    let that = this;
    wx.showLoading({
      // title: '正在操作，请稍后',
      title: '加载中',
      mask:true
    })
    getUserLocation(true).then(res => {
      wx.hideLoading();
      log.addFilterMsg("hxgetlocation");
      log.info("定位信息:", res);
      location = res.data;
      that.hxCheck(idx);
    }).catch(err => {
      log.info("定位失败：", err);
      wx.hideLoading();
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
                            getUserLocation(true).then(_res => {
                              location = _res.data;
                              that.hxCheck(idx)
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
                getUserLocation().then(_res => {
                  location = _res.data;
                  that.hxCheck(idx);

                }).catch(_resErr => {
                  let str = JSON.stringify(_resErr);
                  getUserLocationWGS().then(wgs => {
                    location = wgs.data;
                    that.hxCheck(idx);
                  }).catch(errs => {
                    let str = JSON.stringify(errs);
                    log.addFilterMsg("locationFailed");
                    log.error("locationFailedWGS", str);
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
        fail: (error) => {
          log.addFilterMsg('getsystemInfo');
          log.info("fail:", error);
        }
      })
    })
  },
  //核销确认弹窗
  hxCheck: function (idx) {
    log.addFilterMsg("hxCheck");
    requesting = false;
    let activeTab = this.data.activeTab;
    let item = '';
    let list = activeTab == 0?this.data.list0:this.data.list2
    let index = list.findIndex(item=>item.id == idx)
    item =list[index];
    // let index = list.findIndex(item => item.id == id);
    console.log("list_item:", item)
    console.log("activeTab:", activeTab);
    console.log("经纬度信息：", location);
    log.info(item);
    if (item) {
      this.setData({
        checkPop: true,
        checkMsg: item
      });
    }
    // if (index > -1) {
    //   this.setData({
    //     checkPop: true,
    //     checkMsg: list[index]
    //   });
    // }

  },
  //核销确认
  hxConfirm: function (e) {
    let check_no = e.currentTarget.dataset.num;
    let post_param = {
      check_no: check_no,
      state: 1,
      longitude: location.longitude,
      latitude: location.latitude,
    }

    this.checkPage(post_param);
  },
  //请求核销 
  checkPage: function (post_param) {
    console.log("param参数:", post_param);
    post_param.latitude = location.latitude;
    post_param.longitude = location.longitude;
    let items = this.data.checkMsg;
    //根据不同选项卡刷新列表数据：全部，待核销，已取消，已核销
    let activeTab = this.data.activeTab;
    if (activeTab == 0) {
      param.status = 4;
    } else {
      param.status = activeTab - 1;
    }
    http.post('/api/card/checkpage', post_param).then(res => {
      console.log("checkPage 核销请求返回:", res);
      currentTime = utils.formatTime(new Date);
      if (res.code == 1) {
        this.setData({
          successMsg: items,
          checkPop: false,
          currentTime: currentTime
        })
        //state = 1 确认，2取消
        if (post_param.state == 1) {
          this.setData({
            hxSuccessPop: true,
            list3: [], //清空已核销，点击刷新数据
          });

        } else {
          this.setData({
            list4: [], //清空已取消，点击刷新数据
          });
        }



      }
      if (res.code == 0) {
        this.setData({
          checkPop: false
        });
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false
        })
      }
      this.getCountCard();
      this.getOrderList(param, "refresh", activeTab);
    })

  },
  //商户点击否取消核销:state 1确认  2取消
  tapCancelHX: function (e) {
    let check_no = e.currentTarget.dataset.num;
    var that = this;
    let post_param = {};

    console.log("定位信息：", location);
    post_param = {
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
          that.setData({
            checkPop: false
          })
          that.checkPage(post_param);
        }
      }
    })

  },
  //获取定位信息
  getMyLocation: function (e) {
    log.info('点击事件：', taped);
    let that = this;
    if (taped) return;
    taped = true;
    //加载中
    wx.showLoading({
      title: '加载中',
    })
    // 获取按钮绑定的参数
    let {
      id: idx
    } = e.currentTarget.dataset;
    //取缓存的经纬度
    location = utils.getCache('u_location');
    //有经纬度，去处理业务
    if (location) {
      taped = false;
      wx.hideLoading();
      console.log('缓存的经纬度：', location);
      return this.hxCheck(idx);
    }
    //获取最新的经纬度
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        taped = false;
        console.log('location api:', res);
        log.info('location api:', res);
        //关闭loading
        wx.hideLoading();
        if (res.latitude && res.longitude) {
          location = res;
          utils.setCache('u_location', res, 600) //变量名，数据，缓存时间（秒）
          //处理业务
          return that.hxCheck(idx)
        }
        //获取的经纬度异常时，判断授权情况
        that.checkAuth();
      },
      fail: function (err) {
        taped = false;
        wx.hideLoading();
        //定位获取失败，排除取消的情况
        if(err.errMsg != "getLocation:fail auth deny"){
          log.info("定位失败：",err);
        }
        console.log("定位获取失败：", err);
        that.checkAuth();
      }
    })


  },
  //定位获取不到时，检查授权情况
  checkAuth: function () {
    wx.getSystemInfo({
      success: (result) => {
        if (!result.locationEnabled || !result.locationAuthorized) {
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
                          getUserLocation(true).then(_res => {
                            location = _res.data;
                            utils.setCache('u_location', _res.data, 600);
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


                          })

                        }

                      }
                    })
                  }
                },
                fail: (err) => {}
              })
            } else {
              getUserLocation().then(_res => {
                location = _res.data;
                utils.setCache('u_location', _res.data, 600);
                
              }).catch(_resErr => {
                let str = JSON.stringify(_resErr);
                getUserLocationWGS().then(wgs => {
                  location = wgs.data;
                  utils.setCache('u_location', wgs.data, 600);
                }).catch(errs => {
                  let str = JSON.stringify(errs);
                  log.addFilterMsg("locationFailed");
                  log.error("locationFailedWGS", str);
                  wx.showModal({
                    title: '温馨提示',
                    content: "定位失败\n当前网络不稳定,请切换Wi-Fi网络重试;\n" + str,
                    showCancel: false,
                    success: function (_result) {}
                  })

                })
              })
            }
          }).catch(err => {});
        }
      },
      fail: (error) => {
        log.addFilterMsg('getsystemInfo');
        log.info("fail:", error);
      }
    })
  },
})