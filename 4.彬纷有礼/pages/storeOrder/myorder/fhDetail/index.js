// pages/storeOrder/fhDetail/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const utils = require("../../../../utils/util");
import {
  hxdetail,
  remind,
  cancelpack
} from '../../api/fhOrder'
let taped = false; //点击事件
let log = require('../../../../utils/log');
//根据t_type判断
const voucherTitle = {
  0: {
    "title": "换购券",
    "class": "voucher-title-dh"
  },
  1: {
    "title": "惠让券",
    "class": "voucher-title-hr"
  },
  2: {
    "title": "活动券",
    "class": "voucher-title-hd"
  },
}
let location = '';
var {
  getUserLocation,
  getUserLocationWGS
} = require('../../../../utils/location');
var reg = /^(\d{3})\d*(\d{4})$/;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    status_icon_path: '', //返货订单状态图标
    status_name: ' ', //返货订单状态名
    voucherTitle, //卡券类型标题、calss
    icon_location: '../../static/icon_location.png',
    icon_copy: '../../static/icon_copy.png',
    icon_phone: '../../static/icon_phone.png',

    order_no: '', //核销订单号
    orderInfo: null, //订单详情
    userInfo: null,
    steps: [], //订单进度
    file_url_9m: `${COS_URL}/public/img/bfyl/2023/09`, //23年9月 cos图片资源
    setp_toggle: true, //订单进度折叠，默认true,flase 展开
    coupon_toggle: true, //卡券信息折叠，默认true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("页面传参：", options)

    this.initOptions(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  async initOptions(options) {
    try {
      //获取用户身份
      let userInfo = wx.getStorageSync('userdata') || await utils.getUserInfoNew();
      let {
        order_no = '',
          order_id = ''
      } = options;
      this.setData({
        userInfo,
        order_id,
        order_no
      })
      // 获取订单详情
      this.getDetail(order_no);
    } catch (error) {
      console.log('initOptions catch:', error);
    }


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
  //获取核销订单详情
  getDetail(orderNum) {
    let order_no = this.data.order_no;
    if (!order_no) return wx.showModal({
      title: '温馨提示',
      content: '未获取到订单号',
      showCancel: false
    })
    this.setData({
      steps: []
    })
    hxdetail({
      order_no
    }).then(res => {
      let {
        code,
        data,
        msg
      } = res;
      if (code == 1) {
        //初始化数据
        this.initData(data);
        // 2023年9月13日 手机号加星号
        if (data.d_mobile) {
          data.d_mobile_str = data.d_mobile.replace(reg, '$1****$2');
        }
        if (data.mobile) {
          data.mobile_str = data.mobile.replace(reg, '$1****$2');
        }
        // f_mobile_str
        if (data.f_mobile) {
          data.f_mobile_str = data.f_mobile.replace(reg, '$1****$2');
        }
        this.setData({
          orderInfo: data
        })
        return
      }
      wx.showModal({
        title: '温馨提示',
        content: msg,
        showCancel: false
      })
    })
  },
  //初始化数据：hx状态判断、订单进度、操作按钮显示
  initData(data) {
    this.initStatus(data.status)
    this.initStepsNew(data.act_list);
    this.initCardList(data.card_list);
    return
    //初始化订单进度steps
    if (data.cancel_time) {
      this.initSteps({
        text: '已取消',
        desc: data.cancel_time
      })
    }
    if (data.s_verify_time) {
      this.initSteps({
        text: '已核销',
        desc: data.s_verify_time
      })
    }
    if (data.verify_time) {
      this.initSteps({
        text: '已扫码核销',
        desc: data.verify_time
      })
    }
    if (data.delivery_time) {
      this.initSteps({
        text: '配送中',
        desc: data.delivery_time
      })
    }
    if (data.accept_time) {
      this.initSteps({
        text: '已受理',
        desc: data.accept_time
      })
    }
    if (data.order_time) {
      this.initSteps({
        text: '提交申请',
        desc: data.order_time
      })
    }
  },
  //初始化进度
  initSteps({
    text,
    desc
  }) {
    let obj = {
      inactiveIcon: '',
      activeIcon: 'more',
    };
    obj.text = text;
    obj.desc = desc;
    let steps = this.data.steps;
    steps.push(obj)
    this.setData({
      steps
    })

  },
  // 新版订单进度，取act_list
  initStepsNew(actList) {
    let steps = [];
    actList.forEach(item => {
      let obj = {
        inactiveIcon: '',
        activeIcon: 'more',
        text: item.name,
        desc: item.time
      }
      steps.push(obj)
    })
    this.setData({
      steps
    })
  },
  // 初始化卡券信息
  initCardList(cardList) {
    if (cardList.length) {
      let card_list_total = 0;
      cardList.forEach(item => {
        card_list_total += item.num;
      })
      this.setData({
        card_list_total,
        cardList
      })
    }
  },
  //初始化状态：待受理，待配送（空）待收货 已完成 已取消
  initStatus(status) {
    let status_icon_path = '';
    let status_name = '';
    switch (status) {
      // 取消
      case 0:
      case 2:
        status_icon_path = '../../static/icon_status_0.png';
        status_name = '已取消';
        break;
      case 1:
        status_icon_path = '../../static/icon_status_1.png';
        status_name = '待受理';
        break;
      case 3:
      case 4:
      case 5:
      case 6:
      case 7: //核销：可操作
      case 8: //核销：灰色，不可点击
        status_icon_path = '../../static/icon_status_8.png';
        status_name = '待收货';
        break;
      case 9: //已完成
        status_icon_path = '../../static/icon_status_9.png';
        status_name = '已完成';
        break;
      default:
        status_icon_path = '../../static/icon_status_7.png';
        status_name = '——';
        break;
    }
    this.setData({
      status_icon_path,
      status_name
    })
    console.log("订单状态初始化：", status_icon_path, status_name);
  },

  //复制文本
  copyText(event) {
    let {
      text
    } = event.currentTarget.dataset;
    wx.setClipboardData({
      data: text,
    })
  },
  //拨打电话
  call(event) {
    let {
      phone
    } = event.currentTarget.dataset;
    if (!phone) return wx.showToast({
      title: '暂无联系方式',
      icon: 'none',
      duration: 2000
    })
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  //提醒商家返货
  remindMerchant(event) {
    let {
      check_no
    } = event.currentTarget.dataset;

    remind({
      check_no
    }).then(res => {
      let {
        code,
        msg
      } = res;
      if (code == 1) {
        //提醒返货成功弹窗
        let {
          goods_name,
          num: count_dh,
          order_no: check_no,
          brand: exc_type,
          unit
        } = this.data.orderInfo;
        let sku_info = {
          sku_name:goods_name,
          unit
        }
        this.selectComponent("#fhPopup").showRemindPop({
          count_dh,
          check_no,
          exc_type,
          sku_info
        });
        return
      }
      wx.showModal({
        title: '温馨提示',
        content: msg,
        showCancel: false
      })

    })


  },
  //点击取消申请，打开弹窗二次确认
  openCancelPop() {
    let {
      num: count_dh,
      order_no: check_no,
      name: a_jxs,
      unit,
      goods_name,
      d_mobile_str,
      mobile_str
    } = this.data.orderInfo;
    let sku_info = {
      unit,
      sku_name: goods_name
    }
    this.selectComponent("#fhPopup").showCancelPop({
      count_dh,
      check_no,
      a_jxs,
      sku_info,
      mobile_str: mobile_str || d_mobile_str
    });
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

    //取缓存的经纬度
    location = utils.getCache('u_location');
    //有经纬度，去处理业务
    if (location) {
      taped = false;
      wx.hideLoading();
      console.log('缓存的经纬度：', location);
      return this.hxCheck();
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
          return that.hxCheck()
        }
        //获取的经纬度异常时，判断授权情况
        that.checkAuth();
      },
      fail: function (err) {
        taped = false;
        wx.hideLoading();
        //定位获取失败，排除取消的情况
        if (err.errMsg != "getLocation:fail auth deny") {
          log.info("定位失败：", err);
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
  //核销确认弹窗
  hxCheck: function () {
    log.addFilterMsg("hxCheck");
    let {
      goods_name: cp_title,
      num: count_dh,
      s_num: count_sj,
      order_no: check_no,
    } = this.data.orderInfo;
    // this.selectComponent("#fhPopup").showCheckPop({
    //   cp_title,
    //   count_dh,
    //   count_sj,
    //   check_no,
    //   location
    // });
    // 2023年9月18日 新版核销UI
    let id = this.data.order_id;
    if (id) {
      this.selectComponent("#batchHxPop").showSelectPop({
        locationInfo: location, // 定位信息
        id, //id 必须要传，获取更多待核销列表
      });
    }

  },
  //取消订单
  cancelOrder: function (e) {
    let {
      check_no
    } = e.currentTarget.dataset;
    var that = this;
    console.log("check_no:", check_no);
    wx.showModal({
      title: '温馨提示',
      content: "是否确定取消订单？",
      success: (res) => {
        if (res.confirm) {
          cancelpack({
            check_no
          }).then(res => {
            let {
              code,
              msg
            } = res;
            if (code == 1) {
              wx.showModal({
                cancelColor: '温馨提示',
                content: msg,
                showCancel: false,
                success: () => {
                  //刷新数据
                  this.getDetail();
                }
              })
              return
            }
            wx.showModal({
              title: '温馨提示',
              content: msg,
              showCancel: false
            })
          });

        }
      }
    })
  },
  // 折叠
  foldStep(event) {
    let {
      name
    } = event.currentTarget.dataset;
    let toggle = this.data[name];
    this.setData({
      [name]: !toggle
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },


})