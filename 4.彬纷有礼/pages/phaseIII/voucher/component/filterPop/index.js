// pages/voucher/component/filterPop/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
import {
  getRecentDaysStartAndEnd
} from './utils';
import {
  initDateRange,
  initSelectDate,
  initPickerConfig,
  initCouponType,
  initGoodType
} from './config';
const pickerConfig = JSON.parse(JSON.stringify(initPickerConfig));
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    skuParams: {
      type: Object,
      value: {}, //产品类型
      observer: function (skuParams) {
        if (skuParams) {
          this.initSkuParams(skuParams);
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    excFilterShow: false, // 换购券条件筛选弹窗
    actFilterShow: false, // 折扣券、活动券条件筛选弹窗
    excExpireShow: false, // 换购券-过期弹窗提醒
    excType: 1, //换购类型，默认1红牛 2战马 
    actType: 3, //默认3折扣券 4 活动券 
    dateRangeHn: JSON.parse(JSON.stringify(initDateRange)), //今日 近7天 15 30
    dateRangeZm: JSON.parse(JSON.stringify(initDateRange)), //今日 近7天 15 30
    pickerConfig, // 日期时分秒组件默认配置
    isPickerShow: false, // 显示日期时分秒组件
    hnSelectDate: JSON.parse(JSON.stringify(initSelectDate)), // 开始时间、结束时间参数
    zmSelectDate: JSON.parse(JSON.stringify(initSelectDate)),
    discountSelectDate: JSON.parse(JSON.stringify(initSelectDate)),
    actSelectDate: JSON.parse(JSON.stringify(initSelectDate)),
    selectDateName: 'hnSelectDate', //默认存储
    dateRangeName: 'dateRangeHn',
    couponTypeName: 'hnCouponTypeArr',
    hnCouponTypeArr: JSON.parse(JSON.stringify(initCouponType)), //卡券类型
    zmCouponTypeArr: JSON.parse(JSON.stringify(initCouponType)), //卡券类型
    file_url_9m: `${COS_URL}/public/img/bfyl/2023/09`, //23年9月 cos图片资源
    // 折扣券、活动券相关数据初始化
    disDateRange: JSON.parse(JSON.stringify(initDateRange)),
    actDateRange: JSON.parse(JSON.stringify(initDateRange)),
    disSelectDate: JSON.parse(JSON.stringify(initSelectDate)), // 开始时间、结束时间参数
    actSelectDate: JSON.parse(JSON.stringify(initSelectDate)), // 开始时间、结束时间参数
    disGoodTypeArr: '', // 产品类型初始化
    actGoodTypeArr: '', // 产品类型初始化
    actDateRangeName: 'disDateRange',
    actSelectDateName: 'disSelectDate',
    actGoodTypeName: 'disGoodTypeArr',
    dateRangeAct: '',
    selectDateAct: '',
    goodTypeArrAct: '',
    icon_close: COS_URL + '/public/img/phaseIII/20211020/icon_close.png',
    icon_voucher: COS_URL + '/public/img/bfyl/2023/05/img_voucher.png',
    voucher_icon_btn: COS_URL + '/public/img/phaseIII/20211020/icon_btn.png',
    hxnotice_link: `${COS_URL}/public/img/bfyl/2023/05/hxnotice27.html`,

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭弹窗
    onClose(event) {
      let {
        popname
      } = event.currentTarget.dataset;
      this.setData({
        [popname]: false
      })
    },
    // 显示换购券筛选弹窗
    showExcFilterPop(excType = 1) {
      // 标记好需要修改的 日期筛选，开始截止时间对象（后续重置，确定也是取对应的数据）
      let dateRangeName = excType == 1 ? 'dateRangeHn' : 'dateRangeZm';
      let selectDateName = excType == 1 ? 'hnSelectDate' : 'zmSelectDate';
      let couponTypeName = excType == 1 ? 'hnCouponTypeArr' : 'zmCouponTypeArr';
      this.initDateRange(dateRangeName);
      let excDateRange = this.data[dateRangeName];
      let excSelectDate = this.data[selectDateName];
      let excCouponTypeArr = this.data[couponTypeName];
      // 战马隐藏产品兑换券 
      if (excType == 2) {
        excCouponTypeArr.forEach(item => {
          if (item.id == 3) {
            item.show = false
          }
        })
      }
      this.setData({
        excFilterShow: true,
        excType,
        selectDateName,
        dateRangeName,
        couponTypeName,
        excDateRange,
        excSelectDate,
        excCouponTypeArr
      })
    },
    // 显示折扣券、活动券筛选弹窗 3 折扣券 4 活动券
    showActFilterPop(actType = 3) {
      // 标记好需要修改的 日期筛选，开始截止时间对象（后续重置，确定也是取对应的数据）
      let actDateRangeName = actType == 3 ? 'disDateRange' : 'actDateRange';
      let actSelectDateName = actType == 3 ? 'disSelectDate' : 'actSelectDate';
      let actGoodTypeName = actType == 3 ? 'disGoodTypeArr' : 'actGoodTypeArr';
      this.initDateRange(actDateRangeName);
      let actDateRange = this.data[actDateRangeName];
      let actSelectDate = this.data[actSelectDateName];
      let actGoodTypeArr = this.data[actGoodTypeName];
      this.setData({
        actFilterShow: true,
        actType,
        actDateRangeName,
        actSelectDateName,
        actGoodTypeName,
        [actDateRangeName]: actDateRange,
        [actSelectDateName]: actSelectDate,
        [actGoodTypeName]: actGoodTypeArr,
        dateRangeAct: actDateRange,
        selectDateAct: actSelectDate,
        goodTypeArrAct: actGoodTypeArr
      })
    },
    // 选择天
    selectDay(event) {
      let {
        id
      } = event.currentTarget.dataset;
      let {
        selectDateName,
        dateRangeName
      } = this.data;
      let dateRange = this.data[dateRangeName];
      dateRange.forEach(item => {
        if (item.id == id) {
          item.checked = !item.checked
        } else {
          item.checked = false
        }
      })
      let _selectDate = JSON.parse(JSON.stringify(initSelectDate));

      this.setData({
        [dateRangeName]: dateRange,
        [selectDateName]: _selectDate,
        excDateRange: dateRange,
        excSelectDate: _selectDate
      })

    },
    // 折扣券、活动券 时间筛选
    actSelectDay(event) {
      let {
        id
      } = event.currentTarget.dataset;
      let {
        actSelectDateName,
        actDateRangeName
      } = this.data;
      let dateRange = this.data[actDateRangeName];
      dateRange.forEach(item => {
        if (item.id == id) {
          item.checked = !item.checked
        } else {
          item.checked = false
        }
      })
      let _selectDate = JSON.parse(JSON.stringify(initSelectDate));

      this.setData({
        [actDateRangeName]: dateRange,
        [actSelectDateName]: _selectDate,
        dateRangeAct: dateRange,
        selectDateAct: _selectDate
      })

    },
    // 初始化 日期区间范围
    initDateRange(name) {
      let dateRange = this.data[name];
      dateRange.forEach(item => {
        let res = '';
        let day = item.days
        if (day < 0) {
          let days = Math.abs(day);
          res = getRecentDaysStartAndEnd(days, day)
        } else {
          res = getRecentDaysStartAndEnd(day)
        }
        let {
          start,
          end
        } = res;
        item.start_time = start;
        item.end_time = end;
        // item.checked = false;
      })
      this.setData({
        [name]: dateRange
      })
    },
    // 重置日期区间范围
    resetDateRange(name) {
      let dateRange = this.data[name];
      dateRange.forEach(item => {
        item.checked = false;
      })
      this.setData({
        [name]: dateRange
      })
    },
    // 显示日期选择组件
    showTimePicker(event) {
      let {
        type = 0
      } = event.currentTarget.dataset;
      let {
        selectDateName
      } = this.data;
      let selectType = `${selectDateName}.selectType`;

      this.setData({
        isPickerShow: true,
        [selectType]: type
      })
    },
    showActTimePicker(event) {
      let {
        type = 0
      } = event.currentTarget.dataset;
      let {
        actSelectDateName
      } = this.data;
      let selectType = `${actSelectDateName}.selectType`;

      this.setData({
        actPickerShow: true,
        [selectType]: type
      })
    },
    // 隐藏日期选择组件
    pickerHide: function () {
      this.setData({
        isPickerShow: false,
        actPickerShow: false,
      });
    },
    setPickerTime: function (val) {
      let data = val.detail;
      let {
        selectDateName,
        dateRangeName
      } = this.data;
      let {
        selectType,
        start_time_timestamp,
        end_time_timestamp
      } = this.data[selectDateName];
      let time = selectType == 0 ? `${selectDateName}.start_time` : `${selectDateName}.end_time`;
      let timestamp = time + '_timestamp';
      if (selectType == 0) {
        start_time_timestamp = data.s_time;
      } else {
        end_time_timestamp = data.s_time;
      }
      // 需要判断选择的范围是否大于半年 24*60*60*1000*365/2
      let rang_max = 24 * 60 * 60 * 1000 * 365 / 2;
      let range_diff = Math.abs(end_time_timestamp - start_time_timestamp);
      if (start_time_timestamp && end_time_timestamp && range_diff > rang_max) {
        wx.showToast({
          title: '时间筛选最多筛选半年区间~',
          icon: 'none'
        })
        return
      }
      // 结束时间不能小于开始时间
      if (start_time_timestamp && end_time_timestamp && end_time_timestamp < start_time_timestamp) {
        wx.showToast({
          title: '结束时间不能小于开始时间~',
          icon: 'none'
        })
        return
      }
      // 重置掉已经选择的时间：今天 7 15 30·····
      let dateRange = this.data[dateRangeName];
      dateRange.forEach(item => {
        item.checked = false
      })
      let _selectDate = this.data[selectDateName];
      if (selectType == 0) {
        _selectDate.start_time = data.startTime;
        _selectDate.start_time_timestamp = data.s_time;
      } else {
        _selectDate.end_time = data.startTime;
        _selectDate.end_time_timestamp = data.s_time;
      }
      this.setData({
        [time]: data.startTime,
        [timestamp]: data.s_time,
        [dateRangeName]: dateRange,
        excDateRange: dateRange,
        excSelectDate: _selectDate
      });
      console.log("initSelectDate:", initSelectDate);
    },
    setActPickerTime: function (val) {
      let data = val.detail;
      let {
        actSelectDateName,
        actDateRangeName
      } = this.data;
      let {
        selectType,
        start_time_timestamp,
        end_time_timestamp
      } = this.data[actSelectDateName];
      let time = selectType == 0 ? `${actSelectDateName}.start_time` : `${actSelectDateName}.end_time`;
      let timestamp = time + '_timestamp';
      if (selectType == 0) {
        start_time_timestamp = data.s_time;
      } else {
        end_time_timestamp = data.s_time;
      }
      // 需要判断选择的范围是否大于半年 24*60*60*1000*365/2
      let rang_max = 24 * 60 * 60 * 1000 * 365 / 2;
      let range_diff = Math.abs(end_time_timestamp - start_time_timestamp);
      if (start_time_timestamp && end_time_timestamp && range_diff > rang_max) {
        wx.showToast({
          title: '时间筛选最多筛选半年区间~',
          icon: 'none'
        })
        return
      }
      // 结束时间不能小于开始时间
      if (start_time_timestamp && end_time_timestamp && end_time_timestamp < start_time_timestamp) {
        wx.showToast({
          title: '结束时间不能小于开始时间~',
          icon: 'none'
        })
        return
      }
      // 重置掉已经选择的时间：今天 7 15 30·····
      let dateRange = this.data[actDateRangeName];
      dateRange.forEach(item => {
        item.checked = false
      })
      let _selectDate = this.data[actSelectDateName];
      if (selectType == 0) {
        _selectDate.start_time = data.startTime;
        _selectDate.start_time_timestamp = data.s_time;
      } else {
        _selectDate.end_time = data.startTime;
        _selectDate.end_time_timestamp = data.s_time;
      }
      this.setData({
        [time]: data.startTime,
        [timestamp]: data.s_time,
        [actDateRangeName]: dateRange,
        dateRangeAct: dateRange,
        selectDateAct: _selectDate
      });
    },
    // 选择卡券类型
    selectCouponType(event) {
      let {
        id
      } = event.currentTarget.dataset;
      let name = this.data.couponTypeName;
      let _couponTypeSelect = this.data[name];
      _couponTypeSelect.forEach(item => {
        if (item.id == id) {
          item.checked = !item.checked;
        } else {
          item.checked = false
        }
      })
      this.setData({
        [name]: _couponTypeSelect,
        excCouponTypeArr: _couponTypeSelect
      })
    },
    // 重置筛选条件:日期，产品类型，开始截止时间
    resetFilter(event) {
      let {
        dateRangeName,
        selectDateName,
        couponTypeName
      } = this.data;
      let couponTypeArr = this.data[couponTypeName];
      couponTypeArr.forEach(item => {
        item.checked = false
      })
      this.resetDateRange(dateRangeName);
      this.triggerEvent('initFilterData', {
        filterArr: [],
      })
      this.setData({
        [selectDateName]: JSON.parse(JSON.stringify(initSelectDate)),
        couponTypeArr,
        excFilterShow: false,

      })

    },
    // 折扣券、活动券 重置参数
    actResetFilter(event) {
      let {
        actDateRangeName,
        actSelectDateName,
        actGoodTypeName
      } = this.data;
      let actGoodTypeArr = this.data[actGoodTypeName];
      actGoodTypeArr.forEach(item => {
        item.set.forEach(itm => {
          itm.checked = false
        })
      })
      this.resetDateRange(actDateRangeName);
      this.triggerEvent('initFilterData', {
        filterArr: [],
      })
      this.setData({
        [actSelectDateName]: JSON.parse(JSON.stringify(initSelectDate)),
        goodTypeArrAct: actGoodTypeArr,
        [actGoodTypeName]: actGoodTypeArr,
        actFilterShow: false,

      })

    },
    // 确定，导出筛选条件传给列表页面, 关闭弹窗
    confirmFilter(event) {

      let {
        dateRangeName,
        selectDateName,
        couponTypeName,
      } = this.data;
      let dateRange = this.data[dateRangeName];
      let selectDate = this.data[selectDateName];
      let couponTypeArr = this.data[couponTypeName];
      let filterArr = []
      let dateChekced = dateRange.find(item => item.checked == true)
      if (dateChekced) {
        let obj = {
          name: dateRangeName,
          id: 1,
          label: dateChekced.label,
          idx: dateChekced.id, //关闭标签时候需要查找的id
          start_time: dateChekced.start_time,
          end_time: dateChekced.end_time,
        }
        filterArr.push(obj)

      }
      if (selectDate.start_time && selectDate.end_time) {
        let obj = {
          name: selectDateName,
          label: `${selectDate.start_time}~${selectDate.end_time}`,
          id: 1,
          idx: selectDate.id, //关闭标签时候需要查找的id
          start_time: selectDate.start_time,
          end_time: selectDate.end_time,
        }
        filterArr.push(obj)
      }
      let couponTypeChekced = couponTypeArr.find(item => item.checked == true)
      if (couponTypeChekced) {
        let label = couponTypeChekced.label
        let obj = {
          name: couponTypeName,
          label,
          id: 2,
          idx: couponTypeChekced.id, //关闭标签时候需要查找的id
          value: couponTypeChekced.value
        }
        filterArr.push(obj)
      }
      this.setData({
        excFilterShow: false,

      })
      // console.log("filterPop filterArr:",filterArr);
      this.triggerEvent('initFilterData', {
        filterArr,
      })

    },
    // 折扣券、活动券 确定，导出筛选条件传给列表页面, 关闭弹窗
    actConfirmFilter(event) {

      let {
        actDateRangeName,
        actSelectDateName,
        actGoodTypeName,
      } = this.data;
      let dateRange = this.data[actDateRangeName];
      let selectDate = this.data[actSelectDateName];
      let actGoodTypeArr = this.data[actGoodTypeName];
      let filterArr = []
      let dateChekced = dateRange.find(item => item.checked == true)
      if (dateChekced) {
        let obj = {
          name: actDateRangeName,
          id: 1,
          label: dateChekced.label,
          idx: dateChekced.id, //关闭标签时候需要查找的id
          start_time: dateChekced.start_time,
          end_time: dateChekced.end_time,
        }
        filterArr.push(obj)

      }
      if (selectDate.start_time && selectDate.end_time) {
        let obj = {
          name: actSelectDateName,
          label: `${selectDate.start_time}~${selectDate.end_time}`,
          id: 1,
          idx: selectDate.id, //关闭标签时候需要查找的id
          start_time: selectDate.start_time,
          end_time: selectDate.end_time,
        }
        filterArr.push(obj)
      }
      // 选择的产品类型
      actGoodTypeArr.forEach(item => {
        item.set.forEach((itm) => {
          if (itm.checked) {
            itm.name = item.name;
            let label = itm.sku == '全部' ? item.name : itm.sku;
            let obj = {
              name: actGoodTypeName,
              label,
              id: `${item.name}_${itm.arg}`,
              arg: itm.arg
            }
            filterArr.push(obj)
          }
        })
      })
      this.setData({
        actFilterShow: false,
      })
      this.triggerEvent('initFilterData', {
        filterArr,
      })

    },
    // 删除标签
    deleteTag(item = '') {
      console.log("兜兜转转又回到filterPop组件：", item);
      if (item) {
        //disGoodTypeArr actGoodTypeArr 的特殊处理
        if (item.name == 'disGoodTypeArr' || item.name == 'actGoodTypeArr') {
          let {
            name,
            id
          } = item;
          let nameObj = this.data[name];
          let id_arr = id.split('_');
          nameObj.forEach(item => {
            item.set.forEach(itm => {
              if (item.name == id_arr[0] && itm.arg == id_arr[1]) {
                itm.checked = false
              }
            })
          })
          this.setData({
            [name]: nameObj
          })
          return
        }


        let {
          name,
          idx
        } = item;
        let nameObj = this.data[name];
        // 有可能是开始-结束时间，不是数组
        if (name.search('SelectDate') > -1) {
          nameObj = JSON.parse(JSON.stringify(initSelectDate))
        } else {
          nameObj.forEach(item => {
            if (item.id == idx) {
              item.checked = !item.checked
            } else {
              item.checked = false
            }

          })
        }
        this.setData({
          [name]: nameObj
        })

      }
    },
    // 折扣券、活动券 选择产品类型
    selectGood(event) {
      let {
        name,
        arg
      } = event.currentTarget.dataset;
      let {
        actGoodTypeName
      } = this.data;
      let actGoodTypeArr = this.data[actGoodTypeName];
      actGoodTypeArr.forEach(item => {
        item.set.forEach(sku => {
          if (item.name == name && sku.arg == arg) {
            sku.checked = !sku.checked
          } else {
            sku.checked = false

          }
          // if (item.name == name && sku.arg != arg) {
          //   sku.checked = false
          // }
        })
      })
      this.setData({
        [actGoodTypeName]: actGoodTypeArr,
        goodTypeArrAct: actGoodTypeArr
      })
    },
    // 初始化 产品类型参数
    initSkuParams(skuParams) {
      // 产品类型初始化  checked默认false
      skuParams.forEach(item => {
        item.set.forEach(itm => {
          itm.checked = false;
        })
      });
      let {
        disGoodTypeArr,
        actGoodTypeArr
      } = this.data;
      // 红牛、战马产品类型初始化 
      disGoodTypeArr = JSON.parse(JSON.stringify(skuParams));
      actGoodTypeArr = JSON.parse(JSON.stringify(skuParams));
      this.setData({
        disGoodTypeArr,
        actGoodTypeArr
      })
    },
    showExcExpirePop(){
      this.setData({
        excExpireShow: true
      })
    },
    // 点击查看核销通知详情
    jumpToWebview() {
      let link = this.data.hxnotice_link + '?num=' + Math.random(100);
      link = encodeURIComponent(link);
      wx.navigateTo({
        url: '/pages/phaseIII/voucher/webview?link=' + link,
        success: () => {
          this.setData({
            excExpireShow: false
          })
        }
      })
    },
  },
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    async attached() {
      // 初始化 dateRange 的日期范围

    },
    // 在组件实例被从页面节点树移除时执行
    detached: function () {},
  },
  pageLifetimes: {
    // 页面被展示
    show: function () {},
    // 页面被隐藏
    hide: function () {
      let data = this.data;
      Object.keys(data).forEach(item => {
        if (typeof data[item] === 'boolean' && data[item] === true) {
          this.setData({
            [item]: false
          })
        }
      });
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }
})