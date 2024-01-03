import Scratch from "./utils/scratch.js"
const app = getApp();
const bgMusic = wx.createInnerAudioContext();
const http = require("../../../utils/api");
const utils = require("../../../utils/util");
const auth = require("../../../utils/auth");
const COS_URL = app.globalData.COS_URL;
// 在页面中定义插屏广告
let interstitialAd = null
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
  '/pages/randomdraw/marquee/index',


  // '/pages/randomdraw/scratch-off/scratch', 
]
Page({
  data: {
    COS_URL: COS_URL, //图片资源前缀
    isInit: false, //canvas 初始化状态
    isModelShow: false, //刮刮乐中奖弹窗
    isModelShow2: false,
    task: {}, //当前任务
    task2: null, //其它任务，如果有的话
    //视频广告相关
    videoPop: false,
    videoUrl: '',
    capsule: 'capsule',
    //领取弹窗显示
    totalMoney: 0,
    reconfirmPop:false,
    hongbao: COS_URL + "/public/img/to2/hongbao.png",
    arrow: COS_URL + "/public/img/to2/checkPop/arrow.png",
    btnurl: COS_URL + "/public/img/phaseIII/css_sprites091003.png",
  },
  onLoad: function (options) {
    //初始化刮刮乐 
    this.getCanvasWH().then(res => {
      this.initScratch(res)
    })
    _reward_one = false;
    //初始化任务
    this.initTaskData(options);
    this.initVideoAd();
    //插屏广告
    // if (wx.createInterstitialAd) {
    //   interstitialAd = wx.createInterstitialAd({
    //     // adUnitId: 'adunit-49ac1030e3b37939'  //测试版
    //     adUnitId: 'adunit-e3e3df3be70c9264' //线上版
    //   })
    //   interstitialAd.onLoad(() => {})
    //   interstitialAd.onError((err) => {})
    //   interstitialAd.onClose(() => {})
    // }
    // setTimeout(function(){
    //   interstitialAd.play()
    // },1000)

  },
  //初始化视频广告
  initVideoAd() {
    cosAddress = auth.getCosAddress();
    if (cosAddress&&cosAddress.A8) {
      let videoUrl = cosAddress.A8.value[0].video_hn[1];
      return this.setData({
        videoUrl
      });
    }
    //没取到缓存直接去请求
    utils.getAd().then(data=>{
      cosAddress = data;
      let videoUrl = cosAddress.A8.value[0].video_hn[1];
      this.setData({
        videoUrl
      });
    });
  },
  //弹窗点击领取奖励
  clickCaim() {
    let getRewarded = wx.getStorageSync('getRewarded');
    if(getRewarded){
      getRewarded = JSON.parse(getRewarded);
      var rewardHistory = '';
      var totalMoney = 0;
      for (const key in getRewarded) {
        console.log("循环key：",key,"\n",getRewarded);
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
      this.setData({
        isModelShow: false,
        isModelShow2: true,
        rewardHistory:rewardHistory,
        totalMoney: totalMoney
      })

    }else{
      this.setData({
        isModelShow: false,
      })
    }

  },
  //继续获得--点击更多任务
  moreTask() {
    this.setData({
      videoPop: true,
      isModelShow: false,
      isModelShow2:false,
      reconfirmPop:false,

      // popType: 1
    });
  },
  //初始化任务
  initTaskData(options) {
    taskData = []

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
      console.log("taskData:",taskData);
    }
  },
  //初始化刮刮乐
  initScratch(res) {
    this.scratch = new Scratch(this, {
      canvasWidth: res.width,
      canvasHeight: res.height,
      imageResource: this.data.COS_URL + '/public/img/to2/ggl/mask.jpg',
      // maskColor: "red",
      r: 6,
      // awardTxt: that.data.awardTxt, //中奖提示
      // awardTxtColor: that.data.awardTxtColor,
      // awardTxtFontSize: that.data.awardTxtFontSize,
      callback: () => {
        console.log('执行了')
        //弹窗
        this.getReward()
      }
    })
  },
  //领取奖励
  getReward() {
    if(_reward_one)return;
    _reward_one = true;
    let task = this.data.task;
    var parmas = {
      code: task.qr_code,
      task_id: task.task_id,
      game: '刮刮乐'
    }
    http.post('/api/scan/opentask', parmas).then(res=> {
      if (res.code == 1) {
        let getRewarded = wx.getStorageSync('getRewarded');
        if (!getRewarded) {
          getRewarded = {}
        } else {
          getRewarded = JSON.parse(getRewarded);
        }
        let taskKey = taskData[1].key;
        console.log("taskKey:",taskKey);
        getRewarded[taskKey] = taskData[1];
        getRewarded = JSON.stringify(getRewarded);
        wx.setStorageSync('getRewarded', getRewarded)
        //显示弹窗
        this.setData({
          isModelShow: true
        })
        return
      }
      if(res.code == 0){
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
      //异常情况
      wx.showModal({
        title: '温馨提示',
        content: '请求异常',
        confirmText: '确认重试',
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            this.getReward()
          }
        }
      })
    })
  },
  //跳转游戏页面
  playGame: function (e) {
    //videoEnd :0 视频未完整播放不跳转(弹出观看视频弹窗或不做处理)  1：视频播放完走业务逻辑
    console.log("视频组件页面触发：", e);
    var detail = e.detail;
    //视频播放结束
    if (detail.videoEnd == 1 || detail==0) {

      let parmas = {
        0: taskData[0],
        // 1: taskData[2]
      }
      let key = taskData[2].key;
      parmas[key] = taskData[2];
      console.log("页面传参task：",parmas);
      var task = encodeURIComponent(JSON.stringify(parmas));
      var radomUrl = gamePage[Math.floor((Math.random() * gamePage.length))];
      wx.redirectTo({
        url: radomUrl + "?task=" + task, //跳转携带task
      })
    }
  },
  //获取高宽
  getCanvasWH() {
    return new Promise(function (resolve, reject) {

      wx.createSelectorQuery().selectAll('.xh-scratch-copy').boundingClientRect(function (rect) {
        resolve({
          height: rect[0].height,
          width: rect[0].width
        })
      }).exec()

    })
  },
  goYuer: function (e) {
    //判断用户扫码红包 是否有翻倍任务，有就二次弹窗，没有直接跳转
    var task = this.data.task2;
    var go = e.currentTarget.dataset.go;
    if (go == 1 && task) {
      this.setData({
        reconfirmPop: true,
        isModelShow: false,
        isModelShow2: false,
      });
      return false;
    }
    //检查用户手机号,存在则跳转
    var userdata = wx.getStorageSync('userdata');
    console.log('获取本地userdata:', userdata);
    if (userdata && userdata.mobile) {
      //本地缓存用户信息
      let url = '';
      if(userdata.condition != 2){
        url="/pages/zhongduan/geren/yuer/index"
      }else{
        url="/pages/zhongduan/geren/zhuli/index"
      }
      wx.redirectTo({
        url:url,
      })
      return false
    } else {
      //请求接口获取最新数据
      utils.getUserInfoNew();

    }
  },
})