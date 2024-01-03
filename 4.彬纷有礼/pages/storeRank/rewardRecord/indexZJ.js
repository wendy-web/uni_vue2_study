// pages/storeRank//rewardRecord.js
let app = getApp();
let COS_URL = app.globalData.COS_URL;
const http = require('../../../utils/api');
const utils = require('../../../utils/util');
import storeRankUtils from '../../../api/storeRank/utils'

let _nextOne = 1;
let issues ='';
let statusClass = {
  '未开始':'dailingqu',
  '进行中':'yishouhuo',
  '未中奖':'dailingqu',
  '待领取':'dailingqu',
  '已领取':'daishouhuo',
  '已配送':'yishouhuo-titile',
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lanternImg:COS_URL+'/public/img/storeRank/20210121/lantern.png',
    refreshed: false, //下拉刷新未触发
    rewardList: false, //历史中奖列表
    loadMore: false, //正在加载更多
    noMore: false,
    rankInfo:null,//活动参与信息
    img_cos_url:`${COS_URL}/public/img/bfyl/2023/08/img`,//原有images静态文件移到cos上
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options&&options.issues){
      issues=options.issues;
      
    }else{
      issues = '';
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    utils.getNavbarData().then(res=>{
      if (res) {
        this.setData({
          navBarSystem:res,
        })
      }
    });
    let systemInfo = app.globalData.systemInfo;
    if (systemInfo) {
      let screenHeight = systemInfo.windowHeight;
      this.setData({
        screenHeight: screenHeight,
      });
    }
    utils.getUserInfoNew().then(data=>{
      console.log("getUserInfoNew:",data)
      that.setData({
        userInfo:data
      })
     
    }).catch(err=>{
      console.log("getUserInfoNew err:",err)
    })
  },
  getList: function (param, mask = true) {
    let that = this;
    return new Promise(function (resolve, reject) {
      http.post('/api/act/prizelog', param, mask).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err)
      }).catch(err=>{
        console.error("/api/act/prizelog catch:",err)
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
          res.data.forEach((item,index,arr)=>{
            if(issues&&issues == item.issue){
              item['open'] = true;
              item['id'] = 'item_' + index;
            }else{
              item['open'] = false;
              item['id'] = 'item_' + index;
            }
          })
          // let  _data = res.data.filter(elem => [2,3,5,6].includes(elem.status));
          let  _data = res.data.filter(elem => [2,3,5,6].includes(elem.status));
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
    let {rankInfo,rewardList} = this.data
    // for (let i = 0, len = rewardList.length; i < len; ++i) {
    //   if (rewardList[i].id === id) {
    //     rewardList[i].open = !rewardList[i].open
    //   } else {
    //     rewardList[i].open = false
    //   }
    // }
    rankInfo.open = !rankInfo.open
    this.setData({
      rewardList,
      rankInfo
    })
  },
  jumpTo:function(){
    let url = '/pages/storeRank/rank/index';
    //获取当前页面栈
    let pages = getCurrentPages() || [];
    if(pages.length){
      //查询排行榜页面索引
      let pageIndex = pages.findIndex(item=>item.route == 'pages/storeRank/rank');
      //找到索引的，返回至排行榜页（wx.navigateBack关闭当前页面）
      if(pageIndex>-1){
        wx.navigateBack({
          delta: pageIndex,
        })
        return
      }
    }
    //页面栈里无指定页面再跳转（小程序中页面栈最多10层，超出会报错：fail webview count limit exceed）
    if(url){
      wx.navigateTo({
        url: url,
      })
    }
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
        rankInfo
      } = await storeRankUtils.getActInfo();
      console.log("首页店铺排行榜参与信息：", rankInfo)
      let userInfo = wx.getStorageSync('userdata')|| await utils.getUserInfoNew();
      
      if (rankInfo) {
        rankInfo.open = false
        this.setData({
          rankInfo,
          refreshed:false
        })
        return
      }
      return this.setData({
        rankInfo: null,
        refreshed:false

      })
    } catch (err) {
      console.error("initData err:", err);
    }

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