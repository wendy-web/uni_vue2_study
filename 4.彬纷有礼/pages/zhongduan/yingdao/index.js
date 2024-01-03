// index/test.js
const COS_URL = getApp().globalData.COS_URL;
const auth = require('../../../utils/auth');
const http = require('../../../utils/api');
const app = getApp();
let cosAddress = auth.getCosAddress();
const utils = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // headImg: COS_URL + "/public/img/phaseIII/dhguide082702.png",
    // bodyImg: COS_URL + "/public/img/phaseIII/dhguide082703.png",
    // footImg: COS_URL + "/public/img/phaseIII/dhguide082704.png",
    // footImg:COS_URL+"/public/img/phaseIII/dhguide08192.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  watchVideo: function () {
    let videoUrl = '';
    if (typeof cosAddress === "object") {
      videoUrl = cosAddress.A3.value[0].src;
    }
    if (!videoUrl) {
      wx.showToast({
        title: '敬请期待~',
        icon: "none",
        duration: 3000
      })
      return
    }
    wx.navigateTo({
      url: '/pages/zhongduan/yingdao/video?url=' + videoUrl,
    })
  },
  watchPoster: function () {
    var url = '';
    var title = '';
    console.log("watchPoster cosAddress:", cosAddress, '\n typeof :', typeof cosAddress);
    if (typeof cosAddress === "object") {
      url = cosAddress.A3.value[0].img;
      title = cosAddress.A3.value[0].title;
    }
    if (!url) {
      wx.showToast({
        title: '敬请期待~',
        icon: "none",
        duration: 3000
      })
      return
    }
    let urls = new Array();
    urls.push(url);
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
    return;

  },
  watchPosters: function () {
    var url = '';
    if (typeof cosAddress === "object") {
      url = cosAddress.A3.value[0].img2;
    }
    if (!url) {
      wx.showToast({
        title: '敬请期待~',
        icon: "none",
        duration: 3000
      })
      return
    } else {
      let urls = new Array();
      urls.push(url);
      wx.previewImage({
        // current: url, // 当前显示图片的http链接
        // urls: urls // 需要预览的图片http链接列表
        urls: [url] // 需要预览的图片http链接列表
      })
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    if (!cosAddress) {
      cosAddress = await utils.getAd().catch(err=>{});
    }
    let merchants = cosAddress.A3.value[0].img3;
    let customer = cosAddress.A3.value[0].img4;
    this.setData({
      merchants,
      customer
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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
  onShareAppMessage: function () {
    return {
      imageUrl: 'https://file.y1b.cn/public/img/phaseIII/202104/bfyl_wechatShare.png',
    }
  }
})