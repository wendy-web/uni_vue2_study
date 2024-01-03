const utils = require("../../../../utils/util");
const http = require("../../../../utils/api");
let app = getApp();
let COS = app.globalData.COS_URL;
// 在页面中定义插屏广告
let interstitialAd = null;
let next = 1;
Page({
  data: {
    pageReady: false,
    recentMonth: '',
    selectedDate: '',
    userInfo: '', //用户信息
    loadmore: false,
    noMore: false,
    creditInfo: '',
    // newUI
    creditsStoreIcon: COS + '/public/img/phaseIII/202104/credits_store.png',
    creditsNumIcon: COS + '/public/img/phaseIII/202104/credits_num.png',
    creditsTipsIcon: COS + '/public/img/phaseIII/202104/credits_tips.png',
    rulePop:false,//积分规则弹窗
    blockAd:false
  },
  onLoad: function () {
    next = 1;

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-79bbd1be13ed930d'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }

    // 在适合的场景显示插屏广告
    if (interstitialAd && utils.blockAd()) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
    var that = this;

    var userdata = wx.getStorageSync('userdata');
    this.setData({
      userInfo: userdata
    });
  },
  onShow: function () {
    this.setData({
      blockAd:utils.blockAd()
    })
    if(this.data.creditInfo.length == 0){
      let param={
        next:1
      }
      this.getCredits(param,'refresh',true)
    }
  },

  //获取我的助力
  getCredits: function (param,type="load",mask=false) {
    var that = this;
    var creditInfo = this.data.creditInfo;
    this.setData({
      loadmore: true
    });
    http.post('/api/user/getcreditslog',param,mask).then(res=>{
      console.log("个人积分：", res);
      if (res.code == 0 || res.data.list.length < res.data.limit) {
        that.setData({
          noMore: true,
          loadmore: false,
        })

      }
      //type:refresh 刷新，load加载
      if(type=="refresh"){
        if(res.data.list){
          this.setData({
            creditInfo:res.data.list
          })

        }else{
          this.setData({
            creditInfo:[]
          })
        }
        wx.stopPullDownRefresh({
          success: (res) => {},
        })
      }else{

        if (res.data.list) {
          if (creditInfo) {
            creditInfo = creditInfo.concat(res.data.list);
          } else {
            creditInfo = res.data.list;
          }
          that.setData({
            creditInfo: creditInfo,
          });
        }
      }
      next = res.data.next;
      this.setData({
        loadmore: false,

      })
    })
    
  },
  switchToCreditsStore: function () {
    wx.switchTab({
      url: '/pages/tabBar/shouye/jifen',
    })
  },
  onHide: function () {

  },
  showRule:function(){
    // this.setData({
    //   rulePop:true
    // })
    wx.navigateTo({
      url: '/pages/zhongduan/geren/jifeng/rule',
    })
  },
  openCalendar: function () {
    this.setData({
      rili: true
    })
  },
  close: function () {
    this.setData({
      rili: false,
      rulePop: false,

    })
  },
  
  
  onPickDateChange(event) {
    console.log('parent onPickDateChange', event)
  },
  onControl(event) {
    console.log('parent onControl', event)
  },
  onPickDay(event) {
    console.log('parent onPickDay', event)
  },
  onRangePick(event) {
    console.log('parent onRangePick', event)
    var selectedDate = event.detail;
    this.setData({
      selectedDate: selectedDate,
      defaultDate: selectedDate[0] + "~" + selectedDate[1],
      loadmore: false
    })

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    utils.getUserInfoNew().then(data=>{
      this.setData({
        userInfo:data
      })
      let param ={
        next :1
      }
      this.getCredits(param,"refresh",true)
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("触底····································································");
    var parameter = {
      next: next,
    };

    if (!this.data.noMore) {

      this.getCredits(parameter,'load');
    }
  },
})