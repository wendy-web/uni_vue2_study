const app = getApp();
const COS_URL = app.globalData.COS_URL;
const utils = require("../../../utils/util");
const jumpMap = {
  '1':'pages/phaseIII/voucher/index',
  '2':'pages/storeAllowance/list/index',
  '3':'pages/storeOrder/myorder/index/index'
};

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
    show: false,
    config:{
      pay_type:"",
      tip:[],
      type:""
    },
    ckey:"",
    clean:false,
    icon_bell:COS_URL+'/public/img/bfyl/202209/icon_bell.png',//铃铛图标
    bg_order_task_pop:COS_URL+'/public/img/bfyl/202209/bg_order_task_pop.png',
    publicShow:false,//2023年8月11日 公共消息弹窗
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //去全部订单
    goCheck(){
       wx.navigateTo({
         url: '/pages/storeOrder/myorder/index/index?activeTab=0',
       })
    },
    goNow(){
      
       let {type,pay_type,oid} = this.data.config
       //1-->确认收货(待收货) 2确认订单(待受理) 3.付款(待受理)
       let  activeTabs = {1:3,2:1,3:1} 
       //根据判断跳转
       switch(Number(pay_type)){
          case 0:
          case 1:
            /**我的订单 */
            // 引单8.1 待下单（2，3），确认收货（1）跳转至订单详情页
            if([1,2,3].includes(+type)){
              wx.navigateTo({
                url: '/pages/storeOrder/myorder/orderDetail/index?oid=' + oid,
              })
            }else{
              wx.navigateTo({
                url: `/pages/storeOrder/myorder/index/index?activeTab=${activeTabs[type]||0}`
              })

            }
            break
          case 2: 
            /**月结订单 */
            wx.navigateTo({
              url: `/pages/storeOrder/monthlyOrder/index/index?activeTab=${activeTabs[type]||0}`
            })
            break  
       }
       //关闭弹窗
       this.onClose()
    },
    showPopup(config,ckey,clean) {
      if(typeof config.tip == 'string'){
        let arr = [];
        arr.push(config.tip);
        config.tip = arr;
      }
      this.setData({ show:!clean,clean,loading:false,config,ckey});
    },
    showPublicPopup(config,ckey,clean) {
      if(typeof config.tip == 'string'){
        let arr = [];
        arr.push(config.tip);
        config.tip = arr;
      }
      this.setData({ publicShow:!clean,clean,loading:false,config,ckey});
    },
    onClose() {
      this.setData({ show: false,publicShow:false });
      if(!this.data.clean){
          this.triggerEvent('releaseQueueTaskBack',{key:this.data.ckey||'order_1'})
      }
    },
    openPage(event){
      let {jump=0} = event.currentTarget.dataset;
      let url =jumpMap[jump];
      if(url){
        utils.navigateFrequentPage(url,'?activeTab=0')
      }
      this.onClose();
    }
  }
})
