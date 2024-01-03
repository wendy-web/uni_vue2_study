// pages/warhorse/exchange/redeem.js
let app = getApp();
let COS = app.globalData.COS_URL;
import {excReplace,excCount} from '../../../api/exchange/index';
const utils = require("../../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {

    navbar_bg: COS + '/public/img/bfyl/202301/exc_title_bg.png',//导航栏背景
    img_zm_cans: COS + '/public/img/bfyl/202301/img_zm_cans.png',//战马罐装图
    navbar_title:"换购奖励",//导航栏标题
    brand_name:'战马',//品牌名
    exc_type:2,//兑换来源：1红牛，2战马
    hnTitle: app.globalData.hnTitle,
    zmTitle: app.globalData.zmTitle,
    available:'',//可用兑换罐数
    exc_remain_num:0,//剩余换购奖励罐数
    exc_max_num:0,//最大可兑换数量
    disabled:false,//按钮禁用状态
    exchange_num:0,//兑换数量
    img_redbull:COS+'/public/img/bfyl/202302/redbull.png',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.available) {
      let available = options.available;
      let int_num = parseInt(available);
      let exc_remain_num = (available-int_num).toFixed(2);
      this.setData({
        available,
        exc_max_num:int_num,
        exchange_num:int_num,
        exc_remain_num
      })
    }

    if (options.exc_type) {
      let exc_type = options.exc_type;
      let title = exc_type == 1?'红牛':'战马';
      this.setData({
        brand_name:title,
        exc_type
      })
    }

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

  //输入框监听
  stepperChange: function (e) {
    var value = e.detail;
    let {available} = this.data;
    let exc_remain_num = available-value;
    exc_remain_num  = exc_remain_num.toFixed(2);
    if(exc_remain_num<0)return;

    this.setData({
      exchange_num: value,
      exc_remain_num:exc_remain_num
    })
  },
  

  //点击确定换购
  exchange: function () {
    let {exchange_num,exc_max_num,brand_name,exc_type} = this.data;
    if(exc_max_num<1){
      wx.showToast({
        title: '暂无可兑换的'+brand_name+'换购券',
        icon:'none'
      })
      return
    }
    if(!exchange_num){
      wx.showToast({
        title: '请输入兑换数量',
        icon:'none'
      })
      return
    }
    let params = {
      num:exchange_num,
      type:exc_type
    }
    console.log("发起兑换传参：",params);
    this.setData({
      disabled:true
    })
    excReplace(params).then(res=>{
      let {code,data,msg} = res;
      this.setData({
        disabled:false
      })
      wx.showToast({
        title: msg,
        icon:'none'
      })
      // 兑换成功更新统计数据
      if(code==1){
        this.getExcCount();
        return
      }
     
    }).catch(err=>{
      this.setData({
        disabled:false
      })
    })
  },
  // 更新数据
  getExcCount(){
    let {exc_type} = this.data;
    excCount().then(res=>{
      let {code,data} = res;
      if(code == 1){
        // 红牛
        if(exc_type ==1){
          data.available = data.hn_available;
        }
        // 战马
        if(exc_type == 2){
          data.available = data.zm_available;
        }
        let available = data.available;
        let int_num = parseInt(available);
        let exc_remain_num = available - int_num;
        exc_remain_num = exc_remain_num.toFixed(2);

        this.setData({
          available,
          exc_max_num:int_num,
          exchange_num:int_num,
          exc_remain_num
        })
      }
    })
  },
  //数字限制
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.hideLoading({
      success: (res) => {},
    })
    this.setData({
      remindValue: ''
    })
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

  onBack(){
    wx.navigateBack({
      delta: 0,
      fail(){
        wx.redirectTo({
          url: '/pages/warhorse/exchange/list',
        })
      }
    })
  }
 

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})