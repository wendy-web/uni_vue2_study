// component/storeExchangePop/dgzmExc.js
const log = require("../../utils/log");
import utils from '../../utils/util';
import shopActUtils from '../../api/shopActivity/utils';
import {
  COS_URL
} from '../../utils/http';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    actInfo: {
      type: Object,
      value: {},
      observer: function (actInfo) {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    dailyProcessShow: false, //兑奖进度弹窗
    winShow: false, // 中奖弹窗
    bg_bar_orange: `${COS_URL}/public/img/bfyl/2023/07/bg_bar_orange.png`, //顶部标题背景
    icon_star: `${COS_URL}/public/img/bfyl/2023/07/icon_star.png`, // 五角星图标
    icon_bar_left: `${COS_URL}/public/img/bfyl/2023/07/icon_bar_left.png`, // 倒计时左边图标
    icon_bar_right: `${COS_URL}/public/img/bfyl/2023/07/icon_bar_right.png`, // 倒计时右边图标
    icon_check_mark: `${COS_URL}/public/img/bfyl/2023/07/icon_check_mark.png`, // √ 图标
    bg_bits_pop: `${COS_URL}/public/img/bfyl/2023/07/bg_bits_pop.png`, // 获奖弹窗撒花背景
    img_bar_pop: `${COS_URL}/public/img/bfyl/2023/07/img_bar_pop.png`,
    closeImg: `${COS_URL}/public/img/bfyl/202201/icon_close.png`,
    // 2023年10月18日 东莞战马兑奖活动
    cos_file_2310:`${COS_URL}/public/img/bfyl/2023/10`,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭弹窗
    onClose(event) {
      let {
        popname
      } = event.currentTarget.dataset;
      console.log("popname:", popname);
      this.setData({
        [popname]: false
      })

    },
    // 显示每日进度弹窗
    showExcProcessPop(actInfo = null) {
      this.setData({
        dailyProcessShow: true,
        actInfo
      })
    },

    //排行榜活动：定时器结束触发
    rankTimerFinished(event) {
      console.log(event)
      let actInfo = this.data.actInfo;
      //活动未结束刷新倒计时
      if (!actInfo.act_state.act_end) {
        //根据时间重新计算 活动状态
        let {
          s_time,
          e_time
        } = actInfo
        let act_state = shopActUtils.init_act_state({
          s_time,
          e_time
        });
        actInfo.act_state = act_state;
        this.setData({
          actInfo
        })
      }
    },
    // 打开页面（防止重复跳转返回）
    openPage(event) {
      const {
        url = ''
      } = event.currentTarget.dataset;
      if (!url) return;
      console.log(url);
      utils.navigateFrequentPage(url)
    },
    // 防止重复打开页面
    openPageParam(event) {
      const {
        url = '',
          params = ''
      } = event.currentTarget.dataset;
      if (!url) return;
      console.log(url);
      utils.navigateFrequentPage(url, params)
    },
    // 打开中奖弹窗
    showExcWinPop(actInfo=null){
      this.setData({
        winShow: true,
        actInfo
      })
    }
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
    },
    hide: function () {
      // 页面被隐藏
      let data = this.data;

      Object.keys(data).forEach(item => {
        // console.log(item,':',typeof data[item])
        if (typeof data[item] === 'boolean' && data[item] === true) {
          this.setData({
            [item]: false
          })
        }
      });
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }

})