// component/bindPhonePop/index.js
const utils = require('../../utils/util');
const log = require("../../utils/log");

const app = getApp();
let _request = false;
var timer = ''; //验证码定时器
let pageHide = '';

var mobileReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
var spaceReg = /\s/g;
import {
  sendsms,
  bdmobile,
  mnmobile
} from '../../api/config'
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    bindPhonePopShow: false,
    supportGetPhoneCode: utils.compareVersion(app.globalData.systemInfo.SDKVersion, '2.21.2') >= 0, // getPhoneNumber 是否支持返回code 参数
    mobile: '',
    smsCode: '',
    countdown: 60,
    resend: false,
    sendMsgTimes: 0, //2023年10月18日 发送短信的次数，>=2,第三次时就直接调用微信的手机号来绑定

  },
  lifetimes: {
    async attached() {
      // 在组件实例进入页面节点树时执行
      try {
        let userdata = wx.getStorageSync('userdata') || await utils.getUserInfoNew();
        this.setData({
          userdata
        })
      } catch (error) {
        console.log("bindPhonePop 组件attached error:", error);
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
      console.log("页面显示");
      pageHide = false;

    },
    hide: function () {
      // 页面被隐藏
      pageHide = true;
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onClose(event) {
      let {
        popname
      } = event.currentTarget.dataset;
      this.setData({
        [popname]: false
      })
    },
    showBindPhonePop() {
      let {
        supportGetPhoneCode
      } = this.data;
      console.log("是否支持授权获取手机号：", supportGetPhoneCode);
      this.setData({
        bindPhonePopShow: true,
      })
    },
    //调用微信绑定的手机号
    async getPhoneNumber(e) {
      let that = this;
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
              this.setData({
                bindPhonePopShow:false
              })
              this.triggerEvent('bindPhoneSuccess');
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
    // 绑定手机号（短信验证码版本）
    async bindPhoneSMS() {
      log.addFilterMsg('bindPhoneSMS')
      try {
        let {
          mobile,
          smsCode,
          userdata
        } = this.data;
        // 手机号不为空
        if (!mobile) {
          return wx.showToast({
            title: '请输入手机号',
            icon: 'none'
          })
        }
        //验证手机号
        if (!mobileReg.test(mobile)) {
          wx.showToast({
            title: '手机号格式不正确',
            icon: 'none',
          })
          return
        }
        // 验证码
        if (!smsCode) {
          return wx.showToast({
            title: '请输入验证码',
            icon: 'none'
          })
        }

        //更新用户信息+手机号
        this.updateUserInfoMobile()

      } catch (error) {
        console.log("bindPhoneSMS catch:", error)
        log.error('bindPhoneSMS:', error)
      }
    },
    inputMobile: function (event) {
      // console.log('输入手机号：', event.detail)
      const mobile = event.detail.replace(spaceReg, '');
      this.setData({
        mobile
      })
    },
    inputVcode: function (event) {
      // console.log('验证码：', e.detail.value)
      const smsCode = event.detail.replace(spaceReg, '');
      this.setData({
        smsCode
      })
    },
    //倒计时
    settime: function () {
      // 息屏退出
      if (pageHide) {
        return
      }
      var {
        countdown
      } = this.data;
      timer = setInterval(() => {
        if (countdown == 0) {
          this.setData({
            countdown: 60,
            resend: false
          });
          return clearInterval(timer)
        }
        countdown--;
        this.setData({
          countdown,
          resend: true
        })
      }, 1000);
    },
    // 获取验证码
    async getVcode() {
      try {
        let {
          mobile,
          resend,
          sendMsgTimes
        } = this.data;
        if (!mobileReg.test(mobile)) { //验证手机号
          wx.showToast({
            title: '手机号格式不正确',
            icon: 'none',
            duration: 1000
          })
          return
        }
        if (resend) return;

        //发送验证码
        wx.showLoading({
          title: '正在发送',
          mask: true
        })

        //设置倒计时
        var params = {
          mobile: mobile
        }
        const {
          code,
          msg
        } = await sendsms(params, true);
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 3000
        })
        if (+code === 1) {
          sendMsgTimes++;
          this.setData({
            resend: true,
            sendMsgTimes
          })
          this.settime();
          return
        }
        this.setData({
          resend: false
        })
      } catch (error) {
        console.log('getVcode catch:', error)
        this.setData({
          resend: false
        })
      }
    },
    // 绑定手机号
    async updateUserInfoMobile() {
      let {
        mobile,
        smsCode,
        userdata,
      } = this.data;

      wx.showLoading({
        title: '加载中···',
        mask: true
      })

      try {

        // 更新手机号
        const params = {
          yzm: smsCode,
          mobile,
          type: 0 // 0绑定，1更改
        }
        log.setFilterMsg('updateUserInfoMobile');
        log.info('bdmobile params:', params);
        let bindMobile = await bdmobile(params, true);
        log.info('bdmobile await:', bindMobile);
        const {
          code,
          msg
        } = bindMobile;
        if (code && code == 1) {
          userdata.mobile = mobile;
          // 绑定成功缓存到本地
          wx.setStorageSync('phone', mobile);
          // 关闭弹窗
          this.setData({
            bindPhonePopShow: false
          })
          // 触发父组件，绑定手机号成功
          this.triggerEvent('bindPhoneSuccess');
          return
        }
        this.setData({
          smsCode: ''
        })
        wx.showModal({
          title: '温馨提示',
          content: msg,
          showCancel: false
        })
        wx.hideLoading();
      } catch (error) {
        wx.hideLoading();
        console.log("error:", error);
      }
    },
  }
})