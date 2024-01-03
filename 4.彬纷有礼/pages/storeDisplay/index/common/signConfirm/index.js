// pages/storeDisplay/component/promotion/signConfirm/index.js
const http = require("../../../api/index")
Component({
  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    config:{
      title:''
    },
    loading:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showPopup(config) {
      this.setData({ show: true,loading:false,config});
    },
    onClose() {
      this.setData({ show: false });
    },
    lookInfo(){
      let {flow_url} = this.data.config
          wx.navigateTo({
            url: `/pages/tabBar/shouye/webview/index?link=${flow_url}`
          })
    },
    sign(){
      if(this.data.loading)return
      this.setData({
        loading:true
      })
       let {flow_id} = this.data.config
       http.essStatus({
        id:flow_id,
        status:1
       }).then(res=>{
           if(res.code == 1){
             wx.showToast({
               title: '签约成功',
               duration:4000,
               icon:"none"
             })
             this.setData({
              show:false
            })
            this.triggerEvent('refresh')
           return
          }
          //其它提示 
          wx.showToast({
            title: res.msg,
            duration:4000,
            icon:"none"
          })
          this.setData({
            loading:false
          })
       })
    }
  }
})
