// pages/zhongduan/geren/annualBill/list.js
var dateTimePicker = require('../../../../utils/dateTimePicker.js');
const http = require('../../../../utils/api');
const utils = require('../../../../utils/util');
const log = require("../.../../../../../utils/log");
const app = getApp();
// let source = '',type='';
let source, type;
let _request = false;
let _next = 1;
let _index = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    //日期picker初始化
    dateTime: null,
    dateTimeArray: null,
    startYear: 2020,
    endYear: 2020,
    dateYear: '2020',
    billList: [],
    Time: 0,
    parameter: {
      start_time: '',
      end_time: '',
      source: '',
      type: '',
      next: ''
    },
    noMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = new Date();
    const currentYear = date.getFullYear();
    this.setData({
      endYear: currentYear
    })
    var obj = dateTimePicker.dateTimePicker(currentYear - 1, currentYear);
    // var obj = dateTimePicker.dateTimePicker(2020, 2020);
    obj.dateTimeArray.splice(2, 1);
    obj.dateTime[2] = parseInt((obj.defaultDay).substring(0, 2)) - 1; //day 字符串 'xx日' 转 'int'
    console.log("onLoad obj:", obj);
    let year = obj.dateTimeArray[0][obj.dateTime[0]];
    let month = obj.dateTimeArray[1][obj.dateTime[1]];
    // console.log("year:", year);
    // console.log("month:", month);
    year = Number(year.slice(0, 4));
    month = Number(month.slice(0, 2));
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      year: year,
      month: month
    });
    source = options.source;
    type = options.type;
    let title = '收益';
    if (source && type) {
      /**
       * 红牛收益 source:1,type：4
       * 战马收益 source:2,type:4
       * 红牛 箱内码红包收益： source:1,type:8
       * 红牛 1元轻松享收益 ：source:1 type:5
       * 红牛 核销收益 ：source:1 type:6
       * 战马 箱内码红包收益：source :2 type:8
       */
      switch (true) {
        case (source == 1 && type == 4):
          title = "红牛收益"
          break;
        case (source == 2 && type == 4):
          title = "战马收益"
          break;
        case (source == 1 && type == 8):
          title = "箱内码红包收益"
          break;
        case (source == 1 && type == 5):
          title = "1元轻松享收益"
          break;
        case (source == 1 && type == 6):
          title = "核销收益"
          break;
        case (source == 2 && type == 8):
          title = "箱内码红包收益"
          break;
        default:
          break;
      }
    }
    if (options.month) {
      obj.dateTime[1] = Number(options.month)-1;
      this.setData({
        month: options.month,
        dateTime: obj.dateTime,
      })
    }
    if (options.year) {
      console.log("year:", options.year);

      let findYearIndex = options.year + '年';
      let YearIndex = '';
      obj.dateTimeArray.forEach((val) => {
        val.forEach((value, index) => {
          if (value == findYearIndex) {
            YearIndex = index
          }
        })
      })
      obj.dateTime[0] = YearIndex;
      this.setData({
        year: options.year,
        dateTime: obj.dateTime,
      })
    }
    let navBarSystem = app.globalData.navBarSystem && JSON.parse(app.globalData.navBarSystem);
    if (navBarSystem) {
      this.setData({
        navBarSystem,
        title: title
      })
    }
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
        // console.log("res[1]:", res[1]);
        // console.log("tempIndex:", tempIndex);
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
  getBillLog: function (year = 2020) {
    console.log("getBilllog 传参：", year);
    http.post('/api/bill/logbill', {
      year: year
    }).then(res => {
      if (res.code == 1) {
        // console.log("2020年账单：", res.data);
        let monthArr = '';
        if (source == 1) {
          //红牛收益
          switch (true) {
            case (type == 4):
              monthArr = res.data.hn.month;
              break;
            case (type == 8):
              monthArr = res.data.hn.box.month;
              break;
            case (type == 5):
              monthArr = res.data.hn.yy.month;
              break;
            case (type == 6):
              monthArr = res.data.hn.hx.month;
              break;
            default:
              monthArr = res.data.hn.month;
              break;
          }
          this.initMonthList(monthArr);
        } else if (source == 2) {
          //战马收益
          switch (true) {
            case (type == 4):
              monthArr = res.data.zm.month;
              break;

            default:
              monthArr = res.data.zm.month;
              break;
          }
          this.initMonthList(monthArr);
        }

      } else {
        _request = false;
      }
    }).catch(err => {
      console.log("catch err;", err)
      _request = false;

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
  //初始化有数据的月份,也要获取到对应月份下标，用于日期组件选择
  initMonthList: function (data) {
    console.log("初始化月份数据：", data);
    let dateTimeArray = this.data.dateTimeArray;
    let dateTime = this.data.dateTime;
    let year = this.data.year;
    let billList = this.data.billList;
    for (var i in data) {
      // console.log("data[i]:",data[i]);
      if (data[i][0]) {
        let obj = {};
        let newI = '';
        if (i < 10) {
          newI = '0' + i
        } else {
          newI = i
        }
        obj.Year = year + '年';
        obj.Month = newI + '月';
        let dayArr = dateTimePicker.getMonthDay(obj.Year, newI + '月');
        // console.log("data[i][0]:",data[i]);
        let lastDay = dayArr[dayArr.length - 1].slice(0, 2);
        console.log("lastDay:", lastDay);
        var resultIndex = dateTimeArray[1].findIndex((v, index) => {
          return index == i - 1;
        });
        obj.datePickerIndex = [dateTime[0], resultIndex];
        obj.timeParam = [year + '-' + newI + '-01', year + '-' + newI + '-' + lastDay];
        let formatData = data[i][0].toFixed(2);
        obj.money = '￥' + utils.formatAmount(formatData);
        obj.count = data[i][1];
        obj.list = [];
        obj.nomore = false;
        console.log("obj:", obj);
        billList.push(obj);
      }
    }
    billList.reverse();
    this.setData({
      billList: billList
    });
    this.initParameter(billList);
  },
  //初始化接口参数，默认有数据的最后一个月:数组已reverse ,取第一项
  initParameter: function (billList, index = 0) {
    console.log("billList:", billList);
    console.log("initParameter index:", index);

    let length = billList.length;
    let parameter = this.data.parameter;
    if (billList[index] && billList[index].timeParam) {
      let timeParam = billList[index].timeParam;
      parameter.start_time = timeParam[0];
      parameter.end_time = timeParam[1];
    }
    parameter.source = source;
    parameter.type = type;
    if (_next == 0) {
      parameter.next = 1;
    }
    this.setData({
      parameter: parameter
    });
    // console.log("parameter:", parameter);
    this.getMonthList(parameter, _index);
  },
  //请求接口获取数据，数据需要赋值给对应月份
  getMonthList: function (parameter, index = 0) {
    let _self = this;
    console.log("请求参数：", parameter, '\nindex:', index);
    let billList = this.data.billList;
    let list = [];
    if (billList[index] && billList[index].list) {
      list = billList[index].list;
    }
    let param_next = 'parameter.next';
    let newList = null;
    let updateBillList = 'billList[' + index + '].list';

    if (_request) return;
    _request = true;
    wx.showLoading({
      title: '正在加载',
      // mask: true
    })
    http.post('/api/user/getbalancelog', parameter).then(res => {
      console.log('/api/user/getbalancelog', res);
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
      if (res.code == 1) {
        let data = res.data;
        let listInfo = [];
        data.list.map(function (value, index, array) {
          let obj = {};
          /** 
           *  value.source:0 红牛   1：战马
           * value.status:2/3 箱内码 6：核销 5：1元轻松享
           *  */

          switch (true) {
            case (value.status == 2):
              value.title = '箱内码红包';
              value.type = 'box';
              break;
            case (value.status == 3):
              value.title = '箱内码红包';
              value.type = 'box';
              break;
            case (value.status == 5):
              value.title = '1元轻松享';
              value.type = 'yy';
              break;
            case (value.status == 6):
              value.title = '核销红包';
              value.type = 'hx';
              break;

            default:
              break;
          }

          // if (value.title == '助力红包(红牛)' || value.title == '助力红包(战马)' || value.title == '箱内码红包(红牛)' || value.title == '箱内码红包(战马)') {
          //   value.title = '箱内码红包';
          //   value.type = 'box'
          // }
          // if (value.title == '核销红包') {
          //   value.type = 'hx'
          // }
          // if (value.title == '1元轻松享') {
          //   value.type = 'yy'
          // }
          obj.type = value.type;
          obj.title = value.title;
          obj.change = value.change;
          obj.create_time = value.create_time;
          listInfo.push(obj)
          // console.log("array:",array);
          // console.log("index:",index);
        })
        if (list) {
          newList = [...list, ...listInfo];
        } else {
          newList = listInfo;
        }
        _next = data.next;
        _request = false;
        this.setData({
          [updateBillList]: newList,
          [param_next]: _next
        })
      } else {
        //code:0 没数据，更新对应月份nomore字段，修改参数为前一个月
        _index = index + 1;
        _request = false;
        let billListNomore = 'billList[' + index + '].nomore';
        this.setData({
          [billListNomore]: true
        });
        if (_index <= billList.length - 1 && !billList[_index].nomore) {
          this.setData({
            [param_next]: 1,
          })
          _self.getMore(billList, _index);
        } else {
          //没有更多数据了
          this.setData({
            noMore: true
          })
        }
      }
    }).catch(err => {
      console.log("getMonthList fail:", err);
      log.setFilterMsg("billInfo");
      log.warn("getMonthList catch:", err);
      _request = false;
      wx.hideLoading({
        success: (res) => {},
      })
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
    });
  },
  getMore: function (billList, index, reset) {
    if (_request) return;
    _request = true;
    let length = billList.length;
    let timeParam = billList[index].timeParam;
    let parameter = this.data.parameter;

    parameter.start_time = timeParam[0];
    parameter.end_time = timeParam[1];
    parameter.source = source;
    parameter.type = type;
    if (reset) {
      parameter.next = 1;
    }
    this.setData({
      parameter: parameter
    });
    let _self = this;
    let list = billList[index].list;
    let param_next = 'parameter.next';
    let newList = null;
    let updateBillList = 'billList[' + index + '].list';
    console.log("getMore parameter：", parameter);
    http.post('/api/user/getbalancelog', parameter).then(res => {
      if (res.code == 1) {
        let data = res.data;
        let listInfo = [];
        data.list.map(function (value, index, array) {
          let obj = {};
          if (value.title == '助力红包(红牛)' || value.title == '助力红包(战马)' || value.title == '箱内码红包(红牛)' || value.title == '箱内码红包(战马)') {
            value.title = '箱内码红包';
            value.type = 'box'
          }
          if (value.title == '核销红包') {
            value.type = 'hx'
          }
          if (value.title == '1元轻松享') {
            value.type = 'yy'
          }
          obj.type = value.type;
          obj.title = value.title;
          obj.change = value.change;
          obj.create_time = value.create_time;
          listInfo.push(obj)
        })
        if (list) {
          if (reset) {
            newList = listInfo;
          } else {
            newList = [...list, ...listInfo];
          }
        } else {
          newList = listInfo;
        }
        _next = data.next;
        _request = false;
        this.setData({
          [updateBillList]: newList,
          [param_next]: _next
        })
      } else {
        _request = false;
        //code:0 没数据，更新对应月份nomore字段，修改参数为前一个月
        let billListNomore = 'billList[' + index + '].nomore';
        this.setData({
          [billListNomore]: true,
          noMore: true
        })

      }
    }).catch(err => {
      console.log("getMore fail:", err);
      log.setFilterMsg("billInfo");
      log.warn("getMore catch:", err);
      _request = false;
    });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime,
      billList = this.data.billList,
      dateArr = this.data.dateTimeArray;
    arr[e.detail.column] = e.detail.value;
    console.log("arr:", arr);
    let year = dateArr[0][arr[0]];
    let month = dateArr[1][arr[1]];
    year = Number(year.slice(0, 4));
    month = Number(month.slice(0, 2));
    console.log("year.month:", year, month);
    let obj = {};
    let dayArr = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    let lastDay = dayArr[dayArr.length - 1].slice(0, 2);
    var resultIndex = dateArr[1].findIndex((v, index) => {
      return index == month - 1;
    });
    let updateParameter = this.data.parameter;
    obj.datePickerIndex = [0, resultIndex];
    var getBillListIndex = billList.findIndex((v, index) => {
      return v.datePickerIndex[1] === resultIndex
    })
    updateParameter.start_time = year + '-' + month + '-01';
    updateParameter.end_time = year + '-' + month + '-' + lastDay;
    updateParameter.next = 1;
    //多列选择器滚动不修改数据，点击确定再修改
    let pickerChangeData = {};
    pickerChangeData.dateTimeArray = dateArr;
    pickerChangeData.dateTime = arr;
    pickerChangeData.parameter = updateParameter;
    pickerChangeData.getBillListIndex = getBillListIndex;
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr,
      parameter: updateParameter,
      pickerChangeData: pickerChangeData,
      year: year,
      month: month
    });

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading();
    this.getBillLog(this.data.year);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    _request = false;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let source = '';
    let type = '';
    _request = false;
    _index = 0;
    _next = 0;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function (e) {
    _next = 0;
    _index = 0;

    let billList = this.data.billList;
    billList = [];
    this.setData({
      billList: billList,
      noMore: false
    });
    this.getBillLog(this.data.year);
  },
  pickerChanged: function (e) {
    let billList = this.data.billList;
    let pickerChangeData = this.data.pickerChangeData;
    _next = 0;
    if (pickerChangeData) {
      let getBillListIndex = pickerChangeData.getBillListIndex;
      if (getBillListIndex < 0) {
        // wx.showToast({
        //   title: '该月份暂无数据',
        //   icon: 'none',
        //   duration: 1000
        // })
        // this.changeMonthList(this.data.parameter);
        this.setData({
          billList: []
        })
        this.getBillLog(this.data.year);
      } else {
        let resetBillList = [];

        _index = getBillListIndex;
        billList.map(function (value, index) {
          value.nomore = false;
          value.list = [];
          resetBillList.push(value);
        })
        this.setData({
          billList: resetBillList,
          noMore: false
        })
        //选择日期，重新请求数据，需要把原来数据覆盖掉
        this.getMore(billList, getBillListIndex, true);
      }
    }
  },
  //请求接口获取数据，数据需要赋值给对应月份
  changeMonthList: function (parameter, index = 0) {
    let _self = this;
    console.log("请求参数：", parameter, '\nindex:', index);
    let billList = this.data.billList;
    let list = billList[index].list;
    let param_next = 'parameter.next';
    let newList = null;
    let updateBillList = 'billList[' + index + '].list';

    if (_request) return;
    _request = true;
    wx.showLoading({
      title: '正在加载',
      // mask: true
    })
    http.post('/api/user/getbalancelog', parameter).then(res => {
      console.log('/api/user/getbalancelog', res);
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
      if (res.code == 1) {
        let data = res.data;
        let listInfo = [];
        data.list.map(function (value, index, array) {
          let obj = {};
          /** 
           *  value.source:0 红牛   1：战马
           * value.status:2/3 箱内码 6：核销 5：1元轻松享
           *  */

          switch (true) {
            case (value.status == 2):
              value.title = '箱内码红包';
              value.type = 'box';
              break;
            case (value.status == 3):
              value.title = '箱内码红包';
              value.type = 'box';
              break;
            case (value.status == 5):
              value.title = '1元轻松享';
              value.type = 'yy';
              break;
            case (value.status == 6):
              value.title = '核销红包';
              value.type = 'hx';
              break;

            default:
              break;
          }


          obj.type = value.type;
          obj.title = value.title;
          obj.change = value.change;
          obj.create_time = value.create_time;
          listInfo.push(obj)
          // console.log("array:",array);
          // console.log("index:",index);
        })
        newList = listInfo;
        _next = data.next;
        _request = false;
        this.setData({
          [updateBillList]: newList,
          [param_next]: _next
        })
      } else {
        //code:0 没数据，更新对应月份nomore字段，修改参数为前一个月
        _index = index + 1;
        _request = false;
        let billListNomore = 'billList[' + index + '].nomore';
        this.setData({
          [billListNomore]: true
        });
        if (_index <= billList.length - 1 && !billList[_index].nomore) {
          this.setData({
            [param_next]: 1,
          })
          _self.getMore(billList, _index);
        } else {
          //没有更多数据了
          this.setData({
            noMore: true
          })
        }
      }
    }).catch(err => {
      console.log("getMonthList fail:", err);
      log.setFilterMsg("billInfo");
      log.warn("getMonthList catch:", err);
      _request = false;
      wx.hideLoading({
        success: (res) => {},
      })
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    console.log("触底事件······");
    let _self = this;
    setTimeout(function () {

      let billList = _self.data.billList;
      let parameter = _self.data.parameter;
      if (_self.data.noMore) return
      if (_index <= billList.length) {

        _request = false;
        //数组 index 0 1 2···,小于0无数据
        // let lastList = billList[_index-1];
        _self.initParameter(billList, _index);
      }
    }, 500)


  },
  onBeforeBack: function () {

    wx.navigateBack({
      complete: (res) => {},
    })

  },
  imgError: function (error) {
    log.setFilterMsg("BillimgError");
    log.error("图片加载失败:", error);

    let name = error.currentTarget.dataset.name;
    if (name == "box") {
      this.setData({
        boxImg: 'data:image/png;base64,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'
      })
    }
    if (name == "yy") {
      this.setData({
        yyImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAMAAAArteDzAAAAqFBMVEVHcEzlIiLkHBzlISHlIiLlISHmHx/lIiLlISHkHR3lISHlISHmISHlISHkISHlICDlISHlISHlICDjICDlIiLytzvsIyMcFQcdBATMHR3XozP5vT3b29sjIyMKBwPutTjdqTYqIAnzvkrAkS777MzLmjF3Whz6y2T99eQqKy/ZICBhDg/HHh46CQmWFhZaRBX647KrGRlVWFjNzc2lpqaZdCXls0VvEBBEQ4dcAAAAFHRSTlMAsghp5Ngt+fAUIKOYjUQ9y3JHSOeNkQUAAANCSURBVFjDxZl5m5owEMaJXOFStOFYaBHdddt67tl+/29WIuiizoRD8vTFP/XnZDIkcyiKUCPLHqse8XWNmpRquk88dWxbI6W3Rpahur5GqclOMjnad1WjJ9cypkSr8WoyqUamhtUdOXZ1ygSiujvuhrVmjmayBpmaM2uPHU3cZmSJdSctfWtP9VbII1af2q3MJJR1ECXNxlpqezNPxqoNnrU9jXWW5gldYDuU9RB1BFSDmKyXKDEGZxaOxah3MFGq7dzBLKiQXy0P2KMQFeBX7yayRioUSw+ooMhSr9+CiX77rfV+FyPa7de339cnVw4lwF+/xtkPRFn8CvyAXLh1NL11aLjeZG/v30G9v2Wb9a1f6bTuAANYfA8o02txZblgNO1Fy9+DceV+RcAMPEXCh12GagcZWkTA7GwoEvbFRh2eQR3gjeKvwMnUMWroIZlDCvID7NPC1LHQo2yfLR7TIAf1GcFOPXsV2vrS0Od5mhwWF4qOzyIqvPoAmloGABSjR2gcrdJgtYhgZTEMLWPVIgyDJunyz2NNq0pJkj9GCJQRvn5Dw6HLl5flPJgHJ6Vn5ShUM/jxRAXQp5dlcKH58ROkCQqlxWGFBWm1/ACWAMpD1faZCLrsDGW+jUR+Bf35xH3aEVrEP+LSCvrrqTuUqoo3PNRTsHu5P9QkCrJP90B9RR8cynRFGx6qKXR4KFXM4aGmDEtNOcuXslFSQmr44Ge+nNdUyoEi5egTH9J9oMUhLbxOekGL60R48fWB8otPeEX3gfIrWphM9IHyZEKY9vDbNAWVi9MeQYLGc6k8T8rsMakLz6WqYgJLJTk0v8okeTIpzvqqWgJOeisokkkuMOi5lADjv4QGq+skslg6f7Dln9JzOFQ59HNVy03L5wT/hC39KiTAkofXZpFA2V+okvgqeWCvhtuiNvuNKMp221BcnMFl5DaOPr4j+ojibUMZCRe83aGXBS9Umh+ditWmEVicEbu5ibDdxKg22+YmAtzuWOPtjnWbdgfYmAnDDp0ZoDEjp4Ukp9klpy13B1XAlNPqlNOUldM+ltPoltOSlzQ86DDm+Gb974GMpNHRacjlXA652HHI5fQect2M48zW47h/wqnaU0X+oQcAAAAASUVORK5CYII='
      })
    }
    if (name == "hx") {
      this.setData({
        hxImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAMAAAArteDzAAAAtFBMVEVHcEwgS3ohTXohTHsdQ3YeS3oiTHsiTXohTXshTHsgS3oiTXshTHohTHsgTHkhTXsiTXv////19/j7+/vw9PUjT3+lo6ITGB0YP2h2dnYOKkcTJyt7e3vW1tWbvcUAwNcfHyK50teWkI9QjppJiZZWkZ7BwcGkxMutra2fnZy6urrIyMiBgIAFFyCTucGvy9Fzc3MeRW+Hsbrm5ubL3eDS0tEbPWNroKoAxttypK4Ae44AwNYPRUHfAAAAEHRSTlMAK5RwChfl+fCtRdtnyz3XuRbH1gAABHhJREFUWMPNmYuSojoQhrkIBK+YII5OxpHxBoq3dRx3dt//vbaTqAcwICNSdf6qpIDCzyTdHZKOouSqZqh1XbNbDRNZFjI7LVvT66pRUx4WEJtay0TIcq6yEDJbWvNRrqHqthnnxcmmravGz5FtrYGcHKGG1v4Z1qjbpuXckWXa9eLYWlu7jxRYrV1wbA29UwjJsR3dKNRMGzk/ELLvN9ZoFm/mWZ3mncYamun8WKaWS1U15DwgpKk5TNtyHpJlq09n5lBLMEFyqlGKCW01ZHZHTikouvWBWtN0SspspqOg3Um80CuqRBS00wOaYO5fimqfMFZiAGp6YkC/XvtF9foVDwI9PgBqovP79TgKvSIKo/F6HxuCjhq3fNybesO+5xLiui6+VrxgUWIXxPX6w7gLxDygnrT8cHzsdsn2dPLx4nT6JNtvH/vfW1bI5+kE1fcIw8UCd7vH8TDhAfUstx+O37pdPJpOt+5mOvXxZrJwF5MRlA32p9MR9ie/XLjYAPQtCf0vBFINvUInDDrx8WgG0NmIFeAx6AygExn02tSaZj0PamnCAdSG8zyo01AlPloWKnw1FUxloSKsVPO5UFNl0xN6LhTBZCWZm8tBmauqLee5UKel3nh+eSj4v46eDUW6omVDpxfoNfYv0EkuVFNu7NQ7QxezGeNBtZht8Xa24MWf8Qpmlhn8hYD20pZSbu3Epj6MXX8z+jxXUD5H/rlsLjcb38X4eNtSq6WkA/9rOFz36UdR0f56OPxKhb+SNH5vv2Z6LS7+/j4xAqaStFPvZf3n/ffv97/vxfSXvfxn/ZKAIsWSQ4tKBrXSLX1G99NQx3lhhoq8EJSwSBh/Iq6h8iKJoZByE6XMT4+EkEMQxhUc4JEX8n/zjpgcwo8VJoS7VMpRTaXjyCOKLKNBXNGKkFU04A9pgNm1J3d+cKlWBhQHgx2NLqI7usRkTgdwSQWU7kJXGqZOS5EsdS9QGhzfhI5wI6Dh6hhENHBzoBCmmRMKcFakK8RwAspxAy8PChOKng+FNRMmcSjvuJfXfVPPnqQ5FHzACw5p6MA7uHMwlJs1SWd+TjgUL+kumpM09CMIwE8DN+tzkvnhE1DwgTMu3v2IMs+Sd599+DI/0aL70EvmoXHoMaIf4FiUylvKPtGZiwlhKHc1X7mJMWWPhA5EBuWLqaxlz9mlIGC7SSh7BAFKuL9lLHuyFmgMyn/LGEkoZjzM64wFWtZSMhgMvPlF4SWiAHqYL99gXHh9Cz3vJTIWvczu9KKzDwx2Yio5Tyhu9qJXvjwHu1N6naMoFbMUm0rmlzCVQa87CelGAoy8jAt8gHUZLH5YBm+8PpKcjYR0y8PsERe3NeauwG9Enb3lSW3OHLE5K6SczVlyG9l7zjaymg1vJVtzsFXnoRxCbhKhmnRH6cSMg2TJuSpSSCWTXZWk0CpI9uUkEB9OdVp5qc5qkrKPpI+tu+njahLd7MTk+Sn5ig4PqjnmENj7BzJ14/9wdHQ55LJlh1x2s+zhWfw4rlHsOO4fQwTTYNSuWVUAAAAASUVORK5CYII='
      })
    }
  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})