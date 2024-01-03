const http = require("../../../api/index")
// const {getUserLocation} = require("../../../../../utils/location")
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
    confirm(){
      this.setData({
        loading:true
      })
      let {oid} = _parmas
      http.confirm({oid}).then(res=>{
       /**显示结果文字 */
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
        /**成功的话关闭弹窗，并且回调刷新 */
        if(res.code == 1){
          this.setData({
            show:false
          })
          this.triggerEvent('refresh')
        } 
      }).catch(res=>{
        this.setData({
          loading:false
        })
      })
    },
    // async confirm(){
    //   let {oid,did} = _parmas
    //   this.setData({
    //     loading:true
    //   })
    //   try {
    //     /**获取经纬度 */
    //     let {longitude:lng,latitude:lat} = (await getUserLocation()).data  
    //     /**发起请求 */
    //     wx.showLoading({
    //       title: '处理中'
    //     })
    //     let res = await http.verifyConfirmCitic({oid,did,lng,lat})
    //     /**显示结果文字 */
    //     wx.showToast({
    //       title: res.msg,
    //       icon:'none'
    //     })
    //     /**成功的话关闭弹窗，并且回调刷新 */
    //     if(res.code == 1){
    //       this.setData({
    //         show:false
    //       })
    //       this.triggerEvent('refresh')
    //     } 
    //   } catch (error) {
    //     console.log(error)
    //   }finally{
    //     this.setData({loading:false})
    //     wx.hideLoading()
    //   }
    // },
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
