// pages/storeOrder/index/index.js
import {
  ylcount
} from '../../api/index';
let isFilter = false; //筛选时候隐藏顶部统计
const {
  getUserLocation
} = require("../../../../utils/location")
const log = require("../../../../utils/log");
const utils = require('../../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 设置导航数组
    tabs: [{
        id: 0,
        title: "全部",
        count: ''
      },
      {
        id: 1,
        title: "待受理",
        count: ''
      },
      {
        id: 2,
        title: "待配送",
        count: ''

      },
      {
        id: 3,
        title: "待收货",
        count: ''
      },
      {
        id: 4,
        title: "已完成",
      }

    ],
    active: 1, // 当前选中的Index值：默认待受理
    icon_filter: '../../static/icon_filter.png',
    icon_filter_active: '../../static/icon_filter_active.png',
    icon_monthly_order: '../../static/icon_monthly_order.png',
    isFilter: false, //筛选中
    batchHxPopShow:false,// 批量核销弹窗显示隐藏，控制page-meta 尝试解决弹窗内滚动穿透问题
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("页面传参：", options);
    log.addFilterMsg("myorder");
    log.info("页面传参：", options);
    let activeTab = options.activeTab || 1;
    activeTab = Number(activeTab);
    if (isNaN(activeTab)) {
      activeTab = 0;
    }
    this.setData({
      active: activeTab
    })

    /**自动获取一次经纬度 */
    getUserLocation().then(res => {})
  },
  onReady() {
    let userdata = wx.getStorageSync('userdata') || null;
    if (userdata) {
      if (userdata.condition == 2) {
        wx.setNavigationBarTitle({
          title: '我的任务',
        })
      }
    } else {

      utils.getUserInfoNew().then(data => {

        if (data.condition == 2) {
          wx.setNavigationBarTitle({
            title: '我的任务',
          })
        }

      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.refreshAll();
    console.log("onShow:", this.selectComponent("#fhPopup"));

  },
  refresh() {
    console.log("refresh````");
    this.selectAllComponents('.item-list').forEach(item => {
      item.reset()
    })
  },
  //刷新所有数据
  refreshAll() {
    //更新顶部
    this.getCount()
    //列表
    this.refresh()
  },
  getCount() {
    let tabs = this.data.tabs;
    let active = this.data.active;
    if (isFilter) {
      tabs[1]['count'] = 0;
      tabs[2]['count'] = 0;
      tabs[3]['count'] = 0;
      this.setData({
        tabs
      })
      return
    }
    ylcount().then(res => {
      console.log(res);
      let {
        code,
        data,
        msg
      } = res;
      if (code == 1) {
        //待接单:status_1,待配送:status_2,待收货：status_3
        let {
          status_1,
          status_2,
          status_3,
          old
        } = data;
        tabs[1]['count'] = old.status_1.order;
        tabs[2]['count'] = old.status_2.order;
        tabs[3]['count'] = old.status_3.order;
        // 以下为所有订单：返货+在线支付+货到付款
        // tabs[1]['count'] = status_1.pay_type[0]['o_sum'] + status_1.pay_type[1]['o_sum'] + old.status_1.order;
        // tabs[2]['count'] = status_2.pay_type[0]['o_sum'] + status_2.pay_type[1]['o_sum'] + old.status_2.order;
        // tabs[3]['count'] = status_3.pay_type[0]['o_sum'] + status_3.pay_type[1]['o_sum'] + old.status_3.order;
        this.setData({
          tabs
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
  /**业务函数 */
  tabChange(e) {
    console.log("tabChange：", e.detail.name);
    this.setData({
      active: e.detail.name
    })
  },
  swiperChange(e) {
    // console.log(e);
    this.setData({
      active: e.detail.current
    })
  },
  //打开筛选
  openFilterPop() {
    this.selectComponent("#order-filter").showPop()
  },
  // 打开月结订单
  openMonthlyOrder() {
    wx.navigateTo({
      url: '/pages/storeOrder/monthlyOrder/index/index',
    })
  },
  //筛选订单:trigger 触发，接受返回的参数
  filterOrder(event) {
    let {
      detail
    } = event;
    console.log("订单筛选传参:", detail)
    let active = this.data.active;
    //有订单筛选条件
    if (detail) {
      //区分不同的订单类型 order_type：1 先付后货，2货到付款，3返货订单
      let {
        order_type = null, start_time, end_time
      } = detail;
      let param = {
        start_time,
        end_time
      };
      if (order_type == 1) {
        param.pay_type = 0;
      }
      if (order_type == 2) {
        param.pay_type = 1;
      }
      if (order_type == 3) {
        param.order_mark = 1;
      }
      isFilter = order_type;
      if (!isFilter) {
        isFilter = start_time || end_time ? true : false
      }
      this.setData({
        isFilter
      })
      //刷新item-list
      this.selectAllComponents('.item-list').forEach(item => {
        item.filterList(param);
      })

    } else {
      // 重置所有列表参数
      // this.selectComponent(`#item-list-${active}`).filterList(null);
      this.selectAllComponents('.item-list').forEach(item => {
        item.filterList(null);
      })
      //重置tab统计
      isFilter = false;
      this.setData({
        isFilter
      })
      this.getCount();
    }
  },
  //返货订单fhTrigger
  fhTrigger(event) {
    let {
      type,
      item
    } = event.detail;
    console.log("fhTrigger:", type, item);
    switch (type) {
      case 'showCancelPop':
        this.selectComponent("#fhPopup").showCancelPop(item);
        break;
      case 'showRemindPop':
        this.selectComponent("#fhPopup").showRemindPop(item);
        break;
      case 'showCheckPop':
        this.selectComponent("#fhPopup").showCheckPop(item);
        break;
      default:
        break;
    }

  },
  //商城订单trigger
  storeOrderTrigger(event) {
    let {
      type,
      item
    } = event.detail;
    console.log("storeOrderTrigger:", type, item);
    switch (type) {
      case 'rejectOrdersShow': //拒绝订单弹窗
        this.selectComponent("#orderPopup").rejectOrdersShow(item);
        break;
      case 'acceptOrdersShow': //接受订单弹窗
        this.selectComponent("#orderPopup").acceptOrdersShow(item);
        break;
      case 'cancelOrdersShow': //取消订单
        this.selectComponent("#orderPopup").cancelOrdersShow(item);
        break;
      case 'confirmReceiptShow': //确认收货
        this.selectComponent("#orderPopup").confirmReceiptShow(item);
        break;
      case 'rejectReceiptShow': //拒绝收货
        this.selectComponent("#orderPopup").rejectReceiptShow(item);
        break;
      case 'dxdConfirmShow': //代下单确认
        this.selectComponent("#orderPopup").dxdConfirmShow(item);
        break;
      default:
        break;
    }
  },
  // 2023年8月21日  新增 tab beforeChange
  beforeChange(event) {
    let {
      callback,
      name
    } = event.detail;
    this.setData({
      active: name
    })
    if (typeof callback == "function") {
      callback(true)
    }
  },
  // 2023年9月11日 批量核销弹窗
  batchTrigger(event) {
    let {
      type,
      item
    } = event.detail;
    this.setData({
      batchHxPopShow:true
    });
    switch (type) {
      case 'showSelectPop':
        this.selectComponent("#batchHxPop").showSelectPop(item);
        break;
      default:
        break;
    }
  },
  // 2023年9月21日 changeTabs
  changeTabs(event){
    console.log(event)
    let {id=0} = event.currentTarget.dataset;
    this.setData({
      active:id
    })
  },
  // 2023年9月23日 批量核销组件内的关闭弹窗事件
  batchHxPopClose(){
    this.setData({
      batchHxPopShow:false
    })
  },
})