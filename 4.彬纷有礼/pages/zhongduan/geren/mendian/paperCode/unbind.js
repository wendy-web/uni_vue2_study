// pages/zhongduan/geren/mendian/paperCode/unbind.js
const http = require('../../../../../utils/api');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paper_code_pop:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options&&options.alias_id){
      this.setData({
        alias_id:options.alias_id
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  confirm:function(){
    this.setData({
      paper_code_pop:true
    })
  },
  checkPaperCodeStatus:function(e){
    let type = e.type;
    if(type == "confirm"){
      this.unbind();
    }
  },
  unbind:function(){
    http.post('/api/shop/sidunbind',false).then(res=>{
      if(res.msg){

        wx.showModal({
          title: '温馨提示',
          content:res.msg,
          showCancel:false,
          success:function(res){
            if(res.confirm){
              wx.navigateBack({
                delta: 0,
              })
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      paper_code_pop:false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      paper_code_pop:false
    })
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})