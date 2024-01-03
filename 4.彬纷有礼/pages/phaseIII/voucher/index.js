// 新版卡券
const app = getApp();
let COS_URL = app.globalData.COS_URL;
const utils = require("../../../utils/util");
import {
  couponCount,
  getSkuParam
} from '../../../api/coupon/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCouponList: [ // 一级tab列表
      {
        id: 0,
        name: '换购券',
        count: ''
      },
      {
        id: 1,
        name: '折扣券',
        count: ''
      },
      {
        id: 2,
        name: '活动券',
        count: ''
      }
    ],
    tabExcList: [ // 换购券 子tab列表
      {
        id: 0,
        name: '中国红牛',
        count: ''
      },
      {
        id: 1,
        name: '战马',
        count: ''
      }
    ],
    tabCoupon: 0, //可用卡券tab索引 ：0,换购 1活动券
    tabExc: 0, //换购券tab索引 0 红牛，1战马
    swiperIdx: 0, //swiper 索引
    couponCount: {}, //卡券统计数据
    discountCount: {}, //卡券统计数据
    actCount: {}, //卡券统计数据
    hnExcCount: {}, //卡券统计数据
    zmExcCount: {}, //卡券统计数据
    file_url_9m: `${COS_URL}/public/img/bfyl/2023/09`, //23年9月 cos图片资源
    skuParams:null, //产品类型参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData(options);
    
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

  },
  initData(options){
    let {activeTab=0} = options;
    if (activeTab) {
      // tab 切换只选中
      this.setData({
        tabCoupon: +activeTab
      })
      // swiper 滑动至对应tab
      this.initSwiperIndex(+activeTab);
    }
    // 初始化统计
    this.initCount();
    // 初始化产品类型
    this.initSkuParam()
  },
  // 一级tab切换
  tabCouponChange(event) {
    let {
      id
    } = event.currentTarget.dataset;
    this.initSwiperIndex(id);
    this.setData({
      tabCoupon: id,
    })
    this.initCountData();
  },
  //换购券：红牛战马tab
  tabExcChange(event) {
    let {
      id
    } = event.currentTarget.dataset;
    let {
      swiperIdx
    } = this.data;
    if (swiperIdx == id) {
      this.setData({
        tabExc: id,
      })
    } else {
      swiperIdx = id;
      this.setData({
        tabExc: id,
        swiperIdx,
      })

    }
    this.initCountData();

  },

  swiperChange(event) {
    let {
      current,
      source
    } = event.detail;
    if (source != 'touch') return;
    this.initTabs(current)
    this.setData({
      swiperIdx: current
    })
    this.initCountData();

  },
  // 滑动swiper-item时候初始化tab:
  initTabs(key) {
    let {
      tabCoupon,
      tabExc
    } = this.data;
    switch (+key) {
      case 0:
        tabCoupon = 0;
        tabExc = 0;
        break;
      case 1:
        tabCoupon = 0;
        tabExc = 1;
        break;
      case 2:
        tabCoupon = 1;
        break;
      case 3:
        tabCoupon = 2;
        break;
      default:
        tabCoupon = 0;
        tabExc = 0;
        break;
    }
    this.setData({
      tabCoupon,
      tabExc
    })

  },
  // 点击 tabCoupon 时候初始化 swpier 索引
  initSwiperIndex(key) {
    let {
      swiperIdx,
      tabExc
    } = this.data;
    switch (+key) {
      case 0:
        // 换购券的tab，取 红牛、战马的tabExc
        swiperIdx = tabExc;
        break;
      case 1:
        swiperIdx = 2;
        break;
      case 2:
        swiperIdx = 3;
        break;
      default:
        swiperIdx = 0;
        break;
    }
    this.setData({
      swiperIdx
    })
  },
  // 初始化 即将过期模块

  getUnixTime(dateStr) {
    var newstr = dateStr.replace(/-/g, '/')
    var date = new Date(newstr)
    var time_str = date.getTime().toString()
    // 2023年9月1日 转换成number类型，方便计算时间差
    return +time_str.substr(0, 10)
  },
  // 显示条件筛选弹窗：换购券-红牛 excType默认1
  showFilterPop(event) {
    let {
      type = ''
    } = event.detail;
    // type:1红牛，2战马，3折扣券，4活动券
    switch (type) {
      case 1:
      case 2:
        this.selectComponent("#filterPop").showExcFilterPop(type);
        break;
      case 3:
      case 4:
        this.selectComponent("#filterPop").showActFilterPop(type);
        break;
      default:
        break;
    }
  },
  // 初始化筛选数据：需要判断是哪一个swiper-item,再把数据传递给对应子组件列表，刷新列表
  initFilterData(event) {
    console.log("initFilterData:", event);
    let {
      detail
    } = event;
    let {
      swiperIdx
    } = this.data;
    switch (swiperIdx) {
      // 换购-红牛
      case 0:
        this.selectComponent("#excHn").initFilterData(detail)
        break;
        // 换购-战马
      case 1:
        this.selectComponent("#excZm").initFilterData(detail)
        break;
        // 折扣券
      case 2:
        this.selectComponent("#discountItem").initFilterData(detail)
        break;
        // 活动券券
      case 3:
        this.selectComponent("#actItem").initFilterData(detail)
        break;
      default:
        break;
    }
  },
  // 删除的标签， 传参给filterPop 去处理
  deleteTag(event) {
    let {
      item
    } = event.detail;
    console.log("voucher 获取到删除标签：", item);
    this.selectComponent("#filterPop").deleteTag(item);
  },
  // 初始化 卡券统计
  async initCount() {
    try {
      let {
        tabCouponList,
        tabExcList
      } = this.data;
      let res = await couponCount();
      if (res.code == 1) {
        let {
          data
        } = res;
        data.exc_all_unused = data.act1_unused + data.exc_zm_unused;
        tabCouponList[0]['count'] = data.exc_all_unused;
        tabCouponList[1]['count'] = data.act3_unused;
        tabCouponList[2]['count'] = data.act4_unused;
        tabExcList[0]['count'] = data.exc_hn_unused;
        tabExcList[1]['count'] = data.exc_zm_unused;
        // 计算所有可用卡券，判断按钮是否置灰
        let total_unsed = data.exc_all_unused + data.act3_unused + data.act4_unused;
        let btnDisabled = Boolean(total_unsed <= 0);
        this.setData({
          countcardInfo: data,
          tabCouponList,
          tabExcList,
          btnDisabled
        });
        // 重置统计数据
        this.initCountData();
      }
      if (res.code == 0) {
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false
        })
      }
    } catch (error) {
      console.log("initCount catch:", error)
    }

  },
  // 每次切换不同的tab ，重置统计数据
  initCountData() {
    let {
      act3_unused,
      act4_unused,
      exc_zm_hgq,
      exc_zm_jl,
      exc_hn_hgq,
      exc_hn_jl,
      exc_hn_dhq,
      // 2023年9月6日新版
      exc_hn_unused,
      exc_zm_unused,
      inuse
    } = this.data.countcardInfo;
    let {
      tabCoupon,
    } = this.data;

    if (tabCoupon == 0) {
      // 2023年9月6日 新版 红牛列表组件统计 hnExcCount
      let hnExcCount = {};
      hnExcCount.total_unused = exc_hn_unused;
      hnExcCount.exc_hn_hgq = exc_hn_hgq.unused;
      hnExcCount.exc_hn_jl = exc_hn_jl.unused;
      hnExcCount.exc_product = exc_hn_dhq.unused;
      hnExcCount.inuse = inuse.exc.exc_hn;
      // 战马列表统计
      let zmExcCount = {};
      zmExcCount.total_unused = exc_zm_unused;
      zmExcCount.exc_zm_hgq = exc_zm_hgq.unused;
      zmExcCount.exc_zm_jl = exc_zm_jl.unused;
      zmExcCount.inuse = inuse.exc.exc_zm;

      this.setData({
        // 2023年9月6日 新版
        hnExcCount,
        zmExcCount
      })
      return
    }
    // 折扣券
    if (tabCoupon == 1) {
      let discountCount = {};
      discountCount.total_unused = act3_unused;
      discountCount.inuse = inuse.dis.dis_num;

      this.setData({
        discountCount
      })
      return
    }
    // 活动券
    if (tabCoupon == 2) {
      let actCount = {};
      actCount.total_unused = act4_unused;
      actCount.inuse = inuse.act.act_num;

      this.setData({
        actCount
      })
      return
    }
  },
  // 打开页面
  openPage(event) {
    const {
      url = '',
      params = '',
    } = event.currentTarget.dataset;
    if (!url) return;
    utils.navigateFrequentPage(url, params)
  },
  // 初始化产品类型参数
  async initSkuParam(){
    try {
      let res = await getSkuParam();
      let {code,data} = res;
      if(code == 1){
        // data.forEach(item=>{
        //   let set = item.set;
        //   item.set = item.set.concat(set);
        // })
        this.setData({
          skuParams:data
        })
      }
    } catch (error) {
      console.log("initSkuParam catch：",error)
    }
  },
  // 显示换购券过期提示弹窗
  showExcExpirePop(){
    this.selectComponent("#filterPop").showExcExpirePop();
  },
  // 重置filterPop的筛选条件
  resetFilterPop(event){
    let {
      type = ''
    } = event.detail;
    console.log('voucher resetFilterPop:',type);
    // type:1红牛，2战马，3折扣券，4活动券
    switch (type) {
      case 1:
      case 2:
        this.selectComponent("#filterPop").resetFilter();
        break;
      case 3:
      case 4:
        this.selectComponent("#filterPop").actResetFilter();
        break;
      default:
        break;
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
  // onPullDownRefresh() {

  // },

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