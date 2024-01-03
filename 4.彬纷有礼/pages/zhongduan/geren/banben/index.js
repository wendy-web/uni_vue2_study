// pages/zhongduan/geren/guanyu/faq.js
const utils = require("../../../../utils/util");
const app = getApp();
const rich = require('./rich');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageReady: false,
    logoimg: '', //logo-bf
    yinsiPop: false,
    // yinsi:yinsi,
    nodes: rich,
    openTest: false,
    blockAd:false,
    isReadPrivacy:false,//未阅读隐私协议
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var COS_URL = app.globalData.COS_URL;
    this.setData({
      pageReady: true,
      logoimg: COS_URL + '/public/img/logo-bfyl.png'
    });

  },
  init: function () {
    console.log(11111);
    if (this._inited) {
      console.log(2222222);
      return
    }
    wx.createSelectorQuery().selectAll('#c1').node(res => {
      const canvas = res[0].node
      const context = canvas.getContext('2d')

      canvas.width = 500
      canvas.height = 500



      // this._inited = true
    }).exec()
  },
  play: function () {
    console.log("播放·····");
    this.ani.play()
  },
  pause: function () {
    console.log("暂停·····");
    console.log(this.ani);
    this.ani.pause()
  },
  close: function () {

    this.setData({
      iosDialog1: false,
      iosDialog2: false,
      androidDialog1: false,
      androidDialog2: false,
      openTest: false,
    })
  },
  closePop: function () {
    this.pause();
    this.setData({
      iosDialog1: false,
      iosDialog2: false,
      androidDialog1: false,
      androidDialog2: false,
      openTest: false,
    })
  },
  openTest: function () {
    this.setData({
      openTest: true
    });
    this.init();
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
    let isReadPrivacy = wx.getStorageSync('isReadPrivacy') || 0;
    isReadPrivacy = Boolean(isReadPrivacy==1)
    this.setData({
      blockAd:utils.blockAd(),
      isReadPrivacy
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
  check: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log("id:", id);
    //id=1 版本更新 2 隐私协议  3 开发者
    switch (id) {
      case '1':
        wx.showToast({
          title: '已经是最新版本啦~',
          icon: 'none',
          duration: 2000
        })
        break;
      case '2':
        // this.setData({
        //   yinsiPop: true
        // });
        let urlA = 'https://txc.y1b.cn/index/index/ysxy.html';
        urlA = encodeURIComponent(urlA);
        wx.navigateTo({
          url: '/pages/tabBar/shouye/webview/index?link=' + urlA,
          success:()=>{
            wx.setStorageSync('isReadPrivacy', 1);
          }
        })
        break;
      case '3':
        wx.showToast({
          title: 'TXC BIG DATA-DEPTH RESEARCH',
          icon: 'none',
          duration: 2000
        })
        break;
      case '4':
        let urlB = 'https://txc.y1b.cn/index/index/bfylfl.html';
        urlB = encodeURIComponent(urlB);
        wx.navigateTo({
          url: '/pages/tabBar/shouye/webview/index?link=' + urlB,
        })
        break;

      default:
        break;
    }
  },
  close: function () {
    this.setData({
      yinsiPop: false
    });
  },


})