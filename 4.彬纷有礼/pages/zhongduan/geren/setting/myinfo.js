// pages/zhongduan/geren/setting/myinfo.js
const app = getApp();
const utils = require("../../../../utils/util");
const log = require("../../../../utils/log");
let _request = false;

import {
  mnmobile
} from '../../../../api/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logOutPopShow: false, //退出登录弹窗
    supportGetPhoneCode: utils.compareVersion(app.globalData.systemInfo.SDKVersion, '2.21.2') >= 0, // getPhoneNumber 是否支持返回code 参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

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
    var that = this;

    //获取用户信息
    utils.getUserInfoNew().then(data => {
      var reg = /^(\d{3})\d*(\d{4})$/;
      if (data.mobile) {
        data.phoneStr = data.mobile.replace(reg, '$1****$2');
      }
      that.setData({
        userdata: data,
      })
      // 隐藏解绑纸质码入口 2021年3月22日
      utils.getShopInfo().then(shop_data => {
        that.setData({
          shopInfo: shop_data,
        })
        wx.setStorageSync('storeInfo', shop_data)
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err);
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.hideLoading({
      success: (res) => {},
    })
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  navigateTo: function (e) {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    let url = e.currentTarget.dataset.url;
    console.log("跳转地址 url：", url);
    if (url) {
      wx.navigateTo({
        url: url,
      })
    } else {
      wx.hideLoading({
        success: (res) => {},
      })
    }

  },
  // 修改用户信息
  modifyInfo(event) {
    let {
      nick_name,
      avatar_url
    } = this.data.userdata;
    let {
      open_type
    } = event.currentTarget.dataset;
    if (nick_name) {
      nick_name = encodeURIComponent(nick_name)
    }
    if (avatar_url) {
      avatar_url = encodeURIComponent(avatar_url)
    }
    let url = `/pages/zhongduan/geren/setting/modifyInfo?open_type=${open_type}&avatar_url=${avatar_url}&nick_name=${nick_name}`
    wx.navigateTo({
      url: url,
    })
  },
  // 退出登录确认弹窗
  openLogOutPop() {
    this.setData({
      logOutPopShow: true
    })
  },
  onClose(event){
    let {popname} = event.currentTarget.dataset;
    this.setData({
      [popname]:false
    })
  },
  // 退出登录，跳转到我的页面
  logout(){
    wx.setStorageSync('isLoggedIn', 0);
    wx.reLaunch({
      url: '/pages/tabBar/geren/index',
    })
  },
  // 绑定手机号弹窗
  openBindPhonePop(){
    this.selectComponent('#bindPhonePop').showBindPhonePop();
  },
  // 手机号绑定成功
  async bindPhoneSuccess(){
    try {
      let userdata = await utils.getUserInfoNew();
      var reg = /^(\d{3})\d*(\d{4})$/;
      if (userdata.mobile) {
        userdata.phoneStr = userdata.mobile.replace(reg, '$1****$2');
      }
      console.log("bindPhoneSuccess 更新用户信息：",userdata);
      this.setData({
        userdata
      })
    } catch (error) {
      console.log("bindPhoneSuccess catch:",error)
    }
  },
  //调用微信绑定的手机号
  async getPhoneNumber(e) {
    console.log("获取手机号：", e.detail);
    let {
      iv,
      encryptedData,
      code = ''
    } = e.detail;
    try {

      // 低版本基础库（<=2.20.2）没有code
      if (code || (iv && encryptedData)) {
        wx.showLoading({
          title: '加载中···',
        })

        let params = {
          encryptedData,
          iv,
          code
        };
        if (_request) return wx.hideLoading();
        _request = true;
        log.addFilterMsg("api_user_mnmobile");
        log.info("api_user_mnmobile传参：", params);
        mnmobile(params).then(res => {
          log.info("绑定结果：", res);
          wx.hideLoading()
          _request = false;
          let {
            code,
            msg
          } = res;
          if (+code == 1) {
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 2000
            })
            
            this.bindPhoneSuccess()
            return
          } else {
            wx.showModal({
              title: '温馨提示',
              content: msg,
              showCancel: false
            })
          }
        }).catch(err => {
          log.info("api_user_mnmobile err:", err)
          wx.hideLoading()
          _request = false;
        })
      } else {
        _request = false;
        console.log(e.detail);
        let {
          errMsg = '',
            errno = ''
        } = e.detail;
        log.addFilterMsg("getPhoneNumberFailed");
        log.info("未获取到手机号:", e.detail);
        if (errno && errno == 104) return;
        const regex = /user deny|user cancel/;
        if (errMsg && !regex.test(errMsg)) {
          wx.showModal({
            title: '温馨提示',
            content: errMsg,
            showCancel: false
          })
          return
        }

      }
    } catch (err) {
      console.log("catch:", err)
      log.addFilterMsg("getPhoneNumberCatch");
      log.info("解析手机号catch:", err)
      if (err.msg) {
        wx.showModal({
          title: '温馨提示',
          content: err.msg,
          showCancel: false
        })
      }
    } finally {
      _request = false;
    }
  },
})