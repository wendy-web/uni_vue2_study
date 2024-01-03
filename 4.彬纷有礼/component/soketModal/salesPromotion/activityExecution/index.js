// pages/tabBar/geren/salesPromotion/activityExecution/index.js
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
    list:[],
    clean:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    lookInfo(){
      let list = this.data.list
      if(list.length == 1){
        let userdata = wx.getStorageSync('userdata')||"{}"
        let {shop_id} = userdata
        let {pro_id} = list[0]
        wx.navigateTo({
          url: `/pages/storeDisplay/promotionDetails/index?shop_id=${shop_id}&pro_id=${pro_id}`
        })
      }else{
        wx.navigateTo({
          url: '/pages/storeDisplay/index/index',
        })
      }
      this.onClose()
    },
    onClose() {
      this.setData({ show: false });
      if(!this.data.clean){
        this.triggerEvent('releaseQueueTaskBack',{key:'act_1'})
      }
    },
    showPopup(list,clean) {

      let reg = new RegExp(/-/gm)
      
      list = list.map(item=>{
          let {title,end_time,start_time,dis_completed_num,dis_need_num,completed_num,need_num,pro_id} = item
          /**截止时间挫 */        
          let timeStamp = new Date(end_time.replace(reg, '/')) - new Date(start_time.replace(reg, '/'))
          /**进货*/
          let purValue = null
          if(need_num>0){
            purValue = (completed_num/need_num*100).toFixed(1)
          }
          /*陈列*/  
          let disValue = null
          if(dis_need_num>0){
            disValue = `${dis_completed_num}/${dis_need_num}`
          }     
               
            return {
              title,
              day:Math.ceil(timeStamp/(24*60*60*1000)) + 1,
              purValue,
              disValue,
              pro_id
            }
             

      })

      this.setData({ show: !clean,clean,loading:false,list});
    }
  }
})
