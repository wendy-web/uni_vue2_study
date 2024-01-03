// component/storeExchangePop/index.js
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
    ActNoExcShow: false, //活动结束未兑换弹窗
    ActEndShow: false, //活动结束未中奖弹窗
    winShow: false, // 中奖弹窗
    notTransferShow: false, // 不可转让店铺弹窗
    bg_bar_orange: `${COS_URL}/public/img/bfyl/2023/07/bg_bar_orange.png`, //顶部标题背景
    icon_star: `${COS_URL}/public/img/bfyl/2023/07/icon_star.png`, // 五角星图标
    icon_bar_left: `${COS_URL}/public/img/bfyl/2023/07/icon_bar_left.png`, // 倒计时左边图标
    icon_bar_right: `${COS_URL}/public/img/bfyl/2023/07/icon_bar_right.png`, // 倒计时右边图标
    icon_check_mark: `${COS_URL}/public/img/bfyl/2023/07/icon_check_mark.png`, // √ 图标
    bg_bits_pop: `${COS_URL}/public/img/bfyl/2023/07/bg_bits_pop.png`, // 获奖弹窗撒花背景
    img_bar_pop: `${COS_URL}/public/img/bfyl/2023/07/img_bar_pop.png`,
    icon_no_trans: `${COS_URL}/public/img/bfyl/2023/07/icon_no_trans.png`, //禁止转让店铺图标
    img_shop_head: `${COS_URL}/public/img/bfyl/2023/07/img_shop_head.png`, // 禁止转让店铺背景
    closeImg: `${COS_URL}/public/img/bfyl/202201/icon_close.png`,
    noTransferTips: '', // 禁止转让店铺文案
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
    // 显示活动结束未参与（未兑换）弹窗
    showActNoExcPop() {
      this.setData({
        ActNoExcShow: true
      })
    },
    // 显示活动结束未中奖弹窗
    showActEndPop(actInfo = null) {
      this.setData({
        ActEndShow: true,
        actInfo
      })
    },
    // 显示中奖弹窗
    showWinPop(actInfo = null) {
      this.setData({
        winShow: true,
        actInfo
      })
    },
    // 显示不可转让店铺弹窗：需要传参弹窗name,区分兑奖、开箱冲榜，默认兼容兑奖弹窗
    showNotTransferPop({
      actInfo,
      tips = '暂不能转让店铺',
      popname = 'notTransferShow'
    }) {
      this.setData({
        [popname]: true,
        actInfo,
        noTransferTips: tips
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
    // 判断是否禁止转让店铺
    async isForbiddenTransShop(tips = '暂不能转让店铺') {
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      try {
        let shopActInfo = wx.getStorageSync('shopActInfo');
        if (shopActInfo) {
          shopActInfo = JSON.parse(shopActInfo)
        } else {
          let {
            actInfo
          } = await shopActUtils.act5_getinfo();
          shopActInfo = actInfo
        }
        //判断用户是否已报名并且活动未结束
        let inActCoupon = utils.inActCouponTips();
        wx.hideLoading();
        if (inActCoupon) {
          this.showNotTransferPop({
            actInfo: shopActInfo,
            tips
          });
        }
        return inActCoupon;

      } catch (error) {
        console.log("isForbiddenTransShop error:", error)
        wx.hideLoading();
        return false;
      }

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