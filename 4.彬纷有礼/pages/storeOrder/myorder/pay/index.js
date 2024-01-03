// pages/storeOrder/pay/index.js
import {
  getVersion
} from '../../api/utils';
import {
  dpQueryCitic,
  confirm,
  detail,
  storePayCitic,
  verifyConfirmCitic
} from '../../api/index';
const utils = require('../../../../utils/util');
const {getUserLocation} = require('../../../../utils/location');
const isRelease = getVersion(); //判断小程序版本是正式版还是体验版
let isHide = false;
let clicked = false; //点击过支付按钮
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
    isPaid: 0, //是否已支付，默认0待支付,1支付成功，2支付失败
    orderInfo: null, //订单信息,
    isLoading:false,//正在加载
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("页面传参：", options);
    let orderInfo = options.orderInfo || null;
    if (orderInfo) {
      orderInfo = JSON.parse(decodeURIComponent(orderInfo));
      this.setData({
        orderInfo
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (isHide) {
      isHide = false;
      //页面再次打开时候，查询一下订单转态，跳转至支付结果
      let scene = wx.getEnterOptionsSync(); //获取场景值wx.getEnterOptionsSync

      let {
        extraData
      } = scene.referrerInfo || null;
      //如果有extraData，直接跳转至支付结果，不请求接口查询支付结果
      /**
       * extraData:{
       *  type:"pay",oid:80,pay_start:""
       * }
       */
      if (extraData && extraData.third_order_id) {
        this.checkResult(extraData.third_order_id);
        // wx.showModal({
        //   title: 'extraData',
        //   content:JSON.stringify(extraData),
        //   showCancel:false
        // })
        return
      }
      this.getDetail();

      // let {
      //   id
      // } = this.data.orderInfo;
      // this.checkResult(id);
      // this.openPayResult(id);

    }
  },
  // 跳转到小程序支付: 可打开半屏小程序
  openMiniprogram(event) {
    clicked = true;

    // wx.navigateToMiniProgram({
    //   appId: 'wx193379d0f0c94d16',
    // })
    // return
    let orderInfo = this.data.orderInfo;
    //订单金额是0，不需支付，直接跳转到支付成功页面
    if (Number(orderInfo.c_amount) == 0) {
      //现金券全额抵扣订单：
      this.setData({
        isLoading:true
      })
      this.storeOrderAllDeducted(orderInfo);
      return
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let {
      oid
    } = event.currentTarget.dataset;
    let dev = isRelease ? 0 : 1;
    let evnVersion = isRelease ? 'release' : 'trial';
    let openMiniProgram = wx.canIUse('openEmbeddedMiniProgram') ? wx.openEmbeddedMiniProgram : wx.navigateToMiniProgram;
    console.log("dev，evnVersion", dev, evnVersion);
    openMiniProgram({
      appId: 'wxfeae7ff917675ffe',
      path: `pages/store/pay?fromMini=true&pay_type=1&oid=${oid}&dev=${dev}`,
      envVersion: evnVersion
    }).then(res => {
      console.log("打开结果：", res);
      wx.hideLoading();
    }).catch(err => {
      console.log("打开失败：", err);
      wx.hideLoading();
    })
  },
  //查询支付结果
  checkResult(third_order_id) {

    dpQueryCitic({
      third_order_id
    }, true).then(res => {
      let {
        code,
        data,
        msg
      } = res;
      let {id,b_sid,pay_start}  = this.data.orderInfo;
     
      //跳转至支付结果页
      if (code == 1) {
        switch (pay_start) {
          case "XFHH":
            //支付成功 代下单确认操作
            confirm({
              oid: id
            },true).then(res => {
              //查询订单详情
              this.getDetail();
            })
            break;
          case "HDFK":
            wx.showLoading({
              title: '处理中'
            })
            getUserLocation(true).then(res=>{
             
              let {longitude:lng,latitude:lat} = res.data
            
              verifyConfirmCitic({oid:id,did:b_sid,lat,lng}).then(res=>{
                    //查询订单详情
                    this.getDetail();
                    wx.hideLoading({
                      success: (res) => {},
                    })
              }).catch(err=>{
                wx.hideLoading({
                  success: (res) => {},
                })
              })
              

            }).catch(err=>{
                  //查询订单详情
                  this.getDetail();
                  wx.hideLoading({
                    success: (res) => {},
                  })
            })

            break;

          default:
            //查询订单详情
            this.getDetail();
            break;
        }
        return
      }
      //支付失败
      this.openPayErrorResult()
    }).catch(err => {
      wx.showModal({
        title: '温馨提示',
        constent: JSON.stringify(err),
        showCancel: false
      })
    })
  },
  //支付失败跳转
  openPayErrorResult() {
    let orderInfo = this.data.orderInfo
    orderInfo.isPaid = false
    wx.redirectTo({
      url: `/pages/storeOrder/myorder/payResult/index?result=${encodeURIComponent(JSON.stringify(orderInfo))}`
    })
  },
  //获取订单详情
  getDetail() {
    let {
      id,
      pay_type
    } = this.data.orderInfo;
    let _orderInfo = {};
    detail({
      oid: id
    }, true).then(res => {
      let {
        code,
        data,
        msg
      } = res;
      if (code == 1) {
        //获取订单号
        let {
          order,
          pay,
          sku,
          spu
        } = data;
        _orderInfo.out_trade_no = order.out_trade_no; //订单号
        _orderInfo.id = order.id; //订单id
        _orderInfo.total_amount = order.total_amount; //订单总金额
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
        _orderInfo.discount_amount = discount_amount;
        //判断订单是否支付，显示实付款、应付款：已支付p_amount >= 应付订单金额c_amount
        let isPaid = false; //默认未支付
        if ((p_amount + dp_amount) >= c_amount) {
          _orderInfo.p_amount = order.p_amount
          isPaid = true //已支付，显示实付款p_amount
        } else {
          isPaid = false //未支付，显示应付款c_amount-d_amount
          need_pay = need_pay > 0 ? utils.formatAmount(need_pay.toFixed(2)) : '0.00';
          console.log("need_pay:", need_pay)
          _orderInfo.c_amount = need_pay
        }
        _orderInfo.isPaid = isPaid;
        if (dp_amount > 0) {
          dp_amount = utils.formatAmount(dp_amount.toFixed(2));
        } else {
          dp_amount = null
        }
        _orderInfo.dp_amount = dp_amount;
        console.log("order:", order);
        console.log("pay:", pay);
        console.log("sku:", sku);
        let goods_name = '';
        if (spu.length) {
          spu.forEach((item, index) => {
            let attr_str = '';
            if (index < spu.length - 1) {
              attr_str = item.short_name + '*' + item.buy_num + '箱、';
              // attr_str = this.initTitle(item.title) +'*'+item.buy_num+'箱、';
            } else {
              // attr_str = this.initTitle(item.title) +'*'+item.buy_num+'箱';
              attr_str = item.short_name + '*' + item.buy_num + '箱';

            }
            goods_name += attr_str;
          })
        }
        //支付方式，默认为空
        _orderInfo.payType = '';
        _orderInfo.payTime = '';
        //循环查询pay数组里result_status==1支付成功的数据
        if (pay.length) {
          pay.forEach(item => {
            // result_status:0未完成，1已完成，2确认失败，3申请退款中
            if (item.result_status == 1) {
              _orderInfo.payType = payType[item.pay_way]; //支付方式
              _orderInfo.payTime = item.result_time; //支付时间
            }
          })
        }
        _orderInfo.goods_name = goods_name;


        _orderInfo.pay_type = pay_type

        wx.redirectTo({
          url: `/pages/storeOrder/myorder/payResult/index?result=${encodeURIComponent(JSON.stringify(_orderInfo))}`
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
  //商城订单 全额抵扣
  async storeOrderAllDeducted(orderInfo) {
    // 先请求citic，再请求代下单确认，以及订单详情接口，最后跳转
    let {
      id
    } = orderInfo; //订单id
    // 发起支付，现金券
    let payResult = await storePayCitic({
      oid: id,
      pay_way: "CASH"
    }, true);
    console.log("支付结果：", payResult);
    let {
      code,
      msg
    } = payResult;
    if (code == 1) {
      //代下单确认
      let confrimResult = await confirm({
        oid: id
      });
      console.log("代下单确认：", confrimResult);
      //获取订单详情
      let orderDetail = await detail({
        oid:id
      }, true);
      this.setData({
        isLoading:false
      })
      let {
        code: _code,
        data: _data,
      } = orderDetail;
      if (_code == 1) {
        let _orderInfo = {};
        //获取订单号
        let {
          order,
          spu
        } = _data;
        _orderInfo.out_trade_no = order.out_trade_no; //订单号
        _orderInfo.id = order.id; //订单id
        _orderInfo.total_amount = order.total_amount; //订单总金额
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
        _orderInfo.discount_amount = discount_amount;
        //判断订单是否支付，显示实付款、应付款：已支付p_amount >= 应付订单金额c_amount
        let isPaid = false; //默认未支付
        if ((p_amount + dp_amount) >= c_amount) {
          _orderInfo.p_amount = order.p_amount
          isPaid = true //已支付，显示实付款p_amount
        } else {
          isPaid = false //未支付，显示应付款c_amount-d_amount
          need_pay = need_pay > 0 ? utils.formatAmount(need_pay.toFixed(2)) : '0.00';
          console.log("need_pay:", need_pay)
          _orderInfo.c_amount = need_pay
        }
        _orderInfo.isPaid = isPaid;
        if (dp_amount > 0) {
          dp_amount = utils.formatAmount(dp_amount.toFixed(2));
        } else {
          dp_amount = null
        }
        _orderInfo.dp_amount = dp_amount;
        let goods_name = '';
        if (spu.length) {
          spu.forEach((item, index) => {
            let attr_str = '';
            if (index < spu.length - 1) {
              attr_str = item.short_name + '*' + item.buy_num + '箱、';
            } else {
              attr_str = item.short_name + '*' + item.buy_num + '箱';
            }
            goods_name += attr_str;
          })
        }

        _orderInfo.goods_name = goods_name;

        wx.redirectTo({
          url: `/pages/storeOrder/myorder/payResult/index?result=${encodeURIComponent(JSON.stringify(_orderInfo))}`
        })

        return

      }
      return
    }
    this.setData({
      isLoading:false
    })
    wx.showModal({
      title: '温馨提示.',
      content: msg,
      showCancel: false
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    isHide = true;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    isHide = false;
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