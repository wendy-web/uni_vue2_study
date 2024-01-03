// pages/shopDisplay/displayRecord.js
let app = getApp();
let COS_URL = app.globalData.COS_URL;
const auth = require('../../utils/auth.js');
const utils = require('../../utils/util');
const http = require('../../utils/api');
const log = require('../../utils/log');
let _param = {}; //拍照记录传参
let _nomore = false; //有无更多数据
let _request = false; //重复请求
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], //拍照上传记录列表
    nomore: false, //有无更多记录
    icon_freezer: COS_URL + '/public/img/bfyl/202204/icon_freezer.png',
    icon_redbull: COS_URL + '/public/img/bfyl/202204/icon_redbull.png',
    icon_hook_max: COS_URL + '/public/img/bfyl/202204/icon_hook_max.png',
    userInfo: null, //用户信息，默认取缓存
    icon_circle: COS_URL + '/public/img/bfyl/202204/icon_circle.png',
    icon_fork: COS_URL + '/public/img/bfyl/202204/icon_fork.png',
    icon_hook: COS_URL + '/public/img/bfyl/202204/icon_hook.png',
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
    let userInfo = this.getUserInfo();
    console.log("用户信息111：", userInfo);
    this.getActInfo().then(res => {
      console.log("活动参与信息：", res);
      if (+res.code == 1) {
        this.setData({
          actInfo: res.data
        })
        _param.next = 1;
        // _param.act_id = res.data.act_id;
        this.getUploadLog(_param, 1);
      } else {
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false,
        })
      }

    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //获取参与信息
  getActInfo: function () {
    return utils.act3_getinfo();
  },
  /**
   * 获取陈列拍照记录
   * 参数：next下一页
   * limit页数
   * type:1刷新，2加载更多
   */
  getUploadLog: function (param, type = 2) {
    if (_request) return;
    _request = true;
    console.log("/api/act3/uploadLog传参：", param);
    param.act_id = this.data.actInfo.act_id;
    http.post('/api/act3/uploadLog', param).then(res => {
      _request = false;
      console.log("/api/act3/uploadLog:", res);
      if (+res.code == 1) {
        let data = res.data;
        _param.next = data.next;
        let list = data.list;
        Object.keys(list).forEach(item => {
          list[item] = list[item].reverse();
        })

        let limit = data.limit;
        let length = list.length;
        if (length < limit) {
          _nomore = true;
        } else {
          _nomore = false;
        }
        //刷新
        if (type == 1) {
          wx.stopPullDownRefresh({
            success: (res) => {},
          })
          this.setData({
            list: list,
            nomore: _nomore
          })
          return
        }
        //加载更多
        this.setData({
          list: this.data.list.concat(list),
          nomore: _nomore
        })
        return
      }
      _param.next = 1;
      this.setData({
        list: []
      })
    }).catch(err => {
      _request = false;
      console.error("/api/act3/uploadLog：", err);
    })
  },
  //折叠菜单
  kindToggle: function (e) {
    var id = e.currentTarget.id;
    var idx = e.currentTarget.dataset.idx;
    var oldopen = this.data.oldopen;
    console.log("oldopen:", oldopen);
    console.log("id:", id);
    console.log("idx:", idx);
    if (oldopen != id) {
      oldopen = id
    } else {
      oldopen = null;
    }
    this.setData({
      oldopen: oldopen
    });

  },
  // 获取用户信息
  async getUserInfo() {
    let userInfo = null;
    if(wx.getStorageSync('userdata')){
      userInfo=wx.getStorageSync('userdata');
    }else{
      userInfo=await utils.getUserInfoNew();
    }
    this.setData({
      userInfo
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
    _request = false;
    _param.next = 1;
    _nomore = false;
    this.getActInfo().then(res => {
      console.log("活动参与信息：", res);
      if (+res.code == 1) {
        this.setData({
          actInfo: res.data
        })
        this.getUploadLog(_param, 1);
      } else {
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false,
        })
      }

    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //无数据或者重复请求
    return;
    if (_nomore || _request)
      this.getUploadLog(_param);
  },
  //预览图片
  previewImg: function (e) {
    var url = e.currentTarget.dataset.path;
    wx.previewImage({
      urls: [url],
    })
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})