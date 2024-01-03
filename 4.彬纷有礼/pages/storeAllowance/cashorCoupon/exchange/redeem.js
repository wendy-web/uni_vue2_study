// pages/storeAllowance/cashorCoupon/exchange/redeem.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const utils = require("../../../../utils/util");
import {
  scan23getUser,
  scan23exc
} from "../../../../api/exchange/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    excSuccessShow: false, //兑换成功弹窗
    radio: 0, //radio 默认不选
    cashcoupon_file_url:`${COS_URL}/public/img/bfyl/2023/08/cashCoupon`,// cos 资源地址
    hn2in1_info: null,//2选1卡券信息
    excSuccessNum:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.getUserInfo2in1();
  },
  initExcOption(num) {
    let radio_coupon_1=0,radio_remain_1 =0,radio_coupon_2=0,radio_remain_2 = 0;
    let {radio} = this.data;
    if (num) {

      radio_coupon_1 = parseInt(num / 3) * 2;
      radio_remain_1 = num%3;
      radio_coupon_2 = parseInt(num / 5) * 4;
      radio_remain_2 = num%5;
    }
    if(radio_coupon_1 == 0 && radio_coupon_2 == 0){
      radio = 0;
    }
    this.setData({
      radio_coupon_1,
      radio_remain_1,
      radio_coupon_2,
      radio_remain_2,
      radio
    })

  },
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  confirm() {
    let {
      radio,
      radio_coupon_1,
      radio_coupon_2
    } = this.data;
    if (radio == 0) {
      wx.showToast({
        title: '请选择兑换类型',
        icon: 'none'
      })
      return
    }
    let exc_num = radio == 32 ? radio_coupon_1 : radio_coupon_2;
    if(exc_num == 0){
      wx.showToast({
        title: '暂无可兑换产品券',
        icon:'none'
      })
      this.setData({
        radio:0
      })
      this.getUserInfo2in1();
      return
    }
    let params = {
      exc_type:radio
    }
    scan23exc(params).then(res=>{
      let {code,data,msg} = res;
      if(code ==1){
        this.setData({
          excSuccessNum:data.num,
          excSuccessShow: true
        })
        return
      }
      wx.showModal({
        title: '温馨提示',
        content: msg,
        showCancel:false
      })
    }).catch(err=>{
      if(err.msg){
        wx.showModal({
          title: '温馨提示',
          content: err.msg,
          showCancel:false
        })
      }
    })
  },
  testPop() {
    this.setData({
      excSuccessShow: true
    })
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
  // 关闭弹窗
  onClose(event) {
    let {
      popname
    } = event.currentTarget.dataset;
    // 更新额度数据
    this.getUserInfo2in1()
    this.setData({
      [popname]: false
    })
  },
  //  2023年8月18日 红牛2in1扫码信息：
  async getUserInfo2in1() {
    try {
      let {
        code,
        data
      } = await scan23getUser();
      if (code == 1) {
        this.initExcOption(data.dh_num);

        this.setData({
          hn2in1_info: data
        })
      }
      let userdata  = wx.getStorageSync('userdata') || utils.getUserInfoNew();
      this.setData({
        userdata
      })
    } catch (error) {
      console.log("getUserInfo2in1:", error);
    }
  },
  openPage(event){
    let {url,condition} = event.currentTarget.dataset;
    // 店员身份不同跳转
    if(url && condition !=2 ){
      utils.navigateFrequentPage(url)
    }
    this.onClose(event)
  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage() {

  // }
})