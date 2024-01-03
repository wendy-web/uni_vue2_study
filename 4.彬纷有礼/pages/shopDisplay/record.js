// pages/shopDisplay/detail.js

let app = getApp();
let COS_URL = app.globalData.COS_URL;
const http = require('../../utils/api');
const utils = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    me_shop_record_bg: COS_URL + '/public/img/bfyl/202204/me_shop_record_bg.png',
    me_shop_record_board: COS_URL + '/public/img/bfyl/202204/me_shop_record_board.png',
    me_shop_record_head: COS_URL + '/public/img/bfyl/202204/me_shop_record_head.png',
    me_shop_record_icon: COS_URL + '/public/img/bfyl/202204/me_shop_record_icon.png',

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
    utils.getNavbarData().then(res => {
      if (res) {
        this.setData({
          navBarSystem: res,
        })
      }
    });
    this.getList();
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
   
  },
  getList:function(){
    http.post('/api/act3/signupList',false).then(res=>{
      if(+res.code == 1){
        let time_now = Date.now();
        let list = res.data.list;
        list.forEach(item=>{
          let e_time = item.e_time;
          let time_end = new Date(e_time.replace(new RegExp(/-/gm),'/')).getTime();
          item.act_End = time_now>time_end?true:false
        })
        console.log("lala list:",list);
        this.setData({
          list
        })
      }else{
        this.setData({
          list:[]
        })
        wx.showModal({
          title: '温馨提示',
          content:res.msg,
          showCancel:false
        })
      }
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
  back: function () {
    wx.navigateBack({
      delta: 0,
      fail: (err) => {
        console.log(err);
        wx.switchTab({
          url: '/pages/tabBar/shouye/index',
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})