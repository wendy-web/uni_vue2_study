// pages/couponActivity/dgExcZm/actRule/index.js
const utils = require("../../../../utils/util");
import {
  initPrizeConfig
} from '../../config/index';
import shopActUtils from '../../../../api/shopActivity/utils';

let app = getApp();
let COS_URL = app.globalData.COS_URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg_num: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAB4UExURUdwTP1fDv1fDvyAEf1fDv1eDv2dEv96D/2fEv+LEP+tAP2gE/2iEv6hE/1yD/2ZEv5eDf1dDfyCEP10EP1rD/1wD/1eDv2DEf1/EP1lD/1nD/2JEf15EP2QEf1iDv2VEv1gDv2cEv18EP2NEf2GEf1kDv2YEv2hE+EXOTwAAAATdFJOUwCR+kbhcJYscxsD2/i3/eesxV73FLY1AAABAklEQVQ4y7XVSRKCMBAF0BAQCEMxz4NEVO5/Q+2EknKDPwuzftXV/HRoFrA/H89N1mG4N03b3saxKIqqqsqy7Puue8wzdyzvsP51Wk/wstT8ctjrNJ3jut6190Qw1524EK4thRMMO2SFxDAnbJtgXxq04WKYZ4RjaZBGCGK6lUCC2Kb7Q7FQyYEfSF34GF4ynRxWOaXKMYa5Si4BK+c0RhuIaZw9FFNyOYjVGPkg1mMEYj1GIFaPOwKxrZIDMSVng5gHKgwM6weI4SXVyWGV9+SwyntyWGVKjm0gFgZtOMwgDRUGE9B17z9yaETnY6FEv/B7+XzWpXDDM/y11uBjtIyDFz/BoiVUR/98AAAAAElFTkSuQmCC',
    img_rule_title: `${COS_URL}/public/img/bfyl/2023/07/img_rule_title.png`,
    img_rule_can: `${COS_URL}/public/img/bfyl/2023/07/img_rule_can.png`,
    icon_arrow_up: `${COS_URL}/public/img/bfyl/2023/07/icon_arrow_up.png`,
    prizeConfig: null, //奖项配置，接口返回
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    utils.getNavbarData().then(res => {
      if (res) {
        this.setData({
          navBarSystem: res,
        })
      }
    });
    this.initOptions(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  async initOptions(options) {
    console.log("initOptions:", options)
    let {
      actInfo
    } = options;
    if (actInfo) {
      actInfo = JSON.parse(decodeURIComponent(actInfo))
     
      this.setData({
        actInfo,
        prizeConfig: initPrizeConfig(actInfo.calc)

      })
    } else {
      let {
        actInfo
      } = await shopActUtils.dgZmExcActInfo();
      this.setData({
        actInfo,
        prizeConfig: initPrizeConfig(actInfo.calc)
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  // 返回上一页
  back: function () {
    wx.navigateBack({
      delta: 0,
    })
  },
  // 返回顶部
  scrollTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    })
  },
})