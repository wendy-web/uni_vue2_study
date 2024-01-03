// pages/shopActivity/unboxAct/base/index.js

let app = getApp();
let COS_URL = app.globalData.COS_URL;
const utils = require('../../../../utils/util');
const log = require('../../../../utils/log');
let that = this;
const shopActUtil = require("../../../../api/shopActivity/utils");
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg_countdown: COS_URL + '/public/img/couponActivity/bg_countdown.png', //活动倒计时背景图
    bg_title: COS_URL + '/public/img/couponActivity/bg_title.png', //活动倒计时文案
    bg_num: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAB4UExURUdwTP1fDv1fDvyAEf1fDv1eDv2dEv96D/2fEv+LEP+tAP2gE/2iEv6hE/1yD/2ZEv5eDf1dDfyCEP10EP1rD/1wD/1eDv2DEf1/EP1lD/1nD/2JEf15EP2QEf1iDv2VEv1gDv2cEv18EP2NEf2GEf1kDv2YEv2hE+EXOTwAAAATdFJOUwCR+kbhcJYscxsD2/i3/eesxV73FLY1AAABAklEQVQ4y7XVSRKCMBAF0BAQCEMxz4NEVO5/Q+2EknKDPwuzftXV/HRoFrA/H89N1mG4N03b3saxKIqqqsqy7Puue8wzdyzvsP51Wk/wstT8ctjrNJ3jut6190Qw1524EK4thRMMO2SFxDAnbJtgXxq04WKYZ4RjaZBGCGK6lUCC2Kb7Q7FQyYEfSF34GF4ynRxWOaXKMYa5Si4BK+c0RhuIaZw9FFNyOYjVGPkg1mMEYj1GIFaPOwKxrZIDMSVng5gHKgwM6weI4SXVyWGV9+SwyntyWGVKjm0gFgZtOMwgDRUGE9B17z9yaETnY6FEv/B7+XzWpXDDM/y11uBjtIyDFz/BoiVUR/98AAAAAElFTkSuQmCC',
    icon_arrow_up: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAY9JREFUaEPtme1tg0AQROc6SCdxCU4lFp0kHaQEKsEuwekkHRDhQGJbgGfvZoQsHb/h9N7ufcyJhCd/0pPzowps3cHagdqBwgrYp1C/x0s64buQc/Fzq8AAj4QjEs6pQ+OQsAlcwe9G8NYhYRGYgZ+KL5eQC6zAWySkAgS8XEImsALfoMceCYe7RSyZThKBNfjUoR3A+ze0DoliAQZ+qrxDokggAu+SyBbIgXdIZAmUwKslwgIKeKVESEAJr5KgBRzwCgleYH4fb6Z9filpsnF6YYv9SB3e11IsL/AbjU9IeB0HpOAjcfpGosfXcII/ukvQApfT9F/ik6n8CB+K0xcJYMfAD0whAfZCUhqn2WlnESASqSTETcWUdoCAr3H6fhpLOsCcEY4kKlkDDLziwFraQIo6EIF3SWQL5MA7JLIESuDVEmEBBbxSIiSghFdJ0AIOeIUEL5AZp+n8ND/+tnGahZ/txNZxOgp/I7F1nM6F/5MI/BSh10AplOv7KuCqLDtu7QBbKdd7tQOuyrLj/gBHNfgxlHsxQAAAAABJRU5ErkJggg==',
    prizeInfo: '', //奖励信息
    // 2021年8月26日 星期四 开箱活动券
    icon_less: '<',
    //2021年9月17日 更新兑换券说明
    icon_coin: COS_URL + '/public/img/couponActivity/icon_coin.png',
    icon_tt: COS_URL + '/public/img/couponActivity/icon_tt.png',
    icon_box: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG8AAABJCAMAAAAE7oh5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACuUExURUdwTHgkDL1zDJk/EOJjGfuvB4MxC8V6DPapB4E7ANSICf66C/66C81WFt+YC+6bBPCnCvUOGf61CP64Cv+vBPkmHPcaGvYSGv+sA/68DPozHvs4HvkrHfovHfggG/YVGv+xBf1IIP6yBvxCH/5OIfgiHPcdG/YXGvw8H/9TIfE3HXs5JeQ7G/agB+hcMvezDOKdDe+sDfRIHtaFCN5JGOaRBfJyGJNRILx5GLBqGbKEBYcAAAAQdFJOUwAwnFTHLxwO5gVvyp3Q6qzkU8dsAAAD00lEQVRYw92ZDVvaMBCAZQxKERUoHy2gYotSunbFqt32///YckkurbQXqgbns5fSR4Hcy4U0OcLZ2SFWf3DuCZI8//lW8jxxROvzQd86O0Z3IF2eu7sdzeejNzMfzbMEgww6Wpvdxxd6+TtUhXM3VkZNjhZ2pJcuRh9jqlI87xzXJfej96Y3h5bstFXCHiG0mc7x4MN2p/OPc1sI67t04EjGy7kJpj6PBl1al11H6fJbM2wwotevEZ7js+7D1hAJhuzZ1fTGyG5miG0gI9YlOECdfz8zRoJBq59gD99L/mCKm1muOu2wQ+2iO2/MEaioh5eE5SPBvTFuVipqh/StpgZp4Jt+sm9lkjXpWyPXJplg1Hf6FuwerYoDHli8yzdBFhRLdr+OOKvSeaFDRaV9S5poIXRRrE7g07Ro4AspQBjFhzDjkmwSuqTPRci2QQi659eAMND4kAOfXfgCijDL4jiZuK9InuMooKn32bZtJcmQH8kdRZBFcT5hPeTjwXDzOMsCso2K2mGOQmdZ3UQwpH13LL+EDW1/4svDZ//4zHen8cmoHctCIdN1u60XZEOSZc+JX+E5y+gmKmq720Uh17WfkB0J+MYVwEe12Kio7RYIMb3WVa8Jl5cpVwz3gPRdXjZqe9WSCYKuzYfa65HHhwPvMbHuj9N0uE+hftv/4PwRtdD+MZVfUKB65QWeqEsAGFEyXLslElS+wgQumPTEBzSGGwN9zm/h+1XySVPJBjcYUf5kLa74PuGTE0Lhw/x88EEa6BNJifzg4DZH1V1cB4gLp4lvXUpP5Ef4KvlVfIbzK4z/a37OJ+fnnSQ/4np4S34g7B31yfzgD/SJh5v62ji/gK/V/oZ8p7m4GEKkJzm/iLgXF5oWKmoxf8r1YY/o52v+rvd8Ck7Xcn3Y0E1U1NL6wJfb7iNCrCy7DfeJ6o4nJis97XqkopbWPyFMEf36N6kQ63wqanl954OUDWg22FPP0a7vL0qD4yrRre+bVAT1vEp9xjdC4BlN/ZLFuXsIq1/o8uVOBk1rfXwZczTVFhRMFV2UaVrIoDX5qeuHrgfDsK7ezVhlSvuQGh+fkjwn1BS8AVbz6ojCKNTAd18In4T6KsDq+YgdIVcu8cx08FRINNLld8SH31lK5+OMSZ+q7xbNiY6+QkU14luY8Bn9Pt3AZ3S/wP8yvn+2//LZvnuTNPDdmKTB/pJZ3/H9pQeTNNjPmpmkwX6WWd/x/aWtSRr4bk3ifj3f3CQN9uvM+oj9upJvZBLSZ5/WN+lWfh47qa/6A1mnd0pfp+6X8N6pfFeF7i+VWvUo/4PgfwAAAABJRU5ErkJggg==',
    //2022年8月9日
    act_state: '', //活动状态：从actInfo里面取
    icon_act_explain: COS_URL + '/public/img/bfyl/202208/icon_act_explain.png', //icon 活动说明
    title_exchange_rule: COS_URL + '/public/img/couponActivity/title_exchange_rule.png',
    bg_title_end: COS_URL + '/public/img/bfyl/202208/unbox_btn_end.png', //活动已结束文案
    icon_act_rule: COS_URL + '/public/img/bfyl/202208/icon_act_rule.png', //icon 活动奖励规则
    icon_act_attention: COS_URL + '/public/img/bfyl/202208/icon_act_attention.png', //icon 活动注意事项
    icon_act_note: COS_URL + '/public/img/bfyl/202208/icon_act_note.png', //icon 活动免责
    // 2023年7月24日
    banner: `${COS_URL}/public/img/bfyl/2023/07/unbox/img_banner.png`, //活动banner图
    unbox_banner_rule: `${COS_URL}/public/img/bfyl/2023/07/unbox/img_coupon_explain.png`, //icon 活动说明
    bg_act_progress: `${COS_URL}/public/img/bfyl/2023/07/unbox/bg_pop.png`, //活动开箱进度背景图
    bg_title_red: `${COS_URL}/public/img/bfyl/2023/07/unbox/bg_title_red.png`, //活动开箱进度标题背景
    icon_star_grey: `${COS_URL}/public/img/bfyl/2023/07/unbox/icon_star_grey.png`, //星星图标
    img_btn_apply: `${COS_URL}/public/img/bfyl/2023/07/unbox/img_btn_apply.png`, //报名按钮
    act_state_bg: `${COS_URL}/public/img/bfyl/2023/07/unbox/bg_title.png`, // 活动倒计时背景
    bg_btn: `${COS_URL}/public/img/bfyl/2023/07/unbox/bg_btn.png`, // 开箱按钮背景
    bg_bth_purple: `${COS_URL}/public/img/bfyl/2023/07/unbox/bg_bth_purple.png`, // 去使用背景
    actInfo: null, //活动信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    utils.getUserInfoNew().then(res => {
      this.setData({
        userInfo: res
      })
    }).catch(err => {});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    utils.getNavbarData().then(res => {
      if (res) {
        this.setData({
          navBarSystem: res,
        })
      }
    });


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.actCouponGetInfo();
  },
  //获取活动券 开箱活动信息
  async actCouponGetInfo() {
    try {
      // 获取活动信息
      let result = await shopActUtil.act5_getinfo_sz();
      log.addFilterMsg('unboxBase');
      log.info(result);
      if (!result.actInfo) {
        return wx.showModal({
          title: '温馨提示',
          content: result.msg,
          showCancel: false
        })
      };
      let {
        actInfo
      } = result;
      // let {
      //   kpi_1,
      //   act_state
      // } = actInfo;
      // // 获得活动券的规则：0.5倍 || 3箱送2罐
      // actInfo.coupon_reward_rule = kpi_1 > 19 ? '0.5倍' : '（3箱送2罐）';
      // // 再开箱数，可再获得活动券数
      // let next_unbox_num = 0,
      //   next_coupon_num = 0;
      // // 活动进行中才有最少、最多可获得券数（非预热）
      // if (!act_state.act_yure) {
      //   let {
      //     min_num = 0, max_num = 0, s_num, rev_num, kpi_1, kpi_2
      //   } = actInfo;
      //   // 开箱目标，小于最小目标取最小目标，最多不超过最大目标
      //   let unbox_target = s_num >= kpi_1 ? kpi_2 : kpi_1;
      //   next_unbox_num = unbox_target - s_num;
      //   next_unbox_num = next_unbox_num < 0 ? 0 : next_unbox_num;
      //   let reward_target = rev_num >= min_num ? max_num : min_num;
      //   next_coupon_num = reward_target - rev_num;
      //   next_coupon_num = next_coupon_num < 0 ? 0 : next_coupon_num;
      // }

      // //开箱进度条
      // let progressPercent = parseFloat((actInfo.s_num / actInfo.kpi_2).toFixed(2)) * 100;
      // if (progressPercent > 100) progressPercent = 100;
      console.log("actInfo：", actInfo);
      this.setData({
        actInfo: actInfo,
        act_state: actInfo.act_state,
      })

    } catch (error) {
      console.log("actCouponGetInfo catch:", error);
    }
  },

  //领奖前判断店长身份，店员提示：请通知店长领取
  async shopManager() {
    //根据
    let userdata = this.data.userInfo || await utils.getUserInfoNew();
    console.log("用户信息：", userdata)
    //condition:0 普通，1店主，2店员
    if (userdata.condition != 2) {
      this.getAward();
    } else {
      wx.showModal({
        title: '温馨提示',
        content: "请通知店长领取",
        showCancel: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  back: function () {
    wx.navigateBack({
      delta: 0,
      fail: (err) => {
        console.log(err);
        wx.switchTab({
          url: '/pages/tabBar/shouye/index',
        })
      }
    })
  },
  scrollTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    })
  },
  // 跳转扫一扫
  goScan: function () {

    let url = "/pages/zongduan/saoma/index?hide=1";
    //获取当前页面栈
    let pages = getCurrentPages() || [];
    if (pages.length) {
      //查询排行榜页面索引
      let pageIndex = pages.findIndex(item => item.route == 'pages/zongduan/saoma/index');
      console.log(pages, pageIndex);
      //找到索引的，返回至排行榜页（wx.navigateBack关闭当前页面）
      if (pageIndex > -1) {
        pages[pageIndex].setData({
          isBackPage: true
        });
        wx.navigateBack({
          delta: pageIndex,
        })
        return
      }
    }
    //页面栈里无指定页面再跳转（小程序中页面栈最多10层，超出会报错：fail webview count limit exceed）
    if (url) {
      wx.navigateTo({
        url: url,
      })
    }


  },
  //跳转卡券
  useCoupon() {
    let url = "/pages/phaseIII/voucher/index?activeTab=2";
    wx.navigateTo({
      url: url,
    })
  },

  actRule(event) {
    // wx.pageScrollTo({
    //   selector: "#act-rule",
    //   duration: 300,
    // })
    const {
      url = ''
    } = event.currentTarget.dataset;
    if (!url) return;
    const {
      actInfo
    } = this.data;
    const params = `?actInfo=${ encodeURIComponent(JSON.stringify(actInfo)) }`;
    console.log(url);
    utils.navigateFrequentPage(url, params);
  },
  goToRecord() {
    wx.navigateTo({
      url: '/pages/shopActivity/unboxAct/awardRecord/index',
    })
  },
  //排行榜活动：定时器结束触发
  rankTimerFinished(event) {
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
  unboxSignUp() {
    this.selectComponent("#actCouponPop").showActApplyCheckPop();
  },
  openPageParam(event) {
    const {
      url = '',
      params = ''
    } = event.currentTarget.dataset;
    if (!url) return;
    console.log(url);
    utils.navigateFrequentPage(url, params)
  },
  testPop() {
    // this.selectComponent("#actCouponPop").showDailyProcessPop();
    // this.selectComponent("#actCouponPop").showNotTransferPop({actInfo:null});
    // this.selectComponent("#actCouponPop").showNotUnboxPop();
    // this.selectComponent("#actCouponPop").showActEndPop();
    // this.selectComponent("#actCouponPop").showWinPop();
    // this.selectComponent("#actCouponPop").showActApplyCheckPop();
    // this.selectComponent("#actCouponPop").showUnboxApplySuccess();
  }

})