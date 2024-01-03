// pages/storeOrder/confirmReceipt/index.js

const http = require("../../api/index")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    b_sid:"",
    note:"",
    sku_num:"",
    buy_num:"",
    d_amount:"",//现金劵
    yh_amount:"",//优惠金额
    total_amount:"",//商品总价
    c_amount:"",//应付款,
    out_trade_no:"",//订单货号
    sku:[],
    //控制展開關閉
    // isOpen:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData(options.oid)
  },
  /**拒绝收货 */
  refuse(){
     this.selectComponent('#refuseGoods').showPopup({oid:this.data.id,did:this.data.b_sid,note:this.data.note})
  },
  /**确认收货 */
  confirm(){
    this.selectComponent('#confirmGoods').showPopup({oid:this.data.id,did:this.data.b_sid,note:this.data.note})
  },
  /**返回详情页 */
  goback(){
    wx.navigateBack()
  },
  /*商品展开关闭*/
  // expand(){
  //   this.setData({
  //     isOpen:!this.data.isOpen
  //   })
  // },
  /**初始化数据 */
  initData(oid){
    http.detail({oid}).then(res=>{
         
      let {order,sku} = res.data
      /**订单 */
      let {d_amount,total_amount,c_amount,out_trade_no,sku_num,buy_num,id,b_sid,note} = order
      //商品信息
      sku = sku.map(function(item){
        let {title,buy_price,buy_num,attr_str,icon} = item
        let attr = attr_str[0][1] +'/'+ attr_str[1][1] +'/'+ attr_str[2][1]
        return {
         title,price:(buy_num*Number(buy_price)).toFixed(2),buy_num,attr,icon
        }
      })
      
      this.setData({
          id,
          b_sid,
          note,
          sku_num,
          buy_num,
          d_amount:Number(d_amount)>0?d_amount:null,//现金劵
          yh_amount:(Number(total_amount)-Number(c_amount)).toFixed(2),//优惠金额
          total_amount,//商品总价
          c_amount,//应付款,
          out_trade_no,//订单货号
          sku
      })

    })
  }

})