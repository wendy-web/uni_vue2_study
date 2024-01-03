// pages/couponActivity/gzExc/rewardRecord/index.js
// pages/couponActivity/prizeRecord.js
let app = getApp();
let COS_URL = app.globalData.COS_URL;
const utils = require('../../../../utils/util');
const log = require('../../../../utils/log');
import shopActUtils from '../../../../api/shopActivity/utils';
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime.js';
let statusClass = {
  '未开始':'',
  '进行中':'act-ing',
  '已发放':'act-end',
  '未达标':'act-fail',
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg_act_banner: COS_URL + '/public/img/couponActivity/bg_act_banner.png',
    bg_act_history: COS_URL + '/public/img/couponActivity/20211117/act_page/bg_act_history_2.png',
    actInfo:null,//活动参与信息
    file_url_gzexc:`${COS_URL}/public/img/bfyl/2023/08/gzExc`,//广州兑奖活动资源

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    utils.getNavbarData().then(res => {
      if (res) {
        this.setData({
          navBarSystem: res,
        })
      }
    });
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
    this.getActInfo();
  },
  //获取活动券 开箱活动信息
  async getActInfo() {
    try {
      // 获取活动信息
      let {
        actInfo,
        msg
      } = await shopActUtils.gzExcActInfo();
      wx.stopPullDownRefresh();
      console.log("gzExcActInfo:", actInfo)
      log.addFilterMsg('gzExcActInfo');
      log.info(actInfo);
      if (!actInfo) {
        return wx.showModal({
          title: '温馨提示',
          content: msg,
          showCancel: false
        })
      };
      let userInfo = wx.getStorageSync('userdata') || await utils.getUserInfoNew();
      this.setData({
        actInfo,
        userInfo,
        statusClass
      })

    } catch (error) {
      console.log("actInfo catch:", error);
      wx.stopPullDownRefresh();
    }
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
    this.getActInfo();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  back: function () {
    wx.navigateBack({
      delta: 0,
      fail:()=>{
        wx.switchTab({
          url: '/pages/tabBar/shouye/index',
        })
      }
    })
  },
})