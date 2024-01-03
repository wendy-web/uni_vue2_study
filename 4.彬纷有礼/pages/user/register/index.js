//index.js
//获取应用实例
const app = getApp();
const COS_URL = app.globalData.COS_URL;

var utils = require('../../../utils/util.js');
var http = require('../../../utils/api.js');
let pageHide = '';
let _request = false;
let checkA = false;
let checkB = false;
const log = require("../../../utils/log");
var mobileReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
var spaceReg = /\s/g;
var timer = ''; //验证码定时器
import {
  sendsms,
  bdmobile
} from '../../../api/config'
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime.js';
Page({
  data: {
    mobile: '',
    smsCode: '',
    countdown: 60,
    resend: false,
    route: '',
    checkItem: [{
        name: '1',
        value: '1'
      },

    ],
    sendMsgTimes: 0, //2021年5月27日 发送短信的次数，>=2,第三次时就直接调用微信的手机号来绑定
    icon_camer: COS_URL + '/public/img/bfyl/assets/login/icon_camer.png', //2022年11月15日新版
    icon_wechat: COS_URL + '/public/img/bfyl/assets/login/icon_wechat.png',
    defaultUrl: COS_URL + '/public/img/bfyl/assets/login/icon_edit_avatar.png', //默认提示用户修改头像
    defaultName: '', //默认名称
    userdata: null, //用户信息
    supportAvatarInput: utils.compareVersion(app.globalData.systemInfo.SDKVersion, '2.27.0') >= 0,
    newUrl: '',
    icon_edit: COS_URL + '/public/img/bfyl/assets/login/icon_edit.png',
    supportNickNameReview: utils.compareVersion(app.globalData.systemInfo.SDKVersion, '2.29.1') >= 0, //input用户昵称是否支持审核
    supportGetPhoneCode: utils.compareVersion(app.globalData.systemInfo.SDKVersion, '2.21.2') >= 0, // getPhoneNumber 是否支持返回code 参数
    privacyConfirmShow: false, //隐私确认二次弹窗
    nameAvatarDialogShow: false, //昵称或头像未填写弹窗
    autoLogin: false, //用户点击弹窗的去授权时候，头像昵称补全以后自动登录
  },

  async onLoad(options) {
    console.log(options)
    try {
      if (options.route) {
        this.setData({
          route: decodeURIComponent(options.route)
        })
      }
      let {
        defaultName,
        newUrl
      } = this.data;
      let userdata = wx.getStorageSync('userdata') || await utils.getUserInfoNew();
      defaultName = userdata?.nick_name || '';
      // if (defaultName == "微信用户") {
      //   defaultName = '';
      //   userdata.nick_name = ''
      // }
      newUrl = userdata.avatar_url || '';
      this.setData({
        userdata,
        defaultName,
        newUrl
      });

    } catch (error) {
      console.log("onload catch:", error)
    }
  },
  onShow: function () {
    _request = false;
    pageHide = false;
    // 登录失效回调
    app.tokenReadyCallback = (res) => {
      this.getUserInfo()
    }
  },
  inputMobile: function (event) {
    console.log('输入手机号：', event.detail)
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

  checkboxChange: function (e) {
    var checked = e.detail.value;
    if (checked[0] == 1) {
      this.setData({
        yinsiChecked: true
      });
    } else {
      this.setData({
        yinsiChecked: false
      });
      checkA = false;
      checkB = false;
    }
  },
  cancel: function () {
    wx.switchTab({
      url: '/pages/tabBar/shouye/index',
    })
  },
  onUnload: function () {
    pageHide = true;
    _request = false;
    clearInterval(timer);
    timer = null;
    this.setData({
      sendMsgTimes: 0,
      autoLogin: false
    })
  },
  contactService: function () {
    let url = "/pages/zhongduan/geren/guanyu/index";
    wx.navigateTo({
      url: url,
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
      // 判断是否支持用户昵称审核
      if (this.data.supportNickNameReview) {
        await this.delay(1000);
      } else {
        let textcheck = await this.textcheck(this.data.defaultName);
        if (!textcheck) {
          return
        };
      }
      // 低版本基础库（<=2.20.2）没有code
      if (code || (iv && encryptedData)) {
        let updatedInfo = await this.beforeUpdatePhone();
        console.log("beforeUpdatePhone:", updatedInfo)
        if (!updatedInfo) return;
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
        http.postBase({
          url: '/api/user/mnmobile',
          params
        }).then(res => {
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
            return that.goscan()
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
  async yinsiCheck() {
    try {
      let {
        yinsiChecked,
        defaultName,
        newUrl
      } = this.data;
      // if (!newUrl) {
      //   return wx.showModal({
      //     title: '温馨提示',
      //     content: '请选择头像',
      //     showCancel: false
      //   })
      // }
      // if (!defaultName) {
      //   return wx.showModal({
      //     title: '温馨提示',
      //     content: '请输入昵称',
      //     showCancel: false
      //   })
      // }

      // if (defaultName.length > 15) {
      //   return wx.showModal({
      //     title: '温馨提示',
      //     content: '昵称不可超过15个字符',
      //     showCancel: false
      //   })
      // }

      if (!yinsiChecked) {
        this.setData({
          privacyConfirmShow: true
        })
        return
      }

    } catch (error) {
      console.log("yinsiCheck catch:", error)
    }
  },
  checkDeal: function (e) {
    let id = e.currentTarget.dataset.id;
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
  inputName(event) {
    let {
      value
    } = event.detail;
    let userdata = "userdata.nick_name";
    value = value.replace(/(^\s*)|(\s*$)/g, "");
    this.setData({
      [userdata]: value,
      defaultName: value
    })
    let {
      defaultName,
      newUrl,
      autoLogin
    } = this.data;
    // 头像昵称都有&&需要自动登录：点击弹窗去授权的操作
    if (defaultName && newUrl && autoLogin) {
      this.submitInfo();
    }
  },

  inputConfirm(event) {
    let {
      value
    } = event.detail;
    if (value) {
      this.setData({
        defaultName: value
      })
    }

  },
  /**拍照上传 */
  async shot(event) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let chooseImage = wx.chooseMedia || wx.chooseImage
    try {
      /**图片获取 */
      // let [tempFile] = (await chooseImage({count:1,sizeType:'compressed',mediaType:['image'],sourceType:['camera'],camera:'back'})).tempFiles
      let [tempFile] = (await chooseImage({
        count: 1,
        sizeType: 'compressed',
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        camera: 'back'
      })).tempFiles
      let imgPath = tempFile.tempFilePath
      //是否压缩
      if (tempFile.size / 1024 > 1000) {
        let {
          tempFilePath
        } = await wx.compressImage({
          src: imgPath,
          quality: 50
        })
        imgPath = tempFilePath
      }
      // 裁剪
      // imgPath = await this.cropAvatar(imgPath)
      await this.onChooseAvatar({
        detail: {
          avatarUrl: imgPath
        }
      })
    } catch (error) {
      //  wx.showModal({
      //    title:'温馨提示',
      //    content:JSON.stringify(error)
      //  })
      console.log(error)
      wx.hideLoading()
    } finally {
      wx.hideLoading()

    }
  },
  async onChooseAvatar({
    detail
  }) {
    console.log("detail:", detail);
    let url = detail.avatarUrl
    // console.log("未裁剪的url:",url);
    // // 裁剪
    // url = await this.cropAvatar(url)
    // console.log("裁剪后的url:",url);
    // 压缩
    try {
      url = await this.compressImage(url)
    } catch (error) {
      console.error('头像压缩失败：', error)
    }
    try {
      //上传接口调用
      let avatarUrl = await utils.uploadImgAI(url);
      let userdata = "userdata.avatar_url";
      this.setData({
        [userdata]: avatarUrl,
        newUrl: avatarUrl,
        defaultUrl: avatarUrl,
      })
      let {
        defaultName,
        autoLogin
      } = this.data;
      if (defaultName) {
        // 头像昵称都有了，判断是否需要自动登录
        if (autoLogin) {
          this.submitInfo();
        }
      } else {
        this.setData({
          focus: true
        })
      }

    } catch (error) {
      console.log("上传失败catch:", error);
      wx.showModal({
        content: `${error.msg || "上传失败，请稍后再试"}`,
        showCancel: false
      })
    }
  },
  cropAvatar(url) {
    return new Promise((resolve, reject) => {
      try {
        if (wx.cropImage) {
          return wx.cropImage({
            src: url,
            cropScale: '1:1',
            success({
              tempFilePath
            }) {
              if (!tempFilePath) return reject(Error("处理失败，未能获取到图片路径"))
              resolve(tempFilePath)
            },
            fail(err) {
              // reject(Error(err))
              reject(err)
            }
          })
        }
        if (wx.editImage) {
          return wx.editImage({
            src: url,
            success({
              tempFilePath
            }) {
              if (!tempFilePath) return reject(Error("处理失败，未能获取到图片路径"))
              resolve(tempFilePath)
            },
            fail(err) {
              console.log(err);
              // reject(Error(err))
              reject(err)
            }
          })
        }
        resolve(url)
      } catch (error) {
        reject(error)
      }

    })
  },
  compressImage(url) {
    console.log("compressImage url:", url);
    return new Promise(async (resolve, reject) => {
      // 指定压缩为768px * 768px
      const COMPRESS_SIZE = 768
      try {
        const {
          width,
          height
        } = await wx.getImageInfo({
          src: url
        })
        const size = Math.ceil(Math.sqrt(width * height));
        if (size <= COMPRESS_SIZE) throw Error(`当前图片尺寸为 ${width} * ${height} (${size}) ， 已符合压缩规则，忽略压缩`)
        const quality = Math.ceil(COMPRESS_SIZE * 100 / size);
        console.log("quality:", quality);
        if (!wx.compressImage) throw Error("当前基础库版本太低，请升级微信客户端")
        wx.showLoading({
          title: '压缩中',
        })
        wx.compressImage({
          src: url,
          quality: quality,
          // 以下高版本支持，低版本仍考虑 quality
          compressedWidth: COMPRESS_SIZE,
          compressHeight: COMPRESS_SIZE,
          success({
            tempFilePath
          }) {
            if (!tempFilePath) return reject(Error('处理失败，未获取到路径'))
            // 检查后缀是否存在, 应对模拟器返回错误的tempFilePath问题
            if (!/^.*\.(.+)$/.test(tempFilePath)) return reject(Error('SDK错误，压缩路径不正确'))
            resolve(tempFilePath)
          },
          fail(error) {
            reject(Error(error.errmsg || error.errMsg))
          },
          complete() {
            wx.hideLoading({})
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  },
  //更新用户资料/api/user/userprofile
  updateUserPorfile(params) {
    return new Promise((resolve, reject) => {
      http.postBase({
        url: '/api/user/userprofile',
        params,
        mask: false
      }).then(res => {
        resolve(res)
        wx.removeStorageSync('userdata')
      }).catch(err => {
        reject(err)
      })
    })
  },
  //获取用户手机前··· 
  beforeUpdatePhone() {
    let that = this;
    return new Promise((resolve, reject) => {
      let {
        defaultName,
        userdata,
        newUrl
      } = this.data;
      if (!defaultName) {
        resolve(false)
        wx.showModal({
          title: '温馨提示',
          content: '请输入昵称',
          showCancel: false
        })
        return
      }
      let avatarUrl = newUrl;
      let params = {
        avatarUrl,
        nickName: defaultName
      }
      log.addFilterMsg('api_user_userprofile');
      log.info("/api/user/userprofile传参：", params);
      this.updateUserPorfile(params).then(res => {
        log.info("updateUserPorfile then:", res);
        let {
          code,
          msg
        } = res;
        console.log("updateUserPorfile then:", res);

        if (+code == 1) {
          wx.setStorageSync('islogin', 1);
          userdata.nick_name = defaultName;
          this.setData({
            userdata,
          })
          resolve(true);

          return
        }
        resolve(false);
        wx.showModal({
          title: '头像名称更新失败',
          content: msg,
          showCancel: false
        })
      }).catch(err => {
        console.log("updateUserPorfile catch:", err);
        log.info("updateUserPorfile catch:", err);

        reject(err)
      })

    });
  },
  // 检测敏感词 /api/tools/textcheck
  textcheck(word) {
    return new Promise((resolve, reject) => {
      http.postBase({
        url: '/api/tools/textcheck',
        params: {
          text: word
        },
        mask: false
      }).then(res => {
        let {
          code,
          msg
        } = res;
        if (code == 1) {
          resolve(true)
          return
        }
        wx.showModal({
          title: '温馨提示',
          content: `名称包含敏感词，请修改后重试。`,
          showCancel: false
        })
        let userdata = "userdata.nick_name";
        this.setData({
          defaultName: '',
          [userdata]: '',
        })
        resolve(false)

      }).catch(err => {
        reject(err)
      })
    });
  },
  //有手机用户仅更新用户资料
  async updateUserInfo(e) {
    let {
      nickname
    } = e.detail.value;
    nickname = nickname.replace(/(^\s*)|(\s*$)/g, "");
    this.setData({
      defaultName: nickname
    })
    wx.showLoading({
      title: '加载中···',
      mask: true
    })
    if (this.data.supportNickNameReview) {
      await this.delay(1000);
    } else {
      let textcheck = await this.textcheck(nickname);
      if (!textcheck) {
        wx.hideLoading();
        return
      };
    }
    let {
      defaultName
    } = this.data;
    console.log("提交表单：", defaultName, nickname);
    if (!defaultName) {
      wx.hideLoading();
      return
    }

    try {
      // 前端取消过滤，后端拦截
      // let textcheck = await this.textcheck(this.data.defaultName);
      // console.log("textcheck:",textcheck)
      // if(!textcheck)return;
      let updatedInfo = await this.beforeUpdatePhone();
      if (updatedInfo) {
        wx.hideLoading();
        // 如果页面有传route参数跳转
        this.goscan()
        return
      }
      wx.hideLoading();
    } catch (error) {
      console.log("error:", error);
    }

  },
  //获取用户信息
  getUserInfo() {
    let {
      defaultName,
      newUrl
    } = this.data;
    utils.getUserInfoNew().then(res => {
      defaultName = res.nick_name ? res.nick_name : defaultName;
      // if (defaultName == "微信用户") {
      //   defaultName = '';
      //   res.nick_name = ''
      // }
      newUrl = res.avatar_url ? res.avatar_url : newUrl
      this.setData({
        userdata: res,
        defaultName,
        newUrl
      });
    })
  },
  goscan() {
    let {
      route
    } = this.data;
    if (route) {
      wx.reLaunch({
        url: route,
      })
    } else {
      wx.reLaunch({
        // url: '/pages/tabBar/shouye/index',//首页
        url: '/pages/tabBar/geren/index', // 我的页面
      })
    }


  },
  // 用户昵称审核（微信api）
  nicknamereview(event) {
    console.log(event.detail);
    let {
      pass,
      timeout
    } = event.detail;
    return new Promise((resolve) => {
      //通过且未超时
      if (pass == true && timeout == false) {
        resolve(true)
        return
      }
      this.setData({
        defaultName: ""
      })
      resolve(false)
    })
  },
  // 延迟执行
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
  // 绑定手机号（短信验证码版本）
  async bindPhoneSMS() {
    log.addFilterMsg('bindPhoneSMS')
    try {
      let {
        yinsiChecked,
        defaultName,
        newUrl,
        mobile,
        smsCode,
        userdata
      } = this.data;
      if (!newUrl) {
        return wx.showModal({
          title: '温馨提示',
          content: '请选择头像',
          showCancel: false
        })
      }
      if (!defaultName) {
        return wx.showModal({
          title: '温馨提示',
          content: '请输入昵称',
          showCancel: false
        })
      }

      if (defaultName.length > 15) {
        return wx.showModal({
          title: '温馨提示',
          content: '昵称不可超过15个字符',
          showCancel: false
        })
      }
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
      if (!yinsiChecked) {
        wx.showToast({
          title: '请阅读相关协议',
          icon: 'none'
        })
        return
      }
      //更新用户信息+手机号
      this.updateUserInfoMobile()


    } catch (error) {
      console.log("bindPhoneSMS catch:", error)
      log.error('bindPhoneSMS:', error)
    }
  },
  // 绑定手机号
  async updateUserInfoMobile() {
    let {
      defaultName,
      mobile,
      smsCode,
      userdata,
      supportNickNameReview
    } = this.data;

    wx.showLoading({
      title: '加载中···',
      mask: true
    })
    if (supportNickNameReview) {
      await this.delay(1000);
    } else {
      let textcheck = await this.textcheck(defaultName);
      if (!textcheck) {
        wx.hideLoading();
        return
      };
    }

    try {
      // 先更新用户信息
      let updatedInfo = await this.beforeUpdatePhone();
      if (updatedInfo) {
        wx.hideLoading();
        // 更新手机号
        const params = {
          yzm: smsCode,
          mobile,
          type: 0 // 0绑定，1更改
        }
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
          // 如果页面有传route参数跳转
          this.goscan()
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
      }
      wx.hideLoading();
    } catch (error) {
      console.log("error:", error);
    }
  },
  handleTouchInput() {
    if (wx.requirePrivacyAuthorize) {
      wx.requirePrivacyAuthorize({
        success: res => {
          console.log('用户同意了隐私协议 或 无需用户同意隐私协议')
          // 用户同意隐私协议后给昵称input聚焦
          this.setData({
            focus: true
          })
        },
        fail: res => {
          console.log('用户拒绝了隐私协议')
        }
      })
    } else {
      this.setData({
        focus: true
      })
    }
  },
  // 2023年10月17日 头像昵称不强制获取
  async submitInfo(e) {

    let {
      defaultName,
      newUrl,
      yinsiChecked
    } = this.data;
    // 未同意隐私授权
    if (!yinsiChecked) {
      this.setData({
        privacyConfirmShow: true
      })
      return
    }
    console.log("提交表单：", defaultName);
    if (!defaultName || !newUrl) {
      wx.hideLoading();
      this.setData({
        nameAvatarDialogShow: true
      })
      return
    }
    wx.showLoading({
      title: '加载中···',
      mask: true
    })
    if (this.data.supportNickNameReview) {
      await this.delay(1000);
    } else {
      let textcheck = await this.textcheck(defaultName);
      if (!textcheck) {
        wx.hideLoading();
        return
      };
    }
    try {
      let updatedInfo = await this.beforeUpdatePhone();
      if (updatedInfo) {
        wx.setStorageSync('isLoggedIn', 1);
        wx.hideLoading();
        // 如果页面有传route参数跳转
        this.goscan()
        return
      }
      wx.hideLoading();
    } catch (error) {
      console.log("error:", error);
    }

  },
  // 用户未修改头像昵称
  updateDefaultUserInfo() {
    let {
      defaultName = '', newUrl = ''
    } = this.data;
    return new Promise((resolve, reject) => {
      let params = {
        avatarUrl: newUrl,
        nickName: defaultName
      }
      log.addFilterMsg('updateDefaultUserInfo');
      log.info("/api/user/userprofile传参：", params);
      this.updateUserPorfile(params).then(res => {
        log.info("updateDefaultUserInfo then:", res);
        let {
          code,
          msg
        } = res;
        console.log("updateUserPorfile then:", res);

        if (+code == 1) {
          wx.setStorageSync('islogin', 1);
          resolve(true);
          return
        }
        resolve(false);
        wx.showModal({
          title: '头像名称更新失败',
          content: msg,
          showCancel: false
        })
      }).catch(err => {
        console.log("updateUserPorfile catch:", err);
        log.info("updateDefaultUserInfo catch:", err);
        reject(err)
      })

    });
  },
  // 弹窗勾选隐私
  confirmPrivacy() {
    this.setData({
      yinsiChecked: true,
      privacyConfirmShow: false
    })
    this.submitInfo();
  },
  // 关闭弹窗
  onClosePop(event) {
    let {
      popname
    } = event.currentTarget.dataset;
    this.setData({
      [popname]: false,
    })
  },
  // 同意使用系统的随机头像昵称
  async nameAvatarConfirm(event) {
    let {
      popname
    } = event.currentTarget.dataset;
    try {
      let updatedInfo = await this.updateDefaultUserInfo();
      if (updatedInfo) {
        this.setData({
          [popname]: false,
        })
        wx.hideLoading();
        // 如果页面有传route参数跳转
        wx.setStorageSync('isLoggedIn', 1);
        this.goscan()
        return
      }
      wx.hideLoading();
    } catch (error) {
      console.log("nameAvatarConfirm error:", error);
    } finally {
      this.setData({
        [popname]: false,
      })
    }

  },
  // 昵称获取焦点
  focusInputName(event) {
    let {
      popname
    } = event.currentTarget.dataset;
    this.setData({
      [popname]: false,
      focus: true,
      autoLogin: true
    })
  },
  // 去授权，添加标识符（头像昵称补全以后自动登录）
  goAuthorize(event) {
    let {
      popname
    } = event.currentTarget.dataset;
    this.setData({
      [popname]: false,
      autoLogin: true
    })
  }
})