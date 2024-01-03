// pages/storeAllowance/clerkHelp/index.js
const utils = require('../../../utils/util');
const app = getApp();
const COS_URL = app.globalData.COS_URL;
import {
  helpLogs,
  helpCount
} from '../api/index';
let params = {
  next: 1,
  start_time: '',
  end_time: '',
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //自定义导航栏初始化
    background: 'linear-gradient(138deg,#ff9b60 1%, #d72019 96%)', //背景颜色
    img_no_record:COS_URL+'/public/img/bfyl/202208/img_no_record.png',
    bg_cash_help:COS_URL+'/public/img/bfyl/202208/bg_cash_help.png',
    iconTheme: 'white', //图标主题
    title: '助力现金券',
    icon_refresh: '../static/icon_refresh.png',
    icon_date: '../static/icon_date.png',
    list: [],
    total: null, //累计数据
    nomore: false, //暂无更多数据
    showDialog: false, //显示现金券规则
    selectDateRange: '', //选择的时期范围
    calendarShow: false, //日历显示隐藏
    minDate: new Date(2022, 0, 1).getTime(), //设置日历最小选择日期
    typeSheetShow: false, //类型筛选显示隐藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取用户信息
    var userdata = wx.getStorageSync('userdata');
    if (userdata) {
      console.log("缓存的用户信息：", userdata);
      this.setData({
        userdata: userdata
      });

    } else {
      utils.getUserInfoNew().then(res => {
        this.setData({
          userdata: res
        });
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    utils.getNavbarData().then(res => {
      if (res) {
        this.setData({
          navBarSystem: res,
        })
      }
    });
    params.next = 1;
    params.start_time = '';
    params.end_time = '';
    this.getcount().then(res => {
      this.getrecLogs(true)
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  //刷数据
  refresh() {
    params.next = 1;
    params.start_time = '';
    params.end_time = '';
    this.getcount().then(res => {
      this.getrecLogs(true)
    })
  },
  //现金券领取记录
  getrecLogs(isRefresh = false) {
    helpLogs(params).then(res => {
      let {
        code,
        msg,
        data
      } = res;
      wx.stopPullDownRefresh();
      if (code == 1) {
        params.next = data.next;
        //刷新数据
        if (isRefresh) {
          this.setData({
            list: data.list
          })
        } else {
          //加载更多
          this.setData({
            list: this.data.list.concat(data.list)
          })
        }
        if (data.list.length < data.list.limit) {
          this.setData({
            nomore: true
          })
        }
        return
      }
      this.setData({
        nomore: true
      })

    })
  },
  //现金券统计
  getcount() {
    return new Promise(resolve => {
      helpCount().then(res => {
        let {
          code,
          data
        } = res;
        if (code == 1) {
          let total = Number(data.zl_hx_box_balance) + Number(data.zl_zm_box_balance);
          data.total = total.toFixed(2)
          this.setData({
            total: data
          })
        }
        resolve()
      })
    })
  },
  //显示现金券规则
  showRule() {
    this.setData({
      showDialog: true
    })
  },

  //打开日期选择
  openCalendar() {
    this.setData({
      calendarShow: true
    })
  },
  formatDate(date) {
    date = new Date(date).getTime();
    return `${utils.parseTime(date,"{y}-{m}-{d}")}`;
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  // 选择日期
  chooseDate(event) {
    console.log(event)
    const [start, end] = event.detail;
    let start_time = this.formatDate(start);
    let end_time = this.formatDate(end);
    params.start_time = start_time;
    params.end_time = end_time;
    //获取数据，重置参数
    params.next = 1;
    this.setData({
      calendarShow: false,
      selectDateRange: `${start_time} - ${end_time}`,
      list: [],
      nomore: false //获取数据，重置参数
    });
    //更新数据
    this.getrecLogs(true);
  },
  //关闭dialog
  onClose() {
    this.setData({
      showDialog: false,
      calendarShow: false,
      typeSheetShow: false
    })
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
    params.next = 1;
    params.start_time = '';
    params.end_time = '';
    this.setData({
      nomore:false
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.refresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.nomore) return
    this.getrecLogs()
  },
  // 自定义导航栏 返回监听
  onBeforeBack: function () {
    wx.navigateBack({
      complete: (res) => {},
    })

  },
})