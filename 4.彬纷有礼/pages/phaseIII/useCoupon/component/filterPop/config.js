const utils = require('../../../../../utils/util');
// 今天 近7天····初始化
const dateRange = [
  // {
  //   id: 1,
  //   checked:false,
  //   label: '昨日',
  //   days: -1,
  //   start_time: '',
  //   end_time: '',
  // },
  {
    id: 1,
    checked: false,
    label: '今天',
    days: 1,
    start_time: '',
    end_time: '',
  },
  {
    id: 2,
    checked: false,
    label: '近7天',
    days: 7,
    start_time: '',
    end_time: '',
  },
  {
    id: 3,
    checked: false,
    label: '近15天',
    days: 15,
    start_time: '',
    end_time: '',
  },
  {
    id: 4,
    checked: false,
    label: '近30天',
    days: 30,
    start_time: '',
    end_time: '',
  }
]
// 选择开始-结束时间初始化
const selectDate = {
  id: 1,
  start_time: '',
  end_time: '',
  start_time_timestamp: 0,
  end_time_timestamp: 0,
  selectType: ''
}
// 日期组件初始化
const pickerConfig = {
  endDate: false,
  column: "second",
  dateLimit: true,
  dateLimitBack: 180,
  initStartTimeBack: "",
  initEndTimeBack: "",
  limitStartTime: "2020-01-01 00:00:00",
  limitEndTime: utils.parseTime(Date.now(),'{y}-{m}-{d} {h}:{i}:{s}'),
  yearEnd:utils.parseTime(Date.now(),'{y}')

}
// 卡券类型
const initCouponType = [{
    id: 1,
    checked: false,
    label: '换购券',
    value: 1
  },
  {
    id: 2,
    checked: false,
    label: '换购奖励券',
    value: 2
  },
  {
    id: 3,
    checked: false,
    label: '产品兑换券',
    value: 3
  },
]
// 产品类型初始化

const initGoodType = [{
    name: "红牛",
    set: [{
        sku: "全部",
        arg: 1000,
        checked: false
      },
      {
        sku: "原味250ml",
        arg: 1001,
        checked: false
      },
      {
        sku: "强化250ml",
        arg: 1002,
        checked: false
      },
    ],
  },
  {
    name: "战马",
    set: [{
        sku: "全部",
        arg: 1003,
        checked: false
      },
      {
        sku: "罐装310ml",
        arg: 1004,
        checked: false
      },
      {
        sku: "瓶装400ml",
        arg: 1005,
        checked: false
      }
    ],
  },
  {
    name: "芙丝",
    set: [{
      sku: "全部",
      arg: 1006,
      checked: false
    }],
  },
  {
    name: "唯他可可",
    set: [{
      sku: "全部",
      arg: 1010,
      checked: false
    }],
  },
];


module.exports = {
  initDateRange: dateRange,
  initSelectDate: selectDate,
  initPickerConfig: pickerConfig,
  initCouponType,
  initGoodType
}