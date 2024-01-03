// pages/phaseIII/distributor/saleman.js
var utils = require('../../../utils/util.js');
var http = require('../../../utils/api.js');
let app = getApp();
let COS = app.globalData.COS_URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'业务员',
    salemanBgImg:COS+'/public/img/phaseIII/202104/saleman-bg.png',
    salemanBtnImg:COS+'/public/img/phaseIII/202104/saleman-btn.png',
    salemanCallImg:COS+'/public/img/phaseIII/202104/saleman-call.png',
    salemanNodataImg:COS+'/public/img/phaseIII/202104/saleman_nodata.png',
    info:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSaleman();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    utils.getNavbarData().then(res => {
      if (res) {
        this.setData({
          navBarSystem: res,
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getSaleman:function(){
    return http.post('/api/info/salesman',false).then(res=>{
      if(res.code==1){
        let {data} = res;
        var reg = /^(\d{3})\d*(\d{4})$/;
        data.phoneStr = data.mobile.replace(reg,'$1****$2')
        this.setData({
          info:data,
        })
      }else{
        this.setData({
          info:''
        })
      }
    })
  },
  contact:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.info.mobile,
    })
  },
  serviceContact:function(){
    wx.navigateTo({
      url: '/pages/zhongduan/geren/guanyu/index',
    })
  },
  onBeforeBack: function () {
    wx.navigateBack({
      delta: 0,
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})