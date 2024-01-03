// pages/shopActivity/displayAct/awardRecord/index.js


let app = getApp();
let COS_URL = app.globalData.COS_URL;
const http = require('../../../../utils/api');
const utils = require('../../../../utils/util');
const shopActUtils = require("../../../../api/shopActivity/utils");
let opentypeObj={
  'zm':{
    me_shop_record_bg: COS_URL + '/public/img/bfyl/202204/me_shop_record_bg.png',
    me_shop_record_board: COS_URL + '/public/img/bfyl/202204/me_shop_record_board.png',
    me_shop_record_head: COS_URL + '/public/img/bfyl/202204/me_shop_record_head.png',
    me_shop_record_icon: COS_URL + '/public/img/bfyl/202204/me_shop_record_icon.png',
  },
  'hn':{
    me_shop_record_bg: COS_URL + '/public/img/couponActivity/bg_act_banner.png',
    me_shop_record_board: COS_URL + '/public/img/bfyl/202208/me_shop_record_board.png',
    me_shop_record_head: COS_URL + '/public/img/bfyl/202208/me_shop_record_head.png',
    me_shop_record_icon: COS_URL + '/public/img/bfyl/202208/me_shop_record_icon.png',
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    me_shop_record_bg: COS_URL + '/public/img/bfyl/202204/me_shop_record_bg.png',
    me_shop_record_board: COS_URL + '/public/img/bfyl/202204/me_shop_record_board.png',
    me_shop_record_head: COS_URL + '/public/img/bfyl/202204/me_shop_record_head.png',
    me_shop_record_icon: COS_URL + '/public/img/bfyl/202204/me_shop_record_icon.png',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {opentype} = options;
    if(opentype){
      let me_shop_record_bg = opentypeObj[opentype]['me_shop_record_bg'];
      let me_shop_record_board = opentypeObj[opentype]['me_shop_record_board'];
      let me_shop_record_head = opentypeObj[opentype]['me_shop_record_head'];
      let me_shop_record_icon = opentypeObj[opentype]['me_shop_record_icon'];
      this.setData({
        me_shop_record_bg,
        me_shop_record_board,
        me_shop_record_head,
        me_shop_record_icon,
        opentype
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
    this.getList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
   
  },
  getList:function(){
    http.post('/api/act3/signupList',false).then(res=>{
      if(+res.code == 1){
        let time_now = Date.now();
        let list = res.data.list;
        list.forEach(item=>{
          let e_time = item.e_time;
          let time_end = new Date(e_time.replace(new RegExp(/-/gm),'/')).getTime();
          item.act_end = time_now>time_end?true:false
        })
        console.log("lala list:",list);
        this.setData({
          list
        })
      }else{
        this.setData({
          list:[]
        })
        wx.showModal({
          title: '温馨提示',
          content:res.msg,
          showCancel:false
        })
      }
    })
  },
  //获取陈列信息
  async getDisplayInfo(){
    let result = await shopActUtils.display_getinfo();
    let {display_info:displayInfo} = result;
    console.log("陈列信息：",displayInfo);
    if(result.display_info){
      let list = [];
      displayInfo.act_end = displayInfo.act_state.act_end;
      list.push(displayInfo)
      this.setData({
        list
      })
      return
    }
    return  wx.showModal({
      title: '温馨提示',
      content:result.msg,
      showCancel:false
    })
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

})