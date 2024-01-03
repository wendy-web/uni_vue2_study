// pages/storeOrder/myorder/confirmReceipt/index.js
import {detail} from '../../api/index';
const utils = require("../../../../utils/util");
const app = getApp();
const COS_URL = app.globalData.COS_URL;
//支付方式：微信，支付宝，现金券
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
    oid:null,
    icon_share_img:COS_URL +'/public/img/bfyl/202208/icon_share_img_bfyl.png',//小程序分享背景图配置
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let {oid} = options;
  
    if(oid){
      this.setData({
        oid
      })
      this.getDetail();
      
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    let userdata = wx.getStorageSync('userdata') || null;
    if (userdata) {
      this.setData({
        condition: userdata.condition
      })
    } else {

      utils.getUserInfoNew().then(data => {
        this.setData({
          condition: data.condition
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  //获取订单详情
  getDetail:function(){
    let {oid} = this.data;
    detail({oid},true).then(res=>{
      let {code,data,msg} = res;
      if(code == 1){
        //获取订单号
        let {
          act,
          order,
          pay,
        } = data;

        //订单总额
        let total_amount = Number(order.total_amount).toFixed(2);
        //应支付金额
        let c_amount = Number(order.c_amount);
        //已支付金额
        let p_amount = Number(order.p_amount);
        //应付现金券
        let d_amount = Number(order.d_amount);
        //已付现金券
        let dp_amount = Number(order.dp_amount);
        //应支付金额
        let need_pay = c_amount - p_amount - d_amount;
        //优惠金额= 订单总金额 - 应支付金额
        let discount_amount = total_amount - c_amount;
        if (discount_amount > 0) {
          discount_amount = discount_amount.toFixed(2);
          discount_amount = utils.formatAmount(discount_amount);
        } else {
          //无优惠
          discount_amount = null
        }
        order.discount_amount = discount_amount;
        //判断订单是否支付，显示实付款、应付款：已支付p_amount >= 应付订单金额c_amount
        let isPaid = false; //默认未支付
        if ((p_amount + dp_amount) >= c_amount) {
          isPaid = true //已支付，显示实付款p_amount
        } else {
          isPaid = false //未支付，显示应付款c_amount-d_amount
          need_pay = need_pay > 0 ? utils.formatAmount(need_pay.toFixed(2)) : '0.00';
          order.c_amount = need_pay
        }
        order.isPaid = isPaid;

        order.dp_amount = dp_amount > 0 ? utils.formatAmount(dp_amount.toFixed(2)) : null;
        order.d_amount = d_amount > 0 ? utils.formatAmount(d_amount.toFixed(2)) : null;
        //支付方式，默认为空
        order.payType = '';
        order.payTime = '';
        //送货地址
        let address = order.province + order.city;
        if (order.district) {
          address += order.district;
        }
        if (order.twon) {
          address += order.twon;
        }
        address += order.address;

        order.address = address;
        //操作记录
        order.actRecord = act[0]['name'] + ' ' + utils.parseTime(act[0]['update_time'], "{y}.{m}.{d}") + act[0]['event'];
        data.order = order;
        //循环查询pay数组里result_status==1支付成功的数据
        if (pay.length) {
          pay.forEach(item => {
            // result_status:0未完成，1已完成，2确认失败，3申请退款中
            if (item.result_status == 1) {
              order.payType = payType[item.pay_way]; //支付方式
              order.payTime = item.result_time; //支付时间
            }
          })
        }

        this.setData({
          orderInfo: data,
        })
        return
      }
      wx.showModal({
        title: '温馨提示',
        content:msg,
        showCancel:false
      })
    }).catch(err=>{
      wx.showModal({
        title: '温馨提示',
        content:JSON.stringify(err),
        showCancel:false
      })
    })
  },
  //商城订单，拒绝
  storeOrderRefuse: function (event) {
    let {
      item
    } = event.currentTarget.dataset;
    console.log("item:",item);
    this.selectComponent("#orderPopup").showrRejectReceiptPop(item);
  },
  //确认收货：弹窗confirmReceiptShow
  confirmReceipt:function(event){
    let {
      order
    } = this.data.orderInfo;

    //pay_start:默认0,支付结果页不请求接口，HDFK，货到付款，XFHK先付后货+现金券全额支付
    if(order.pay_type == 0){
      order.pay_start = 'XFHH';
    }
    if(order.pay_type == 1){
      order.pay_start = 'HDFK';
    }
    
    let {pay_start,id,b_sid,pay_type,total_amount,discount_amount,d_amount,c_amount,avg_price} = order
    let _pageParams = {pay_start,id,b_sid,pay_type,total_amount,discount_amount,d_amount,c_amount,avg_price}

    // 未支付的订单需要跳转至支付页
    if(order.isPaid){
      this.selectComponent("#orderPopup").showConfirmReceiptPop(_pageParams);
    }else{
      wx.redirectTo({
        url: `/pages/storeOrder/myorder/pay/index?orderInfo=`+encodeURIComponent(JSON.stringify(_pageParams)),
      })
    }
  },
  //通知店长:跳转至确认收获页面 `/pages/storeOrder/myorder/confirmReceipt/index?oid=${oid}`
  storeOrderInformBoss:function(event){
    console.log("storeOrderInformBoss")
  },
  //返回订单页
  goback(){
    wx.navigateBack().then(res=>{
      console.log("goback res:",res)

    }).catch(err=>{
      console.log("goback err:",err)
      wx.redirectTo({
        url: '/pages/storeOrder/myorder/index/index',
      })
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
  onShareAppMessage(event){
    let {order} = this.data.orderInfo;
    let share = {
        path: '/pages/tabBar/shouye/index'
    }
    
    if(event.from == 'button'){
        share.title = '有一笔￥'+order.c_amount+'进货订单需要支付，点击查看'
        // share.path = `/pages/storeOrder/myorder/confirmReceipt/index?oid=${order.id}`
        share.path = `/pages/tabBar/geren/index?shareType=confirmReceipt&oid=${order.id}`
        share.imageUrl = this.data.icon_share_img
    }

    return share;
    
    
  }

})