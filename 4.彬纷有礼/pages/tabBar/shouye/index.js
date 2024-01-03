//index.js
const utils = require('../../../utils/util.js');
const http = require('../../../utils/api.js');
const auth = require('../../../utils/auth.js');
const log = require('../../../utils/log');
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const sdkVersion = app.globalData.systemInfo.SDKVersion;
const mta = require('../../../utils/mta_analysis.js');
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime.js'
//引入公共api
const shopActUtils = require("../../../api/shopActivity/utils");
const storeRankUtils = require("../../../api/storeRank/utils");

// 在页面中定义插屏广告
let interstitialAd = null;
let switchAd = true; //切换视频参数：false:自定义广告，true:接入腾讯广告
let next0 = 1;
let next1 = 1;
let next2 = 1;
let adPosition = 6;
let that = this;
Page({
  data: {
    userInfo: null,
    titles: ['品牌', '热门活动'],
    triggered: false, //scroll-view 触发刷新
    list0: [], //新闻列表
    list1: [], //品牌列表
    list2: [], //热门活动
    TabCur: 1,
    //店铺排行榜活动
    fireIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAcCAMAAABS8b9vAAAATlBMVEUAAAD8UwH9UwH9UgD8UgH8UQD8UgH/TgD8UgH8UgH9UwH/UgD9UwH8VAH9UgH8UgL9UgD8UQD8UQD+TwD9UwL+UwD7UwL9VAD8UAD9UwH3XymcAAAAGXRSTlMA9fAftxjED9Cl6QbihtadaEUuJpF5W0o3NtCClAAAANNJREFUKM9t0ckOwyAMRVHbzASaefD//2jBVRO1cBcsjtBjATypPBpoWkbyqlXLrJvbJnCHhyP22FguWWE33DzHyvLkks+vu50qp6tcsHG6OXCNpmG1jLsTU4Oxwji6iZiDq7oFozxLftmQ+bUWPlNS6vVhGjXKFijNafkyI9ZTKzhieUNGnuIBMnbqH8YAdQytjDxZsNzJg+5zwFZRQ6YOB5hTy3EC0xm3K3Sux2MAcBn/OMgnqfDjWCakdaRHSV/3B++ePogpK7hzV/aRiPw2O4E39FIhvy4lAl0AAAAASUVORK5CYII=',
    blockAd: false, //广告屏蔽，实际根据接口返回显示
    welfareShow: false, //福利弹窗组件
    welfareAdShow: false, //福利弹窗
    welfareLoaded: false, //福利弹窗加载成功
    sdkVersion_ok: utils.compareVersion(sdkVersion, '2.19.6') >= 0, //判断小程序版本是否支持福利弹窗基础库v2.19.6
    // 2023年4月14日 28周年店铺排行榜活动
    rankInfo: null, //排行榜信息
    // 2023年7月17日 东莞战马兑奖活动
    actInfoDG: null, // 东莞战马兑奖活动
    // 2023年8月3日
    actInfoRaffle: null, //深圳兑奖活动（抽奖）
    actInfoGZ: null, //广州开箱活动
    actInfoGzExc: null, //广州兑奖活动
    // 2023年10月18日
    actInfoDgzmExc: null, //东莞战马兑奖活动
  },

  onLoad: function (options) {
    //初始化腾讯mta
    mta.Page.init();
    //获取公告信息
    http.postBase({
      url: '/api/user/getpopup',
      fromApp: true
    }).then(res => {
      if (res.code == 1) {
        wx.showModal({
          title: res.data.tip,
          content: res.data.content,
          showCancel: false
        })
      }
    }).catch(err => {
      console.error("首页 index /api/user/getpopup:", err)
    });


    let systemInfo = app.globalData.systemInfo;
    if (systemInfo) {
      let screenWidth = systemInfo.windowWidth;
      let screenHeight = systemInfo.windowHeight;
      this.setData({
        listIndex: screenHeight / (screenWidth * 0.22),
        screenHeight: screenHeight,
        clientHeight: screenHeight - 45,
        screenWidth: screenWidth
      });
    }

    this.initOnload();
  },
  initOnload() {
    that = this;
    if (!wx.getStorageSync('token')) {
      this.getAd();
      return

    } else {
      setTimeout(() => {
        this.ishideHide().then(res => {
          this.getAd();
        });
      }, 500);
    }
    let cosAddress = auth.getCosAddress();
    if (cosAddress) {
      //首页品牌 热门活动
      adPosition = cosAddress.A7.value[0];
    } else {
      app.watch(function (val) {
        let cosAddress = auth.getCosAddress();
        if (cosAddress) {
          adPosition = cosAddress.A7.value[0];
        }
        switch (true) {
          case typeof val === 'object':
            //首页品牌 热门活动
            cosAddress = val;
            adPosition = cosAddress.A7.value[0];
            break
        }

      }.bind(this), "cosAddress")
    }

  },
  onReady: function () {

  },
  onShow: function () {
    // 2023年10月17日 新增隐私弹窗：永久保留
    this.selectComponent('#privacyPop').showFirstTimePrivacyPop();
    // 2023年4月 店铺排行榜活动
    let islogin = wx.getStorageSync('islogin');
    if (islogin && islogin == 1) {
      this.initActInfo();

    } else {
      app.tokenReadyCallback = (res) => {
        this.initActInfo();
      }
    }

    //更新用户信息
    if (this.data.TabCur == 1) {
      this.updateUserInfo();
    }
    //获取未读系统消息
    utils.getUnreadNotice();
    this.setData({
      blockAd: utils.blockAd()
    })
    this.showAd();

  },
  showAd: function (isShow = false) {
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-ce66c3c705fdbc82' //线上版
      })
      interstitialAd.onLoad(() => {
        if (isShow) {
          interstitialAd.show().catch((err) => {
            console.error("adShow err:", err);
          })
        }
      })
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {
        switchAd = false;
      })
    }
  },
  onChange(event) {
    let {
      current
    } = event.detail;
    console.log("onChange e:", event);
    this.setData({
      TabCur: current,
    });

    switch (current) {
      case 0:

        if (!this.noMore1 && this.data.list1.length == 0) {
          this.getAd();
        }
        break;
      case 1:

        if (!this.noMore2 && this.data.list2.length == 0) {
          this.getAd();
        }
        break;
      case 2:

        this.updateUserInfo();
        break;

      default:
        break;
    }
  },
  onReachBottom: function (e) {},
  onHide: function () {
    wx.hideLoading({
      success: (res) => {},
    })

  },
  onUnload: function () {
    next0 = 1;
    next1 = 1;
    next2 = 1;
  },

  //获取文章详情
  getArticle: function (activeTab, param, callback) {
    if (this._freshing) {
      return
    }
    this._freshing = true;
    let url = '/api/tools/article';
    let islogin = wx.getStorageSync('islogin');
    if (!wx.getStorageSync('token') || islogin != 1) {
      url = '/app/post/article';
    }
    http.post(url, param).then(res => {

      this._freshing = false;
      return callback(activeTab, res);
    });
  },
  //初始化数据、加载更多
  dataProcess: function (activeTab, data) {
    let code = data.code;
    let list0 = this.data.list0;
    let list1 = this.data.list1;
    let list2 = this.data.list2;
    let newData = data.data.list;
    let limit = data.data.limit;
    let next = data.data.next;
    wx.hideLoading({
      success: (res) => {},
    })
    this._freshing = false;

    if (newData) {
      switch (activeTab) {
        case 0:
          next0 = next;
          newData.forEach((ele, index, arr) => {
            ele.pv = this.million(ele.pv);
            ele.animate = '';
            if (adPosition && adPosition['show'] == 1) {
              let position = adPosition['position'];
              this.setData({
                adPosition: position
              })
              // if (index > 1 && (index % position === 0) &&this.data.blockAd) {
              //     arr[index].adCustom = true
              // }
            }
          });
          list0 = list0.concat(newData);

          this.setData({
            list0: list0,
          });

          next0 = next;
          break;
        case 1:
          this.setData({
            list1: list1.concat(newData),
          });
          next1 = next;
          break;
        case 2:

          this.setData({
            list2: list2.concat(newData),
          });
          next2 = next;
          break;

        default:
          break;
      }

    }
    if (+code == 0 || (newData && newData.length < limit)) {
      switch (activeTab) {
        case 0:

          break;
        case 1:
          this.noMore1 = true;
          break;
        case 2:
          this.noMore2 = true;
          break;

        default:
          break;
      }
      return
    }
  },
  //下拉刷新
  dataRefresh: function (activeTab, data) {
    let code = data.data.code;
    let list0 = this.data.list0;
    let list1 = this.data.list1;
    let list2 = this.data.list2;
    let newData = data.data.list;
    let limit = data.data.limit;
    let next = data.data.next;
    wx.hideLoading({
      success: (res) => {},
    })
    this.setData({
      triggered: false,
    })
    this._freshing = false
    //覆盖数据
    if (newData) {
      switch (true) {
        case (activeTab == 0):
          next0 = next;
          newData.forEach((ele, index, arr) => {
            ele.pv = this.million(ele.pv);
            ele.animate = '';
            if (adPosition && adPosition['show'] == 1) {
              let position = adPosition['position'];
              this.setData({
                adPosition: position
              })
              // if (index > 1 && (index % position === 0)&&this.data.blockAd) {
              //     arr[index].adCustom = true
              // }
            }
          });
          this.setData({
            list0: newData,
          });


          break;
        case (activeTab == 1):
          this.noMore1 = false;
          next1 = next;
          this.setData({
            list1: newData,
          });
          break;
        case (activeTab == 2):
          next2 = next;
          this.noMore2 = false;
          this.setData({
            list2: newData,
          });
          break;
        default:
          break;
      }

    } else {
      switch (activeTab) {
        case 0:
          this.setData({
            list0: [],
          });
          next0 = next;
          break;
        case 1:
          this.setData({
            list1: [],
          });
          next1 = next;
          break;
        case 2:
          this.setData({
            list2: [],
          });
          next2 = next;
          break;
        default:
          break;
      }

    }

    wx.stopPullDownRefresh({
      success: (res) => {},
    })
    if (code == 0 || newData && newData.length < limit) {
      switch (activeTab) {
        case 0:
          break;
        case 1:
          this.noMore1 = true;
          break;
        case 2:
          this.noMore2 = true;
          break;
        default:
          break;
      }
      return
    }
  },
  //跳转品牌详情页
  jumpToDetail: function (evt) {
    var url = evt.currentTarget.dataset.link;
    var title = evt.currentTarget.dataset.title;
    if (!url) return;
    wx.showLoading({
      title: '正在加载',
    })
    wx.navigateTo({
      url: '/pages/zhongduan/shouye/detail?url=' + url + '&title=' + title,
    })
  },
  imgLoaded: function () {
    wx.hideLoading({
      success: (res) => {},
    })
  },
  onShareAppMessage: function () {
    return {
      // imageUrl: 'https://file.y1b.cn/public/img/phaseIII/202104/bfyl_wechatShare.png',
      imageUrl: 'https://file.y1b.cn/public/img/bfyl/202205/bfyl_share_1.png',
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  getAd: function () {
    let isHide = wx.getStorageSync('isHide') && JSON.parse(wx.getStorageSync('isHide'));
    utils.getAd().then(data => {
      let str_cosAddress = JSON.stringify(data);
      auth.setCosAddress(data);
      app.globalData.cosAddress = str_cosAddress;
      let cosAddress = data;
      //首页活动图
      var list1 = cosAddress.A5?.value;
      var list2 = cosAddress.A10?.value;
      this.setData({
        list1,
        list2
      })
      list2.forEach((item, index) => {
        let items = 'list2[' + index + ']';
        if (item.province.length > 0 && isHide) {
          let province = isHide.data.province;
          let idx = item.province.findIndex((value) => value == province);
          if (idx > -1) {
            item.hide = 0;
          } else {
            item.hide = 1;
          }
        }
        if (item.city.length > 0 && isHide) {
          let city = isHide.data.city;
          let idx = item.city.findIndex((value) => value == city);
          if (idx > -1) {
            item.hide = 0
          } else {
            item.hide = 1;
          }
        }
        that.setData({
          [items]: item
        })
      })
      this.setData({
        triggered: false,
      });
    })
  },
  //是否隐藏广告
  ishideHide() {
    return new Promise((resolve, reject) => {
      utils.isHide().then(data => {
        wx.setStorageSync('hideAd', data.hide);
        wx.setStorageSync('phaseIII', data.show);
        log.addFilterMsg('isHide');
        log.info("isHide:", data);
        app.globalData.phaseIII = data.show;
        let mylbs = wx.getStorageSync('mylbs') && JSON.parse(wx.getStorageSync('mylbs'));
        log.info("mylbs:", mylbs);
        this.setData({
          blockAd: data.ad_show
        })
        resolve(data);

      })
    })


  },

  onRefresh() {
    let activeTab = this.data.TabCur;
    wx.vibrateShort();
    switch (activeTab) {
      case 0:
        next0 = 1;
        this.ishideHide();
        this.getAd();
        break;
      case 1:
        this.ishideHide();
        this.getAd();
        // 更新开箱、兑奖活动信息
        this.initActInfo();
        break;
      case 2:
        this.getAd();
        break;
      default:
        break;
    }
  },
  //跳转webview公共页：打开链接地址
  goWebview: function (e) {
    let link = e.currentTarget.dataset.link;
    link = encodeURIComponent(link);
    wx.navigateTo({
      url: '/pages/tabBar/shouye/webview/index?link=' + link,
    })
  },
  million: function (value) { //过万处理
    var num;
    if (value > 9999) { //大于9999显示x.xx万
      num = (Math.floor(value / 100) / 100) + '万+';
    } else if (value <= 9999 && value > -9999) {
      num = value
    } else if (value < -9999) { //小于-9999显示-x.xx万
      num = -(Math.floor(Math.abs(value) / 1000) / 10) + '万+'
    }
    return num;
  },

  adLoad(e) {
    // console.log("广告加载成功");
    let c_id = e.currentTarget.dataset.id;
    let list0 = this.data.list0;
    let index = list0.findIndex(item => item.c_id == c_id);
    let list = "list0[" + index + "].adLoaded";
    if (index > -1) {
      this.setData({
        [list]: true
      })
    }
  },
  adError(err) {
    let c_id = err.currentTarget.dataset.id;
    let list = this.data.list0;
    let index = list.findIndex(item => item.c_id == c_id);
    if (index > -1) {
      list[index].adCustom = false;
      this.setData({
        list0: list
      })
    }
  },
  onTabItemTap(item) {
    if (interstitialAd && switchAd && this.data.blockAd) {
      this.showAd(true);
      switchAd = false;
      this.setData({
        welfareShow: false
      });
      return
    }
    if (!switchAd) {
      switchAd = true;
      this.setData({
        welfareShow: true
      });
      return false;
    }
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })
  },
  swiperChange(e) {
    let source = e.detail.source;
    let current = e.detail.current;
    if (source && source == "touch") {
      this.setData({
        TabCur: current,
      });
    }
  },

  //更新用户信息：热门活动需要获取用户实时身份信息:店铺转让··移除店员···
  async updateUserInfo() {
    that = this;
    try {
      let userInfo = utils.getUserInfoNew();
      if (userInfo) {
        this.setData({
          userInfo
        })
      }
    } catch (error) {
      console.log("updateUserInfo catch:", error);
    }

  },

  //跳转扫一扫
  goScan: function () {
    let url = "/pages/zongduan/saoma/index";
    wx.navigateTo({
      url: url,
    })

  },

  triggerWelfare(e) {
    console.log("triggerWelfare:", e);
    if (e.detail && e.detail.show) {
      this.setData({
        welfareAdShow: Math.random(10)
      })
    }
  },
  listenWelfareLoad(e) {
    if (e.detail) {
      if (e.detail.welfareLoaded) {
        this.setData({
          welfareLoaded: true
        })
      } else {
        this.setData({
          welfareLoaded: false
        })
      }

    }
  },

  // 2023年4月14日 店铺排行榜活动
  // 活动参与信息
  async dgActGetInfo(event) {

    try {
      // 获取活动信息
      let {
        actInfo
      } = await shopActUtils.act5_getinfo();
      console.log("首页店铺排行榜参与信息：", actInfo)
      if (actInfo) {
        this.setData({
          actInfoDG: actInfo
        })
        log.addFilterMsg('shopActInfo');
        log.info(actInfo);
        //开箱活动每日弹窗处理(活动进行中)
        this.initRankDailyPopup(actInfo);
        this.initRankWinPopup(actInfo);
        return
      }
      return this.setData({
        actInfoDG: null
      })
    } catch (err) {
      console.error("dgActGetInfo err:", err);
    }

  },
  //排行榜活动：定时器结束触发
  rankTimerFinished(event) {
    // 根据定义的name 来更新不同的活动倒计时
    let {
      actname = 'actInfo'
    } = event.currentTarget.dataset;
    let actInfo = this.data[actname];
    console.log(actInfo)

    //活动未结束刷新倒计时
    if (!actInfo.act_state.act_end) {
      //根据时间重新计算 活动状态
      let {
        s_time,
        e_time
      } = actInfo
      let act_state = shopActUtils.init_act_state({
        s_time,
        e_time
      });
      console.log("倒计时结束重置活动状态：", act_state)
      actInfo.act_state = act_state;
      this.setData({
        [actname]: actInfo
      })
    }
  },
  //处理店铺排行榜每日弹窗:活动进行中
  initRankDailyPopup(rankInfo) {
    let {
      act_state,
      status
    } = rankInfo;
    console.log("初始化每日进度弹窗：", act_state, status);

    // 预热
    // if(act_state.act_yure){

    //   return
    // }
    //判断活动进行中
    if (act_state.act_ing && act_state.daily_pop) {
      this.selectComponent('#storeExchangePop').showExcProcessPop(rankInfo)
    }

  },
  //处理店铺排行榜中奖弹窗（活动结束后）
  initRankWinPopup(rankInfo) {
    console.log("rankInfo:", rankInfo);
    let {
      act_state,
      is_win
    } = rankInfo;
    // 如果活动结束7天以后不弹窗
    if (act_state.act_expire) return;
    //检查本地缓存的中奖日期字段
    let show = shopActUtils.win_check_date();
    // 判断条件：活动结束，show
    if (act_state.act_end && show && is_win) {
      this.selectComponent('#storeExchangePop').showWinPop(rankInfo)
      return
    }

  },
  // 首页点击店铺排行榜活动item
  tapRankAct: utils.throttle((event) => {
    //获取活动信息
    let actInfoDG = that.data.actInfoDG;
    let {
      act_state,
      status
    } = actInfoDG;

    //活动结束
    if (act_state.act_end) {
      //判断未中奖中奖
      that.checkRankWinPopup(actInfoDG)
      return
    }
    //活动进行中跳转详情
    utils.navigateFrequentPage(`pages/couponActivity/index/index`)
  }, 1000),


  //处理排行榜未中奖弹窗：未中奖弹窗，未领奖弹窗，已领奖跳转详情
  checkRankWinPopup(actInfo) {
    let {
      is_win,
    } = actInfo;
    // 未中奖弹窗
    if (!is_win) {
      // 一个没兑奖的显示已结束，兑过奖的显示未获得奖励弹窗
      if (actInfo.kpi_num == 0) {
        this.selectComponent('#storeExchangePop').showActNoExcPop(actInfo)
        return
      }
      this.selectComponent('#storeExchangePop').showActEndPop(actInfo)
      return
    }
    // 中奖
    if (is_win) {
      this.selectComponent('#storeExchangePop').showWinPop(actInfo)
      return
    }
    utils.navigateFrequentPage('pages/couponActivity/index/index')

  },
  // 2023年7月24日 深圳开箱活动
  async szUnboxInfo() {
    try {
      // 获取活动信息
      let {
        actInfo
      } = await shopActUtils.act5_getinfo_sz();
      console.log("深圳开箱活动参与信息：", actInfo)
      if (actInfo) {
        this.setData({
          actInfoSZ: actInfo
        })
        log.addFilterMsg('shopActInfoSZ');
        log.info(actInfo);
        //开箱活动每日弹窗处理(活动进行中)
        let {
          act_state,
          status,
          sign_time,
          is_win
        } = actInfo;

        // 未报名弹窗：活动未结束、未报名、无报名时间
        if (!act_state.act_end && (status == '未报名' || !sign_time)) {
          this.selectComponent('#actCouponPop').showApplyPop(actInfo);
          return
        }
        //判断活动进行中：每日进度更新弹窗
        if (act_state.act_ing && act_state.daily_pop) {
          this.selectComponent('#actCouponPop').showDailyProcessPop(actInfo);
          return
        }
        // 如果活动结束7天以后不弹窗
        if (act_state.act_expire) return;
        let show = shopActUtils.unbox_win_check_date();
        // 判断条件：活动结束，show：活动结束已中奖
        if (act_state.act_end) {
          // 未中奖弹窗
          // if (!is_win && show) {
          //   // 未开箱
          //   if (actInfo.kpi_num == 0) {
          //     this.selectComponent('#actCouponPop').showNotUnboxPop(actInfo);
          //     return
          //   }
          //   // 开箱未中奖
          //   this.selectComponent('#actCouponPop').showActEndPop(actInfo);
          //   return
          // }
          // 中奖
          if (is_win && show) {
            this.selectComponent('#actCouponPop').showWinPop(actInfo)
            return
          }
        }
        return
      }
      return this.setData({
        actInfoSZ: null
      })
    } catch (err) {
      console.error("szActGetInfo err:", err);
    }
  },
  // 首页点击店铺排行榜活动item
  tapUnboxAct: utils.throttle((event) => {
    //获取活动信息
    let actInfoSZ = that.data.actInfoSZ;
    let {
      act_state,
      is_win,
      status,
      sign_time
    } = actInfoSZ;
    // 活动未报名：前往报名
    if (!act_state.act_end && (status == '未报名' || !sign_time)) {
      utils.navigateFrequentPage('pages/shopActivity/unboxAct/base/index');
      return
    }
    // 活动预热跳转详情传参活动信息：/pages/shopActivity/unboxAct/base/index?rankInfo
    // if(act_state.act_yure){
    //   utils.navigateFrequentPage('pages/shopActivity/unboxAct/base/index')
    //   return
    // }
    //活动结束
    if (act_state.act_end) {
      // 未中奖弹窗
      if (!is_win) {
        // 未开箱
        if (actInfoSZ.s_num == 0) {
          that.selectComponent('#actCouponPop').showNotUnboxPop(actInfoSZ);
          return
        }
        that.selectComponent('#actCouponPop').showActEndPop(actInfoSZ);
        return
      }
      // 中奖
      if (is_win) {
        that.selectComponent('#actCouponPop').showWinPop(actInfoSZ);
        return
      }
      utils.navigateFrequentPage('pages/shopActivity/unboxAct/base/index')
      return
    }
    //活动进行中跳转详情
    utils.navigateFrequentPage(`pages/shopActivity/unboxAct/base/index`)
  }, 1000),
  // 2023年8月3日 深圳兑奖活动（抽奖）
  async szRaffleInfo() {
    try {
      // 获取活动信息
      let {
        actInfo
      } = await storeRankUtils.actInfo14();
      console.log("深圳兑奖活动raffle信息：", actInfo)
      if (actInfo) {
        this.setData({
          actInfoRaffle: actInfo
        })
        log.addFilterMsg('actInfoRaffle');
        log.info(actInfo);
        //开箱活动每日弹窗处理(活动进行中)
        let {
          act_state,
          is_win,
          raffle_win
        } = actInfo;

        // 活动进行中：每日进度更新弹窗
        if (act_state.act_ing && act_state.daily_pop) {
          this.selectComponent('#storeRankPopHome').showSzExcDailyPop(actInfo);
          return
        }
        // 活动结束：判断本地是否缓存中奖弹窗日期
        if (act_state.act_end && !act_state.act_expire) {
          // 中奖、抽奖中奖也要算进去
          if ((is_win || raffle_win) && utils.checkDateShowDailyPop('raffle_win_pop_date')) {
            this.selectComponent('#storeRankPopHome').raffleWinPop(actInfo)
            return
          }
        }
        return
      }
      return this.setData({
        actInfoRaffle: null
      })
    } catch (err) {
      console.error("actInfoRaffle err:", err);
    }
  },
  tapActInfoRaffle: utils.throttle((event) => {
    //获取活动信息
    let actInfoRaffle = that.data.actInfoRaffle;
    let {
      act_state,
      is_win,
      raffle_win,
    } = actInfoRaffle;
    //活动结束&未过期
    if (act_state.act_end) {
      // 中奖：1店铺排行榜中奖，2抽奖活动中奖
      if (is_win || raffle_win) {
        that.selectComponent('#storeRankPopHome').raffleWinPop(actInfoRaffle);
        return
      }
      // 未中奖弹窗
      if (!is_win) {
        that.selectComponent('#storeRankPopHome').raffleNoWinPop(actInfoRaffle);
        return
      }
      utils.navigateFrequentPage('pages/storeRank/rank/index')
      return
    }
    //活动进行中跳转详情
    utils.navigateFrequentPage(`pages/storeRank/rank/index`)
  }, 1000),
  // 2023年8月24日 广州开箱活动
  async gzUnboxActInfo() {
    try {
      // 获取活动信息
      let {
        actInfo
      } = await shopActUtils.gzUnboxActInfo();
      console.log("广州开箱活动信息：", actInfo)
      if (actInfo) {
        this.setData({
          actInfoGZ: actInfo
        })
        log.addFilterMsg('actInfoGZ');
        log.info(actInfo);
        //开箱活动每日弹窗处理(活动进行中)
        let {
          act_state,
          is_win,
          sign_time = '',
          status
        } = actInfo;
        // 未报名弹窗：活动未结束、未报名或者无报名时间
        if (!act_state.act_end && (status == '未报名')) {
          // 判断每日弹窗 gzunbox_apply_daily_pop
          let gzunbox_apply_daily_pop = utils.checkDateShowDailyPop('gzunbox_apply_daily_pop')
          if (gzunbox_apply_daily_pop) {
            this.selectComponent('#actCouponPop').showGzUnboxApplyPop(actInfo);
          }
          return
        }
        // 活动进行中：每日进度更新弹窗
        if (act_state.act_ing && act_state.daily_pop) {
          this.selectComponent('#actCouponPop').showGzUnboxDailyPop(actInfo);
          return
        }
        // 活动结束：判断本地是否缓存中奖弹窗日期
        if (act_state.act_end && !act_state.act_expire) {
          // 中奖、抽奖中奖也要算进去
          if ((is_win) && utils.checkDateShowDailyPop('gz_win_pop_date')) {
            this.selectComponent('#actCouponPop').showGzUnboxWinPop(actInfo)
            return
          }
        }
        return
      }
      return this.setData({
        actInfoGZ: null
      })
    } catch (err) {
      console.error("actInfoGZ err:", err);
    }
  },
  tapActInfoGZ: utils.throttle((event) => {
    //获取活动信息
    let actInfoGZ = that.data.actInfoGZ;
    let {
      act_state,
      is_win,
      status,
      sign_time = ''
    } = actInfoGZ;
    //活动结束
    if (act_state.act_end) {
      // 已中奖 弹窗
      // if (is_win ) {
      //   that.selectComponent('#actCouponPop').showGzUnboxWinPop(actInfoGZ);
      //   return
      // }
      // // 未中奖弹窗
      // if (!is_win) {
      //   that.selectComponent('#actCouponPop').showGzUnboxWinPop(actInfoGZ);
      //   return
      // }
      // utils.navigateFrequentPage('pages/couponActivity/gzUnbox/index/index')
      that.selectComponent('#actCouponPop').showGzUnboxWinPop(actInfoGZ);

      return
    }
    // 活动未报名 或者 预热 ：前往报名
    if ((status == '未报名' || act_state.act_yure) && !act_state.act_end) {
      // if ((status == '未报名' || !sign_time) && !act_state.act_end) {
      utils.navigateFrequentPage('pages/couponActivity/gzUnbox/signUp/index', `?actInfo=${encodeURIComponent(JSON.stringify(actInfoGZ))}`)
      return
    }
    // 活动预热跳转详情传参活动信息：/pages/storeRank/index/index?rankInfo
    // if(act_state.act_yure){
    //   utils.navigateFrequentPage('pages/couponActivity/gzUnbox/signUp/index',`?actInfo=${encodeURIComponent(JSON.stringify(actInfoGZ))}`)
    //   return
    // }
    //活动进行中跳转详情
    utils.navigateFrequentPage(`pages/couponActivity/gzUnbox/index/index`)
  }, 1000),
  // 2023年8月28日 广州兑奖活动
  async gzExcActInfo() {
    try {
      // 获取活动信息
      let {
        actInfo
      } = await shopActUtils.gzExcActInfo();
      if (actInfo) {
        this.setData({
          actInfoGzExc: actInfo
        })
        log.addFilterMsg('actInfoGZ');
        log.info(actInfo);
        //开箱活动每日弹窗处理(活动进行中)
        let {
          act_state,
          is_win,
          id
        } = actInfo;

        // 活动进行中：每日进度更新弹窗 并且有id 
        if (act_state.act_ing && act_state.daily_pop && id) {
          this.selectComponent("#actCouponPop").showGzExcDailyPop(actInfo);
          return
        }
        // 活动结束：判断本地是否缓存中奖弹窗日期
        if (act_state.act_end && !act_state.act_expire) {
          // 中奖、抽奖中奖也要算进去
          if ((is_win) && utils.checkDateShowDailyPop('gz_exc_win_pop_date')) {
            this.selectComponent("#actCouponPop").showGzExcWinPop(actInfo)
            return
          }
        }
        return
      }
      return this.setData({
        actInfoGzExc: null
      })
    } catch (err) {
      console.error("actInfoGZ err:", err);
    }
  },
  tapActInfoGzExc: utils.throttle((event) => {
    //获取活动信息
    let actInfoGzExc = that.data.actInfoGzExc;
    let {
      act_state,
      status,
    } = actInfoGzExc;
    //活动结束
    if (act_state.act_end) {
      // 已中奖 弹窗
      that.selectComponent('#actCouponPop').showGzExcWinPop(actInfoGzExc);
      return
    }

    //活动进行中跳转详情
    utils.navigateFrequentPage(`pages/couponActivity/gzExc/index/index`)
  }, 1000),
  // 2023年10月18日 东莞战马兑奖活动
  async dgZmExcActInfo() {
    try {
      // 获取活动信息
      let {
        actInfo
      } = await shopActUtils.dgZmExcActInfo();
      console.log("10月东莞战马兑奖活动：", actInfo)
      if (actInfo) {
        this.setData({
          actInfoDgzmExc: actInfo
        })
        log.addFilterMsg('actInfoDgzmExc');
        log.info(actInfo);
        //开箱活动每日弹窗处理(活动进行中)
        let {
          act_state,
          is_win,
        } = actInfo;
        // 活动进行中：每日进度更新弹窗
        if (act_state.act_ing && act_state.daily_pop) {
          this.selectComponent("#dgzmExcPop").showExcProcessPop(actInfo);
          return
        }
        // 活动结束：判断本地是否缓存中奖弹窗日期
        if (act_state.act_end && !act_state.act_expire) {
          // 中奖且当日未弹窗
          if ((is_win) && utils.checkDateShowDailyPop('dgzm_exc_win_pop_date')) {
            this.selectComponent("#dgzmExcPop").showExcWinPop(actInfo)
            return
          }
        }
        return
      }
      return this.setData({
        actInfoDgzmExc: null
      })
    } catch (err) {
      console.error("actInfoDgzmExc err:", err);
    }
  },
  // 点击东莞战马兑奖活动23年10月
  tapDgzmExcAct: utils.throttle((event) => {
    //获取活动信息
    let actInfoDgzmExc = that.data.actInfoDgzmExc;
    let {
      act_state,
    } = actInfoDgzmExc;
    //活动结束
    if (act_state.act_end) {
      // 已中奖 弹窗
      that.selectComponent('#dgzmExcPop').showExcWinPop(actInfoDgzmExc);
      return
    }
    //活动进行中跳转详情
    utils.navigateFrequentPage(`pages/couponActivity/dgExcZm/index/index`)
  }, 1000),
  // 初始化所有的开箱、兑奖活动信息
  initActInfo() {
    this.dgActGetInfo();
    // 深圳开箱活动
    this.szUnboxInfo();
    // 2023年8月3日 深圳兑奖活动
    this.szRaffleInfo();
    // 2023年8月24日 广州开箱活动
    this.gzUnboxActInfo();
    // 2023年8月28日 广州兑奖活动
    this.gzExcActInfo();
    // 2023年10月20日 东莞战马兑奖活动（11月30日结束）
    this.dgZmExcActInfo();
  }
})