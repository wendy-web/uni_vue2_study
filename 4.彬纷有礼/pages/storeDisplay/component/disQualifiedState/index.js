// pages/storeDisplay/component/disQualifiedState/index.js
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
    config:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showPopup(data){
      this.setData({
        show:true,
        config:data
      })
     },
     onClose(){
       this.setData({
         show:false
       })
     }
  }
})
