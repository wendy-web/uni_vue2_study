// components/menu/menu.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const utils = require("../../utils/util");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    trigger: {
      type: Boolean,
      value: false
    },
    mainmodel: {
      type: Object,
      value: {}
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
    url: 'https://file.y1b.cn/public/img/Tian/icon_welfare.png',
    defaultUrl: '/pages/zhongduan/geren/mendian/qrcode',
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
      this.triggerEvent('myevent', {
        "show": true
      }) 
     

    },
    itemclick: function (e) {
      this.triggerEvent('trigger', {
        "iteminfo": info
      })
    },


  }
})