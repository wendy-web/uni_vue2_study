// pages/storeDisplay/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    tabs:[{name:'全部',id:0},{name:'未开始',id:1},{name:'进行中',id:2},{name:'已结束',id:3}]
  },
  onShow(){
    this.refresh()
  },
  /**业务函数 */
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
  refresh(){
     this.selectAllComponents('.item-list').forEach(item=>{
       item.reset()
     })
  },
  //签约
  sign(event){
    this.selectComponent('#signConfirm').showPopup(event.detail)
  }
})