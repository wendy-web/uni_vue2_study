// pages/storeOrder/goodsList/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
     this.setData({
      shopList:JSON.parse(decodeURIComponent(options.sku))
     })
  }

})