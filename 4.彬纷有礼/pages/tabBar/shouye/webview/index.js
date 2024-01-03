// pages/tabBar/shouye/webview/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    link: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let {source} = options;
    // 区分app source来源，打开对应关注链接
    if(source){
      this.setData({
        link:`https://txc.y1b.cn/bfxn/open/qr.html?source=${source}`,
      })
      return
    }
    if (options.link) {

      this.setData({
        link: decodeURIComponent(options.link)
      });
    }
    if (options.title) {
      wx.setNavigationBarTitle({
        title: options.title
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let link = this.data.link;
    link = encodeURIComponent(link);
    return {
      //title: '分享标题',                 
      path: '/pages/tabBar/shouye/webview/index?link=' + link, // 路径，传递参数到指定页面。
      imageUrl: 'https://file.y1b.cn/public/img/phaseIII/202104/bfyl_wechatShare.png',
    }
  }
})