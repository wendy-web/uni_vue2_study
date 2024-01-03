// components/menu/menu.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const storeRankNum = app.globalData.storeRankNum;
import shopActUtils from '../../api/shopActivity/utils'
// import storeRankUtils from '../../api/storeRank/utils'
const utils = require("../../utils/util");
const log = require("../../utils/log");
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime.js'
let _request = false;
let that = '';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    trigger: {
      type: Boolean,
      value: false
    },
    mainmodel: {
      type: Object,
      value: {}
    },
    menulist: {
      type: Object,
      value: []
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
    url: COS_URL + '/public/img/bfyl/2023/10/icon_dgzmexc_buoy1.png', //浮标icon
    noticeUnread: '',
    iKnow: COS_URL + '/public/img/storeRank/20210121/iKnow0128.png', //查看中间记录按钮
    get_awardBG: COS_URL + '/public/img/storeRank/202108/pop/bg.png', //领奖成功《查看奖励》
    activityEndImg: COS_URL + '/public/img/storeRank/202108/pop/bg.png',
    check_reward_history: COS_URL + '/public/img/storeRank/20210121/check_reward_history.png', //查看中间记录按钮
    check_detail: COS_URL + '/public/img/storeRank/20210121/check_detail.png', //《查看详情》
    findout_detail: COS_URL + '/public/img/storeRank/20210121/findout_detail.png', //《了解详情》
    applyed_detail: COS_URL + '/public/img/storeRank/202106/storeRank_detail.png', //已报名,活动预热(未开始)背景
    activities_ing: COS_URL + '/public/img/storeRank/202108/pop/bg.png', //已报名,活动开始未结束战况背景：未上榜、榜单信息  《了解活动详情》
    begin_apply: COS_URL + '/public/img/storeRank/202108/pop/bg.png', //未报名,活动开始背景：《前往报名》
    get_award: COS_URL + '/public/img/storeRank/202108/pop/bg.png',
    storeRankIKnow: COS_URL + '/public/img/storeRank/202106/storeRank_iKnow.png', //空背景，我知道了
    storeRank_earned: COS_URL + '/public/img/storeRank/202108/pop/bg.png', //已领奖弹窗背景：《查看奖励》
    storeRankNum: storeRankNum, //店铺排行榜上榜人数
  },
  attached: function () {
    var systemInfo = app.globalData.systemInfo;
    var height = systemInfo.windowHeight;
    var width = systemInfo.windowWidth;
    this.setData({
      width: width,
      height: height,
    });
    that = this
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showclick() {
      this.storeRankGetInfo()
    },
    // showclick:utils.throttle((event) => {
    //   console.log("showclick:", event);
    //   that.storeRankGetInfo();
    // }, 300),
    itemclick: function (e) {
      this.triggerEvent('trigger', {
        "iteminfo": info
      })
    },
    //活动弹窗显示逻辑
    async storeRankGetInfo() {
      if (_request) {
        return
      }
      _request = true;
      try {
        // 获取活动信息
        let {
          actInfo
        } = await shopActUtils.dgZmExcActInfo();
        _request = false;
        console.log("首页店铺排行榜参与信息：", actInfo)
        if (actInfo) {
          this.setData({
            actInfo
          })
          //开箱活动每日弹窗处理(活动进行中)
          let {
            act_state,
          } = actInfo;
          // 活动结束：判断本地是否缓存中奖弹窗日期
          if (act_state.act_end) {
            // 中奖、抽奖中奖也要算进去
            this.selectComponent("#dgzmExcPop").showExcWinPop(actInfo)
            return
          }
          utils.navigateFrequentPage('pages/couponActivity/dgExcZm/index/index')
          return
        }

      } catch (err) {
        _request = false;
        console.error("storeRankGetInfo err:", err);
      }


    },

  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {
      _request = false;
    },
    resize: function () {},
  },
})