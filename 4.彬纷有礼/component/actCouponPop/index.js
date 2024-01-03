let app = getApp();
let COS_URL = app.globalData.COS_URL;
const utils = require("../../utils/util");
const log = require("../../utils/log");
import {unboxSignUpSZ,unboxSignUpGZ} from '../../api/shopActivity/index';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    actInfo: {
      type: Object,
      value: {},
      observer: function (actInfo) {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    dailyProcessShow: false, //兑奖进度弹窗
    ActEndShow: false, //活动结束未中奖弹窗
    notUnboxShow:false,// 弹窗：活动结束一个没开箱
    notTransferShow: false, // 不可转让店铺弹窗
    winShow: false, // 中奖弹窗
    unboxApplyCheckShow:false,//报名确认弹窗
    checkShopInfoShow: false, // 核对店铺信息弹窗
    unboxApplySuccessShow:false,//开箱活动报名成功
    noTransferTips: '', // 禁止转让店铺文案
    icon_no_trans: `${COS_URL}/public/img/bfyl/2023/07/icon_no_trans.png`, //禁止转让店铺图标
    icon_check_mark: `${COS_URL}/public/img/bfyl/2023/07/icon_check_mark.png`, // √ 图标
    bg_pop_empty: `${COS_URL}/public/img/bfyl/2023/07/unbox/bg_pop_empty.png`, // 空白弹窗背景
    title_apply_success: `${COS_URL}/public/img/bfyl/2023/07/unbox/title_apply_success.png`, // 报名成功文字
    // 2023年8月24日 广州开箱活动
    gzUnboxApplyCheckShow:false,//报名确认弹窗
    gzUnboxApplySuccessShow:false,//开箱活动报名成功
    gzUnboxDailyPopShow:false, // 开箱每日进度弹窗
    gzUnboxWinPopShow:false,// 开箱中奖弹窗：包含未中奖判断逻辑
    file_url_gzunbox:`${COS_URL}/public/img/bfyl/2023/08/gzUnbox`,//广州开箱cos图片资源
    // 2023年8月25日 广州战马兑奖活动
    gzExcDailyPopShow:false, // 每日进度弹窗
    gzExcWinPopShow:false, // 中奖判断弹窗
    file_url_gzexc:`${COS_URL}/public/img/bfyl/2023/08/gzExc`,//广州兑奖cos图片资源

  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭弹窗
    onClose(event) {
      let {
        popname
      } = event.currentTarget.dataset;
      console.log("popname:", popname);
      this.setData({
        [popname]: false
      })
    },
    // 显示每日进度弹窗
    showDailyProcessPop(actInfo = null) {
      this.setData({
        dailyProcessShow: true,
        actInfo
      })
    },
    // 显示活动结束未中奖弹窗
    showActEndPop(actInfo = null) {
      this.setData({
        ActEndShow: true,
        actInfo
      })
    },
    // 显示中奖弹窗
    showWinPop(actInfo = null) {
      this.setData({
        winShow: true,
        actInfo
      })
    },
    // 显示活动结束：未开箱弹窗
    showNotUnboxPop() {
      this.setData({
        notUnboxShow: true
      })
    },
    // 显示不可转让店铺弹窗：需要传参弹窗name,区分兑奖、开箱冲榜，默认兼容兑奖弹窗
    showNotTransferPop({
      actInfo = null,
      tips = '暂不能转让店铺',
      popname = 'notTransferShow'
    }) {
      this.setData({
        [popname]: true,
        actInfo,
        noTransferTips: tips
      })
    },
    // 2023年7月24日 报名前提示店铺信息不可修改弹窗
    showActApplyCheckPop() {
      this.setData({
        unboxApplyCheckShow: true
      })
    },
    // 修改店铺信息
    changeShopInfo: function () {
      let userInfo = this.data.userInfo;
      let url = "/pages/zhongduan/geren/mendian/renzhen/index?hide=1";
      if (userInfo && userInfo.condition !== 1) {
        wx.showModal({
          title: '温馨提示',
          content: "请联系店长更改店铺信息",
          showCancel: false
        })
        return;

      } else {
        wx.navigateTo({
          url: url,
        })
      }

    },
    // 显示报名成功弹窗
    showUnboxApplySuccess(){
      this.setData({
        unboxApplySuccessShow:true
      })
    },
    // 显示报名弹窗
    showApplyPop(actInfo=''){
      this.setData({
        actInfo
      });
      this.selectComponent('#animationOpenBox').show();
    },
    //排行榜活动：定时器结束触发
    rankTimerFinished(event) {
      console.log(event)
      let actInfo = this.data.actInfo;
      //活动未结束刷新倒计时
      if (!actInfo.act_state.act_end) {
        //根据时间重新计算 活动状态
        let {
          s_time,
          e_time
        } = actInfo
        let act_state = shopActUtils.init_act_state({
          s_time,
          e_time
        });
        actInfo.act_state = act_state;
        this.setData({
          actInfo
        })
      }
    },
    // 核对店铺信息弹窗
    async showCheckShopInfoPop(event) {
      console.log("event:", event);
      let {
        popname = 'unboxApplyCheckShow', nextpopname = 'checkShopInfoShow'
      } = event.currentTarget.dataset;
      console.log("popname:", popname);
      try {
        let shopInfo = await utils.getShopInfo();
        shopInfo.address = utils.storeAddress(shopInfo);
        let shopPhoneNum = '';
        var reg = /^(\d{3})\d*(\d{4})$/;
        shopInfo.member.forEach(item => {
          if (item.condition == 1) {
            shopPhoneNum = item.mobile.replace(reg, '$1****$2');
            // shopPhoneNum = item.mobile;
          }
        })
        this.setData({
          [popname]: false,
          [nextpopname]: true,
          shopInfo,
          shopPhoneNum
        })
      } catch (error) {
        console.log("showCheckShopInfoPop error:", error)
        // 无店铺信息提示
        if (error.code && error.code == 0) {
          this.setData({
            [popname]: false,
          })
          wx.showModal({
            title: '温馨提示',
            content: "您还未创建店铺",
            confirmText: "创建店铺",
            cancelText: "暂不创建",
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/zhongduan/geren/mendian/renzhen/index?hide=false',
                })
              }
            }
          })
          return
        }
      }

    },
    // 打开页面（防止重复跳转返回）
    openPage(event) {
      const {
        url = ''
      } = event.currentTarget.dataset;
      if (!url) return;
      console.log(url);
      utils.navigateFrequentPage(url)
    },
    // 请求报名接口
    async unboxSignUp() {
      this.setData({
        checkShopInfoShow: false,
        unboxApplyCheckShow: false
      })
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      try {
        let res = await unboxSignUpSZ();
        log.addFilterMsg("signUpShopAct");
        log.info('报名结果：', res);
        this.setData({
          unboxcheckShopInfoShow: false
        })
        wx.hideLoading();
        let {
          code,
          msg,
          data
        } = res;
        // 报名失败
        if (code == 0) {
          wx.showModal({
            title: '温馨提示',
            content: msg,
            showCancel: false
          })
          return
        }
        // 报名成功
        this.triggerEvent('refresh');
        this.showUnboxApplySuccess();

      } catch (error) {
        console.log("signUp error:", error);
        wx.hideLoading();
      }
    },
    //开启消息通知
    async openNotice(){

      try {
        let templateId = await utils.getMID(2);
        if (templateId) {
          //订阅消息授权
          wx.requestSubscribeMessage({
            //模板消息id，订阅类型：一次性
            tmplIds: templateId,
            success(res) {
              //需要循环templateId 判断每一个授权是否允许订阅消息通知
              if (res[templateId[0]] == 'reject') {
                console.log("跳转页面");
                
              } else {
                //活动开始跳转至榜单页，未开始跳转首页
                console.log("跳转页面");
  
              }
  
            },
            fail(res) {
              console.log("fail:res", res)
            }
          })
  
        } else {
          //活动开始跳转至榜单页，未开始跳转首页
          console.log("跳转页面");
        }
        
      } catch (error) {
        console.log("openNotice catch：",error);
      }

    },
    // 判断是否禁止转让店铺
    async isForbiddenTransShop(tips = '暂不能转让店铺') {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      try {
        let shopActInfo = wx.getStorageSync('shopUnboxActInfoSZ');
        if (shopActInfo) {
          shopActInfo = JSON.parse(shopActInfo)
        } else {
          let {
            actInfo
          } = await shopActUtils.act5_getinfo();
          shopActInfo = actInfo
        }
        //判断用户是否已报名并且活动未结束
        let inActCoupon = utils.inActCouponTips('inUnboxAct_SZ');
        wx.hideLoading();
        if (inActCoupon) {
          this.showNotTransferPop({
            actInfo: shopActInfo,
            tips
          });
        }
        return inActCoupon;

      } catch (error) {
        console.log("isForbiddenTransShop error:", error)
        wx.hideLoading();
        return false;
      }

    },
    // 2023年8月24日 星期四 广州开箱活动
    // 报名弹窗
    showGzUnboxApplyPop(actInfo=''){
      this.setData({
        actInfo
      })
      this.selectComponent("#gzUnboxApplyPop").show()
    },
    // 报名二次确认
    showGzUnboxApplyCheckPop(){
      this.setData({
        gzUnboxApplyCheckShow: true
      })
    },
    async gzUnboxSignUp(){
      this.setData({
        gzUnboxApplyCheckShow: false
      })
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      try {
        let res = await unboxSignUpGZ();
        log.addFilterMsg("gzUnboxSignUp");
        log.info('报名结果：', res);
        
        wx.hideLoading();
        let {
          code,
          msg,
          data
        } = res;
        // 报名失败
        if (code == 0) {
          wx.showModal({
            title: '温馨提示',
            content: msg,
            showCancel: false
          })
          return
        }
        // 报名成功
        this.triggerEvent('refresh');
        this.showGzUnboxApplySuccess();

      } catch (error) {
        console.log("signUp error:", error);
        wx.hideLoading();
      }
    },
    // 显示报名成功弹窗
    showGzUnboxApplySuccess(){
      this.setData({
        gzUnboxApplySuccessShow:true
      })
    },
    // 每日进度弹窗
    showGzUnboxDailyPop(actInfo=''){
      this.setData({
        gzUnboxDailyPopShow:true,
        actInfo
      })
    },
    // 显示中奖弹窗：包含未中奖判断逻辑
    showGzUnboxWinPop(actInfo=''){
      this.setData({
        gzUnboxWinPopShow:true,
        actInfo
      })
    },
    goUseCoupon: function () {
      let userInfo = this.data.userInfo;
      let url = "/pages/phaseIII/voucher/index?activeTab=2";
      if (userInfo && userInfo.condition == 2) {
        wx.showModal({
          title: '温馨提示',
          content: "请联系店长使用卡券",
          showCancel: false
        })
        return;

      } else {
        wx.navigateTo({
          url: url,
        })
      }

    },
    // 点击报名成功弹窗：我知道了，活动进行中的时候关闭弹窗，跳转详情
    tapIknow(event){
      let {actInfo} = this.data;
      if(actInfo.act_state.act_ing){
        const {
          url = ''
        } = event.currentTarget.dataset;
        if (!url) return;
        utils.navigateFrequentPage(url)
        
      }
      this.setData({
        gzUnboxApplySuccessShow:false
      })
    },
    // 广州战马兑奖活动 每日弹窗
    showGzExcDailyPop(actInfo=''){
      this.setData({
        actInfo,
        gzExcDailyPopShow:true
      })
    },
    // 广州战马兑奖 中奖判断弹窗
    showGzExcWinPop(actInfo=''){
      this.setData({
        actInfo,
        gzExcWinPopShow:true
      })
    }
  },
  lifetimes: {
    async attached() {
      // 在组件实例进入页面节点树时执行
      try {
        let userInfo = wx.getStorageSync('userdata') || await utils.getUserInfoNew();
        this.setData({
          userInfo
        })
      } catch (error) {
        console.log("actCouponPop 组件attached error:", error);
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
      console.log("页面显示");
    },
    hide: function () {
      // 页面被隐藏
      let data = this.data;

      Object.keys(data).forEach(item => {
        // console.log(item,':',typeof data[item])
        if (typeof data[item] === 'boolean' && data[item] === true) {
          this.setData({
            [item]: false
          })
        }
      });
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }
})