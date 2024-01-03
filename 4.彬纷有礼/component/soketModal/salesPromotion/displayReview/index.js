// pages/tabBar/geren/salesPromotion/displayReview/index.js
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
    config:{},
    ckey:"",
    clean:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDisplayShopComple(){
      let {shop_id,dis_id,date} = this.data.config.extend
      wx.navigateTo({
        url: `/pages/storeDisplay/displayShopComple/index?dis_id=${dis_id}&shop_id=${shop_id}&date=${date}`
      })
      this.onClose()
    },
    showPopup(config,ckey,clean) {
      this.setData({ show: !clean,clean,loading:false,config,ckey});
    },
    onClose() {
      this.setData({ show: false });
      if(!this.data.clean){
        this.triggerEvent('releaseQueueTaskBack',{key:this.data.ckey||'rec'})
      }
    }
  }
})
