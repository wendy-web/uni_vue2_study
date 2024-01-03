// pages/storeRank/prizeTicket/index/index.js 填写领奖信息
// 姓名验证正则
const nameRegx = /^[\u4e00-\u9fff]{2,4}$/;
const idCardRegx = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
const app = getApp();
const COS_URL = app.globalData.COS_URL;
// utils.isHide 根据ip获取地区信息
const utils = require("../../../../utils/util");

// 引入赢手机完善资料接口
import {
  mobUpdate14,
} from '../../../../api/storeRank/api';
import storeRankUtils from '../../../../api/storeRank/utils';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prizeInfo: {
      id:'',
      name: '',
      phone:'',
      id_card: '',
      region: '',
      detailed: '',
      voucher:[],//领取凭证
    },
    editDisabled:false, // 输入框禁止编辑
    submitDisabled: false,// 提交按钮禁止操作
    banner_honor:`${COS_URL}/public/img/bfyl/2023/08/banner_honor90.png`, // 荣耀90手机
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 初始化信息
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
    // 判断按钮是否可操作
    this.initSubmitBtn()
  },
  async initData(){
    try {
      let {prizeInfo,editDisabled} = this.data;
      // 获取活动参与信息
      let {actInfo} = await storeRankUtils.actInfo14();
      let {win} =actInfo;

      if(win){
        prizeInfo.id = win.id ||'';
        prizeInfo.phone = win.mobile ||'';
        prizeInfo.name = win.name ||'';
        prizeInfo.id_card = win.id_card || '';
        prizeInfo.region = win.region || '';
        prizeInfo.detailed = win.detailed || '';
        editDisabled = Boolean(win.region);
        // prizeInfo.voucher = win.voucher?win.voucher:[];
        prizeInfo.voucher = win?.voucher || [];
      }
      this.setData({
        prizeInfo,
        editDisabled,
        actInfo
      })
      // region不存在的时候获取ip解析的省市区:
      let location = await utils.isHide();
      if(location&& !prizeInfo.region){
        let {province,city,district} = location;
        prizeInfo.region = province+city;
        if(district){
          prizeInfo.region += district;
        }
        this.setData({
          prizeInfo
        })
      }
    } catch (error) {
      console.log("完善资料catch：",error);
    }
  },
  onChange(event) {
    let {
      field
    } = event.currentTarget.dataset;
    let {
      detail
    } = event;
    if (field) {
      this.setData({
        [`prizeInfo.${field}`]: detail
      })
      this.initSubmitBtn();
    }
  },
  initSubmitBtn() {
    let prizeInfo = this.data.prizeInfo;
    console.log()
    let {
      name,
      id_card,
      region,
      detailed,
    } = prizeInfo;
    let submitDisabled = !name || !id_card || !region || !detailed;
    this.setData({
      submitDisabled
    })
  },
  onSubmit(event){
    console.log("点击提交：",event);
    let prizeInfo = this.data.prizeInfo;
    let {
      name,
      id_card,
    } = prizeInfo;
    if(!nameRegx.test(name)){
      wx.showToast({
        icon: 'none',
        title: '请输入合规的姓名'
      })
      return
    }
    if(!idCardRegx.test(id_card)){
      wx.showToast({
        icon: 'none',
        title: '请输入合规的身份证号'
      })
      return
    }
    // 二次确认弹窗
    this.selectComponent("#pop").showConfirm();
  },
  // 提交信息
  async submit(){
    console.log("提交信息");
    let {prizeInfo} = this.data;
    let {id,name,id_card,region,detailed} = prizeInfo;
    try {
      let res = await mobUpdate14({id,name,id_card,region,detailed});
      let {code,msg} = res;

      if(code == 1){
        this.setData({
          editDisabled:true
        })
        // 打开排行榜主页
        utils.navigateFrequentPage("pages/storeRank/rank/index");
        return
      }
      wx.showModal({
        title: '温馨提示',
        content: msg,
        showCancel:false
      })
    } catch (error) {
      console.log("提交信息失败：", error);
    }
    
  },
  // 预览图片
  previewImg(event){
    let {url} = event.currentTarget.dataset;
    if(url){
      wx.previewImage({
        urls: [url],
      })
    }
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