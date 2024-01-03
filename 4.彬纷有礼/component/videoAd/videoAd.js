// component/videoAd.js
// const adUnitId1 = 'adunit-bd76128adce35b0c'; //测试版
const adUnitId1 = 'adunit-76825144de9a409d';//正式版
const log = require('../../utils/log');
if(wx.preloadAd){
  wx.preloadAd([
  {
    unitId: adUnitId1, // 视频广告广告单元
    type: 'video' // 视频广告
  }
])
}else{
  if(wx.preloadVideoAd){
    wx.preloadVideoAd([adUnitId1])
  }
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    videoPop: {
      type: Boolean,
      value: false
    },
    capsule: {
      type: String,
      value: ''
    },
    videoUrls: {
      type: String,
      value: ''
    },
    Ad: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    videoPop: false, //视频弹窗
    videoUrl: '', //视频地址
    capsule: '',
    videoArr: [
      // 'https://file.y1b.cn/file/videos/m3u8/zm.m3u8',
      // 'https://file.y1b.cn/public/videos/m3u8/hongniu.m3u8',
      // 'https://file.y1b.cn/public/videos/m3u8/movie-15S1.m3u8',
      // 'https://file.y1b.cn/public/videos/m3u8/movie-30S1.m3u8',
      // 'https://file.y1b.cn/public/videos/m3u8/zm60s.m3u8',
      // 'https://file.y1b.cn/public/videos/m3u8/zm80s.m3u8',
      'https://file.y1b.cn/public/videos/m3u8/voss15s.m3u8',
      // 'https://file.y1b.cn/public/videos/m3u8/voss30s.m3u8',
      // 'https://file.y1b.cn/public/videos/m3u8/voss60s.m3u8',
    ], //随机视频地址
    muted: false, //视频静音
    duration: 0, //视频时长
    replay: false, //视频重播
    videoRem: false, //关闭视频二次弹窗
    videoPause: false, //视频暂停
    countdown: 0,
    _listenVideoEnded:false,
    videoEnd:false
  },
  created: function () {
    // console.log("created:",this);
    //组件生命周期函数-在组件实例刚刚被创建时执行，注意此时不能调用 setData )
    // this.VideoContext = wx.createVideoContext("myVideo", this);
  },
  ready: function () {
    console.log("videoAd  ready:", this);
    this.VideoContext = wx.createVideoContext("myVideo", this);
    console.log("视频组件参数videoUrls:", this.data)
    var radomUrl = this.data.videoArr[Math.floor((Math.random() * this.data.videoArr.length))];
    this.setData({
      videoUrl: radomUrl
    });
  },
  error:function(err){
    //记录视频播放失败信息
    log.addFilterMsg('videoLoadFail');
    log.error("video组件加载失败 err:",JSON.stringify(err));
    this.triggerEvent("myevent",{videoLoadFail:true})

  },
  /**
   * 组件的方法列表
   */
  methods: {
    //关闭视频弹窗
    closeVideoPop: function () {
      var that = this;
      // console.log("视频组件：", this.VideoContext);
      if (this.data.duration !== 0) {
        this.setData({
          videoRem: true
        });
        console.log("视频暂停了····");
        this.VideoContext.pause();
        return false;
      } else {
        //视频播放结束，跳转游戏页面
        this.triggerEvent('myevent', this.data.duration);
        this.setData({
          videoPop: false
        });
      }


    },
    //关闭二次确认 视频弹窗
    closeVideoPops: function () {
      this.VideoContext.pause();
      //视频未播放结束：videoEnd =0    视频播放结束 video=1
      var myEventDetail = {
        videoEnd: 0
      }
      this.triggerEvent('myevent', myEventDetail);
      this.setData({
        videoPop: false,
        videoRem: false,
        duration: 0
      });
    },
    //视频播放进度变化
    timeupdate: function (e) {
      var that = this;
      var total = e.detail.duration;
      if (total > 0 && !this.data._listenVideoEnded) {
        this.setData({
          _listenVideoEnded:true
        })
        console.log("total:",total)
        this.listenViodeoEnded(Math.round(total));
      }
      var current = e.detail.currentTime;
      var duration = Math.round(total - current);
      var countdown = Math.round(5 - current);
      setTimeout(function () {
        that.setData({
          // duration: duration
          countdown: countdown
        });
        // console.log("视频倒计时：", duration);
      }, 300);

      //视频播放结束 video=1 测试跳过视频，正式上线需注释
      // var myEventDetail = {
      //   videoEnd:1
      // }
      // this.triggerEvent('myevent', myEventDetail);
      //视频播放结束 video=1 测试跳过视频，正式上线需注释
    },
    //视频播放结束
    videoEnd: function (e) {
      console.log("videoEnd视频播放结束：", this.data.duration);
      this.setData({
        videoEnd:true
      })
      //视频未播放结束：videoEnd =0    视频播放结束 video=1
       var myEventDetail = {
        videoEnd:1
      }
      this.triggerEvent('myevent', myEventDetail);
      this.setData({
        replay: true,
        duration: 0,
      });
    },
    //视频静音
    muted: function () {
      if (this.data.muted) {
        this.setData({
          muted: false
        })
      } else {
        this.setData({
          muted: true
        })
      }
    },
    //视频播放倒计时
    countdown: function () {
      var that = this;
      if (this.data.duration === 0) {
        return;
      } else {
        if (this.data.videoPause) {
          return false;
        }
        this.setData({
          duration: this.data.duration - 1
        });
      }
      setTimeout(function () {
        that.countdown();
      }, 1000);
    },
    //视频播放监听
    playVideo: function (event) {
      console.log("监听视频播放····时长：", this.data.duration);
      console.log("监听视频播放·····暂停状态：", this.data.videoPause);
      if (this.data.videoPause) {
        this.setData({
          videoPause: false
        });
        // this.countdown();
        return false;
      }
      if (this.data.replay) {
        this.setData({
          duration: -1,
          videoPause: false
        });
        // this.countdown();
      }
    },
    //视频播放错误监听
    playError: function (event) {
      console.log("视频播放错误：", event);
      //记录视频播放失败信息
      log.addFilterMsg('videoError');
      log.info("video error msg:",event);
      //视频未播放结束：videoEnd =0    视频播放结束 video=1
      this.setData({
        videoEnd:true,
        countdown:0
      });
       var myEventDetail = {
        videoEnd:1
      }
      this.triggerEvent('myevent', myEventDetail);
    },
    //视频暂停监听
    pasueVideo: function (event) {
      console.log('视频暂停播放:', event);
      this.setData({
        videoPause: true
      });

    },
    waitingVideo: function (event) {
      console.log('视频缓存:', event);

    },
    bindloadedmetadata: function (event) {
      console.log("bindloadedmetadata:", event);
    },
    bindseekcomplete: function (event) {
      console.log("bindseekcomplete:", event);
    },

    //继续观看视频
    videoPlay: function () {
      this.VideoContext.play();
      this.setData({
        videoRem: false,
      });
    },
    onAdplay(e) {
      console.log('onAdplay', e)
    },
    onAdload(e) {
      console.log('onAdload', e)
    },
    onAdclose(e) {
      console.log('onAdclose', e)
      this.VideoContext.pause();
      //视频未播放结束：videoEnd =0    视频播放结束 video=1
      var myEventDetail = {
        videoEnd: 1
      }
      this.triggerEvent('myevent', myEventDetail);
      this.setData({
        videoPop: false,
        videoRem: false,
        duration: 0
      });

    },
    onAdError(e) {
      console.log('onAdError', e)
    },
    listenViodeoEnded: function (timeout) {
      var that = this;
      timeout++;
      let count = timeout * 1000;
      console.log("listenViodeoEnded:",timeout);
      var timer = setTimeout(() => {
        let videoEnd = that.data.videoEnd;
        if (!videoEnd) {
          clearTimeout(timer);
          that.setData({
            _listenVideoEnded:false
          })
        
          return
        }

      }, count);
    }
  }
})