// pages/zhongduan/geren/setting/join.js
const utils = require('../../../../utils/util');
const http = require('../../../../utils/api');
const log = require('../../../../utils/log');
const app = getApp();
let phaseIII_count = '';
// 在页面中定义激励视频广告
let videoAd = null;
let hnTypeArr = app.globalData.hnTypeArr; //红牛箱内码红包类型
let zmTypeArr = app.globalData.zmTypeArr; //战马箱内码红包类型
import {
  xdyhMini
} from '../../../../api/openMiniProgram';
import {
  getConfig
} from '../../../../api/config';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopPop: false,
    // shopPop: true,
    shopInfo: '',
    userdata: '',
    rzPop: false,
    rzPopUrl: app.globalData.COS_URL + '/public/img/Tian/202101/rzPop.png',
    rzBg: app.globalData.COS_URL + '/public/img/Tian/202101/rzPop0.png',
    rzPopBtl: app.globalData.COS_URL + '/images/Pops/rzPopBtl.png',
    rzPopBtr: app.globalData.COS_URL + '/images/Pops/rzPopBtr.png',
    sid: '',
    token: '',
    storeRankingImg: app.globalData.COS_URL + "/public/img/storeRank/202108/pop/bg.png", //店铺信息确认背景
    iKnowImg: app.globalData.COS_URL + "/public/img/storeRank/20210121/iKnow0128.png", //店铺信息确认背景
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    var that = this;
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd && !videoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-6fdf322491beabe3',
        multiton: true
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {
        if (!this.data.rzPop) return;
        this.setData({
          rzPop: false

        });
        if (err.errCode == '1002' || err.errCode == '1004' || err.errCode == '1005' || err.errCode == '1006' || err.errCode == '1007' || err.errCode == '1008') {
          wx.hideLoading({
            complete: (res) => {},
          })
          wx.showModal({
            title: '温馨提示',
            content: '广告展示异常已为您跳过',
            showCancel: false,
            success(res) {
              that.scan();
            }
          })
        } else {
          wx.hideLoading({
            complete: (res) => {},
          })
          console.log("广告加载失败：", err);
          //其它错误情况记录实时日志
          log.setFilterMsg('Ad error');
          log.info(err.errCode, ":", err.errMsg);
        }
      })
      videoAd.onClose((res) => {
        this.setData({
          rzPop: false

        });
        if (res && res.isEnded) {
          // this.postData();
          this.scan();
        }

      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getcountcard();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideLoading();
    var that = this;


    //获取我的店铺缓存
    let myShopInfo = wx.getStorageSync('storeInfo');


    //获取用户信息
    var userdata = wx.getStorageSync('userdata')
    if (userdata) {
      this.setData({
        userdata: userdata,
        myShopInfo: myShopInfo
      });
    } else {

      utils.getUserInfoNew().then(res => {
        that.setData({
          userdata: res,
          myShopInfo: myShopInfo
        });
      })
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
    if (videoAd) {
      videoAd.destory();
      videoAd = null;
    }
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
  getcountcard: function () {
    utils.getcountcard().then(res => {
      if (res.code == 1) {
        phaseIII_count = res.data;
        wx.setStorageSync('phaseIII_count', phaseIII_count);
      }
    });
  },
  async beforeJoin() {

    try {
      // 判断是否禁止转让店铺：终极优化糅合版
      const inAct = this.selectComponent('#forbiddenTransShop').isForbiddenTransShop({
        tips: '暂不可加入其它门店'
      });
      if (inAct) return;
      this.setData({
        rzPop: true
      });

    } catch (error) {
      console.log("beforeJoin error:", error)
    }
  },
  join: function () {
    let that = this;
    this.setData({
      shopPop: false
    })
    let shopInfo = this.data.shopInfo;
    let msg = '您确定加入【' + shopInfo.shop_name + '】?';
    wx.showModal({
      title: '温馨提示',
      content: '入驻后，您店铺绑定的纸质码将失效，\n' + msg,
      cancelText: "不了",
      confirmText: "确定",
      success: function (res) {
        if (res.confirm) {
          that.postData();
          return
        }
      }
    })

  },
  goback: function () {
    wx.navigateBack().catch(res => {
      console.log("navigateBack res:", res)
      wx.switchTab({
        url: '/pages/tabBar/shouye/index',
      })
    });
  },
  scan: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        that.setData({
          sid: ''
        });
        wx.showLoading({
          title: '正在请求数据',
        })
        var code = res.result;
        console.log('扫描结果：', code);
        let getUrlObj = utils.getUrlObj(code);
        console.log('getUrlObj:', getUrlObj);
        if (getUrlObj.HY && getUrlObj.token) {
          that.setData({
            sid: getUrlObj.HY,
            token: getUrlObj.token
          });
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '温馨提示',
            content: '请扫【面对面添加】二维码',
            showCancel: false
          })
          return
        }
        if (!that.data.sid && !that.data.token) {
          wx.hideLoading();
          wx.showModal({
            title: '温馨提示',
            content: '请扫【面对面添加】二维码',
            showCancel: false
          })
          return
        } else {
          utils.getShopInfoMini(that.data.sid).then(data => {
            wx.hideLoading();
            that.setData({
              shopInfo: data,
              shopPop: true
            });
          }).catch(err => {
            wx.hideLoading();
            wx.showToast({
              title: err.msg,
              icon: 'none',
              duration: 4000
            })
          })
        }

      },
      fail: (res) => {
        console.log('扫码失败：', res);

      },
      complete: (res) => {
        console.log("调用扫一扫完成：", res);

      }
    })
  },
  postData: function () {
    if (!phaseIII_count) {
      phaseIII_count = wx.getStorageSync('phaseIII_count');
    }
    if (phaseIII_count.order_0 > 0 || phaseIII_count.order_1 > 0) {
      wx.showModal({
        title: '温馨提示',
        content: '您有未完成返货订单，无法入驻他人门店',
        showCancel: false
      })
      return
    }
    var that = this;
    var sid = this.data.sid;
    var token = this.data.token;
    var params = {
      sid: sid,
      token: token
    }
    this.setData({
      shopPop: false
    });
    wx.showLoading({
      title: '请求数据中',
    })
    http.postBase({
      url: '/api/shop/join',
      params: params
    }).then(res => {
      wx.hideLoading();
      console.log("加入门店返回res：", res);
      const {
        code,
        msg,
        data
      } = res;
      switch (code) {
        //加入失败
        case '0':
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 2000,
          })
          break;
          //加入成功
        case '1':
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 4000,
          })
          //判断用户是否绑定手机号
          var storage = wx.getStorageInfoSync();
          console.log("本地缓存的数据信息：", storage);
          var userdata = wx.getStorageSync('userdata');
          //加入成功以后用户信息变更，清除 userdata
          wx.removeStorageSync('userdata');
          if (userdata.mobile) {
            utils.getUserInfoNew().then(res => {
              wx.reLaunch({
                url: '/pages/tabBar/dianyuan/add',
              })
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: '您还没注册手机号，请您完善信息',
              success: function (res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/pages/user/register/index',
                  })
                } else {
                  wx.reLaunch({
                    url: '/pages/tabBar/shouye/index',
                  })
                }
              }
            })
          }
          break;
          //还有余额未提现,弹出选择框用户选择是否跳转至提现页
        case '2':
          wx.showModal({
            title: '温馨提示',
            content: msg,
            success: function (res) {
              if (res.confirm) {
                //跳转至提现页
                wx.navigateTo({
                  url: '/pages/zhongduan/geren/yuer/tixian/index',
                })
              }
            }
          })
          break;
        case '3':
          //还有红包未拆,跳转至拆红包页面 hbdata:拆红包页面参数
          wx.showModal({
            title: '温馨提示',
            content: msg,
            success: function (result) {
              if (result.confirm) {
                var hongbao = res.data;
                //根据type:1 旧活动，2 二期红包
                var data = hongbao.qr;
                var param = encodeURIComponent(data);
                //判断data里的type值：1，一期红包，2，二期红包
                if (hongbao.type == 1) {
                  wx.navigateTo({
                    url: '/pages/zongduan/saoma/hongbao/index?hbdata=' + param,
                  })
                  return
                }
                if (hnTypeArr.includes(+hongbao.type)) {
                  wx.redirectTo({
                    url: '/pages/randomdraw/index/index?hbdata=' + param + '&hbtype=' + hongbao.type,
                  })
                  return
                }

                if (zmTypeArr.includes(+hongbao.type)) {
                  wx.redirectTo({
                    url: '/pages/warhorse/index/index?hbdata=' + param + '&hbtype=' + hongbao.type,
                  })
                  return
                }


              }
            }
          })
          break;
        default:
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 4000
          })
      }
    });
  },
  closePop: function () {
    this.setData({
      shopPop: false
    });
  },
  close: function () {
    this.setData({
      rzPop: false,
      shopPop: false,
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
  imgLoaded: function () {
    wx.hideLoading({
      complete: (res) => {},
    })
  },
  // 2023年4月15日 积分跳转至小店优惠
  async xdyhMini() {
  
    /// 获取引流配置
    try {
      let config = utils.getCache('xdyzConfig230810');
      if (config) {
        config = JSON.parse(config)
        this.setData({
          config
        })
      } else {
        let res = await getConfig();
        let {
          code,
          data
        } = res;
        if (code == 1 && data.ad1) {
          utils.setCache('xdyzConfig230810',JSON.stringify(data),1800)
          this.setData({
            config: data
          })
          config = data
        } else {
          this.setData({
            config: null
          })
        }

      }
      xdyhMini({path:config.ad1.url,halfScreen:config.boxCode});
    } catch (error) {
      console.log("初始化配置error：", error);
    }

  }
})