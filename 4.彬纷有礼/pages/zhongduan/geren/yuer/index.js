const utils = require("../../../../utils/util");
const auth = require('../../../../utils/auth');
const app = getApp();
// 在页面中定义插屏广告
let interstitialAd = null;
let parameter = {};
const COS = app.globalData.COS_URL;
let switchAd = true;
const log = require('../../../../utils/log');
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime.js';
import {
  getuserShop,
  getbalancelog
} from '../../../../api/exchange/index';
Page({
  data: {
    tabbar_bg: COS + '/public/img/phaseIII/202104/reward-head.png',
    rewardBodyImg: COS + '/public/img/phaseIII/202104/reward-body.png',
    txbtnImg: COS + '/public/img/phaseIII/202104/tx-btn.png',
    countbgImg: COS + '/public/img/phaseIII/202104/reward-count-bar.png',
    balanceInfo: [], //余额列表信息
    loadmore: false, //加载更多
    blockAd: false,
    title: '收益累计',
    userShopInfo: null, //店长信息
    // 2023年10月17日 加载刷新组件
    background: '#2e2e2e',
    isBackBtn: false, // 设置是否显示回到顶部按钮
    isEmpty: false, // 设置是否为空数据
    defaultSetting: {
      shake: true,
      style: 'black', // 设置圆点申诉还是浅色
      background: {
        color: '#ffffff',
      },
    },
    loadMoreSetting: {
      status: "noMore",
      more: {
        text: '上拉加载更多',
        color: '#999',
      },
      loading: {
        text: '加载中...',
        color: '#999',
      },
      noMore: {
        text: '~ 没有更多记录了~',
        color: '#999',
      },
      color: "#999",
    },
    emptySetting: {
      img: 'https://file.y1b.cn/public/img/bfyl/202208/img_empty.png',
      text: ''
    },
  },
  onLoad: function (options) {
    let that = this;
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-9a6d414f34192fe0', //线上版广告id
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {
        console.error("插屏广告onError:", err);
      })
      interstitialAd.onClose((res) => {
        that.setData({
          adShow: false
        })
        switchAd = false;
      })
    }



  },
  onReady: function () {
    utils.getNavbarData().then(res => {
      if (res) {
        this.setData({
          navBarSystem: res,
        })
      }
    });
    this.setData({
      blockAd: utils.blockAd()
    })
  },
  async onShow() {
    //获取用户信息
    try {
      let userInfo = wx.getStorageSync('userdata') || await utils.getUserInfoNew();
      if (userInfo) {
        this.setData({
          userInfo
        })
        this.initData();
      }
      if (interstitialAd && switchAd) {
        interstitialAd.onLoad(() => {
          if (switchAd && this.data.blockAd) {
            // 在适合的场景显示插屏广告
            interstitialAd.show().catch((err) => {
              console.error("插屏广告显示失败:", err)
            })
            switchAd = false;
            return
          }
        })
      }
      let cosAddress = auth.getCosAddress();
      if (cosAddress) {
        let redbull = cosAddress.A9.value;
        let popImg = [];
        popImg[0] = redbull[Math.floor((Math.random() * redbull.length))];
        if (!switchAd) {
          this.setData({
            adShow: true,
            popImg
          });
          switchAd = true;
          return false;
        }
      }
    } catch (error) {
      console.log("onShow error:", error);
      app.tokenReadyCallback = (token) => {
        utils.getUserInfoNew().then(userInfo => {
          this.setData({
            userInfo
          })
          this.initData();
        });
      }
    }
  },
  onPullDownRefresh: function (e) {},
  onBeforeBack: function () {
    wx.navigateBack({
      delta: 0,
    })
  },

  //折叠菜单
  kindToggle: function (e) {
    var id = e.currentTarget.id;
    var idx = e.currentTarget.dataset.idx;
    var oldopen = this.data.oldopen;
    console.log("oldopen:", oldopen);
    console.log("id:", id);
    console.log("idx:", idx);
    if (oldopen != id) {
      oldopen = id
    } else {
      oldopen = null;
    }
    this.setData({
      oldopen: oldopen
    });

  },
  onHide: function () {
    wx.hideLoading({
      success: (res) => {},
    })
    this.setData({
      adShow: false
    })
  },

  close: function () {
    this.setData({
      rili: false,
    })
  },


  //提现
  withdraw: function () {
    log.addFilterMsg("withdraw");
    utils.getMID(1).then(res => {
      var templateId = res;
      // console.log('获取到的模板ID:', templateId);
      // console.log('数组长度:', templateId.length);
      log.addFilterMsg("getMID");
      log.info("res:", res);
      if (templateId) {
        //订阅消息授权
        wx.requestSubscribeMessage({
          //模板消息id，订阅类型：一次性
          tmplIds: templateId,
          success(res) {
            console.log("wx.requestSubscribeMessage:", res);
            log.info("wx.requestSubscribeMessage:", res);
            //需要循环templateId 判断每一个授权是否允许订阅消息通知
            if (res[templateId[0]] == 'reject') {
              wx.showModal({
                title: '提示',
                content: '请打开订阅消息授权',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      withSubscriptions: true,
                      complete: (res) => {
                        console.log("openSetting:res:", res);
                        if (res.subscriptionsSetting && res.subscriptionsSetting.itemSettings) {

                          if (res.subscriptionsSetting.itemSettings[templateId[0]] == 'reject' || res.subscriptionsSetting.itemSettings[templateId[1]] == 'reject') {
                            wx.showToast({
                              title: '请打开并允许订阅消息通知',
                              icon: 'none',
                              duration: 3000
                            })
                          } else {

                            //下一步
                            wx.navigateTo({
                              url: '/pages/zhongduan/geren/yuer/tixian/index',
                            })
                          }
                        } else {
                          wx.showModal({
                            title: '温馨提示',
                            content: '系统异常请稍后再试',
                            showCancel: false
                          })
                        }
                      },
                    })

                  }
                }
              })

            } else {
              //下一步
              wx.navigateTo({
                url: '/pages/zhongduan/geren/yuer/tixian/index',
              })
            }

          },
          fail(error) {
            console.log('调用失败：', error)
            let {
              errCode = ''
            } = error;
            if (+errCode != 20004) { //用户关闭了主开关，无法进行订阅
              // 记录除了用户关闭主开关以为的情况
              log.setFilterMsg("subscribeFail");
              log.info("fail error:",error);
              //下一步
              wx.navigateTo({
                url: '/pages/zhongduan/geren/yuer/tixian/index',
              })
              return
            };
            wx.showModal({
              title: '提示',
              content: '请打开订阅消息授权',
              success(res) {
                if (res.confirm) {
                  wx.openSetting({
                    withSubscriptions: true,
                    complete: (res) => {
                      if (res.subscriptionsSetting && res.subscriptionsSetting.itemSettings) {

                        if (res.subscriptionsSetting.itemSettings[templateId[0]] == 'reject') {
                          wx.showToast({
                            title: '请允许订阅消息授权',
                            icon: 'none',
                            duration: 3000
                          })
                        } else {
                          wx.navigateTo({
                            url: '/pages/zhongduan/geren/yuer/tixian/index',
                          })
                        }
                      } else {
                        wx.showModal({
                          title: '温馨提示',
                          content: '系统异常请稍后再试',
                          showCancel: false
                        })
                      }
                    },
                  })

                }
              }
            })
          }
        })

      } else {
        //下一步
        wx.navigateTo({
          url: '/pages/zhongduan/geren/yuer/tixian/index',
          fail: (err) => {
            log.addFilterMsg("navigateFail");
            log.error("err:", err);
          }
        })
      }
    }).catch(err => {
      log.error("getMID err:", err);
      wx.navigateTo({
        url: '/pages/zhongduan/geren/yuer/tixian/index',
        fail: (err) => {
          log.addFilterMsg("navigateFail");
          log.error("err:", err);
        }
      })
    })


  },

  //扫一扫
  openScan: function () {
    wx.redirectTo({
      url: '/pages/zongduan/saoma/index',
    })
  },
  //点击查看提现失败原因
  checkFailMsg: function (e) {
    var msg = e.currentTarget.dataset.err_code_des;
    wx.showModal({
      title: '提现失败',
      content: msg,
      showCancel: false
    })
    console.log('提现失败：', msg);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      balanceInfo: []
    });
    parameter = {};
    wx.hideLoading({
      success: (res) => {},
    })
  },
  checkMore: function () {
    wx.navigateTo({
      url: '/pages/zhongduan/geren/yuer/yuerdetail',
    })
  },
  //初始化数据
  initData() {
    let {
      userInfo
    } = this.data;
    wx.setStorageSync('localBalance', userInfo.c_balance)
    //列表为空是重新请求数据
    if (this.data.balanceInfo.length == 0) {
      parameter.next = 1;
    }
    this.resetRefresh()

  },
  // 下拉刷新
  async resetRefresh(event) {
    this.selectComponent('#scroller').backToTop();
    try {

      parameter.next = 1;
      let {
        loadMoreSetting,
      } = this.data;

      // 刷新可用余额
      let userShopRes = await getuserShop();
      this.setData({
        userShopInfo: userShopRes.data || '',
      })
      wx.setStorageSync('localBalance', userShopRes.data.c_balance)

      console.log("刷新参数:", parameter)
      let res = await getbalancelog(parameter, true);
      let {
        code,
        data
      } = res;
      let {
        next,
        list,
        limit
      } = data;

      if (code == 1) {
        parameter.next = next || 1;
        loadMoreSetting.status = list.length < limit ? 'noMore' : 'more';
        this.setData({
          balanceInfo: list,
          loadMoreSetting,
          isEmpty: false,
        })
        return
      }
      if (code == 0) {
        this.setData({
          isEmpty: true,
          balanceInfo: [],
        })
      }
    } catch (error) {
      console.log("余额明细列表 resetRefresh catch：", error);
    }
  },
  // 上拉加载更多
  async loadmore(event) {
    let {
      loadMoreSetting,
      balanceInfo
    } = this.data;
    try {
      // 判断当前是否为加载状态 防止页面重复添加数据
      if (loadMoreSetting.status !== 'loading') {
        loadMoreSetting.status = 'loading'
        this.setData({
          loadMoreSetting,
        })
        let res = await getbalancelog(parameter);
        let {
          code,
          data
        } = res;
        let {
          limit = 10,
            next,
            list = [],
        } = data;
        let nomore = list?.length < limit ? true : false;
        if (code == 1) {
          parameter.next = next;
          loadMoreSetting.status = 'more';
          this.setData({
            balanceInfo: balanceInfo.concat(list),
            loadMoreSetting
          })
        }
        if (code == 0 || nomore) {
          loadMoreSetting.status = 'noMore'
          this.setData({
            loadMoreSetting
          })
        }

      }
    } catch (error) {

      console.log("余额明细 loadmore catch:", error)
    }

  },
  // 提现之前判断手机号
  beforeWithdraw() {
    let {
      userInfo
    } = this.data;
    // 未绑定手机号提示绑定手机号
    if (!userInfo.mobile) {
      this.selectComponent('#bindPhonePop').showBindPhonePop();
      return
    }
    this.withdraw();
  },
  // 手机号绑定成功
  async bindPhoneSuccess() {
    try {
      let userInfo = await utils.getUserInfoNew();
      console.log("bindPhoneSuccess 更新用户信息：", userInfo);
      this.setData({
        userInfo
      })
    } catch (error) {
      console.log("bindPhoneSuccess catch:", error)
    }
  }

})