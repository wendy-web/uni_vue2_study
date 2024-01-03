// pages/zhongduan/geren/notice/subscribe.js
const http = require("../../../../utils/api");
let _request = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    next: 1
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
    this.getList(1);
  },
  getList: function (next) {
    let list = this.data.list;
    let newList = '';
    if (_request) return;
    _request = true;
    let limit = next == 1 ? 20 : 10;
    http.post('/api/system/errorapi', {
      next: next,
      limit: limit
    }).then(res => {
      console.log("/api/system/errorapi:", res);
      _request = false;
      if (Number(res.code) == 1) {
        let data = res.data.list;
        data.map((value, index, arr) => {
          arr[index]['open'] = false;
          arr[index]['id'] = 'item_' + index;
          return arr
        });
        if (list) {
          newList = [...list, ...data];
        } else {
          newList = data;
        }
        this.setData({
          list: newList,
          next: res.data.next
        })
      } else {
        this.setData({
          noMore: true
        })
      }
    }).catch(err => {
      _request = false;
      if (err && err.code == '-1') {
        http.login().then(res => {
          wx.reLaunch({
            url: '/pages/zhongduan/geren/notice/subscribe',
          })
        })
      }
    });
  },
  kindToggle(e) {
    const id = e.currentTarget.id
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list
    })
    wx.reportAnalytics('click_view_programmatically', {})
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
    let next = this.data.next;
    if (this.data.noMore) return;
    this.getList(next);
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})