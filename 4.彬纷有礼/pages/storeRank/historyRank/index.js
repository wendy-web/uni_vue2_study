// pages/storeRank//historyRank.js
let app = getApp();
let COS_URL = app.globalData.COS_URL;
const http = require('../../../utils/api');
const utils = require('../../../utils/util');
let _request = false;
let _nextOne = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lantern: COS_URL + "/public/img/storeRank/20210121/lantern.png",
    refreshed: false, //下拉刷新未触发
    historyList: [], //历史中奖列表
    loadMore: false, //正在加载更多
    noMore: false,
    act_issues: '',
    img_cos_url:`${COS_URL}/public/img/bfyl/2023/08/img`,//原有images静态文件移到cos上
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    utils.getNavbarData().then(res => {
      if (res) {
        this.setData({
          navBarSystem: res,
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
    if (app.globalData.act_time) {
      this.setData({
        act_issues: app.globalData.act_time.issues
      })
    } else {
      utils.isHide().then(data => {
        app.globalData.act_time = data.act_time;
        this.setData({
          act_issues: data.act_time.issues
        })
      })
    }
  },
  //获取当前用户活动信息
  getApplyInfo: function () {
    let that = this;
    return new Promise(function (resolve, reject) {
      http.post('/api/act/myrank', false).then(res => {
        if (res.code == 1) {
          that.setData({
            applyInfo: res.data
          })
          resolve(res)
        }


      }).catch(err => {

      })
    });
  },
  getRankList: function (param, mask = true) {
    let that = this;
    return new Promise(function (resolve, reject) {
      http.post('/api/act/alllist', param, mask).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      });
    })
  },
  getData: function () {
    let that = this;
    //期数自增
    _nextOne = _nextOne + 1;
    //达到当前期数
    // console.log(_nextOne)
    // if (_nextOne >= this.data.act_issues) {
    //   return
    // }
    //请求参数
    let params = {
      // issues: _nextOne,
      // limit: 26
    };
    let applyInfo = that.data.applyInfo;
    let userInfo = wx.getStorageSync('userdata');
    that.getRankList(params, false).then(res => {

      if (res.code == 1) {
        let keys = Object.keys(res.data).reverse()

        // let NewObj = keys.map((item, index) => {
        //   let arr = res.data[item][0]
        //   arr.forEach((item, index) => {
        //     if(applyInfo && applyInfo.uid){
        //       if(applyInfo.uid != item.uid){
        //         item.shop_name = utils.parseStringToStar(item.shop_name);
        //       }
        //     }else if(userInfo&&userInfo.id){
        //       if(userInfo.id != item.uid){
        //         item.shop_name = utils.parseStringToStar(item.shop_name);
        //       }
        //     }
        //   })

        //   return {
        //     name: utils.padLeft(index + 1, 3),
        //     data: arr
        //   }
        // })
        res.data.forEach((item, index) => {
          item.issue = utils.padLeft(item.issue, 3);
          item.list.forEach(items => {
            if (applyInfo && applyInfo.uid) {
              if (applyInfo.uid != items.uid) {
                items.shop_name = utils.parseStringToStar(items.shop_name);
              }
            }
          
          })
        })
        console.log(res.data);

        that.setData({
          historyList: res.data,
          loadMore: false,
          refreshed: false
        })
        return
      }

      that.setData({
        noMore: true,
        loadMore: false
      })
    })
  },
  refresh: function () {
    //清空页码
    _nextOne = 0
    //清空数据
    this.setData({
      historyList: []
    })
    //发起请求
    this.getData()
  },
  loadMore: function () {
    console.log('loadMore');
    if (this.data.noMore) return;
    if (this.data.loadMore) return;
    this.setData({
      loadMore: true
    })
    setTimeout(() => {

      this.getData('loadMore')
    }, 500);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getApplyInfo().then(res=>{

      this.getData();
    });
   

  },
  back: function () {
    wx.navigateBack({
      delta: 0,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    _nextOne = 1;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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