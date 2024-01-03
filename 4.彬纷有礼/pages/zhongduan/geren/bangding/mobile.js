// pages/zhongduan/geren/bangding/mobile.js
const APP = getApp();
const COS_URL = APP.globalData.COS_URL;
const utils = require('../../../../utils/util');
const http = require('../../../../utils/api');
const log = require('../../../../utils/log.js');
// 在页面中定义激励视频广告
let videoAd = null;
let _request = false;
var mobileReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
var spaceReg = /\s/g;
var timer = ''; //验证码定时器
import {
  sendsms,
  bdmobile
} from '../../../../api/config';
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: 1, // 默认1 更换手机号按钮  2 修改手机号   3修改成功   不同值，修改页面标题
    userdata: '',
    showClearBtn: false,
    phone: '',
    countdown: 60,
    newPhone: '',
    cpPop: false, //更换手机号弹窗
    cpPopUrl: COS_URL + '/public/img/Tian/202101/cpPop.png',
    cpPopBtl: COS_URL + '/images/Pops/cpPopBtl.png',
    cpPopBtr: COS_URL + '/images/Pops/cpPopBtr.png',
    storeRankingPop: false, //兑奖活动正在进行中，已报名用户不可以转店、入驻其他店铺、更换手机号
    storeRankingImg: COS_URL + "/public/img/storeRank/202108/pop/bg.png", //店铺信息确认背景
    iKnowImg: COS_URL + "/public/img/storeRank/20210121/iKnow0128.png", //店铺信息确认背景
    sendMsgTimes: 0, //2021年5月27日 发送短信的次数，>=2,第三次时就直接调用微信的手机号来绑定,默认0
    icon_changePhone: COS_URL + '/public/img/bfyl/assets/store/my/changePhone.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd && !videoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-2198279e8e2385d0', // 正式版广告id
        multiton: true, // 多例模式
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {
        wx.hideLoading({
          complete: (res) => {},
        })
        console.log("广告错误返回：", err);
        if (err.errCode == '1002' || err.errCode == '1004' || err.errCode == '1005' || err.errCode == '1006' || err.errCode == '1007' || err.errCode == '1008') {
          wx.showModal({
            title: '温馨提示',
            content: '广告展示异常已为您跳过',
            showCancel: false,
            success(res) {
              that.setData({
                step: 2,
                cpPop: false
              });
            }
          })

        } else {
          wx.showModal({
            title: '温馨提示',
            content: '广告展示异常已为您跳过',
            showCancel: false,
            success(res) {
              that.setData({
                step: 2,
                cpPop: false
              });
            }
          })
          //其它错误情况记录实时日志
          log.setFilterMsg('Ad error');
          log.info(err.errCode, ":", err.errMsg);
          that.setData({
            cpPop: false
          });
        }
      })
      videoAd.onClose((res) => {
        wx.hideLoading({
          complete: (res) => {},
        })
        that.setData({
          cpPop: false
        });
        if (res && res.isEnded) {
          this.setData({
            step: 2
          });
        }

      })
    }

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
    _request = false;
    var that = this;
    var userdata = wx.getStorageSync('userdata');
    if (userdata) {
      var reg = /^(\d{3})\d*(\d{4})$/;
      if(userdata.mobile){
        userdata.phoneStr = userdata.mobile.replace(reg,'$1****$2');
      }
      this.setData({
        userdata: userdata
      });
    } else {
      //本地无用户缓存信息  重新请求接口
      utils.getUserInfoNew().then(res => {
        that.setData({
          userdata: res
        });
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("页面隐藏········");
    _request = false;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    var prevPage = pages[pages.length - 2]; //获取上一个页面
    if (prevPage) {
      prevPage.setData({ //修改上一个页面的变量
        hided: true
      })
    }
    this.setData({
      sendMsgTimes: 0
    })
    _request = false;
    if (videoAd) {
      videoAd.destory();
      videoAd = null;
    }
    clearInterval(timer)
    timer = null
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
  //第二步
  stepTwo: function () {

    utils.getMyRankInfo().then(data => {
      if (data.forbid == 1) {
        // this.setData({
        //   storeRankingPop:true
        // });
        wx.showModal({
          title: '温馨提示',
          content: '您已报名参加\n“二十八星宿封神榜”活动\n暂不能更换手机号',
          showCancel: false
        })
        return
      }
      this.setData({
        cpPop: true
      });
    }).catch(err => {

      this.setData({
        cpPop: true
      });
    })

  },
  //input 输入框监听
  onInput(evt) {
    var newPhone = evt.detail.value.replace(spaceReg,'');
    this.setData({
      newPhone,
      showClearBtn: true,
    });
  },
  inputVcode: function (e) {
    const code = e.detail.value.replace(spaceReg,'');
    this.setData({
      code
    })
  },
  //清除input value 值
  onClear() {
    var that = this;
    wx.hideKeyboard({
      complete: res => {
        that.setData({
          newPhone: '',
          showClearBtn: false,
        });
      }
    })

  },
  //获取验证码
  async getVcode() {
    try {
      let { newPhone, resend, sendMsgTimes, userdata} = this.data;
      const { mobile } = userdata;
      console.log("新手机号：", newPhone);
      if (!newPhone) {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (newPhone == mobile) {
        wx.showToast({
          title: '请输入其它手机号',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (!mobileReg.test(newPhone)) { //验证手机号
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          duration: 2000
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
        sendMsgTimes++
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
  //倒计时
  settime: function () {
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
  //修改手机号
  changeMobile: function () {
    var phone = this.data.newPhone;
    var code = this.data.code;
    var that = this;
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    if (!code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '正在提交',
      mask: true
    })
    var params = {
      yzm: code,
      mobile: phone,
      type: 1, //type=1 修改手机号
    }
    //请求绑定手机接口
    bdmobile(params,true).then(res=>{
      const {code,msg} = res;
      if (+code === 1) {
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
        //修改成功缓存到本地，step 值 =3
        wx.setStorageSync('phone', phone);
        wx.removeStorageSync('userdata');
        that.setData({
          step: 3,
          phone: phone
        });
        wx.setNavigationBarTitle({
          title: '修改成功'
        })
        return
      }
      wx.showModal({
        title: '温馨提示',
        content: msg,
        showCancel:false
      })
    })
  },
  imgLoaded: function (e) {
    wx.hideLoading({
      complete: (res) => {},
    })
  },
  close: function () {
    this.setData({
      cpPop: false,
      storeRankingPop: false
    });
  },
  wtachAd: function () {
    wx.showLoading({
      title: '正在加载',
    })
    // 用户触发广告后，显示激励视频广告
    if (videoAd) {

      videoAd.show().then(() => {
        console.log("拉取成功返回···0000000");
        wx.hideLoading({
          complete: (res) => {},
        })
      }).catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show().then(() => {
            console.log("拉取成功返回···1111111");
            wx.hideLoading({
              complete: (res) => {},
            })
          }))
          .catch(err => {
            wx.hideLoading({
              complete: (res) => {},
            })

            console.log('激励视频 广告显示失败')
          })
      })

    }
  },
  //调用微信绑定的手机号
  async getPhoneNumber(e) {
    let that = this;
    console.log(e.detail)
    let {
      iv,
      encryptedData,
      code=''
    } = e.detail;
    try {
      if (code || (iv && encryptedData)) {
        let param = {
          encryptedData,
          iv,
          code,
          type: 1, //更换手机号
        };
        console.log("参数:", param);
        if (_request) return;
        _request = true;
        log.addFilterMsg("api_user_mnmobile");
        log.info("api_user_mnmobile 传参:", param);
        http.post('/api/user/mnmobile', param).then(res => {
          _request = false;
          let {
            code,
            msg
          } = res;
          if (+code == 1) {
            //修改成功缓存到本地，step 值 =3
            // wx.setStorageSync('phone', phone);
            wx.removeStorageSync('userdata');
            that.setData({
              step: 3,
              // phone: phone
            });
            wx.setNavigationBarTitle({
              title: '修改成功'
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: msg,
              showCancel: false
            })
          }
        }).catch(err => {
          _request = false;
          log.addFilterMsg("api_user_mnmobile");
          log.info("api_user_mnmobile catch:", err);
        })
      } else {
        log.addFilterMsg("getPhoneNumberFailed");
        log.info("未获取到手机号:", e.detail.errMsg || '');
      }

    } catch (err) {
      log.addFilterMsg("getPhoneNumberCatch");
      log.info("解析手机号catch:", err);
      _request = false;

    }
  }

})