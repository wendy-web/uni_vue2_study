// pages/zhongduan/geren/guanyu/faq.js
//引入图片预加载组件
const app = getApp();
const COS_URL = app.globalData.COS_URL;
// const serverTime = require("../../../../utils/isServiceTime");
const serverTime = require("../../static/isServiceTime");
const http = require("../../../../utils/api");
const utils = require("../../../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageReady: 1,
    kefu: COS_URL + '/public/img/Tian/kefu0329.png',
    llimg: COS_URL + '/images/ll.png',
    czimg: COS_URL + '/images/chenz.png',
    szimg: COS_URL + '/images/sz.png',
    sjimg: COS_URL + '/images/sj.png',
    lmimg: COS_URL + '/images/lm.png',
    mhtimg: COS_URL + '/images/mht.png',
    xjimg: COS_URL + '/images/xj.png',
    whgimg: COS_URL + '/images/whg.png',
    qzimg: COS_URL + '/images/qz.png',
    hlgimg: COS_URL + '/images/hlg.png',
    xgimg: COS_URL + '/images/xg.png',
    pgimg: COS_URL + '/images/pg.png',
    hotline: '../../../../assets/emoji/hotline.png',
    defaultImg:  COS_URL + '/public/img/bfyl/assets/store/dydf.png',
    list: '',
    dialogShow: false,
    buttons: [{
      text: '取消'
    }, {
      text: '前往留言'
    }],
    customerService: false,
    isOnline:"",//在线留言
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var llimg = COS_URL + '/images/ll.png',
      czimg = COS_URL + '/images/chenz.png',
      szimg = COS_URL + '/images/sz.png',
      sjimg = COS_URL + '/images/sj.png',
      lmimg = COS_URL + '/images/lm.png',
      mhtimg = COS_URL + '/images/mht.png',
      xjimg = COS_URL + '/images/xj.png',
      whgimg = COS_URL + '/images/whg.png',
      qzimg = COS_URL + '/images/qz.png',
      hlgimg = COS_URL + '/images/hlg.png',
      xgimg = COS_URL + '/images/xg.png',
      pgimg = COS_URL + '/images/pg.png';
    var list = [{
        tt: "榴莲",
        src: llimg
      }, {
        tt: "橙子",
        src: czimg
      }, {
        tt: "山竹",
        src: szimg
      }, {
        tt: "释迦",
        src: sjimg
      }, {
        tt: "蓝莓",
        src: lmimg
      },
      {
        tt: "猕猴桃",
        src: mhtimg
      }, {
        tt: "香蕉",
        src: xjimg
      }, {
        tt: "无花果",
        src: whgimg
      }, {
        tt: "青枣",
        src: qzimg
      }, {
        tt: "火龙果",
        src: hlgimg
      },
      {
        tt: "西瓜",
        src: xgimg
      }, {
        tt: "苹果",
        src: pgimg
      },
    ];
    list = list.map(item => {
      return {
        loaded: false,
        tt: item.tt,
        src: item.src
      }
    })
    this.setData({
      list: list
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let isOnline = serverTime.isServiceTime();
    if (isOnline) {
      console.log("isOnline:", isOnline)
      this.setData({
        isOnline: isOnline,
      })
    }
    let userInfo = wx.getStorageSync('userdata');
    let UID = wx.getStorageSync('UID');
    if(UID&&userInfo){
      this.setData({
        userInfo,
        UID
      })
    }else{
      http.login(true).then(res=>{
        utils.getUserInfoNew().then(data=>{
          this.setData({
            userInfo:data,
            UID:data.id
          })
        })
      })
    }
    let originalUserInfo = wx.getStorageSync('originalUserInfo');
    if (originalUserInfo) {
      originalUserInfo = JSON.parse(originalUserInfo);
      console.log("originalUserInfo:", originalUserInfo);
      this.setData({
        originalUserInfo: originalUserInfo
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onlineService(e) {
    if (this.data.isOnline) {

      this.setData({
        // dialogShow: true,
        customerService: true,
      })
    }
  },
  closeContactPop: function () {
    this.setData({
      customerService: false,
    })
  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})