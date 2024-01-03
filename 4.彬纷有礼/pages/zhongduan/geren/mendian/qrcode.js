//获取应用实例
const app = getApp();
const COS_URL = app.globalData.COS_URL;
let utils = require('../../../../utils/util');
let http = require('../../../../utils/api');
const socket = require('../../../../utils/socket.js');
const log = require('../../../../utils/log');
import storeRankUtils from '../../../../api/storeRank/utils';
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime.js'

let qrcode = '';
let timer = '';
let ranktimer = '';
let getMsgTimer = '';
let hide = false;
Page({
  data: {
    loading: false,
    color: '#000',
    show: true,
    animated: false,
    bgimg: COS_URL + '/images/face.jpg',
    storeCode: COS_URL + '/public/img/Tian/202101/storeCode.png',
    location: '',
    //生成海报参数
    isCanDraw: false,
    dhxPop: false, //待核销弹窗提醒
    dhxbg: COS_URL + '/public/img/phaseIII/qrcodePop1.png',
    prizeInfo: false, //
    prizeConfirmPop: false, //兑奖排行榜配送确认弹窗
    getprizeSuccessPop: false, //收货成功
    prizeConfirmImg: COS_URL + '/public/img/storeRank/202108/pop/bg.png',
    prizeSuccessImg: COS_URL + '/public/img/storeRank/202108/pop/bg.png',
    noBtn: COS_URL + '/public/img/storeRank/20210121/no.png',
    yesBtn: COS_URL + '/public/img/storeRank/20210121/yes.png',
    checkAwardHistoryImg: COS_URL + '/public/img/storeRank/20210121/check_reward_history0204.png',
    act_dialogShow: false, //兑奖排行榜签收弹窗 code = 3
    getMsg_bottomPop: false, //免扫罐底码弹窗
    img_can_vip: `${COS_URL}/public/img/bfyl/2023/07/img_can_vip.png`, // 免扫罐底码VIP 2023年7月11日 bottom != -1
    bg_shop_qr_t: `${COS_URL}/public/img/bfyl/2023/07/bg_shop_qr_t.png`, //二维码背景图
    bg_shop_qr_m: `${COS_URL}/public/img/bfyl/2023/07/bg_shop_qr_m.png`, //二维码背景图
    bg_shop_qr_b: `${COS_URL}/public/img/bfyl/2023/07/bg_shop_qr_b.png`, //二维码背景图

  },
  onLoad: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    var shopQRBG = COS_URL + "/public/img/phaseIII/202104/qrcodeBG20210528.png";
    wx.setStorageSync('shopQRBG', shopQRBG);
  },
  onShow: function () {
    let islogin = wx.getStorageSync('islogin');
    if (islogin && islogin == 1) {
      this.initData()

    } else {
      app.tokenReadyCallback = (res) => {
        this.initData()
      }
    }
    
  },
  async initData() {
    try {
      //获取本地用户缓存信息
      var userdata = wx.getStorageSync('userdata') || await utils.getUserInfoNew();
      //请求获取邀请二维码
      var params = {
        sid: userdata.shop_id
      };
      let {data:shopQrInfo} = await utils.getShopQr(params, 0);
      this.setData({
        qrcode: shopQrInfo.qr
      })
      wx.setStorageSync('shopQR', shopQrInfo.qr);
      //获取店铺信息
      let shopInfo = await utils.getShopInfo();
      shopInfo.address = utils.storeAddress(shopInfo);
      this.setData({
        shopInfo
      })
      shopInfo.member.forEach(ele => {
        if (ele.condition == 1) {
          userdata = ele;
          userdata.shop_id = shopInfo.id;
          this.setData({
            userdata: ele
          })
          return
        }
      })
      wx.setStorageSync('storeInfo', shopInfo);
      wx.setStorageSync('shopInfo', shopInfo);
      hide = false;
      this.szRaffleInfo();
     
    } catch (error) {
      console.log("店铺码初始化 error:", error);
      wx.hideLoading();
    }
    
  },
  getPrize: function (e) {
    let that = this;
    let type = e.currentTarget.dataset.type;
    console.log("type:", type)
    http.post('/api/act/clickapp', {
      result: type
    }).then(res => {
      that.setData({
        prizeConfirmPop: false
      })
      if (res.code == 0) {
        if (res.msg) {
          wx.showModal({
            title: '温馨提示',
            content: res.msg,
            showCancel: false
          })
        }
        return
      }
      if (res.code == 1) {
        if (type == 1) {
          that.setData({
            getprizeSuccessPop: true
          })
        }
        return
      }
      //其他用户拒绝签收
      if (res.code == 2) {
        if (res.msg) {
          let msg = res.msg + '\n操作人：' + res.data.nick_name
          wx.showModal({
            title: '温馨提示',
            content: msg,
            showCancel: false,
            confirmText: "我知道了"

          })
        }
        return
      }
      if (res.code == 3) {
        if (res.msg) {
          let msg = res.msg + '\n签收人：' + res.data.nick_name
          this.setData({
            act_dialogShow: true,
            act_msg: msg
          })
        }
        return
      }
    })

  },
  prizepoll: function (sid = '') {
    let that = this;
    // 未登录不请求
    if (wx.getStorageSync('islogin') != 1) return;
    http.post('/api/act/prizepoll', {
      sid: sid
    }, false).then(res => {
      console.log('/api/act/prizepoll', res);
      if (res.code == 1) {
        that.setData({
          prizeInfo: res.data,
          prizeConfirmPop: true
        })
      }
      clearInterval(ranktimer);
      clearInterval(timer);
      timer = setInterval(that.getcount, 3000);
    })
  },
  //获取兑奖排行榜信息：已领奖,未配送=>轮询配送状态
  getMyRankInfo: function () {
    return new Promise(function (resolve, reject) {
      http.post('/api/act/myrank', '', false).then(res => {
        resolve(res)
        // if(res.code==1){
        //   let data = res.data;
        //   if(data.prize_time && !data.a_time){
        //     resolve(data)
        //   }
        // }
      })
    });
  },
  goAwardHistory: function () {
    this.setData({
      getprizeSuccessPop: false
    })
    let url = "/pages/storeRank/rewardRecord/index";
    let prizeInfo = this.data.prizeInfo;
    if (prizeInfo && prizeInfo.issues) {
      url = "/pages/storeRank/rewardRecord/index?issues=" + prizeInfo.issues;
    }
    wx.navigateTo({
      url: url,
    })
  },
  onUnload: function () {
    // console.error("qrcode onUnload``````")
    clearInterval(timer);
    clearInterval(ranktimer);
    clearInterval(getMsgTimer);
    getMsgTimer = '';
    ranktimer = '';
    timer = '';
    hide = false;
    this.setData({
      dhxPop: false
    });
    //回收当前钩子
    socket.cleanCurrHook('storeQr')
  },
  onHide: function () {
    //关闭当前tab状态
    socket.cleanCurrTab()
    // console.error("qrcode onHide``````");
    hide = true;
    clearInterval(timer);
    clearInterval(ranktimer);
    clearInterval(getMsgTimer);
    getMsgTimer = '';
    ranktimer = '';
    timer = '';

    this.setData({
      dhxPop: false,
      isCanDraw: false,
      visible: false,
      prizeConfirmPop: false
    });
  },
  getcount: function () {
    let that = this;
    if (hide) return;
    // 未登录不请求
    if (wx.getStorageSync('islogin') != 1) return;
    utils.getcountcard().then(res => {
      console.log("getcountcard 请求返回：", res);
      clearInterval(ranktimer);
      clearInterval(timer);
      // ranktimer = setInterval(() => {
      //   utils.getUserInfoNew().then(data => {
      //     clearInterval(ranktimer);
      //     clearInterval(timer);
      //     var sid = '';
      //     if (data && data.shop_id) {
      //       sid = data.shop_id
      //     }
      //     that.prizepoll(sid)

      //   })

      // }, 3000);
      if (res.code == 1) {
        var phaseIII_count = res.data;
        wx.setStorageSync('phaseIII_count', phaseIII_count);
        console.log("order_un:", res.data.order_un)

        if (res.data.order_un > 0) {
          that.setData({
            dhxPop: true
          })
        }
      }

    })
  },
  goHx: function () {
    wx.redirectTo({
      url: '/pages/storeOrder/myorder/index/index?activeTab=3',
    })

  },
  closePop: function () {
    this.setData({
      dhxPop: false,
      prizeConfirmPop: false,
      getprizeSuccessPop: false,
      getMsg_bottomPop: false
    });
  },
  createShareImage(e) {
    this.setData({
      isCanDraw: !this.data.isCanDraw
      // isCanDraw: true
    })


  },
  //图片加载失败：多半是网络问题
  imgLoadError: function (err) {
    let qr_url = this.data.qrcode;
    wx.downloadFile({
      url: qr_url,
      success: (res) => {
        console.log("下载文件：", res)
        if (res.tempFilePath) {
          this.setData({
            qrcode: res.tempFilePath
          })
        }
      }
    })
  },
  //个人soket消息处理
  socketHandle(res, ckey) {
    let clean = res.clean || false
    switch (res.type) {
      /**电子签*/
      case 'ess':
        this.selectComponent('#signNotice').showPopup(res.data.msg, ckey, clean)
        break
        /**活动进行中 活动完成情况*/
      case 'act_1':
        if (res.data.list && res.data.list.length > 0) {
          this.selectComponent('#activityExecution').showPopup(res.data.list, clean)
        } else {
          this.releaseQueueTaskBack({
            detail: {
              key: 'act_1'
            }
          })
        }
        break
        /**活动结果 活动奖励发放*/
      case 'act_2':
        this.selectComponent('#awardGrant').showPopup(res.data.msg, ckey, clean)
        break
        /**订单通知*/
      case 'order_1':
        this.selectComponent('#orderTask').showPopup(res.data.msg, ckey, clean)
        break
        /**陈列复核情况*/
      case 'rec':
        this.selectComponent('#displayReview').showPopup(res.data.msg, ckey, clean)
        break
    }
  },
  releaseQueueTaskBack(event) {
    let {
      key
    } = event.detail
    socket.releaseQueueTaskBack(key)
  },
   // 2023年8月5日 深圳兑奖抽奖活动
   async szRaffleInfo() {
    try {
      // 获取活动信息
      let {
        actInfo
      } = await storeRankUtils.actInfo14();
      console.log("深圳兑奖活动raffle信息：", actInfo)
      if (actInfo) {
        this.setData({
          actInfoRaffle: actInfo
        })
        log.addFilterMsg('actInfoRaffle');
        log.info(actInfo);
        //开箱活动每日弹窗处理(活动进行中)
        let {
          act_state,
          raffle_apply
        } = actInfo;
        // 判断店铺码页面今日是否弹过

        let show = utils.checkDateShowDailyPop('storeQr_raffle_apply_pop');
        // 活动进行中&抽奖可报名
        if (act_state.act_ing && raffle_apply && show) {
          this.selectComponent('#storeRankPop').showRaffleApplyPop(actInfo);
          return
        }
      
        return
      }
      return this.setData({
        actInfoRaffle: null
      })
    } catch (err) {
      console.error("actInfoRaffle err:", err);
    }
  },
})