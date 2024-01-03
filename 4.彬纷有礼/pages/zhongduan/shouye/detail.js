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
    console.log("页面传参：", options);
    if (options.url && options.title) {
      this.setData({
        url: options.url
      });
      wx.setNavigationBarTitle({
        title: options.title
      })
     
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
  previewImg:function(){
    let url = this.data.url;
    let urls = new Array();
    urls.push(url);
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
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