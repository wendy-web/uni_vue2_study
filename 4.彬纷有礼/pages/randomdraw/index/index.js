const utils = require("../../../utils/util");
const auth = require("../../../utils/auth");
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const bgMusic = wx.createInnerAudioContext();
// 在页面中定义插屏广告
let interstitialAd = null;
let cosAddress = null;
let _isLogin = false;
const log = require('../../../utils/log.js');
let hnTypeArr = app.globalData.hnTypeArr; //红牛箱内码红包类型
//活动规则图片
const act_rule_obj = app.globalData.unboxActRuleObj;
const pre_act_hn_obj = app.globalData.pre_act_hn_obj;
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime.js';

import {
  getConfig
} from '../../../api/config';
import {
  reportEvent
} from '../../../api/openMiniProgram';
const http = require('../../../utils/http');

Page({
  data: {
    //自定义导航栏初始化
    background: '#d82731', //背景颜色
    iconTheme: 'white', //图标主题
    title: '扫码领红包',
    //自定义导航栏
    hbdata: '',
    //自定义视频蒙层
    videoPop: false, //默认false
    capsule: 'capsule',
    reconfirmPop: false, //跳转余额再次确认弹窗,默认false
    gamePage: [

      '/pages/randomdraw/slotmachine/machine',
      '/pages/randomdraw/rotate/rotate',
      '/pages/randomdraw/goldenEgg/goldenEgg',
      '/pages/randomdraw/marquee/index',
    ],
    radomUrl: '', //随机页面地址

    task: '', //任务
    hasTask: 0, //默认0是否有任务 0无任务，1有任务
    // videoUrl:"https://file.y1b.cn/public/videos/m3u8/hongniu.m3u8", //红牛动画30s
    videoUrl: "",
    image_load_failed: false, //2021年3月19日 网络图片加载失败时默认显示普通按钮
    blockAd: false, //广告屏蔽
    videoLoadFail: false, //2021年8月12日视频组件加载失败：防止点击红包翻倍按钮没反应，直接跳过视频去做任务
    //2022年1月20日 27周年改版
    opened: false, //红包打开状态，默认false
    successful: 0, //开红包请求成功 默认0,1成功，2失败
    hn_banner: COS_URL + '/public/img/WarHorse/2022/01/error_hn_banner_3.png', //主图和异常码落地页一致
    icon_hn_27th: COS_URL + '/public/img/bfyl/202201/icon_hn_27th.png', //主图和异常码落地页一致
    icon_hn_title: COS_URL + '/public/img/bfyl/202201/icon_hn_title.png', //红牛27周年标题
    img_hn_opened: COS_URL + '/public/img/bfyl/202201/img_hn_opened.png', //一开红包
    img_hn_unopened: COS_URL + '/public/img/bfyl/202201/img_hn_unopened01.png', //未开红包背景
    icon_question: COS_URL + '/public/img/WarHorse/2022/01/icon_question.png',
    hbtype: '',
    img_hn_foot: COS_URL + '/public/img/WarHorse/2022/01/error_hn_foot.png',
    icon_hn_btn_yuer: COS_URL + '/public/img/bfyl/202201/icon_btn_balance.png', //查看余额按钮
    icon_hn_btn_scan: COS_URL + '/public/img/bfyl/202201/icon_btn_scan.png', //查看余额按钮
    icon_btn_help: COS_URL + '/public/img/bfyl/202201/icon_btn_help.png', //查看助力按钮
    icon_btn_giveup: COS_URL + '/public/img/bfyl/202201/icon_btn_giveup.png', //放弃翻倍按钮
    icon_btn_video: COS_URL + '/public/img/bfyl/202201/icon_btn_video.png', //看视频红包翻倍翻倍按钮
    img_hn_alert_reconfirm: COS_URL + '/public/img/bfyl/202201/img_hn_alert_reconfirm.png', //二次确认弹窗背景
    gif_btn_watchvideo: COS_URL + '/public/img/bfyl/202201/gif_btn_watchvideo_mini.gif', //gif看视频翻倍按钮
    hn_banner_type56: COS_URL + '/public/img/bfyl/202208/bg_hn_type56.png', //箱内码类型56，奖金最高10元
    // 28周年
    pre_act_hn: 27, //往期红牛活动类型，默认27
    img_hn_banner_28y: COS_URL + '/public/img/bfyl/202302/img_hn_banner_28y.png', //28周年背景
    icon_hn_28y: COS_URL + '/public/img/bfyl/202302/icon_hn_28y.png',
    hn_28y_msgbox: COS_URL + '/public/img/bfyl/202302/img_hn_28y_open.png',
    btn_check_help: COS_URL + '/public/img/bfyl/202302/btn_check_help.png',
    btn_check_yuer: COS_URL + '/public/img/bfyl/202302/btn_check_yuer.png',
    icon_hn_28y_clear: COS_URL + '/public/img/bfyl/202302/icon_hn_28y_clear.png',
    img_hn_bg_28y: COS_URL + '/public/img/bfyl/202302/img_hn_bg_28y.png',
    icon_query: COS_URL + '/public/img/bfyl/202302/icon_query.png',
    img_hn_28y_seal: COS_URL + '/public/img/bfyl/202302/img_hn_28y_seal.png',
    icon_tt_seal: COS_URL + '/public/img/bfyl/202302/icon_tt_seal.png',
    img_hn_alert_reconfirm_28y: COS_URL + '/public/img/bfyl/202302/img_hn_alert_reconfirm_28y.png',
    btn_get_benefit: `${COS_URL}/public/img/bfyl/2023/09/btn_get_benefit.png`, //2023年5月19日 无任务显示领取福利按钮 9月20号换图
    xd_benefit_pop: false, //福利弹窗：点击跳转小店有惠
    xd_benefit_closed: false, // 弹窗关闭：显示继续开箱扫码按钮
    config: '', //引流配置
  },
  onLoad: function (options) {
    log.addFilterMsg('randomdrawIndex');
    log.info(`randomdrawIndex options:`, options);
    this.initOptions(options)
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        // adUnitId: 'adunit-99901f01a9a88f65'
        adUnitId: 'adunit-7e4fd08135410962' //线上版
        // adUnitId: 'adunit-fe6246481eec72ba' //测试版
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {
        console.error("插屏广告onError:", err);
      })
      interstitialAd.onClose(() => {})
    }
  },
  onReady() {
    // this.backMusic = wx.getBackgroundAudioManager(), this.backMusic.src = app.globalData.COS_URL+"/public/music/2.mp3", 
    // this.backMusic.title = "Music", this.backMusic.play();
    var radomUrl = this.data.gamePage[Math.floor((Math.random() * this.data.gamePage.length))];
    this.setData({
      radomUrl: radomUrl
    });
    console.log("随机跳转页面：", radomUrl);
  },
  async onShow() {
    // if (wx.hideHomeButton) {
    //   wx.hideHomeButton({
    //     complete: (res) => {},
    //   })
    // }

    this.setData({
      blockAd: utils.blockAd()
    })
    // 获取引流配置
    try {
      let config = utils.getCache('xdyzConfig230810');
      if (config) {
        this.setData({
          config: JSON.parse(config)
        })
      } else {
        let res = await getConfig();
        let {
          code,
          data
        } = res;
        if (code == 1 && data.ad1) {
          utils.setCache('xdyzConfig230810', JSON.stringify(data), 1800)
          this.setData({
            config: data
          })
        } else {
          this.setData({
            config: null
          })
        }
      }
    } catch (error) {
      console.log("初始化配置error：", error);
    }
  },
  async initOptions(options) {
    try {
      //初始化
      _isLogin = false;
      var that = this;
      if (options.hbtype) {
        let pre_act_hn = pre_act_hn_obj[+options.hbtype] || this.data.pre_act_hn;
        let background = '#d82731';
        if (+pre_act_hn == 28) {
          background = '#d72019'
        }
        this.setData({
          hbtype: options.hbtype,
          pre_act_hn,
          background
        })
      }
      if (options.hbdata) {
        this.setData({
          hbdata: decodeURIComponent(options.hbdata),
        });
      } else {
        var errMsg = {
          msg: "小程序加载异常，请删除小程序重新进入。"
        }
        this.setData({
          successful: 2,
          hbdatas: errMsg
        });
      }
      //删除本地缓存的qrcode
      wx.removeStorageSync('qrcode');
      //获取用户信息
      var userdata = wx.getStorageSync('userdata') || await utils.getUserInfoNew();
      this.setData({
        userdata
      });
      //初始化音频
      this.listenerButtonPlay(app.globalData.COS_URL + "/public/music/k_2.mp3");
      cosAddress = auth.getCosAddress();
      console.log("randomdraw onLoad cosAddress:", cosAddress);
      //获取广告地址
      if (cosAddress && cosAddress.A8) {
        let videoUrl = cosAddress.A8.value[0].video_hn[0];
        this.setData({
          videoUrl
        });
      } else {
        utils.getAd().then(data => {
          cosAddress = data;
          let videoUrl = cosAddress.A8.value[0].video_hn[0];
          this.setData({
            videoUrl
          });
        });

      }
      utils.getNavbarData().then(res => {
        if (res) {
          this.setData({
            navBarSystem: res,
          })
        }
      });


    } catch (error) {
      log.setFilterMsg("randomdrawCatch");
      log.info("initOptions catch:", error);
    }
  },
  //活动规则
  showRule: function () {
    let hbtype = this.data.hbtype;
    if (hnTypeArr.includes(+hbtype)) {
      let url = act_rule_obj[+hbtype];
      if (url) {
        return wx.previewImage({
          urls: [url],
        })
      }
    }
  },

  //点击拆红包
  openHongbao: function () {
    if (_isLogin) return;
    _isLogin = true;
    //播放开红包音频
    var that = this;
    this.setData({
      animate: 1
    });

    var data = {
      code: that.data.hbdata
    }
    console.log("拆红包参数：", data);
    wx.showLoading({
      title: '正在加载',
    })

    //拆红包
    http.postBase({
      url: '/api/scan/open',
      params: data
    }).then(res => {
      const {
        code,
        data
      } = res;
      setTimeout(function () {
        console.log("randomdraw index 拆红包返回：", res);
        that.listenerButtonStop();
        wx.hideLoading({
          success: (res) => {},
        })
        that.setData({
          opened: true
        })
        _isLogin = false;
        if (code == 1) {
          //数组 没任务是数组
          if (Array.isArray(data.task)) {
            if (interstitialAd && that.data.blockAd) {
              interstitialAd.show().catch((err) => {
                console.error(err)
              })
            }
            return that.setData({
              hbdatas: res,
              animate: 0,
              successful: 1,
            });
          }
          //有任务是对象 data.id 作为键值存缓存，跳转页面传id 落地页取任务
          wx.setStorageSync('getRewarded', null);

          let getRewarded = {};
          getRewarded[0] = data.task[0];
          getRewarded = JSON.stringify(getRewarded);
          wx.setStorageSync('getRewarded', getRewarded);
          that.setData({
            task: data.task,
            hbdatas: res,
            hasTask: 1,
            animate: 0,
            successful: 1,
          });

        } else {
          that.setData({
            animate: 0,
            hbdatas: res,
            successful: 2,
          })
        }
        wx.hideLoading({
          complete: (res) => {},
        })
      }, 1000)
    }).catch(error=>{
      _isLogin = false;
    })
    //播放开红包音效
    bgMusic.play();

  },
  //跳转yuer页面
  goYuer: function (e) {
    var go = e.currentTarget.dataset.go;
    console.log("再次确定跳转:", go);
    //判断用户扫码红包 是否有翻倍任务，有就二次弹窗，没有直接跳转
    var task = this.data.task;

    // return;
    if (go == 1 && Object.keys(task).length > 1) {
      this.setData({
        reconfirmPop: true,
      });
      // if(task.length!=0){
      //   this.setData({
      //     reconfirmPop:true,
      //   });
      // }
      return false;
    }
    //检查用户手机号,存在则跳转
    var userdata = wx.getStorageSync('userdata') ? wx.getStorageSync('userdata') : this.data.userdata;
    console.log('获取本地userdata:', userdata);
    if (userdata && userdata.mobile) {
      //本地缓存用户信息 redirectTo
      let url = '';
      if (userdata.condition != 2) {
        url = "/pages/zhongduan/geren/yuer/index"
      } else {
        url = "/pages/zhongduan/geren/zhuli/index"
      }
      wx.redirectTo({
        url: url,
      })
      return false
    } else {
      //请求接口获取最新数据
      utils.getUserInfoNew();

    }
  },
  //跳转游戏页面
  playGame: function (e) {
    //videoEnd :0 视频未完整播放不跳转(弹出观看视频弹窗或不做处理)  1：视频播放完走业务逻辑
    console.log("视频组件页面触发：", e);
    var detail = e.detail;
    if (detail.videoEnd == 0) {
      return
    }
    if (detail.videoEnd == 1) {
      console.log("视频播放结束触发：", detail.videoEnd);
      this.setData({
        videoEnd: 1
      });
      // return;
    }
    if (detail.videoLoadFail) {
      this.setData({
        videoLoadFail: true
      })
      return
    }
    //随机跳转到任意游戏页面
    let {
      task,
      radomUrl,
      pre_act_hn
    } = this.data;
    task = encodeURIComponent(JSON.stringify(task));
    // console.log("任务：",task);
    wx.redirectTo({
      // url: radomUrl + '?task=' + task , //跳转携带task
      url: `${radomUrl}?task=${task}&pre_act_hn=${pre_act_hn}`, //跳转携带task
    })

  },
  //视频组件加载失败，跳过视频直接去做任务 2021年8月12日
  skipVideoPlayGame() {
    this.setData({
      videoLoadFail: false
    })
    //随机跳转到任意游戏页面
    var task = this.data.task;
    task = encodeURIComponent(JSON.stringify(task));
    // console.log("任务：",task);
    var radomUrl = this.data.radomUrl;
    wx.redirectTo({
      url: radomUrl + '?task=' + task, //跳转携带task
    })
  },
  /**
   * 音频播放
   */
  // 开始播放
  listenerButtonPlay: function (src) {
    if (!src) src = app.globalData.COS_URL + "/public/music/k_3.mp3";
    bgMusic.src = src;
  },
  //暂停
  audioPause: function () {
    bgMusic.pause(); //暂停播放音乐
    console.log('暂停')
  },
  audioPlay: function () {
    bgMusic.play(); //停止播放
    console.log('继续播放')
  },
  //停止播放
  listenerButtonStop: function () {
    bgMusic.stop()
  },
  //观看视频
  watchAd: function () {
    log.addFilterMsg("tapWatchAd");
    log.info("tap watchAd：", this.data.videoLoadFail);

    if (this.data.videoLoadFail) {
      return this.skipVideoPlayGame();
    }
    this.setData({
      videoPop: true,
      iconTheme: 'black',
      background: '#ffffff',
      reconfirmPop: false
    });
  },
  // 自定义导航栏 返回监听
  onBeforeBack: function () {
    //判断用户扫码红包 是否有翻倍任务，有就二次弹窗，没有直接跳转
    var task = this.data.task;
    if (this.data.videoEnd == 1) {
      //随机跳转到任意游戏页面
      var task = this.data.task;
      var radomUrl = this.data.radomUrl;
      wx.redirectTo({
        url: radomUrl + '?task=' + task, //跳转携带task
      })
      return;
    }
    if (task && Object.keys(task).length > 1) {
      // 只要页面存在这个方法，并返回return wx.showModal就会监听拦截用户返回动作
      return wx.showModal({
        title: '温馨提示',
        content: '红包未翻倍,确定要离开吗？',
        // confirmStay: !1 //结合content意思，点击确定按钮后，是否留在原来页面，confirmStay默认false
        success: (res => {
          if (res.confirm) {
            wx.navigateBack({
              complete: (res) => {},
            })
          }
        })
      })
    }
    // wx.setStorageSync('showBackModal', false);
    wx.navigateBack({
      complete: (res) => {},
    })


  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    _isLogin = false;
    var that = this
    that.listenerButtonStop() //页面卸载时停止播放
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //获取上一个页面
    if (prevPage) {
      prevPage.setData({ //修改上一个页面的变量
        hided: true
      })
    }
    console.log("页面卸载····");
    // //拆完红包清除本地qrcode缓存
    wx.removeStorageSync('qrcode');
    this.setData({
      image_load_failed: false,
      iconTheme: 'white',
      xd_benefit_pop: false,
      xd_benefit_closed: true
    })
  },
  onHide: function () {

  },
  imgError: function (error) {
    log.addFilterMsg("imgError");
    log.error("图片加载失败:", error);
    //网络图片加载失败默认显示普通文本按钮
    this.setData({
      image_load_failed: true
    })
  },
  goScan: function () {
    app.globalData.toscan = true;
    let url = "/pages/zongduan/saoma/index";
    //获取当前页面栈
    let pages = getCurrentPages() || [];
    if (pages.length) {
      //查询排行榜页面索引
      pages.reverse();
      let pageIndex = pages.findIndex(item => item.route == 'pages/zongduan/saoma/index');
      //找到索引的，返回至排行榜页（wx.navigateBack关闭当前页面）
      if (pageIndex > -1) {
        pages[pageIndex].setData({
          isBackPage: true
        })
        wx.navigateBack({
          delta: pageIndex,
        })
        return
      }
    }
    //页面栈里无指定页面再跳转（小程序中页面栈最多10层，超出会报错：fail webview count limit exceed）
    if (url) {
      wx.redirectTo({
        url: '/pages/zongduan/saoma/index?hide=1',
      })
    }

  },
  // 2023年5月19日 打开领取福利弹窗
  openBenefitPop() {
    let event_name = 'click_mbenefits';
    let {
      platform = ''
    } = app.globalData.systemInfo;
    let event_data = {
      "devices": platform
    }
    reportEvent(event_name, event_data)
    // this.setData({
    //   xd_benefit_pop: true
    // })
    // 2023年9月20日 运营部产品要求 不弹窗，直接跳转
    let {
      config
    } = this.data;
    if (config) {
      let that = this;
      var openMiniprogram = wx.navigateToMiniProgram;
      if (wx.canIUse('openEmbeddedMiniProgram') && config.boxCode == 1) {
        openMiniprogram = wx.openEmbeddedMiniProgram;
      }
      openMiniprogram({
        appId: 'wx90c41e1f393af0ff',
        path: config.ad1.url,
        envVersion: 'trial',
        fail: (err) => {
          console.log("openMiniprogram fail:", err)
          this.setData({
            xd_benefit_closed: true,
          })
        },
        success: (res) => {
          console.log("openMiniprogram success:", res)
          this.setData({
            xd_benefit_closed: true,
          })
        }
      })
    }
  },
  closeBenefitPop() {
    this.setData({
      xd_benefit_pop: false,
      xd_benefit_closed: true,
    })
  }
})