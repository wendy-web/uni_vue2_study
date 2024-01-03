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
      type: Array,
      value: [], //产品类型
      observer: function (skuParams) {
        if (skuParams) {
          this.initSkuParams(skuParams);
        }
      }
    },
    member: {
      type: Array,
      value: [], //产品类型
      observer: function (member) {
        console.log("核销中····店员信息：", member);
        if (member) {
          this.initMember(member);
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    filterShow: false, // 换购券条件筛选弹窗
    swiperIdx: 0, // 默认第一个swiper 核销中
    dateRange_0: JSON.parse(JSON.stringify(initDateRange)), //今日 近7天 15 30
    dateRange_1: JSON.parse(JSON.stringify(initDateRange)), //今日 近7天 15 30
    dateRange_2: JSON.parse(JSON.stringify(initDateRange)), //今日 近7天 15 30
    dateRange_3: JSON.parse(JSON.stringify(initDateRange)), //今日 近7天 15 30
    dateRange_4: JSON.parse(JSON.stringify(initDateRange)), //今日 近7天 15 30
    pickerConfig, // 日期时分秒组件默认配置
    isPickerShow: false, // 显示日期时分秒组件
    selectDate_0: JSON.parse(JSON.stringify(initSelectDate)), // 开始时间、结束时间参数
    selectDate_1: JSON.parse(JSON.stringify(initSelectDate)), // 开始时间、结束时间参数
    selectDate_2: JSON.parse(JSON.stringify(initSelectDate)), // 开始时间、结束时间参数
    selectDate_3: JSON.parse(JSON.stringify(initSelectDate)), // 开始时间、结束时间参数
    selectDate_4: JSON.parse(JSON.stringify(initSelectDate)), // 开始时间、结束时间参数
    dateRangeName: 'dateRange_0',
    selectDateName: 'selectDate_0', //默认存储
    couponTypeName: 'couponTypeArr_2',
    goodTypeArrName: 'goodTypeArr_0',
    crewArrName: 'crewArr_0', //相关人员 默认存储名
    couponTypeArr_0: JSON.parse(JSON.stringify(initCouponType)), //卡券类型 只有筛选换购券的时候才有
    couponTypeArr_1: JSON.parse(JSON.stringify(initCouponType)), //卡券类型 只有筛选换购券的时候才有
    couponTypeArr_2: JSON.parse(JSON.stringify(initCouponType)), //卡券类型 只有筛选换购券的时候才有
    couponTypeArr_3: JSON.parse(JSON.stringify(initCouponType)), //卡券类型 只有筛选换购券的时候才有
    couponTypeArr_4: JSON.parse(JSON.stringify(initCouponType)), //卡券类型 只有筛选换购券的时候才有
    file_url_9m: `${COS_URL}/public/img/bfyl/2023/09`, //23年9月 cos图片资源
    // 折扣券、活动券相关数据初始化
    goodTypeArr_0: [], // 产品类型初始化 一共有5个
    goodTypeArr_1: [],
    goodTypeArr_2: [],
    goodTypeArr_3: [],
    goodTypeArr_4: [],
    crewArr_0: [],
    crewArr_1: [],
    crewArr_2: [],
    crewArr_3: [],
    crewArr_4: [],
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
    // 显示筛选弹窗
    showFilterPop(swiperIdx = 0) {
      // 标记好需要修改的 日期筛选，开始截止时间对象（后续重置，确定也是取对应的数据）
      let dateRangeName = 'dateRange_' + swiperIdx;
      let selectDateName = 'selectDate_' + swiperIdx;
      let couponTypeName = 'couponTypeArr_' + swiperIdx;
      let goodTypeArrName = 'goodTypeArr_' + swiperIdx;
      let crewArrName = 'crewArr_' + swiperIdx;
      this.initDateRange(dateRangeName);
      let dateRange = this.data[dateRangeName];
      let selectDate = this.data[selectDateName];
      let couponTypeArr = this.data[couponTypeName];
      let goodTypeArr = this.data[goodTypeArrName];
      let crewArr = this.data[crewArrName];
      this.setData({
        filterShow: true,
        swiperIdx,
        selectDateName,
        dateRangeName,
        couponTypeName,
        goodTypeArrName,
        crewArrName,
        dateRange,
        selectDate,
        couponTypeArr,
        goodTypeArr,
        crewArr
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
        dateRange: dateRange,
        selectDate: _selectDate
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
        dateRange: dateRange,
        selectDate: _selectDate
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
        couponTypeArr: _couponTypeSelect
      })
    },
    // 选择人员
    selectCrew(event) {
      let {
        uid
      } = event.currentTarget.dataset;
      let name = this.data.crewArrName;
      let _crewArr = this.data[name];
      _crewArr.forEach(item => {
        if (item.uid == uid) {
          item.checked = !item.checked;
        } else {

          item.checked = false;
        }
      })
      this.setData({
        [name]: _crewArr,
        crewArr: _crewArr
      })
    },
    // 重置筛选条件:日期，产品类型，开始截止时间
    resetFilter(event) {
      let {
        dateRangeName,
        selectDateName,
        couponTypeName,
        goodTypeArrName,
        crewArrName,
      } = this.data;
      let couponTypeArr = this.data[couponTypeName];
      couponTypeArr.forEach(item => {
        item.checked = false
      })
      let goodTypeArr = this.data[goodTypeArrName];
      goodTypeArr.forEach(item => {
        item.set.forEach(itm => {
          itm.checked = false
        })
      })
      let crewArr = this.data[crewArrName];
      crewArr.forEach(item => {
        item.checked = false
      })
      this.resetDateRange(dateRangeName);
      this.triggerEvent('initFilterData', {
        filterArr: [],
      })
      this.setData({
        [selectDateName]: JSON.parse(JSON.stringify(initSelectDate)),
        couponTypeArr,
        goodTypeArr,
        crewArr,
        filterShow: false,

      })

    },
    //  重置参数 传参swiperIdx
    resetFilterTrigger(swiperIdx = 0) {
      // 标记好需要修改的 日期筛选，开始截止时间对象（后续重置，确定也是取对应的数据）
      let dateRangeName = 'dateRange_' + swiperIdx;
      let selectDateName = 'selectDate_' + swiperIdx;
      let couponTypeName = 'couponTypeArr_' + swiperIdx;
      let goodTypeArrName = 'goodTypeArr_' + swiperIdx;
      let crewArrName = 'crewArr_' + swiperIdx;
      this.resetDateRange(dateRangeName);
      let dateRange = this.data[dateRangeName];
      // let selectDate = this.data[selectDateName];
      let couponTypeArr = this.data[couponTypeName];
      let goodTypeArr = this.data[goodTypeArrName];
      let crewArr = this.data[crewArrName];
      
      // let couponTypeArr = this.data[couponTypeName];
      couponTypeArr.forEach(item => {
        item.checked = false
      })
      // let goodTypeArr = this.data[goodTypeArrName];
      goodTypeArr.forEach(item => {
        item.set.forEach(itm => {
          itm.checked = false
        })
      })
      // let crewArr = this.data[crewArrName];
      crewArr.forEach(item => {
        item.checked = false
      })
      this.setData({
        swiperIdx,
        [selectDateName]: JSON.parse(JSON.stringify(initSelectDate)),
        couponTypeArr,
        goodTypeArr,
        crewArr,
        dateRange,
        selectDate:JSON.parse(JSON.stringify(initSelectDate)),
      })
      this.triggerEvent('initFilterData', {
        filterArr: [],
      })

    },
    // 确定，导出筛选条件传给列表页面, 关闭弹窗
    confirmFilter(event) {

      let {
        dateRangeName,
        selectDateName,
        couponTypeName,
        goodTypeArrName,
        crewArrName,
        swiperIdx
      } = this.data;
      let dateRange = this.data[dateRangeName];
      let selectDate = this.data[selectDateName];
      let couponTypeArr = this.data[couponTypeName];
      let goodTypeArr = this.data[goodTypeArrName];
      let crewArr = this.data[crewArrName];
      let filterArr = []
      // 时间筛选
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
      // 卡券类型 筛选
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
        console.log("couponTypeChekced:", couponTypeChekced);
        // 卡券筛选只有换购券才显示
        if (swiperIdx == 2) {
          filterArr.push(obj)
        }
      }
      // 产品类型筛选
      goodTypeArr.forEach(item => {
        item.set.forEach((itm) => {
          if (itm.checked) {
            itm.name = item.name;
            let label = itm.sku == '全部' ? item.name : itm.sku;
            let obj = {
              name: goodTypeArrName,
              label,
              id: `${item.name}_${itm.arg}`,
              arg: itm.arg
            }
            filterArr.push(obj)
          }
        })
      })
      // 人员筛选
      let crewChekcedArr = crewArr.filter(item => item.checked == true)
      if (crewChekcedArr.length) {
        crewChekcedArr.forEach(item => {
          let label = item.nick_name
          let obj = {
            name: crewArrName,
            label,
            check_uid: item.uid, //关闭标签时候需要查找的id
          }
          // 人员筛选只有核销中、已使用才显示
          if (swiperIdx < 2) {
            filterArr.push(obj)
          }
        })
      }
      this.setData({
        filterShow: false,

      })
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
      let {
        swiperIdx
      } = this.data;
      if (item) {
        // 删除产品类型
        if (item.name.search('goodTypeArr_') > -1) {
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
        // 删除人员：存在多选的情况
        if (item.name.search('crewArr_') > -1) {
          let {
            name,
            id
          } = item;
          let nameObj = this.data[name];
          let {
            label,
            check_uid
          } = item;
          nameObj.forEach(item => {
            if (item.nick_name == label && item.uid == check_uid) {
              item.checked = false
            }
          })
          this.setData({
            [name]: nameObj
          })
          return
        }
        // 删除时间
        let {
          name,
          idx
        } = item;
        let nameObj = this.data[name];
        // 有可能是开始-结束时间，不是数组
        if (name.search('selectDate') > -1) {
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
    //选择产品类型
    selectGood(event) {
      let {
        name,
        arg
      } = event.currentTarget.dataset;

      let {
        goodTypeArrName
      } = this.data;
      let goodTypeArr = this.data[goodTypeArrName];
      goodTypeArr.forEach(item => {
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
        [goodTypeArrName]: goodTypeArr,
        goodTypeArr
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
      // 红牛、战马产品类型初始化 
      let goodTypeArr_0 = JSON.parse(JSON.stringify(skuParams));
      let goodTypeArr_1 = JSON.parse(JSON.stringify(skuParams));
      let goodTypeArr_2 = JSON.parse(JSON.stringify(skuParams));
      let goodTypeArr_3 = JSON.parse(JSON.stringify(skuParams));
      let goodTypeArr_4 = JSON.parse(JSON.stringify(skuParams));
      this.setData({
        goodTypeArr_0,
        goodTypeArr_1,
        goodTypeArr_2,
        goodTypeArr_3,
        goodTypeArr_4,
      })
    },
    initMember(member) {
      // 产品类型初始化  checked默认false
      member.forEach(item => {
        item.checked = false;
      });
      // 红牛、战马产品类型初始化 
      let crewArr_0 = JSON.parse(JSON.stringify(member));
      let crewArr_1 = JSON.parse(JSON.stringify(member));
      let crewArr_2 = JSON.parse(JSON.stringify(member));
      let crewArr_3 = JSON.parse(JSON.stringify(member));
      let crewArr_4 = JSON.parse(JSON.stringify(member));
      this.setData({
        crewArr_0,
        crewArr_1,
        crewArr_2,
        crewArr_3,
        crewArr_4,
      })
    }
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