// pages/warhorse//slotmachine/index.js
import Machine from "./utils/machine.js";
const app = getApp();
const COS = app.globalData.COS_URL;
const api = require("../../../utils/api");
const utils = require("../../../utils/util");
const auth = require("../../../utils/auth");

const log = require('../../../utils/log.js');
let taskInfo = null; //任务红包信息
let gamePage = [
  "/pages/warhorse/rotate/index",
  "/pages/warhorse/goldenEgg/index",
  // "/pages/warhorse/slotmachine/index",
];
let radomUrl = ''; //随机页面地址
let game = '老虎机';
let videoEnd = false; //视频播放结束
let cosAddress = auth.getCosAddress();
let _reward_one = false;
let InnerAudio_one = ''; //背景音乐
let InnerAudio_two = ''; //抽奖音乐
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //002:定额红包；220：额外红包；
    num1: 0,
    num2: 0,
    num3: 0,
    num4: 0,
    speed: 24,
    //二次确认弹窗
    reconfirmPop: false, //跳转余额再次确认弹窗 默认false
    remindIcon: COS + '/public/img/WarHorse/0917/remindIcon.png',
    //开奖弹窗
    rewardPop: false,//默认false
    //累计获奖弹窗
    lotteryPop: false,//默认false
    task: '', //任务
    hasTask: 0, //是否有任务
    //自定义视频蒙层
    cjImg: COS + "/public/img/WarHorse/0917/machine/click_me.png",
    pullImg: COS + "/public/img/WarHorse/2022/01/icon_zm_tiger_pull.png",
    videoPop: false,
    videoUrl: '',
    gameOver: true,
    btnurl: COS + "/public/img/WarHorse/0917/watch_video_btn.png",
    // rewardHistory:'红包翻倍奖励.....5元x2 \n 红包翻倍奖励.....5元x2'
    yuerText:"点击查看余额",
    bg_zm_tiger:COS + "/public/img/WarHorse/2022/01/bg_zm_tiger.png",
    icon_zm_logo:COS + "/public/img/WarHorse/2022/01/icon_zm_logo.png",
    bg_zm_tiger_box:COS + "/public/img/WarHorse/2022/01/bg_zm_tiger_box.png",
    bg_zm_tiger_pop:COS + "/public/img/WarHorse/2022/01/bg_zm_tiger_pop.png",
    bg_zm_tiger_pop_coin:COS + "/public/img/WarHorse/2022/01/bg_zm_tiger_pop_coin.png",
    pop_zm_tiger_bg:COS + "/public/img/WarHorse/2022/01/pop_zm_tiger_bg02.png",
    pop_zm_tiger_bg_earned:COS + "/public/img/WarHorse/2022/01/pop_zm_tiger_bg_earned.png",
    bg_zm_tiger_box_head:COS + "/public/img/WarHorse/2022/01/bg_zm_tiger_box_head.png",
    bg_zm_tiger_box_foot:COS + "/public/img/WarHorse/2022/01/bg_zm_tiger_box_foot.png",
    icon_zm_tiger_title:COS + "/public/img/WarHorse/2022/01/icon_zm_tiger_title.png",
    icon_btn_getreward:COS + "/public/img/WarHorse/2022/01/icon_btn_getreward.png",
    icon_zm_btn_giveup:COS + "/public/img/WarHorse/2022/01/icon_zm_btn_giveup.png",
    icon_zm_btn_video:COS + "/public/img/WarHorse/2022/01/icon_zm_btn_video.png",
    icon_zm_btn_scan:COS + "/public/img/WarHorse/2022/01/icon_zm_btn_scan.png",
    icon_zm_btn:COS + "/public/img/WarHorse/2022/01/icon_zm_btn.png",
    icon_btn_yuer:COS+'/public/img/WarHorse/2022/01/icon_zm_btn.png',//查看余额按钮
    icon_zm_help:COS+'/public/img/WarHorse/2022/01/icon_zm_help.png',//查看助力按钮
    pop_zm_bg:COS + "/public/img/WarHorse/2022/01/pop_zm_bg.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("WarHorse slotmachine 参数:", options);
    taskInfo = '';
    _reward_one = false;
    if (options.task) {
      let task = decodeURIComponent(options.task);
      task = JSON.parse(task);
      taskInfo = task;
      console.log("taskInfo:", taskInfo);
    }
    var aprizeName = ''; //奖金倍数
    var methodName = ''; //奖励方式名
    var rewardMsg = ''; //奖励信息
    for (var key in taskInfo) {
      console.log("循环：", key);
      if (key == 1) {
        //1为翻倍
        aprizeName = taskInfo[1]['user_msg'];
        methodName = taskInfo[1]['msg'];
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
        aprizeName = taskInfo[2]['money'];
        methodName = taskInfo[2]['msg'];
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
    radomUrl = gamePage[Math.floor((Math.random() * gamePage.length))];
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
    InnerAudio_one = utils.InnerAudio({
      url: COS + "/public/img/to2/tiger/bg.mp3",
      loop:true
    });
    InnerAudio_two = utils.InnerAudio({
      url: COS + "/public/img/to2/tiger/kj1.mp3"
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
    // this.initLottery();
    var task = taskInfo;
    this.machine = new Machine(this, {
      height: 148, //单个数字高度
      len: 10,
      fanbeiimg: COS + '/public/img/WarHorse/0917/machine/quota.png',
      jindouimg: COS + '/public/img/WarHorse/0917/machine/extra.png',
      ewaiimg: COS + '/public/img/WarHorse/0917/machine/quota.png',
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
        InnerAudio_two.stop();
        // //播放领奖音乐
        // var src = app.globalData.COS_URL + "/public/music/k_3.mp3";
        // that.listenerButtonPlay(src);
        //请求回调 加任务奖励
        that.getReward();
        return false;

      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // setTimeout(() => {
    //   this.setData({
    //     reconfirmPop:true
    //   });
    // },2700);
    InnerAudio_one.play();
    let userdata = wx.getStorageSync('userdata');
    if(userdata && userdata.condition == 2){
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
  //领取奖励：请求任务接口
  getReward: function () {
    if (_reward_one) return
    _reward_one = true;
    console.log("回调getReward·····");
    var that = this;
    //看完视频，游戏结束请求接口
    var task = taskInfo;
    var taskKey = this.data.taskKey;
    console.log("领取奖励获取 task :", task);
    log.setFilterMsg("zmtask");
    log.info("warhorse machine.js taskKey:", taskKey)
    log.info("warhorse machine.js task:", task)
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
      InnerAudio_two.stop();
      if (res.code == 1) {
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
        console.log("slotmachine getRewarded:",getRewarded);
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
        that.machine.reset();
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false
        })
        return false;
      }
    }).catch(error => {
      _reward_one = false;
      that.machine.reset();
      // let msg = JSON.stringify(error);
      // wx.showModal({
      //   title: '温馨提示',
      //   content: msg,
      //   showCancel: false
      // })

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
        lotteryPop: false,
        rewardPop: false
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
    InnerAudio_one.destroy();
    InnerAudio_two.destroy();
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