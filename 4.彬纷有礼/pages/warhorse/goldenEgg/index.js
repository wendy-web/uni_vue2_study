// pages/warhorse//goldenEgg/index.js
const app = getApp();
const api = require("../../../utils/api");
const utils = require("../../../utils/util");
const auth = require("../../../utils/auth");
const COS = app.globalData.COS_URL;
const log = require('../../../utils/log.js');
let taskInfo = null; //任务红包信息
let gamePage = [
  '/pages/warhorse/slotmachine/index',
  '/pages/warhorse/rotate/index',
  // "/pages/warhorse/goldenEgg/index",
];
let radomUrl = ''; //随机页面地址
let game = '砸金蛋';
let videoEnd = false; //视频播放结
let InnerAudio_bg = ''; //背景音效
let InnerAudio_zd = ''; //砸蛋音效
let InnerAudio_zj = ''; //中奖音效

let cosAddress = auth.getCosAddress();
let _reward_one = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eggImg: COS + "/public/img/WarHorse/0917/goldenEgg/egg.png",
    titleImg: COS + "/public/img/WarHorse/0917/goldenEgg/title.png",
    breakImg: COS + "/public/img/WarHorse/0917/goldenEgg/zm_zjd/images/img_6.png",
    brokenImg: COS + "/public/img/WarHorse/0917/goldenEgg/zm_zjd/images/img_2.png",
    // hammerImg: COS + "/public/img/WarHorse/0917/goldenEgg/zm_zjd/images/img_5.png",
    hammerImg: COS + "/public/img/WarHorse/2022/01/icon_zm_hammer.png",
    type: 0, //0初始显示完整蛋 1 break 2broken
    hammer: false, //锤子初始不显示
    //二次确认弹窗
    reconfirmPop: false, //跳转余额再次确认弹窗
    remindIcon: COS + '/public/img/WarHorse/0917/remindIcon.png',
    //开奖弹窗
    rewardPop: false,//默认false
    //获奖弹窗
    lotteryPop: false,//默认false
    //自定义视频蒙层
    videoPop: false,
    videoUrl: '',
    popType: 0, //弹窗类型：1，再次确认-reconfirmPop；2，完成任务弹窗-lotteryPop
    btnurl: COS + "/public/img/WarHorse/0917/watch_video_btn.png",
    gameOver: true, //true，不显示看视频按钮
    rewardHistory:'',
    // rewardHistory:'红包翻倍5倍。。。'
    yuerText:"点击查看余额",
    icon_zm_pot:COS + "/public/img/WarHorse/2022/01/icon_zm_tiger_pot.png",
    icon_zm_btn_giveup:COS + "/public/img/WarHorse/2022/01/icon_zm_btn_giveup.png",
    icon_zm_btn_video:COS + "/public/img/WarHorse/2022/01/icon_zm_btn_video.png",
    icon_zm_btn_scan:COS + "/public/img/WarHorse/2022/01/icon_zm_btn_scan.png",
    icon_zm_btn:COS + "/public/img/WarHorse/2022/01/icon_zm_btn.png",
    icon_btn_yuer:COS+'/public/img/WarHorse/2022/01/icon_zm_btn.png',//查看余额按钮
    icon_zm_help:COS+'/public/img/WarHorse/2022/01/icon_zm_help.png',//查看助力按钮
    icon_btn_getreward:COS+ "/public/img/WarHorse/2022/01/icon_btn_getreward.png",
    smashed:false,//是否砸蛋默认false
    pop_zm_bg:COS + "/public/img/WarHorse/2022/01/pop_zm_bg.png",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("WarHorse goldenEgg 参数:", options);
    taskInfo = '';
    _reward_one = false;
    if (options.task) {
      taskInfo = decodeURIComponent(options.task);
      taskInfo = JSON.parse(taskInfo);
      console.log("taskInfo:", taskInfo);
    }

    var task = taskInfo;
    var taskLength = Object.keys(task).length;
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
          target: 500
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
          target: 270
        });
        break;

      }
    }
    //  InnerAudio_bg = utils.InnerAudio({
    //    url:COS+"/public/img/to2/goldenEgg/bj.mp3",
    //    loop:true
    //  })
     InnerAudio_zd = utils.InnerAudio({
      url:COS+"/public/img/to2/goldenEgg/kj.mp3"
    })
    // InnerAudio_zj = utils.InnerAudio({
    //   url:COS+"/public/img/to2/goldenEgg/zj.mp3"
    // })
    //获取广告地址
    if (cosAddress&&cosAddress.A8) {
      let videoUrl = cosAddress.A8.value[0].video_zm[0];
      this.setData({
        videoUrl
      });
    } else {
      utils.getAd().then(data=>{
        cosAddress = data;
        let videoUrl = cosAddress.A8.value[0].video_zm[0];
        this.setData({
          videoUrl
        });
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    radomUrl = gamePage[Math.floor((Math.random() * gamePage.length))];
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // InnerAudio_bg.play();
    let userdata = wx.getStorageSync('userdata');
    if(userdata&&userdata.condition ==2){
      this.setData({
        yuerText:"点击查看助力",
        icon_zm_btn_yuer:this.data.icon_zm_help
      })
    }else{
      this.setData({
        yuerText:"点击查看余额",
        icon_zm_btn_yuer:this.data.icon_btn_yuer
      })
    }
  },
  smashEgg: function () {
    // InnerAudio_bg.stop();
    this.setData({
      smashed:true
    })
    InnerAudio_zd.play();
    if (this.data.type == 2 && this.data.rewardPop) {
      this.setData({
        lotteryPop: true
      })
      return
    }
    if (this.data.type == 2) {
      return
    }
    console.log("samash");
    let that = this;
    this.setData({
      hammer: true
    });
    setTimeout(() => {
      this.setData({
        type: 1
      });
    }, 300);
    setTimeout(() => {
      this.setData({
        type: 2
      });
      InnerAudio_zd.stop();
      //砸蛋结束，1秒以后弹窗获奖弹窗
      this.getReward();
      // setTimeout(() => {
      //   this.setData({
      //     rewardPop: true
      //   })
      // }, 1000);
    }, 600);
  },
  //领取奖励：请求任务接口
  getReward: function () {
    // InnerAudio_zd.stop();
    if (_reward_one) return
    _reward_one = true;
    var that = this;
    //看完视频，游戏结束请求接口
    var task = taskInfo;
    var taskKey = this.data.taskKey;
    console.log("领取奖励获取 task :", task);
    log.setFilterMsg("zmtask");
    log.info("warhorse goldenEgg.js taskKey:", taskKey)
    log.info("warhorse goldenEgg.js task:", task)

    var code = task[taskKey]['qr_code'];
    var task_id = task[taskKey]['task_id'];
    var data = {
      code: code,
      task_id: task_id,
      game: game,
    }
    console.log("请求参数:", data);
    api.post('/api/scan/opentask', data).then(res => {
      console.log("任务请求返回：", res);
      console.log("that.data：", that.data);

      if (res.code == 1) {
        // InnerAudio_zj.play();
        var task = taskInfo;
        var taskKey = that.data.taskKey;
        var getRewarded = wx.getStorageSync('getRewarded');
        if (!getRewarded) {
          getRewarded = {};
        }else{
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
        console.log("task：", task);
        console.log("task 长度：", Object.keys(task).length);
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
        //接口返回成功：
        that.setData({
          rewardPop: true,
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
        this.setData({
          hammer: false,
          type: 0
        });
        return false;
      }
    }).catch(error => {
      // let msg = JSON.stringify(error);
      // wx.showModal({
      //   title: '温馨提示',
      //   content: msg,
      //   showCancel: false
      // })
      _reward_one = false;
      this.setData({
        hammer: false,
        type: 0
      });
    });


  },
  goYuer: function (e) {
    var go = e.currentTarget.dataset.go;
    console.log("再次确定跳转:", go);
    //判断用户扫码红包 是否有翻倍任务，有就二次弹窗，没有直接跳转
    var task = this.data.task;

    if (go == 1 && task && Object.keys(task).length > 1) {
      this.setData({
        reconfirmPop: true,
        lotteryPop: false
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
      return
    }
    if (detail.videoEnd == 1) {
      console.log("视频播放结束触发：", detail.videoEnd);

      videoEnd = true
      // return;
    }
    //随机跳转到任意游戏页面
    var task = taskInfo;
    task = encodeURIComponent(JSON.stringify(task));
    console.log("radomUrl:", radomUrl);
    wx.redirectTo({
      url: radomUrl + '?task=' + task, //跳转携带task
    })

  },
  //观看视频
  watchAd: function () {
    this.setData({
      videoPop: true,
      reconfirmPop: false,
      lotteryPop: false,
    });
  },
  closePop: function (e) {
    //id =0 二次确认：reconfirmPop  1 获奖弹窗:rewardPop  2累计获奖:lotteryPop
    let id = e.currentTarget.dataset.id;
    if (id == 1) {
      this.setData({
        rewardPop: false,
        lotteryPop: true
      });
      return
    }
    if (id == 2) {
      this.setData({
        lotteryPop: false
      });
      return
    }
    this.setData({
      reconfirmPop: false
    });
  },
  goScan: function () {
    app.globalData.toscan = true;
    wx.redirectTo({
      url: '/pages/zongduan/saoma/index?hide=1',
    })
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
    // InnerAudio_bj.destroy();
    InnerAudio_zd.destroy();
    // InnerAudio_zj.destroy();
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

  // }
})