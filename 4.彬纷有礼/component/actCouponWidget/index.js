// components/menu/menu.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const utils = require("../../utils/util");
const log = require("../../utils/log");
const auth = require('../../utils/auth.js');
const shopActUtils = require('../../api/shopActivity/utils');
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime.js'
let _request = false;
let that = this;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    trigger: {
      type: Boolean,
      value: false
    },
    mainmodel: {
      type: Object,
      value: {}
    },
    menulist: {
      type: Object,
      value: []
    },
    pageUrl: {
      type: String,
      value: ''
    },
    screenHeight: {
      type: Number,
      value: 0
    },
    // actInfo: {
    //   type: Object,
    //   value: {}
    // },
 
  },

  /**
   * 组件的初始数据
   */
  data: {
    showmenus: true,
    url: '',
    defaultUrl: '/pages/couponActivity/index',

    // 2021年8月26日 星期四 开箱活动券
    act_yure: false, //预热
    actCouponInfo: '', //活动信息
    act_updatePop: false, //每日弹窗
    bg_act_updatePop: COS_URL + '/public/img/couponActivity/pop/bg_box_progress.png',
    bg_act_ing: '', //活动进行中弹窗背景
    act_End: false, //活动结束
    act_EndPop: false, //活动结束弹窗
    act_unclaimed: true, // 未领奖
    act_isWin: false, //是否中奖
    end_more_seven: false, //活动结束7天内
    bg_act_earned: '', //活动已领奖弹窗背景
    bg_act_end: '', //活动结束背景
    act_countDown: '', //倒计时文案
    act_remain_day: '', //活动剩余天数
    act_coupon_num: '', //活动券数
    // 2021年11月17日 浮标修改为css动画
    img_0: COS_URL + '/public/img/bfyl/202204/icon_buoy_zm.png',
    img_1: COS_URL + '/public/img/bfyl/202204/icon_buoy_prize.png',
    img_2: COS_URL + '/public/img/bfyl/202204/icon_buoy_bg.png',
    img_3: COS_URL + '/public/img/bfyl/202204/icon_buoy_bling.png',
    img_4: COS_URL + '/public/img/bfyl/202204/icon_buoy_title.png',
    openboxPop: false, //测试开箱弹窗
    //2022年8月8日 深圳开箱、陈列活动
    unbox_img_0: COS_URL + '/public/img/couponActivity/20211117/icon_buoy/img_0.png',
    unbox_img_1: COS_URL + '/public/img/couponActivity/20211117/icon_buoy/img_1.png',
    unbox_img_2: COS_URL + '/public/img/couponActivity/20211117/icon_buoy/img_2.png',
    unbox_img_3: COS_URL + '/public/img/couponActivity/20211117/icon_buoy/img_3_2.png',
    display_hn_buoy: COS_URL + '/public/img/bfyl/202208/display_hn_buoy.png', //浮标背景：陈列赢红牛券
    buoy_display_zm: COS_URL + '/public/img/bfyl/202208/buoy_display_zm.png', //浮标背景：陈列战马
    buoy_display_hn: COS_URL + '/public/img/bfyl/202208/buoy_display_hn.png', //浮标背景：陈列红牛
    actInfo: null, //活动信息：开箱陈列
    buoy_unbox_hn: `${COS_URL}/public/img/bfyl/2023/07/unbox/icon_unbox_buoy.png`, //浮标背景：开箱红牛
  },
  attached: function () {
    var systemInfo = app.globalData.systemInfo;
    var height = systemInfo.windowHeight;
    var width = systemInfo.windowWidth;
    that = this;
    this.setData({
      width: width,
      height: height,
    });


  },

  /**
   * 组件的方法列表
   */
  methods: {
    //跳转开箱活动首页
    toUnboxHome(event) {
      this.szUnboxInfo()

    },
    //跳转陈列首页
    toDisplayHome(event) {
      let {
        issues
      } = event.currentTarget.dataset;
      console.log(issues, event);
      //5战马券，7红牛券
      let path = issues == 5 ? 'zm' : 'hn';
      let url = '/pages/shopActivity/displayAct/' + path + '/index/index';
      wx.navigateTo({
        url: url,
      })
    },

    itemclick: function (e) {
      this.triggerEvent('trigger', {
        "iteminfo": info
      })
    },

    goScan: function () {
      this.setData({
        act_EndPop: false,
        act_updatePop: false
      })
      let url = "/pages/zongduan/saoma/index";
      wx.redirectTo({
        url: url,
      })

    },
    async szUnboxInfo() {
      try {
        // 获取活动信息
        let {
          actInfo
        } = await shopActUtils.act5_getinfo_sz();
        console.log("点击浮标深圳开箱活动参与信息：", actInfo)
        if (actInfo) {
          this.setData({
            actInfoSZ:actInfo
          })
          //获取活动信息
          let {
            act_state,
            is_win,
            status,
            sign_time
          } = actInfo;
          // 活动未报名：前往报名
          if (!act_state.act_end && (status == '未报名' || !sign_time)) {
            utils.navigateFrequentPage('pages/shopActivity/unboxAct/base/index');
            return
          }
          // 活动预热跳转详情传参活动信息：/pages/shopActivity/unboxAct/base/index?rankInfo
          // if(act_state.act_yure){
          //   utils.navigateFrequentPage('pages/shopActivity/unboxAct/base/index')
          //   return
          // }
          //活动结束
          if (act_state.act_end) {
            // 未中奖弹窗
            if (!is_win) {
              // 未开箱
              if (actInfo.s_num == 0) {
                this.selectComponent('#actCouponPop').showNotUnboxPop(actInfo);
                return
              }
              this.selectComponent('#actCouponPop').showActEndPop(actInfo);
              return
            }
            // 中奖
            if (is_win) {
              this.selectComponent('#actCouponPop').showWinPop(actInfo)
              return
            }
            utils.navigateFrequentPage('pages/shopActivity/unboxAct/base/index')
            return
          }
          //活动进行中跳转详情
          utils.navigateFrequentPage(`pages/shopActivity/unboxAct/base/index`)
          return
        }
        return this.setData({
          actInfoSZ: null
        })
      } catch (err) {
        console.error("szActGetInfo err:", err);
      }
    },



  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {
    },
    resize: function () {},
  },
})