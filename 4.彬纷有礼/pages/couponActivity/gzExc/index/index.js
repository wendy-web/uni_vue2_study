// pages/couponActivity/gzExc/index/index.js

let app = getApp();
let COS_URL = app.globalData.COS_URL;
const utils = require('../../../../utils/util');
const log = require('../../../../utils/log');
import shopActUtils from '../../../../api/shopActivity/utils';
import {
  initPrizeConfig,
} from '../../config/index'

import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // bg_num: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAB4UExURUdwTP1fDv1fDvyAEf1fDv1eDv2dEv96D/2fEv+LEP+tAP2gE/2iEv6hE/1yD/2ZEv5eDf1dDfyCEP10EP1rD/1wD/1eDv2DEf1/EP1lD/1nD/2JEf15EP2QEf1iDv2VEv1gDv2cEv18EP2NEf2GEf1kDv2YEv2hE+EXOTwAAAATdFJOUwCR+kbhcJYscxsD2/i3/eesxV73FLY1AAABAklEQVQ4y7XVSRKCMBAF0BAQCEMxz4NEVO5/Q+2EknKDPwuzftXV/HRoFrA/H89N1mG4N03b3saxKIqqqsqy7Puue8wzdyzvsP51Wk/wstT8ctjrNJ3jut6190Qw1524EK4thRMMO2SFxDAnbJtgXxq04WKYZ4RjaZBGCGK6lUCC2Kb7Q7FQyYEfSF34GF4ynRxWOaXKMYa5Si4BK+c0RhuIaZw9FFNyOYjVGPkg1mMEYj1GIFaPOwKxrZIDMSVng5gHKgwM6weI4SXVyWGV9+SwyntyWGVKjm0gFgZtOMwgDRUGE9B17z9yaETnY6FEv/B7+XzWpXDDM/y11uBjtIyDFz/BoiVUR/98AAAAAElFTkSuQmCC',
    bg_num: '',
    icon_arrow_up: `${COS_URL}/public/img/bfyl/2023/07/icon_arrow_up.png`,
    //2022年8月9日
    unbox_banner_rule: COS_URL + '/public/img/bfyl/202208/unbox_banner_rule_base.png', //icon 活动说明
    banner: COS_URL + "/public/img/bfyl/202208/unbox_banner.png", //活动banner图
    bg_act_progress: COS_URL + '/public/img/bfyl/202208/bg_act_progress.png', //活动开箱进度背景图
    icon_act_rule: COS_URL + '/public/img/bfyl/202208/icon_act_rule.png', //icon 活动奖励规则
    icon_act_attention: COS_URL + '/public/img/bfyl/202208/icon_act_attention.png', //icon 活动注意事项
    icon_act_note: COS_URL + '/public/img/bfyl/202208/icon_act_note.png', //icon 活动免责
    userInfo: null, //用户信息
    rankInfo: null, //冲榜活动信息
    prizeConfig: null, //奖励配置
    // 2023年7月15日 东莞战马兑奖活动
    img_zm_exc: `${COS_URL}/public/img/bfyl/2023/07/img_zm_exc.png`, //战马兑奖标题
    img_title_exc: `${COS_URL}/public/img/bfyl/2023/07/img_title_exc.png`, //兑奖人数标题
    img_zm_can: `${COS_URL}/public/img/bfyl/2023/07/img_zm_can.png`, //战马banner
    img_platform: `${COS_URL}/public/img/bfyl/2023/07/img_platform_1.png`, //柜台
    bg_bro: `${COS_URL}/public/img/bfyl/2023/07/bg_bro.png`,
    icon_clock: `${COS_URL}/public/img/bfyl/2023/07/icon_clock.png`,
    bg_bar_orange: `${COS_URL}/public/img/bfyl/2023/07/bg_bar_orange.png`,
    countDownDay: [0], // 倒计时天数
    prizeConfig: null, //奖项配置
    actInfo: null, //东莞兑奖活动信息
    file_url_gzexc:`${COS_URL}/public/img/bfyl/2023/08/gzExc`,//广州兑奖活动资源

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  async onReady() {
    try {
      // 获取自定义导航栏、用户信息
      let navBarSystem = await utils.getNavbarData();
      if(navBarSystem){
        navBarSystem.headHeight = navBarSystem.navBarHeight+navBarSystem.statusBarHeight
      }
      this.setData({
        navBarSystem,
      })
    } catch (error) {
      console.log("onReady catch Error:", error);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.getActInfo();
  },
  //获取活动券 开箱活动信息
  async getActInfo() {
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    try {
      // 获取活动信息
      let {
        actInfo,
        msg
      } = await shopActUtils.gzExcActInfo();
      wx.hideLoading();
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
      // let prizeConfig = initPrizeConfig(actInfo.calc);
      // console.log("奖励配置：", prizeConfig);
      this.setData({
        actInfo,
        userInfo,
        // prizeConfig,
      })

    } catch (error) {
      console.log("actInfo catch:", error);
      wx.hideLoading();
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
  back: function () {
    wx.navigateBack({
      delta: 0,
      fail: (err) => {
        wx.switchTab({
          url: '/pages/tabBar/shouye/index',
        })
      }
    })
  },
  scrollTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    })
  },
  // 跳转扫一扫
  goScan: function () {
    let url = "/pages/zongduan/saoma/index";
    //获取当前页面栈
    let pages = getCurrentPages() || [];
    if (pages.length) {
      //查询排行榜页面索引
      pages.reverse();
      let pageIndex = pages.findIndex(item => item.route == 'pages/zongduan/saoma/index');
      console.log(pages, pageIndex);
      //找到索引的，返回至排行榜页（wx.navigateBack关闭当前页面）
      if (pageIndex > -1) {
        wx.navigateBack({
          delta: pageIndex,
        })
        return
      }
    }
    //页面栈里无指定页面再跳转（小程序中页面栈最多10层，超出会报错：fail webview count limit exceed）
    if (url) {
      wx.navigateTo({
        url: url,
      })
    }


  },
  //跳转卡券
  useCoupon() {
    let url = "/pages/phaseIII/voucher/index?activeTab=2";
    wx.navigateTo({
      url: url,
    })
  },
  // 打开页面（防止重复跳转返回）
  openPage(event) {
    const {
      url = ''
    } = event.currentTarget.dataset;
    if (!url) return;
    console.log(url);
    utils.navigateFrequentPage(url)
  },
  openActRule(event) {
    const {
      url = ''
    } = event.currentTarget.dataset;
    if (!url) return;
    const {
      actInfo
    } = this.data;
    const params = `?actInfo=${ encodeURIComponent(JSON.stringify(actInfo)) }`;
    console.log(url);
    utils.navigateFrequentPage(url, params);
  },
  openPageParam(event) {
    const {
      url = '',
        params = ''
    } = event.currentTarget.dataset;
    if (!url) return;
    console.log(url);
    utils.navigateFrequentPage(url, params)
  },
  testPop() {
    let {actInfo} = this.data;
    // this.selectComponent("#actCouponPop").showGzExcDailyPop(actInfo); // 每日进度弹窗
    // this.selectComponent("#actCouponPop").showGzExcWinPop(actInfo); // 活动中奖判断
    // this.selectComponent("#storeExchangePop").showActEndPop();
    // this.selectComponent("#storeExchangePop").showWinPop();
  },
  //排行榜活动：定时器结束触发
  rankTimerFinished(event) {
    console.log(event)
    let actInfo = this.data.actInfo;
    //活动未结束刷新倒计时
    if (!actInfo.act_state.act_end) {
      //根据时间重新计算 活动状态
      let {
        s_time,
        e_time
      } = actInfo
      let act_state = shopActUtils.init_act_state({
        s_time,
        e_time
      });
      actInfo.act_state = act_state;
      this.setData({
        actInfo
      })
    }
  },
  countChange(event) {
    let {
      detail
    } = event;
    // const day = detail.days.toString();
    // const day = String(detail.days);
    // const countDownDay = day.split("") || [0];
    // console.log(detail)
    let {days,hours,minutes,seconds} = detail;
    detail.days = days.toString().padStart(2, '0');
    detail.hours = hours.toString().padStart(2, '0');
    detail.minutes = minutes.toString().padStart(2, '0');
    detail.seconds = seconds.toString().padStart(2, '0');
    this.setData({
      countDownDay:detail
    })
  },

})