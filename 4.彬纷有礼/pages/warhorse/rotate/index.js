// pages/warhorse/rotate/index.js
import Dial from "./utils/dial.js";
const app = getApp();
const api = require("../../../utils/api");
const utils = require("../../../utils/util");
const auth = require("../../../utils/auth");
const COS_URL = app.globalData.COS_URL;
const log = require('../../../utils/log.js');
let taskInfo = null; //任务红包信息
let gamePage = [
  "/pages/warhorse/slotmachine/index",
  "/pages/warhorse/goldenEgg/index",
  // "/pages/warhorse/rotate/index",
];
let radomUrl = ''; //随机页面地址
let game = '大转盘';
let videoEnd = false; //视频播放结束
let cosAddress = auth.getCosAddress();
let _reward_one = false;
let InnerAudio_one = ''; //背景音乐
let InnerAudio_two = ''; //抽奖音乐
let InnerAudio_three = ''; //中奖音乐
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode: 2, //1是指针旋转，2为转盘旋转
    areaNumber: 8, //抽奖间隔
    rotatebg: COS_URL + '/public/img/WarHorse/0917/rotate/rotate_hd.png',
    pointer: COS_URL + '/public/img/WarHorse/0917/rotate/pointer1.png',
    speed: 17, //转动速度
    //二次确认弹窗
    reconfirmPop: false, //跳转余额再次确认弹窗
    remindIcon: COS_URL + '/public/img/WarHorse/0917/remindIcon.png',

    //开奖弹窗
    rewardPop: false,//默认false
    //获奖弹窗
    lotteryPop: false,
    //游戏名：
    gameOver: true, //true，不显示看视频按钮
    //自定义视频蒙层
    videoPop: false,
    videoUrl: "",
    //默认角度160 额外奖励  115 翻倍
    target: 160,
    btnurl: COS_URL + "/public/img/WarHorse/0917/watch_video_btn.png",
    rewardHistory:'',
    bg_round:COS_URL+ '/public/img/WarHorse/0917/rotate/rotate_bg_one.png',
    yuerText:"点击查看余额",
    bg_zm_rotate_body:COS_URL + "/public/img/WarHorse/2022/01/bg_zm_rotate_body.png",
    bg_zm_rotate_title:COS_URL + "/public/img/WarHorse/2022/01/bg_zm_rotate_title.png",
    icon_zm_pot:COS_URL + "/public/img/WarHorse/2022/01/icon_zm_pot.png",
    icon_btn_getreward:COS_URL + "/public/img/WarHorse/2022/01/icon_btn_getreward.png",
    bg_zm_rotate_pop:COS_URL + "/public/img/WarHorse/2022/01/bg_zm_rotate_pop.png",
    bg_zm_rotate_coin2:COS_URL + "/public/img/WarHorse/2022/01/bg_zm_rotate_coin2.png",
    bg_zm_rotate_earned:COS_URL + "/public/img/WarHorse/2022/01/bg_zm_rotate_earned.png",
    icon_zm_btn_giveup:COS_URL + "/public/img/WarHorse/2022/01/icon_zm_btn_giveup.png",
    icon_zm_btn_video:COS_URL + "/public/img/WarHorse/2022/01/icon_zm_btn_video.png",
    icon_zm_btn_scan:COS_URL + "/public/img/WarHorse/2022/01/icon_zm_btn_scan.png",
    icon_zm_btn:COS_URL + "/public/img/WarHorse/2022/01/icon_zm_btn.png",
    icon_btn_yuer:COS_URL+'/public/img/WarHorse/2022/01/icon_zm_btn.png',//查看余额按钮
    icon_zm_help:COS_URL+'/public/img/WarHorse/2022/01/icon_zm_help.png',//查看助力按钮
    pop_zm_bg:COS_URL + "/public/img/WarHorse/2022/01/pop_zm_bg.png",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _reward_one = false;
    taskInfo = '';
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
          target: 115
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
          target: 160
        });
        break;

      }
    }
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
      url: COS_URL + "/public/img/to2/rotate/bg.mp3",
      loop:true
    });
    InnerAudio_two = utils.InnerAudio({
      url: COS_URL + "/public/img/to2/rotate/kj.mp3"
    });
    InnerAudio_three = utils.InnerAudio({
      url: COS_URL + "/public/img/to2/rotate/zj.mp3"
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    radomUrl = gamePage[Math.floor((Math.random() * gamePage.length))];

    console.log("随机跳转页面：", radomUrl);
    let self = this
    this.dial = new Dial(this, {
      areaNumber: self.data.areaNumber, //抽奖间隔
      speed: self.data.speed, //转动速度
      rotatebg: self.data.rotatebg,
      pointer: self.data.pointer,
      awardNumer: 4,
      target: self.data.target, //指定角度270 额外  500翻倍
      mode: self.data.mode, //1是指针旋转，2为转盘旋转


      callback: () => {
        //请求回调 加任务奖励
        self.getReward();

        // self.setData({
        //   rewardPop: true
        // })

      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  //领取奖励：请求任务接口
  getReward: function () {
    if (_reward_one) return
    _reward_one = true;
    var that = this;
    //看完视频，游戏结束请求接口
    var task = taskInfo;
    var taskKey = this.data.taskKey;
    console.log("领取奖励获取 task :", task);
    log.setFilterMsg("zmtask");
    log.info("warhorse rotate.js  taskKey :", taskKey)
    log.info("warhorse rotate.js task:", task)
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
        that.dial.reset();
        return false;
      }
    }).catch(error => {
      _reward_one = false;
    
      that.dial.reset();

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
        rewardPop:false,
        lotteryPop:false
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
  stopAduio:function(e){
    if(e==1){
      InnerAudio_one.stop();
      InnerAudio_two.play();
      return
    }
    if(e==2){
      InnerAudio_two.stop();
      InnerAudio_three.play();
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    InnerAudio_one.destroy();
    InnerAudio_two.destroy();
    InnerAudio_three.destroy();
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

})