const http = require('../../../../api/index')
//待受理
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
    /**回调处理 */
    toolsHandle(event){
        let {toolType} = event.target.dataset
        let {b_sid:did,id:oid,total_amount,yh_amount:discount_amount,d_amount,c_amount,avg_price} = this.properties.config
        /**催送业务直接处理 */
        if(['urgeDelivery','urgeOrder'].includes(toolType)){
           this.urge(toolType)
          return 
        }
        /**回调处理 */
        this.triggerEvent('toolsTrigger',{toolType,oid,did,total_amount,discount_amount,d_amount,c_amount,avg_price})
    },
    urge(toolType){

      let {id:oid} = this.properties.config
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
    /**查看详情 */
    lookInfo(){
      let {id} =  this.properties.config
       wx.navigateTo({
         url: '/pages/storeOrder/monthlyOrder/details/index?oid='+id,
       })
    }
  }
})
