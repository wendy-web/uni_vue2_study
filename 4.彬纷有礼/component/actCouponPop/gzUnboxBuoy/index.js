// component/actCouponPop/gzUnboxBuoy/index.js

const app = getApp();
const COS_URL = app.globalData.COS_URL;
const utils = require("../../../utils/util");
const log = require("../../../utils/log");
const shopActUtils = require('../../../api/shopActivity/utils');
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime.js'
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
    actInfo: null, //活动信息：开箱陈列
    img_sz_buoy: `${COS_URL}/public/img/bfyl/2023/08/gzUnbox/icon_buoy_gzunbox.png`, //浮标背景
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
      this.gzUnboxInfo()

    },

    itemclick: function (e) {
      this.triggerEvent('trigger', {
        "iteminfo": info
      })
    },
  
    async gzUnboxInfo() {
      try {
        // 获取活动信息
        let {
          actInfo
        } = await shopActUtils.gzUnboxActInfo();
        if (actInfo) {
          console.log("点击浮标 获取活动信息：",actInfo);
          log.addFilterMsg('actInfoGZ');
          log.info(actInfo);
        
          let {
            act_state,
            status,
          } = actInfo;
          //活动结束
          if (act_state.act_end) {
            // 中奖未中奖 弹窗
            this.selectComponent('#gzUnboxPop').showGzUnboxWinPop(actInfo);
            return
          }
          // 活动未报名 或者 预热 ：前往报名
          if ((status == '未报名' || act_state.act_yure) && !act_state.act_end) {
            utils.navigateFrequentPage('pages/couponActivity/gzUnbox/signUp/index', `?actInfo=${encodeURIComponent(JSON.stringify(actInfo))}`)
            return
          }
          
          //活动进行中跳转详情
          utils.navigateFrequentPage(`pages/couponActivity/gzUnbox/index/index`)
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
