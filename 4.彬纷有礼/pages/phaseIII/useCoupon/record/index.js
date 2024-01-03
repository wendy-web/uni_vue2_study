// pages/phaseIII/useCoupon/record/index.js
const app = getApp();
let COS_URL = app.globalData.COS_URL;
const utils = require("../../../../utils/util");
import {
  couponCount,
  getSkuParam
} from '../../../../api/coupon/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabRecordList: [ // 一级tab列表
      {
        id: 0,
        name: '核销中',
        count: ''
      },
      {
        id: 1,
        name: '已使用',
        count: ''
      },
      {
        id: 2,
        name: '已过期',
        count: ''
      }
    ],
    tabExpireList: [ // 已过期 子tab列表
      {
        id: 0,
        name: '换购券',
        count: ''
      },
      // {
      //   id: 1,
      //   name: '折扣券',
      //   count: ''
      // },
      {
        id: 1,
        name: '活动券',
        count: ''
      }
    ],
    tabRecord: 0, //可用卡券tab索引 ：0,核销中 1已使用，2已过期
    tabExpire: 0, //已过期 tab索引 0 换购，1折扣，2活动
    swiperIdx: 0, //swiper 索引
    hxingCount: {}, // 核销中统计
    usedCount: {}, // 已使用统计
    expireCount: {}, // 已过期统计
    file_url_9m: `${COS_URL}/public/img/bfyl/2023/09`, //23年9月 cos图片资源
    skuParams: [], // 产品类型参数
    shopInfo: null, //  店铺信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData();

  },
  initData() {
    // 初始化统计
    this.initCount();
    // 初始化产品类型参数
    this.initSkuParam()
    // 获取店铺信息
    this.initShopInfo()
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
  // 一级tab切换
  tabRecordChange(event) {
    let {
      id
    } = event.currentTarget.dataset;

    this.initSwiperIndex(+id);

    this.initCountData();
  },
  // 已过期的子 tab
  tabExpireChange(event) {
    let {
      id
    } = event.currentTarget.dataset;
    this.setData({
      tabExpire: +id,
      swiperIdx: +id + 2
    })
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
      tabRecord,
      tabExpire
    } = this.data;
    switch (+key) {
      case 0:
      case 1:
        tabRecord = +key;
        break;
      case 2:
        tabRecord = 2;
        tabExpire = 0;

        break;
      case 3:
        tabRecord = 2;
        tabExpire = 1;
        break;
      case 4:
        tabRecord = 2;
        tabExpire = 2;
        break;
      default:
        tabRecord = 0;
        tabExpire = 0;
        break;
    }
    this.setData({
      tabRecord,
      tabExpire
    })

  },
  // 点击 tabRecord 时候初始化 swpier 索引 key 是一级tab的id
  initSwiperIndex(key) {
    console.log("initSwiperIndex key:",key);
    let {
      tabExpire,
      swiperIdx,
      tabRecord
    } = this.data;
    switch (+key) {
      case 0:
      case 1:
        tabRecord = +key;
        swiperIdx = +key;
        break
      case 2:
        tabRecord = 2;
        // 如果tabExpire=0 已过期换购券，1已过期活动券
        console.log("tabExpiretabExpire:",tabExpire)
        swiperIdx = tabExpire==0 ? 2 : 3;
        break;
      // case 3:
      //   tabRecord = 2;
      //   swiperIdx = +key;
      //   break;
      default:
        swiperIdx = 0;
        tabRecord = 0;
        break;
    }
    this.setData({
      tabRecord,
      swiperIdx
    })
  },
  // 初始化 卡券统计
  async initCount() {
    try {
      let {
        tabRecordList,
        tabExpireList
      } = this.data;
      let res = await couponCount();
      if (res.code == 1) {
        let {
          data
        } = res;
        let {act,dis,exc} = data?.inuse;
        let exc_all_unused = act.act_num + dis.dis_num + exc.exc_hn +exc.exc_zm;
        let {unused_expire} = data;
        // 换购已过期
        let expire_exc = unused_expire.exc.exc_hn + unused_expire.exc.exc_zm;
        let expire_dis = unused_expire.dis.dis_num;
        let expire_act = unused_expire.act.act_num;
        tabRecordList[0]['count'] = exc_all_unused;// 核销中
        tabRecordList[1]['count'] = data.used;//已使用
        tabRecordList[2]['count'] = expire_exc + expire_dis + expire_act;// 已过期
        tabExpireList[0]['count'] = expire_exc;// 已过期-换购券
        tabExpireList[1]['count'] = expire_act;// 已过期-活动券
        // 计算所有可用卡券，判断按钮是否置灰
        let total_unsed = data.exc_all_unused + data.act3_unused + data.act4_unused;
        let btnDisabled = Boolean(total_unsed <= 0);
        this.setData({
          countcardInfo: data,
          tabRecordList,
          tabExpireList,
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
      unused_expire
    } = this.data.countcardInfo;
    let {
      tabExpire,
    } = this.data;
    // 已过期-换购券
    if (tabExpire == 0) {
      let expire_exc = unused_expire.exc.exc_hn + unused_expire.exc.exc_zm;
      let expire_act = unused_expire.act.act_num;
      this.setData({
        expire_exc,
        expire_act
      })
      return
    }
    // 已过期- 活动券
    if (tabExpire == 1) {
      let expire_exc = unused_expire.exc.exc_hn + unused_expire.exc.exc_zm;
      let expire_act = unused_expire.act.act_num;
      this.setData({
        expire_exc,
        expire_act
      })
      return
    }
    
  },
  // 显示条件筛选弹窗：根据swiperIdx区分
  showFilterPop(event) {

    let {
      swiperIdx
    } = this.data;
    console.log("showFilterPop swiperIdx:",swiperIdx)
    this.selectComponent("#filterPop").showFilterPop(swiperIdx);
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
      // 核销中
      case 0:
        this.selectComponent("#hxing").initFilterData(detail)
        break;
        // 已使用
      case 1:
        this.selectComponent("#hxed").initFilterData(detail)
        break;
        // 换购券
      case 2:
        this.selectComponent("#excItem").initFilterData(detail)
        break;
        // 折扣券 已去掉 变活动券
      case 3:
        this.selectComponent("#actItem").initFilterData(detail)
        // this.selectComponent("#discountItem").initFilterData(detail)
        break;
        // 活动券
        // case 4:
        //   this.selectComponent("#actItem").initFilterData(detail)
        //   break;
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
  // 初始化产品类型参数
  async initSkuParam() {
    try {
      let res = await getSkuParam();
      let {
        code,
        data
      } = res;
      if (code == 1) {
        this.setData({
          skuParams: data
        })
      }
    } catch (error) {
      console.log("initSkuParam catch：", error)
    }
  },
  // 初始化店铺信息
  async initShopInfo() {
    try {
      let shopInfo = await utils.getShopInfo();

      if (shopInfo) {
        this.setData({
          shopInfo
        })
      }
      console.log("店铺信息已获取：", shopInfo)
    } catch (error) {
      console.log("initShopInfo catch:", error);
    }
  },
   // 重置filterPop的筛选条件
   resetFilterPop(event){
    let {
      swiperIdx
    } = this.data;
    this.selectComponent("#filterPop").resetFilterTrigger(swiperIdx);
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage() {

  // }
})