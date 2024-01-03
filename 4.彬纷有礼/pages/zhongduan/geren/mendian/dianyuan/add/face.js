//获取应用实例
const app = getApp();
const COS_URL = app.globalData.COS_URL;
var utils = require('../../../../../../utils/util.js');
var http = require('../../../../../../utils/api');
var log = require('../../../../../../utils/log');
var qrcode;
let token = '';
Page({
  data: {
    pageReady: 1,
    loading: false,
    color: '#000',
    show: true,
    animated: false,
    locimg: COS_URL+'/public/img/bfyl/assets/store/md/locs.png',
    bgimg: COS_URL + '/public/img/bfyl/202202/img_face_bg.png',
    blockAd:false
  },
  onLoad: function () {

    token = '';
    var that = this;
    //判断用户是否授权获取定位信息
    var userdata = wx.getStorageSync('userdata');
    //请求获取邀请二维码
    var data = {
      sid: userdata.shop_id,
      type: 1
    };
    http.post('/api/tools/getshopqr2', data).then(res => {
      console.log('请求二维码:', res);
      log.setFilterMsg("getshopqr");
      log.info("面对面 获取店铺推广二维码(升级版)：", res);
      if (res.code == 1) {
        that.setData({
          qrcode: res.data.qr
        })
        token = res.data.token;

        return false;
      }
      if (res.code == 5) {
        //code = 5 unionid不存在需一键登录重新获取
        wx.reLaunch({
          url: '/pages/user/register/index',
        })
        return false;
      }
      if (res.code == 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    });
    //获取店铺简洁信息
    utils.getShopInfoMini(userdata.shop_id).then(data=>{
      console.log("店铺简洁信息：", data);
        that.setData({
          shopInfo: data
        });
    })
    
  },
  onShow(){
    this.setData({
      blockAd:utils.blockAd()
    })
  },
  share: function () {
    if (!((typeof wx.canIUse === 'function') && wx.canIUse('button.open-type.share'))) {
      wx.showModal({
        title: '当前版本不支持转发按钮',
        content: '请升级至最新版本微信客户端',
        showCancel: false
      })
    }
  },
  onShareAppMessage(res) {
    var that = this;
    var userdata = wx.getStorageSync('userdata');
    return {
      title: `成为` + userdata.nick_name + `的店员`,
      imageUrl: '../../../../../../assets/store/shareimg.png',
      path: `/pages/user/register/dy?sid=` + userdata.shop_id + "&token=" + token,
      success: function (res) {
        // 转发成功
        that.shareClick();
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onUnload: function () {
    token = '';
  },
  
})