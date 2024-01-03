// component/actDisplayPopup/unboxEnd/index.js
const utils = require('../../../utils/util');
const app = getApp();
const COS_URL = app.globalData.COS_URL;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    actInfo: {
      type: Object,
      value: null,
      observer: function (actInfo) {
        console.log("开箱unboxEnd:",actInfo);
      }
    },
    show: {
      type: Boolean,
      value: false
    },
    unboxFail: {
      type: Boolean,
      value: false
    },
    unboxWin: {
      type: Boolean,
      value: false
    },
    unlockDisplay: {
      type: Boolean,
      value: false
    },
    lockDisplay: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true,
    userdata: null, //用户信息
    unbox_pop_bg:COS_URL+'/public/img/couponActivity/pop/bg_act_end.png',//背景开箱弹窗
    unbox_pop_title_earned:COS_URL+'/public/img/bfyl/202208/unbox_pop_title_earned.png',//开箱弹窗标题：恭喜您获得
    icon_ticker_tape:COS_URL+'/public/img/bfyl/202208/icon_ticker_tape.png',//开箱弹窗图标：碎花
  },
  attached: function () {
    var that = this;
    //获取用户信息
    var userdata = wx.getStorageSync('userdata');
    if (userdata) {
      this.setData({
        userdata: userdata
      });

    } else {
      utils.getUserInfoNew().then(res => {
        that.setData({
          userdata: res
        });
      })
    }


  },
  /**
   * 组件的方法列表
   */
  methods: {
    //关闭弹窗
    onClose(e) {
      this.setData({
        show: false
      })
    },
    //跳转开箱活动首页
    toUnboxHome(event){
      let {issues} = event.currentTarget.dataset;
      console.log(issues,event);
      //4 倍数开箱活动，6 区间目标开箱活动
      let path = issues == 4 ? 'base' : 'section';
      let url = '/pages/shopActivity/unboxAct/' + path + '/index';
      wx.navigateTo({
        url: url,
      })
      this.setData({
        show:false
      })
    },
    //打开陈列拍照页
     //去拍照
     takePhoto(event){
      let {issues} = event.currentTarget.dataset;
      // issues = 5  陈列活动（奖励战马活动券） 
      // issues = 7  陈列活动（奖励红牛活动券）
      let url = '/pages/shopActivity/displayAct/zm/display/index';
      if(issues == 4){
        url = '/pages/shopActivity/displayAct/zm/display/index';
      }
      if(issues == 6){
        url = '/pages/shopActivity/displayAct/hn/display/index';
      }
      //跳转陈列页
      wx.navigateTo({
        url: url,
      })

    },
  }
})