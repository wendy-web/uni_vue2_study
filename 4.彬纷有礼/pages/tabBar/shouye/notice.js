// pages/zongduan/geren/notice/index.js
const http = require("../../../utils/api");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 0, //选中的tab
    showSysItem: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.removeStorageSync('noticeUnread');
    // 计算高度
    // let query = this.createSelectorQuery().in(this);
    // query.select('#innerbox').boundingClientRect()
    // query.exec(res => {
    //   console.log("订单通知 bounding:", res)
    //   let item = res[0] || '';
    //   if (item && item.id == 'innerbox') {
    //     this.setData({
    //       innerBoxHeight: item.height
    //     })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  changeTab: function (e) {
    console.log(e)
    let activeTab = e.currentTarget.dataset.index;
    if (activeTab == 1) {
      this.setData({
        showSysItem: true
      })
    }
    this.setData({
      activeTab,
    });
  },

  swiperChange(event) {
    let {
      current,
      source
    } = event.detail;
    if (source != 'touch') return;
    if (current == 1) {
      this.setData({
        showSysItem: true
      })
    }
    this.setData({
      activeTab: current
    })
  }
})