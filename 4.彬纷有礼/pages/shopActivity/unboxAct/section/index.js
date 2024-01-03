// pages/shopActivity/unboxAct/base/index.js

let app = getApp();
let COS_URL = app.globalData.COS_URL;
const auth = require('../../../../utils/auth.js');
const utils = require('../../../../utils/util');
const log = require('../../../../utils/log');
let actCouponPath = ''; //活动跳转路径
let actCouponTimer = ''; //开箱活动券倒计时
let _request = false;
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
    act_pop_success: false, //活动奖励领取成功弹窗
    prizeInfo: '', //奖励信息
    // 2021年8月26日 星期四 开箱活动券
    act_updatePop: false, //每日弹窗
    bg_act_updatePop: COS_URL + '/public/img/couponActivity/pop/bg_box_progress.png',
    bg_act_ing: '', //活动进行中弹窗背景
    act_EndPop: false, //活动结束弹窗
    bg_act_get_award: COS_URL + '/public/img/couponActivity/pop/title_earned.png', //活动领奖弹窗背景标题
    bg_act_get_award_icon: COS_URL + '/public/img/couponActivity/pop/icon_ticker_tape.png', //活动领奖弹窗丝带
    act_unclaimed: true, // 未领奖
    end_more_seven: false, //活动结束7天内
    // bg_act_earned: '', //活动已领奖弹窗背景
    bg_act_end: '', //活动结束背景
    act_countDown: '', //倒计时文案
    act_remain_day: '', //活动剩余天数
    act_coupon_num: '', //活动券数
    icon_less: '<',
    //2021年9月17日 更新兑换券说明
    icon_coin: COS_URL + '/public/img/couponActivity/icon_coin.png',
    icon_tt: COS_URL + '/public/img/couponActivity/icon_tt.png',
    icon_box: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG8AAABJCAMAAAAE7oh5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACuUExURUdwTHgkDL1zDJk/EOJjGfuvB4MxC8V6DPapB4E7ANSICf66C/66C81WFt+YC+6bBPCnCvUOGf61CP64Cv+vBPkmHPcaGvYSGv+sA/68DPozHvs4HvkrHfovHfggG/YVGv+xBf1IIP6yBvxCH/5OIfgiHPcdG/YXGvw8H/9TIfE3HXs5JeQ7G/agB+hcMvezDOKdDe+sDfRIHtaFCN5JGOaRBfJyGJNRILx5GLBqGbKEBYcAAAAQdFJOUwAwnFTHLxwO5gVvyp3Q6qzkU8dsAAAD00lEQVRYw92ZDVvaMBCAZQxKERUoHy2gYotSunbFqt32///YckkurbQXqgbns5fSR4Hcy4U0OcLZ2SFWf3DuCZI8//lW8jxxROvzQd86O0Z3IF2eu7sdzeejNzMfzbMEgww6Wpvdxxd6+TtUhXM3VkZNjhZ2pJcuRh9jqlI87xzXJfej96Y3h5bstFXCHiG0mc7x4MN2p/OPc1sI67t04EjGy7kJpj6PBl1al11H6fJbM2wwotevEZ7js+7D1hAJhuzZ1fTGyG5miG0gI9YlOECdfz8zRoJBq59gD99L/mCKm1muOu2wQ+2iO2/MEaioh5eE5SPBvTFuVipqh/StpgZp4Jt+sm9lkjXpWyPXJplg1Hf6FuwerYoDHli8yzdBFhRLdr+OOKvSeaFDRaV9S5poIXRRrE7g07Ro4AspQBjFhzDjkmwSuqTPRci2QQi659eAMND4kAOfXfgCijDL4jiZuK9InuMooKn32bZtJcmQH8kdRZBFcT5hPeTjwXDzOMsCso2K2mGOQmdZ3UQwpH13LL+EDW1/4svDZ//4zHen8cmoHctCIdN1u60XZEOSZc+JX+E5y+gmKmq720Uh17WfkB0J+MYVwEe12Kio7RYIMb3WVa8Jl5cpVwz3gPRdXjZqe9WSCYKuzYfa65HHhwPvMbHuj9N0uE+hftv/4PwRtdD+MZVfUKB65QWeqEsAGFEyXLslElS+wgQumPTEBzSGGwN9zm/h+1XySVPJBjcYUf5kLa74PuGTE0Lhw/x88EEa6BNJifzg4DZH1V1cB4gLp4lvXUpP5Ef4KvlVfIbzK4z/a37OJ+fnnSQ/4np4S34g7B31yfzgD/SJh5v62ji/gK/V/oZ8p7m4GEKkJzm/iLgXF5oWKmoxf8r1YY/o52v+rvd8Ck7Xcn3Y0E1U1NL6wJfb7iNCrCy7DfeJ6o4nJis97XqkopbWPyFMEf36N6kQ63wqanl954OUDWg22FPP0a7vL0qD4yrRre+bVAT1vEp9xjdC4BlN/ZLFuXsIq1/o8uVOBk1rfXwZczTVFhRMFV2UaVrIoDX5qeuHrgfDsK7ezVhlSvuQGh+fkjwn1BS8AVbz6ojCKNTAd18In4T6KsDq+YgdIVcu8cx08FRINNLld8SH31lK5+OMSZ+q7xbNiY6+QkU14luY8Bn9Pt3AZ3S/wP8yvn+2//LZvnuTNPDdmKTB/pJZ3/H9pQeTNNjPmpmkwX6WWd/x/aWtSRr4bk3ifj3f3CQN9uvM+oj9upJvZBLSZ5/WN+lWfh47qa/6A1mnd0pfp+6X8N6pfFeF7i+VWvUo/4PgfwAAAABJRU5ErkJggg==',
    progressPercent: '', //进度条百分比
    //2022年8月9日
    act_state:'',//活动状态：从actInfo里面取
    icon_act_explain: COS_URL + '/public/img/bfyl/202208/icon_act_explain.png', //icon 活动说明
    unbox_banner_rule: COS_URL + '/public/img/bfyl/202208/unbox_banner_rule_section_1.png', //icon 活动说明
    banner: COS_URL + "/public/img/bfyl/202208/unbox_banner.png", //活动banner图
    bg_act_progress: COS_URL + '/public/img/bfyl/202208/bg_act_progress.png', //活动开箱进度背景图
    title_exchange_rule: COS_URL + '/public/img/couponActivity/title_exchange_rule.png',
    bg_title_end: COS_URL + '/public/img/bfyl/202208/unbox_btn_end.png', //活动已结束文案
    icon_act_rule: COS_URL + '/public/img/bfyl/202208/icon_act_rule.png', //icon 活动奖励规则
    icon_act_attention: COS_URL + '/public/img/bfyl/202208/icon_act_attention.png', //icon 活动注意事项
    icon_act_note: COS_URL + '/public/img/bfyl/202208/icon_act_note.png', //icon 活动免责

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

    utils.getUserInfoNew().then(res => {
      this.setData({
        userInfo: res
      })
    }).catch(err => {});
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
      let result = await shopActUtil.act2_getinfo();
      log.addFilterMsg('unboxBase');
      log.info(result);
      if (!result.act_info) {
        return wx.showModal({
          title: '温馨提示',
          content: "您未参与此活动",
          showCancel: false
        })
      };
      let {act_info:actInfo} = result;

      actInfo.exp_date = utils.parseTime(actInfo.exp_time, "{y}年{m}月{d}日");
      // 最高可获得活动券
      let act_coupon_num = 0;
      //深圳开箱活动规则issues：4 基数*倍数 kpi_num * kpi_1
      act_coupon_num = Math.ceil(actInfo.kpi_num * actInfo.kpi_1); //向上取整
      console.log("act_coupon_num:",act_coupon_num);
      actInfo.act_coupon_num = act_coupon_num;
      let progressPercent = actInfo.s_num/actInfo.kpi_num*100;
      if(progressPercent>100)progressPercent=100;
      console.log("actInfo：",actInfo);
      this.setData({
        actInfo:actInfo,
        act_state:actInfo.act_state,
        act_coupon_num,
        progressPercent
      })
     
    } catch (error) {
      console.log("actCouponGetInfo catch:", error);
    }
  },
  
  //开箱活动券倒计时
  act_warmUpCountdown(startTime, endTime) {
    //清除，防止开启多次
    clearInterval(actCouponTimer)
    //开始倒计时
    actCouponTimer = setInterval(() => {

      let time = startTime - Date.now()
      //到活动开始时间
      if (time <= 0) {
        clearInterval(actCouponTimer);
        this.setData({
          act_yure: false
        });
        this.cutOffCountdown(endTime)
        return
      }
      //正常预热倒计时   
      let countDown = utils.countDownTime(time, false);
      this.setData({
        act_countDown: countDown
      })


    }, 1000)

  },
  //开箱活动券：活动截止倒计时
  act_cutOffCountdown(endTime) {
    clearInterval(actCouponTimer)
    actCouponTimer = setInterval(() => {

      let time = endTime - Date.now();

      //活动结束
      if (time <= 0) {
        clearInterval(actCouponTimer)
        this.setData({
          act_End: true, //活动结束
        })
        return
      }
      //正常活动截止倒计时 
      let countDown = utils.act_countDownTime(time, false);
      this.setData({
        act_countDown: countDown
      })

    }, 1000)
  },
  act_findOutDetail: utils.throttle(() => {
    //关闭所有弹窗
    let url = actCouponPath;
    that.setData({
      act_EndPop: false,
      act_updatePop: false,
    })

  }, 2000),
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
    this.setData({
      act_EndPop: false,
      act_updatePop: false
    })
    let url = "/pages/zongduan/saoma/index";
    //获取当前页面栈
    let pages = getCurrentPages() || [];
    if (pages.length) {
      //查询排行榜页面索引
      let pageIndex = pages.findIndex(item => item.route == 'pages/zongduan/saoma/index');
      console.log(pages, pageIndex);
      //找到索引的，返回至排行榜页（wx.navigateBack关闭当前页面）
      if (pageIndex > -1) {
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
    this.setData({
      act_EndPop: false,
      act_pop_success: false
    })
    let url = "/pages/phaseIII/voucher/index?activeTab=2";
    wx.navigateTo({
      url: url,
    })
  },
  openActEndPop() {
    this.setData({
      act_EndPop: true
    })
  },
  actRule() {
    wx.pageScrollTo({
      selector: "#act-rule",
      duration: 300,
    })
  },
  goToRecord() {
    wx.navigateTo({
      url: '/pages/shopActivity/unboxAct/awardRecord/index',
    })
  }

})