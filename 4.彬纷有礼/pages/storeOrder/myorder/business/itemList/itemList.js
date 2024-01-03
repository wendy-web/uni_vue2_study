// pages/storeDisplay/business/itemList.js
// 调用组件提供的方法文件
import {
  getPackLog,
  press,
} from '../../../api/index';
import {
  remind,
} from '../../../api/fhOrder';

const utils = require("../../../../../utils/util");
const http = require('../../../../../utils/api');
var {
  getUserLocation,
  getUserLocationWGS
} = require('../../../../../utils/location');
let location = '';
let log = require('../../../../../utils/log');
// let requesting = false;
let taped = false; //点击事件
// let currentTime = ''; //当前核销时间
let _params = null;
var reg = /^(\d{3})\d*(\d{4})$/;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tab: { // 属性名:
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    feedList: [],
    pageNext: 0, // 页码
    condition: '', //用户身份
    voucherTitle: {
      1: {
        "title": "换购券",
        "class": "voucher-title-dh"
      },
      2: {
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
    icon_delivery: '../../../static/icon_delivery.png', //送货图标
    icon_salesman: '../../../static/icon_salesman.png', //下单图标
    orderStatusCalss: {
      1: 'order-status-red',
      2: 'order-status-red',
      3: 'order-status-red',
      4: 'order-status-green',
      5: 'order-status-grey',
    }, //不同订单状态区分颜色显示
  },
  lifetimes: {
    attached: function () {
      let userdata = wx.getStorageSync('userdata') || null;
      if (userdata) {
        this.setData({
          condition: userdata.condition
        })
      } else {

        utils.getUserInfoNew().then(data => {
          this.setData({
            condition: data.condition
          })

        })
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      _params = {};
    },
  },
  pageLifetimes: {
    show: () => {
      console.log("父组件···页面显示·····");
    },

  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**刷新当前 */
    reset() {
      this.selectAllComponents('.list-container').forEach(item => {
        item.forceRefresh()
      })
    },

    /**回调刷新 */
    refresh() {
      // this.triggerEvent('refresh')
      this.triggerEvent('getcount');

    },
    //加载数据
    loadData: function (event) {
      /**携参 */
      let {
        pageNum,
        endError,
        endSuccess
      } = event.detail
      /**请求参数 */
      let pageNext = this.data.pageNext
      /**第一页时重置数据 */
      if (pageNum == 1) {
        //有筛选的条件时，更新tab统计
        if (_params) {
          this.triggerEvent('getcount');
        }
        pageNext = 0
        this.setData({
          feedList: []
        })
      }
      /**组合请求参数 */
      let params = {
        filter: 2, //2过滤掉月结账单
        status: this.data.tab, //0全部，1待受理，2 待配送，3待收货，4已完成
        next: pageNext,
        limit: 10,
        order_mark: 1 //返货订单
      }

      if (_params) {
        params = {
          ..._params,
          status: this.data.tab,
          next: pageNext,
        }
      }
      console.log('getPackLog 传参：', params);
      getPackLog(params, true).then(res => {
        //响应请求数据
        let data = res.data || {
          list: []
        }
        //下一次的请求参数
        pageNext = data.next
        //数据合并前处理
        data.list.forEach(item => {
          //商城订单：list_type =1,处理优惠金额显示
          if (item.list_type == 1) {
            //订单总额
            let total_amount = Number(item.total_amount).toFixed(2);
            //应支付金额
            let c_amount = Number(item.c_amount);
            //已支付金额
            let p_amount = Number(item.p_amount);
            //应付现金券
            let d_amount = Number(item.d_amount);
            //已付现金券
            let dp_amount = Number(item.dp_amount);
            //应支付金额
            let need_pay = c_amount - p_amount - d_amount;
            //优惠金额= 订单总金额 - 应支付金额
            let discount_amount = total_amount - c_amount;
            if (discount_amount > 0) {
              discount_amount = discount_amount.toFixed(2);
              discount_amount = utils.formatAmount(discount_amount);
            } else {
              //无优惠
              discount_amount = null
            }
            item.discount_amount = discount_amount;
            //判断订单是否支付，显示实付款、应付款：已支付p_amount >= 应付订单金额c_amount
            let isPaid = false; //默认未支付
            if ((p_amount + dp_amount) >= c_amount) {
              isPaid = true //已支付，显示实付款p_amount
            } else {
              isPaid = false //未支付，显示应付款c_amount-d_amount

              need_pay = need_pay > 0 ? utils.formatAmount(need_pay.toFixed(2)) : '0.00';
              console.log("need_pay:", need_pay)
              item.c_amount = need_pay
            }
            item.isPaid = isPaid;

            item.d_amount = d_amount > 0 ? utils.formatAmount(d_amount.toFixed(2)) : null;
            item.dp_amount = dp_amount > 0 ? utils.formatAmount(dp_amount.toFixed(2)) : null;
            item.countdown_timestamp = this.calcPayCountdown(item.create_time)

          }
          // 手机号加星
          if (item.a_jxsdh) {
            item.a_jxsdh_str = item.a_jxsdh.replace(reg, '$1****$2');
          }
          if (item.a_psydh) {
            item.a_psydh_str = item.a_psydh.replace(reg, '$1****$2');
          }
        })
        //更新数据
        this.setData({
          ['feedList[' + (pageNum - 1) + ']']: data.list,
          pageNext: pageNext
        })
        /**成功回调 */
        endSuccess(data.list.length, pageNum)
      }).catch(err => {
        /**失败回调 */
        endError()
      })

    },
    myevent() {
      //更新
      this.triggerEvent("myevent");
    },
    //商城订单-点击支付:跳转至结算页
    storePay(event) {
      console.log(event.currentTarget.dataset.item);
      //需要传参：商品总价total_amount,现金券：d_amount,应付款c_amount
      let {
        id,
        total_amount,
        d_amount,
        c_amount,
        discount_amount,
        avg_price,
        pay_type,
        b_sid
      } = event.currentTarget.dataset.item;
      let orderInfo = {
        id,
        total_amount,
        d_amount,
        c_amount,
        discount_amount,
        avg_price,
        b_sid
      };
      //pay_type:0先付后货 1货到付款 2月结订单
      //pay_start:默认0,支付结果页不请求接口，HDFK，货到付款，XFHK先付后货+现金券全额支付
      if (pay_type == 0) {
        orderInfo.pay_start = 'XFHH';
      }
      if (pay_type == 1) {
        orderInfo.pay_start = 'HDFK';
      }
      console.log("订单信息：", orderInfo);

      wx.navigateTo({
        url: '/pages/storeOrder/myorder/pay/index?orderInfo=' + encodeURIComponent(JSON.stringify(orderInfo)),
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
        item
      } = e.currentTarget.dataset;
      //取缓存的经纬度
      location = utils.getCache('u_location');
      //有经纬度，去处理业务
      if (location) {
        taped = false;
        wx.hideLoading();
        console.log('缓存的经纬度：', location);
        // 2023年9月15日 定位信息 跟随item
        item.locationInfo = location;
        return this.hxCheck(item);
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
            // 2023年9月15日 定位信息 跟随item
            item.locationInfo = location;
            return that.hxCheck(item)
          }
          //获取的经纬度异常时，判断授权情况
          that.checkAuth();
        },
        fail: function (err) {
          console.log("定位获取失败：", err);

          taped = false;
          wx.hideLoading();
          //定位获取失败，排除取消的情况
          if (err.errMsg != "getLocation:fail auth deny") {
            log.info("定位失败：", err);
          }
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
    //拨打电话
    callUp: function (e) {
      let phone = e.currentTarget.dataset.phone;
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    },
    //取消订单弹窗:需要判断是从全部列表还是待受理列表点击，取对应list数据
    cancel: function (e) {
      let {
        item
      } = e.currentTarget.dataset;
      item.mobile_str = item.a_psydh_str || item.a_jxsdh_str;
      // this.selectComponent("#fhPopup").showCancelPop(item);
      this.triggerEvent('fhTrigger', {
        type: 'showCancelPop',
        item
      })
    },
    //提醒商家返货
    remindMerchant(event) {
      let {
        item
      } = event.currentTarget.dataset;
      let {
        check_no,
      } = item;

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
            cp_title,
            count_dh,
            check_no,
            type: exc_type,
            sku_info,
          } = item;
          // this.selectComponent("#fhPopup").showRemindPop({
          //   cp_title,
          //   count_dh,
          //   check_no
          // });
          this.triggerEvent('fhTrigger', {
            type: 'showRemindPop',
            item: {
              cp_title,
              count_dh,
              check_no,
              exc_type,
              sku_info,
            }
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
              if (res.code == 1) {
                wx.showModal({
                  cancelColor: '温馨提示',
                  content: res.msg,
                  showCancel: false,
                  success: () => {
                    //更新
                    that.triggerEvent("myevent");
                  }
                })
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
    //核销确认弹窗
    hxCheck: function (item) {
      log.addFilterMsg("hxCheck");
      let {
        cp_title,
        count_dh,
        count_sj,
        check_no,
        locationInfo='', // 定位信息
        sku_info, // group 产品分组 品牌名
        a_jxs,//配送商信息
        id,//id 必须要传，判断选中的唯一值
      } = item;
      // 新版本批量核销弹窗
      this.triggerEvent('batchTrigger', {
        type: "showSelectPop",
        item: {
          cp_title,
          count_dh,
          count_sj,
          check_no,
          locationInfo, // 定位信息
          sku_info, // group 产品分组 品牌名
          a_jxs,//配送商信息
          id,//id 必须要传，判断选中的唯一值
        }
      })
      return
      this.triggerEvent('fhTrigger', {
        type: "showCheckPop",
        item: {
          cp_title,
          count_dh,
          count_sj,
          check_no,
          location
        }
      })
    },



    //商城订单 跳转详情
    storeOrderDetail: function (event) {
      let {
        oid
      } = event.currentTarget.dataset;
      if (!oid) return wx.showModal({
        title: '温馨提示',
        content: '订单id不存在',
        showCancel: false
      })
      wx.navigateTo({
        url: '/pages/storeOrder/myorder/orderDetail/index?oid=' + oid,
      })
    },
    //返货订单 跳转详情
    fhOrderDetail: function (event) {
      let {
        order_no,
        id
      } = event.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/storeOrder/myorder/fhDetail/index?order_no=${order_no}&order_id=${id}`,
      })
    },
    //商城订单，先付后货，拒绝
    storeOrderRefuse: function (event) {
      let {
        item
      } = event.currentTarget.dataset;
      this.triggerEvent('storeOrderTrigger', {
        type: 'rejectOrdersShow',
        item
      })
      console.log("拒绝 item:", item);
    },
    // 筛选列表
    filterList(params) {
      console.log("filterList:", params);
      _params = params
      this.reset();
    },
    //商城订单：确认
    storeOrderConfirm: function (event) {
      let {
        item
      } = event.currentTarget.dataset;
      this.triggerEvent('storeOrderTrigger', {
        type: 'acceptOrdersShow',
        item
      })
      console.log("确认订单 item:", item);
    },
    //商城订单：催接单
    storeOrderPress: function (event) {
      let {
        item,
        type
      } = event.currentTarget.dataset;
      press({
        oid: item.id,
        type
      }).then(res => {
        let {
          msg
        } = res;
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2500
        })
      }).catch(err => {
        wx.showModal({
          title: '温馨提示',
          content: JSON.stringify(err),
          showCancel: false
        })
      })
    },
    //商城订单 货到付款：确认收货
    storeOrderConfirmReceipt(event) {
      let {
        oid
      } = event.currentTarget.dataset;
      console.log("订单id:", oid);
      wx.navigateTo({
        url: `/pages/storeOrder/myorder/confirmReceipt/index?oid=${oid}`,
      })
    },
    //商城订单：代下单确认（店长）
    storeOrderdxdConfirm(event) {
      let {
        item
      } = event.currentTarget.dataset;
      this.triggerEvent('storeOrderTrigger', {
        type: 'dxdConfirmShow',
        item
      })
    },
    //catchTapEmpty 空事件
    catchTapEmpty() {
      return
    },
    //订单倒计时24小时：create_time + 1天 - 当前时间
    calcPayCountdown(create_time) {
      let time_start = new Date(create_time.replace(new RegExp(/-/gm), '/'));
      time_start = time_start.setDate(time_start.getDate() + 1);
      let time_now = Date.now();
      let countdown_timestamp = time_start - time_now;
      return countdown_timestamp > 0 ? countdown_timestamp : 0;
    }
  },

})