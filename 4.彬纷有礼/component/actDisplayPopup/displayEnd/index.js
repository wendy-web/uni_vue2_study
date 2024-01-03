// component/actDisplayPopup/displayEnd/index.js
const utils = require('../../../utils/util');
const app = getApp();
const COS_URL = app.globalData.COS_URL;
//中奖标题+券的名称
let win_title_name={
  5:{
    img_path:COS_URL + '/public/img/bfyl/202206/img_title_winner.png',
    name:"战马"
  },
  7:{
    img_path:COS_URL + '/public/img/bfyl/202208/img_title_winner_hn_1.png',
    name:"红牛"
  },
}
let init_win_title_name = {
  img_path:COS_URL + '/public/img/bfyl/202206/img_title_winner.png',
  name:"战马"
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    displayInfo: {
      type: Object,
      value: null,
      observer:function(displayInfo){
        //需要区分活动奖励的是战马还是红牛券
        // issues = 5  陈列活动（奖励战马活动券的） 
        // issues = 7  陈列活动  （奖励红牛活动券的）
        let {issues} = displayInfo;
        let item = win_title_name[issues] || init_win_title_name;
        this.setData({
          img_title_winner:item['img_path'],
          coupon_name:item['name']
        })
      }
    },
    show: {
      type: Boolean,
      value: false
    },
    displayFail:{
      type:Boolean,
      value:false
    },
    displayWin:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true,
    userdata:null,//用户信息
    img_title_winner: '', //陈列成功弹窗标题
    img_bg_pop_apply: COS_URL + '/public/img/bfyl/202204/bg_pop_apply.png', //陈列报名弹窗 奖励背景
    img_bg_apply_btn: COS_URL + '/public/img/bfyl/202204/bg_apply_btn.png', //陈列报名弹窗 按钮背景
    icon_sad: COS_URL + '/public/img/bfyl/202204/icon_sad.png', //未中奖表情
    coupon_name:'',//奖券券名
  },
  attached: function () {
    //获取用户信息
    var userdata = wx.getStorageSync('userdata');
    if (userdata) {
      this.setData({
        userdata: userdata
      });

    } else {
      utils.getUserInfoNew().then(res => {
        this.setData({
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