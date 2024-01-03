// pages/zhongduan/geren/guanyu/faq.js
const utils = require("../../../../utils/util");
const APP = getApp();
const Api = require("../../../../utils/api");
// 在页面中定义插屏广告
let interstitialAd = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: '', //常见问题列表
    online: APP.globalData.COS_URL + '/public/img/Tian/online.png',
    hotline: APP.globalData.COS_URL + '/public/img/Tian/hotline.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let systemInfo = APP.globalData.systemInfo;
    if (systemInfo) {
      let screenHeight = systemInfo.windowHeight;
      this.setData({
        screenHeight: screenHeight,
      });
    }

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-25e899b3f0d53634'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }

    // 在适合的场景显示插屏广告
    if (interstitialAd && utils.blockAd()) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
    //请求数据
    this.getFaq();

  },
  getFaq: function () {
    wx.showLoading({
      title: '正在加载',
    })
    var that = this;
    Api.postBase({
      url: '/api/user/getquestion'
    }).then(res => {
      console.log("猜你想问：", res);
      const {
        code,
        data,
        msg
      } = res;
      if (code == 0) {
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2500
        })
      } else {
        that.setData({
          list: data
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  bindgetuserinfo: function (e) {
    let userInfo = e.detail.userInfo;
    if (userInfo) {
      wx.setStorageSync('originalUserInfo', JSON.stringify(userInfo))
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  kindToggle: function (e) {
    var id = e.currentTarget.id,
      list = this.data.list;
    console.log("id:", id);
    for (var i = 0, len = list.length; i < len; ++i) {
      console.log("list[i].title:", list[i].title);
      if (list[i].title == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
  //在线客服
  contact: function () {
    wx.navigateTo({
      url: '/pages/zhongduan/geren/guanyu/index',
    })
  },
  //服务热线
  call: function () {
    wx.makePhoneCall({
      // phoneNumber: '075528710605', //电话号码应当请求后台，方便修改
      phoneNumber: '400-870-7076', //电话号码应当请求后台，方便修改
      success: (res) => {
        console.log("成功：", res)
      },
      fail: (res) => {
        console.log("失败：", res)

      }
    })
  },
})