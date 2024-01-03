// pages/couponActivity/gzUnbox/signUp/index
let app = getApp();
let COS_URL = app.globalData.COS_URL;
const utils = require('../../../../utils/util');
import {unboxInitPrizeConfig} from '../../config/index';
import shopActUtils from '../../../../api/shopActivity/utils'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_arrow_up: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAY9JREFUaEPtme1tg0AQROc6SCdxCU4lFp0kHaQEKsEuwekkHRDhQGJbgGfvZoQsHb/h9N7ufcyJhCd/0pPzowps3cHagdqBwgrYp1C/x0s64buQc/Fzq8AAj4QjEs6pQ+OQsAlcwe9G8NYhYRGYgZ+KL5eQC6zAWySkAgS8XEImsALfoMceCYe7RSyZThKBNfjUoR3A+ze0DoliAQZ+qrxDokggAu+SyBbIgXdIZAmUwKslwgIKeKVESEAJr5KgBRzwCgleYH4fb6Z9filpsnF6YYv9SB3e11IsL/AbjU9IeB0HpOAjcfpGosfXcII/ukvQApfT9F/ik6n8CB+K0xcJYMfAD0whAfZCUhqn2WlnESASqSTETcWUdoCAr3H6fhpLOsCcEY4kKlkDDLziwFraQIo6EIF3SWQL5MA7JLIESuDVEmEBBbxSIiSghFdJ0AIOeIUEL5AZp+n8ND/+tnGahZ/txNZxOgp/I7F1nM6F/5MI/BSh10AplOv7KuCqLDtu7QBbKdd7tQOuyrLj/gBHNfgxlHsxQAAAAABJRU5ErkJggg==',
    bg_num: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAB4UExURUdwTP1fDv1fDvyAEf1fDv1eDv2dEv96D/2fEv+LEP+tAP2gE/2iEv6hE/1yD/2ZEv5eDf1dDfyCEP10EP1rD/1wD/1eDv2DEf1/EP1lD/1nD/2JEf15EP2QEf1iDv2VEv1gDv2cEv18EP2NEf2GEf1kDv2YEv2hE+EXOTwAAAATdFJOUwCR+kbhcJYscxsD2/i3/eesxV73FLY1AAABAklEQVQ4y7XVSRKCMBAF0BAQCEMxz4NEVO5/Q+2EknKDPwuzftXV/HRoFrA/H89N1mG4N03b3saxKIqqqsqy7Puue8wzdyzvsP51Wk/wstT8ctjrNJ3jut6190Qw1524EK4thRMMO2SFxDAnbJtgXxq04WKYZ4RjaZBGCGK6lUCC2Kb7Q7FQyYEfSF34GF4ynRxWOaXKMYa5Si4BK+c0RhuIaZw9FFNyOYjVGPkg1mMEYj1GIFaPOwKxrZIDMSVng5gHKgwM6weI4SXVyWGV9+SwyntyWGVKjm0gFgZtOMwgDRUGE9B17z9yaETnY6FEv/B7+XzWpXDDM/y11uBjtIyDFz/BoiVUR/98AAAAAElFTkSuQmCC',
    title_bg: COS_URL + "/public/img/storeRank/20210121/title_bg.png",
    userInfo: null, //用户信息
    activityText: '距离活动开始时间:', //开始后：距离活动结束时间
    storeRankArea:utils.storeRankArea,//店铺排行榜活动区域
    // 2023年4月17日
    img_hn_28th:`${COS_URL}/public/img/storeRank/202305/icon_hb_28.png`,
    bg_head: `${COS_URL}/public/img/storeRank/202304/bg_head.png`,
    img_title_can: `${COS_URL}/public/img/storeRank/202304/img_title_can.png`,
    img_hn_can:`${COS_URL}/public/img/storeRank/202304/img_hn_can.png`, // 红牛罐装
    img_hn_box:`${COS_URL}/public/img/storeRank/202304/img_hn_box.png`, // 红牛箱装
    prizeConfig:'',// 奖品设置
    img_head_mask:`${COS_URL}/public/img/storeRank/202304/img_head_mask.png`,//顶部海报蒙层
    img_content_mask:`${COS_URL}/public/img/storeRank/202304/img_content_mask.png`,//内容蒙层
    actInfo:null,// 店铺排行榜活动信息
    hnTitle:app.globalData.hnTitle,// 红牛产品标题
    icon_unbox:`${COS_URL}/public/img/storeRank/202305/icon_unbox.png`,// 如何参与开箱图标
    btnCheckDetail: `${COS_URL}/public/img/storeRank/20210121/check_detail.png`, //按钮-查看详情
    img_cos_url:`${COS_URL}/public/img/bfyl/2023/08/img`,//原有images静态文件移到cos上
    file_url_gzunbox:`${COS_URL}/public/img/bfyl/2023/08/gzUnbox`,//广州开箱活动资源
    icon_act_explain: COS_URL + '/public/img/bfyl/202208/icon_act_explain.png', //icon 活动说明
    icon_act_rule: COS_URL + '/public/img/bfyl/202208/icon_act_rule.png', //icon 活动奖励规则
    icon_act_attention: COS_URL + '/public/img/bfyl/202208/icon_act_attention.png', //icon 活动注意事项
    icon_act_note: COS_URL + '/public/img/bfyl/202208/icon_act_note.png', //icon 活动免责
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initOptions(options)
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
   
  },
  async initOptions(options){
    console.log("initOptions:",options)
    let actInfo = options.actInfo || null;
    if(actInfo){
      actInfo = JSON.parse(decodeURIComponent(actInfo))
    }else{
      let res = await shopActUtils.gzUnboxActInfo();
      actInfo = res.actInfo;
    }
    if(!actInfo)return;
    let {s_time,e_time} = actInfo;
    actInfo.rank_start_date = utils.parseTime(new Date(s_time.replace(new RegExp(/-/gm), '/')).getTime(),"{y}年{m}月{d}日")
    actInfo.rank_end_date = utils.parseTime(new Date(e_time.replace(new RegExp(/-/gm), '/')).getTime(),"{y}年{m}月{d}日")
    let prizeConfig = unboxInitPrizeConfig(actInfo.calc.rule)
    this.setData({
      actInfo,
      prizeConfig
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
        e_time,
        status
      } = actInfo
      let act_state = shopActUtils.initActState({
        s_time,
        e_time,
        status,
        inActName:'inUnboxAct_GZ',
        dailyPopName:'daily_pop_act_16'
      });
      console.log("倒计时结束重置活动状态：", act_state)
      actInfo.act_state = act_state;
      this.setData({
        actInfo
      })
      if(act_state.act_ing){
        wx.redirectTo({
          url: '/pages/storeRank/rank/index',
        })
      }
    }
  },
  //开启消息通知
  async openNotice(e) {
    try {
      let tmplIds = await utils.getMID(2);
      if(tmplIds.length){
        let subscribe = await wx.requestSubscribeMessage({tmplIds});
      }
      //订阅消息授权
      this.goRankIndex();
    } catch (error) {
      console.log("openNotice catch:",error);
      this.goRankIndex();
    }
  },
  back: function () {
    wx.navigateBack({
      delta: 0,
      fail(){
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
  // 报名按钮点击事件
  signup(){
    let {actInfo} = this.data;
    if(actInfo&&actInfo.status != '未报名'){
      // 已报名
      this.selectComponent('#actCouponPop').showGzUnboxAppliedPop ();
      return
    }
    // 报名确认弹窗
    this.selectComponent('#actCouponPop').showGzUnboxApplyCheckPop();
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
  goRankIndex(event){
    return utils.navigateFrequentPage("pages/couponActivity/gzUnbox/index/index");
  },
  // 测试需删除
  tapTest(){
    let {actInfo} = this.data;
    // // 判断是否禁止转让店铺
    // const inAct = this.selectComponent('#forbiddenTransShop').isForbiddenTransShop({
    //   tips: '暂不可加入其它门店'
    // });
    // if (inAct) return;
    //测试需删除弹窗
    // this.selectComponent('#actCouponPop').showGzUnboxApplyPop(actInfo); //报名弹窗
    // this.selectComponent('#actCouponPop').showGzUnboxApplyCheckPop(); //报名确认弹窗
    // this.selectComponent('#actCouponPop').showGzUnboxApplySuccess(actInfo); //报名成功弹窗
    // this.selectComponent('#actCouponPop').showGzUnboxDailyPop(actInfo); //每日进度弹窗
    this.selectComponent('#actCouponPop').showGzUnboxWinPop(actInfo); //中奖弹窗
    // this.selectComponent('#storeRank').showNotTransferPop({actInfo:null,popname:'raffleNotTransferShow'}); //不可转让店铺
  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})