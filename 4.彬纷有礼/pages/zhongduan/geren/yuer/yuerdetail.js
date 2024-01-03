// pages/zhongduan/geren/yuer/yuerdetail.js
var dateTimePicker = require('../../../../utils/dateTimePicker.js');
const http = require('../../../../utils/api');
const utils = require('../../../../utils/util');
let next = 1; //页码参数
let param = {};
let dateArr = [];
const app = getApp();
const COS = app.globalData.COS_URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], //列表信息
    noMore: false, //没有更多数据
    startDate: '2020-01', //picker起始时间
    endDate: '', //picker 截止时间 
    noDataImg: COS + '/public/img/phaseIII/202104/hb-nodata.png',
    typeIcon: COS + '/public/img/phaseIII/202104/arrow-down.png',
    typePop: false, //类型窗口
    activeType: 0, //类型默认0：全部
    typeTitle: '全部类型', //类型标题
    txType: 0, //提现类型 1红牛 2战马  3提现 （红牛:4箱内码红包收益， 5：1元兑换收益，6：0.5元兑换奖励）
    activeCrew:'',// 人员筛选：默认全部
    can_filter_crew:false, //是否可以筛选店员，默认true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    param.start_time = '';
    param.end_time = '';
    param.type = '';
    param.next = 1;
    console.log("余额明细传参长度:", Object.keys(options).length);
    if (options.billParam) {
      //解密参数并格式化
      let billParam = decodeURIComponent(options.billParam);
      billParam = JSON.parse(billParam)
      console.log("余额明细传参:", billParam);
      //账单跳转过来需要重置参数，标题
      this.initData(billParam);
    }
    this.getUserInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获取当前年月为截止时间
    let currenDate = utils.parseTime(Date.now(), "{y}-{m}");
    let defaultYearMonth = utils.parseTime(Date.now(), "{y}年{m}月", false);
    this.setData({
      endDate: currenDate,
    });
    if(!this.data.defaultDate){
      this.setData({
        defaultDate: currenDate,
        defaultYearMonth,
      });
    }
    console.log("currentDate:", currenDate);
    utils.getShopInfo().then(data => {
      console.log("店铺信息：", data);
      let member = data.member;
      if (member.length > 1) {
        let crew = member.filter(item => {
          if (item.condition != 1) {
            return item
          }
        })
        this.setData({
          crew
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.list.length == 0) {
      param.next = 1;

      this.getBanlanceList(param, 'refresh', true)
    }

  },
  /**
   * 
   * @param {
   *  type:1红牛 2战马  3提现 （红牛:4箱内码红包收益， 5：1元兑换收益，6：0.5元兑换奖励）
   * monthYearBill:年月账单选中
   * month:年月2021-04
   * year：年2021
   * } billParam 
   */
  initData (billParam) {

    //获取选中的类型
    if (billParam.monthYearBill == 0) {
      //月账单
      let arr = billParam.month.split("-");
      let timeStamp = new Date(arr[0], arr[1] - 1);
      let defaultDate =  billParam.month;
      let defaultYearMonth = utils.parseTime(timeStamp,"{y}年{m}月",false);
      this.setData({
        defaultDate,
        defaultYearMonth
      });
      let getParseDate = utils.getParseDate(timeStamp);
      param.start_time = getParseDate.start_time;
      param.end_time = getParseDate.end_time;
    } else {
      //年账单
      param.start_time = billParam.year + '-01-01';
      param.end_time = billParam.year + '-12-31';
      let defaultDate =  billParam.year + '-12';
      let defaultYearMonth = billParam.year + '年12月';
      this.setData({
        defaultDate,
        defaultYearMonth
      });
    }
    // 红牛
    if (billParam.type == 1) {
      param.type = 4;
      param.source = 1;
    }
    //战马
    if (billParam.type == 2) {
      param.type = 4;
      param.source = 2;
    }
    //提现
    if (billParam.type == 3) {
      param.type = 2;
      param.source = 0;
    }
    //红牛:箱内码红包收益
    if (billParam.type == 4) {
      param.type = 8;
      param.source = 1;
    }
    //红牛：1元兑换收益
    if (billParam.type == 5) {
      param.type = 5;
      param.source = 1;
    }
    //红牛：0.5元兑换奖励
    if (billParam.type == 6) {
      param.type = 6;
      param.source = 1;
    }
    wx.setNavigationBarTitle({
      title: '明细',
    })
    let txType = billParam.type;
    dateArr=[];
    this.setData({
      typeTitle: '',
      txType: txType,
      list:[],
      
    })
    
  },
  async getUserInfo(){
    try {
      let userdata = wx.getStorageSync('userdata') || await utils.getUserInfoNew();
      this.setData({
        userdata
      })
    } catch (error) {
      console.log("catch err:",error)
    }
  },
  /**
   * 获取余额明细param:{
   *  start_time:开始时间
   *  end_time:结束时间
   *  type:类型默认不传0全部，1自己扫码，2提现，3其他，4（领取、助力、支付、开卡券）5消费者乐享 6核销红包 7收到助力 8箱内红包 9（助力、核销）
   *  10（领取、核销查自己）
   * c_uid:店员UID筛选助力
   * next：下一页页码
   * source:默认0全部，1红牛 2战马
   * }
   * type:refresh：刷新  load加载
   */
  getBanlanceList(param, type = "load", mask = false) {
    console.log("post 参数：", param);
    param.limit = 15;
    http.post('/api/user/getbalance', param, mask).then(res => {
      // console.log("余额月统计：", JSON.stringify(res) );
      let record = res.data.record;
      let statistic = res.data.statistic;

      if (res.code == 0 || record.list.length < record.limit) {
        this.setData({
          noMore: true
        })
      }
      // type:refresh 刷新，load加载更多
      if (type == "refresh") {
        // 判断返回数据record.list是否为空
        if (record && record.list.length > 0) {
          next = record.next;

          //重组数据：
          let data = []
          statistic.forEach(item => {
            dateArr.push(item.year_month);
            let arr = item.year_month.split("-");
            let timeStamp = new Date(arr[0], arr[1] - 1);
            data.push({
              month: {
                date: utils.parseTime(timeStamp, "{y}年{m}月"),
                time: item.year_month,
                count: item,
              },
              data: []
            })
          })
          record.list.forEach(item => {
            let index = data.findIndex(_item => {
              return item.create_time.substring(0, 7) === _item.month['time']
            })
            // console.log("_item.time:",_item);
            if (index > -1) {

              data[index]['data'].push(item)
            }
          });
          // console.log(JSON.stringify(data));
          this.setData({
            list: data
          })
        } else {
          this.setData({
            list: []
          })
        }
        wx.stopPullDownRefresh({
          success: (res) => {},
        })
      } else {
        //加载更多数据：先判断列表中是否存在数据；list有数据就往里面添加，无数据就重组数据
        let list = this.data.list;
        if (record && record.list.length > 0) {
          next = record.next;

          statistic.forEach((item, index) => {
            list.forEach((_item, index) => {
              let _oldtime = _item.month.time;
              console.log("数据索引2:", index, _item, _oldtime, item);
              let findIdx = dateArr.findIndex(items => {
                return items == item.year_month
              });
              console.log("findIdx:", findIdx, dateArr);
              if (_oldtime != item.year_month && findIdx == -1) {
                dateArr.push(item.year_month)
                //新数据月份存在
                console.log("不存在存在：", item, index, statistic);
                let arr = item.year_month.split("-");
                let timeStamp = new Date(arr[0], arr[1] - 1);
                list.push({
                  month: {
                    date: utils.parseTime(timeStamp, "{y}年{m}月"),
                    time: item.year_month,
                    count: item,
                  },
                  data: []
                })

              }
            })

          })
          record.list.forEach(item => {
            let index = list.forEach((oldItem, index) => {
              let dateTime = item.create_time.substring(0, 7);
              console.log("item.create_time.substring(0, 7):", item.create_time.substring(0, 7));
              // console.log("oldItem.month[dateTime]:", oldItem.month.statistic.hasOwnProperty(dateTime));


              if (oldItem.month.time == dateTime) {
                //新数据月份存在
                // console.log("item.create_time.substring(0, 7):", item.create_time.substring(0, 7));
                // console.log("oldItem.month['time']:", oldItem.month['time']);
                console.log("数据索引:", index);
                list[index]['data'].push(item);
              }

            })
          })
          console.log("final list:", list)
          this.setData({
            list
          })

        }

      }

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
  //点击查看提现失败原因
  checkFailMsg: function (e) {
    var msg = e.currentTarget.dataset.err_code_des;
    wx.showModal({
      title: '提现失败',
      content: msg,
      showCancel: false
    })
    console.log('提现失败：', msg);
  },
  onPageScroll: function (e) {
    let topHeight = 120
    var that = this;
    var query = wx.createSelectorQuery().in(that);
    query.selectViewport().scrollOffset()
    query.selectAll("#header").boundingClientRect();
    query.exec(function (res) {
      // console.log("query.exec:", res);
      let time = ''
      var resultIndex = res[1].findIndex((v) => {
        return v.top === topHeight;
      });
      // console.log("resultIndex:",resultIndex);
      if (resultIndex == -1) {
        let tempArr = []
        for (let index = 0; index < res[1].length; index++) {
          let data = res[1][index];
          tempArr.push(data.top)
        }
        let tempIndex = that.getClosestValueIndex(tempArr, topHeight)
        if (res[1].length > 0 && res[1][tempIndex].dataset.selectdata) {
          time = res[1][tempIndex].dataset.selectdata
        }
      } else {
        time = res[1][resultIndex].dataset.selectdata
      }
      // console.log(time);

      // that.setData({
      //   Time: time,
      // });
    });

  },
  getClosestValueIndex: function (arr, num) {
    var newArr = [];
    arr.map(function (x) {
      // 对数组各个数值求差值
      newArr.push(Math.abs(x - num));
    });
    // 求最小值的索引
    var index = newArr.indexOf(Math.min.apply(null, newArr));
    // return arr[index];
    return index;
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let value = e.detail.value;
    let arr = value.split("-");
    let timeStamp = new Date(arr[0], arr[1] - 1);
    let defaultYearMonth = utils.parseTime(timeStamp, "{y}年{m}月", false);
    this.setData({
      defaultDate: value,
      defaultYearMonth,
      noMore: false,
    })
    wx.pageScrollTo({
      duration: 0,
      scrollTop: 0
    })

    let getParseDate = utils.getParseDate(timeStamp);
    console.log("日期参数：", getParseDate);
    param.start_time = getParseDate.start_time;
    param.end_time = getParseDate.end_time;
    next = 1;
    param.next = next;

    this.getBanlanceList(param, "refresh", true)
  },
  openTypePop: function () {
    this.setData({
      typePop: true,
    })
    
  },
  close: function () {
    this.setData({
      typePop: false
    })
  },
  chooseType: function (e) {
    let val = e.currentTarget.dataset.val;
    let title = e.currentTarget.dataset.title;
    //选择类型需要重置店员id和source 和起止时间
    // param.c_uid = '';
    param.start_time = '';
    param.end_time = '';
    next = 1;
    param.next = 1;
    // 全部类型：param.type:0,
    if (val == 0) {
      param.type = 0;
      param.source = 0;
      param.c_uid = '';
    }
    //箱内码红牛 param.source:1，type=8
    if (val == 1) {
      param.type = 8;
      param.source = 1;
    }
    //箱内码战马 param.source:2
    if (val == 2) {
      param.type = 0;
      param.source = 2;
    }
    //红牛兑换 param.type:5 param.source:1
    if (val == 3) {
      param.type = 5;
      param.source = 1;
    }
    //兑换红包 param.type:6 param.source:1
    if (val == 4) {
      param.type = 6;
      param.source = 1;
    }
    //余额提现 param.type:2 param.source:0
    if (val == 5) {
      param.type = 2;
      param.source = 0;
    }
    //其它 param.type:3 param.source:0
    if (val == 6) {
      param.type = 3;
      param.source = '';
    }
    //战马换购 param.type:5 param.source:2
    if (val == 7) {
      param.type = 5;
      param.source = 2;
    }
    console.log("param：", param);
    // 仅箱内码+红牛战马换购可筛选店员
    if(![1,2,3,7].includes(+val)){
      param.c_uid = '';
      this.setData({
        activeCrew: '',
        can_filter_crew:false
      })
    }else{
      this.setData({
        can_filter_crew:true,
        activeType: val,
        typeTitle: title,
        activeCrew: '',
      })
      return
    }
    this.setData({
      activeType: val,
      typeTitle: title,
      noMore:false,
      typePop: false,
      list:[]
    })
   
    dateArr = [];
    this.getBanlanceList(param, "refresh", true);
  },
  chooseCrew: function (e) {
    let {val,title} = e.currentTarget.dataset;
    //选择店员需要重置其它类型id:source
    // param.source = 0;
    // param.type = 7;
    param.start_time = '';
    param.end_time = '';
    param.c_uid = val;
    next = 1;
    param.next = 1;
    console.log("crew param:", param);
    // 全部
    if(val == 'all'){
      delete param.c_uid;
      // param.source = 0;
      // param.type = 7;// 收到的助力
    }
    //自己扫码
    if(val == 'mine'){
      param.c_uid = this.data?.userdata.id;
      // delete param.c_uid;
      // param.source = 0;
      // param.type = 1;// 自己扫码
    }
    this.setData({
      activeCrew: "uid_" + val,
      // activeType: "uid_" + val,
      // typeTitle: title,

      typePop: false
    })
    dateArr = [];

    this.getBanlanceList(param, "refresh", true);

  },
  goToBill: function (e) {
    let date = e.currentTarget.dataset.date;
    let arr = date.split('-');
    date = arr[0] + '-' + Number(arr[1]);
    wx.navigateTo({
      url: '/pages/zhongduan/geren/annualBill/index?date=' + date,
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
    param = {};
    next = 1;
    this.setData({
      txType: false
    })
    dateArr = [];
    console.log(11111,dateArr);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    param.next = 1;
    next = 1;
    this.setData({
      noMore: false,
      activeType:0,
      typeTitle:"全部类型"
    })
    param.source = 0;
    param.type = 0;
    param.start_time = '';
    param.end_time = '';
    this.getBanlanceList(param, "refresh", true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.noMore) return;
    param.next = next;
    this.getBanlanceList(param);
  },


})