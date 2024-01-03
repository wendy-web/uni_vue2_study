// pages/warhorse//hongbao-record/index.js
const api = require("../../../../utils/api");
const utils = require("../../../../utils/util");
const auth = require("../../../../utils/auth");
const COS = getApp().globalData.COS_URL;
//等待时间 只负责接受时间
let _wait_date = [];
//类型列表
let TYPE_LIST = [{
    name: '全部',
    type: 4,
    img: COS + '/public/img/WarHorse/0917/red_record_icon01.png' //red record icon01
  }, {
    name: '箱内码红包',
    type: 8,
    img: COS + '/public/img/WarHorse/0917/red_record_icon02.png' //red record icon02
  },
  {
    name: '红牛兑换',
    type: 5,
    img: COS + '/public/img/WarHorse/0917/red_record_icon03.png' //red record icon03
  }, {
    name: '兑换红包',
    type: 6,
    img: COS + '/public/img/WarHorse/0917/red_record_icon04.png' //red record icon04
  }
]
//店员列表
let _clerk_list = []
//店员 id
let _clerk_c_uid = ''
//二级类型type
let _TYPE_LIST_DATA = ''
//页码
let _next = 1
//当前loading
let _ISLOADING = false;
// 在页面中定义插屏广告
let interstitialAd = null;

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
    RECORD_TYPE: 3, //0全部，1红牛，2,战马，3无数据
    query_type: 1, //1红牛,2战马
    // query_type: false, //false红牛,true战马
    dateDialog: false, //日期弹窗
    selectData: { //日期范围
      now: "",
      last: ""
    },
    halfScreenDialog: false, //统一类型弹窗
    halfScreenList: [], //统一类型列表
    halfScreenDialogTitle: '', //统一类型标题
    listData: [], //红包记录列表
    _IS_DATA_BOTTOM: false,
    dydf:  COS + '/public/img/bfyl/assets/store/dydf.png',
    popImg: '',
    adShow: false,
    //新版UI
    dyhbBg:COS+"/public/img/phaseIII/202104/dyhb_bg.png",
    hnIcon:COS+"/public/img/phaseIII/202104/redBull_mini.png",
    zmIcon:COS+"/public/img/phaseIII/202104/warhorse_mini.png",
    dateIcon:COS+'/public/img/phaseIII/202104/help_date_icon.png',
    warnIcon:COS+"/public/img/phaseIII/202104/dyhb_warn.png",
    img_nopoint:COS+"/public/img/bfyl/assets/hongbao/nopoint.png",
    tipsPop:false,//收入說明彈窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //清空数据
    _clerk_c_uid = '';
    _TYPE_LIST_DATA = 4;
    _next = 1;
    //设置默认时间
    this.setData({
      selectData: utils.getLastMonth()
    })
    //初始化数据
    this.initData()
    let userdata = wx.getStorageSync('userdata');
    let condition = userdata.condition;
    if (condition == 1) {
      this.setData({
        boss: true
      });
      //获取店员列表   
      this.getClerk()
    }
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-43b6ef403deb5353'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }

  },
  changeType(e) {
    // this.data.query_type = !this.data.query_type
    let query_type = e.currentTarget.dataset.type;
    _TYPE_LIST_DATA = 4;
    console.log("query_type:", query_type);
    this.setData({
      // query_type: this.data.query_type
      query_type: query_type
    })
    _next = 1 //每次条件变化页码清零
    this.data._IS_DATA_BOTTOM = false
    this.setData({
      _IS_DATA_BOTTOM: this.data._IS_DATA_BOTTOM
    })
    this.getbalancelog() //拉去数据
  },
  initData() {
    //红包界面统计
    api.post('/api/user/getredpacketcount').then(res => {
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
        //设置数据
        this.setData({
          RECORD_TYPE: type,
          query_type: this.data.query_type,
          redpacketcount: res.data,
          // RECORD_TYPE: 3,
          // query_type: 1,
          // redpacketcount:[]
        })
        this.getbalancelog();
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
            uid: item.uid,
            loaded: false
          }
        })

        return
      }
      _clerk_list = []
    })
  },
  //类型点击
  halfScreencTab(event) {
    let result = event.currentTarget.dataset.result;
    let userdata = wx.getStorageSync('userdata');
    let uid = userdata.id;
    console.log("uid:", uid);
    console.log("cuid:", result.uid);
    console.log("result.type:", result.type);
    console.log("_TYPE_LIST_DATA:", _TYPE_LIST_DATA);
    if (result.uid) {
      _clerk_c_uid = result.uid
    }
    if (result.type) {
      _TYPE_LIST_DATA = result.type
    } else if (!_TYPE_LIST_DATA && !result.type) {
      if (_clerk_c_uid) {
        if (uid !== _clerk_c_uid) {
          _TYPE_LIST_DATA = 9
        }
        if (uid == _clerk_c_uid) {
          _TYPE_LIST_DATA = 10
        }
      } else {
        _TYPE_LIST_DATA = 4
      }
    } else {
      if (uid !== _clerk_c_uid) {
        //查其他人 ,type默认=9
        _TYPE_LIST_DATA = 9
      }
      if (uid == _clerk_c_uid) {
        //查自己 ,type默认=7
        _TYPE_LIST_DATA = 10
      }
    }




    if (_clerk_c_uid) {
      if (uid !== _clerk_c_uid && !_TYPE_LIST_DATA && !result.type) {
        _TYPE_LIST_DATA = 9
      }
      if (uid == _clerk_c_uid && !_TYPE_LIST_DATA && !result.type) {
        _TYPE_LIST_DATA = 10
      }

      if (uid !== _clerk_c_uid && _TYPE_LIST_DATA == 4) {
        //查其他人 ,type默认=9
        _TYPE_LIST_DATA = 9
      }
      if (uid == _clerk_c_uid && _TYPE_LIST_DATA == 4) {
        //查自己 ,type默认=7
        _TYPE_LIST_DATA = 10
      }

    }
    if (result.uid === -1) {
      _clerk_c_uid = ''
      _TYPE_LIST_DATA = 4
    }
    this.setData({
      halfScreenDialog: false
    })
    _next = 1 //每次条件变化页码清零
    this.data._IS_DATA_BOTTOM = false
    this.setData({
      _IS_DATA_BOTTOM: this.data._IS_DATA_BOTTOM
    })
    this.getbalancelog() //拉去数据
  },
  //滚动到底部加载
  scrolltolower() {
    if (_ISLOADING || this.data._IS_DATA_BOTTOM) return
    _next++;
    this.getbalancelog();
    // 在适合的场景显示插屏广告
    if (interstitialAd && utils.blockAd()) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
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
  //获取红包记录 
  getbalancelog() {
    //防止连续调用重复数据
    if (_ISLOADING) return
    _ISLOADING = true;
    //配置参数
    let parmas = {
      start_time: this.data.selectData.last,
      end_time: this.data.selectData.now,
      // source: this.data.query_type ? 2 : 1,
      source: this.data.query_type,
      c_uid: _clerk_c_uid,
      type: _TYPE_LIST_DATA,
      next: _next
    }
    console.log("请求参数：", parmas);
    //获取数据
    api.post('/api/user/getbalancelog', parmas).then(res => {
      wx.hideLoading({
        success: (res) => {},
      })
      console.log("数据返回：", res);
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
        if (data.length == 0) {
          data = [];
        }
      }
      this.data._IS_DATA_BOTTOM = true
      this.setData({
        listData: data,
        _IS_DATA_BOTTOM: true
      })
    }).catch(() => {
      wx.hideLoading({
        success: (res) => {},
      })
      _ISLOADING = false
    })
  },
  //店员类型
  clerkTypeSelect() {
    let that = this;
    let list = TYPE_LIST.slice(0, 1).map(function (item) {
      return {
        name: item.name,
        uid: -1,
        img: item.img,
        loaded: true
      }
    });
    if (_clerk_list.length > 0) {
      list = list.concat(_clerk_list)
      list.forEach((item, index) => {
        let countTime = setTimeout(() => {
          var item_loaded = 'halfScreenList[' + index + '].loaded';
          that.setData({
            [item_loaded]: true
          })
          clearTimeout(countTime)
        }, (index + 1) * 220);
      });
    }
    console.log("店员list:", list);
    
    this.setData({
      halfScreenDialogTitle: '店员列表',
      halfScreenDialog: true,
      halfScreenList: list
    })
  },
  //余额类型筛选
  balanceTypeSelect() {
    let that = this;
    let list = TYPE_LIST;
    if (this.data.query_type == 2) {
      list = TYPE_LIST.slice(0, 2)
    }
    list.forEach((item, index) => {
      let countTime = setTimeout(() => {
        var item_loaded = 'halfScreenList[' + index + '].loaded';
        that.setData({
          [item_loaded]: true
        })
        clearTimeout(countTime)
      }, (index + 1) * 100);
    });
    this.setData({
      halfScreenDialogTitle: '类型选择',
      halfScreenDialog: true,
      halfScreenList: list
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
      //发起查询
      _next = 1 //页码清零
      this.data._IS_DATA_BOTTOM = false
      this.setData({
        _IS_DATA_BOTTOM: this.data._IS_DATA_BOTTOM
      })
      this.getbalancelog()
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
  showTips:function(e){
    this.setData({
      tipsPop:true
    })
  },
  close:function(e){
    this.setData({
      tipsPop:false
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

  }
})