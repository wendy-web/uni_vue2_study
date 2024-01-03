// pages/storeOrder/orderDetail/index.js
import {
  detail,
  press,
} from '../../api/index';
const utils = require('../../../../utils/util')
//支付方式：微信，支付宝，现金券
const payType = {
  "WXZF": "微信支付",
  "ZFBZF": "支付宝支付",
  "CASH": "现金券支付"
}
const orderType = {
  0: "先付后货",
  1: "货到付款",
  2: "月结"
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pay_type: 0, //0默认先付后货，1货到付款 （商城订单）
    status_icon_path: '../../static/icon_status_djd.png', //返货订单状态图标
    icon_delivery: '../../static/icon_delivery.png', //送货图标
    icon_salesman: '../../static/icon_salesman.png', //下单图标
    icon_copy: '../../static/icon_copy.png',
    status_name: '待接单', //返货订单状态名
    orderInfo: null, //订单信息
    condition: '', //用户身份
    loading: false, //按钮loading状态
    deliveryInfo:false,//配送员信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("页面传参：", options);
    let oid = options.oid || null;
    if (oid) {
      this.setData({
        oid
      })
      this.getDetail()
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
  getDetail() {
    let oid = this.data.oid;
    let orderInfo = {};
    detail({
      oid
    },true).then(res => {
      let {
        code,
        data,
        msg
      } = res;
      if (code == 1) {
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
        //订单类型
        order.orderType = orderType[order.pay_type];
        data.order = order;
        //初始化订单状态图标
        this.initOrderStatus(order)
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
        //配送员信息
        let deliveryInfo = '';
        let delivery_len = data.delivery.length;
        if(delivery_len>0){
          // deliveryInfo = data.delivery[delivery_len-1];
          let {d_name,d_mobile} = data.order;
          deliveryInfo ={
            name:d_name,
            mobile:d_mobile
          };
        }

        this.setData({
          orderInfo: data,
          deliveryInfo
        })
        return
      }
      wx.showModal({
        title: '温馨提示',
        content: msg,
        showCancel: false
      })
    })
  },
  //复制文本
  copyText(event) {
    let {
      text
    } = event.currentTarget.dataset;
    wx.setClipboardData({
      data: text,
    })
  },
  //订单状态图标初始化
  initOrderStatus(order) {
    let status_icon_path = ''; //订单状态图标
    let status_name = ''; //订单状态
    switch (+order.status) {
      case 1:
        // 需要区分订单类型pay_type：0先付后货，1货到付款，2月结订单（小程序暂不考虑）
        if (order.pay_type != 0) {
          status_name = '待确认';
        } else {
          status_name = '待付款';
        }
        status_icon_path = '../../static/icon_status_1.png';
        if (order.isPaid) {
          status_name = "待接单";
          status_icon_path = '../../static/icon_status_djd.png';
        }
        break;
      case 2:
        status_name = '待配送';
        status_icon_path = '../../static/icon_status_7.png';
        break;
      case 3:
        status_name = '待核销';
        status_icon_path = '../../static/icon_status_8.png';
        if (order.rev_status == 2) {
          status_name = '待收货';
          status_icon_path = '../../static/icon_status_3.png';
        }
        break;
      case 4:
        status_name = '已完成';
        status_icon_path = '../../static/icon_status_9.png';
        break;
      case 5:
        status_name = '已取消';
        status_icon_path = '../../static/icon_status_cancel.png';
        break;
      default:

        status_icon_path = '../../static/icon_status_djd.png';
        break;
    }
    this.setData({
      status_icon_path,
      status_name
    })
  },
  //商城订单，先付后货，拒绝
  storeOrderRefuse: function (event) {
    let {
      item
    } = event.currentTarget.dataset;
    this.selectComponent("#orderPopup").rejectOrdersShow(item)
  },
  //商城订单：确认
  storeOrderConfirm: function (event) {
    let {
      item
    } = event.currentTarget.dataset;
    this.selectComponent("#orderPopup").acceptOrdersShow(item)

  },
  //商城订单：催接单
  storeOrderPress: function (event) {
    let {
      item,
      type
    } = event.currentTarget.dataset;
    this.setData({
      loading: true
    })
    press({
      oid: item.id,
      type
    }).then(res => {
      let {
        msg
      } = res;
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 2500
      })
      this.setData({
        loading: false
      })
    }).catch(err => {
      this.setData({
        loading: false
      })
      wx.showModal({
        title: '温馨提示',
        content: JSON.stringify(err),
        showCancel: false
      })
    })
  },
  //商城订单-点击支付:跳转至结算页
  storePay(event) {
    console.log(event.currentTarget.dataset.item);
    //需要传参：商品总价total_amount,现金券：d_amount,应付款c_amount
    let {
      id,
      total_amount,
      d_amount,
      c_amount,
      discount_amount,
      avg_price,
      pay_type,
      b_sid
    } = event.currentTarget.dataset.item;
    let orderInfo = {
      id,
      total_amount,
      d_amount,
      c_amount,
      discount_amount,
      avg_price,
      b_sid
    };
    //pay_start:默认0,支付结果页不请求接口，HDFK，货到付款，XFHK先付后货+现金券全额支付
    if (pay_type == 0) {
      orderInfo.pay_start = 'XFHH';
    }
    if (pay_type == 1) {
      orderInfo.pay_start = 'HDFK';
    }
    console.log("订单信息：", orderInfo);
    //订单金额是0，不需支付，直接跳转到支付成功页面
    // if (Number(c_amount) == 0) {
    //   orderInfo.isPaid = 1; //支付成功
    //   wx.redirectTo({
    //     url: '/pages/storeOrder/myorder/payResult/index?oid=' + orderInfo.id,
    //   })
    //   return
    // }
    wx.redirectTo({
      url: '/pages/storeOrder/myorder/pay/index?orderInfo=' + encodeURIComponent(JSON.stringify(orderInfo)),
    })
  },
  //确认收货：
  storeOrderConfirmReceipt: function () {
    let oid = this.data.oid;
    console.log("订单id:", oid);
    wx.redirectTo({
      url: `/pages/storeOrder/myorder/confirmReceipt/index?oid=${oid}`,
    })
  },
  //通知店长
  storeOrderInformBoss: function () {

  },
  //商品清单列表
  openGoodList: function (event) {

    let {
      sku
    } = event.currentTarget.dataset;
    console.log("sku:", sku)
    if (sku.length) {
      let arr = sku.map(item => {
        item.attr = item.attr_str[0][1] + " " + item.attr_str[1][1] + " " + item.attr_str[2][1];
        return {
          ...item
        }
      })
      arr = encodeURIComponent(JSON.stringify(arr));
      wx.redirectTo({
        url: `/pages/storeOrder/goodsList/index?sku=${arr}`,
      })
    }
  },
  checkActRecord: function () {
    let {
      act
    } = this.data.orderInfo;
    act = encodeURIComponent(JSON.stringify(act));
    wx.redirectTo({
      url: `/pages/storeOrder/operaRecord/index?act=${act}`,
    })
  },
  //商城订单：代下单确认（店长）
  storeOrderdxdConfirm(event){
    let {
      item
    } = event.currentTarget.dataset;
    this.selectComponent("#orderPopup").dxdConfirmShow(item)
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