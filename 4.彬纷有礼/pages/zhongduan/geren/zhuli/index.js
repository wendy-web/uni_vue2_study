// pages/warhorse//hongbao-record/index.js
const api = require("../../../../utils/api");
const utils = require("../../../../utils/util");
const auth = require("../../../../utils/auth");
const COS = getApp().globalData.COS_URL;
//等待时间 只负责接受时间
let _wait_date = [];

//二级类型type
let _TYPE_LIST_DATA = 0
//页码
let _next = 1
let _next2in1 = 1
//当前loading
let _ISLOADING = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    redpacketcount: {
      hn: 0,
      zm: 0,
      all: 0
    }, //顶部统计
    RECORD_TYPE: 0, //0全部，1红牛，2,战马，3无数据
    // query_type: false, //false红牛,true战马
    query_type: 1, //1红牛,2战马
    dateDialog: false, //日期弹窗
    selectData: { //日期范围
      now: "",
      last: ""
    },
    halfScreenDialog: false, //统一类型弹窗
    halfScreenList: [], //统一类型列表
    halfScreenDialogTitle: '', //统一类型标题
    listData: [], //助力记录列表
    _IS_DATA_BOTTOM: false,
    COS: COS,
    statistics_tipsImg: "../../static/statistics-tips.png",
    red_hn_iconImg: "../../static/red_hn_icon.png",
    red_money_logoImg: "../../static/red_money_logo.png",
    red_zm_iconImg: "../../static/red_zm_icon.png",
    red_money_logoImg: "../../static/red_money_logo.png",
    haveEnjoyData: false,
    adShow: false,
    popImg: '',
    helpBg: COS + '/public/img/phaseIII/202104/help_bg.png',
    helpMaskone: COS + '/public/img/phaseIII/202104/help_mask.png',
    helpMask: COS + '/public/img/phaseIII/202104/all_type_bg.png',
    hnIcon: COS + '/public/img/WarHorse/0917/red_hn_icon.png',
    zmIcon: COS + '/public/img/WarHorse/0917/red_zm_icon.png',
    dateIcon: COS + '/public/img/phaseIII/202104/help_date_icon.png',
    hbNodataIcon: COS + '/public/img/phaseIII/202104/hb_noData.png',
    img_nopoint: COS + "/public/img/bfyl/assets/hongbao/nopoint.png",
    pageReady: false, //页面预备好了
    refreshed: false, //scroll-view 刷新
    hn2in1_tab_active: 1, //默认1 红牛箱内码，2：2元红包助力记录
    list2y: [], //2元记录
    refreshed2y: false, //2元记录的刷新标识符
    list2y_nomore: false, //2元列表没有更多记录
    _haveEnjoyData:false,//已请求
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //清空数据
    _TYPE_LIST_DATA = '';
    _next = 1;
    //设置默认时间
    // this.setData({
    //   selectData: utils.getLastMonth()
    // })
    this.initOptions(options)
  },
  changeType(e) {
    // this.data.query_type = !this.data.query_type
    let query_type = e.currentTarget.dataset.type;

    console.log("query_type:", query_type);
    this.setData({
      // query_type: this.data.query_type
      query_type: query_type
    })
    _next = 1 //每次条件变化页码清零
    _TYPE_LIST_DATA = 4;
    this.data._IS_DATA_BOTTOM = false
    this.setData({
      _IS_DATA_BOTTOM: this.data._IS_DATA_BOTTOM
    })
    this.getbalancelog() //拉去数据
  },
  initData() {
    //助力界面统计
    api.post('/api/user/gethelpcount').then(res => {
      console.log("/api/user/getredpacketcount:", res);
      let count = 0,
        type = 3,
        all = 0,
        // query_type = false;
        query_type = 1;
      if (res.code == 1) {
        //红牛
        if (res.data.hn > 0) {
          all += res.data.hn;
          count++;
          type = 1;
          res.data.hn = this.filterMoney(res.data.hn);
          // query_type = false;
          query_type = 1;
        };
        //战马
        if (res.data.zm > 0) {
          all += res.data.zm;
          count++;
          type = 2;
          res.data.zm = this.filterMoney(res.data.zm);
          // query_type = true;
          query_type = 2;
        };
        //全部
        if (count === 2) {
          type = 0;
          res.data.all = this.filterMoney(all);
          // query_type = false;
          query_type = 1;
        };
        this.data.query_type = query_type
        console.log("initData type: ", type);
        console.log("initData query_type: ", query_type);
        console.log("redpacketcount:", res.data);
        //设置数据
        this.setData({
          RECORD_TYPE: type,
          query_type: query_type,
          redpacketcount: res.data
        })
        // 根据hn2in1_tab_active
        let {
          hn2in1_tab_active
        } = this.data;
        if (hn2in1_tab_active == 1) {
          this.getbalancelog();
        } else {
          this.loadMore();
        }
        return
      }
      //设置默认类型
      this.setData({
        RECORD_TYPE: 0
      })
    })
  },
  //获取店员
  getClerk() {
    api.post('/api/shop/getInfo').then(res => {
      if (res.code == 1) {
        _clerk_list = (res.data.member || []).map(function (item) {
          return {
            img: item.avatar_url,
            name: item.nick_name,
            uid: item.uid
          }
        })
        return
      }
      _clerk_list = []
    })
  },
  getEnjoyData: function () {
    var that = this;
    let {
      listData
    } = this.data;
    let userdata = wx.getStorageSync('userdata');
    let _sid = userdata.shop_id
    let params = {
      sid: _sid,
      limit: 1
    }
    return api.post('/api/pay/getpaylog', params).then(res => {
      console.log("getEnjoyData return:", res);
      if (res.code == 1) {
        that.setData({
          haveEnjoyData: true,
          _haveEnjoyData: true
        });
        // 2023年1月11日 如果列表也无数据就跳转到换购记录页面
        // if(!listData.length){
        //   wx.redirectTo({
        //     url: '/pages/zhongduan/geren/storesRecord/index',
        //   })
        //   return
        // }
        that.setData({
          pageReady: true
        });
      }else{
        that.setData({
          _haveEnjoyData: true
        });
      }

    }).catch(() => {

    })
  },
  //滚动到底部加载
  scrolltolower() {
    if (_ISLOADING || this.data._IS_DATA_BOTTOM) return
    _next++;
    this.getbalancelog()
  },
  //任务点击
  tastOpen(event) {
    let result = this.data.listData[event.currentTarget.dataset.index - 0];
    if (result.isIcon) {
      result.isOpen = !result.isOpen
      this.setData({
        listData: this.data.listData
      })
    }
  },
  //获取助力记录 
  getbalancelog() {
    //防止连续调用重复数据
    if (_ISLOADING) return
    _ISLOADING = true;
    //配置参数
    let parmas = {
      start_time: this.data.selectData.last,
      end_time: this.data.selectData.now,
      source: this.data.query_type,
      next: _next
    }
    console.log("请求参数：", parmas);
    //获取数据
    api.post('/api/user/gethelplog', parmas).then(res => {
      console.log("请求返回：", res);
      _ISLOADING = false
      let data = this.data.listData;
      if (_next === 1) data = [] //页码为1时清空数据
      if (res.code == 1) {
        //处理数据
        res.data.list.forEach(function (item) {
          item.isIcon = false;
          if (item.task && item.task.length > 0) {
            item.isOpen = false;
            item.isIcon = true;
          }
        })
        this.data._IS_DATA_BOTTOM = res.data.list.length < res.data.list.limit;
        //设置数据
        data = data.concat(res.data.list)
        this.setData({
          listData: data,
          _IS_DATA_BOTTOM: this.data._IS_DATA_BOTTOM,
          pageReady: true,
          refreshed: false
        })

        return
      }
      this.data._IS_DATA_BOTTOM = true
      this.setData({
        listData: data,
        _IS_DATA_BOTTOM: true,
        pageReady: true,
        refreshed: false

      })
      if (!this.data._haveEnjoyData) {
        this.getEnjoyData();
      }
    }).catch(() => {
      _ISLOADING = false
      this.setData({
        refreshed: false
      })
    })
  },

  //金钱过滤
  filterMoney(money) {
    if (money > 9999) {
      return (money / 10000).toFixed(2) + '万'
    }
    return money.toFixed(2)
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
      this.setData({
        selectData: {
          now: _wait_date[1],
          last: _wait_date[0]
        },
        dateDialog: false
      })
      let {
        hn2in1_tab_active
      } = this.data;
      if (hn2in1_tab_active == 1) {
        //发起查询
        _next = 1 //页码清零
        this.data._IS_DATA_BOTTOM = false
        this.setData({
          _IS_DATA_BOTTOM: this.data._IS_DATA_BOTTOM
        })
        this.getbalancelog()
      } else {
        this.setData({
          list2y_nomore: false
        })
        _next2in1 = 1;
        this.loadMore()
      }
    }
  },
  goHistory: function (e) {
    var type = e.currentTarget.dataset.type;
    wx.showLoading({
      title: '正在加载',
    })
    wx.navigateTo({
      url: '/pages/zhongduan/geren/history/index?type=' + type
    });
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
    let cosAddress = auth.getCosAddress();
    if (cosAddress) {
      let redbull = cosAddress.A9.value;
      let popImg = [];
      popImg[0] = redbull[Math.floor((Math.random() * redbull.length))];
      this.setData({
        adShow: true,
        popImg
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.hideLoading({
      success: (res) => {},
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    _next=1;
    _next2in1 =1;
    this.setData({
      selectData: {
        now: '',
        last: ''
      },
      list2y_nomore: false,
      _IS_DATA_BOTTOM: false,
    })
  },
  // 刷新数据
  refresh() {
    let {
      hn2in1_tab_active
    } = this.data;
    this.setData({
      selectData: {
        now: '',
        last: '',
        refreshed: true
      }
    })
    // 随机红包
    if (hn2in1_tab_active == 1) {
      _next = 1;
    } else {
      // 固定红包
      _next2in1 = 1
    }
    this.initData()
  },
  hn2in1TabChange(event) {
    let {
      type
    } = event.currentTarget.dataset;
    this.setData({
      hn2in1_tab_active: type
    })
    if (!this.data.list2y.length) {
      _next2in1 = 1;
      this.loadMore()
    }
  },
  // 固定红包加载更多
  loadMore() {
    //防止连续调用重复数据
    if (_ISLOADING) return
    _ISLOADING = true;
    //配置参数
    let parmas = {
      start_time: this.data.selectData.last,
      end_time: this.data.selectData.now,
      next: _next2in1,
      limit: 10,
    }
    console.log("请求参数：", parmas);
    //获取数据
    api.post('/api/scan23/getHelpScan', parmas).then(res => {
      console.log("请求返回：", res);
      _ISLOADING = false
      let data = this.data.list2y;
      if (_next2in1 === 1) data = [] //页码为1时清空数据
      if (res.code == 1) {
        _next2in1 = res.data.next;
        let list2y_nomore = res.data.list.length < res.data.limit ? true : false;
        //设置数据
        data = data.concat(res.data.list)
        this.setData({
          list2y: data,
          list2y_nomore,
          pageReady: true,
          refreshed2y: false
        })

        return
      }
      this.setData({
        list2y: data,
        list2y_nomore: true,
        refreshed2y: false
      })

    }).catch(() => {
      _ISLOADING = false
      this.setData({
        refreshed2y: false
      })
    })
  },
  scrolltolower2y() {
    if (_ISLOADING || this.data.list2y_nomore) return;
    this.loadMore();
  },
  async initOptions(options){
    try {
        let {hn2in1_tab=1} = options;
        if(hn2in1_tab){
          this.setData({
            hn2in1_tab_active:hn2in1_tab
          })
        }
        //初始化数据
        this.initData()
    } catch (error) {
      console.log("initOptions catch:",error);
    }
  }
})