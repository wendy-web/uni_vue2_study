// pages/storeOrder/monthlyOrder/details/index.js
const http = require("../../api/index")
//tools
const tools = require('../common/tools/index')
//页面参数
let _parmas = null
/**支付方式 */
const payType = {
  "WXZF": "微信支付",
  "ZFBZF": "支付宝支付",
  "CASH": "现金券支付"
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeline:[],
    toolsBtns:[],
    condition:2,
    orderStatus:{},
    deliveryInfo:null,
    config:{},
    act:[],
    sku:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    _parmas = options
    /**获取用户角色 */
    let userdata = wx.getStorageSync('userdata')||"{}"
    let {condition} = userdata
    this.setData({
      condition
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.initData()
  },
  /**初始化数据 */
  initData(){

    http.detail({oid:_parmas.oid}).then(res=>{
      
      let {act,delivery,hr,order,pay,sku,timeline} = res.data
      /**订单 */
      let {avg_price,p_amount,status,type,rev_status,y_name,b_sname,sku_num,buy_num,d_amount,total_amount,c_amount,out_trade_no,create_time,dy_time,province,city,district,b_town,address,note,pro_title,id,b_sid,d_name,d_mobile} = order
      //状态文字      
      let  orderStatus =  tools.getStatusText({p_amount,status,type,rev_status},true)
      //按钮控制
      let toolsBtns = tools.getToolsBtn(orderStatus.statusText,this.data.condition)    
      //配送员信息
      let deliveryInfo = null
      if(delivery.length>0){
            deliveryInfo = {name:d_name,mobile:d_mobile}
      }
      //商品信息
      sku = sku.map(function(item){
           let {title,buy_price,buy_num,attr_str,icon} = item
           let attr = attr_str[0][1] +'/'+ attr_str[1][1] +'/'+ attr_str[2][1]
           return {
            title,buy_price,buy_num,attr,icon
           }
      })
      let goodSize = sku.length
      let goods = sku.slice(0,2)
         
      //操作记录样本
      let actTemp = act[0].name + act[0].update_time.slice(0,10) +  act[0].event
      //实付款
      let payInfo = {}
      if(pay.length>0){
        let _i = pay.findIndex(function(item){return item.result_status === 1})
        if(_i>-1){
          payInfo.sf_amount = p_amount
          payInfo.type = payType[pay[_i].pay_way]
          payInfo.create_time = pay[_i].create_time
        }
      }
      this.setData({
        timeline,
        toolsBtns,
        orderStatus,
        deliveryInfo,
        config:{
          id,
          b_sid,
          y_name,
          b_sname,
          sku_num,
          buy_num,
          avg_price,
          hr,
          goodSize,//商品数量
          goods:goods.length>1?goods:goods[0],//商品信息集合
          d_amount:Number(d_amount)>0?d_amount:null,//现金劵
          yh_amount:(Number(total_amount)-Number(c_amount)).toFixed(2),//优化金额
          total_amount,//商品总价
          c_amount,//应付款
          out_trade_no,//订单货号
          create_time,//代下单时间,
          dy_time,//期望送货时间
          sh_address:province+city+district+b_town+address,
          note:note||'',
          pro_title,
          actTemp,
          payInfo
        },
        act,//操作记录
        sku
      })
      
    })
  },
  /**刷新 */
   refresh(){
      this.initData()
   },
  /**按钮相关操作 */
  toolsHandle(event){
    let {toolType} = event.target.dataset
    let {b_sid:did,id:oid,total_amount,yh_amount:discount_amount,d_amount,c_amount,avg_price} = this.data.config

    /**催送业务直接处理 */
    if(['urgeDelivery','urgeOrder'].includes(toolType)){
      this.urge(toolType)
      return 
    }

    switch(toolType){
      case 'refuse':
      this.selectComponent("#refuseOrder").showPopup({did,oid})
      break
      case 'cancel':
      this.selectComponent("#cancelOrder").showPopup({did,oid})
      break
      case 'confirmOrder':
      this.selectComponent("#confirmOrder").showPopup({did,oid})
      break
      case "confirmReceipt":
        wx.navigateTo({
          url: '/pages/storeOrder/monthlyOrder/confirmReceipt/index?oid='+oid
        })
      break  
      case "confirmSettle":
        wx.navigateTo({
          url: '/pages/storeOrder/myorder/pay/index?orderInfo='+JSON.stringify({pay_type:2,id:oid,total_amount,discount_amount,d_amount,c_amount,avg_price})
        })
       break 
     }
  },
  /**催周丹 */
  urge(toolType){
    let {id:oid} = this.data.config
    let type = toolType == 'urgeOrder'?1:2
    http.press({
      oid,
      type
    },true).then(res=>{
      wx.showToast({
        title: res.msg,
        icon:'none'
      })
    })
  },
  /**粘贴功能 */
  cilpboard(){
    let {out_trade_no} = this.data.config
    wx.setClipboardData({
      data: out_trade_no,
      success: function () {
        wx.showToast({
          title: '复制成功',
          icon:'none'
        })
      }
    })
  },
  /**商品清单 */
  goGoodsList(){
    wx.navigateTo({
      url: '/pages/storeOrder/goodsList/index?sku='+JSON.stringify(this.data.sku)
    })
  },
  /**操作记录 */
  operaRecord(){
    wx.navigateTo({
      url: '/pages/storeOrder/operaRecord/index?act='+JSON.stringify(this.data.act)
    })
  }
})