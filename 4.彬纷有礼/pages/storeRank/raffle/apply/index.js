// pages/storeRank/raffle/apply/index.js 抽奖报名参与页面
const app = getApp();
const COS_URL = app.globalData.COS_URL;
// 引入赢手机报名接口
import {
  signUp14,
} from '../../../../api/storeRank/api';
import storeRankUtils from '../../../../api/storeRank/utils';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyDisabled:true, // 报名禁用按钮
    countTime: 30000, // 按钮倒计时
    loading:false,// 按钮加载中
    actInfo:null,//活动参与信息
    file_cos_url:`${COS_URL}/public/img/bfyl/2023/08`

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // this.test()
  },
  async initData(){
    try {
      // 获取活动参与信息
      let {actInfo} = await storeRankUtils.actInfo14();
      this.setData({
        actInfo
      })
    } catch (error) {
      console.log("抽奖报名页 catch:",error);
    }
  },
  async clickApply(event){
    wx.showToast({
      title: '加载中···',
      mask:true
    })
    try {
      let res = await signUp14();
      wx.hideLoading()
      let {code,msg,data} = res;
      if(+code!=1 || !data.lucky_number){
        wx.showModal({
          title: '温馨提示',
          content: msg,
          showCancel:false,
          success:(_res)=>{
            if(res.confirm && code == 1){
              wx.redirectTo({
                url: '/pages/storeRank/rank/index',
              })
            }
          }
        })
        return
      }
      data.lucky_number = String(data.lucky_number).padStart(10,'0');
      data.numArr = String(data.lucky_number).split("");
      // 报名成功
      let {actInfo} = this.data;
      actInfo.raffleInfo = data;
      this.selectComponent("#storeRank").showRaffleApplySuccessPop(actInfo);
    } catch (error) {
      console.log("报名失败catch:",error);
      wx.hideLoading();
    }
  },
  countTimeFinished(event){
    this.setData({
      applyDisabled:false
    })
  },
  test(){
    let {actInfo} = this.data;
    this.selectComponent("#storeRank").showRaffleApplySuccessPop();

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage() {

  // }
})