// pages/couponActivity/prizeRecord.js
let app = getApp();
let COS_URL = app.globalData.COS_URL;
const utils = require('../../../utils/util');
const log = require('../../../utils/log');
import shopActUtils from '../../../api/shopActivity/utils';
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime.js';

let statusName = {
  0: "进行中",
  1: "已领取",
  2: "未中奖",
  3: "未领取",
  4: "逾期未领",
}
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
    bg_record_title: `${COS_URL}/public/img/bfyl/2023/07/bg_record_title.png`,
    img_record_bottom: `${COS_URL}/public/img/bfyl/2023/07/img_record_bottom.png`,
    list: [], //奖励记录列表
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

    //获取奖励记录
    // this.getList();
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
      } = await shopActUtils.act5_getinfo();
      wx.stopPullDownRefresh();
      console.log("shopActInfo:", actInfo)
      log.addFilterMsg('shopActInfo');
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
  // 获取奖励记录
  getList() {
    utils.actCoupon_history().then(res => {
      console.log("获取奖励记录信息：", res);
      wx.stopPullDownRefresh();
      if (+res.code == 1) {
        let data = JSON.parse(JSON.stringify(res.data));
        // 奖励箱数判断：根据中奖状态判断，默认rev_num；

        data.forEach(item => {
          console.log("item:", item);
          item = this.checkStatus(item);
        })
        this.setData({
          list: data,
          noMore: true
        })
      } else {
        this.setData({
          list: [],
          noMore: true
        })
      }
    }).catch(err => {
      log.addFilterMsg("actCouponFail");
      log.error("奖励记录获取失败：", JSON.stringify(err));
    })
  },
  /**
   * 状态判断
   * status:0 进行中
   * status:1 已领取
   * status:2 未中奖
   * status:3 未领取
   * status:4 逾期未领取
   */
  checkStatus(item) {
    // 进行中，未中奖都是无奖券
    if (item.status == 0 || item.status == 2) {
      item.prize_num = null;
    }
    // 已领取就按照实际获取奖券为准
    if (item.status == 1) {
      item.prize_num = item.rev_num;
    }
    //未领取，逾期未领取，要根据开箱是否达标来计算奖券数
    if (item.status == 3 || item.status == 4) {
      // 超出部分按照最大
      if (item.s_num >= item.kpi[0]) {
        item.prize_num = item.s_num;
      }
      if (item.s_num > item.kpi[1]) {
        item.prize_num = item.kpi[1];
      }

    }
    item.status_name = statusName[item.status];
    return item
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
    //获取奖励记录
    //  this.getList(); 
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
    })
  },
})