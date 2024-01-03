const mta = require('../../../utils/mta_analysis.js');
// pages/zhongduan/shouye/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化MTA
    mta.Page.init();
    console.log("页面传参：", options);
    if (options.url && options.type) {
      this.setData({
        url: options.url
      });
      switch (options.type) {
        case '1':
          wx.setNavigationBarTitle({
            title: "红牛"
          })
          break;
        case '2':
          wx.setNavigationBarTitle({
            title: "战马饮料"
          })
          break;
        case '3':
          wx.setNavigationBarTitle({
            title: "VOSS水"
          })
          break;
        case '4':
          wx.setNavigationBarTitle({
            title: "果倍爽"
          })
          break;
        case '5':
          wx.setNavigationBarTitle({
            title: "维他可可"
          })
          break;

        default:
          break;
      }
      wx.showLoading({
        title: '正在加载',
      })

    }
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
  imgLoaded: function (e) {
    console.log("图片加载完成");
    wx.hideLoading({
      complete: (res) => {},
    })
  }

})