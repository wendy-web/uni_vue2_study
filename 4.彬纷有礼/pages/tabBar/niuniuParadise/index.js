// pages/zhongduan/niuniuParadise.js

//获取应用实例
const app = getApp();
const API_BASE_URL = app.globalData.COS_URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headImage: API_BASE_URL + '/public/img/nnly/miniProgram/head.png',
    btnImage: API_BASE_URL + '/public/img/nnly/miniProgram/btn.png'
  },

  goNiuniuParadise() {
    wx.navigateToMiniProgram({
      // appId: 'wx9c60968a55b21fdb', //彬纷有礼测试版appid
      appId: 'wx6aef93f01a5d8d05', //牛牛乐园appid
      // envVersion: 'develop',
      success(res) {
        console.log(res, '跳转成功')
      }
    })
  },
  onTabItemTap() {
    wx.setNavigationBarTitle({
      title: "牛牛乐园"
    })
    // this.goNiuniuParadise()
  }

})