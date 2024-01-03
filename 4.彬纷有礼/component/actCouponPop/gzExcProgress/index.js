// component/actCouponPop/gzExcProgress/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const utils = require("../../../utils/util");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    actInfo: {
      type: Object,
      value: {},
      observer: function (actInfo) {
        if (actInfo) {
          this.initActInfo(actInfo);
        }
      }
    },
    // 按钮类型：1默认去兑换 2查看详情
    btnType: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    file_url_gzexc: `${COS_URL}/public/img/bfyl/2023/08/gzExc`, //广州兑奖cos图片资源
    userdata:null, //用户信息
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initActInfo(actInfo) {
      if (actInfo&&actInfo.calc) {
        let {
          s_num, //当前兑奖罐数
          calc
        } = actInfo;
        let target = calc[0] || 5; //满5罐 奖励 2
        let remainder = s_num % target;
        // 取余后 计算还需要兑几罐
        let still_need_exc = parseInt(target - remainder);
        actInfo.remainder = remainder;
        actInfo.still_need_exc = still_need_exc;
        this.setData({
          actInfo
        })
      }
    },
    // 打开页面（防止重复跳转返回）
    openPage(event) {
      const {
        url = '',
        params='',
        opentype=''
      } = event.currentTarget.dataset;
      let {userdata} = this.data;
      // 判断店员身份
      if(opentype&&opentype==2&&userdata.condition==2){
        wx.showModal({
          title: '温馨提示',
          content: '请联系店长使用卡券',
          showCancel:false
        })
        return
      }
      if (!url) return;
      console.log(url);
      utils.navigateFrequentPage(url,params)
    },
  },
  lifetimes: {
    async attached() {
      // 在组件实例进入页面节点树时执行
      try {
        let userdata = wx.getStorageSync('userdata') || await utils.getUserInfoNew();
        this.setData({
          userdata
        })
      } catch (error) {
        console.log("广州兑奖进度 组件attached error:", error);
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})