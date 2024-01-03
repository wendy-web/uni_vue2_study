//获取应用实例
const app = getApp();
const COS_URL = app.globalData.COS_URL;
let utils = require('../../../utils/util');
let http = require('../../../utils/api');
const socket = require('../../../utils/socket.js');
const log = require('../../../utils/log');
import storeRankUtils from '../../../api/storeRank/utils';
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime.js'

let hxtimer = '';
let getMsgTimer = '';
let hide = false;
Page({
  data: {
    //生成海报参数
    isCanDraw: false,
    dhxPop: false, //待核销弹窗提醒
    dhxbg: COS_URL + '/public/img/phaseIII/qrcodePop1.png',
    getMsg_bottomPop: false, //免扫罐底码弹窗
    img_can_vip: `${COS_URL}/public/img/bfyl/2023/07/img_can_vip.png`, // 免扫罐底码VIP 2023年7月11日 bottom != -1
    bg_shop_qr_t: `${COS_URL}/public/img/bfyl/2023/07/bg_shop_qr_t.png`, //二维码背景图
    bg_shop_qr_m: `${COS_URL}/public/img/bfyl/2023/07/bg_shop_qr_m.png`, //二维码背景图
    bg_shop_qr_b: `${COS_URL}/public/img/bfyl/2023/07/bg_shop_qr_b.png`, //二维码背景图

  },
  onLoad: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    var shopQRBG = COS_URL + "/public/img/phaseIII/202104/qrcodeBG20210528.png";
    wx.setStorageSync('shopQRBG', shopQRBG);
  },
  onShow: function () {
    //注册socket回调
    socket.addLoopBack('storeQr', (data, ckey) => {
      console.log('socket storeQr', data, ckey)
      this.socketHandle(data, ckey)
    })
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
      let {
        data: shopQrInfo
      } = await utils.getShopQr(params, 0);
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
      // 2023年8月5日 深圳兑奖活动
      // this.szRaffleInfo();
      hide = false;
      let that = this;
      // 获取弹框消息 后期整合到一起，去掉核销返货以及兑奖配送轮询 
      clearInterval(getMsgTimer);
      getMsgTimer = setInterval(() => {
        utils.getMsg("qr").then(data => {
          //msg_type:bottom 免扫罐底码
          if (data.msg_type == "bottom") {
            // type:1开启，2关闭
            this.setData({
              getMsg_bottomPop: true,
              getMsgInfo: data
            })
          }
        })
      }, 3000);
      clearInterval(hxtimer);
      hxtimer = setInterval(() => {
        that.getcount()
      }, 4000);
    } catch (error) {
      console.log("店铺码初始化 error:", error);
      wx.hideLoading();
    }

  },

  onUnload: function () {
    clearInterval(hxtimer);
    clearInterval(getMsgTimer);
    getMsgTimer = '';
    hxtimer = '';
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
    hide = true;
    clearInterval(hxtimer);
    clearInterval(getMsgTimer);
    getMsgTimer = '';
    hxtimer = '';

    this.setData({
      dhxPop: false,
      isCanDraw: false,
      visible: false,
    });
  },
  getcount: function () {
    let that = this;
    if (hide) {
      clearInterval(getMsgTimer);
      clearInterval(hxtimer);
      return;
    }

    // 未登录不请求
    if (wx.getStorageSync('islogin') != 1) return;
    utils.getcountcard().then(res => {
      console.log("getcountcard 请求返回：", res);
      if (res.code == 1) {
        var phaseIII_count = res.data;
        wx.setStorageSync('phaseIII_count', phaseIII_count);
        // 2023年9月22日 每天只弹1次 缓存字段：dhxpop,当前日期 和缓存的数量 两个条件都相等，不弹，否则要弹窗
        let {
          order_un
        } = phaseIII_count;
        if (order_un > 0) {
          let dhxpop_date_show = utils.checkDateShowDailyPop('dhxpop_date');
          let dhx_order_un = wx.getStorageSync('dhx_order_un') || '';
          if (dhx_order_un != order_un || dhxpop_date_show) {
            that.setData({
              dhxPop: true
            })
            wx.setStorageSync('dhx_order_un', order_un);
          }
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
      // case 'ess':
      //   this.selectComponent('#signNotice').showPopup(res.data.msg, ckey, clean)
      //   break
      /**活动进行中 活动完成情况*/
      // case 'act_1':
      //   if (res.data.list && res.data.list.length > 0) {
      //     this.selectComponent('#activityExecution').showPopup(res.data.list, clean)
      //   } else {
      //     this.releaseQueueTaskBack({
      //       detail: {
      //         key: 'act_1'
      //       }
      //     })
      //   }
      //   break
      /**活动结果 活动奖励发放*/
      // case 'act_2':
      //   this.selectComponent('#awardGrant').showPopup(res.data.msg, ckey, clean)
      //   break
      /**订单通知*/
      // case 'order_1':
      //   this.selectComponent('#orderTask').showPopup(res.data.msg, ckey, clean)
      //   break
      /**陈列复核情况*/
      // case 'rec':
      //   this.selectComponent('#displayReview').showPopup(res.data.msg, ckey, clean)
      //   break
      case 'public':
        this.selectComponent('#orderTask').showPublicPopup(res.data.msg, ckey, clean);
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