// pages/shopDisplay/apply.js

let app = getApp();
let COS_URL = app.globalData.COS_URL;
const auth = require('../../utils/auth.js');
const utils = require('../../utils/util');
const http = require('../../utils/api');
const log = require('../../utils/log');
let _request = false;
let that = this;
let actCouponTimer = ''; //开箱活动倒计时
let actCouponPath = ''; //跳转路径

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
    img_freezer: COS_URL + '/public/img/bfyl/202204/img_freezer.png',
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
    videoUrl: COS_URL + '/public/videos/m3u8/display_sample.m3u8', //视频地址
    pop_applyed: false, //报名成功
    video_played: false, //播放视频
    apply_success: false, //报名成功：只有第一次有
    btn_display_status: 1, //获取活动信息文案:1点击前往拍照、2请明天再来拍照哦、3x月x日再来拍照哦
    bg_btn_grey: COS_URL + '/public/img/bfyl/202205/bg_btn_grey.png', //灰色按钮背景
    img_btn_display: COS_URL + '/public/img/bfyl/202205/img_btn_display.png', //前往拍照按钮
    img_btn_tomorrow: COS_URL + '/public/img/bfyl/202205/img_btn_tomorrow.png', //明天拍照按钮
    img_title: COS_URL + '/public/img/bfyl/202205/img_title.png', //完成活动中奖提示语
    img_btn_exchange: COS_URL + '/public/img/bfyl/202205/img_btn_exchange.png', //前往兑换按钮

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.VideoContext = wx.createVideoContext("myVideo");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取用户活动参与信息
    this.actCouponGetInfo(true);

  },


  //申请报名
  apply: function () {
    http.post('/api/act3/signUp', false).then(res => {
      console.log(res);
      if (res.code == 1) {
        //刷新活动参与信息
        this.actCouponGetInfo(true);
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
  async actCouponGetInfo(auto = false) {
    let tapEvent = ''; //首页弹窗 店铺排行榜活动海报 的点击事件
    // if (typeof auto === 'object') {
    //   //深度拷贝数据，防止覆盖
    //   tapEvent = JSON.parse(JSON.stringify(auto));
    //   //点击首页广告弹窗前往报名
    //   if (tapEvent.currentTarget.dataset.storerankposter) {
    //     tapEvent = true;
    //     auto = true;
    //   } else {
    //     auto = false;
    //   }
    // }
    if (typeof auto === 'object') {
      tapEvent = JSON.parse(JSON.stringify(auto));
      tapEvent = true
      auto = false
    }
    try {
      // 获取活动信息
      let actCouponInfo = await utils.act3_getinfo();
      //拿到参与信息以后再去获取节点状态（仅仅参与页，其它不需要）
      this.onCreateIntersectionObserver();
      if (+actCouponInfo.code != 1) {
        this.setData({
          actInfo: null
        })
        return wx.showModal({
          title: '温馨提示',
          content: actCouponInfo.msg,
          showCancel: false
        })
      }
      // console.log("开箱活动券信息：", JSON.stringify(actCouponInfo));
      let actInfo = actCouponInfo.data;
      //获取活动信息文案:点击前往拍照、请明天再来拍照哦、x月x日再来拍照哦
      this.getCameraTitle(actInfo);
      this.setData({
        actInfo: actInfo
      })
      //判断活动时间：预热，报名截止、进行中、结束、过期
      //活动开始时间
      let time_start = new Date(actInfo.s_time.replace(new RegExp(/-/gm), '/'));
      time_start = time_start.getTime();

      //活动结束时间
      let time_end = new Date(actInfo.e_time.replace(new RegExp(/-/gm), '/'));
      time_end = time_end.getTime();
      //领奖过期时间：活动结束后1星期内259200000 毫秒=3天
      let expire_time = time_end + 259200000;
      //当前时间
      let curr_time = Date.now();
      //活动截止日期：活动结束-间隔*4 < 当前时间 不能报名
      actInfo.calc.follow_time = +actInfo.calc.follow_time;
      let apply_overdue_time = time_end - (+actInfo.calc.follow_time * 4000);
      let apply_overdue_date = '';
      let apply_overdue = this.data.apply_overdue;
      // 上次拍照成功时间转换为时间戳
      let _last_time = actInfo.end_time ? new Date(actInfo.end_time.replace(new RegExp(/-/gm), '/')).getTime() : null;
      apply_overdue_date = utils.parseTime(apply_overdue_time, '{y}.{m}.{d} {h}:{i}:{s}');
      actInfo.act_overdue_date = utils.parseTime(apply_overdue_time, '{y}年{m}月{d}日 {h}时{i}分{s}秒');
      actInfo.act_end_date = utils.parseTime(time_end, '{y}年{m}月{d}日 {h}时{i}分{s}秒');
      actInfo.act_start_date = utils.parseTime(time_start, '{y}年{m}月{d}日 {h}时{i}分{s}秒');
      actInfo.date_md_start = utils.parseTime(time_start + 1000, '{m}月{d}日', false);
      actInfo.date_md_end = utils.parseTime(time_end, '{m}月{d}日', false);



      //当前时间大于截止日期，逾期不可报名
      if (curr_time > apply_overdue_time) {
        apply_overdue = true; //已逾期
        console.log("当前时间大于截止日期···不可报名")
      } else {
        apply_overdue = false; //未逾期
        console.log("当前时间xiao于截止日期···可报名")

      }


      console.log("活动开始时间：", time_start);
      console.log("报名逾期时间：", apply_overdue_time, apply_overdue_date);
      console.log("活动结束时间：", time_end);
      this.setData({
        apply_overdue,
        apply_overdue_date,
        actInfo
      });

      // 活动预热：当前时间小于活动开始时间
      if (curr_time < time_start) {
        //预热倒计时
        this.act_warmUpCountdown(time_start, time_end);
        let act_yure_day = (time_start - curr_time) / 86400000;
        act_yure_day = Math.floor(act_yure_day);
        this.setData({
          act_yure_day
        })
        this.setData({
          act_yure: true,
          act_End: false,
        })


        //活动未结束禁止操作店铺信息
        utils.inActCoupon(true);
        //弹窗 前往报名 
        if (!auto || tapEvent) {

          actCouponPath = '/pages/storeRank/index/index';
          this.act_findOutDetail();
          return

        }
        return
      }
      // 活动开始：能显示活动说明就已经在白名单了
      if (curr_time < time_end) {
        this.setData({
          act_yure: false,
        })
        //活动未结束禁止操作店铺信息
        //已报名  禁止操作店铺信息
        if (actInfo.sign_up == 1) {
          utils.inActCoupon(true);
        } else {
          utils.inActCoupon(false);
        }
        //活动截止倒计时
        this.act_cutOffCountdown(time_end);
        //弹窗活动战况 每日1次
        //活动剩余天数 act_remain_day
        let act_remain_day = (time_end - curr_time) / 86400000;
        act_remain_day = Math.floor(act_remain_day);
        this.setData({
          act_remain_day
        })
        console.log("活动剩余天数：", act_remain_day, actInfo);
        let currDate = utils.parseTime(new Date(), '{y}-{m}-{d}');
        /**
         * 下次拍照时间等于 last_time + follow_time 和e_time 比较
         * 超过结束时间、s_num>3 或者 活动结束，都无下一次拍照
         */
        let next_display_date = '';
        let next_time = actInfo.calc.follow_time * 1000;
        if (_last_time) {
          next_time += _last_time
        } else {
          next_time = Date.now()
        }
        console.log("next_time:", next_time, "_last_time:", _last_time);
        // if (actInfo.s_num < 4 && next_time < time_end) {
        //   next_display_date = utils.parseTime(next_time, "{m}月{d}日", false);
        //   this.setData({
        //     next_display_date
        //   })
        // }
        if (auth.getActCouponPopUp() !== currDate) {
          //弹活动战况
          auth.setActCouponPopUp(currDate);
          this.setData({
            act_updatePop: true,
          })
          return
        }
        if (!auto || tapEvent) {
          //弹活动战况
          auth.setActCouponPopUp(currDate);
          console.log(currDate);
          actCouponPath = '/pages/shopDisplay/apply';
          this.act_findOutDetail();
          return
        }
        return
      }
      //活动结束
      this.setData({
        act_End: true,
        next_display_date: ''
      })
      //活动未结束禁止操作店铺信息
      utils.inActCoupon(false);
      // 中奖条件:陈列合格4次
      let isWin = actInfo.s_num > 3 ? true : false;
      //活动结束3天内
      if ((new Date() - expire_time) < 0) {
        //中奖
        if (isWin) {
          //已中奖：领取
          if (actInfo.rev_time) {

            //恭喜您已中奖

            return
          }


        } else {
          if (!auto) {
            //很遗憾您未中奖
            this.setData({
              act_End: true,
              act_isWin: false,
              act_EndPop: true,
              bg_act_end: this.data.bg_act_end,
              end_more_seven: false,
              act_unclaimed: true, //未领取
            })
          }
        }
        return;
      }
      this.setData({
        act_isWin: isWin,
        end_more_seven: true, //结束后3天
      })


      console.log("活动参与信息", actCouponInfo);
    } catch (err) {
      console.error("actCouponGetInfo err:", err);
    }

  },
  //开箱活动券倒计时
  act_warmUpCountdown(startTime, endTime) {
    //清除，防止开启多次
    clearInterval(actCouponTimer)
    //开始倒计时
    actCouponTimer = setInterval(() => {

      let time = startTime - Date.now()
      //到活动开始时间
      if (time <= 0) {
        clearInterval(actCouponTimer);
        this.setData({
          act_yure: false
        });
        this.act_cutOffCountdown(endTime)
        return
      }
      //正常预热倒计时   
      let countDown = utils.hms_countDownTime(time, false);
      this.setData({
        act_countDown: countDown
      })


    }, 1000)

  },
  //开箱活动券：活动截止倒计时
  act_cutOffCountdown(endTime) {
    clearInterval(actCouponTimer)
    actCouponTimer = setInterval(() => {

      let time = endTime - Date.now();

      //活动结束
      if (time <= 0) {
        clearInterval(actCouponTimer)
        this.setData({
          act_End: true, //活动结束
        })
        return
      }
      //正常活动截止倒计时 
      let countDown = utils.act_countDownTime(time, false);
      this.setData({
        act_countDown: countDown,
      })

    }, 1000)
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
    return

    // let param = {};
    // param.act_id = actInfo.act_id;
    // let follow_time = actInfo.calc.follow_time * 1000;
    // let date_today = utils.parseTime(Date.now(), "{y}-{m}-{d}");
    // //end_time; 最后拍照时间
    // let end_time = actInfo.end_time;
    // end_time = new Date(end_time.replace(new RegExp(/-/gm), '/')).getTime(); //转换为时间戳
    // //要判断间隔时间是否大于1天,大于1天取整（年月日）
    // if (actInfo.calc.follow_time >= 86400) {
    //   let day_last_time = utils.parseTime(end_time, "{y}/{m}/{d}");
    //   end_time = new Date(day_last_time).getTime();
    // }

    // let photo_num = actInfo.calc.photo_num || 5; //小于这个可拍
    // let btn_display_status = 1; //1立即拍照，2明天，3，下次

    // console.log("今日：", date_today);
    // // 先获取拍照记录：无记录，有记录情况(判断时间间隔)
    // http.post('/api/act3/uploadLog', param).then(res => {
    //   console.log("/api/act3/uploadLog:", res);
    //   if (+res.code == 1) {
    //     let data = res.data;
    //     let list = data.list;
    //     let list_today = null;
    //     Object.keys(list).forEach(item => {
    //       if (item == date_today) {
    //         list_today = list[item];
    //       }
    //     })
    //     if (list_today) {
    //       if (list_today.length >= photo_num) {
    //         btn_display_status = 2;
    //       }
    //       list_today.forEach(item => {
    //         if (item.status == 1) {
    //           btn_display_status = 3;
    //         }
    //       });
    //       //当前时间大于end_time+follow_time:1 可拍照
    //       if (Date.now() > (end_time + follow_time)) {
    //         btn_display_status = 1;
    //       }
    //     }
    //     this.setData({
    //       btn_display_status
    //     })
    //     console.log("今日列表：", list_today);


    //   }

    // }).catch(err => {
    //   _request = false;
    //   console.error("/api/act3/uploadLog：", err);
    // })




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
    })



  },

  jumpToDisplay: function () {
    let url = "/pages/shopDisplay/display";
    //获取当前页面栈
    let pages = getCurrentPages() || [];
    if (pages.length) {
      //查询排行榜页面索引
      let pageIndex = pages.findIndex(item => item.route == 'pages/shopDisplay/display');
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

    this.VideoContext.play();

    console.log("监听视频播放····时长：", event);

  },
  //视频播放错误监听
  playError: function (event) {
    console.log("视频播放错误：", event);
    this.setData({
      video_played: false
    })
  },
  //视频暂停监听
  pasueVideo: function (event) {
    console.log('视频暂停播放:', event);

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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})