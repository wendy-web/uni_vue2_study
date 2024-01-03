// pages/storeOrder/payResult/index.js
const log = require("../../../../utils/log");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPaid: 1, //默认支付成功，2失败
    icon_result_success: '../../static/icon_result_success.png',
    icon_result_fail: '../../static/icon_result_fail.png',
    orderInfo: null//订单信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("页面传参：", options);
    log.info("支付结果落地页传参：",options)

    let result  = JSON.parse(decodeURIComponent(options.result)) 

     this.setData({
      orderInfo:result
     })


    // if (_parmas.oid) {
    //   this.getDetail()
    //   // // 先请求代下单确认接口
    //   // confirm({oid:_parmas.oid}).then(res=>{
    //   //   log.addFilterMsg('dxdconfirm');
    //   //   log.info("代下单确认结果：",res)
    //   // }).catch(err=>{

    //   // })
    // }


  },

  goOrderDetail(){
      let {id,pay_type} = this.data.orderInfo;
      /**月結訂單 */
      if(pay_type == 2){
        wx.redirectTo({
          url: `/pages/storeOrder/monthlyOrder/details/index?oid=${id}`
        })
        return 
      }
      /**我的订单 */
      wx.redirectTo({
        url: `/pages/storeOrder/myorder/orderDetail/index?oid=${id}`
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


})