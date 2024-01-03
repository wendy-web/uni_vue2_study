// component/actDisplayPopup/dailyPop/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    actInfo:{
      type:Object,
      value:null,
      observer: function (actInfo) {
        //基数的需要重新计算属性：活动进行中+开箱基数小于20，隐藏进度条
        if(actInfo&&actInfo.issues==4&&actInfo.act_state.act_ing){
          let {kpi_num,kpi_1,s_num} =actInfo;
          let maxNum = Math.ceil(kpi_num*kpi_1);
          maxNum = maxNum > 40 ? 40 : maxNum;

          console.log("基数开箱活动进行中···最大开箱数：",maxNum);
          //开箱目标小于20 && s_num大于开箱目标
          if(maxNum<20&&s_num>=maxNum){
            this.setData({
              baseProgressShow:false
            })
          }
        }
      }
    },
    displayInfo:{
      type:Object,
      value:null
    },
    show:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show:true,
    // bg_unbox_pop:COS_URL+'/public/img/bfyl/202208/unbox_pop_bg.png',//背景开箱弹窗
    unbox_pop_bg:COS_URL+'/public/img/couponActivity/pop/bg_act_end.png',//背景开箱弹窗
    unbox_pop_title_process:COS_URL+'/public/img/bfyl/202208/unbox_pop_title_progress_hn.png',//开箱弹窗标题：活动进度
    img_bg_apply_btn: COS_URL + '/public/img/bfyl/202204/bg_apply_btn.png', //陈列弹窗 按钮背景
    baseProgressShow:true,//基数开箱进度显示
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //关闭弹窗
    onClose(e){
      this.setData({
        show:false
      })
    },
    //去开箱
    goscan(){
      let url = "/pages/zongduan/saoma/index";
      wx.navigateTo({
        url: url,
      })
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
