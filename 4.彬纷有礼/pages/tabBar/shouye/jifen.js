//index.js
//获取应用实例
const app = getApp();
const API_BASE_URL = app.globalData.API_BASE_URL;
const COS_URL = app.globalData.COS_URL;
const utils = require('../../../utils/util');
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime.js'
import {
  xdyhMini,
  reportEvent
} from '../../../api/openMiniProgram'
import {
  getxdyhUser,
  getConfig
} from '../../../api/config'
let page_hide = false;
Page({
  data: {
    taroCompReady: 1,
    storeurl: "",
    loaded: true,
    img_nopoint: COS_URL + "/public/img/bfyl/assets/hongbao/nopoint.png",
    bg_credit: `${COS_URL}/public/img/bfyl/202303/bg_credit.png`,
    btn_credit_exc: `${COS_URL}/public/img/bfyl/202303/btn_credit_exc.png`,
    userInfo: null, //小店优惠的用户信息
    config: null, //配置信息
  },

  onLoad(options) {


  },
  onShow() {
    // 判断是否退出登录
    let isLoggedIn = wx.getStorageSync('isLoggedIn');
    isLoggedIn = Boolean(isLoggedIn > 0);
    this.setData({
      isLoggedIn
    })
    if (page_hide) {
      page_hide = false
      if (isLoggedIn) {
        this.getxdyhUser()
      }
    }
  },
  async getxdyhUser(open = false) {

    try {
      let config = utils.getCache('xdyzConfig230810');
      if (config) {
        this.setData({
          config: JSON.parse(config)
        })
      } else {
        let res = await getConfig();
        if (res.code == 1 && res.data.ad1) {
          utils.setCache('xdyzConfig230810', JSON.stringify(res.data), 1800)
          this.setData({
            config: res.data
          })
        } else {
          this.setData({
            config: null
          })
        }
      }

      // 先获取用户信息（身份判断）再初始化其它业务逻辑
      let result = await getxdyhUser();
      const {
        code,
        data: userInfo
      } = result
      if (+code == 1) {
        this.setData({
          userInfo
        })
      }
      if (open) {
        this.openXdyh()
      }
    } catch (error) {
      //  用户信息接口登录失效不会重复回调（wxlogin 之后会调用）所以这里需要监听token登录成功的回调
      app.tokenReadyCallback = (token) => {
        getxdyhUser().then(result => {
          const {
            code,
            data: userInfo
          } = result
          if (+code == 1) {
            this.setData({
              userInfo
            })
          }
          getConfig().then(res => {
            if (res.code == 1) {
              utils.setCache('xdyzConfig230810', JSON.stringify(res.data), 1800)
              this.setData({
                config: res.data
              })
            }
          })
          if (open) {
            this.openXdyh()
          }
        });
      }
    }
  },
  openXdyh() {
    let event_name = 'click_exchange';
    let {
      platform = ''
    } = app.globalData.systemInfo;
    let event_data = {
      "devices": platform
    }
    reportEvent(event_name, event_data)
    let {
      userInfo,
      config
    } = this.data;
    let page = userInfo?.page || '';
    xdyhMini({
      path: page,
      halfScreen: config.scoreShop || ''
    })
  },
  onTabItemTap(item) {
    console.log("积分商城点击事件······");
    let event_name = 'click_imall';
    let {
      platform = ''
    } = app.globalData.systemInfo;
    let event_data = {
      "devices": platform
    }
    reportEvent(event_name, event_data)
    if (!this.data.userInfo) {
      return this.getxdyhUser(true)
    }
    this.openXdyh()
  },
  onHide() {
    page_hide = true
  }
})