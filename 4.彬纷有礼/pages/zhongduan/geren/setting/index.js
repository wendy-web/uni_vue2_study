const app = getApp();
const utils = require('../../../../utils/util');
let checkA = false;
let checkB = false;

Page({
  data: {
    yinsiChecked: false,
    privacyConfirmShow:false
  },
  async onLoad() {
    try {
      let userInfo = wx.getStorageSync('userdata') || await utils.getUserInfoNew();
      this.setData({
        userInfo
      })
    } catch (error) {
      console.log("onLoad catch:",error)
    }
  },
  onShow: function () {

  },
  loginOut: function () {
    wx.removeStorage({
      key:'islogin',
      complete:(res)=>{
        console.log("clearStorage res:",res);
        wx.reLaunch({
          url: '/pages/user/register/index',
        })
      }
    })
    return
    

  },
  loggedIn(){
    let {yinsiChecked} = this.data;
    if (!yinsiChecked) {
      
      this.setData({
        privacyConfirmShow:true
      })
      return
    }
    wx.setStorageSync('isLoggedIn', 1);
    wx.reLaunch({
      url: '/pages/tabBar/geren/index',
    })
  },
  onChange(event) {
    this.setData({
      yinsiChecked: event.detail,
    });
  },
  checkDeal: function (e) {
    let {id} = e.currentTarget.dataset;
    console.log("id:", id);
    let urlA = 'https://txc.y1b.cn/index/index/ysxy.html';
    urlA = encodeURIComponent(urlA);
    let urlB = 'https://txc.y1b.cn/index/index/bfylfl.html';
    urlB = encodeURIComponent(urlB);
    if (id == 1) {
      checkA = true;
      if (checkA && checkB) {
        this.setData({
          yinsiChecked: true
        })
      }
      wx.navigateTo({
        url: '/pages/tabBar/shouye/webview/index?link=' + urlA,
      })
    } else {
      checkB = true;
      if (checkA && checkB) {
        this.setData({
          yinsiChecked: true
        })
      }
      wx.navigateTo({
        url: '/pages/tabBar/shouye/webview/index?link=' + urlB,
      })
    }
  },
  // 弹窗勾选隐私
  confirmPrivacy(){
    this.setData({
      yinsiChecked:true,
      privacyConfirmShow:false
    })
    this.loggedIn();
  },
  // 关闭弹窗
  onCloseDialog(){
    this.setData({
      privacyConfirmShow:false
    })
  }
})