// pages/storeOrder/component/order-filter-pop/index.js
const utils = require("../../../../utils/util");
const filter_type_arr = [{
    name: '先付后货',
    type: 1
  },
  {
    name: '货到付款',
    type: 2
  },
  {
    name: '返货订单',
    type: 3
  },
]
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false, //弹窗显示隐藏
    icon_close: '../../static/icon_close.png', //弹窗关闭图标
    filter_type_arr, //过滤参数的数组
    activeIndex: '', //订单类型选中的索引
    start_time: '', //起始时间
    end_time: '', //终止时间
    calendarShow: false, //日历弹窗
    // minDate: Date.now(), //设置日历最小选择日期
    minDate: '', //设置日历最小选择日期
    maxDate:Date.now(),//最大可选为当前日期
    // minDate: new Date(2020, 0, 1).getTime(), //设置日历最小选择日期
  },
  attached() {
    // setTimeout(() => {
    //   this.setData({
    //     minDate: new Date(2020, 0, 1).getTime(), //设置日历最小选择日期
    //   })
    // }, 0)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //显示弹窗
    showPop() {
      this.setData({
        show: true,
        minDate: new Date(2020, 0, 1).getTime(), //设置日历最小选择日期
      })
    },
    //关闭订单筛选弹窗
    onClose() {
      this.setData({
        show: false
      })
    },
    //选择订单类型
    chooseOrderType(event) {
      let {
        index,
        type
      } = event.currentTarget.dataset;
      console.log(index, type);
      let activeIndex = this.data.activeIndex;
      //点击同一个，取消显示
      if (index == activeIndex) {
        this.setData({
          activeIndex: ''
        })
      } else {
        this.setData({
          activeIndex: index
        })
      }
    },
    //关闭日历
    onCloseCalender() {
      this.setData({
        calendarShow: false
      })
    },
    //打开日历
    openCalendar() {
      this.setData({
        calendarShow: true
      })
    },
    // 选择日期回调
    chooseDate(event) {
      console.log(event)
      const [start, end] = event.detail;
      let start_time = this.formatDate(start);
      let end_time = this.formatDate(end);
      this.setData({
        start_time,
        end_time,
        calendarShow: false
      })
    },
    formatDate(date) {
      date = new Date(date).getTime();
      return `${utils.parseTime(date,"{y}-{m}-{d}")}`;
    },
    // 重置
    reset() {
      // 重置时间，类型，回调给父组件
      this.setData({
        start_time: '',
        end_time: '',
        activeIndex: '',
        show: false
      })
      this.triggerEvent('myevent', null)
    },
    // 确定
    confirm() {
      //判断时间，类型（区分订单类型）参数回调给父组件
      let obj = {
        start_time: '',
        end_time: '',
        order_type: ''
      };
      let {
        start_time,
        end_time,
        activeIndex
      } = this.data;
      if (start_time && end_time) {
        obj.start_time = start_time;
        obj.end_time = end_time;
      }
      //判断订单的类型：1 先付后货，2货到付款，3返货订单
      if (activeIndex) {
        obj.order_type = activeIndex;
      }

      this.triggerEvent('myevent', obj);
      this.setData({
        show: false
      })
    },
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }
})