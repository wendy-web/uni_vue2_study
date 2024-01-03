// component/xdBenefitPop/index.js
const app = getApp();
import {
  COS_URL
} from '../../utils/http'
import {
  xdyhMini,
  reportEvent
} from '../../api/openMiniProgram'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{
      type:Boolean,
      value:false
    },
    config:{
      type:Object
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    icon_close_fill: `${COS_URL}/public/img/bfyl/2023/05/icon_close_fill.png`, //弹窗关闭按钮
    pop_bg_reward: `${COS_URL}/public/img/bfyl/2023/05/pop_bg_reward.png`, //弹窗背景

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 2023年5月19日 打开领取福利弹窗
  
    closeBenefitPop() {
      this.triggerEvent('close');
      this.setData({
        show: false,
      })
    },
    // 打开小店有惠小程序
    openXdyh() {
      let event_name = 'click_wpicture';
      let { platform='' } = app.globalData.systemInfo;
      let event_data = {
        "devices": platform
      }
      reportEvent(event_name, event_data)
      let {config} = this.data;
      if(config){
        xdyhMini({path:config.ad1.url,halfScreen:config.boxCode})
      }
      this.closeBenefitPop();
    },
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }
})