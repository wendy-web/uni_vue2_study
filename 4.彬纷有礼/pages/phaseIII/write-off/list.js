// pages/phaseIII//write-off/list.js
let utils = require("../../../utils/util");
let d_uid = '';
let reachBottom = '';
let requesting = false;
let next = 1;
let app = getApp();
const COS_URL = app.globalData.COS_URL;
const Api = require("../../../utils/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choosePop: false, //核销人员底部弹窗
    countCard: '', //卡券统计：order_2已核销，order_num 实际灌输
    list: [], //已核销列表
    // list: [1,2,3,4,5], //已核销列表
    noMore: false, //没有更多数据
    hnTitle: app.globalData.hnTitle,
    // 2023年9月19日 phaseIII的static 静态资源迁移至COS
    file_phase_static: `${COS_URL}/public/img/bfyl/phase/static`,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    next = 1;
    //获取掌柜店员信息
    utils.getShopInfo().then(data => {
      var boss = '';
      var crew = new Array();
      var member = data.member;
      for (var i = 0, len = member.length; i < len; ++i) {
        if (member[i]['condition'] == 1) {
          boss = member[i];
        } else {
          crew.push(member[i]);
        }
      }
      if (crew) {
        crew.forEach((item, index) => {
          let countTime = setTimeout(() => {
            var item_loaded = 'crew[' + index + '].loaded';
            that.setData({
              [item_loaded]: true
            })
            clearTimeout(countTime)
          }, (index + 1) * 220);
        });
      }
      this.setData({
        crew: crew,
        boss: boss
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getCountCard();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.data.noMore && this.data.list.length == 0) {
      var param = {
        status: 2
      }
      wx.showLoading({
        title: '正在加载',
        mask: true
      })
      this.getList(param, this.dataRefresh);

    }
  },
  /**
   * 已核销统计：order_2 已核销单
   * order_num 实际罐数
   * @param {*} 
   */
  getCountCard: function () {
    utils.getcountcard().then(res => {
      const {
        code,
        data,
        msg
      } = res;
      if (code == 1) {
        this.setData({
          countCard: data
        });
        return;
      }
      wx.showModal({
        title: '温馨提示',
        content: msg,
        showCancel: false
      })

    })
  },
  /**
   * 已核销订单：api/card/getpacklog
   * @param {
   * status 2已核销
   * d_uid  店员UID
   * next  下一页 默认1
   * 
   * } e 
   */
  getList: function (params, callback) {
    if (requesting) return
    Api.postBase({
      url: '/api/card/getpacklog',
      params
    }).then(res => callback(res));
  },
  //初始化/记载更多  数据处理
  dataProcess: function (data) {
    wx.hideLoading({
      success: (res) => {},
    })
    requesting = false;
    reachBottom = false;
    let newData = data.data.list;
    let list = this.data.list;
    let code = data.code;
    next = data.data.next ? data.data.next : 1;
    let limit = data.data.limit;
    if (newData) {
      this.setData({
        list: list.concat(newData),
      });
    }
    if (code == 0 || newData.length < limit) {
      return this.setData({
        noMore: true,
      });
    }
  },
  //下拉刷新重置数据
  dataRefresh: function (data) {
    let newData = data.data.list;
    let code = data.code;
    next = data.data.next;
    let limit = data.data.limit;
    if (newData) {
      this.setData({
        list: newData,
      });
    } else {
      next = 1;
      this.setData({
        list: [],
      });
    }
    wx.hideLoading({
      success: (res) => {},
    })
    requesting = false;
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
    if (code == 0 || newData.length < limit) {
      return this.setData({
        noMore: true,
      });
    }
  },
  //选择店员
  chooseCrew: function (e) {
    // wx.showLoading({
    //   title: '正在加载',
    //   mask: true
    // })
    var that = this;
    var uid = e.detail.currentTarget.dataset.uid;
    if (uid == 0) {
      var parameter = {
        status: 2
      }
    } else {
      var parameter = {
        d_uid: uid,
        status: 2
      }
      d_uid = uid;
    }
    console.log('当前参数：', parameter);
    this.setData({
      loadmore: true,
      choosePop: false,
      noMore: false,
    });
    console.log("请求参数：", parameter);
    this.getList(parameter, this.dataRefresh);

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  dropdown: function () {
    this.setData({
      choosePop: true
    });
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
    let param = {
      status: 2
    }
    d_uid = '';
    this.getList(param, this.dataRefresh);
    this.getCountCard();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let uid = d_uid;
    let param = {};
    if (uid) {
      param.d_uid = uid;
    }
    param.status = 2;
    param.next = next;
    console.log("onReachBottom 请求参数:", param);
    if (this.data.noMore || reachBottom) return;
    reachBottom = true;
    this.getList(param, this.dataProcess);
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})