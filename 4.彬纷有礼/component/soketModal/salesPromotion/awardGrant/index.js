// pages/tabBar/geren/salesPromotion/awardGrant/index.js
Component({
  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    config:{
      awarded_num:0,
      send_time:'',
      title:"",
      pur_id:0,
      pro_id:""
    },
    ckey:"",
    clean:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose() {
      this.setData({ show: false });
      if(!this.data.clean){
        this.triggerEvent('releaseQueueTaskBack',{key:this.data.ckey||'act_2'})
      }
    },
    showPopup(res,ckey,clean) {

      let {awarded_num,send_time,title,pur_id,pro_id} = res

      this.setData({ show: !clean,clean, ckey,config:{
        awarded_num:Number(awarded_num),
        send_time,
        title,
        pur_id,
        pro_id
      }});
    },
    /**去卡劵的惠让劵 */
    goCoupon(){
       wx.navigateTo({
         url: '/pages/phaseIII/voucher/index?activeTab=1'
       })
       this.onClose()
    },
    /**店铺促销任务列表 */
    goStoreDisplay(){
      let userdata = wx.getStorageSync('userdata')||"{}"
      let {shop_id} = userdata
      wx.navigateTo({
        url: `/pages/storeDisplay/promotionDetails/index?shop_id=${shop_id}&pro_id=${this.data.pro_id}`
      }) 
      this.onClose()
    }
  }
})
