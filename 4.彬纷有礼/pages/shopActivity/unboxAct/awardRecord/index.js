// pages/shopActivity/unboxAct/awardRecord/index.js

let app = getApp();
let COS_URL = app.globalData.COS_URL;
const utils = require('../../../../utils/util');
const log = require('../../../../utils/log');
let _request = false;
let statusName ={
  0:"进行中",
  1:"已领取",
  2:"未中奖",
  3:"未领取",
  4:"逾期未领",
}
let statusClass = {
  '未开始':'',
  '进行中':'act-ing',
  '已发放':'act-end',
  '未达标':'act-fail',
}
const shopActUtils = require("../../../../api/shopActivity/utils");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg_act_history: `${COS_URL}/public/img/bfyl/2023/07/unbox/bg_record.png`,
    bg_title_red: `${COS_URL}/public/img/bfyl/2023/07/unbox/bg_title_red.png`, //活动开箱进度标题背景
    icon_star_grey: `${COS_URL}/public/img/bfyl/2023/07/unbox/icon_star_grey.png`, //星星图标
    img_unbox_prize: `${COS_URL}/public/img/bfyl/2023/07/unbox/img_unbox_prize.png`, //底部开箱图片
    list: [], //奖励记录列表
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
    //获取奖励记录
    // this.getList();
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  //2023年8月1日 深圳开箱活动信息
  this.getUnboxInfo();
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
  async getUnboxInfo(){
    let result = await shopActUtils.act5_getinfo_sz();
    let {actInfo,msg} = result;
    console.log("开箱活动信息：",actInfo);
    wx.stopPullDownRefresh();
    //不同类型开箱活动区间不一样：基数，区间
    if(actInfo){
      let list = [];
      list.push(actInfo);
      this.setData({
        list,
        statusClass,
        noMore: true
      })
      return
    }
    this.setData({
      list: [],
      noMore: true
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
      if(item.s_num>=item.kpi[0]){
        item.prize_num = item.s_num; 
      }
      if(item.s_num > item.kpi[1]){
        item.prize_num = item.kpi[1];  
      }
    
    }
    item.status_name = statusName[item.status];
    return item
  },
  //2022年8月10日 活动信息状态判断
  init_state_name(actInfo){
    let status_name = {
      name:'未达标',
      class:'unbox-state-fail'
    }
    if(actInfo.rev_num){
      status_name.name="已发放";
      status_name.class="unbox-state-success";

      return status_name
    }
    if(actInfo.act_state.act_ing){
      status_name.name="进行中";
      status_name.class="unbox-state-ing";
      return status_name
    }
    if(actInfo.act_state.act_yure){
      status_name.name="未开始";
      status_name.class="unbox-state-yure";
      return status_name
    }
    return status_name

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
   this.getUnboxInfo();
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