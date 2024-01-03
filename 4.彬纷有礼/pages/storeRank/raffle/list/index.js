// pages/storeRank/raffle/list/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
import {
  mobList14
} from '../../../../api/storeRank/api';
import storeRankUtils from '../../../../api/storeRank/utils';
const utils = require("../../../../utils/util");
let params = {
  next: 1,
  win: 0
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarSystem: null, //导航栏高度
    autoLoad:true,//列表默认初始化
    pageList:1,//列表页码
    file_cos_url:`${COS_URL}/public/img/bfyl/2023/08`
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    utils.getNavbarData().then(res => {
      if (res) {
        let {
          navBarHeight,
          statusBarHeight
        } = res;
        let navbarHeight = navBarHeight + statusBarHeight;
        this.setData({
          navBarSystem: res,
          navbarHeight
        })
      }
    });
    this.initOptions(options);
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
  async initOptions(options) {
    try {
      let _act_info = '';
      let {
        actInfo = ''
      } = options;
      if (actInfo) {
        _act_info = JSON.parse(decodeURIComponent(actInfo))

      } else {
        let {
          actInfo
        } = await storeRankUtils.actInfo14();
        _act_info = actInfo
      }
      let {
        win
      } = _act_info;
      let raffle_code_arr= [];
      if(win){
        raffle_code_arr =String(win.lucky_number).split('');
      }
      this.setData({
        raffle_code_arr,
        actInfo: _act_info
      })
      console.log("_act_info:", _act_info)
    } catch (error) {
      console.log("initOptions err:", error)

    }
  },
  // pull-refresh组件触发：pageNum:1刷新||加载更多，endError,endSuccess:失败成功回调
  loadData(event) {
    console.log('loadData event:', event);
    let {
      pageNum,
      endError,
      endSuccess
    } = event.detail;
    // 第一页重置数据
    if (pageNum == 1) {
      this.setData({
        pageList: 1,
        list: []
      })
    }
    // 请求参数
    let param = {
      next: pageNum,
      limit:20,
      win: 0
    }
    let {
      list,
    } = this.data;
    mobList14(param).then(res=>{
      console.log("loadData 请求返回:", res);
      let {
        data,
        code
      } = res;
      if (data && data.length) {
        let next = pageNum +1;
        data.forEach(item =>{
          if(item.lucky_number){
            item.lucky_number  = String(item.lucky_number).padStart(10, '0');
          }
        });
        this.setData({
          pageList: next,
          list: list.concat(data)
        })
      }

      if((code == 0&&this.data.list.length) || this.data.list.length<20){
        endSuccess(1, pageNum)
        return
      }
      /**成功回调 */
      let size = data && data.length || 0;
      
      endSuccess(size, pageNum)
    }).catch(err=>{
      // 加载失败回调
      endError()
    });
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
  // 返回上一页：失败情况返回首页
  back: function () {
    wx.navigateBack({
      delta: 0,
      fail() {
        wx.switchTab({
          url: '/pages/tabBar/shouye/index',
        })
      }
    })
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
  onShareAppMessage() {

  }
})