// pages/storeAllowance/cashorCoupon/index.js
// 扫码选择现金红包 or 产品券 2023年8月10日
let app = getApp();
let COS_URL = app.globalData.COS_URL;
const utils = require("../../../utils/util");
let hnTypeArr = app.globalData.hnTypeArr; //红牛箱内码红包类型
//活动规则图片
const act_rule_obj = app.globalData.unboxActRuleObj;
import {selectAward} from '../../../api/exchange/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarSystem: null, //顶部导航栏参数
    openType: -1, //箱内码打开类型：0未扫码，1已扫码 取code
    enoughHeight: false, //计算高度
    boxdata: null, //箱内码数据
    isOwner:false,//是否是自己领取
    hbdata:null,//boxdata 里面的data数据：RewardType，qr,tips,type
    cashcoupon_file_url:`${COS_URL}/public/img/bfyl/2023/08/cashCoupon`,// cos 资源地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    utils.getNavbarData().then(res => {
      if (res) {
        this.setData({
          navBarSystem: res,
        })
      }
    });
    this.initOptions(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 箱内码已领取：计算按钮高度
    // this.computedDistence('.box-content');
  },
  async initOptions(options) {
    console.log(options)
    try {
      let userdata = wx.getStorageSync('userdata') || await utils.getUserInfoNew();
      let {
        boxdata = ''
      } = options;
      if (boxdata) {
        boxdata = JSON.parse(decodeURIComponent(boxdata));
       
        let idx = boxdata.msg.search("您已经领取");
        let isOwner = this.data.isOwner;
        if (idx > -1) {
          isOwner = true
        } else {
          isOwner = false
        }
        let openType = boxdata.code;
        // code=1 || code = 3 都是未领取
        if([1,3].includes(+boxdata.code)){
          openType = 1
        }
        this.setData({
          boxdata,
          openType,
          isOwner,
          hbdata:boxdata.data
        })
      }
      this.setData({
        userdata
      })
    } catch (error) {

      console.log("initOptions error:", error)
    }

  },
  // 选择类型：1产品券还是 2红包
  chooseType(event){
    let {type=''} = event.currentTarget.dataset;
    let { boxdata } = this.data;
    if(boxdata){
      let {qr} = boxdata.data;
      let params = {
        qr_code:qr,
        award_type:type
      }
      selectAward(params,true).then(res=>{
        let {code,msg,data} = res;
        if(code == 0){
          wx.showModal({
            title: '',
            content: msg,
            showCancel:false
          })
          return
        }
        let num = data.num;
        if (type==0) {
          data.num = num.toFixed(2);
        }
        this.selectComponent('#successPop').show({type,data})
        
      }).catch(err=>{
        let {msg = ''}  =err;
        if(!msg)return;
        wx.showModal({
          title: '温馨提示',
          content:msg,
          showCancel:false,
        })
      })
    }else{
      wx.showModal({
        title: '温馨提示',
        content: '未获取到箱内码数据，请重新扫码',
        showCancel:false,
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },
  // 返回上一页
  back: function () {
    wx.navigateBack({
      delta: 0,
      fail: () => {
        console.log("damn ");
        wx.switchTab({
          url: '/pages/tabBar/shouye/index',
        })
      }
    })
  },
  // 打开活动规则
  openRule() {
    let {
      hbtype = 61
    } = this.data;
    if (hnTypeArr.includes(+hbtype)) {
      let url = act_rule_obj[+hbtype];
      if (url) {
        return wx.previewImage({
          urls: [url],
        })
      }
    }
  },
  // 计算元素直接距离
  computedDistence(elem1, elem2) {
    var that = this;
    // 获取页面元素的位置信息
    wx.createSelectorQuery().select(`${elem1}`).boundingClientRect().exec(function (res) {
      // res 是一个数组，包含了元素的位置信息
      let rect1 = res[0] // element1 的位置信息
      console.log(rect1)
      if (rect1 && rect1.height > 570) {
        that.setData({
          enoughHeight: rect1.height,

        })
      } else {
        that.setData({
          enoughHeight: false
        })
      }
    })
  },
  checkYue(event) {
    let {
      url = '', param = ''
    } = event.currentTarget.dataset;
    // 查看余额的时候注意判断非店长身份
    if (url) {
      wx.redirectTo({
        url,
      })
    }
  },
  goScan() {
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
          isBackPage: true,
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
  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom() {

  // },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage() {

  // }
})