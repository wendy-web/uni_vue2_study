// pages/zhongduan/geren/mendian/shopPriv.js
let app = getApp();
let COS = app.globalData.COS_URL;
const utils = require("../.../../../../../utils/util");
const http = require("../.../../../../../utils/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    boxBrownImg: COS + '/public/img/phaseIII/202104/box-brown.png',
    boxMaskImg: COS + '/public/img/phaseIII/202104/box-mask.png',
    boxBgImg: COS + '/public/img/phaseIII/202104/box-bg-line0.png',
    boxStarLeftImg: COS + '/public/img/phaseIII/202104/box-star-left.png',
    boxStarRightImg: COS + '/public/img/phaseIII/202104/box-star-right.png',
    boxLineImg: COS + '/public/img/phaseIII/202104/box-bg-line.png',
    paperCodeIcon: COS + '/public/img/phaseIII/202104/paperCode-icon.png',
    salemanIcon: COS + '/public/img/phaseIII/202104/saleman-icon.png',
    boxIcon: COS + '/public/img/phaseIII/202104/box-icon.png',
    vipIcon: COS + '/public/img/phaseIII/202104/vip-icon.png',
    icon_paper_code_grey: COS + '/public/img/phaseIII/20210828/icon_paper_code_grey.png',
    icon_saleman_grey: COS + '/public/img/phaseIII/20210828/icon_saleman_grey.png',
    icon_box_grey: COS + '/public/img/phaseIII/20210828/icon_box_grey.png',
    icon_vip_grey: COS + '/public/img/phaseIII/20210828/icon_vip_grey.png',
    dydf:  COS + '/public/img/bfyl/assets/store/dydf.png',
    shopInfo: [], //店铺信息
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
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    utils.getShopInfo().then(data => {
      console.log("店铺信息：", data)
      this.setData({
        shopInfo: data
      })
      this.getSaleman();
    }).catch(err => {
      this.setData({
        shopInfo: []
      })
    })
  },
  getSaleman: function () {
    return http.post('/api/info/salesman', false).then(res => {
      if (res.code == 1) {
        this.setData({
          saleman: res.data
        })
      } else {
        this.setData({
          saleman: null
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})