// component/step-bar/step-bar.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
let actInfo = null;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    actInfo: {
      type: Object,
      value: {},
      observer: function (num) {
        // wx.showLoading({
        //   title: '加载中',
        // })
        // this.initData()
      }
    },
    type: {
      type: Number,
      value: 1, //1：活动进度 2：下次可陈列拍照,3现在可拍照

    },
    nextDisplay:{//下次陈列拍照日期
      type:String,
      value:''
    },
    classDaily:{//陈列进度的弹窗UI
      type:String,
      value:''
    },
    actEnd: {
      type: Boolean,
      value: false, //活动结束
      observer: function (num) {
        // this.initData()
      }
    },
    showTakePhoto:{
      type: Boolean,
      value: false, //显示拍照按钮
    }
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    bg_act_progress:COS_URL + '/public/img/bfyl/202204/bg_act_progress.png',
    icon_progress:COS_URL + '/public/img/bfyl/202204/icon_progress.png',
    icon_bar_green:COS_URL + '/public/img/bfyl/202204/icon_bar_green.png',
    icon_bar_grey:COS_URL + '/public/img/bfyl/202204/icon_bar_grey.png',
    icon_step_green:COS_URL + '/public/img/bfyl/202204/icon_step_green.png',
    icon_step_grey:COS_URL + '/public/img/bfyl/202204/icon_step_grey.png',

  },

  /**
   * 组件的方法列表
   */
  methods: {
    initData() {
   
    },
    //去拍照
    takePhoto(event){
      let {issues} = event.currentTarget.dataset;
      // issues = 5  陈列活动（奖励战马活动券） 
      // issues = 7  陈列活动（奖励红牛活动券）
      let url = '/pages/shopActivity/displayAct/hn/display/index';
      if(issues == 5){
        url = '/pages/shopActivity/displayAct/zm/display/index';
      }
      if(issues == 7){
        url = '/pages/shopActivity/displayAct/hn/display/index';
      }
      //跳转陈列页
      wx.navigateTo({
        url: url,
      })

    },
    //跳转陈列首页
    toDisplayHome(event){
      let {issues} = event.currentTarget.dataset;
      console.log(issues,event);
      //5战马券，7红牛券
      let path = issues == 5 ? 'zm' : 'hn';
      let url = '/pages/shopActivity/displayAct/' + path + '/index/index';
      wx.navigateTo({
        url: url,
      })
    }
  }
})