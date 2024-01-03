// pages/storeDisplay/component/promotion/alreadyEnded/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    config:{
      type:Object,
      value:{}
    }
 },
  /**
   * 组件的方法列表
   */
  methods: {
    lookInfo(){
      let {labelData,flow_url,status,sid,pro_id,flow_id,title} = this.properties.config
      //標簽名稱
      let labelDataText = labelData?labelData.text:''
      //进行中
      if([0,1].indexOf(status)>-1&&labelDataText == '未签约'){
        if(labelData.isNoLookInfo){
          //不处理
          return 
        }
        this.triggerEvent('sign',{flow_id,title,flow_url})
        return
      }
     //跳转促销活动详情
      wx.navigateTo({
        url: `/pages/storeDisplay/promotionDetails/index?shop_id=${sid}&pro_id=${pro_id}&pageStatus=${status}`
      })
    }
  }
})
