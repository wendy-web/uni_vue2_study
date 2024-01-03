// components/menu/menu.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const storeRankNum = app.globalData.storeRankNum;
const utils = require("../../utils/util");
const http = require("../../utils/api");
const log = require("../../utils/log");
const auth = require('../../utils/auth.js');
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime.js'
let countDownTimer = '';
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
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showmenus: true,
    url: 'data:image/png;base64,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',
    defaultUrl: '/pages/zhongduan/geren/mendian/qrcode',
    storeRankNum:storeRankNum,//店铺排行榜上榜人数
  },
  attached: function () {
    var systemInfo = app.globalData.systemInfo;
    var height = systemInfo.windowHeight;
    var width = systemInfo.windowWidth;
    var that = this;
    this.setData({
      width: width,
      height: height,
    });

  },
  pageLifetimes: {
    show: function () {

      // 页面被展示
      let that = this;

    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showclick: function (e) {
     
      wx.navigateTo({
        url: this.data.defaultUrl,
      })

    },
    itemclick: function (e) {
      this.triggerEvent('trigger', {
        "iteminfo": info
      })
    },


  }
})