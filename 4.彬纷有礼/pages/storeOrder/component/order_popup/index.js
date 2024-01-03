// pages/storeOrder/component/order_popup/index.js
const orderApi = require("../../api/index");
const {getUserLocation} = require("../../../../utils/location")

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    confirmReceiptShow:false,//确认收货弹窗
    rejectReceiptShow:false,//拒绝收货弹窗
    acceptOrdersShow:false,//接受订单弹窗
    cancelOrdersShow:false,//取消订单弹窗
    rejectOrdersShow:false,//拒绝订单弹窗
    paidOrdersShow:false,//已支付订单弹窗
    dxdConfirmShow:false,//代下单确认弹窗
    orderInfo:null,//订单信息
  },

  attached(){
  
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose(event){
      let {popname} = event.currentTarget.dataset;
      console.log("popname:",popname);
      // this.setData({
      //   [`${popname}`]:false
      // })
      this.setData({
        [popname]:false
      })
      
    },
    //显示确认收货弹窗
    showConfirmReceiptPop(data){
      this.setData({
        confirmReceiptShow:true,
        orderInfo:data
      })
    },
    //显示拒绝收货弹窗
    showrRejectReceiptPop(data){
      this.setData({
        rejectReceiptShow:true,
        orderInfo:data
      })
    },
    //接受订单弹窗
    acceptOrdersShow(data){
      this.setData({
        acceptOrdersShow:true,
        orderInfo:data
      })
    },
    //拒绝订单弹窗
    rejectOrdersShow(data){
      this.setData({
        rejectOrdersShow:true,
        orderInfo:data
      })
    },
    //取消订单弹窗
    cancelOrdersShow(data){
      this.setData({
        cancelOrdersShow:true
      })
    },
    //已支付订单弹窗
    paidOrdersShow(data){
      this.setData({
        paidOrdersShow:true
      })
    },
    //业务员代下单弹窗
    dxdConfirmShow(data){
      this.setData({
        dxdConfirmShow:true,
        orderInfo:data
      })
    },
    //拒绝收货
    rejectReceipt(event){
      let {item} = event.currentTarget.dataset;
      console.log("拒绝收货",item);
      orderApi.verifyCancel({
        oid:item.id,
        did:item.b_sid
      }).then(res=>{
        let {code,msg} = res;
        this.setData({
          rejectReceiptShow:false,
          loading:false
        })
        if(code==1){
          this.triggerRefresh();
          return
        }
       
        wx.showModal({
          title: '温馨提示',
          content:msg,
          showCancel:false
        })
      }).catch(err=>{
        this.setData({
          loading:false
        })
        wx.showModal({
          title: '温馨提示',
          content:JSON.stringify(err),
          showCancel:false
        })
      })
    },
    //确认收货
    confirmReceipt(event){
      let orderInfo = this.data.orderInfo;
      let {id:oid,b_sid:did,note=''} = orderInfo;
      this.confirm({oid,did,note});
    },
    //接受订单
    acceptOrders(event){
      let {item} = event.currentTarget.dataset;
      console.log("拒绝订单：",item);
    
      this.setData({
        loading:true
      })
      orderApi.confirm({oid:item.id}).then(res=>{
       
        let {code,msg} = res;
        this.setData({
          acceptOrdersShow:false,
          loading:false
        })
        if(code==1){
          this.triggerRefresh();
          return
        }
       
        wx.showModal({
          title: '温馨提示',
          content:msg,
          showCancel:false
        })
      }).catch(err=>{
        this.setData({
          loading:false
        })
        wx.showModal({
          title: '温馨提示',
          content:JSON.stringify(err),
          showCancel:false
        })
      })
    },
    //取消订单
    cancelOrders(event){

    },
    //拒绝订单
    rejectOrders(event){
      let {item} = event.currentTarget.dataset;
      console.log("拒绝订单：",item);
      this.setData({
        loading:true
      })
      orderApi.cancelCitic({oid:item.id}).then(res=>{
       
        let {code,msg} = res;
        this.setData({
          rejectOrdersShow:false,
          loading:false
        })
        if(code==1){
          this.triggerRefresh();
          return
        }
       
        wx.showModal({
          title: '温馨提示',
          content:msg,
          showCancel:false
        })
      }).catch(err=>{
        this.setData({
          loading:false
        })
        wx.showModal({
          title: '温馨提示',
          content:JSON.stringify(err),
          showCancel:false
        })
      })
    },
    //查看订单
    checkOrders(event){

    },
    //代下单确认操作
    dxdConfirm(event){
      let {item} = event.currentTarget.dataset;
      this.setData({
        loading:true
      })
      orderApi.confirm({oid:item.id}).then(res=>{
       
        let {code,msg} = res;
        this.setData({
          dxdConfirmShow:false,
          loading:false
        })
        if(code==1){
          this.triggerRefresh();
          return
        }
       
        wx.showModal({
          title: '温馨提示',
          content:msg,
          showCancel:false
        })
      }).catch(err=>{
        this.setData({
          loading:false
        })
        wx.showModal({
          title: '温馨提示',
          content:JSON.stringify(err),
          showCancel:false
        })
      })
    },
    //trigger 刷新数据
    triggerRefresh(){
      this.triggerEvent('myevent')
    },
    async confirm(_parmas){
      let {oid,did,note} = _parmas;
      this.setData({
        loading:true
      })
      try {
        /**发起请求 */
        wx.showLoading({
          title: '处理中'
        })
        /**获取经纬度 */
        let {longitude:lng,latitude:lat} = (await getUserLocation()).data  
        console.log("确认收货传参：",{oid,did,lng,lat,note});

        let res = await orderApi.verifyConfirmCitic({oid,did,lng,lat,note})
        wx.hideLoading()
        /**成功的话关闭弹窗，并且回调刷新 */
        if(res.code == 1){
          this.setData({
            confirmReceiptShow:false
          })
          this.triggerEvent('myevent');
          return
        }
        this.setData({loading:false})
         /**显示结果文字 */
        wx.showModal({
          title: '温馨提示',
          content:res.msg,
          showCancel:false
        })

      } catch (error) {
        this.setData({loading:false})
        wx.hideLoading()
      }
    },

  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
    },
    hide: function() {
      // 页面被隐藏
      this.setData({
        loading:false
      })
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  }
})
