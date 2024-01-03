const app = getApp();
const utils = require("../../../utils/util");
const COS = getApp().globalData.COS_URL;
//等待时间 只负责接受时间
let _wait_date = []
//页码	
let _next = 1
//当前loading
let _ISLOADING = false
import {excCount,excLogs} from "../../../api/exchange/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    COS: COS,
    _IS_DATA_BOTTOM: false, //到底状态
    listData: [], //列表数据
    dateDialog: false, //日期弹窗
    selectData: { //日期范围
      now: "",
      last: ""
    },
    showTypePop: false, //类型选择弹窗，默认隐藏
    hideCalendar:false,
    dateIcon:COS+'/public/img/phaseIII/202104/help_date_icon.png',
    hbNodataIcon:COS+'/public/img/phaseIII/202104/hb_noData.png',
    img_banner_bg:COS+'/public/img/bfyl/202301/img_banner_bg.png',
    img_banner:COS+'/public/img/bfyl/202301/img_banner.png',
    icon_delta_down:COS+'/public/img/bfyl/202301/icon_delta_down.png',
    icon_delta_up:COS+'/public/img/bfyl/202301/icon_delta_up.png',
    excValue:0,//默认类型,类型筛选：1换购奖励，2兑换奖励
    excTitle:"类型筛选",
    excPop:false,
    excOptions:[
      {name:"兑换奖券",value:2},
      {name:"换购奖励",value:1}
    ],
    excCount:null,//统计信息
    excType:1,//默认1红牛 2战马 
    excMap:{
      1:{
        name:'红牛',
        coupon:'奖励券'
      },
      2:{
        name:'战马',
        // coupon:'战马换购券'
        coupon:'奖励券'
      }
    },
    img_banner_bg_hn:COS+'/public/img/bfyl/202302/img_banner_bg_hn.png',
    img_banner_bg_hn1:COS+'/public/img/bfyl/202302/img_banner_bg_hn1.png',
    img_banner_bg_hn2:COS+'/public/img/bfyl/202302/img_banner_bg_hn2.png',
    refreshed: false, //下拉刷新未触发

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 预留：红牛的入口
    if(options.type){
      this.setData({
        excType:options.type
      })
    }
    let that = this;
    //获取用户信息
    var userdata = wx.getStorageSync('userdata');
    if (userdata) {
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
  //下拉处理
  scrolltolower() {
    if (_ISLOADING || this.data._IS_DATA_BOTTOM) return
    _next++;
    this.getData()
  },
  //获取数据
  getData(refresh) {
    //防止连续调用重复数据
    if (_ISLOADING) return
    _ISLOADING = true;
    /**配置请求参数 */
    let parmas = {
      next: _next,
      start_time: this.data.selectData.last,
      end_time: this.data.selectData.now,
      type:this.data.excType,//1红牛，2战马
    }
    if(this.data.excValue){
      parmas.source = this.data.excValue
    }
    // console.log("getData 传参：", parmas);
    /**请求数据 */
    excLogs(parmas).then(res => {
      // console.log("getData return:", res);
      _ISLOADING = false;
      let data = this.data.listData;
      if (_next === 1) data = [] //页码为1时清空数据
      if (res.code == 1) {
        //处理数据
        res.data.list.forEach(function (item) {
          if(item.change>0){
            let exc_num = parseInt(item.change/0.15);
            item.exc_num = exc_num;
          }
          if (item.source == 1) {
            item.exc_name1 = '换购用户'
            item.exc_name2 = '换购时间'
          }
          if (item.source == 2) {
            item.exc_name1 = '兑换用户'
            item.exc_name2 = '兑换时间';
           
          }
        })
        //数据拉取完了
        this.data._IS_DATA_BOTTOM = res.data.list.length < 10
        //设置数据
        data = data.concat(res.data.list)
        this.setData({
          listData: data,
          _IS_DATA_BOTTOM: this.data._IS_DATA_BOTTOM
        })
        return
      }
      if (res.code == 0) {

        this.setData({
          // listData: [],
          _IS_DATA_BOTTOM: true
        })
        if (_next == 1) {
          this.setData({
            listData: [],
          })
        }
      }
    }).catch(() => {
      _ISLOADING = false
    })
  },
  /**选择日期范围 */
  selectDate() {
    this.setData({
      dateDialog: true
    })
  },
  /** 关闭 日期弹窗*/
  closeDateDialog() {
    this.setData({
      dateDialog: false
    })
  },
  /** 日期选择响应*/
  onRangePick(event) {
    _wait_date = event.detail
  },
  /** 确定筛选 */
  chooseDate() {
    if (_wait_date && _wait_date.length > 1) {
      //发起查询
      _next = 1 //页码清零
      this.data._IS_DATA_BOTTOM = false
      this.setData({
        selectData: {
          now: _wait_date[1],
          last: _wait_date[0]
        },
        dateDialog: false,
        _IS_DATA_BOTTOM: this.data._IS_DATA_BOTTOM
      })
      this.getData()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     //获取统计、列表数据
     this.getExcCount();
     this.getData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    _next = 1;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    _next = 1;
  },

  chooseType: function () {
    this.setData({
      showTypePop: true
    });
  },
  openExcType(){
    let {excPop} = this.data;
    excPop = !excPop
    this.setData({
      excPop
    })
  },
  selectExcType(event){
    let {item} = event.currentTarget.dataset;
    this.setData({
      excPop:false,
      excValue:item.value,
      excTitle:item.name
    })
    _next = 1 //页码清零

    this.getData();
  },
  // 统计接口
  getExcCount(){
    let {excType} = this.data;
    excCount().then(res=>{
      let {code,data} = res;
      if(code == 1){
        // 红牛
        if(excType ==1){
          data.available = data.hn_available;
          data.total_earned = Number(data.hn_available) + Number(data.hn_used);
          data.awards_times = data.hn_exc_num;
          data.total_exc = data.hn_card_num;
        }
        // 战马
        if(excType == 2){
          data.available = data.zm_available;
          data.total_earned =  Number(data.zm_available) + Number(data.zm_used);
          data.awards_times = data.zm_exc_num;
          data.total_exc = data.zm_card_num;
        }
        this.setData({
          excCount:data
        })
      }
    })
  },
  // 前往我的可用卡券：根据红牛，战马打开对应tab
  jumpToMyCoupon(){
    let {excType} = this.data;
    wx.navigateTo({
      url: '/pages/phaseIII/voucher/index',
    })
  },
  // 去兑换
  goToExc(){
    let {excType,excCount} = this.data;
    wx.navigateTo({
      url: `/pages/warhorse/exchange/redeem?exc_type=${excType}&available=${excCount.available}`,
    })
  },
  // 换购券红牛、战马切换
  excTabChange(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      excType: index
    })
    this.getExcCount();
    this.getData();
  },
  // 上拉刷新
  pullRefresh(){
    this.setData({
      excValue:'',
      excTitle:'类型筛选',
      selectData: { //日期范围
        now: "",
        last: ""
      },
    })
    this.getExcCount();
    _next = 1;
    this.refreshData()
  },
  refreshData(){
    //防止连续调用重复数据
    if (_ISLOADING) return
    _ISLOADING = true;
    /**配置请求参数 */
    let parmas = {
      next: 1,
      start_time: this.data.selectData.last,
      end_time: this.data.selectData.now,
      type:this.data.excType,//1红牛，2战马
    }
    if(this.data.excValue){
      parmas.source = this.data.excValue
    }
    /**请求数据 */
    excLogs(parmas).then(res => {
      _ISLOADING = false;
      let data = this.data.listData;
      if (_next === 1) data = [] //页码为1时清空数据
      if (res.code == 1) {
        //处理数据
        res.data.list.forEach(function (item) {
          if(item.change>0){
            let exc_num = parseInt(item.change/0.15);
            item.exc_num = exc_num;
          }
          if (item.source == 1) {
            item.exc_name1 = '换购用户'
            item.exc_name2 = '换购时间'
          }
          if (item.source == 2) {
            item.exc_name1 = '兑换用户'
            item.exc_name2 = '兑换时间';
           
          }
        })
        //数据拉取完了
        this.data._IS_DATA_BOTTOM = res.data.list.length < 10
        //设置数据
        data = res.data.list;
        this.setData({
          listData: data,
          _IS_DATA_BOTTOM: this.data._IS_DATA_BOTTOM,
            refreshed: false, //下拉刷新未触发
        })
        return
      }
      if (res.code == 0) {

        this.setData({
          // listData: [],
          _IS_DATA_BOTTOM: true,
          refreshed: false, //下拉刷新未触发
        })
        if (_next == 1) {
          this.setData({
            listData: [],
          })
        }
      }
    }).catch(() => {
      _ISLOADING = false;
      this.setData({
        refreshed: false, //下拉刷新未触发
      })
    })
  }
})