const app = getApp();
const utils = require("../../../../utils/util");
const COS = getApp().globalData.COS_URL;
//等待时间 只负责接受时间
let _wait_date = []
//页码	
let _next = 1
//当前loading
let _ISLOADING = false;
import {
  scan23getUser,
  scan23excLogs
} from "../../../../api/exchange/index";
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
    hideCalendar: false,
    dateIcon: COS + '/public/img/phaseIII/202104/help_date_icon.png',
    hbNodataIcon: COS + '/public/img/phaseIII/202104/hb_noData.png',
    icon_delta_down: COS + '/public/img/bfyl/202301/icon_delta_down.png',
    icon_delta_up: COS + '/public/img/bfyl/202301/icon_delta_up.png',
    excValue: 0, //默认类型,类型筛选：1换购奖励，2兑换奖励
    excTitle: "类型筛选",
    excPop: false,
    excCount: null, //统计信息
    activeType: 0, // 全部类型 2023年8月12日 
    activeCrew: 'uid_all', // 人员筛选：默认全部
    can_filter_crew: true, //是否可以筛选店员，默认true
    cashcoupon_file_url: `${COS}/public/img/bfyl/2023/08/cashCoupon`, // cos 资源地址
    shopInfo: null, //店铺消息
    crew: [], //店员信息
    act_uid:'',//选中的店员id
    typeTitle:'全部类型',// 默认全部类型的时候 显示 类型筛选
    refreshed:false,//下拉刷新未触发
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {



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
    }
    let {act_uid,activeType} = this.data;
    if (act_uid&&act_uid != 'all') {
      parmas.act_uid = act_uid
    }
    if(activeType&&activeType!=0){
      parmas.source = activeType
    }
    console.log("getData 传参：", parmas);
    /**请求数据 */
    scan23excLogs(parmas).then(res => {
      console.log("getData return:", res);
      _ISLOADING = false;
      let data = this.data.listData;
      console.log("_next:", _next)
      if (_next === 1) data = [] //页码为1时清空数据
      if (res.code == 1) {
        //处理数据
        res.data.list.forEach(function (item) {
          
          if (item.source == 1) {
            item.exc_name1 = '扫码人'
            item.exc_name2 = '换购时间'
          }
          if (item.source == 2) {
            item.exc_name1 = '兑换人'
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
    this.initData()
   
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
  openExcType() {
    this.setData({
      excPop: true
    })
  },
  selectExcType(event) {
    let {
      item
    } = event.currentTarget.dataset;
    this.setData({
      excPop: false,
      excValue: item.value,
      excTitle: item.name
    })
    _next = 1 //页码清零
    this.getData();
  },
  // 统计接口
  getExcCount() {

    scan23getUser().then(res => {
      let {
        code,
        data
      } = res;
      if (code == 1) {
        
        this.setData({
          excCount: data
        })
      }
    })
  },
  // 前往我的可用卡券：根据红牛，战马打开对应tab
  jumpToMyCoupon() {
    wx.navigateTo({
      url: '/pages/phaseIII/voucher/index',
    })
  },
  async initData() {
    //获取用户信息
    try {
      var userdata = wx.getStorageSync('userdata') || await utils.getUserInfoNew();
      let shopInfo = await utils.getShopInfo();
      if (shopInfo) {
        console.log("店铺信息：", shopInfo);
        let crew = []
        let member = shopInfo.member||[];
        if (member.length > 1) {
          crew = member.filter(item => {
            if (item.condition != 1) {
              return item
            }
          })

        }
        this.setData({
          crew:member,
          shopInfo
        })
      }

    } catch (error) {
      console.log("onLoad catch error:", error);
    }
    this.setData({
      userdata: userdata
    });
    this.getExcCount();
    this.getData();
  },
  // 去兑换
  goToExc() {
    let {
      excCount,
      shopInfo
    } = this.data;
    // 先判断店铺信息
    if (!shopInfo) {
      wx.showModal({
        title: '温馨提示',
        content: '请先创建店铺',
        success:(res)=>{
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/zhongduan/geren/mendian/renzhen/index?hide=1',
            })
          }
        }
      })
      return
    }
    wx.navigateTo({
      url: `/pages/storeAllowance/cashorCoupon/exchange/redeem?&available=${excCount.available}`,
    })
  },
  onClose() {
    this.setData({
      excPop: false
    })
  },
  chooseType: function (e) {
    let val = e.currentTarget.dataset.val;
    let title = e.currentTarget.dataset.title;
    this.setData({
      activeType: val,
      typeTitle: title,
      noMore: false,
    })
    let {act_uid} = this.data;
    if(act_uid == null)return;
    this.setData({
      excPop:false
    })
    _next = 1;
    this.getData();
  },
  chooseCrew: function (e) {
    let { val } = e.currentTarget.dataset;
   
    this.setData({
      activeCrew: "uid_" + val,
      act_uid:val
    })
    let {activeType} =this.data;
    if(activeType == null) return;
    this.setData({
      excPop:false
    })
    _next = 1;
    this.getData();
  },
  // 下拉刷新
  pullRefresh(){
    _next= 1;
    this.setData({
      selectData:{
        last:'',
        now:''
      },
      act_uid:'all',
      activeCrew: "uid_all",
      activeType: 0,
      typeTitle: '全部类型',
    });
    this.getExcCount();
    this.refreshData();
  },
  //刷新数据
  refreshData() {
    //防止连续调用重复数据
    if (_ISLOADING) return
    _ISLOADING = true;
    /**配置请求参数 */
    let parmas = {
      next: _next,
      start_time: '',
      end_time: '',
    }
   
    console.log("refreshData 传参：", parmas);
    /**请求数据 */
    scan23excLogs(parmas).then(res => {
      console.log("refreshData return:", res);
      _ISLOADING = false;
      let data = this.data.listData;
      console.log("_next:", _next)
      if (_next === 1) data = [] //页码为1时清空数据
      if (res.code == 1) {
        //处理数据
        res.data.list.forEach(function (item) {
          
          if (item.source == 1) {
            item.exc_name1 = '扫码人'
            item.exc_name2 = '换购时间'
          }
          if (item.source == 2) {
            item.exc_name1 = '兑换人'
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
          refreshed:false
        })
        return
      }
      if (res.code == 0) {

        this.setData({
          _IS_DATA_BOTTOM: true,
          refreshed:false
        })
        if (_next == 1) {
          this.setData({
            listData: [],
          })
        }
      }
    }).catch(() => {
      _ISLOADING = false
      this.setData({
        refreshed:false
      })
    })
  },
})