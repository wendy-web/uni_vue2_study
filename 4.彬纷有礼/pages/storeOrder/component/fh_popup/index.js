// pages/storeOrder/component/fh_cancelPop/index.js
let app = getApp();
const COS = app.globalData.COS_URL;
const utils = require("../../../../utils/util");
import {
  cancelpack,
  checkpage
} from '../../api/fhOrder';
// let log = require('../../../../utils/log');
let location = ''; //定位信息
let currentTime = ''; //当前核销时间

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // cancelPop: { //取消弹窗
    //   type: Boolean,
    //   value: false,
    // },
    // successPop: { // 取消成功/失败弹窗
    //   type: Boolean,
    //   value: false,
    // },
    // remindPop: { //提醒配送商弹窗
    //   type: Boolean,
    //   value: false,
    // },
    // checkPop: { //核销确认弹窗
    //   type: Boolean,
    //   value: false,
    // },
    // hxSuccessPop: { //核销成功弹窗
    //   type: Boolean,
    //   value: false,
    // },
    // orderMsg:{
    //   type:Object,
    //   value:null
    // },

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    cancelPop: false, //取消弹窗
    successPop: false, //提醒成功弹窗
    remindPop: false, //提醒配送商弹窗
    checkPop: false, //核销确认弹窗
    hxSuccessPop: false, //核销成功弹窗
    orderMsg: null, //订单信息
    cancelOrderImg: COS + "/public/img/phaseIII/202104/cancelOrder.png",
    successImg: COS + "/public/img/phaseIII/202104/success0406.png",
    remindImg: COS + "/public/img/phaseIII/202104/remind.png",
    hxCheckImg: COS + "/public/img/phaseIII/202104/hxCheck.png", //核销确认弹窗图
    cancelMsg: null, //取消订单结果
  },
  //数据监听
  observers: {
    "orderMsg": function (orderMsg) {
      console.log("observers:", orderMsg);
    },
    "location": function (location) {
      console.log("observers location", location);
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showPop(data) {

    },
    //显示取消弹窗
    showCancelPop(data) {
      this.setData({
        orderMsg: data,
        cancelPop: true,
      })
    },
    //显示提醒弹窗
    showRemindPop(data) {
      this.setData({
        remindMsg: data,
        remindPop: true,
      })
    },
    //显示核销弹窗
    showCheckPop(data) {
      if (data.location) {
        location = data.location;
      }
      this.setData({
        checkMsg: data,
        checkPop: true,
      })
    },
    //关闭所有弹窗
    onClose() {
      this.setData({
        show: false,
        cancelPop: false,
        successPop: false,
        remindPop: false,
        checkPop: false,
        hxSuccessPop: false,

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
                    //立即请求可能会导致数据异常：（同一秒）
                    //父组件需要刷新统计接口····getCountCard
                    //刷新当前列表:先重置页面参数1
                    params.next = 1;
                    that.loadData(true)
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
    //点击取消核销
    tapCancelHX: function (e) {
      let check_no = e.currentTarget.dataset.num;
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
        success: (res) => {
          if (res.confirm) {
            this.setData({
              checkPop: false
            })
            this.checkPage(post_param);
          }
        }
      })
    },
    //请求核销
    checkPage: function (post_param) {
      post_param.latitude = location.latitude;
      post_param.longitude = location.longitude;
      let items = this.data.checkMsg;
      console.log("param参数:", post_param);
      checkpage(post_param).then(res => {
        currentTime = utils.formatTime(new Date);
        this.setData({
          checkPop: false
        });
        let {
          code,
          msg
        } = res;
        if (code == 1) {
          //确认核销
          if (post_param.state == 1) {
            this.setData({
              hxSuccessPop: true,
              successMsg: items,
              currentTime
            })
          }
          //更新数据
          this.triggerEvent('myevent', res);
          return
        }

        wx.showModal({
          title: '温馨提示',
          content: msg,
          showCancel: false
        })

      })

    },
    //取消订单
    cancelOrder: function (e) {
      let {
        check_no
      } = e.currentTarget.dataset;
      console.log("check_no:", check_no);
      cancelpack({
        check_no
      }).then(res => {
        this.onClose();
        let {
          code,
          msg
        } = res;
        if (code == 1) {
          this.setData({
            cancelPop:false,
            cancelMsg:res,
            successPop:true
          })
          //刷新数据
          this.triggerEvent('myevent', res);
          
          return
        }
        wx.showModal({
          title: '温馨提示',
          content: msg,
          showCancel: false
        })
      });


    },
    //重新申请
    reapply: function (e) {
      console.log(this.data)
      let orderMsg = this.data.orderMsg;
      let activeTab = 0;
      // type:1红牛、2战马、3惠让、4活动
      switch (+orderMsg.type) {
        case 1:
        case 2:
          activeTab=0;
          this.openVoucherPage(activeTab)
          break;
        case 3:
          activeTab=1;
          this.openVoucherPage(activeTab)
          break;
        case 4:
          activeTab=2;
          this.openVoucherPage(activeTab)
          break;
        default:
          this.openVoucherPage(activeTab)
          break;
      }
     
    },
    // 跳转至 卡包页面
    openVoucherPage(activeTab=0){
      this.setData({
        successPop: false
      })
      wx.redirectTo({
        url: '/pages/phaseIII/voucher/index?activeTab='+activeTab,
      })
    }
  }
})