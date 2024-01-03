// pages/randomdraw/slotmachine/machine.js
import Machine from "./utils/machine.js";
const app = getApp();
const url = app.globalData.COS_URL;
const utils = require("../../../utils/util");
const http = require("../../../utils/api");
const auth = require("../../../utils/auth");
const COS_URL = app.globalData.COS_URL;
const log = require('../../../utils/log.js');
let taskInfo = '';
let _reward_one = false;
import lottie from '../lottie/index';

// 在页面中定义插屏广告
let interstitialAd = null
let cosAddress = auth.getCosAddress();
let countdown = false;
let InnerAudio_one = ''; //背景音乐
let InnerAudio_two = ''; //抽奖音乐
let InnerAudio_three = ''; //中奖音乐

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'箱内码活动',
    //012:翻倍红包；101：额定红包；220：牛京豆
    num1: 0,
    num2: 0,
    num3: 0,
    num4: 0,
    speed: 24,
    //二次确认弹窗
    reconfirmPop: false, //默认false 跳转余额再次确认弹窗
    ikonw: app.globalData.COS_URL + "/public/img/to2/ikonw.png",
    hongbao: app.globalData.COS_URL + "/public/img/to2/hongbao.png",
    arrow: app.globalData.COS_URL + "/public/img/to2/checkPop/arrow.png",
    //开奖弹窗
    rewardPop: false,
    // rewardImg: app.globalData.COS_URL + "/public/img/to2/goldlight1.gif",
    lingquImg: app.globalData.COS_URL + "/public/img/to2/lingqu.png",
    //获奖弹窗
    lotteryPop: false,
    lotteryImg: app.globalData.COS_URL + "/public/img/to2/sahongbao1.gif",
    //游戏名：
    game: "老虎机",
    gamePage: [
      '/pages/randomdraw/rotate/rotate',
      '/pages/randomdraw/goldenEgg/goldenEgg',
      '/pages/randomdraw/marquee/index',

      // '/pages/randomdraw/slotmachine/machine',
    ],
    radomUrl: '', //随机页面地址
    task: '', //任务
    hasTask: 0, //是否有任务
    //自定义视频蒙层
    videoPop: false,
    videoUrl: '',
    capsule: 'capsule',
    lotteryCanvas: true,
    rewardCanvas: true,
    cjImg: app.globalData.COS_URL + "/public/img/to2/tiger/btn.png",
    ggltitle1: app.globalData.COS_URL + "/public/img/to2/ggl/title2.png",
    redBullImg: app.globalData.COS_URL + "/public/img/to2/goldenEgg/redbull.png",
    btnurl: app.globalData.COS_URL + "/public/img/phaseIII/css_sprites091003.png",
    gameOver: true, //true，不显示看视频按钮
    countdownPop: false,
    yuerText: "点击查看余额",
    blockAd: false,
    videoLoadFail: false, //2021年8月12日视频组件加载失败：防止点击红包翻倍按钮没反应，直接跳过视频去做任务
    // 2022年1月21日 改版
    image_load_failed: false, //图片加载失败,默认false
    img_hn_title_27th: COS_URL + "/public/img/bfyl/202201/img_hn_title_27th.png",
    img_hn_machine_bg: COS_URL + "/public/img/bfyl/202201/img_hn_machine_bg.png",
    img_hn_machine_gold: COS_URL + "/public/img/bfyl/202201/img_hn_machine_gold.png",
    img_hn_machine_coin: COS_URL + "/public/img/bfyl/202201/img_hn_machine_coin.png",
    img_hn_alert_reconfirm: COS_URL + '/public/img/bfyl/202201/img_hn_alert_reconfirm.png', //二次确认弹窗背景
    gif_btn_watchvideo: COS_URL + '/public/img/bfyl/202201/gif_btn_watchvideo_mini.gif', //gif看视频翻倍按钮
    icon_btn_video: COS_URL + '/public/img/bfyl/202201/icon_btn_video.png', //看视频红包翻倍翻倍按钮
    pre_act_hn:27,//默认的红牛周年
    img_hn_alert_reconfirm_28y:COS_URL + '/public/img/bfyl/202302/img_hn_alert_reconfirm_28y.png',
    img_hn_title_28y: COS_URL + "/public/img/bfyl/202302/img_hn_title_28y.png",
    img_hn_machine_bg_28y: COS_URL + "/public/img/bfyl/202302/img_hn_machine_bg_28y.png",
    img_hn_machine_coin_28y: COS_URL + "/public/img/bfyl/202302/img_hn_machine_coin_28y.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("machine.js  options:", options);
    _reward_one = false;
    countdown = false;
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        // adUnitId: 'adunit-503571edbeac3de3'  //测试版
        adUnitId: 'adunit-fe2695cf0d1fcedb' //线上版
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }

    // this.initReward();
    // this.initLottery();

    //隐藏返回主页按钮
    if (wx.hideHomeButton) {
      wx.hideHomeButton();
    }
    if(options.pre_act_hn){
      this.setData({
        pre_act_hn:options.pre_act_hn
      })
    }
    taskInfo = '';
    if (options.task) {
      taskInfo = decodeURIComponent(options.task);
      taskInfo = JSON.parse(taskInfo);
      console.log("taskInfo:", taskInfo);
    }
    var task = taskInfo;
    var aprizeName = ''; //奖金倍数
    var methodName = ''; //奖励方式名
    var rewardMsg = ''; //奖励信息
    for (var key in task) {
      console.log("循环：", key);
      if (key == 1) {
        //1为翻倍
        aprizeName = task[1]['user_msg'];
        methodName = task[1]['msg'];
        rewardMsg = aprizeName + '倍';
        this.setData({
          taskKey: key,
          aprizeName: aprizeName,
          methodName: methodName,
          rewardMsg: rewardMsg,
          num1: 0,
          num2: 1,
          num3: 2,
        });
        break;
      }
      if (key == 2) {
        //2为 额外
        aprizeName = task[2]['money'];
        methodName = task[2]['msg'];
        rewardMsg = parseInt(aprizeName) + '元';
        this.setData({
          taskKey: key,
          aprizeName: aprizeName,
          methodName: methodName,
          rewardMsg: rewardMsg,
          num1: 1,
          num2: 0,
          num3: 1,
        });
        break;

      }
    }
    var radomUrl = this.data.gamePage[Math.floor((Math.random() * this.data.gamePage.length))];
    this.setData({
      radomUrl: radomUrl
    });
    console.log("随机跳转页面：", radomUrl);
    if (cosAddress&&cosAddress.A8) {
      let videoUrl = cosAddress.A8.value[0].video_hn[1];
      this.setData({
        videoUrl
      });
    } else {
      utils.getAd().then(data=>{
        cosAddress = data;
        let videoUrl = cosAddress.A8.value[0].video_hn[1];
        this.setData({
          videoUrl
        });
      });
      
    }
    InnerAudio_one = utils.InnerAudio({
      url: COS_URL + "/public/img/to2/tiger/bg.mp3",
      loop: true
    });
    InnerAudio_two = utils.InnerAudio({
      url: COS_URL + "/public/img/to2/tiger/kj1.mp3"
    });
    InnerAudio_three = utils.InnerAudio({
      url: COS_URL + "/public/img/to2/rotate/zj.mp3"
    });
  },
  onStart() {
    InnerAudio_one.stop();
    InnerAudio_two.play();
    this.machine.start();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    //循环播放
    InnerAudio_one.play();
    let navBarSystem = app.globalData.navBarSystem && JSON.parse(app.globalData.navBarSystem);
    if (navBarSystem) {
      this.setData({
        navBarSystem
      })
    }
    // this.initLottery();
    var task = taskInfo;
    this.machine = new Machine(this, {
      height: 100, //单个数字高度
      len: 10,
      fanbeiimg: url + '/public/img/to2/fanbeihb.png',
      jindouimg: url + '/public/img/to2/tiger/ewai.png',
      // jindouimg: url + '/public/img/to2/niujindou.png',
      ewaiimg: url + '/public/img/to2/tiger/ewai.png',
      transY1: 0,
      num1: that.data.num1,
      transY2: 0,
      num2: that.data.num2,
      transY3: 0,
      num3: that.data.num3,
      transY4: 0,
      num4: that.data.num4,
      speed: that.data.speed,
      callback: () => {
        console.log("回调了·····");
        InnerAudio_two.stop();
        //请求回调 加任务奖励
        that.getReward();
        that.setData({
          rewardPop: true
        })
        return false;

      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      screenHeight: app.globalData.systemInfo.safeArea.height - app.globalData.systemInfo.safeArea.top,
      screenWidth: app.globalData.systemInfo.windowWidth,
      windowHeight: app.globalData.systemInfo.windowHeight,
      blockAd: utils.blockAd()
    });
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


  //领取奖励：请求任务接口
  getReward: function () {
    if (_reward_one) return
    _reward_one = true;
    wx.showLoading({
      title: '正在加载',
    })

    var that = this;
    //看完视频，游戏结束请求接口
    var game = this.data.game;
    var taskKey = this.data.taskKey;
    var task = taskInfo;
    console.log("getReward taskKey :", taskKey);
    console.log("领取奖励获取 task :", task);
    log.addFilterMsg("task");
    log.info("machine.js task:", task)
    log.info("machine.js taskKey:", taskKey)
    var code = task[taskKey]['qr_code'];
    var task_id = task[taskKey]['task_id'];

    var data = {
      code: code,
      task_id: task_id,
      game: game,
    }
    console.log("请求参数:", data);
    http.post('/api/scan/opentask', data).then(res => {
      InnerAudio_two.stop();
      if (res.code == 1) {
        var task = taskInfo;
        var taskKey = that.data.taskKey;
        var getRewarded = wx.getStorageSync('getRewarded');
        if (!getRewarded) {
          getRewarded = {};
        } else {
          getRewarded = JSON.parse(getRewarded);
        }
        // getRewarded[0] = task[0];
        getRewarded[taskKey] = task[taskKey];
        wx.setStorageSync('getRewarded', JSON.stringify(getRewarded));
        console.log("删除qian的任务：", task);
        delete task[taskKey];
        console.log("删除后的任务：", task);
        that.setData({
          task: task
        });
        if (Object.keys(task).length > 1) {
          that.setData({
            gameOver: false,
          });
        } else {
          that.setData({
            gameOver: true,
          });


        }
        var totalMoney = 0;
        var rewardHistory = '';

        for (const key in getRewarded) {
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

        console.log("数据处理：", rewardHistory, "\n", totalMoney);

        that.initReward();
        that.countdown();
        //接口返回成功：
        that.setData({
          getReward: getRewarded,
          rewardHistory: rewardHistory,
          totalMoney: totalMoney,
          task: task
        });

      }
      if (res.code == 0) {

        _reward_one = false;
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false
        })
        that.setData({
          rewardPop: false,
        });
        that.machine.reset();
        return false;
      }
    }).catch(err => {
      that.setData({
        rewardPop: false,
        lotteryPop: false,
      });
      _reward_one = false;
      that.machine.reset();
      if (err && err.errMsg == "request:fail timeout") {
        wx.showModal({
          title: '温馨提示',
          content: "网络超时，请再次尝试",
          showCancel: false
        })
      }
      return
    });
  },
  //观看视频
  watchAd: function (e) {
    log.addFilterMsg("tapWatchAd");
    log.info("tap watchAd：", this.data.videoLoadFail);
    if (this.data.videoLoadFail) {
      return this.skipVideoPlayGame();
    }
    //1:二次确认弹窗；2:累计获奖弹窗
    var pop = e.currentTarget.dataset.pop;
    console.log("pop：", pop);
    if (pop == 1) {
      this.setData({
        videoPop: true,
        reconfirmPop: false,
        popType: 1
      });
      return;
    }
    if (pop == 2) {
      this.setData({
        videoPop: true,
        lotteryPop: false,
        countdownPop: false,
        rewardPop: false,
        popType: 2
      });
      return;
    }

  },
  //跳转yuer页面
  goYuer: function (e) {
    //判断用户扫码红包 是否有翻倍任务，有就二次弹窗，没有直接跳转
    var task = taskInfo;
    var go = e.currentTarget.dataset.go;
    console.log("go:", go);
    console.log("task.length:", Object.keys(task).length);
    if (go == 1 && Object.keys(task).length > 1) {
      this.setData({
        reconfirmPop: true,
        rewardPop: false,
        lotteryPop: false,
      });
      return false;
    }
    //检查用户手机号,存在则跳转
    var userdata = wx.getStorageSync('userdata');
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
      //视频未播放完关闭情况,判断 popType 是哪一个窗口
      if (this.data.popType == 1) {
        this.setData({
          reconfirmPop: true
        });
      }
      if (this.data.popType == 2) {
        this.setData({
          lotteryPop: true
        });
      }
      return
    }
    if (detail.videoEnd == 1) {
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
    var radomUrl = this.data.radomUrl;
    //随机跳转到任意游戏页面
    var task = encodeURIComponent(JSON.stringify(taskInfo));
    wx.redirectTo({
      url: radomUrl + "?task=" + task, //跳转携带task
    })

  },
  //视频组件加载失败，跳过视频直接去做任务 2021年8月12日
  skipVideoPlayGame() {
    this.setData({
      videoLoadFail: false
    })
    var radomUrl = this.data.radomUrl;
    //随机跳转到任意游戏页面
    var task = encodeURIComponent(JSON.stringify(taskInfo));
    wx.redirectTo({
      url: radomUrl + "?task=" + task, //跳转携带task
    })
  },
  //关闭弹窗:关闭领取奖励弹窗，打开
  closePop: function () {
    if (this.data.totalMoney) {
      this.setData({
        rewardPop: false,
        lotteryPop: true
      });
      countdown = false;
      this.initLottery();
      this.countdown();
    }
  },
  // 自定义导航栏 返回监听
  onBeforeBack: function () {
    if (this.data.videoEnd == 1) {
      //随机跳转到任意游戏页面
      var radomUrl = this.data.radomUrl;
      var task = encodeURIComponent(JSON.stringify(taskInfo));
      wx.redirectTo({
        url: radomUrl + "?task=" + task, //跳转携带task
      })
      return;
    }
    //判断用户扫码红包 是否有翻倍任务，有就二次弹窗，没有直接跳转
    var task = taskInfo;
    // return;
    if (Object.keys(task).length > 1) {
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
  initLottery: function () {
    var that = this;
    //播放领奖音乐
    InnerAudio_two.stop()
    InnerAudio_three.play();
    var pixelRatio = app.globalData.systemInfo.pixelRatio;
    var screenWidth = app.globalData.systemInfo.windowWidth;
    var screenHeight = screenWidth * 1.8;
    // var screenWidth = app.globalData.systemInfo.windowWidth * pixelRatio ;
    // var screenHeight = app.globalData.systemInfo.windowHeight * pixelRatio;
    this.setData({
      systemHeight: screenHeight,
      systemWidth: screenWidth,
    });
    if (this._inited) {
      return
    }

    wx.createSelectorQuery().selectAll('#lottery').node(res => {
      const canvas = res[0].node;
      console.log(" node  res[0]:", res);
      const context = canvas.getContext('2d')

      canvas.width = screenWidth;
      canvas.height = screenHeight;
      console.log("画布的宽度：", canvas.width);
      console.log("画布的高度：", canvas.height);
      console.log("设备高度：", app.globalData.systemInfo.windowHeight);
      // canvas.height =700;
      lottie.setup(canvas);
      this.ani = lottie.loadAnimation({
        loop: 0,
        autoplay: true,
        // path: COS_URL + '/public/img/lottie/cs3/',
        path: COS_URL + '/public/img/lottie/caishen1/',
        // path: 'http://192.168.1.193/lottie/zjd/',
        rendererSettings: {
          context,
        },
      })
      this.ani.addEventListener('complete', function (res) {
        console.log("动画加载结束·····：", res);

      });
      this.ani.addEventListener('enterFrame', function (res) {
        if (res.currentTime > 90) {
          countdown = true;
          clearTimeout(that.timer);
          that.ani.pause();

          let data = '';
          var canIUse = wx.canIUse('Canvas.toDataURL');
          if (canIUse) {
            data = canvas.toDataURL();
            that.setData({
              lotteryImg: data
            });
            setTimeout(function () {
              that.setData({
                lotteryCanvas: false
              });
              //关闭音频效果
              InnerAudio_three.stop();
            }, 100);
          } else {
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: screenWidth,
              height: screenHeight,
              canvas: canvas,
              success: function (res) {
                data = res.tempFilePath;
                console.log("initLottery canvasToTempFilePath:", data);
                that.setData({
                  lotteryImg: data,
                  lotteryCanvas: false
                });

                //关闭音频效果
                InnerAudio_three.stop();
                //记录实时日志
                log.addFilterMsg("machine");
                log.info("machine.js initLottery toDataURL兼容:", data);
              },
              fail: function (error) {
                //记录实时日志
                log.addFilterMsg("machine");
                log.info("machine.js initLottery canvasToTempFilePath fail:", JSON.stringify(error));
                console.log(`canvasToTempFilePath failed, ${JSON.stringify(error)}`);
                that.setData({
                  lotteryImg: "https://file.y1b.cn/public/img/to2/randomdraw/0919/lhj_lottery.png",
                  lotteryCanvas: false
                });
                //关闭音频效果
                InnerAudio_three.stop();
              },
            }, this);

          }

          if (Object.keys(taskInfo).length <= 1) {
            // 在适合的场景显示插屏广告
            if (interstitialAd && that.data.blockAd) {
              interstitialAd.show().catch((err) => {
                console.error(err)
              })
            }
          }

        }
      });
      // this._inited = true
    }).exec()
  },
  initReward: function () {
    var that = this;
    var pixelRatio = app.globalData.systemInfo.pixelRatio;
    var screenWidth = app.globalData.systemInfo.windowWidth;
    var screenHeight = screenWidth * 1.8;
    // var screenWidth = app.globalData.systemInfo.windowWidth * pixelRatio ;
    // var screenHeight = app.globalData.systemInfo.windowHeight * pixelRatio;
    this.setData({
      systemHeight: screenHeight,
      systemWidth: screenWidth,
    });
    if (this._inited) {
      return
    }

    wx.createSelectorQuery().selectAll('#reward').node(res => {
      const canvas = res[0].node;
      const context = canvas.getContext('2d')
      console.log("reward```````");
      canvas.width = screenWidth;
      canvas.height = screenHeight;
      console.log("画布的宽度：", canvas.width);
      console.log("画布的高度：", canvas.height);
      console.log("设备高度：", app.globalData.systemInfo.windowHeight);
      // canvas.height =700;
      lottie.setup(canvas);
      this.ani = lottie.loadAnimation({
        loop: 0,
        autoplay: true,
        path: COS_URL + '/public/img/lottie/jg/',
        // path: COS_URL + '/public/img/lottie/cs3/',
        rendererSettings: {
          context,
        },
      })
      this.ani.addEventListener('complete', function (res) {
        console.log("动画加载结束·····：", res);

      });

      this.ani.addEventListener('enterFrame', function (res) {
        wx.hideLoading({
          success: (res) => {},
        })

        // console.log("动画加载结束·····：", res);
        if (res.currentTime > 35) {
          countdown = true;
          clearTimeout(that.timer);
          that.ani.pause();
          let data = '';
          var canIUse = wx.canIUse('Canvas.toDataURL');
          if (canIUse) {
            data = canvas.toDataURL();
            that.setData({
              rewardImg: data
            });
            setTimeout(function () {
              that.setData({
                rewardCanvas: false
              });

            }, 100);
          } else {
            // setTimeout(() => {
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: screenWidth,
              height: screenHeight,
              canvas: canvas,
              success: function (res) {
                data = res.tempFilePath;
                that.setData({
                  rewardImg: data,
                  rewardCanvas: false
                });

                //记录实时日志
                log.addFilterMsg("machine");
                log.info("machine.js initReward toDataURL兼容:", data);
              },
              fail: function (error) {
                //记录实时日志
                log.addFilterMsg("machine");
                log.info("machine.js initReward canvasToTempFilePath fail:", JSON.stringify(error));
                console.log(`canvasToTempFilePath failed, ${JSON.stringify(error)}`);
                that.setData({
                  rewardImg: "https://file.y1b.cn/public/img/to2/randomdraw/0919/lhj_reward.png",
                  rewardCanvas: false
                });
              },
            }, this);
            // }, 300);

          }

        }
      });

      // this._inited = true
    }).exec()
  },
  countdown: function () {
    let that = this;
    that.timer = setTimeout(() => {
      if (!countdown) {
        that.setData({
          rewardCanvas: false,
          lotteryCanvas: false,
          rewardPop: false,
          countdownPop: true,
          lotteryImg: "https://file.y1b.cn/public/img/to2/randomdraw/0919/lhj_lottery.png",
        });
        return
      }
    }, 5000);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("老虎机页面隐藏");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    InnerAudio_one.destroy();
    InnerAudio_two.destroy();
    InnerAudio_three.destroy();
    clearTimeout(this.timer);
    console.log("老虎机页面卸载······");
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