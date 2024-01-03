const http = require('../../api/index')
const {getUserLocation} = require("../../../../utils/location")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    tabs:[{name:'全部',id:0,count:""},{name:'待受理',id:1,count:""},{name:'待配送',id:2,count:""},{name:'待收货',id:3,count:""},{name:'待结算',id:4,count:""},{name:'已完成',id:5,count:""}]
  },
  onLoad(option){
    let activeTab = option.activeTab || 0
    this.setData({active:Number(activeTab)})
    /**自动获取一次经纬度 */
    getUserLocation().then(res=>{})
  },
  onShow(){
    this.refresh()
  },
  /**业务函数 */
  toolsTrigger(event){
     let {toolType,did,oid,total_amount,discount_amount,d_amount,c_amount,avg_price} = event.detail

     switch(toolType){
      case 'refuse':
      this.selectComponent("#refuseOrder").showPopup({did,oid})
      break
      case 'cancel':
      this.selectComponent("#cancelOrder").showPopup({did,oid})
      break
      case 'confirmOrder':
      this.selectComponent("#confirmOrder").showPopup({did,oid})
      break
      case "confirmReceipt":
        wx.navigateTo({
          url: '/pages/storeOrder/monthlyOrder/confirmReceipt/index?oid='+oid
        })
      break  
     case "confirmSettle":
        wx.navigateTo({
          url: '/pages/storeOrder/myorder/pay/index?orderInfo='+JSON.stringify({pay_type:2,id:oid,total_amount,discount_amount,d_amount,c_amount,avg_price})
        })
       break 
     }
  },
  tabChange(e){
    this.setData({
      active:e.detail.name
    })
  },
  swiperChange(e){
    this.setData({
      active:e.detail.current
    })
  },
  /**顶部统计 */
  getTopCount(){
     http.ylcount().then(res=>{

      let topCount = ['','','','','','']

      let tabs = this.data.tabs
       
      if(res.code == 1){
        let {status_1,status_2,status_3,status_dyj} = res.data
        topCount[1] = status_1.pay_type[2].o_sum||''
        topCount[2] = status_2.pay_type[2].o_sum||''
        topCount[3] = status_3.pay_type[2].o_sum||''
        topCount[4] = status_dyj.pay_type[2].o_sum||''
      }

      tabs = tabs.map((item,index)=>{
        let {name,id,count} = item
        return {
          name,id,count:topCount[index]
        }
      })
     
         this.setData({
        tabs
      })

     })
  },
  refresh(){
    this.getTopCount()
    this.selectAllComponents('.item-list').forEach(item=>{
      item.reset()
    })
  }
})