// pages/randomdraw/goldenEgg/goldenEgg.js
const app = getApp();
const utils = require("../../../utils/util");
const http = require("../../../utils/api");
const auth = require("../../../utils/auth");
const COS_URL = app.globalData.COS_URL;
const log = require('../../../utils/log.js');
let taskInfo = '';
let _reward_one = false;
let countdown = false;
let InnerAudio_bg = ''; //背景音效
let InnerAudio_zd = ''; //砸蛋音效
let InnerAudio_zj = ''; //中奖音效
import lottie from '../lottie/index';

// 在页面中定义插屏广告
let interstitialAd = null
let cosAddress = auth.getCosAddress();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // lotteryAnIndex: -1,
    title: '箱内码活动',
    lotteryAnIndex: 0,
    smash: false,
    url: COS_URL,
    redBullImg: COS_URL + "/public/img/to2/goldenEgg/redbull.png",
    egg_title: COS_URL + "/public/img/to2/goldenEgg/title.png",
    begin: COS_URL + "/public/img/to2/begin.png",
    eggs: COS_URL + "/public/img/RedBull26Years/20201231/egg.png",
    gglfoot: COS_URL + "/public/img/to2/gglfoot.png",
    lotteryAn: ["/public/img/to2/am/am1.png", "/public/img/to2/am/am2.png", "/public/img/to2/am/am3.png", "/public/img/to2/am/am4.png", "/public/img/to2/am/am5.png", "/public/img/to2/am/am6.png", "/public/img/to2/am/am7.png", "/public/img/to2/am/am8.png", "/public/img/to2/am/am9.png", "/public/img/to2/am/am10.png", "/public/img/to2/am/am11.png", "/public/img/to2/am/am12.png", "/public/img/to2/am/am13.png", "/public/img/to2/am/am14.png", "/public/img/to2/am/am15.png", "/public/img/to2/am/am16.png", "/public/img/to2/am/am17.png", "/public/img/to2/am/am17.png", "/public/img/to2/am/am17.png", "/public/img/to2/am/am17.png", "/public/img/to2/am/am17.png"],
    //二次确认弹窗
    reconfirmPop: false, //默认false 跳转余额再次确认弹窗
    confimImg: COS_URL + "/public/img/to2/checkPop/bg.png", //再次确认弹窗背景
    huodongrule: COS_URL + "/public/img/to2/huodongrule.png", //红包规则图片
    ikonw: COS_URL + "/public/img/to2/ikonw.png",
    //开奖弹窗
    rewardPop: false,
    // rewardImg: app.globalData.COS_URL + "/public/img/to2/caishen011.gif",
    lingquImg: COS_URL + "/public/img/to2/lingqu.png",
    zajindan1: COS_URL + "/public/img/to2/zajindan1.gif",
    //获奖弹窗
    lotteryPop: false,
    // lotteryImg: app.globalData.COS_URL + "/public/img/to2/caishen011.gif",
    //游戏名：
    game: "砸金蛋",
    gameOver: true, //true，不显示看视频按钮
    gamePage: [
      '/pages/randomdraw/slotmachine/machine',
      '/pages/randomdraw/rotate/rotate',
      '/pages/randomdraw/marquee/index',

      // '/pages/randomdraw/goldenEgg/goldenEgg',
    ],
    radomUrl: '', //随机页面地址,
    //自定义视频蒙层
    videoPop: false,
    capsule: 'capsule',
    popType: 0, //弹窗类型：1，再次确认-reconfirmPop；2，完成任务弹窗-lotteryPop
    videoUrl: "https://file.y1b.cn/file/videos/m3u8/zm.m3u8",
    lotteryCanvas: true,
    rewardCanvas: true,
    btnurl: COS_URL + "/public/img/phaseIII/css_sprites091003.png",
    countdownPop: false,
    yuerText: '点击查看余额',
    blockAd: false,
    videoLoadFail: false, //2021年8月12日视频组件加载失败：防止点击红包翻倍按钮没反应，直接跳过视频去做任务
    // 2022年1月21日 改版
    image_load_failed: false, //图片加载失败,默认false
    img_hn_title_27th: COS_URL + "/public/img/bfyl/202201/img_hn_title_27th.png",
    img_hn_goldegg_bg: COS_URL + "/public/img/bfyl/202201/img_hn_goldegg_bg.png",
    img_hn_goldegg_title: COS_URL + "/public/img/bfyl/202201/img_hn_goldegg_title.png",
    img_hn_goldegg_banner: COS_URL + "/public/img/bfyl/202201/img_hn_goldegg_banner.png",
    img_hn_alert_reconfirm: COS_URL + '/public/img/bfyl/202201/img_hn_alert_reconfirm.png', //二次确认弹窗背景
    gif_btn_watchvideo: COS_URL + '/public/img/bfyl/202201/gif_btn_watchvideo_mini.gif', //gif看视频翻倍按钮
    icon_btn_video: COS_URL + '/public/img/bfyl/202201/icon_btn_video.png', //看视频红包翻倍翻倍按钮
    pre_act_hn:27,//默认的红牛周年
    lottie_zjd_path:COS_URL + '/public/img/lottie/zjd/',
    img_hn_title_28y: COS_URL + "/public/img/bfyl/202302/img_hn_title_28y.png",
    img_hn_goldegg_bg_28y: COS_URL + "/public/img/bfyl/202302/img_hn_goldegg_bg_28y.png",
    img_hn_goldegg_banner_28y: COS_URL + "/public/img/bfyl/202302/img_hn_goldegg_banner_28y.png",
    img_hn_alert_reconfirm_28y:COS_URL + '/public/img/bfyl/202302/img_hn_alert_reconfirm_28y.png',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //重置
    _reward_one = false;
    countdown = false;
    console.log("goldenEgg.js  options:", options);
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        // adUnitId: 'adunit-a14cfb5d73153254'  测试版
        adUnitId: 'adunit-28fdbdb2e8ecd360' //线上版
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }


    //获取页面参数：task
    taskInfo = '';
    if (options.task) {
      taskInfo = decodeURIComponent(options.task);
      console.log("taskInfo:", taskInfo);
      taskInfo = JSON.parse(taskInfo);
      console.log("taskInfo:", taskInfo);
    }
    if(options.pre_act_hn){
      this.setData({
        pre_act_hn:options.pre_act_hn
      })
    }
    // var task = this.data.task;
    var task = taskInfo;
    var taskLength = Object.keys(task).length;
    var aprizeName = '';
    var methodName = '';
    var rewardMsg = ''; //奖励信息
    for (var key in task) {
      console.log("循环：", key);
      if (key == 1) {
        aprizeName = task[1]['user_msg'];
        methodName = task[1]['msg'];
        // rewardMsg = aprizeName + '倍';
        rewardMsg = aprizeName + '倍';
        this.setData({
          taskKey: key,
          aprizeName: aprizeName,
          methodName: methodName,
          rewardMsg: rewardMsg,
        });
        break;
      }
      if (key == 2) {
        aprizeName = task[2]['money'];
        methodName = task[2]['msg'];
        rewardMsg = parseInt(aprizeName) + '元';
        this.setData({
          taskKey: key,
          aprizeName: aprizeName,
          methodName: methodName,
          rewardMsg: rewardMsg,
        });
        break;

      }
    }
    var radomUrl = this.data.gamePage[Math.floor((Math.random() * this.data.gamePage.length))];
    this.setData({
      radomUrl: radomUrl
    });

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
    InnerAudio_bg = utils.InnerAudio({
      url: COS_URL + "/public/img/to2/goldenEgg/bj.mp3",
      loop: true
    })
    InnerAudio_zd = utils.InnerAudio({
      url: COS_URL + "/public/img/to2/goldenEgg/kj.mp3"
    })
    InnerAudio_zj = utils.InnerAudio({
      url: COS_URL + "/public/img/to2/goldenEgg/zj.mp3"
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    InnerAudio_bg.play();
    let navBarSystem = app.globalData.navBarSystem && JSON.parse(app.globalData.navBarSystem);
    if (navBarSystem) {
      this.setData({
        navBarSystem
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      screenHeight: app.globalData.systemInfo.safeArea.height - app.globalData.systemInfo.safeArea.top,
      screenWidth: app.globalData.systemInfo.windowWidth,
      windowHieght: app.globalData.systemInfo.windowHeight,
      blockAd: utils.blockAd()
    });
    var userdata = wx.getStorageSync('userdata');
    if (userdata && userdata.condition == 2) {
      this.setData({
        yuerText: '点击查看助力'
      })
    } else {
      this.setData({
        yuerText: "点击查看余额"
      })
    }
  },
  initLottery: function () {
    var that = this;
    //播放领奖音乐
    InnerAudio_zj.play();

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
      const context = canvas.getContext('2d')
      canvas.width = screenWidth;
      canvas.height = screenHeight;
      lottie.setup(canvas);
      this.ani = lottie.loadAnimation({
        loop: 0,
        autoplay: true,
        path: COS_URL + '/public/img/lottie/shb/',
        // path: COS_URL + '/public/img/lottie/zjd/',
        rendererSettings: {
          context,
        },
      })

      this.ani.addEventListener('complete', function (res) {
        // console.log("动画加载结束·····：", res);
        countdown = true;
        clearTimeout(that.timer);
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
            InnerAudio_zj.stop();
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
              that.setData({
                lotteryImg: data,
                lotteryCanvas: false
              });

              //关闭音频效果
              InnerAudio_zj.stop()

              //记录实时日志
              log.addFilterMsg("goldenEgg");
              log.info("goldenEgg.js initLottery toDataURL兼容:", data);
            },
            fail: function (error) {
              //记录实时日志
              log.addFilterMsg("goldenEgg");
              log.info("goldenEgg.js initLottery canvasToTempFilePath failed:", JSON.stringify(error));
              console.log(`canvasToTempFilePath failed, ${JSON.stringify(error)}`);
              that.setData({
                lotteryImg: COS_URL+ "/public/img/to2/randomdraw/0919/zjd_lottery.png",
                lotteryCanvas: false
              });
              //关闭音频效果
              InnerAudio_zj.stop()

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
      });


    }).exec()
  },
  initReward: function () {

    InnerAudio_zd.play();
    var that = this;
    var pixelRatio = app.globalData.systemInfo.pixelRatio;
    var screenWidth = app.globalData.systemInfo.windowWidth;
    var screenHeight = screenWidth * 1.8;
    this.setData({
      pixelHeight: screenHeight,
      pixelWidth: screenWidth,
      systemHeight: screenHeight,
      systemWidth: screenWidth,
    });
    //根据不同红牛周年类型显示对应的 动画
    let {pre_act_hn,lottie_zjd_path} = this.data;
    lottie_zjd_path = lottie_zjd_path + pre_act_hn+'/';
    wx.createSelectorQuery().selectAll('#reward').node(res => {
      const canvas = res[0].node;
      const context = canvas.getContext('2d')
      console.log("initReward```````");
      canvas.width = screenWidth;
      canvas.height = screenHeight;

      // canvas.height =700;
      lottie.setup(canvas);
      this.ani = lottie.loadAnimation({
        loop: 0,
        autoplay: true,
        // path: COS_URL + '/public/img/lottie/zjd20220121/',
        path: lottie_zjd_path,
        rendererSettings: {
          context,
        },
      })


      this.ani.addEventListener('enterFrame', function (res) {
        wx.hideLoading({
          success: (res) => {},
        })

        //砸金蛋效果currentTime >37
        if (res.currentTime > 47) {
          that.ani.pause();
          countdown = true;
          clearTimeout(that.timer);
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
              //关闭音频效果
              InnerAudio_zd.stop();

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
                that.setData({
                  rewardImg: data,
                  rewardCanvas: false
                });

                //关闭音频效果
                InnerAudio_zd.stop()

                //记录实时日志
                log.addFilterMsg("goldenEgg");
                log.info("goldenEgg.js initReward toDataURL兼容:", data);
                console.log(`canvasToTempFilePath success:`, data);
              },
              fail: function (error) {
                //记录实时日志
                log.addFilterMsg("goldenEgg");
                log.info("goldenEgg.js initReward canvasToTempFilePath fail:", JSON.stringify(error));
                console.log(`canvasToTempFilePath failed, ${JSON.stringify(error)}`);
                let rewardImg = COS_URL+"/public/img/bfyl/202201/zjd_reward20220121.png";
                // 28周年的砸金蛋图
                if(pre_act_hn == 28){
                  rewardImg = COS_URL+"/public/img/bfyl/202302/zjd_reward20230210.png";
                }
                that.setData({
                  rewardImg,
                  rewardCanvas: false
                });

                //关闭音频效果
                InnerAudio_zd.stop();

              },
            }, this);

          }

        }
      });

    }).exec()
  },
  zajindan: function () {

    this.setData({
      rewardPop: true,
    });
    // this.initReward();
    InnerAudio_bg.stop();
    this.getReward();
  },

  imageLoaded: function (e) {
    console.log("图片加载完毕····");
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
    console.log("领取奖励获取 task :", task);
    log.addFilterMsg("task");
    log.info("goldenEgg.js task:", task)
    log.info("goldenEgg.js taskKey:", taskKey)
    var code = task[taskKey]['qr_code'];
    var task_id = task[taskKey]['task_id'];
    var data = {
      code: code,
      task_id: task_id,
      game: game,
    }
    console.log("请求参数:", data);
    http.post('/api/scan/opentask', data).then(res => {
      console.log("http post 返回：", res);
      if (res.code == 1) {
        var task = taskInfo;
        var taskKey = that.data.taskKey;
        var getRewarded = wx.getStorageSync('getRewarded');
        if (!getRewarded) {
          getRewarded = {};
        } else {
          getRewarded = JSON.parse(getRewarded);
        }
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
            // if (key == 0) {
            //   rewardHistory += getRewarded[key]['msg'] + '····+' + getRewarded[key]['user_msg'] + '\n';
            // }
            if (key == 1) {
              rewardHistory += getRewarded[key]['msg'] + '····' + parseInt(getRewarded[0]['money']) + '元x' + getRewarded[key]['user_msg'] + '\n';
            }
            if (key == 2) {
              rewardHistory += getRewarded[key]['msg'] + '····+' + getRewarded[key]['user_msg'] + '元';
            }

          }
        }
        console.log("数据处理：", rewardHistory, "\n", totalMoney);

        //接口返回成功：
        that.setData({
          // rewardPop: false,
          // lotteryPop: true,
          getReward: getRewarded,
          rewardHistory: rewardHistory,
          totalMoney: totalMoney,
          task: task
        });
        that.initReward();
        that.countdown();

      }
      if (res.code == 0) {
        that.setData({
          rewardPop: false,
          lotteryPop: false,
        });
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false
        })
        _reward_one = false
        return false;
      }
    }).catch(err => {
      that.setData({
        rewardPop: false,
        lotteryPop: false,
      });
      _reward_one = false;
      if (err && err.errMsg == "request:fail timeout") {
        wx.showModal({
          title: '温馨提示',
          content: "网络超时，请再次尝试",
          showCancel: false
        })
      }

    })

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
      url: radomUrl + '?task=' + task, //跳转携带task
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
      url: radomUrl + '?task=' + task, //跳转携带task
    })
  },
  //关闭弹窗:关闭领取奖励弹窗，打开
  closePop: function () {
    if (this.data.totalMoney) {
      this.setData({
        rewardPop: false,
        lotteryPop: true
      });
      this.initLottery();
      countdown = false;
      this.countdown();
    }
    // console.log("关闭");
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
    // var task = this.data.task;
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
    // wx.setStorageSync('showBackModal', false);
    wx.navigateBack({
      complete: (res) => {},
    })

  },
  countdown: function () {
    let that = this;
    console.log("countdown");
    that.timer = setTimeout(() => {
      if (!countdown) {
        that.setData({
          rewardCanvas: false,
          lotteryCanvas: false,
          rewardPop: false,
          countdownPop: true,
          lotteryImg: COS_URL+"/public/img/to2/randomdraw/0919/zjd_lottery.png",
        });
      }
    }, 5000);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(this.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    InnerAudio_bg.destroy();
    InnerAudio_zd.destroy();
    InnerAudio_zj.destroy();
    clearTimeout(this.timer)
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