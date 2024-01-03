// pages/phaseIII/voucher/voucher.js
let app = getApp();
let COS_URL = app.globalData.COS_URL;
const http = require('../../../utils/api');
const utils = require('../../../utils/util');
const auth = require("../../../utils/auth");
let requesting = false;

let cosAddress = auth.getCosAddress();
// let voucher_25Arr = [null, 0, 1]; //prizeratetype:null,0,1为1元轻松享兑换券（红牛25周年活动）
let voucher_25Arr = 3; //prizeratetype:3为27周年
let log = require('../../../utils/log');
let _voucherExpPop = false;
let num = ''; //数量
let type_id = ''; //对应活动id
let _prizeratetype = ''; //对应券类型
//定义卡券类型map 只有25周年为 null 0 1,所以需要判断是否 等于 null（25周年）,其他类型直接取
import {
  voucher_tab_map as _voucher_tab_map,
  voucher_bg_map as itemBGMap,
  voucher_title_map as titleMap,
  hn_voucher_stamp_map as stampMap
} from './utils'
var that = null;
let voucher_tab_map = null;
let voucher_expire_time = Date.now() < new Date('2023/06/16 00:00:00').getTime();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    voucher_head: COS_URL + '/public/img/phaseIII/20210828/voucher_head.png',
    btn: COS_URL + '/public/img/phaseIII/202103/btn.png',
    itemBG_25: COS_URL + '/public/img/phaseIII/202103/itemBG_25_1.png',
    itemBG_26: COS_URL + '/public/img/phaseIII/202103/itemBG_26_1.png',
    stamp_25: COS_URL + '/public/img/phaseIII/202103/stamp_25.png',
    stamp_26: COS_URL + '/public/img/phaseIII/202103/stamp_26.png',
    line: COS_URL + '/public/img/phaseIII/202103/line.png',
    ydh: COS_URL + '/public/img/phaseIII/202103/ydh.png',
    ydhBG: COS_URL + '/public/img/phaseIII/202104/ydhBG0407.png',
    showCalendar: false, //日历弹窗：默认隐藏
    showTypePop: false, //类型选择弹窗，默认隐藏
    selectedDate: '', //选择的日期
    defaultDate: '', //默认页面初始化日期
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }], //日历弹窗按钮
    activeTab: 0, //默认选中0可用券
    checkAddressPop: false, //确认地址弹窗
    check_buttons: [{
      text: '确定',
      extClass: 'confirm'

    }, {
      text: '更改',
      extClass: 'cancel'
    }],
    //2021年8月28日 星期六 改版：兑换券，惠让券，活动券
    countcardInfo: '', //所有卡券统计信息
    exc_hn_list: [], //可用券列表
    hr_list: [], //惠让券列表
    act_list: [], //活动券列表
    icon_hr: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJsAAAAxCAMAAAD6OCs2AAAAWlBMVEX+HU79HU4AAAD+JE39PUj/KEz+QEj+Jkz/H0n+H0z/HE7+SkX/MUn9Rkb9MEr9OEn+HU79I039KUz9P0j////+jJn/8/T/0db/5ef+aXr+mKb+TmT+fYv+s7yJK1ufAAAADXRSTlOmXACdn+jnfh06x8ROTF8vXgAABQNJREFUWMOtmel22yAQRu3G8VIvqq1hE+L9X7OMGAnMsDinvciS0/655wNmiLL7tbE/XFeOx3B9wnf4fKfDXz/h9474Ou0XLmcU2txux3ufkRjGocgjMCw3P1JeK8+VP88/xIvUdl9fe7JL3E4dKRwpuVS4Mh2SClrMjfy8oL/vVk5RbkdqHa2YWYyNZ5cp0Ui1/MjEKL1vJncmt0s3M6/WsHuE1H4eG4oFud8sOHK7ttToXhIbP4utn1sa3J4Ibre6WBwVu39abSRWmdRdJ7aRBJkYh1n1lxuNBb4b0O380Uao2tFqw5Ga0cPb9WJrue3rZlGwm9uD8XlsSCzAqduhm1u22qIdK24stpcdFrGhHFsvt+tHDUHKvO7ayUY/IdV7aNapRVHBjFaTNujGd2nb7Vg1St0A8pagQNotOQE6m1IFE0pJQCkrwaZu5JUkV96n9bgEVBBLbhqkWXPjbgak1/F3dHLg+JTiaNWQ5jadVQRAReYwqQpgRjFyY8GJ10uAei2GxdjoXq29l09mNM7pkOIATCm3lxFCOD0JocEJj8a77eTG3W7N5aY0AaAJlcq5oJbnNkGBqVRAaiXkhm6nZleQIAOwfZGJ252WG88toECJDctj67gd6qXNI4EqGwBNKUhed3M36ge4PU2sa/SMsRH1c8ihFhrlJgKwfiG3ecEyt6jncaAa/Yq1LOZ2baihWw65aUDm6LbO+bLcCAA3paSx9coburXPHxLGdE6HbU6dUkoGt0dwI/AnqJB3hY1n0e3cLiESTAC2L3G9qdRN0/8vPyGTBC0CEpxA8txqJYTcLlU1yi2HuT3ILTtRLj2NFtrkv6IS2wuN8ubdbvVtigjxvheclFPHjXp9UCMcykUzvk2LbvuKWlx0cb2FPqVt4kZqrIbMMlHDhloqva3yhm6HxoTenfKsfUHS/KJc6jZwN6MAtHwD/8VEsX55Q7fWoVKRjfRgt1Ju8tPq5dq5OQA5zfCGMBpAxdze2RXdrq3TuDWeccFYavNmUCpxexTcBKgwnxNML/oing8nDXkxOV5C0O1Ym1Lq9SIceWeQhnzwGd3GubDe1pWmwYTlpmD2WgOrbW23agFBvJKisuvolDvRk9ys0szttbasGfQrurEWXy0h5HZulzcFgtyGRW4y/qnvm9ukQTI3LG/U6ecYIDuBtMubd7tVSttIsUm7tSvl7oOE4a7BbW64aWtuVoNauzzAg7yq25S77auh4fAa45obsjQsu7b4EXeetQbxaRqC3GbpvcnNTy6PrVne0O3UWm1iiW2MpwmfBC45KVANJV3hiLuEZhR6+/BmD/ZT5tV0u6DboXwCoX3qxOhREDGY17oZHDb2SWagm8EKh4kZQHjHam5TcrtW+9UYLs8wi5Xkt2V6cEJBczSfChGWzWenhKDbsTil5Mfgp/Hea61nhOn13Jha5Y1b6QUvcyKxDH4O75YQcuNqRBqXH0zOwyPL7J6kxmPrb1Oa035sXIy/ccvNyI6JkVz7FBL3AlMrxjb6qxkb2mVmtVdH/eVGNaT/PjAyJsttYLH13ot/XN1iz2LFLYttS21slg8u9mlsfCfwM9JIg9vxfcqXW28nRLH+aqv+vlB68zwmWh/GVnnB259RJHvnMMZRtyPD/xXbN1cjau+iW92A5IqwusvfovLU0j9P3s6/opvnfDr8nC/84PXlLxw/YUef/e1yCdeZ+BX5C/UTnTlpEvlZAAAAAElFTkSuQmCC', //惠让券图标
    hnTitle: app.globalData.hnTitle,
    hnTitleBlue: app.globalData.hnTitleBlue,
    zmTitle: app.globalData.zmTitle,
    //2021年10月20日 星期三 添加兑换券核销截止弹窗
    voucherExpPop: false, //兑换券即将过期弹窗
    voucher_icon_btn: COS_URL + '/public/img/phaseIII/20211020/icon_btn.png',
    voucher_icon_slogan: COS_URL + '/public/img/bfyl/202206/icon_slogan.png',
    icon_voucher: COS_URL + '/public/img/bfyl/2023/05/img_voucher.png',
    hxnotice_link: `${COS_URL}/public/img/bfyl/2023/05/hxnotice27.html`,
    icon_close: COS_URL + '/public/img/phaseIII/20211020/icon_close.png',
    stamp_27: COS_URL + '/public/img/bfyl/202201/icon_stamp27.png', //27周年换购券
    itemBG_27: COS_URL + '/public/img/bfyl/202201/bg_stamp27.png', //27周年换购券背景
    itemBGMap: itemBGMap, //卡券背景类型
    titleMap: titleMap, //卡券标题
    stampMap: stampMap, //卡券水印戳
    icon_stamp_zm: COS_URL + '/public/img/bfyl/202204/icon_stamp_zm.png',
    choosedType: '', //选中的券 的类型
    hasZmAct: false, //是否有战马活动券，默认false
    icon_new: COS_URL + '/public/img/bfyl/202205/icon_new.png',
    // 2023年1月9日 改版
    bg_used_history: COS_URL + '/public/img/bfyl/202301/bg_used_history.png', //使用记录背景
    bg_tips_bar: COS_URL + '/public/img/bfyl/202301/bg_tips_bar.png', //活动规则背景
    exc_active_tab: 1, //换购券下的tab；1红牛，2战马 默认2
    icon_warn_grey: COS_URL + '/public/img/bfyl/202301/icon_warn_grey.png',
    icon_arrow_right: COS_URL + '/public/img/bfyl/202301/icon_arrow_right.png',
    exc_hn_rule: COS_URL + '/public/img/bfyl/202302/img_hn_consumer_rule_28y.png',
    exc_zm_rule: COS_URL + '/public/img/bfyl/202301/img_coupon_rule_zm.png',
    icon_date: COS_URL + '/public/img/bfyl/202301/icon_date_2.png',
    icon_arrow_r_orange: COS_URL + '/public/img/bfyl/202301/icon_arrow_r_orange.png',
    exc_count_pop: false, //换购奖励统计详情
    hn_total: null, //红牛累计奖券
    hn_expire: null, //红牛已过期
    hn_used: null, //红牛已使用
    hn_unused: null, //红牛未使用
    exc_zm_list: [], //战马换购券列表
    exc_zm_nomore: false, //战马换购券无数据
    icon_stamp_hn_28: `${COS_URL}/public/img/storeRank/202305/icon_stamp_28th.png`,
    product_exc_count: null, //产品兑换券统计信息 2023年8月14日
    cashcoupon_file_url: `${COS_URL}/public/img/bfyl/2023/08/cashCoupon`, // cos 资源地址
    hn_unused_format: 0, //可用卡券 千分位
     // 2023年9月19日 phaseIII的static 静态资源迁移至COS
    file_phase_static:`${COS_URL}/public/img/bfyl/phase/static`,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.activeTab) {
      this.setData({
        activeTab: options.activeTab
      })
    }
    this.getcountcard();
    that = this;
    // 重置变量：防止修改tab 变量以后下一次尽量还是请求原来的参数
    voucher_tab_map = JSON.parse(JSON.stringify(_voucher_tab_map));
    this.getCurrentTabItem().then(item => {
      let nomore = item.nomore;
      this.setData({
        [nomore]: false
      })
      this.getCurrentApi(item, this.dataRefresh)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 重置变量：防止修改tab 变量以后下一次尽量还是请求原来的参数
    // voucher_tab_map = JSON.parse(JSON.stringify(_voucher_tab_map));
    // this.getCurrentTabItem().then(item => {
    //   let nomore = item.nomore;
    //   this.setData({
    //     [nomore]: false
    //   })
    //   this.getCurrentApi(item, this.dataRefresh)
    // })

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
    this.setData({
      checkAddressPop: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    _voucherExpPop = false;
    requesting = false;
    num = '';
    type_id = '';
    this.setData({
      voucherExpPop: false
    })
    voucher_tab_map = '';
    console.log("页面unload:", voucher_tab_map);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 刷新时间组件
    this.selectComponent("#timePicker").reset();
    this.initDate();
    this.getcountcard();
    this.getCurrentTabItem().then(item => {
      let nomore = item.nomore;
      this.setData({
        [nomore]: false
      })
      this.updateCurrentParam(item.reset_param);
      item.param = JSON.parse(JSON.stringify(item.reset_param));
      this.getCurrentApi(item, this.dataRefresh)
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getCurrentTabItem().then(item => {
      let nomore = this.data[item.nomore];
      console.log("item:", item);
      if (nomore || item.list == "act_list") return;
      this.getCurrentApi(item, this.dataProcess)
    })
  },
  onBeforeBack: function () {
    wx.navigateBack({
      delta: 0,
    })
  },
  chooseDate: function () {
    this.selectComponent("#timePicker").showModal()
    return
    this.setData({
      showCalendar: true
    });
  },
  initDate: function () {
    var recentMonth = utils.getLastMonth();
    var selectedDate = new Array();
    selectedDate.push(recentMonth.last);
    selectedDate.push(recentMonth.now);
    this.setData({
      // defaultDate: recentMonth.last + "~" + recentMonth.now,
      defaultDate: '',
      // selectedDate: selectedDate,
    })
  },
  onRangePick(event) {
    var selectedDate = event.detail;
    this.setData({
      selectedDate: selectedDate,
      defaultDate: selectedDate[0] + "~" + selectedDate[1],
    })

  },
  // 点击选择日历按钮
  tapDateButton: function (e) {
    //根据data 设置的button 顺序 ，默认左取消右确定
    let index = e.detail.index;
    if (index == 0) {
      //点击取消
      this.setData({
        showCalendar: false,
      });
      return
    }
    let date = this.data.selectedDate;
    //关闭日历弹窗
    this.setData({
      showCalendar: false,
      defaultDate: date[0] + "~" + date[1],

    });
    if (index == 1) {
      this.getCurrentTabItem().then(item => {
        let nomore = item.nomore;
        this.setData({
          [nomore]: false
        })
        item.param.next = 1;
        item.param.start_time = date[0];
        item.param.end_time = date[1];
        this.updateCurrentParam(item.param);
        this.getCurrentApi(item, this.dataRefresh)
      })


    }
  },
  changeTab: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: index
    })
    this.initCountData();
    this.getCurrentTabItem().then(item => {
      let _list = this.data[item.list];
      if (!_list.length) {
        item.param = JSON.parse(JSON.stringify(item.reset_param));
        this.getCurrentApi(item, this.dataRefresh)
      }
    })
  },
  excTabChange(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      exc_active_tab: index
    })
    this.initCountData();
    this.getCurrentTabItem().then(item => {
      let _list = this.data[item.list];
      if (!_list.length) {
        item.param = JSON.parse(JSON.stringify(item.reset_param));
        this.getCurrentApi(item, this.dataRefresh)
      }
    })

  },
  /**
   * 兑换券统计：
   * open:已拆 -->我的兑换券
   * unopen:未拆 -->兑换奖励 开红包
   * unused:未核销-->待受理/待核销
   * used:已核销
   * uncard 已拆未核销
   */
  getcountcard: function () {
    return http.post('/api/card/getcountcard', false, false).then(res => {
      if (res.code == 1) {
        let {
          data
        } = res;
        data.exc_all_unused = data.act1_unused + data.exc_zm_unused;
        data.exc_hn_unused_format = utils.formatAmount(data.exc_hn_unused) || 0;
        data.exc_zm_unused_format = utils.formatAmount(data.exc_zm_unused) || 0;
        this.setData({
          countcardInfo: data
        });
        // 重置统计数据
        this.initCountData();
      }
      if (res.code == 0) {
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false
        })
      }
    })
  },
  //下拉刷新数据处理：dataRefresh
  dataRefresh: function (api_data, tab_item) {

    //数据进来先关正在加载
    requesting = false;
    //覆盖数据
    let {
      activeTab,
      exc_active_tab,
      hnTitle,
      zmTitle,
      hnTitleBlue
    } = that.data;
    let {
      list: _list,
      nomore: _nomore,
      param: _param
    } = tab_item;
    let list_total = `${_list}_total`;
    //存在数据就合并
    let {
      data: _data
    } = api_data;
    if (_data.list) {
      let {
        limit,
        next,
        pop,
        total
      } = _data;
      _param.next = next ? next : 1;
      let nomore = _data.list.length < limit ? true : false;
      that.updateCurrentParam(_param);
      let data_list = _data.list;
      // 判断标题
      data_list.forEach(item => {
        item.couponTitle = hnTitle;
        if (item.prizeratetype == 105) {
          item.couponTitle = zmTitle
        }
        if (item.prizeratetype == 112) {
          item.couponTitle = hnTitleBlue
        }
      })
      that.setData({
        [_list]: data_list,
        [_nomore]: nomore,
        exc_filter_total: total,
        [list_total]: total
      });
      // 换购券-红牛数据需要处理
      if (activeTab == 0 && exc_active_tab == 1) {
        //code=1 时候 pop 有值就是要弹框,null不用，注意每次翻页都会返回，弹一次就行
        console.log("pop:", pop)
        if (pop != null) {
          this.checkVoucherExpire()
        }
      }

    } else {
      that.setData({
        [_list]: [],
        [_nomore]: true,
        exc_filter_total: 0,
        [list_total]: 0
      });
    }
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
  },
  //页面初始化/上拉加载更多  处理数据
  dataProcess: function (api_data, tab_item) {
    requesting = false;
    let {
      activeTab,
      exc_active_tab,
      zmTitle,
      hnTitle,
      hnTitleBlue
    } = that.data;
    //存在数据就合并
    let {
      data: _data
    } = api_data;
    let {
      nomore,
      list,
      param
    } = tab_item;
    let list_total = `${list}_total`;
    if (_data.list) {
      // 判断标题
      _data.list.forEach(item => {
        item.couponTitle = hnTitle;
        if (item.prizeratetype == 105) {
          item.couponTitle = zmTitle
        }
        if (item.prizeratetype == 112) {
          item.couponTitle = hnTitleBlue
        }
      })
      if (activeTab == 0 && exc_active_tab == 1) {
        //判断列表第一条数据的类型是否属于25周年的1元轻松享兑换券
        let pop = _data.pop;
        console.log("pop:", pop)
        if (pop != null) {
          this.checkVoucherExpire()
        }
      }
      param.next = _data.next ? _data.next : 1;
      that.updateCurrentParam(param);
      let old_list = that.data[list];
      that.setData({
        [list]: old_list.concat(_data.list),
        [list_total]: _data.total,
        exc_filter_total: _data.total
      });
    }
    if (api_data.code == 0 || _data.list.length < _data.limit) {
      console.log("nomore:", nomore)
      that.setData({
        [nomore]: true
      });
    }

  },
  checkAddress: function () {

    let {
      activeTab,
      exc_active_tab,
      hn_unused,
      countcardInfo
    } = this.data;
    var shop_info = {};
    let params = {}; //页面传参
    //获取用户店铺信息
    utils.getShopInfo().then(data => {
      var shopInfo = data;
      if (!shopInfo.l_longitude && !shopInfo.l_latitude) {
        wx.showModal({
          title: '温馨提示',
          content: "请完善店铺信息",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/zhongduan/geren/mendian/renzhen/index?hide=false',
              })
            }
          }
        })
      }
      for (var i = 0; i < shopInfo.member.length; i++) {
        if (shopInfo.member[i]['condition'] == 1) {
          shop_info.phone = shopInfo.member[i]['mobile'];
        }
      }
      shop_info.address = utils.storeAddress(shopInfo);
      shop_info.name = shopInfo.shop_name;
      params.type = 1; //1红牛券，3惠让，4活动券
      if (activeTab == 1 || activeTab == 2) {
        params.type = activeTab == 1 ? 3 : 4;
        let _title = activeTab == 1 ? "惠让券" : "活动券"
        if (!num && !type_id) {
          // wx.showModal({
          //   title: '温馨提示',
          //   content: "请选择" + _title,
          //   showCancel: false
          // })
          wx.showToast({
            title: '请选择需要使用的' + _title,
            icon: "none",
            duration: 2000
          })
          return
        }
        params.num = num;
        params.type_id = type_id;
        params.prizeratetype = _prizeratetype;

        // url = '/pages/phaseIII/exchange/index?type=' + type + '&num=' + num + '&type_id=' + type_id + '&prizeratetype=' + _prizeratetype;
      }

      params.exc_type = exc_active_tab;
      if (activeTab == 0) {
        let exc_zm_unused = countcardInfo.exc_zm_unused;
        num = exc_active_tab == 1 ? hn_unused : exc_zm_unused;
        params.type = exc_active_tab
        params.num = num;
      }
      // 活动券：根据选中的券类型判断红牛战马
      if (activeTab == 2) {
        params.exc_type = _prizeratetype == 105 ? 2 : 1;
      }
      let url = '/pages/phaseIII/exchange/index?params=' + encodeURIComponent(JSON.stringify(params));
      wx.redirectTo({
        url: url,
      })
      that.setData({
        // checkAddressPop: true,
        shopInfo: shop_info,
      });

    }).catch(err => {
      if (err && err.code == 0) {
        wx.showModal({
          title: '温馨提示',
          content: "填写店铺信息后可使用兑换券",
          confirmText: "前往填写",
          cancelText: "放弃",
          success: (_res) => {
            if (_res.confirm) {
              wx.redirectTo({
                url: '/pages/zhongduan/geren/mendian/renzhen/index',
              })
            } else {
              wx.navigateBack();
              // wx.switchTab({
              //   url: '/pages/tabBar/shouye/index',
              // })
            }
          }
        })
      }
    });

  },

  //点击弹窗按钮
  tapButton: function (e) {
    let index = e.detail.index ? e.detail.index : e.currentTarget.dataset.index;
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    //  0：确定，跳转经销商页面:'/pages/phaseIII/distributor/index'  1：更改地址   跳转  店铺资料页：'/pages/zhongduan/geren/mendian/renzhen/index?hide'hide:刷新
    let url = '';
    if (index == 0) {

      // url = '/pages/phaseIII/distributor/index';
      url = '/pages/phaseIII/exchange/index';
      wx.redirectTo({
        url: url,
      })
    }
    if (index == 1) {
      url = '/pages/zhongduan/geren/mendian/renzhen/index?hide=1';
      wx.navigateTo({
        url: url,
      })
    }
    this.setData({
      checkAddressPop: false
    })


  },
  // 预览活动公告
  openActivity: function () {
    if (!cosAddress) {
      wx.showToast({
        title: '未获取到数据，请重新打开小程序',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let img_url = cosAddress.A4.value[0].img;
    // img_url = img_url =='https://file.y1b.cn/public/img/2021/yl.jpg?v=1' ? "https://file.y1b.cn/public/img/bfyl/202202/img_prize_notice.png":img_url;
    let urls = new Array();
    urls.push(img_url);
    wx.previewImage({
      current: img_url, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
    return;

  },
  //使用记录
  useHistory() {
    wx.navigateTo({
      url: '/pages/phaseIII/voucher/history',
    })
  },
  close() {
    this.setData({
      voucherExpPop: false
    })
  },
  // 点击查看核销通知详情
  jumpToWebview() {
    let link = this.data.hxnotice_link + '?num=' + Math.random(100);
    link = encodeURIComponent(link);
    wx.navigateTo({
      url: './webview?link=' + link,
      success() {
        that.setData({
          voucherExpPop: false
        })
      }
    })
  },
  //活动券，惠让券单选
  tapRadio(e) {
    let index = e.currentTarget.dataset.index;
    let changeItem = '';
    let {
      activeTab,
      hr_list,
      act_list
    } = this.data;
    let list = null;
    if (activeTab == 1) {
      list = hr_list;
      changeItem = 'hr_list[' + index + '].checked';
    }
    if (activeTab == 2) {
      list = act_list;
      changeItem = 'act_list[' + index + '].checked';
    }
    let item = list[index];
    if (item) {
      //重复点击同一个
      let item_id = activeTab == 1 ? item.pid : item.id;
      if (num == item.num && type_id == item_id) {
        num = '';
        type_id = '';
        _prizeratetype = '';
        this.setData({
          [changeItem]: false,
          choosedType: ''
        })
        return
      } else {
        num = item.num;
        type_id = item_id;
        _prizeratetype = item.prizeratetype;
        this.setData({
          [changeItem]: true,
          choosedType: item.prizeratetype
        })
      }

      console.log("num:", num, "\n type_id:", type_id, "\n _prizeratetype:", _prizeratetype);
    }

  },
  // 换购券-战马，红牛活动规则
  showExcRule() {
    let {
      exc_active_tab,
      exc_hn_rule,
      exc_zm_rule
    } = this.data;
    let url = exc_active_tab == 1 ? exc_hn_rule : exc_zm_rule;
    wx.previewImage({
      urls: [url],
    })
  },
  showExcCountPop() {
    this.setData({
      exc_count_pop: true
    })
  },
  // 每次切换不同的tab ，重置统计数据
  initCountData() {
    let {
      act1_unused,
      act1_unused_expire,
      act1_used,
      act3_unused,
      act3_used,
      act4_unused,
      act4_unused_expire,
      act4_used,
      exc_zm_hgq,
      exc_zm_jl,
      exc_hn_hgq,
      exc_hn_jl,
      exc_hn_dhq,
    } = this.data.countcardInfo;
    let {
      activeTab,
      exc_active_tab
    } = this.data;
    // 换购券-红牛、战马
    let hn_total = 0,
      hn_expire = 0,
      hn_used = 0,
      hn_unused = 0;

    if (activeTab == 0) {
      hn_total = exc_hn_hgq.unused + exc_hn_jl.unused;
      hn_expire = act1_unused_expire;
      hn_used = exc_hn_hgq.used + exc_hn_jl.used;
      let zm_exc_total = {};
      let hn_exc_total = {};
      let product_exc = {};
      let exc_total, exc_hgq, exc_jl;
      zm_exc_total.unused = exc_zm_hgq.unused + exc_zm_jl.unused;
      zm_exc_total.used = exc_zm_hgq.used + exc_zm_jl.used;
      zm_exc_total.expire = exc_zm_hgq.unused_expire + exc_zm_jl.unused_expire;
      zm_exc_total.total = exc_zm_hgq.unused_expire + exc_zm_jl.unused_expire + exc_zm_hgq.used + exc_zm_jl.used + exc_zm_hgq.unused + exc_zm_jl.unused;

      zm_exc_total.unused_format = utils.formatAmount(zm_exc_total.unused) || 0;
      zm_exc_total.used_format = utils.formatAmount(zm_exc_total.used) || 0;
      zm_exc_total.expire_format = utils.formatAmount(zm_exc_total.expire) || 0;
      zm_exc_total.total_format = utils.formatAmount(zm_exc_total.total) || 0;

      exc_zm_hgq.total = exc_zm_hgq.unused_expire + exc_zm_hgq.unused + exc_zm_hgq.used;
      exc_zm_jl.total = exc_zm_jl.unused_expire + exc_zm_jl.unused + exc_zm_jl.used;
      exc_zm_jl.unused_format = utils.formatAmount(exc_zm_jl.unused) || 0;
      exc_zm_jl.used_format = utils.formatAmount(exc_zm_jl.used) || 0;
      exc_zm_jl.unused_expire_format = utils.formatAmount(exc_zm_jl.unused_expire) || 0;
      exc_zm_jl.total_format = utils.formatAmount(exc_zm_jl.total )|| 0;
     

      hn_exc_total.unused = exc_hn_hgq.unused + exc_hn_jl.unused + exc_hn_dhq.unused;
      hn_exc_total.used = exc_hn_hgq.used + exc_hn_jl.used + exc_hn_dhq.used;
      hn_exc_total.expire = exc_hn_hgq.unused_expire + exc_hn_jl.unused_expire + exc_hn_dhq.unused_expire;
      hn_exc_total.total = exc_hn_hgq.unused_expire + exc_hn_jl.unused_expire + exc_hn_hgq.used + exc_hn_jl.used + exc_hn_hgq.unused + exc_hn_jl.unused + exc_hn_dhq.unused_expire + exc_hn_dhq.unused + exc_hn_dhq.used;
      hn_exc_total.unused_format = utils.formatAmount(hn_exc_total.unused)||0;
      hn_exc_total.used_format = utils.formatAmount(hn_exc_total.used)||0;
      hn_exc_total.expire_format = utils.formatAmount(hn_exc_total.expire)||0;
      hn_exc_total.total_format = utils.formatAmount(hn_exc_total.total)||0;


      exc_hn_hgq.total = exc_hn_hgq.unused_expire + exc_hn_hgq.unused + exc_hn_hgq.used;
      exc_hn_jl.total = exc_hn_jl.unused_expire + exc_hn_jl.unused + exc_hn_jl.used;
      exc_hn_jl.unused_format = utils.formatAmount(exc_hn_jl.unused )|| 0;
      exc_hn_jl.used_format = utils.formatAmount(exc_hn_jl.used) || 0;
      exc_hn_jl.unused_expire_format = utils.formatAmount(exc_hn_jl.unused_expire) || 0;
      exc_hn_jl.total_format = utils.formatAmount(exc_hn_jl.total) || 0;
      exc_total = exc_active_tab == 1 ? hn_exc_total : zm_exc_total;
      exc_hn_hgq.unused_format = utils.formatAmount(exc_hn_hgq.unused )|| 0;
      exc_hn_hgq.used_format = utils.formatAmount(exc_hn_hgq.used )|| 0;
      exc_hn_hgq.unused_expire_format = utils.formatAmount(exc_hn_hgq.unused_expire )|| 0;
      exc_hn_hgq.total_format = utils.formatAmount(exc_hn_hgq.total )|| 0;


      exc_zm_hgq.unused_format = utils.formatAmount(exc_zm_hgq.unused )|| 0;
      exc_zm_hgq.used_format = utils.formatAmount(exc_zm_hgq.used )|| 0;
      exc_zm_hgq.unused_expire_format = utils.formatAmount(exc_zm_hgq.unused_expire )|| 0;
      exc_zm_hgq.total_format = utils.formatAmount(exc_zm_hgq.total) || 0;

      exc_hn_jl.unused_format = utils.formatAmount(exc_hn_jl.unused )|| 0;
      exc_zm_jl.unused_format = utils.formatAmount(exc_zm_jl.unused )|| 0;

      exc_hgq = exc_active_tab == 1 ? exc_hn_hgq : exc_zm_hgq;
      exc_jl = exc_active_tab == 1 ? exc_hn_jl : exc_zm_jl;
      product_exc.unused_format = utils.formatAmount(exc_hn_dhq.unused )|| 0;
      product_exc.used_format = utils.formatAmount(exc_hn_dhq.used ) || 0;
      product_exc.unused_expire_format = utils.formatAmount(exc_hn_dhq.unused_expire) || 0;
      product_exc.total = exc_hn_dhq.unused + exc_hn_dhq.used + exc_hn_dhq.unused_expire;
      product_exc.total_format = utils.formatAmount(product_exc.total )|| 0;

      this.setData({
        hn_total,
        hn_expire,
        hn_used,
        hn_unused,
        exc_total,
        exc_hgq,
        exc_jl,
        product_exc,
        hn_unused_format: utils.formatAmount(hn_unused)||0,
        hn_total_format: utils.formatAmount(hn_total)||0,
        hn_expire_format: utils.formatAmount(hn_expire)||0,
        hn_used_format: utils.formatAmount(hn_used)||0,
      })
      return
    }
    // 惠让券
    if (activeTab == 1) {
      hn_total = act3_used + act3_unused;
      hn_expire = -1;
      hn_used = act3_used;
      hn_unused = act3_unused;

      this.setData({
        hn_total,
        hn_expire,
        hn_used,
        hn_unused,
        hn_unused_format: utils.formatAmount(hn_unused)||0,
        hn_total_format: utils.formatAmount(hn_total)||0,
        hn_expire_format: utils.formatAmount(hn_expire)||0,
        hn_used_format: utils.formatAmount(hn_used)||0,
      })
      return
    }
    // 活动券
    if (activeTab == 2) {
      hn_total = act4_used + act4_unused + act4_unused_expire;
      hn_expire = act4_unused_expire;
      hn_used = act4_used;
      hn_unused = act4_unused;
      this.setData({
        hn_total,
        hn_expire,
        hn_used,
        hn_unused,
        hn_unused_format: utils.formatAmount(hn_unused)||0,
        hn_total_format: utils.formatAmount(hn_total)||0,
        hn_expire_format: utils.formatAmount(hn_expire)||0,
        hn_used_format: utils.formatAmount(hn_used) || 0,
      })
      return
    }
  },
  // 关闭弹窗
  onClose() {
    this.setData({
      exc_count_pop: false
    })
  },
  // 获取当前tab的 接口变量参数
  getCurrentTabItem() {
    return new Promise((resolve) => {
      let {
        activeTab,
        exc_active_tab
      } = this.data;
      let item = voucher_tab_map[activeTab][exc_active_tab];
      // 二级tab
      if (item) {
        return resolve(item)
      }
      // 一级tab
      item = voucher_tab_map[activeTab];
      if (item) {
        return resolve(item)
      }
    })
  },
  updateCurrentParam(new_param) {
    let {
      activeTab,
      exc_active_tab
    } = this.data;
    let item = voucher_tab_map[activeTab][exc_active_tab];
    // 二级tab
    if (item) {
      voucher_tab_map[activeTab][exc_active_tab]['param'] = new_param;
      return
    }
    // 一级tab
    item = voucher_tab_map[activeTab];
    if (item) {
      voucher_tab_map[activeTab]['param'] = new_param;
      return
    }
  },
  getCurrentApi(tab_item, callback) {
    console.log("getCurrentApi:", tab_item);
    if (requesting) return;
    requesting = true;
    http.post(tab_item.api, tab_item.param).then(res => {
      return callback(res, tab_item)
    }).catch(err => {
      requesting = false;
    })
  },
  // 检查核销截止通知弹窗
  checkVoucherExpire() {
    // 当前的时间大于截止日期：跳过
    if (!_voucherExpPop && voucher_expire_time) {
      log.addFilterMsg("prizeratetype25");
      that.setData({
        voucherExpPop: true
      })
      _voucherExpPop = true;
    }
  },
  // 时分秒选择范围
  timeRangeSelect(event) {
    console.log("event:", event)
    const {
      sTime,
      eTime
    } = event.detail;
    const selectedDate = [sTime, eTime];
    this.setData({
      selectedDate: selectedDate,
      defaultDate: selectedDate[0] + "~" + selectedDate[1],
    })

    this.getCurrentTabItem().then(item => {
      let nomore = item.nomore;
      this.setData({
        [nomore]: false
      })
      item.param.next = 1;
      item.param.start_time = sTime;
      item.param.end_time = eTime;
      this.updateCurrentParam(item.param);
      this.getCurrentApi(item, this.dataRefresh)
    })

  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }

})