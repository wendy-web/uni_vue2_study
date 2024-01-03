// pages/couponActivity/gzUnbox/rewardRecord/index.js
let app = getApp();
let COS_URL = app.globalData.COS_URL;
const http = require('../../../../utils/api');
const utils = require('../../../../utils/util');
import shopActUtils from '../../../../api/shopActivity/utils'


let statusClass = {
  '未报名':'',
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
    lanternImg:COS_URL+'/public/img/storeRank/20210121/lantern.png',
    refreshed: false, //下拉刷新未触发
    noMore: false,
    actInfo:null,//活动参与信息
    img_cos_url:`${COS_URL}/public/img/bfyl/2023/08/img`,//原有images静态文件移到cos上
    statusClass,
    file_url_gzunbox:`${COS_URL}/public/img/bfyl/2023/08/gzUnbox`,//广州开箱活动资源

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
    let that = this;
    utils.getNavbarData().then(res=>{
      if (res) {
        let headHeight = res.navBarHeight + res.statusBarHeight;
        res.headHeight = headHeight;
        this.setData({
          navBarSystem:res,
        })
      }
    });
    let systemInfo = app.globalData.systemInfo;
    if (systemInfo) {
      let screenHeight = systemInfo.windowHeight;
      this.setData({
        screenHeight: screenHeight,
      });
    }
    utils.getUserInfoNew().then(data=>{
      console.log("getUserInfoNew:",data)
      that.setData({
        userInfo:data
      })
     
    }).catch(err=>{
      console.log("getUserInfoNew err:",err)
    })
  },

  refresh: function () {
    this.initData()

  },

  onBeforeBack: function () {
    wx.navigateBack({
      delta: 0,
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.initData()
  },
  async initData() {
    try {
      // 获取活动信息
      let {
        actInfo
      } = await shopActUtils.gzUnboxActInfo();
      console.log("首页店铺排行榜参与信息：", actInfo)
      let userInfo = wx.getStorageSync('userdata')|| await utils.getUserInfoNew();
      
      if (actInfo) {
        this.setData({
          actInfo,
          refreshed:false
        })
        return
      }
      return this.setData({
        actInfo: null,
        refreshed:false

      })
    } catch (err) {
      console.error("initData err:", err);
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

  // }
})