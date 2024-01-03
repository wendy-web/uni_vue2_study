// pages/zongduan/geren/notice/index.js
const http = require("../../../../utils/http");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageReady: false,
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
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    this.getnotice();
    wx.removeStorageSync('noticeUnread')
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
  //获取用户系统通知
  getnotice: function (data) {
    this.setData({
      loading: true,
    })
    var msgList = this.data.msgList;
    http.postBase({url:'/api/user/getnotice',params:data}).then(res=>{
      console.log("系统通知：", res);
      let {code,data,msg} = res;
      if (code == 0 || data.list.length < data.limit) {
        this.setData({
          loading: false,
          noMore: true,
          pageReady: true
        });

      }
      if (data.list) {
        let list = data.list;
        list.forEach((val) => {
          if (val.type == 1) {
            let content = JSON.parse(val['content']);
            val.status = content.status;
            delete content.status
            val.content = content;
          }
        });

        if (msgList) {
          msgList = msgList.concat(list)
        } else {
          msgList = list;
        }
        console.log('msgList===>', msgList);
        this.setData({
          msgList: msgList,
          next: data.next,
          loading: false,
          pageReady: true

        })
      }
      wx.hideLoading({
        complete: (res) => {},
      })
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
    if (!this.data.noMore) {
      var next = this.data.next;
      var data = {
        next: next,
      }

      this.getnotice(data);
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },

})