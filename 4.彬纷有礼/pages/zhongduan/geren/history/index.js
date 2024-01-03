// pages/zhongduan/geren/notice/index.js
const utils = require("../../../../utils/util");
const Api = require("../../../../utils/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // pageReady: false,
    pageReady: true,
    msgList: '',
    next: '', //页码
    loadMore: false, //加载更多
    noMore: false, //没有更多
    loading: false, //记载中
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("页面参数：", options);
    // wx.showLoading({
    //   title: '正在加载',
    //   // mask: true
    // })
    if (options.type == 1) {
      var data = {
        type: 1,

      }
      wx.setNavigationBarTitle({
        title: "历史助力记录"
      })
      this.setData({
        type: options.type,

      });
      this.getHistory(data);
    } else {
      var data = {
        type: 0,

      }
      wx.setNavigationBarTitle({
        title: "历史余额记录"
      })
      this.setData({
        type: options.type
      });
      this.getHistory(data);
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
  //获取用户系统通知
  getHistory: function (data) {
    var that = this;
    this.setData({
      loading: true,
    })

    var msgList = this.data.msgList;
    Api.postBase({
      url: '/api/user/history',
      params: data
    }).then(res => {
      console.log("历史记录：", res);
      const { code, data } = res;
      if (code == 0 || data.list.length < data.limit) {
        that.setData({
          loading: false,
          noMore: true,
          pageReady: true
        });

      }
      if (data.list) {
        if (msgList) {
          msgList = msgList.concat(data.list)
        } else {
          msgList = data.list;
        }
        that.setData({
          msgList: msgList,
          next: data.next,
          loading: false,
          pageReady: true

        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

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
    if (!this.data.noMore) {
      var next = this.data.next;
      var type = this.data.type;
      var data = {
        type: type,
        next: next,
      }

      this.getHistory(data);
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },

})