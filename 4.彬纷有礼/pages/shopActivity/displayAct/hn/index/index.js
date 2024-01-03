// pages/shopActivity/displayAct/hn/index/index.js

let app = getApp();
let COS_URL = app.globalData.COS_URL;
const auth = require('../../../../../utils/auth.js');
const utils = require('../../../../../utils/util');
const http = require('../../../../../utils/api');
const log = require('../../../../../utils/log');
let _request = false;
let that = this;
let actCouponTimer = ''; //开箱活动倒计时
let actCouponPath = ''; //跳转路径
//公共获取陈列信息接口
const shopActUtils = require("../../../../../api/shopActivity/utils");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    miniPhone: false, //是否小屏手机 默认false
    fixed_top: 0,
    fixed_show: false,
    apply_overdue_date: '', //报名截止日期
    apply_overdue: false, //是否已逾期报名，默认false
    act_yure: false, //预热
    act_End: false, //结束
    act_remain_day: '', //活动剩余天数
    act_countDown: '', //活动倒计时
    img_freezer_mini: COS_URL + '/public/img/bfyl/202204/img_freezer_mini.png',
    img_freezer: COS_URL + '/public/img/bfyl/202208/display_banner_hn.png',
    img_btn_apply: COS_URL + '/public/img/bfyl/202204/img_btn_apply1.png',
    img_btn_camera: COS_URL + '/public/img/bfyl/202204/img_btn_camera1.png',
    bg_act_countdown: COS_URL + '/public/img/bfyl/202204/bg_act_countdown.png',
    bg_title: COS_URL + '/public/img/bfyl/202204/bg_title.png',
    icon_arrow_r: COS_URL + '/public/img/bfyl/202204/icon_arrow_r.png',
    icon_camera_exp: COS_URL + '/public/img/bfyl/202204/icon_camera_exp.png',
    icon_back_top: COS_URL + '/public/img/bfyl/202204/icon_back_top.png',
    act_apply_success: COS_URL + '/public/img/bfyl/202204/img_apply_success.png',
    img_bg_apply_btn: COS_URL + '/public/img/bfyl/202204/bg_apply_btn.png', //陈列报名弹窗 按钮背景
    img_video_poster: COS_URL + '/public/img/bfyl/202204/img_video_poster_test.png', //视频封面图
    bg_btn_camer: COS_URL + '/public/img/bfyl/202204/bg_btn_camer.png', //点击前往拍照按钮背景
    btn_icon_camer: COS_URL + '/public/img/bfyl/202204/btn_icon_camer.png', //点击前往拍照按钮背景
    videoUrl: COS_URL + '/public/videos/m3u8/display_sample_hn.m3u8', //视频地址
    pop_applyed: false, //报名成功
    video_played: false, //播放视频
    apply_success: false, //报名成功：只有第一次有
    btn_display_status: 1, //获取活动信息文案:1点击前往拍照、2请明天再来拍照哦、3x月x日再来拍照哦
    bg_btn_grey: COS_URL + '/public/img/bfyl/202205/bg_btn_grey.png', //灰色按钮背景
    img_btn_display: COS_URL + '/public/img/bfyl/202205/img_btn_display.png', //前往拍照按钮
    img_btn_tomorrow: COS_URL + '/public/img/bfyl/202205/img_btn_tomorrow.png', //明天拍照按钮
    img_title: COS_URL + '/public/img/bfyl/202205/img_title.png', //完成活动中奖提示语
    img_btn_exchange: COS_URL + '/public/img/bfyl/202205/img_btn_exchange.png', //前往兑换按钮
    display_icon_star: COS_URL + '/public/img/bfyl/202208/display_icon_star.png',//未激活状态 星星icon
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("页面传参：", options);

    let {
      displayInfo
    } = options;
    this.setData
    if (displayInfo) {
      displayInfo = JSON.parse(decodeURIComponent(displayInfo))
      console.log("页面传参displayInfo：", displayInfo);
      let {s_time,e_time} = displayInfo;
      //开始日期：月日格式
      displayInfo.s_time_md = utils.parseTime(s_time,"{m}月{d}日");
      displayInfo.act_end_date = utils.parseTime(e_time, '{y}年{m}月{d}日 {h}时{i}分{s}秒');
      displayInfo.act_start_date = utils.parseTime(s_time, '{y}年{m}月{d}日 {h}时{i}分{s}秒');
      displayInfo.date_md_start = utils.parseTime(s_time, '{m}月{d}日', false);
      displayInfo.date_md_end = utils.parseTime(e_time, '{m}月{d}日', false);
      this.setData({
        displayInfo,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    utils.getNavbarData().then(res => {
      if (res) {
        res.screenHeight = res.screenHeight || 786;
        var miniPhone = res.screenHeight < 760 ? true : false;
        this.setData({
          navBarSystem: res,
          miniPhone
        })
      }
    });
    //获取用户身份
    let userInfo = wx.getStorageSync('userdata') || null;
    if (userInfo) {
      this.setData({
        userInfo
      })
    } else {
      utils.getUserInfoNew().then(data => {
        this.setData({
          userInfo: data
        })

      })
    }
    this.VideoContext = wx.createVideoContext("myVideo");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取用户活动参与信息
    // if (!this.data.displayInfo) {
      this.displayGetInfo(true);
    // }

  },


  //申请报名
  apply: function () {
    http.post('/api/act3/signUp', false).then(res => {
      console.log(res);
      if (res.code == 1) {
        //刷新活动参与信息
        this.displayGetInfo(true);
        //报名成功弹窗
        this.setData({
          pop_applyed: true,
          apply_success: true,
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false
        })
      }
    }).catch(err => {
      log.addFilterMsg('apply');
      log.info('apply err:', err);
      console.log('err:', err);
    })
  },
  // 获取陈列活动参与信息
  async displayGetInfo() {

    try {
      // 获取活动信息
      let result = await shopActUtils.display_getinfo();
      //拿到参与信息以后再去获取节点状态（仅仅参与页，其它不需要）
      this.onCreateIntersectionObserver();
      if (!result.display_info) {
        // this.setData({
        //   displayInfo: null
        // })
        return
        // return wx.showModal({
        //   title: '温馨提示',
        //   content: result.msg,
        //   showCancel: false
        // })
      }
      // console.log("开箱活动券信息：", JSON.stringify(actCouponInfo));
      let displayInfo = result.display_info;
      //获取活动信息文案:点击前往拍照、请明天再来拍照哦、x月x日再来拍照哦
      this.getCameraTitle(displayInfo);
      //判断活动时间：预热，报名截止、进行中、结束、过期
      //活动开始时间
      let time_start = new Date(displayInfo.s_time.replace(new RegExp(/-/gm), '/'));
      time_start = time_start.getTime();

      //活动结束时间
      let time_end = new Date(displayInfo.e_time.replace(new RegExp(/-/gm), '/'));
      time_end = time_end.getTime();
      //领奖过期时间：活动结束后1星期内259200000 毫秒=3天
      let expire_time = time_end + 259200000;
      //当前时间
      let curr_time = Date.now();
      //活动截止日期：活动结束-间隔*4 < 当前时间 不能报名
      displayInfo.calc.follow_time = +displayInfo.calc.follow_time;
      let apply_overdue_time = time_end - (+displayInfo.calc.follow_time * 4000);
      let apply_overdue_date = '';
      let apply_overdue = this.data.apply_overdue;
      // 上次拍照成功时间转换为时间戳
      let _last_time = displayInfo.end_time ? new Date(displayInfo.end_time.replace(new RegExp(/-/gm), '/')).getTime() : null;
      apply_overdue_date = utils.parseTime(apply_overdue_time, '{y}.{m}.{d} {h}:{i}:{s}');
      displayInfo.act_overdue_date = utils.parseTime(apply_overdue_time, '{y}年{m}月{d}日 {h}时{i}分{s}秒');
      displayInfo.act_end_date = utils.parseTime(time_end, '{y}年{m}月{d}日 {h}时{i}分{s}秒');
      displayInfo.act_start_date = utils.parseTime(time_start, '{y}年{m}月{d}日 {h}时{i}分{s}秒');
      displayInfo.date_md_start = utils.parseTime(time_start + 1000, '{m}月{d}日', false);
      displayInfo.date_md_end = utils.parseTime(time_end, '{m}月{d}日', false);
      this.setData({
        displayInfo
      });

      console.log("活动参与信息", displayInfo);
    } catch (err) {
      console.error("displayGetInfo err:", err);
    }

  },
 

  act_findOutDetail: utils.throttle(() => {
    //跳转到开箱活动页
    let url = actCouponPath;

    if (url) {
      wx.navigateTo({
        url: url,
      })
    }
  }, 2000),
  //返回上一页
  back: function () {
    wx.navigateBack({
      delta: 0,
      fail: (err) => {
        console.log(err);
        wx.switchTab({
          url: '/pages/tabBar/shouye/index',
        })
      }
    })
  },
  //判断拍照按钮文案
  getCameraTitle: function (actInfo) {

    let page = actInfo.page; //0 可以传图，1当天传图失败5次，2当天已成功
    let btn_display_status = 1; //1立即拍照，2明天，3，下次
    let _next_display_date = ''; //下次可拍照日期
    let follow_time = actInfo.calc.follow_time * 1000;
    let _next_time = follow_time; //下次可拍照时间
    let last_time = actInfo.last_time ? new Date(actInfo.last_time.replace(new RegExp(/-/gm), '/')).getTime() : null;
    let end_time = actInfo.end_time ? new Date(actInfo.end_time.replace(new RegExp(/-/gm), '/')).getTime() : null;
    // 当天已成功，下次拍照时间：上一次成功时间+间隔时间
    if (page == 2) {
      if (actInfo.calc.follow_time >= 86400) {
        let day_last_time = utils.parseTime(last_time, "{y}/{m}/{d}");
        last_time = new Date(day_last_time).getTime();
      }
      _next_time += last_time;
      btn_display_status = 3;
      _next_display_date = utils.parseTime(_next_time, "{m}月{d}日", false);
      this.setData({
        btn_display_status: btn_display_status,
        next_display_date: _next_display_date
      })
      return
    }
    // 当天传图失败5次 ，下次拍照时间：上次上传时间+间隔
    if (page == 1) {
      _next_time = 86400000;
      if (actInfo.calc.follow_time >= 86400) {
        let day_last_time = utils.parseTime(end_time, "{y}/{m}/{d}");
        end_time = new Date(day_last_time).getTime();
      }
      _next_time += end_time;
      btn_display_status = 2;
      _next_display_date = utils.parseTime(_next_time, "{m}月{d}日", false);
      this.setData({
        btn_display_status: btn_display_status,
        next_display_date: _next_display_date
      })
      return
    }
    //可上传图片
    if (page == 0) {
      btn_display_status = 1;
      _next_display_date = utils.parseTime(Date.now(), "{m}月{d}日", false);
      this.setData({
        btn_display_status: btn_display_status,
        next_display_date: _next_display_date
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(actCouponTimer);
    actCouponTimer = '';
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //关闭弹窗
    this.setData({
      pop_applyed: false,
      apply_success: false
    })
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

  scrollTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    })
  },
  // 跳转陈列详情页
  goScan: function () {
    //请求模板id
    var that = this;
    if (_request) return;
    _request = true;
    utils.getMID(3).then(res => {
      var templateId = res;
      if (templateId) {
        //订阅消息授权
        wx.requestSubscribeMessage({
          //模板消息id，订阅类型：一次性
          tmplIds: templateId,
          success(res) {
            _request = false;

            //需要循环templateId 判断每一个授权是否允许订阅消息通知
            if (res[templateId[0]] == 'reject') {

              that.jumpToDisplay();
            } else {
              //用户点击允许
              that.jumpToDisplay();
            }

          },
          fail(res) {
            _request = false;

            console.log("fail:res", res)
            that.jumpToDisplay();
          }
        })

      } else {
        _request = false;

        //打开陈列拍照页
        that.jumpToDisplay();
      }
    }).catch(err=>{
      _request = false;
      wx.showModal({
        title: '温馨提示',
        content:"网络异常，请稍后再试~",
        showCancel:false
      })
    })



  },

  jumpToDisplay: function () {
    let url = "/pages/shopActivity/displayAct/hn/display/index";
    //获取当前页面栈
    let pages = getCurrentPages() || [];
    if (pages.length) {
      //查询排行榜页面索引
      let pageIndex = pages.findIndex(item => item.route == 'pages/shopActivity/displayAct/hn/display/index');
      console.log(pages, pageIndex);
      //找到索引的，返回至排行榜页（wx.navigateBack关闭当前页面）
      if (pageIndex > -1) {
        wx.navigateBack({
          delta: pageIndex,
        })
        return
      }
    }
    //页面栈里无指定页面再跳转（小程序中页面栈最多10层，超出会报错：fail webview count limit exceed）
    if (url) {
      wx.navigateTo({
        url: url,
      })
    }
  },
  onPageScroll(e) {
    const {
      fixed_top,
      fixed_show
    } = this.data
    // 隐藏吸顶头部
    if (fixed_top != undefined && fixed_show) {
      if (e.scrollTop <= fixed_top) {
        this.setData({
          fixed_show: false
        })
      } else {

        this.setData({
          fixed_show: true
        })

      }
    }
    // 隐藏吸顶头部
  },
  getElement(elm, component) {
    const _this = this;
    return new Promise((resolve, reject) => {
      let step = 50;
      let limit = 2000;
      let ss = setInterval(function () {
        step += step;
        if (step >= limit) {
          clearInterval(ss)
          reject(`未找到${elm}元素`)
          return
        }
        let Qy = component ? _this.createSelectorQuery() : wx.createSelectorQuery();
        let a = Qy.select(elm).boundingClientRect(function (res) {
          if (res) {
            clearInterval(ss)
            resolve(res)
          }
        }).exec();
      }, 50);
    });
  },
  onCreateIntersectionObserver(component, elm) {
    const _this = this;
    // let screenHeight = this.data.navBarSystem?this.data.navBarSystem.screenHeight:500;
    this.getElement(elm || ".act-btn-box", component).then(res => {
      //判断大于0，防止从其它页面返回获取到负数····
      if (res.top > 0) {
        _this.setData({
          fixed_top: res.top
        });
      }
      _this.IntersectionObserver = component ? _this.createIntersectionObserver() : wx.createIntersectionObserver()
      _this.IntersectionObserver.relativeTo(".top-transparent", {
        bottom: 2
      }).observe(elm || '.act-btn-box', (res) => {
        console.log("找到了元素了·····", res);
        //显示吸顶
        const {
          fixed_show
        } = _this.data;
        if (fixed_show === false) {
          _this.setData({
            fixed_show: true
          });
        }
        //显示吸顶
      })
    });
  },
  closePop: function () {
    this.setData({
      pop_applyed: false
    })
  },
  toPlayVideo: function () {
    this.setData({
      pop_applyed: true,
      apply_success: false
    })
  },
  // 视频操作
  //视频播放结束
  videoEnd: function (e) {
    console.log("videoEnd视频播放结束：");
    this.setData({
      video_played: false
    })
  },
  //视频播放进度变化
  timeupdate: function (e) {},
  //视频播放监听
  playVideo: function (event) {

    event.play();

    // console.log("监听视频播放····时长：", event);

  },
  //视频播放错误监听
  playError: function (event) {
    console.log("视频播放错误：", event);
    this.setData({
      video_played: false
    })
  },
  //视频暂停监听
  pauseVideo: function (event) {
    console.log('视频暂停播放:', event);
    event.pause();

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

})