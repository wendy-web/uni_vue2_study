// component/storeRankPop/index.js
import {
  COS_URL
} from '../../utils/http'
import {
  prizeAct,
  enterFor
} from '../../api/storeRank/api'
import utils from '../../utils/util'
import storeRankUtils from '../../api/storeRank/utils';
import shopActUtils from '../../api/shopActivity/utils';
const log = require("../../utils/log");
var isRedirecting = false;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    actYureShow: false, // 活动预热弹窗
    actDailyProgressShow: false, // 活动每日进度弹窗
    actIsWinShow: false, // 活动中奖弹窗
    actNoWinShow: false, // 活动未中奖弹窗
    notTransferShow: false, // 活动期间店铺不可转让
    actEndShow: false, // 活动已结束弹窗
    getAwardSuccessShow: false, // 奖励领取成功弹窗
    checkShopInfoShow: false, // 核对店铺信息弹窗
    rankInfo: null, //活动信息
    btnCheckDetail: `${COS_URL}/public/img/storeRank/20210121/check_detail.png`, //按钮-查看详情
    btnIknow: `${COS_URL}/public/img/storeRank/202304/btn_iknow.png`, //按钮-我知道了
    // time: 10 * 1 * 1000, // 倒计时
    bg_act_rank_nowin: `${COS_URL}/public/img/storeRank/202304/bg_act_rank_nowin.png`, //弹窗背景：未中奖
    bg_act_rank_update: `${COS_URL}/public/img/storeRank/202304/bg_act_rank_update.png`, //弹窗背景：每日战况
    icon_forbid: `${COS_URL}/public/img/storeRank/202304/icon_forbid.png`, //图标-禁止
    icon_star: `${COS_URL}/public/img/storeRank/202304/icon_star.png`, //图标-禁止
    bg_get_award: `${COS_URL}/public/img/storeRank/202304/bg_get_award.png`, //弹窗背景：中奖
    btn_get_award: `${COS_URL}/public/img/storeRank/202304/btn_get_award.png`, //按钮-领取奖励
    shopInfo: null, // 店铺信息
    bg_check_shopinfo: `${COS_URL}/public/img/storeRank/202304/bg_check_shopinfo.png`, //弹窗背景：核对店铺信息
    btn_confirm: `${COS_URL}/public/img/storeRank/202304/btn_confirm.png`, //按钮-确认
    btn_change: `${COS_URL}/public/img/storeRank/202304/btn_change.png`, //按钮-更改
    bg_get_award_success: `${COS_URL}/public/img/storeRank/202304/bg_get_award_success.png`, //弹窗背景：领奖成功
    prizeInfo: null, //领奖信息
    noTransferTips: '', //不可转让店铺提示语
    // 2023年5月27日 新增开箱冲榜活动
    unboxApplyCheckShow: false, //报名确认弹窗：提示报名后不可修改店铺信息
    unboxApplySuccessShow: false, // 报名成功弹窗
    unboxcheckShopInfoShow: false, // 开箱冲榜 核对店铺信息弹窗
    btn_no: `${COS_URL}/public/img/storeRank/202305/btn_no.png`, // 按钮：否
    btn_yes: `${COS_URL}/public/img/storeRank/202305/btn_yes.png`, // 按钮：是
    userInfo: null, //用户信息
    unboxDailyProgressShow: false, //开箱活动每日进度弹窗
    unboxNotTransferShow: false, //开箱活动期间不可转让店铺弹窗
    unboxAppliedShow: false, //已报名弹窗
    bg_act_apply_success: `${COS_URL}/public/img/storeRank/20210121/applySuccess.png`, //弹窗背景：恭喜您报名成功
    bg_unbox_normal: `${COS_URL}/public/img/storeRank/202305/bg_unbox_normal.png`, //弹窗背景：开箱活动弹窗通用背景
    unboxSignUpShow: false, //首页报名弹窗
    img_pop_apply: `${COS_URL}/public/img/storeRank/202305/img_pop_apply.png`, //首页报名弹窗：前往报名
    unbox_icon_star: `${COS_URL}/public/img/storeRank/202305/icon_star.png`, //图标：五角星
    icon_star_badge: `${COS_URL}/public/img/storeRank/202305/icon_star_badge.png`, //图标：五角星徽标
    btn_check_award: `${COS_URL}/public/img/storeRank/202305/btn_check_award.png`, //按钮：前往查看奖励
    btn_msg_notice: `${COS_URL}/public/img/storeRank/202305/btn_msg_notice.png`, //按钮：开启消息通知
    pop_bg_apply_success: `${COS_URL}/public/img/storeRank/202305/pop_bg_apply_success.png`, //弹窗背景：报名成功
    title_apply_success: `${COS_URL}/public/img/storeRank/202305/title_apply_success.png`, //弹窗标题：报名成功
    btn_know: `${COS_URL}/public/img/storeRank/202305/btn_know.png`, //按钮：知道了
    // 2023年8月1日 报名抽奖相关弹窗
    raffleApplyShow: false, // 抽奖报名弹窗
    raffleApplySuccessShow: false, // 抽奖报名成功弹窗
    szExcDailyShow: false, // 深圳兑奖每日弹窗
    raffleNoWinShow: false, // 深圳兑奖未中奖
    raffleNotTransferShow: false, //深圳兑奖 不可转让店铺
    raffleWinShow: false, //深圳兑奖 活动结束中奖
    closeImg: `${COS_URL}/public/img/bfyl/2023/08/icon_close.png`,
    bg_record_title: `${COS_URL}/public/img/bfyl/2023/07/bg_record_title.png`, // 标题背景
    icon_ticker_tape: `${COS_URL}/public/img/couponActivity/pop/icon_ticker_tape.png`, // 中奖弹窗碎花
    bgImg: `${COS_URL}/public/img/bfyl/2023/08/bg_pop_default.png`, //弹窗背景
    img_pop_bar: `${COS_URL}/public/img/bfyl/2023/08/img_pop_bar.png`, //弹窗连接bar
    bg_pop_mini: `${COS_URL}/public/img/bfyl/2023/08/bg_pop_mini.png`, //小弹窗背景空白
    icon_no_trans: `${COS_URL}/public/img/bfyl/2023/07/icon_no_trans.png`, //禁止转让店铺图标

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose(event) {
      let {
        popname
      } = event.currentTarget.dataset;
      console.log("popname:", popname);
      // this.setData({
      //   [`${popname}`]:false
      // })
      this.setData({
        [popname]: false
      })

    },
    // 显示预热弹窗
    showActYurePop(rankInfo = '') {
      this.setData({
        actYureShow: true,
        rankInfo
      })
    },
    // 显示活动每日进度弹窗
    showActDailyProcessPop(rankInfo = '') {
      this.setData({
        actDailyProgressShow: true,
        rankInfo
      })
    },
    // 显示活动中奖弹窗
    showActIsWinPop(rankInfo = '') {
      this.setData({
        actIsWinShow: true,
        rankInfo
      })
    },
    // 显示活动未中奖弹窗
    showActNoWinPop() {
      this.setData({
        actNoWinShow: true,
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
    // 显示活动已结束弹窗
    showActEndPop(rankInfo = null) {
      this.setData({
        actEndShow: true,
        rankInfo
      })
    },
    // 显示领奖成功弹窗
    showGetAwardSuccessPop() {
      this.setData({
        getAwardSuccessShow: true,
      })
    },
    // 核对店铺信息弹窗
    async showCheckShopInfoPop(event) {
      // 判断传参：区分兑奖还是开箱，默认兑奖checkShopInfoShow
      console.log("event:", event);
      let {
        popname = 'applyCheckShow', nextpopname = 'checkShopInfoShow'
      } = event.currentTarget.dataset;
      console.log("popname:", popname);
      try {
        let shopInfo = await utils.getShopInfo();
        shopInfo.address = utils.storeAddress(shopInfo);
        let shopPhoneNum = '';
        var reg = /^(\d{3})\d*(\d{4})$/;
        shopInfo.member.forEach(item => {
          if (item.condition == 1) {
            shopPhoneNum = item.mobile.replace(reg, '$1****$2');
            // shopPhoneNum = item.mobile;
          }
        })
        this.setData({
          [popname]: false,
          [nextpopname]: true,
          shopInfo,
          shopPhoneNum
        })
      } catch (error) {
        console.log("showCheckShopInfoPop error:", error)
        // 无店铺信息提示
        if (error.code && error.code == 0) {
          this.setData({
            [popname]: false,
          })
          wx.showModal({
            title: '温馨提示',
            content: "您还未创建店铺",
            confirmText: "创建店铺",
            cancelText: "暂不创建",
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/zhongduan/geren/mendian/renzhen/index?hide=false',
                })
              }
            }
          })
          return
        }
      }

    },
    // 修改店铺信息
    changeShopInfo: function () {
      let userInfo = this.data.userInfo;
      let url = "/pages/zhongduan/geren/mendian/renzhen/index?hide=false";
      if (userInfo && userInfo.condition !== 1) {
        wx.showModal({
          title: '温馨提示',
          content: "请联系店长更改店铺信息",
          showCancel: false
        })
        return;

      } else {
        wx.navigateTo({
          url: url,
        })
      }

    },
    //排行榜活动：定时器结束触发
    rankTimerFinished(event) {
      // 根据定义的name 来更新不同的活动倒计时
      let {
        actname = 'actInfo'
      } = event.currentTarget.dataset;
      let actInfo = this.data[actname];
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
      console.log("storeRankPop rankTimerFinished:",actInfo)
      this.setData({
        [actname]: actInfo
      })
    },
    // 领取奖励
    async getReward() {
      // 请求领取奖励接口
      try {
        let res = await prizeAct();
        log.addFilterMsg("prizeAct")
        log.info('领奖结果：', res)
        let {
          code,
          msg,
          data
        } = res;
        this.setData({
          checkShopInfoShow: false
        })
        // 领取失败
        if (code == 0) {
          wx.showModal({
            title: '领取失败',
            content: msg,
            showCancel: false
          })
          return
        }
        // 领取成功，弹窗领取成功刷新数据
        this.triggerEvent('refresh')
        data.arr = data.prize_msg.match(/\d+|[^\d]+/g);
        this.setData({
          getAwardSuccessShow: true,
          // prizeInfo领取信息
          prizeInfo: data
        })


      } catch (error) {
        console.log("getReward error:", error);
      }
    },
    goPage(event) {
      let {
        url,
        opentype = ''
      } = event.currentTarget.dataset;
      if (opentype && opentype == 'edit') {
        let {
          userInfo
        } = this.data;
        if (userInfo.condition != 1) {
          wx.showModal({
            title: '温馨提示',
            content: '请联系店长填写信息',
            showCancel: false
          })
          return
        }
      }
      if (url) {
        utils.navigateFrequentPage(url)
      }
    },
    openWithActInfo(event) {
      let {
        actInfo
      } = this.data;
      let {
        url
      } = event.currentTarget.dataset;
      let params = actInfo ? `?actInfo=${encodeURIComponent(JSON.stringify(actInfo))}` : ''
      return utils.navigateFrequentPage(url, params);
    },
    openPageRedirect(event){
      let {
        actInfo
      } = this.data;
      if(isRedirecting)return;
      isRedirecting = true;
      let {
        url
      } = event.currentTarget.dataset;
      let params = actInfo ? `?actInfo=${encodeURIComponent(JSON.stringify(actInfo))}` : '';
      wx.redirectTo({
        url: `${url+params}`,
        complete:(res)=>{
          isRedirecting = false;
          console.log("isRedirecting：",res)
        }
      })
    },
    // 2023年5月27日 报名前提示店铺信息不可修改弹窗
    showActApplyCheckPop() {
      this.setData({
        unboxApplyCheckShow: true
      })
    },
    //报名成弹窗：大中小型城市，三期活动，不同奖励区间
    showActApplySuccessPop(rankInfo = '') {
      this.setData({
        unboxApplySuccessShow: true,
        rankInfo
      })
    },
    // 已报名弹窗
    showActAppliedPop() {
      this.setData({
        unboxAppliedShow: true,
      })
    },
    // 首页报名弹窗
    showSignUpPop() {
      this.setData({
        unboxSignUpShow: true
      })
    },
    // 2023年8月1日 抽奖报名弹窗
    showRaffleApplyPop() {
      this.setData({
        raffleApplyShow: true
      })
    },
    // 抽奖报名成功：弹窗信息
    showRaffleApplySuccessPop(actInfo = null) {
      this.setData({
        raffleApplySuccessShow: true,
        actInfo
      })
    },
    // 深圳抽奖活动每日弹窗
    showSzExcDailyPop(actInfo = null) {
      this.setData({
        szExcDailyShow: true,
        actInfo
      })
    },
    // 显示活动中奖弹窗
    raffleWinPop(actInfo = '') {
      this.setData({
        raffleWinShow: true,
        actInfo
      })
    },
    // 显示活动未中奖弹窗
    raffleNoWinPop(actInfo = null) {
      this.setData({
        raffleNoWinShow: true,
        actInfo
      })
    },
    // 请求报名接口
    async unboxSignUp() {
      this.setData({
        checkShopInfoShow: false
      })
      try {
        let res = await enterFor();
        log.addFilterMsg("signUpStoreRank");
        log.info('报名结果：', res);
        this.setData({
          unboxcheckShopInfoShow: false
        })
        let {
          code,
          msg,
          data
        } = res;
        // 报名失败
        if (code == 0) {
          wx.showModal({
            title: '温馨提示',
            content: msg,
            showCancel: false
          })
          return
        }
        // 报名成功
        this.triggerEvent('refresh')
        this.showActApplySuccessPop(data)

      } catch (error) {
        console.log("signUp error:", error);
      }
    },
    //开启消息通知
    async openNotice() {

      try {
        let templateId = await utils.getMID(2);
        if (templateId) {
          //订阅消息授权
          wx.requestSubscribeMessage({
            //模板消息id，订阅类型：一次性
            tmplIds: templateId,
            success(res) {
              //需要循环templateId 判断每一个授权是否允许订阅消息通知
              if (res[templateId[0]] == 'reject') {
                console.log("跳转页面");

              } else {
                //活动开始跳转至榜单页，未开始跳转首页
                console.log("跳转页面");

              }

            },
            fail(res) {
              console.log("fail:res", res)
            }
          })

        } else {
          //活动开始跳转至榜单页，未开始跳转首页
          console.log("跳转页面");
        }

      } catch (error) {
        console.log("openNotice catch：", error);
      }

    },
    // 判断是否禁止转让店铺
    async isForbiddenTransShop(tips = '暂不能转让店铺', popname = 'raffleNotTransferShow') {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      try {
        let shopActInfo = wx.getStorageSync('storeRankActInfo14');
        if (shopActInfo) {
          shopActInfo = JSON.parse(shopActInfo);
        } else {
          let {
            actInfo
          } = await storeRankUtils.actInfo14();
          shopActInfo = actInfo;
        }
        let inActCoupon = utils.inActCouponTips('inStoreRank14');
        wx.hideLoading();
        if (inActCoupon) {
          this.showNotTransferPop({
            actInfo: shopActInfo,
            tips,
            popname
          })
        }
        return inActCoupon;
      } catch (error) {
        console.log("isForbiddenTransShop error:", error);
        wx.hideLoading();
        return false;
      }
    }
  },
  lifetimes: {
    async attached() {
      // 在组件实例进入页面节点树时执行
      try {
        let userInfo = wx.getStorageSync('userdata') || await utils.getUserInfoNew();
        this.setData({
          userInfo
        })
      } catch (error) {
        console.log("storeRankInfo 组件attached error:", error);
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
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
      isRedirecting = false;
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }
})