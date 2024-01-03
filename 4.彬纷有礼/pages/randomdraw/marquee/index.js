// pages/randomdraw/marquee/index.js
import Marquee from "./utils/marquee.js";
const app = getApp();
const COS = app.globalData.COS_URL;
const http = require("../../../utils/api");
const utils = require("../../../utils/util");
const auth = require("../../../utils/auth");
const log = require('../../../utils/log.js');
//所有任务
let taskData;
//视频广告
let cosAddress = null;
let _reward_one = false;
//游戏类型
let gamePage = [
  '/pages/randomdraw/slotmachine/machine',
  '/pages/randomdraw/rotate/rotate',
  '/pages/randomdraw/goldenEgg/goldenEgg',

  // '/pages/randomdraw/marquee/index',
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'箱内码活动',
    speed: 100,
    ret: 1, //取值1～8 或者其他大于0的数字，取模之后的值 (ret%8)
    zghnImg: COS + "/public/img/RedBull26Years/20201231/redBull26years.png",
    rewardPop: false,
    btnurl: COS + "/public/img/phaseIII/css_sprites091003.png",
    gameOver: false,
    task: {}, //当前任务
    task2: null, //其它任务，如果有的话
    //视频广告相关
    videoPop: false,
    videoUrl: '',
    //领取弹窗显示
    totalMoney: 0,
    reconfirmPop: false,//默认false
    hongbao: COS + "/public/img/to2/hongbao.png",
    arrow: COS + "/public/img/to2/checkPop/arrow.png",
    btnurl: COS + "/public/img/phaseIII/css_sprites091003.png",
    yuerText: '点击查看余额',
    videoLoadFail: false, //2021年8月12日视频组件加载失败：防止点击红包翻倍按钮没反应，直接跳过视频去做任务
    // 2022年1月21日 27周年改版
    image_load_failed: false, //图片加载失败,默认false
    img_hn_title_27th: COS + "/public/img/bfyl/202201/img_hn_title_27th.png",
    img_hn_marquee_bg: COS + "/public/img/bfyl/202201/img_hn_marquee_bg.png",
    img_hn_marquee_card: COS + "/public/img/bfyl/202201/img_hn_marquee_card.png",
    img_hn_alert_reconfirm: COS + '/public/img/bfyl/202201/img_hn_alert_reconfirm.png', //二次确认弹窗背景
    gif_btn_watchvideo: COS + '/public/img/bfyl/202201/gif_btn_watchvideo_mini.gif', //gif看视频翻倍按钮
    icon_btn_video: COS + '/public/img/bfyl/202201/icon_btn_video.png', //看视频红包翻倍翻倍按钮
    pre_act_hn:27,//默认的红牛周年
    img_hn_alert_reconfirm_28y:COS + '/public/img/bfyl/202302/img_hn_alert_reconfirm_28y.png',
    img_hn_title_28y: COS + "/public/img/bfyl/202302/img_hn_title_28y.png",
    img_hn_marquee_bg_28y:COS + '/public/img/bfyl/202302/img_hn_marquee_bg_28y.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let ret = Math.floor((Math.random() * 9));
    this.setData({
      ret
    })
    _reward_one = false;
    //初始化任务
    this.initTaskData(options);
    this.initVideoAd();
    //  console.log(id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    let navBarSystem = app.globalData.navBarSystem && JSON.parse(app.globalData.navBarSystem);
    if (navBarSystem) {
      this.setData({
        navBarSystem
      })
    }
    this.marquee = new Marquee(this, {
      ret: that.data.ret,
      speed: that.data.speed,
      len: 9,
      callback: () => {
        console.log("收到了回调");
        let ret = Math.floor((Math.random() * 7 + 1));
        that.setData({
          ret,
        })
        that.getReward();
      }
    })
  },
  //初始化视频广告
  initVideoAd() {
    cosAddress = auth.getCosAddress();
    if (cosAddress&&cosAddress.A8) {
      let videoUrl = cosAddress.A8.value[0].video_hn[1];
      console.log("videoUrl1:", videoUrl);
      return this.setData({
        videoUrl
      });
    } else {
      //没取到缓存直接去请求
      utils.getAd().then(data=>{
        cosAddress = data;
        let videoUrl = cosAddress.A8.value[0].video_hn[1];
        this.setData({
          videoUrl
        });
      });
      
    }

  },
  //初始化任务
  initTaskData(options) {
    taskData = []
    if(options.pre_act_hn){
      this.setData({
        pre_act_hn:options.pre_act_hn
      })
    }
    if (options.task) {
      let result = decodeURIComponent(options.task);
      result = JSON.parse(result);
      //转化为数组
      taskData = Object.keys(result).map(key => {
        let o = {
          ...result[key],
          key
        }
        if (key == 1) {
          o.title = o['msg']
          o.messge = o['user_msg'] + '倍'
        } else if (key == 2) {
          o.title = o['msg']
          o.messge = o['money'] + '元'
        }
        return o
      })
      //存储当前任务
      this.setData({
        task: taskData[1],
        task2: taskData[2]
      })
    }
  },
  //跳转游戏页面
  playGame: function (e) {
    //videoEnd :0 视频未完整播放不跳转(弹出观看视频弹窗或不做处理)  1：视频播放完走业务逻辑
    console.log("视频组件页面触发：", e);
    var detail = e.detail;
    if (detail.videoLoadFail) {
      this.setData({
        videoLoadFail: true
      })
      return
    }
    //视频播放结束
    if (detail.videoEnd == 1 || detail == 0) {

      let parmas = {
        0: taskData[0],
        // 1: taskData[2]
      }
      let key = taskData[2].key;
      parmas[key] = taskData[2];
      console.log("页面传参task：", parmas);
      var task = encodeURIComponent(JSON.stringify(parmas));
      var radomUrl = gamePage[Math.floor((Math.random() * gamePage.length))];
      console.log("radomUrl:", radomUrl);
      wx.redirectTo({
        url: radomUrl + "?task=" + task, //跳转携带taskId
      })
    }
  },
  //视频组件加载失败，跳过视频直接去做任务 2021年8月12日
  skipVideoPlayGame() {
    this.setData({
      videoLoadFail: false
    })
    //随机跳转到任意游戏页面
    let parmas = {
      0: taskData[0],
    }
    let key = taskData[2].key;
    parmas[key] = taskData[2];
    console.log("页面传参task：", parmas);
    var task = encodeURIComponent(JSON.stringify(parmas));
    var radomUrl = gamePage[Math.floor((Math.random() * gamePage.length))];
    wx.redirectTo({
      url: radomUrl + "?task=" + task, //跳转携带taskId
    })
  },
  goYuer: function (e) {
    //判断用户扫码红包 是否有翻倍任务，有就二次弹窗，没有直接跳转
    var task = this.data.task2;
    var go = e.currentTarget.dataset.go;
    if (go == 1 && task) {
      this.setData({
        reconfirmPop: true,
        rewardPop: false,
      });
      return false;
    }
    //检查用户手机号,存在则跳转
    var userdata = wx.getStorageSync('userdata');
    console.log('获取本地userdata:', userdata);
    if (userdata && userdata.mobile) {
      //本地缓存用户信息
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
  //观看视频
  watchAd: function (e) {
    log.addFilterMsg("tapWatchAd");
    log.info("tap watchAd：", this.data.videoLoadFail);
    if (this.data.videoLoadFail) {
      return this.skipVideoPlayGame();
    }
    this.setData({
      videoPop: true,
      rewardPop: false,
      reconfirmPop: false
    });

  },
  //领取奖励
  getReward() {
    console.log("getReward _reward_one:", _reward_one);
    if (_reward_one) return;
    _reward_one = true;
    let task = this.data.task;
    var parmas = {
      code: task.qr_code,
      task_id: task.task_id,
      game: '九宫格'
    }
    if (!parmas.code || !parmas.task_id) return
    console.log("getReward 参数：", parmas);
    http.post('/api/scan/opentask', parmas).then(res => {
      //记录实时日志
      log.addFilterMsg("marquee");
      log.info("marquee.js  getReward 请求返回:", JSON.stringify(res));
      if (res.code == 1) {

        let getRewarded = wx.getStorageSync('getRewarded');
        if (!getRewarded) {
          getRewarded = {}
        } else {
          getRewarded = JSON.parse(getRewarded);
        }
        let taskKey = taskData[1].key;
        getRewarded[taskKey] = taskData[1];
        // getRewarded = JSON.stringify(getRewarded);
        wx.setStorageSync('getRewarded', JSON.stringify(getRewarded))
        let rewardHistory = '';
        let totalMoney = 0;
        console.log("marquee getRewarded:", getRewarded);
        for (const key in getRewarded) {
          console.log("循环key：", key, "\n", getRewarded);
          if (getRewarded.hasOwnProperty(key)) {
            totalMoney += Number(getRewarded[key]['money']);
            if (key == 1) {
              rewardHistory += getRewarded[key]['msg'] + '····' + parseInt(getRewarded[0]['money']) + '元x' + getRewarded[key]['user_msg'] + '\n';
            }
            if (key == 2) {
              rewardHistory += getRewarded[key]['msg'] + '····+' + getRewarded[key]['user_msg'] + '元';
            }

          }
        }
        //显示弹窗
        this.setData({
          rewardPop: true,
          totalMoney,
          rewardHistory
        })



        return
      }
      if (res.code == 0) {
        _reward_one = false;
        //异常情况
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false
        })
      }
    }).catch(err => {
      _reward_one = false;
      wx.hideLoading({
        success: (res) => {},
      })
      if (err && err.errMsg == "request:fail timeout") {
        wx.showModal({
          title: '温馨提示',
          content: "网络超时，请再次尝试",
          showCancel: false
        })
      }
      //异常情况
      // wx.showModal({
      //   title: '温馨提示',
      //   content: '请求异常',
      //   confirmText: '确认重试',
      //   showCancel: false,
      //   success: (res) => {
      //     if (res.confirm) {
      //       this.getReward()
      //     }
      //   }
      // })
    })
  },
  startPlay: function () {
    
    this.marquee.start();
  },
  // 自定义导航栏 返回监听
  onBeforeBack: function () {

    //判断用户扫码红包 是否有翻倍任务，有就二次弹窗，没有直接跳转
    var task = this.data.task2;
    // return;
    if (task) {
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
    wx.setStorageSync('showBackModal', false);
    wx.navigateBack({
      complete: (res) => {},
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userdata = wx.getStorageSync('userdata');
    if (userdata && userdata.condition == 2) {
      this.setData({
        yuerText: "点击查看助力"
      })
    } else {
      this.setData({
        yuerText: "点击查看余额"
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
  imgError: function (error) {
    //网络图片加载失败默认显示普通文本按钮
    this.setData({
      image_load_failed: true
    })
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})