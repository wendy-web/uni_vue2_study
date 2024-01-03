//pages/storeAllowance/scanQr/index
const utils = require("../../../utils/util");
const api = require("../../../utils/api");
const auth = require("../../../utils/auth");
const app = getApp();
const COS_URL = app.globalData.COS_URL;
// 在页面中定义插屏广告
let interstitialAd = null;

const log = require('../../../utils/log.js');
let hnTypeArr = app.globalData.hnTypeArr; //红牛箱内码红包类型
// 判断红牛周年
const pre_act_hn_obj = app.globalData.pre_act_hn_obj;

Page({
  data: {
    //自定义导航栏初始化
    background: '#d82731', //背景颜色
    iconTheme: 'white', //图标主题
    title:'扫码领现金券',
    opened: false, //红包打开状态，默认false
    hn_banner: COS_URL + '/public/img/WarHorse/2022/01/error_hn_banner_3.png', //主图和异常码落地页一致
    icon_hn_27th: COS_URL + '/public/img/bfyl/202201/icon_hn_27th.png', //主图和异常码落地页一致
    icon_hn_title: COS_URL + '/public/img/bfyl/202201/icon_hn_title.png', //红牛27周年标题
    img_hn_opened:  COS_URL + '/public/img/bfyl/202303/bg_cash.png', //一开红包背景
    icon_question: COS_URL + '/public/img/WarHorse/2022/01/icon_question.png',
    img_hn_foot: COS_URL + '/public/img/WarHorse/2022/01/error_hn_foot.png',
    hn_activity_rule_27th: COS_URL + '/public/img/bfyl/202201/img_hn_27th_rule01.png', //红牛27周年活动规则
    img_btn_check:'../static/img_btn_check.png',//去查看按钮
    bg_cash_coupon:COS_URL + '/public/img/bfyl/202208/bg_cash_coupon.png',
    qrtype: '',//箱内码类型
    qrResult:null,//扫码结果
    isOwner:false,//红包自己领取的
    hn_banner_type56: COS_URL + '/public/img/bfyl/202208/bg_hn_type56.png', //箱内码类型56，奖金最高10元
    hntype56rule:'https://file.y1b.cn/public/img/bfyl/actRule/hntype56rule_1.png',//红牛箱内码类型56的活动规则
    pre_act_hn:27,//默认红牛周年
    icon_hn_28y: COS_URL + '/public/img/bfyl/202302/icon_hn_28y.png',
    img_hn_banner_28y: COS_URL + '/public/img/bfyl/202302/img_hn_banner_28y.png',//28周年背景
    img_hn_bg_28y:COS_URL + '/public/img/bfyl/202302/img_hn_bg_28y.png',
    img_btn_scan:'../static/img_btn_scan.png',//继续扫码按钮

  },
  onLoad: function (options) {
    log.addFilterMsg('storeAllowance');
    log.info(`scanQr options:`, options);
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-7e4fd08135410962' //线上版
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {
        console.error("插屏广告onError:", err);
      })
      interstitialAd.onClose(() => {})
    }
    var that = this;
    console.log('获取路由参数：', options)
    if (options.qrtype) {
      let pre_act_hn = pre_act_hn_obj[+options.qrtype] || this.data.pre_act_hn;
      let background = '#d82731';
      if(pre_act_hn==28){
        background = '#d72019'
      }
      this.setData({
        qrtype: options.qrtype,
        pre_act_hn,
        background
      })
    }
    if (options.qrResult) {
      let qrResult = JSON.parse(decodeURIComponent(options.qrResult))
      let money = qrResult.data.money;
      console.log("moneny:",money)
      if(money){
        qrResult.data.money = money.toFixed(2);
      }
      let idx = qrResult.msg.search("您已经领取");
      let isOwner = this.data.isOwner;
      if(idx > -1){
        isOwner = true
      }else{
        isOwner = false
      }
      console.log("qrResult:",qrResult)

      this.setData({
        qrResult,
        opened:true,
        isOwner
      });
    } else {
      var errMsg = {
        msg: "小程序加载异常，请删除小程序重新进入。",
        code:0
      }
      this.setData({
        qrResult: errMsg
      });
    }
    //删除本地缓存的qrcode
    wx.removeStorageSync('qrcode');
    //获取用户信息
    var userdata = wx.getStorageSync('userdata');
    if (userdata) {
      console.log("缓存的用户信息：", userdata);
      this.setData({
        userdata: userdata
      });

    } else {
      utils.getUserInfoNew().then(res => {
        that.setData({
          userdata: res
        });
      })
    }
   

  },
  onReady: function () {
    utils.getNavbarData().then(res => {
      if (res) {
        this.setData({
          navBarSystem: res,
        })
      }
    });
  },
  onShow: function () {
    
  },

  //活动规则
  showRule: function () {
    let hbtype = this.data.qrtype;
    console.log("hbtype:",hbtype)
    if (hnTypeArr.includes(+hbtype)) {
      // 27周年活动类型53,54,55
      if ([53, 54,55].includes(+hbtype)) {
        return this.previewImage(this.data.hn_activity_rule_27th);
      }
      //27周年活动类型56
      if ([56].includes(+hbtype)) {
        return this.previewImage(this.data.hntype56rule);
      }
    }
  },
  //预览图片
  previewImage(url){
    wx.previewImage({
      urls: [url],
    })
  },
  // 自定义导航栏 返回监听
  onBeforeBack: function () {
    wx.navigateBack({
      complete: (res) => {},
    })

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //获取上一个页面
    if (prevPage) {
      prevPage.setData({ //修改上一个页面的变量
        hided: true
      })
    }
    console.log("页面卸载····");
    // //拆完红包清除本地qrcode缓存
    wx.removeStorageSync('qrcode');
    this.setData({
      iconTheme: 'white'
    })
  },
  onHide: function () {

  },
  imgError: function (error) {
    console.error("图片加载失败：", error)
    log.addFilterMsg("imgError");
    log.error("图片加载失败:", error);

  },
  goScan: function () {
    let url = "pages/zongduan/saoma/index";
    // utils.navigateFrequentPage(url,'?hide=1')
    app.globalData.toscan = true;
    //获取当前页面栈
    let pages = getCurrentPages() || [];
    if (pages.length) {
      //查询排行榜页面索引
      pages.reverse();
      let pageIndex = pages.findIndex(item => item.route == 'pages/zongduan/saoma/index');
      //找到索引的，返回至排行榜页（wx.navigateBack关闭当前页面）
      if (pageIndex > -1) {
        const pageTarget = pages[pageIndex];
        pageTarget.setData({
          isBackPage:true,
        })
        wx.navigateBack({
          delta: pageIndex,
        })
        return
      }
    }
    //页面栈里无指定页面再跳转（小程序中页面栈最多10层，超出会报错：fail webview count limit exceed）
    if (url) {
      wx.redirectTo({
        url: '/pages/zongduan/saoma/index?hide=1',
      })
    }

  },

})