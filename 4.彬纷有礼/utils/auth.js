
module.exports = {
  setCosAddress(data){
     if(!data)return console.warn('setCosAddress 不能存储空值')
     if(typeof data !== 'object')return console.warn('setCosAddress 存储值非Object类型',data)
       wx.setStorageSync('cosAddressNew_c', JSON.stringify(data))
  },
  getCosAddress(){
     let data = wx.getStorageSync('cosAddressNew_c')
      if(data){
        return JSON.parse(data)
      }
      return null
  },
  // 店铺排行榜
  setActivePopUpWindow(time){
    wx.setStorageSync('activePopUpWindow', time)
  },
  getActivePopUpWindow(){
      return  wx.getStorageSync('activePopUpWindow')
  },
  // 开箱活动券
  setActCouponPopUp(time){
    wx.setStorageSync('actCouponPopUp', time)
  },
  getActCouponPopUp(){
      return  wx.getStorageSync('actCouponPopUp')
  }
}
