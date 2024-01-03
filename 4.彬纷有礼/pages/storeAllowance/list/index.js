// pages/storeAllowance/list/index.js
const utils = require('../../../utils/util');
const app = getApp();
const COS_URL = app.globalData.COS_URL;
import {
  recLogs,
  count,
  salesman
} from '../api/index';
let params = {
  next: 1,
  start_time: '',
  end_time: '',
  status: '',
  source: '',
};
const initTypeArr = [{
    name: '全部',
    status: '-1',
    icon: '../static/icon_type_all.png',
  },
  {
    name: '获取',
    status: '100',
    icon: '../static/icon_type_cash.png'
  },
  {
    name: '使用',
    status: '2',
    icon: '../static/icon_type_deduction.png'
  },
  {
    name: '退回',
    status: '4',
    icon: '../static/icon_type_return.png'
  },
  {
    name: '过期',
    status: '5',
    icon: '../static/icon_type_expire.png'
  },
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_refresh: '../static/icon_refresh.png',
    icon_date: '../static/icon_date.png',
    bg_coupon: COS_URL + '/public/img/bfyl/202208/bg_coupon.png',
    icon_tt: '../static/icon_tt.png',
    bg_cash_footer: COS_URL + '/public/img/bfyl/202208/bg_cash_footer.png',
    img_no_record: COS_URL + '/public/img/bfyl/202208/img_no_record.png',
    icon_type: '../static/icon_type.png',
    list: [],
    total: null, //累计数据
    nomore: false, //暂无更多数据
    showDialog: false, //显示现金券规则
    selectDateRange: '', //选择的时期范围
    selectType: "选择类型", //选择的类型
    typeArr: initTypeArr, //类型数组
    calendarShow: false, //日历显示隐藏
    minDate: new Date(2022, 0, 1).getTime(), //设置日历最小选择日期
    typeSheetShow: false, //类型筛选显示隐藏
    telphone: '4008-7070-76',
    xjq_pop_bg: COS_URL + '/public/img/bfyl/202209/xjq_pop_bg.png',//现金券弹窗顶部背景
    xjq_pop_logo: COS_URL + '/public/img/bfyl/202209/xjq_pop_logo.png',//现金券弹窗顶部背景
    xjq_pop_tt: COS_URL + '/public/img/bfyl/202209/xjq_pop_tt.png',//现金券弹窗顶部背景
    salemanInfo:null,///业务员信息
    callPop:false,//拨打电话弹窗
    bg_wqf_right:`${COS_URL}/public/img/bfyl/2023/07/bg_wqf_right1.png`,// 微企付背景 2023年7月10日
    bg_wqf_left:`${COS_URL}/public/img/bfyl/2023/07/bg_wqf_left1.png`,// 微企付金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '加载中···',
    })
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
    params.next = 1;
    params.start_time = '';
    params.end_time = '';
    params.status = '';
    params.source = '';
    this.getcount().then(res => {
      this.getrecLogs(true)
    })
    //获取业务员信息
    this.getSalemanInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  //刷数据
  refresh() {
    params.next = 1;
    // params.start_time = '';
    // params.end_time = '';
    // params.status = '';
    // params.source = '';
    //刷新不需要重置筛选参数，页码可以重置为第1页
    wx.showLoading({
      title: '加载中',
    })
    this.getcount().then(res => {
      this.getrecLogs(true)
    })
  },
  //现金券领取记录
  getrecLogs(isRefresh = false) {
    recLogs(params).then(res => {
      let {
        code,
        msg,
        data
      } = res;
      wx.stopPullDownRefresh();
      wx.hideLoading({
        success: (res) => {},
      })
      if (code == 1) {
        params.next = data.next;
        data.list.forEach(item => {
          // 235:使用，退回，过期-号，其它带+号
          if(![2,3,5].includes(+item.status)){
            item.change = '+' +item.change;
            item.className ="text-green"
          }else{
            item.className ="text-red"

          }

        });
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
      count().then(res => {
        let {
          code,
          data
        } = res;
        if (code == 1) {
          let total = Number(data.balance) + Number(data.use_balance) + Number(data.expired_balance);
          data.total = total.toFixed(2);
          data.balance = utils.formatAmount(data.balance)
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
  //打开类型选择
  openTypeSheet() {
    this.setData({
      typeSheetShow: true

    })
  },
  //选择类型
  chooseType(event) {
    let {
      status,
      name
    } = event.currentTarget.dataset;
    console.log("选中的状态：", status, event);
    //获取数据，重置参数
    params.next = 1;
    params.status = status > -1 ? status : '';
    this.setData({
      typeSheetShow: false,
      selectType: name,
      list: [],
      nomore: false //获取数据，重置参数
    });
    //更新数据
    this.getrecLogs(true);
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
      typeSheetShow: false,
      callPop:false
    })
  },
  //拨打电话
  call(event) {
    this.setData({
      callPop:false
    })
    let {num} = event.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: num,
    }).then(res=>{
    }).catch(err=>{
    })
  },
  // 获取业务员信息
  getSalemanInfo(){
    salesman().then(res=>{
      let {code,data} =res;
      if(code==1){
        var reg = /^(\d{3})\d*(\d{4})$/;
        if(data.mobile){
          data.phoneStr = data.mobile.replace(reg,'$1****$2');
        }
        this.setData({
          salemanInfo:data
        })
      }
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
    params.status = '';
    params.source = '';
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
  // 去使用
  openCallPop(){
    this.setData({
      callPop:true
    })
  }
})