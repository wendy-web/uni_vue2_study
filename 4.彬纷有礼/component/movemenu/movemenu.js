// components/menu/menu.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const utils = require("../../utils/util");
const log = require("../../utils/log");
const storeRankUtils = require('../../api/storeRank/utils');
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime.js'
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
    actInfo: {
      type: Object,
      value: {}
    },
    displayInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showmenus: true,
    actInfo: null, //活动信息：开箱陈列
    img_sz_buoy: `${COS_URL}/public/img/bfyl/2023/08/img_sz_buoy.png`, //浮标背景
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
    tapBuoy(event) {
      this.szUnboxInfo()

    },

    itemclick: function (e) {
      this.triggerEvent('trigger', {
        "iteminfo": info
      })
    },
  
    async szUnboxInfo() {
      try {
        // 获取活动信息
        let {
          actInfo
        } = await storeRankUtils.actInfo14();
        if (actInfo) {
          console.log("点击浮标 获取活动信息：",actInfo);
          log.addFilterMsg('actInfoRaffle');
          log.info(actInfo);
          let {
            act_state,
            is_win,
            raffle_win,
          } = actInfo;
          //活动结束
          if (act_state.act_end) {
            // 中奖：1店铺排行榜中奖，2抽奖活动中奖
            if (is_win || raffle_win) {
              this.selectComponent('#storeRankPopBouy').raffleWinPop(actInfo);
              return
            }
            // 未中奖弹窗
            if (!is_win) {
              this.selectComponent('#storeRankPopBouy').raffleNoWinPop(actInfo);
              return
            }
            utils.navigateFrequentPage('pages/storeRank/rank/index')
            return
          }
          //活动进行中跳转详情
          utils.navigateFrequentPage(`pages/storeRank/rank/index`)
          return
        }
        
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