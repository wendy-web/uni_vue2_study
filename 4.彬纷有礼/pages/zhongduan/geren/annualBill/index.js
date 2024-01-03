// pages/zhongduan/geren/annualBill/index.js
import uCharts from '../../static/u-charts.js';
const http = require('../../../../utils/api');
const utils = require('../../../../utils/util');
const log = require("../.../../../../../utils/log");
const app = getApp();
const COS = app.globalData.COS_URL;
let scrollParam = {};//列表传参
let monthParam = {}; //月度账单传参
let yearParam = {}; //年度账单传参
let scrollNomore = false; //滚动列表无数据
let scrollViewWidth = '';
const currentYear = new Date().getFullYear();
const lastYear = new Date().getFullYear() - 1;
const timeStampNow = Date.now();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: '2020-01', //picker起始时间
    endDate: '', //picker 截止时间 
    currentDate: '', //当前选中的年月 2021-4
    activeTab: 0, //默认选中：0月账单，1年账单
    activePickerTab: 0, //默认选中：0收益，1提现
    activeBrandTab: 0, //默认选中：0全部，1红牛，2战马
    billIcon: COS + '/public/img/phaseIII/202104/bill-icon.png',
    pickerYear: '', //当前选中年份 2021
    pickerDate: '', //年月选择器
    allReward: [], //全部收益：红牛，战马
    hnReward: [], //红牛收益：箱内码，1兑换收益，0.5兑换奖励
    zmReward: [], //战马收益：箱内码
    withdrawal: '', //提现累计
    allScrollList: '', //全部图表列表
    hnScrollList: '', //红牛图表列表
    zmScrollList: '', //战马图表列表
    txScrollList: '', //提现图表列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //余额明细统计跳转传参：月账单
    console.log('统计传参：', options);

    if (options.date) {
      let arr = options.date.split("-");
      let timeStamp = new Date(arr[0], arr[1] - 1)
      this.setData({
        currentDate: options.date,
        pickerDate: utils.parseTime(timeStamp, "{y}年{m}月", false)
      })
    }
    // activeTab=1显示年度账单
    if (options.activeTab) {
      this.setData({
        activeTab: options.activeTab
      })
      
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.createSelectorQuery().select('#scroll-view').boundingClientRect((rect) => {
      scrollViewWidth = Math.round(rect.width);
      console.log("scrollViewWidth:", scrollViewWidth);
    }).exec();
    let currentDate = utils.parseTime(timeStampNow, "{y}-{m}", false);
    let pickerDate = utils.parseTime(timeStampNow, "{y}年{m}月", false);
    this.setData({
      endDate: currentDate,
      pickerYear: lastYear,
      lastYear
    });
    if (!this.data.currentDate) {
      this.setData({
        currentDate: currentDate,
        pickerDate: pickerDate

      })
    }
    //默认初始化数据,月账单:当前年月距离2020年1月
    let date = new Date();
    let currentMonth = date.getMonth()+1;
    let year = date.getFullYear()-2020;
    
    scrollParam.few = 12*year+currentMonth;

    let islogin = wx.getStorageSync('islogin');
    if (islogin&&islogin==1) {
      this.initData()
    } else {
      app.tokenReadyCallback = (res) => {
        this.initData()
      }
    }
    

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //图表滚动触发
  scrollToUpper: function () {
    // 判断是否无数据 
    if (scrollNomore) {
      return
    }

    console.log("scrollToUpper 传参：", scrollParam)
    this.getBillMonth(scrollParam, false).then(res => {
      // 年度账单
      this.scrollList(res)

    })
  },
  //scrollList 数据处理
  scrollList: function (res, type = "load", scrollLeft = false) {
    let allScrollList = [],
      hnScrollList = [],
      zmScrollList = [],
      txScrollList = [];
    if (res.code == 1) {
      let all = res.data.all;
      scrollParam.next = res.data.next;
      scrollParam.few=12;
      allScrollList = res.data.all;
      zmScrollList = res.data.zm;
      hnScrollList = res.data.hn;
      txScrollList = res.data.tx;


      let allMax = Math.max.apply(Math, allScrollList.map(item => {
        return item.total
      }));
      let hnMax = Math.max.apply(Math, hnScrollList.map(item => {
        return item.total
      }));
      let zmMax = Math.max.apply(Math, zmScrollList.map(item => {
        return item.sum
      }));
      let txMax = Math.max.apply(Math, txScrollList.map(item => {
        return item.sum
      }));

      allScrollList = allScrollList.filter((item, index, arr) => {

        if (item.year >= 2020) {
          item.hnheight = Math.round((item.hn / allMax) * 100);
          item.zmheight = Math.round((item.zm / allMax) * 100);
          item.max = allMax;
          item.total_num = utils.formatAmount(Number(item.total).toFixed(2));
          item.hn_num = utils.formatAmount(Number(item.hn).toFixed(2));
          item.zm_num = utils.formatAmount(Number(item.zm).toFixed(2));
          // console.log("item:",item);
          return item
        } else {
          wx.showToast({
            title: '没有更多数据了',
            icon: "none",
            duration: 2000
          })
          scrollNomore = true; //无数据

        }
      })
      hnScrollList = hnScrollList.filter((item, index, arr) => {
        if (item.year >= 2020) {
          item.boxheight = Math.round((item.box / hnMax) * 100);
          item.yyheight = Math.round((item.yy / hnMax) * 100);
          item.hxheight = Math.round((item.hx / hnMax) * 100);
          item.max = hnMax;
          item.total_num = utils.formatAmount(Number(item.total).toFixed(2));
          item.box_num = utils.formatAmount(Number(item.box).toFixed(2));
          item.yy_num = utils.formatAmount(Number(item.yy).toFixed(2));
          item.hx_num = utils.formatAmount(Number(item.hx).toFixed(2));
          return item
        } else {
          scrollNomore = true; //无数据
        }

      })
      zmScrollList = zmScrollList.filter((item, index, arr) => {
        if (item.year >= 2020) {
          item.height = Math.round((item.sum / zmMax) * 100);
          item.max = zmMax;
          item.sum_num = utils.formatAmount(Number(item.sum).toFixed(2));
          return item
        } else {
          scrollNomore = true; //无数据
        }

      })
      txScrollList = txScrollList.filter((item, index, arr) => {
        if (item.year >= 2020) {
          item.height = Math.round((item.sum / txMax) * 100);
          item.max = txMax;
          item.sum_num = utils.formatAmount(Number(item.sum).toFixed(2));

          return item
        } else {
          scrollNomore = true; //无数据
        }

      })
      if (type == "refresh") {
        //刷新初始化数据
        this.setData({
          allScrollList: allScrollList,
          hnScrollList: hnScrollList,
          zmScrollList: zmScrollList,
          txScrollList: txScrollList
          // allScrollList: allScrollList.reverse(),
          // hnScrollList: hnScrollList.reverse(),
          // zmScrollList: zmScrollList.reverse(),
          // txScrollList: txScrollList.reverse()
        })

      } else {
        //加载更多
        let _allScrollList = this.data.allScrollList;
        let _hnScrollList = this.data.hnScrollList;
        let _zmScrollList = this.data.zmScrollList;
        let _txScrollList = this.data.txScrollList;
        // _allScrollList = _allScrollList.reverse();
        _allScrollList = _allScrollList.concat(allScrollList);
        // _hnScrollList = _hnScrollList.reverse();
        _hnScrollList = _hnScrollList.concat(hnScrollList);
        // _zmScrollList = _zmScrollList.reverse();
        _zmScrollList = _zmScrollList.concat(zmScrollList);
        // _txScrollList = _txScrollList.reverse();
        _txScrollList = _txScrollList.concat(txScrollList);
        this.setData({
          allScrollList: _allScrollList,
          hnScrollList: _hnScrollList,
          zmScrollList: _zmScrollList,
          txScrollList: _txScrollList,
          // allScrollList: _allScrollList.reverse(),
          // hnScrollList: _hnScrollList.reverse(),
          // zmScrollList: _zmScrollList.reverse(),
          // txScrollList: _txScrollList.reverse(),
        })

      }

      if (scrollLeft) {
        let query = wx.createSelectorQuery().in(this);
        query.selectViewport().scrollOffset()
        query.selectAll(".scroll-item").boundingClientRect();
        query.exec((res) => {
          let countWidth = 0;
          res[1].forEach((ele, index) => {
            countWidth += ele.width;
            if (index == (res[1].length - 1)) {
              this.setData({
                scrollLeft: countWidth
              })
            }
          });
        })

      } else {
        this.setData({
          scrollLeft: 30
        })
      }





    }
  },
  monthBill: function (res) {
    //月账单数据处理:res 年度账单走势图接口返回数据
    //获取年月数据
    let monthDate = this.data.currentDate;
    if (res.code == 1) {
      //重组数据
      let allReward = [],
        hnReward = [],
        zmReward = [],
        withdrawal = '';
      let apiData = res.data;
      Object.keys(apiData).forEach(item => {
        if (item == "all") {
          apiData[item].forEach(_item => {
            let yearMonth = _item.year + '-' + _item.month;
            if (yearMonth == monthDate) {
              allReward = _item;
            }
          })
        }
        if (item == "hn") {
          apiData[item].forEach(_item => {
            let yearMonth = _item.year + '-' + _item.month;
            if (yearMonth == monthDate) {
              hnReward = _item;
            }
          })
        }
        if (item == "zm") {
          apiData[item].forEach(_item => {
            let yearMonth = _item.year + '-' + _item.month;
            if (yearMonth == monthDate) {
              zmReward = _item;
            }
          })
        }
        if (item == "tx") {
          apiData[item].forEach(_item => {
            let yearMonth = _item.year + '-' + _item.month;
            if (yearMonth == monthDate) {
              withdrawal = _item.sum;
            }
          })
        }
      })
      this.formatAmount({
        allReward,
        hnReward,
        zmReward,
        withdrawal
      })
      // this.setData({
      //   allReward,
      //   hnReward,
      //   zmReward,
      //   withdrawal,
      // })
    }

  },
  //年账单数据处理：res年度账单走势图接口返回数据
  yearBill: function (res) {
    if (res.code == 1) {
      let pickerYear = this.data.pickerYear;
      //重组数据
      let allReward = {
          total: 0,
          hn: 0,
          zm: 0,
        },
        hnReward = {
          total: 0,
          box: 0,
          yy: 0,
          hx: 0,
        },
        zmReward = {
          sum: 0
        },
        withdrawal = 0;
      let apiData = res.data;
      Object.keys(apiData).forEach(item => {
        if (item == "all") {
          apiData[item].forEach(_item => {
            if(_item.year == pickerYear){

              allReward.total += _item.total;
              allReward.hn += _item.hn;
              allReward.zm += _item.zm;
            }

          })
        }
        if (item == "hn") {
          apiData[item].forEach(_item => {
            if(_item.year == pickerYear){

              hnReward.total += _item.total;
              hnReward.box += _item.box;
              hnReward.yy += _item.yy;
              hnReward.hx += _item.hx;
            }
          })
        }
        if (item == "zm") {
          apiData[item].forEach(_item => {
            if(_item.year == pickerYear){

              zmReward.sum += _item.sum;
            }
          })
        }
        if (item == "tx") {
          apiData[item].forEach(_item => {
            if(_item.year == pickerYear){

              withdrawal += _item.sum;
            }
          })
        }
        console.log(item)
      })
      console.log("yearBill allReward:", allReward);
      this.formatAmount({
        allReward,
        hnReward,
        zmReward,
        withdrawal,
      })
      // this.setData({
      //   allReward,
      //   hnReward,
      //   zmReward,
      //   withdrawal,
      // })
    }

  },
  // 年月选择
  bindDateChange: function (e) {
    console.log('bindDateChange:', e.detail.value)
    let value = e.detail.value;
    let arr = value.split("-");
    let timeStamp = new Date(arr[0], arr[1] - 1)
    // 年月筛选需要赋值：currentDate：2021-4  pickerDate：2021年4月
    this.setData({
      currentDate: utils.parseTime(timeStamp, "{y}-{m}", false),
      pickerDate: utils.parseTime(timeStamp, "{y}年{m}月", false)
      // currentDate: utils.parseTime(value, "{y}-{m}", false),
      // pickerDate: utils.parseTime(value, "{y}年{m}月", false)
    })
    //判断收益、提现tab (收益可)
    let pickerTab = this.data.activePickerTab;
    //判断全部、红牛、战马tab
    let brandTab = this.data.activeBrandTab;
    let monthParam={};//年月传参
    monthParam.next = value;
    monthParam.few = 1;
    this.getBillMonth(monthParam).then(res => {
      this.monthBill(res);
      //选择年月只获取统计数据，不更新滚动列表
      // this.scrollList(res, "refresh", true);
    });

  },
  // 年选择
  bindYearChange: function (e) {
    console.log('bindYearChange:', e.detail.value)
    let value = e.detail.value;
    let date = new Date();

    // 年筛选需要赋值：pickerYear：2021
    this.setData({
      pickerYear: value
    })
    let yearParam={};//年传参
    if (value == currentYear) {
      let currentMonth = date.getMonth() + 1;
      yearParam.next = currentYear + '-' + currentMonth;
      yearParam.few = currentMonth;
    } else {
      yearParam.next = value + '-12';
      yearParam.few = 12;
    }
    this.getBillMonth(yearParam).then(res => {
      this.yearBill(res);
      //选择年只获取统计数据，不更新滚动列表
      // this.scrollList(res, "refresh", true);
    })
  },
  /**
   * 
   * @param {
   *  next:2021-04 起始年月
   *  few:7  显示几个月数据
   * } param 
   * @mask  是否显示加载中
   */
  //请求年度账单走势图
  getBillMonth: function (param, mask = true) {
    // console.log("请求参数：", param);
    return new Promise((resolve, reject) => {
      http.post('/api/bill/months', param, mask).then(res => {
        // console.log("/api/bill/months返回:", res);
        resolve(res)
      });
    })
  },

  // 年月账单切换:不重置列表
  changeBillTab: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: index
    })
    let date = new Date();
    let pickerYear = this.data.pickerYear;
    // index == 1年账单
    if (index == 1) {
      this.setData({
        endDate: lastYear
      })
      // if (pickerYear && pickerYear != currentYear) {
      //   param.next = pickerYear + '-12';
      //   param.few = 12;
      //   console.log(1111, param);
      // } else {
      //   //第一次点击年账单初始化数据 2021年  再获取当前月份为few参数 
      //   let few = date.getMonth() + 1;
      //   console.log("currentMonth:", few);
      //   this.setData({
      //     pickerYear: currentYear
      //   })

      //   param.next = currentYear + '-' + few;
      //   param.few = few;
      // }
      let yearParam = {};
      yearParam.next = pickerYear + '-12';
      yearParam.few = 12;
      console.log("changeBillTab 传参：", yearParam);
      // scrollParam = JSON.parse(JSON.stringify(yearParam));
      this.getBillMonth(yearParam, false).then(res => {
        this.yearBill(res);
        // this.scrollList(res, "refresh", true);

      })

    } else {
      this.setData({
        endDate: utils.parseTime(timeStampNow, "{y}-{m}")
      })
      //切换月账单 刷新全部 红牛 战马数据 获取年月信息 currentDate
      let currentDate = this.data.currentDate;
      let monthParam ={};
      monthParam.next = currentDate;
      monthParam.few = 1;
      if (pickerYear && pickerYear != currentYear) {
        // scrollParam = JSON.parse(JSON.stringify(param));
        scrollNomore=false;
        this.getBillMonth(monthParam, false).then(res => {
          // this.scrollList(res, "refresh", true);
          this.monthBill(res)
        })
      } else {
        //第一次点击年账单初始化数据 2021年  再获取当前月份为few参数 
        // scrollParam = JSON.parse(JSON.stringify(param));
        this.getBillMonth(monthParam, false).then(res => {
          this.monthBill(res)
        })
      }


      // scrollParam = JSON.parse(JSON.stringify(param));
      // this.getBillMonth(param, false).then(res => {
      //   this.scrollList(res);
      //   this.monthBill(res)
      // })
    }
    // this.scrollToRight();
  },
  // 收益 提现切换
  changePickerTab: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      activePickerTab: index
    });
    // this.scrollToRight();
  },
  // 全部、红牛 、战马切换
  changeBrandTab: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      activeBrandTab: index
    })
    // this.scrollToRight();
  },
  //提现明细页面跳转
  withdrawalDetail: function (e) {
    let url = '/pages/zhongduan/geren/yuer/yuerdetail';
    let billParam = {};
    //type:1红牛 2战马  3提现 （红牛:4箱内码红包收益， 5：1元兑换收益，6：0.5元兑换奖励）
    billParam.type = e.currentTarget.dataset.type;
    // 年月账单选中
    billParam.monthYearBill = this.data.activeTab;
    //筛选年月日期
    billParam.month = this.data.currentDate;
    //筛选年
    billParam.year = this.data.pickerYear;
    billParam = encodeURIComponent(JSON.stringify(billParam))

    wx.navigateTo({
      url: url + "?billParam=" + billParam,
    })
  },
  /**
   * 
   * @param {
   * } 
   */
  changeDate: function (e) {
    //获取年月日
    let year = e.currentTarget.dataset.year;
    let month = e.currentTarget.dataset.month;
    let timeStamp = new Date(year, month - 1);
    let date = utils.parseTime(timeStamp, "{y}-{m}", false);
    let monthParam={};
    monthParam.next = date;
    monthParam.few = 1;
    this.getBillMonth(monthParam, false).then(res => {
      this.monthBill(res);
    });
    let offsetLeft = e.currentTarget.offsetLeft;
    let scrollLeft = offsetLeft - scrollViewWidth / 2;
    let itemid = year + month
    this.setData({
      activeTab: 0,
      currentDate: date,
      pickerDate: utils.parseTime(timeStamp, "{y}年{m}月", false),
      scrollLeft
      // itemid
    })



  },
  // 重置柱状图：滚动到最右边
  scrollToRight: function (e) {
    let query = wx.createSelectorQuery().in(this);
    query.selectViewport().scrollOffset()
    query.selectAll(".scroll-item").boundingClientRect();
    query.exec((res) => {
      let countWidth = 0;
      res[1].forEach((ele, index) => {
        countWidth += ele.width;
        if (index == (res[1].length - 1)) {
          this.setData({
            scrollLeft: countWidth
          })
        }
      });
    })
  },
  // 金额保留2位小数点 千分位显示
  formatAmount: function (obj) {
    console.log("obj", obj);
    obj.allReward.total_num = utils.formatAmount(obj.allReward.total.toFixed(2));
    obj.allReward.hn_num = utils.formatAmount(obj.allReward.hn.toFixed(2));
    obj.allReward.zm_num = utils.formatAmount(obj.allReward.zm.toFixed(2));
    obj.hnReward.total_num = utils.formatAmount(obj.hnReward.total.toFixed(2));
    obj.hnReward.box_num = utils.formatAmount(obj.hnReward.box.toFixed(2));
    obj.hnReward.yy_num = utils.formatAmount(obj.hnReward.yy.toFixed(2));
    obj.hnReward.hx_num = utils.formatAmount(obj.hnReward.hx.toFixed(2));
    obj.zmReward.sum_num = utils.formatAmount(obj.zmReward.sum.toFixed(2));
    obj.withdrawal_num = utils.formatAmount(obj.withdrawal.toFixed(2));
    this.setData({
      allReward: obj.allReward,
      hnReward: obj.hnReward,
      zmReward: obj.zmReward,
      withdrawal: obj.withdrawal_num,
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
    scrollParam = {};
    scrollNomore = false;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  initData(){
    this.getBillMonth(scrollParam).then(res => {
      if (this.data.activeTab == 1) {
        this.yearBill(res);
      } else {
        this.monthBill(res);
      }
      this.scrollList(res, "refresh", true);
    });
  }



  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})