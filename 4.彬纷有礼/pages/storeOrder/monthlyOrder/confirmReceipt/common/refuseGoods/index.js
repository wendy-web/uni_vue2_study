// pages/storeOrder/monthlyOrder/common/refuseOrder/index.js
const http = require("../../../../api/index")
//请求参数
let _parmas = null
Component({
  /**
   * 组件的初始数据
   */
  data: {
    show:false,
    loading:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    refuse(){
      let {oid,did,note} = _parmas
      this.setData({
        loading:true
      })
      http.verifyCancel({oid,did,note}).then(res=>{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
        this.setData({
          loading:false
        })
        /**成功的话关闭弹窗，并且回调刷新 */
        if(res.code == 1){
          this.setData({
            show:false
          })
          this.triggerEvent('refuseBack')
        }
      }).catch(res=>{
        this.setData({
          loading:false
        })
      })
    },
    showPopup(data){
      _parmas = data
      this.setData({
        show:true,
        loading:false
      })
    },
    onClose(){
      this.setData({
        show:false
      })
    }
  }
})
