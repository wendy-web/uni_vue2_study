//index.js
//获取应用实例
const app = getApp();
const API_BASE_URL = app.globalData.API_BASE_URL;
var utils = require('../../../utils/util.js');
Page({
  data: {
    taroCompReady: 1,
    storeurl: "",
    loaded:true

  },

  onLoad: function (options) {
  },
  onShow: function () {
  
    var randomToken = utils.randomToken();
    var storeurl = app.globalData.storeUrl;
    console.log("跳转积分商城地址：",storeurl);
    if(storeurl){
      this.setData({
        storeurl:storeurl+'&random='+randomToken,
        loaded:false
      });
      app.globalData.storeUrl = '';
      return false;
    }
  
    console.log("随机token:", randomToken);
  
    var storeurl = API_BASE_URL + '/api/txjifen/txlogin?token=' + wx.getStorageSync('token')+'&way=1'+'&time='+randomToken;
    // var storeurl = API_BASE_URL + '/api/get/dblogin?token=' + wx.getStorageSync('token')+'&time='+randomToken;
    // var storeurl = API_BASE_URL + '/api/get/dblogin?token=' + wx.getStorageSync('token');
    console.log("duiba 积分商城：", storeurl)
    this.setData({
      storeurl: storeurl
    });
  },
  onTabItemTap:function(item) {
    console.log("积分商城点击事件······");
    wx.navigateToMiniProgram({
      appId: 'wx6aef93f01a5d8d05',
      success(res) {
        // 打开成功
        console.log("跳转小程序成功：",res);
      },
      fail(res){
        console.log("跳转小程序失败：",res);
      }
    })
    // if(this.data.loaded){

    //   var randomToken = utils.randomToken();
    //   var storeurl = API_BASE_URL + '/api/get/dblogin?token=' + wx.getStorageSync('token')+'&time='+randomToken;
    //   this.setData({
    //     storeurl: storeurl
    //   });
    // }
  },

})