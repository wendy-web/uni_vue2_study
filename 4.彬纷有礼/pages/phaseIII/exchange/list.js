// pages/phaseIII//exchange/list.js
const utils = require("../../../utils/util");
let reachBottom = '';
let app = getApp();
let COS = app.globalData.COS_URL;
let requesting = false;
let next = 1;
const Api = require("../../../utils/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remindPop: false, //返货提醒弹窗
    cancelPop: false, //取消返货确认弹窗
    successPop: false, //取消成功弹窗
    remindBtn: [{
      text: "确定",
      extClass: "iknow"

    }], //返货提醒弹窗按钮
    applyBtn: [{
      text: "重新申请兑换",
      extClass: "iknow"
    }],
    list: [], //待受理列表
    noMore: false, //没有更多数据
    cancelMsg: '', //取消返回信息
    orderMsg: '', //取消返货的订单信息
    successImg: COS + "/public/img/phaseIII/202104/success0406.png",
    cancelOrderImg: COS + "/public/img/phaseIII/202104/cancelOrder.png",
    remindImg: COS + "/public/img/phaseIII/202104/remind.png",
    hnTitle: app.globalData.hnTitle,

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
    if (!this.data.noMore && this.data.list.length == 0) {
      let param = {
        status: 0
      }
      wx.showLoading({
        title: '正在加载',
        mask: true
      })
      this.getOrderList(param, this.dataProcess);
    }

  },
  /**
   * 待受理 订单 '/api/card/getpacklog'
   * status 0 默认未申请核销 1已受理 2已核销 3已撤回
   * d_uid 店员UID
   * next 下一页默认1
   * getOrderlist
   */
  getOrderList: function (params, callback) {
    if (requesting) return;
    requesting = true;
    Api.postBase({
      url: '/api/card/getpacklog',
      params
    }).then(res => callback(res));
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
  //提醒商家返货
  remindMerchant: function (e) {
    let check_no = e.currentTarget.dataset.check_no;
    let index = e.currentTarget.dataset.index;
    let list = this.data.list;

    console.log("提醒单号：", check_no);
    wx.showLoading({
      title: '正在请求',
    })
    var params = {
      check_no: check_no
    }
    Api.postBase({
      url: '/api/card/remind',
      params
    }).then(res => {
      const {
        code,
        msg
      } = res;
      if (code == 1) {
        //请求返回，关闭取消返货申请弹窗
        this.setData({
          remindMsg: list[index],
          remindPop: true,
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
  close: function () {
    this.setData({
      cancelPop: false
    });
  },
  /**
   * 取消申请 
   * @param {
   *  index，待申请单list数组索引
   * }  
   */
  cancel: function (e) {
    let index = e.currentTarget.dataset.index;
    let list = this.data.list;
    this.setData({
      cancelPop: true,
      orderMsg: list[index]
    });
  },
  //取消返货申请:check_no
  cancelOrder: function (e) {
    var check_no = e.currentTarget.dataset.check_no;
    console.log("取消单号：", check_no);
    wx.showLoading({
      title: '正在请求',
    })
    var params = {
      check_no: check_no
    }
    Api.postBase({
      url: '/api/card/cancelpack',
      params
    }).then(res => {
      const {
        code,
        data,
        msg
      } = res;
      if (code == 1) {
        let param = {
          status: 0
        }
        this.getOrderList(param, this.dataRefresh);
        //请求返回，关闭取消返货申请弹窗
        this.setData({
          cancelPop: false,
          cancelMsg: data,
          successPop: true,
        });
        return
      }
      wx.showModal({
        title: '温馨提示',
        content: msg,
        showCancel: false
      })
      this.setData({
        cancelPop: false
      });
    });
  },
  // mp-dialog弹窗按钮点击监听
  tapButton: function (e) {
    let index = e.detail.index;
    console.log("tapButton  index:", index);
    // index 0 :知道，确定
    this.setData({
      remindPop: false
    });
    if (this.data.successPop) {
      wx.redirectTo({
        url: '/pages/phaseIII/voucher/index',
      })

    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      remindPop: false, //返货提醒弹窗
      cancelPop: false, //取消返货确认弹窗
      successPop: false, //取消成功弹窗
    });
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
      status: 0
    }
    this.getOrderList(param, this.dataRefresh);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom~");
    let param = {
      next: next,
      status: 0
    }
    if (this.data.noMore || reachBottom) return;
    reachBottom = true;
    wx.showLoading({
      title: '正在加载',
    })
    this.getOrderList(param, this.dataProcess);
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})