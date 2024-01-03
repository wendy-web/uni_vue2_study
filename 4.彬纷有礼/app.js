//app.js
const utils = require('/utils/util.js')
const http = require('/utils/http.js')
const mta = require('/utils/mta_analysis.js')
const log = require('./utils/log.js');
const socket = require('./utils/socket')
let BackgroundAudioManager = wx.getBackgroundAudioManager();
let audioPlaying = false; //音频播放状态
let appHide = false; //小程序息屏
require('/utils/overWrite')
App({
  onLaunch: function (options) {
    //腾讯mta
    mta.App.init({
      "appID": "500724007",
      "lauchOpts": options,
      "autoReport": false,
      "statParam": true,
      "ignoreParams": [],
    });
    const that = this;
    // 检测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function (err) {
      // 新版本下载失败
      log.addFilterMsg("updateFailed");
      let systemInfo = wx.getSystemInfoSync() || '';
      log.info("设备信息：", systemInfo);
      console.error("新版本下载失败,设备信息:", systemInfo);
    })
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.hideLoading({
          complete: (res) => {},
        })
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    })
    // 移除设备信息缓存
    wx.removeStorageSync('TJ-navBar-system');
    // 获取系统信息
    wx.getSystemInfo({
      success: res => {
        this.globalData.systemInfo = res;
        const iphoneX = /iphone x/i.test(res.model);
        const iphoneNew = /iPhone11/i.test(res.model) && res.screenHeight === 812;
        this.isIPhoneX = iphoneX || iphoneNew
        this.homePageHeight = res.screenHeight - (this.isIPhoneX ? 84 : 50) - 44 - res.statusBarHeight;
      },
      fail: res => {
        console.log("获取系统信息失败：", res);
      },
    })
    
    
  },

  onShow(options) {
    //开屏上报
    socket.appShowSendMessage()
    //注册回调
    socket.addLoopBack('app', (data) => {
      this.getMsgs(data)
    })
    //链接socket
    socket.socketConnect()

    appHide = false;
    let that = this;
    let token = wx.getStorageSync('token');
    if (token) {
      this.getCountCard();
      if (!wx.getStorageSync('isHide')) {
        utils.isHide();
      }
      //播放背景音频
      if (this.globalData.audioList.length) {
        this.playNext();
      }
      this.getAd();
      // 获取配置
      this.initConfig()
    }
    //本地没有用户所在地区信息，但是有缓存经纬度，根据经纬度获取地区信息
    let getUserLocation = wx.getStorageSync('getUserLocation');
    getUserLocation = getUserLocation && JSON.parse(getUserLocation);
    if (!wx.getStorageSync('mylbs') && getUserLocation) {
      //经纬度解析省市区
      utils.getlbs(getUserLocation.data).then(res => {})
    }
    BackgroundAudioManager.onPlay(() => {
      audioPlaying = true;
      console.log('开始播放：', audioPlaying);
    })
    BackgroundAudioManager.onError((res) => {
      console.log("BackgroundAudioManager error:", res)
      audioPlaying = false;
      // BackgroundAudioManager.pause();
      // that.playNext();
    })
    BackgroundAudioManager.onEnded((res) => {
      audioPlaying = false;
      console.log("BackgroundAudioManager ended:", audioPlaying)
      let audioList = this.globalData.audioList;
      audioList.shift();
      if (audioList.length) {
        that.playNext();
      }
    })
  },
  onHide: function () {
    //熄屏上报
    appHide = true;

    //黑屏上报
    socket.appHideSendMessage()
    wx.removeStorage({
      key: 'billInfo2020',
      success(res) {}
    })
    wx.removeStorage({
      key: 'isHide',
      success(res) {}
    })
    wx.removeStorageSync('qrcode');
    wx.removeStorageSync('local_errMsg')
    wx.removeStorageSync('mylbs');
    this.globalData.act_time = '';
    this.globalData.isHide = '';
  },
  onError(error) {
    log.addFilterMsg("AppError");
    log.info("app onError:", error)
  },
  //监测轮播数据change
  watch: function (method, name) {
    var obj = this.globalData;
    var that = this;
    Object.defineProperty(obj, "cosAddress", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        method(value, "cosAddress");
      }
    })
    Object.defineProperty(obj, "phaseIII", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        method(value, "phaseIII");
      }
    })
    Object.defineProperty(obj, "token", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        method(value, "token");
        utils.isHide().then(data => {
          console.log("data:", data);
          that.globalData.act_time = data.act_time;
          that.globalData.phaseIII = data.show;
        });

      }
    })
  },

  //获取COS资源
  getAd() {
    //后台返回图片 视频 COS地址
    let that = this;
    return utils.getAd().then(data => {
      let cosAddress = JSON.stringify(data);
      that.globalData.cosAddress = cosAddress;
    })

  },
  getCountCard() {
    let that = this;
    let who = wx.getStorageSync('who');
    if (this.globalData.TabBarRedDot) return;
    return http.postBase({
      url: '/api/card/getcountcard',
      fromApp: true
    }).then(res => {
      if (res.code == 1) {
        if (res.data.unopen) {
          if (who && who == 1) {
            wx.showTabBarRedDot({
              index: 4,
              fail: res => {
                console.log("wx.showTabBarRedDot fail:", res);
              },
              complete: res => {
                that.globalData.TabBarRedDot = true;
              }
            })
          }
        } else {
          wx.hideTabBarRedDot({
            index: 4,
            fail: res => {
              console.log("wx.hideTabBarRedDot fail:", res);
            },
            complete: res => {
              that.globalData.TabBarRedDot = true;
            }
          })
        }
        return
      }
      that.globalData.TabBarRedDot = false;
    }).catch(error => {
      that.globalData.TabBarRedDot = false;
    });
  },

  //收到消息
  getMsgs: function (obj) {
    console.log('收到消息', obj);
    switch (obj.type) {
      case "pay_call":
        let data = obj.data;
        if (data.music.length > 0) {
          data.music.forEach(item => {
            this.globalData.audioList.push(item);
            // console.log("音频地址：", item);
          })
          console.warn("audioList:", this.globalData.audioList);
          console.warn("音频播放状态：", audioPlaying);
          // 如果音频正在播放，暂时不赋值，音频未播放时赋值src：自动播放
          if (!audioPlaying && !appHide) { //音频未播放并且小程序onShow状态
            audioPlaying = true;
            this.setAudio();
          }
        }
        break;
    }
  },
  playNext: function () {
    var that = this;
    let playIndex = 0;
    if (that.globalData.playIndex < (that.globalData.audioList.length - 1)) {
      playIndex = that.globalData.playIndex + 1;
    }
    that.globalData.playIndex = playIndex;
    that.setAudio();


  },
  setAudio: function () {
    var that = this;
    let audioList = that.globalData.audioList;
    let data = audioList.length && audioList[0];
    BackgroundAudioManager.title = '到账提醒';
    BackgroundAudioManager.epname = '到账提醒';
    BackgroundAudioManager.singer = '到账提醒';
    BackgroundAudioManager.coverImgUrl = 'https://file.y1b.cn/public/img/logo-bfyl.png';
    console.log("playNext audioList:", audioList, audioList.length);
    if (data) {
      BackgroundAudioManager.src = data;
    }

    return
  },
  // 初始化配置
  async initConfig() {
    try {
      let config = await http.postBase({
        url: '/api/get/getConfig',
        mask: false,
        fromApp: true
      });
      let {
        code,
        data
      } = config;
      if (code == 1 && data.ad1) {
        utils.setCache('xdyzConfig230810',JSON.stringify(data),1800)
      } else {
        wx.removeStorageSync('xdyzConfig230810')
      }
    } catch (error) {
      console.log("initConfig error:", error)
    }

  },
  globalData: {
    isConnected: true,
    API_BASE_URL: http.baseURL || 'https://txc.y1b.cn', //测试服务器
    COS_URL: http.COS_URL || 'https://file.y1b.cn',
    WSS_URL: http.WSS_URL || 'wss://socket.y1b.cn/txc/',
    systemInfo: null,
    isIPhoneX: false,
    homePageHeight: 0,
    // tabbar: [],
    cosAddress: '',
    phaseIII: wx.getStorageSync('phaseIII'),
    token: '',
    playIndex: 0, //当前播放列表的index
    audioList: [],
    is_login: false,
    TabBarRedDot: false,
    act_time: '', //店铺排行榜活动时间
    storeRankNum: 10, //店铺排行榜上榜兑奖人数
    hnTypeArr: [1, 2, 3, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,60,61], //红牛箱内码红包类型
    hn2in1:[61],//红牛箱内码类型 2选1
    hnTitle: "红牛维生素功能饮料250ml【原味型】",
    hnTitleBlue: "红牛维生素功能饮料250ml【强化型】",
    zmTitle: "战马能量型维生素饮料310ml",
    zmTypeArr: [4, 5, 6, 7, 8, 9,10], //战马箱内码红包类型
    unboxActRuleObj: { //开箱活动规则
      4: http.COS_URL + '/public/img/bfyl/202202/img_zm_26th_rule.png',
      5: http.COS_URL + '/public/img/WarHorse/2021/02/ZM_activity_five_rule.png',
      6: http.COS_URL + '/public/img/WarHorse/2022/01/zmActivityRule2022011801.png',
      7: http.COS_URL + '/public/img/bfyl/202206/img_zm_7_rule.png',
      8: http.COS_URL + '/public/img/bfyl/202212/zm_act_rule_8.png',
      9: http.COS_URL + '/public/img/bfyl/202212/zm_act_rule_8.png',
      10: http.COS_URL + '/public/img/bfyl/202212/zm_act_rule_8.png',// 2023年9月11日新增，活动规则和8、9相同
      53: http.COS_URL + '/public/img/bfyl/202201/img_hn_27th_rule01.png',
      54: http.COS_URL + '/public/img/bfyl/202201/img_hn_27th_rule01.png',
      55: http.COS_URL + '/public/img/bfyl/202201/img_hn_27th_rule01.png',
      56: 'https://file.y1b.cn/public/img/bfyl/actRule/hntype56rule_1.png',
      57: 'https://file.y1b.cn/public/img/bfyl/202302/img_hn_28th_rule.png',
      58: 'https://file.y1b.cn/public/img/bfyl/202302/img_hn_28th_rule.png',
      59: 'https://file.y1b.cn/public/img/bfyl/202302/img_hn_28th_rule.png',
      60: 'https://file.y1b.cn/public/img/bfyl/2023/08/hn_rule_type_60_1.png',
      61: 'https://file.y1b.cn/public/img/bfyl/2023/08/hn_rule_type_61_3.png', //箱内码类型61的活动规则
    },
    pre_act_hn_obj: { //开箱类型对应红牛周年
      1: 25,
      2: 25,
      3: 25,
      50: 26,
      51: 26,
      52: 26,
      53: 27,
      54: 27,
      55: 27,
      56: 27,
      57: 28,
      58: 28,
      59: 28,
      60: 28,
      61: 28,
    },
    userRole: { //用户角色
      0: {
        name: '用户'
      },
      1: {
        name: '掌柜'
      },
      2: {
        name: '店员'
      },
      3: {
        name: '副掌柜'
      }
    },

  }
})