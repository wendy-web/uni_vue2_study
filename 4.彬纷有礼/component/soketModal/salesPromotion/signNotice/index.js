var http = require('../../../../utils/api');
Component({
  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    config:{
      title:'',
      tip:""
    },
    loading:false,
    ckey:"",
    clean:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showPopup(config,ckey,clean) {
      this.setData({ show: !clean,clean,loading:false,config,ckey});
    },
    onClose() {
      this.setData({ show: false });
      if(!this.data.clean){
        this.triggerEvent('releaseQueueTaskBack',{key:this.data.ckey||'ess'})
      }
    },
    lookInfo(){
      let {pdf_url} = this.data.config
          wx.navigateTo({
            url: `/pages/tabBar/shouye/webview/index?link=${pdf_url}`
          })
    },
    sign(){
      if(this.data.loading)return
      this.setData({
        loading:true
      })
       let {id} = this.data.config
       http.postBase({url:'/app/store/essStatus',params:{
        id,
        status:1
       }}).then(res=>{
           if(res.code == 1){
            //  wx.showToast({
            //    title: '签约成功',
            //    duration:4000,
            //    icon:"none"
            //  })
            wx.navigateTo({
              url: '/pages/storeDisplay/index/index',
            })
             this.onClose()
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
