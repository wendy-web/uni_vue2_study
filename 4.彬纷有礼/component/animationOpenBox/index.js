// component/animationOpenBox/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const utils = require("../../utils/util");
let that = this;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    actInfo: {
      type: Object,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    img_0: `${COS_URL}/public/img/bfyl/2023/07/unbox/apply_pop_title.png`,
    img_2: COS_URL + '/public/img/bfyl/202208/pop_act/img_2.png',
    // img_3: COS_URL + '/public/img/bfyl/202208/pop_act/img_3.png',//立即开箱扫码按钮
    img_3: COS_URL + '/public/img/bfyl/202208/pop_act/img_3_check.png', //立即查看按钮
    img_4: COS_URL + '/public/img/bfyl/202208/pop_act/img_4.png',
    img_5:  `${COS_URL}/public/img/bfyl/2023/07/unbox/apply_pop_unbox.png`,
    img_6: COS_URL + '/public/img/bfyl/202208/pop_act/img_6.png',
    img_7: COS_URL + '/public/img/bfyl/202208/pop_act/img_7.png',
    img_8: COS_URL + '/public/img/bfyl/202208/pop_act/img_8.png',
    img_9: COS_URL + '/public/img/bfyl/202208/pop_act/img_9.png',
    issues: 4,
  },
  attached() {
    that = this;
  },
  /**
   * 组件的方法列表
   */
  methods: {
    closePop() {
      this.setData({
        show: false
      })
    },
    gotoScan() {
      console.log(1111);
      wx.navigateTo({
        url: '/pages/zongduan/saoma/index',
      })
      // this.triggerEvent("myevent",{})
    },
    // 首页点击开箱活动item
    tapUnboxAct: utils.throttle((event) => {

      //获取活动信息
      let issues = that.data.issues;

      //活动进行中、预热跳转详情:要区分是开箱促销(issues:4，基数)，还是竞品拔钉(issues:6，区间)
      let path = issues == 4 ? 'base' : 'section';
      let url = '/pages/shopActivity/unboxAct/' + path + '/index';
      wx.navigateTo({
        url: url,
        complete(){
          that.setData({
            show: false
          })
        }
      })

    }, 1000),
    show() {
      this.setData({
        show: true
      })
    }
  }
})