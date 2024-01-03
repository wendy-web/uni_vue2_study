// pages/storeRank/index.js
let app = getApp();
let COS_URL = app.globalData.COS_URL;
const storeRankNum = app.globalData.storeRankNum;
const utils = require('../../../utils/util');
import {prizeConfig} from '../config/index';
import storeRankUtils from '../../../api/storeRank/utils'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title_bg: COS_URL + "/public/img/storeRank/20210121/title_bg.png",
    userInfo: null, //用户信息
    activityText: '距离活动开始时间:', //开始后：距离活动结束时间
    storeRankArea:utils.storeRankArea,//店铺排行榜活动区域
    storeRankNum:storeRankNum,//店铺排行榜上榜人数
    // 2023年4月17日
    img_hn_28th:`${COS_URL}/public/img/storeRank/202305/icon_hb_28.png`,
    bg_head: `${COS_URL}/public/img/storeRank/202304/bg_head.png`,
    img_title_can: `${COS_URL}/public/img/storeRank/202304/img_title_can.png`,
    img_hn_can:`${COS_URL}/public/img/storeRank/202304/img_hn_can.png`, // 红牛罐装
    img_hn_box:`${COS_URL}/public/img/storeRank/202304/img_hn_box.png`, // 红牛箱装
    prizeConfig:prizeConfig,// 奖品设置
    img_head_mask:`${COS_URL}/public/img/storeRank/202304/img_head_mask.png`,//顶部海报蒙层
    img_content_mask:`${COS_URL}/public/img/storeRank/202304/img_content_mask.png`,//内容蒙层
    rankInfo:null,// 店铺排行榜活动信息
    hnTitle:app.globalData.hnTitle,// 红牛产品标题
    img_banner:`${COS_URL}/public/img/storeRank/202305/img_banner.png`,//大背景图：开箱冲榜+奖励
    icon_unbox:`${COS_URL}/public/img/storeRank/202305/icon_unbox.png`,// 如何参与开箱图标
    btnCheckDetail: `${COS_URL}/public/img/storeRank/20210121/check_detail.png`, //按钮-查看详情
    img_cos_url:`${COS_URL}/public/img/bfyl/2023/08/img`,//原有images静态文件移到cos上
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
    let rankInfo = options.rankInfo || null;
    if(rankInfo){
      rankInfo = JSON.parse(decodeURIComponent(rankInfo))
    }else{
      let res = await storeRankUtils.unboxGetInfo();
      rankInfo = res.rankInfo;
    }
    if(!rankInfo)return;
    let {s_time,e_time} = rankInfo;
    rankInfo.rank_start_date = utils.parseTime(new Date(s_time.replace(new RegExp(/-/gm), '/')).getTime(),"{y}年{m}月{d}日")
    rankInfo.rank_end_date = utils.parseTime(new Date(e_time.replace(new RegExp(/-/gm), '/')).getTime(),"{y}年{m}月{d}日")
    this.setData({
      rankInfo
    })
  },
  //排行榜活动：定时器结束触发
  rankTimerFinished(event) {
    let rankInfo = this.data.rankInfo;
    //活动未结束刷新倒计时
    if (!rankInfo.act_state.act_end) {
      //根据时间重新计算 活动状态
      let {
        s_time,
        e_time
      } = rankInfo
      let act_state = storeRankUtils.init_act_state({
        s_time,
        e_time
      });
      console.log("倒计时结束重置活动状态：", act_state)
      rankInfo.act_state = act_state;
      this.setData({
        rankInfo
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
    let {rankInfo} = this.data;
    if(rankInfo&&rankInfo.status != '未报名'){
      // 已报名
      this.selectComponent('#storeRank').showActAppliedPop();
      return
    }
    // 报名确认弹窗
    this.selectComponent('#storeRank').showActApplyCheckPop();
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
    return utils.navigateFrequentPage("pages/storeRank/rank/index");
  },
  // 测试需删除
  tapTest(){
    let {rankInfo} = this.data;
    //测试需删除弹窗
    // this.selectComponent('#storeRank').showSignUpPop(); //报名弹窗
    // this.selectComponent('#storeRank').showActApplySuccessPop(rankInfo); //报名弹窗
    // this.selectComponent('#storeRank').showRaffleApplyPop(); //抽奖报名弹窗
    // this.selectComponent('#storeRank').showRaffleApplySuccessPop(); //抽奖报名成功弹窗
    // this.selectComponent('#storeRank').showSzExcDailyPop(); //每日进度弹窗
    // this.selectComponent('#storeRank').raffleNoWinPop({rankInfo:null}); //未中奖
    // this.selectComponent('#storeRank').showNotTransferPop({rankInfo:null,popname:'raffleNotTransferShow'}); //不可转让店铺
    this.selectComponent('#storeRank').raffleWinPop({rankInfo:null}); //活动结束 中奖
  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})