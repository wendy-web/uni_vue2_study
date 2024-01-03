// pages/storeRank//rewardRecord.js
let app = getApp();
let COS_URL = app.globalData.COS_URL;
const http = require('../../../utils/api');
const utils = require('../../../utils/util');
import storeRankUtils from '../../../api/storeRank/utils'
let _nextOne = 1;
let issues = '';

let statusClass = {
  '未开始':'',
  '进行中':'act-ing',
  '已发放':'act-end',
  '未达标':'act-fail',
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lanternImg: COS_URL + '/public/img/storeRank/20210121/lantern.png',
    refreshed: false, //下拉刷新未触发
    loadMore: false, //正在加载更多
    noMore: false,
    actInfo: null, //活动参与信息
    statusClass,
    activeTab: 1, //默认奖券记录
    file_cos_url:`${COS_URL}/public/img/bfyl/2023/08`,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initLoad(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getList: function (param, mask = true) {
    let that = this;
    return new Promise(function (resolve, reject) {
      http.post('/api/act/prizelog', param, mask).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err)
      }).catch(err => {
        console.error("/api/act/prizelog catch:", err)
      });
    })
  },
  getData: function (type) {
    let that = this;
    let param = {};
    let list = that.data.rewardList;
    if (type == 'refresh') {
      _nextOne = 1
      that.getList(false).then(res => {
        console.log("getRankList:", res);
        that.setData({
          noMore: false
        })
        if (res.code == 1) {
          res.data.forEach((item, index, arr) => {
            if (issues && issues == item.issue) {
              item['open'] = true;
              item['id'] = 'item_' + index;
            } else {
              item['open'] = false;
              item['id'] = 'item_' + index;
            }
          })
          let _data = res.data.filter(elem => [2, 3, 5, 6].includes(elem.status));
          that.setData({
            rewardList: _data,
          })
        }
        that.setData({
          refreshed: false
        })
      }).catch(err => {

      })

    } else {
      //加载更多
      // param.issues = 1; //一期活动
      param.next = _nextOne; //一期活动
      that.getList(false, false).then(res => {
        console.log("getRankList:", res);
        if (res.code == 1) {

          that.setData({
            rewardList: list.concat(res.data),
            loadMore: false
          })
        } else {
          that.setData({
            noMore: true,
            loadMore: false
          })
        }

      }).catch(err => {

      })
    }
  },
  refresh: function () {
    // this.getData('refresh')
    this.initData()

  },
  loadMore: function () {
    console.log('loadMore');
    if (this.data.noMore) return;
    if (this.data.loadMore) return;
    this.setData({
      loadMore: true
    })
    setTimeout(() => {

      // this.getData('loadMore')
      this.initData()

    }, 500);
  },
  onBeforeBack: function () {
    wx.navigateBack({
      delta: 0,
    })
  },
  kindToggle(e) {
    const id = e.currentTarget.id
    let {
      actInfo,
      rewardList
    } = this.data
    // for (let i = 0, len = rewardList.length; i < len; ++i) {
    //   if (rewardList[i].id === id) {
    //     rewardList[i].open = !rewardList[i].open
    //   } else {
    //     rewardList[i].open = false
    //   }
    // }
    actInfo.open = !actInfo.open
    this.setData({
      rewardList,
      actInfo
    })
  },
  jumpTo: function () {
    return utils.navigateFrequentPage('pages/storeRank/rank/index')
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // this.getData('refresh')
    this.initData()
  },
  async initData() {
    try {

      // 获取活动信息
      let {
        actInfo
      } = await storeRankUtils.actInfo14();
      console.log("深圳兑奖raffle参与信息：", actInfo)
      let userInfo = wx.getStorageSync('userdata') || await utils.getUserInfoNew();

      if (actInfo) {
        actInfo.open = false;
        actInfo.kpi_num = utils.formatAmount(actInfo.kpi_num);
        this.setData({
          actInfo,
          refreshed: false
        })
        return
      }
      return this.setData({
        actInfo: null,
        refreshed: false

      })
    } catch (err) {
      console.error("initData err:", err);
    }

  },
  async initLoad(options) {
    try {
      let activeTab = 1;
      if(options.activeTab){
        activeTab = options.activeTab
      }
      let navBarSystem = await utils.getNavbarData();
      let {
        navBarHeight,
        statusBarHeight
      } = navBarSystem;
      let navbarHeight = navBarHeight + statusBarHeight;
      let screenHeight = '';
      let systemInfo = app.globalData.systemInfo;
      if (systemInfo) {
        screenHeight = systemInfo.windowHeight;
      }

      let userInfo = wx.getStorageSync('userdata') || await utils.getUserInfoNew();
      this.setData({
        screenHeight,
        navBarSystem,
        navbarHeight,
        userInfo,
        activeTab
      });

    } catch (error) {
      console.log("initLoad:", error);
    }
  },
  changeTab(event) {
    let {
      index
    } = event.currentTarget.dataset;
    this.setData({
      activeTab: +index
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    _nextOne = 1;
    issues = '';
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    issues = '';
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})