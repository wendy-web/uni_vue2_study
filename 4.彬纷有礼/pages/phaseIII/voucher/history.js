// pages/phaseIII/voucher/history.js
let app = getApp();
let COS_URL = app.globalData.COS_URL;
const http = require('../../../utils/api');
const utils = require('../../../utils/util');
let reachBottom = '';
let requesting = false;
let next_hr = 1;
let next_act = 1;
let next_exp = 1; //换购券已过期
let next_act_expire = 1; //活动券已过期

let param = {}; //换购券参数
let exc_zm_used_param = {}; //战马换购券已使用参数
exc_zm_used_param.status = 5;
exc_zm_used_param.type = 2;
exc_zm_used_param.next = 1;
let exc_zm_expire_param = {}; //战马换购券已过期参数
exc_zm_expire_param.check_status = 0;
exc_zm_expire_param.exp_status = 1;
exc_zm_expire_param.next = 1;
exc_zm_expire_param.type = 2;
let hrparam = {}; //惠让券参数
let actparam = {}; //活动券参数
let log = require('../../../utils/log');
// 换购券红牛-已过期日期筛选
let exc_hn_expire_date = {};
// 定义周年卡券水印戳 null 25周年，其他直接根据类型取
import {
  voucher_title_map as titleMap,
  hn_used_voucher_stamp as stampMap,
  voucher_bg_map as itemBGMap
} from './utils'
import {
  getexclog
} from '../../../api/exchange/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 0, //默认选中0可用券
    list: [], //可用券列
    countcardInfo: '', //所有卡券统计信息
    hrList: [], //惠让券列表
    actList: [], //活动券列表
    expiredList: [], //活动券过期列表
    icon_arrow_up: COS_URL + '/public/img/phaseIII/20210828/icon_arrow_up.png', //tabbar底部箭头
    ydh: COS_URL + '/public/img/phaseIII/20210828/ydh.png', //已兑换icon
    icon_overdue: COS_URL + '/public/img/phaseIII/20210828/icon_overdue.png', //已过期icon
    ydhBG: COS_URL + '/public/img/phaseIII/202104/ydhBG0407.png', //已兑换背景
    icon_hr: 'data:image/png;base64,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', //惠让已使用icon
    actListTab: 0, //活动券已用，已过期
    hnTitle: app.globalData.hnTitle,
    hnTitleBlue: app.globalData.hnTitleBlue,
    zmTitle: app.globalData.zmTitle,
    listTab: 0, //换购券已使用
    dh_expireList: [], //换购券已过期列表
    stamp_25: COS_URL + '/public/img/phaseIII/20211020/stamp_25.png',
    stamp_26: COS_URL + '/public/img/phaseIII/202103/stamp_26.png',
    icon_stamp_25: COS_URL + '/public/img/phaseIII/20211020/icon_stamp_25.png',
    icon_stamp_zm: COS_URL + '/public/img/bfyl/202204/icon_stamp_zm.png',
    icon_stamp_hn_27: COS_URL + '/public/img/bfyl/202204/icon_stamp_hn_27.png',
    stampMap: stampMap,
    titleMap: titleMap,
    itemBGMap: itemBGMap,
    // 2023年1月10日  战马新增换购券
    exc_active_tab: 1, //换购券下的tab；1红牛，2战马 默认2
    count_expire: 0, //已过期
    count_used: 0, //已使用
    exc_count: 0, //换购券累计
    exc_award: 0, //换购券奖励
    exc_zm_used_list: [], //战马换购券，已使用列表
    exc_zm_expire_list: [], //战马换购券，已过期列表
    icon_zm_exc_used: COS_URL + '/public/img/bfyl/202301/icon_zm_exc_used.png',
    bg_zm_exc_used: COS_URL + '/public/img/bfyl/202301/bg_zm_exc_used.png',
    icon_stamp_exc: COS_URL + '/public/img/bfyl/202301/icon_stamp_exc.png',
    icon_arrow_right: COS_URL + '/public/img/bfyl/202301/icon_arrow_right.png',
    icon_date: COS_URL + '/public/img/bfyl/202301/icon_date_2.png',
    defaultDate: '', //默认日期最近一个月
    showCalendar: false, //日历弹窗：默认隐藏
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }], //日历弹窗按钮
    exc_zm_used_nomore: false,
    exc_zm_expire_nomore: false,
    cashcoupon_file_url: `${COS_URL}/public/img/bfyl/2023/08/cashCoupon`, // cos 资源地址
    nomore_act_expire: false,
    product_exc_coupon: 0, //2023年8月23日 产品兑换券统计
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getcountcard();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //初始化数据
    // let activeTab = this.data.activeTab;
    // if (activeTab == 0) {
    //   param.next = 1;
    //   param.type = 1;
    //   //获取已使用的换购券
    //   return this.getList(param, this.dataProcess);
    // }
    this.initAllList(true);

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 换购，惠让，活动切换
  changeTab: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: index
    })
    this.initCountData();
    //选中惠让券tab,无数据时，加载数据
    if (index == 1 && this.data.hrList.length == 0) {
      hrparam.type = 3;
      hrparam.next = 1;
      //获取惠让券信息
      this.getList(hrparam, this.dataProcess)
    }
    //选中活动券，无数据时加载数据
    if (index == 2 && this.data.actList.length == 0) {
      //判断活动券是已使用还是已过期
      let actListTab = this.data.actListTab;
      if (actListTab == 0 && this.data.actList.length < 1) {
        actparam.type = 4;
        actparam.next = 1;
        //获取活动券信息
        this.getList(actparam, this.dataProcess);
        return
      }
      if (actListTab == 1 && this.data.expiredList.length < 1) {
        this.getactList({}, this.dataRefresh);
        return
      }
    }
  },
  //换购券：已使用，已过期切换
  listTabChange(e) {
    let index = e.currentTarget.dataset.index;
    console.log("换购券·····");
    this.setData({
      listTab: index
    })
    this.initCountData();
    let {
      listTab,
      exc_active_tab
    } = this.data;

    this.initAllList(true);

    // if (listTab == 0 && this.data.list.length < 1) {
    //   param.type = 1;
    //   param.next = 1;
    //   //获取活动券信息
    //   this.getList(param, this.dataProcess);
    //   return
    // }
    // if (listTab == 1 && this.data.dh_expireList.length < 1) {
    //   next_exp = 1;
    //   this.getListUsed(this.dataRefresh);
    //   return
    // }
  },
  //活动券：已使用，已过期切换
  actListTabChange(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      actListTab: index
    })
    this.initCountData();
    let actListTab = this.data.actListTab;
    if (actListTab == 0 && this.data.actList.length < 1) {
      actparam.type = 4;
      actparam.next = 1;
      //获取活动券信息
      this.getList(actparam, this.dataProcess);
      return
    }
    if (actListTab == 1 && this.data.expiredList.length < 1) {
      this.getactList({}, this.dataRefresh);
      return
    }
  },
  /**
   * 换购券统计：
   */
  getcountcard: function () {
    return http.post('/api/card/getcountcard', false, false).then(res => {
      console.log("getcountcard 请求返回：", res);
      if (res.code == 1) {
        this.setData({
          countcardInfo: res.data
        });
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
  /**
   *获取换购券、惠让券、活动券已使用列表 /api/card/getpacklog
   * @param {
   * status:5 已使用
   * type:1红牛，3惠让，4活动券
   * } param 
   * @param {*} callback 
   */
  getList(param, callback) {
    if (requesting) return
    requesting = true;
    console.log(" param.status = 5; //已使用:", param)
    param.status = 5; //已使用
    console.log("getlist 传参：", param);
    http.post('/api/card/getpacklog', param).then(res => {
      console.log("getlist 已使用 返回：", res);
      return callback(res);
    })

  },
  /**
   *获取换购券已使用列表 /api/card/getcardlog
   * @param {
   * open:3 全部
   * check_status:0 默认未核销
   * exp_status：1,已过期
   * } param 
   * @param {*} callback 
   */
  getListUsed(callback) {
    if (requesting) return
    requesting = true;
    let _param = {};
    _param.open = 3;
    _param.check_status = 0;
    _param.type = 0;
    _param.exp_status = 1;
    _param.next = next_exp;
    let {
      start_time,
      end_time
    } = exc_hn_expire_date;
    _param.start_time = start_time;
    _param.end_time = end_time;
    console.log("getListUsed 传参：", _param);
    http.post('/api/card/getcardlog', _param).then(res => {
      console.log("getListUsed 已过期 返回：", res);
      return callback(res);
    })

  },
  /**
   * 可用活动券：/api/card/act4List
   * status:2 已过期
   */
  getactList(param = {}, callback) {
    if (requesting) return
    requesting = true;
    param.status = 2; //已过期
    console.log("getactList 传参：", param);
    http.post('/api/card/act4List', param).then(res => {
      wx.stopPullDownRefresh();
      console.log("getactList 获取活动券 返回：", res);
      return callback(res);
    })
  },
  //下拉刷新数据处理：dataRefresh
  dataRefresh: function (data) {
    //数据进来先关正在加载
    requesting = false;
    //覆盖数据
    let activeTab = this.data.activeTab;
    wx.stopPullDownRefresh();
    //换购券
    if (activeTab == 0) {
      //判断当前选中是已使用||已过期
      let {
        listTab,
        exc_active_tab
      } = this.data;
      console.log(listTab == 0 ? "换购券已使用" : "换购券已过期")
      if (exc_active_tab == 1) {

        if (listTab == 0) {
          //存在数据就合并
          if (data.data.list) {
            param.next = data.data.next ? data.data.next : 1;
            this.setData({
              list: data.data.list,
            });
          } else {
            this.setData({
              list: [],
              noMore: true
            });
            param.next = 1;
          }
          return
        }
        if (listTab == 1) {
          //存在数据就合并
          if (data.data.list) {
            this.setData({
              dh_expireList: data.data.list,
            });
            next_exp = data.data.next ? data.data.next : 1;
            if (data.code == 0 || data.data.list.length < data.data.limit) {
              console.log("换购券已过期 没有更多数据了");
              this.setData({
                dh_exp_noMore: true
              });
            }
          } else {
            this.setData({
              dh_expireList: [],
              dh_exp_noMore: true
            });
            next_exp = 1;
          }
          return
        }
        return
      }
      if (exc_active_tab == 2) {
        // 战马：已使用
        if (listTab == 0) {
          //存在数据就合并
          if (data.data.list) {
            exc_zm_used_param.next = data.data.next ? data.data.next : 1;
            this.setData({
              exc_zm_used_list: data.data.list,
            });
            if (data.code == 0 || data.data.list.length < data.data.limit) {
              console.log("战马换购券已过期 没有更多数据了");
              this.setData({
                exc_zm_used_nomore: true
              });
            }
          } else {
            this.setData({
              exc_zm_used_list: [],
              exc_zm_used_nomore: true
            });
            exc_zm_used_param.next = 1;
          }
          return
        }
        // 战马：已过期
        if (listTab == 1) {
          //存在数据就合并
          if (data.data.list) {
            this.setData({
              exc_zm_expire_list: data.data.list,
            });
            exc_zm_expire_param.next = data.data.next ? data.data.next : 1;
            if (data.code == 0 || data.data.list.length < data.data.limit) {
              console.log("战马换购券已过期 没有更多数据了");
              this.setData({
                exc_zm_expire_nomore: true
              });
            }
          } else {
            this.setData({
              exc_zm_expire_list: [],
            });
            exc_zm_expire_param.next = 1;
          }
          return
        }
      }

    }
    // 惠让券
    if (activeTab == 1) {
      //存在数据就合并
      if (data.data.list) {
        next_hr = data.data.next ? data.data.next : 1;
        this.setData({
          hrList: data.data.list,
        });
      } else {
        this.setData({
          hrList: [],
          noMore_hr: true
        });
        next_hr = 1;
      }
      return
    }
    //活动券
    if (activeTab == 2) {
      //判断当前选中是已使用||已过期
      let {
        hnTitle,
        zmTitle,
        hnTitleBlue,
        actListTab
      } = this.data;
      console.log(actListTab == 0 ? "活动券已使用" : "活动券已过期")
      if (actListTab == 0) {
        //存在数据就合并
        if (data.data.list) {
          // 判断标题
          data.data.list.forEach(item => {
            item.couponTitle = hnTitle;
            if (item.prizeratetype == 105) {
              item.couponTitle = zmTitle
            }
            if (item.prizeratetype == 112) {
              item.couponTitle = hnTitleBlue
            }
          })
          next_act = data.data.next ? data.data.next : 1;
          this.setData({
            actList: data.data.list,
          });
        } else {
          this.setData({
            actList: [],
            noMore_act: true
          });
          next_act = 1;
        }
        return
      }
      if (actListTab == 1) {
        //存在数据就合并
        if (data.data.list) {
          // 判断标题
          data.data.list.forEach(item => {
            item.couponTitle = hnTitle;
            if (item.prizeratetype == 105) {
              item.couponTitle = zmTitle
            }
            if (item.prizeratetype == 112) {
              item.couponTitle = hnTitleBlue
            }
          })
          next_act_expire = data.data.next ? data.data.next : 1;
          this.setData({
            expiredList: data.data.list,
          });
        } else {
          next_act_expire = 1;
          this.setData({
            expiredList: [],
          });
        }
        return
      }

    }


  },
  //页面初始化/上拉加载更多  处理数据
  dataProcess: function (data) {
    requesting = false;
    reachBottom = false;
    console.log("dataProcess:", data);
    let activeTab = this.data.activeTab;
    //判断activeTab:0 可用，1已用
    if (activeTab == 0) {
      let {
        listTab,
        exc_active_tab
      } = this.data;
      // 红牛：换购券
      if (exc_active_tab == 1) {

        //判断是已使用、已过期换购券
        if (listTab == 0) {

          //存在数据就合并
          if (data.data.list) {
            param.next = data.data.next ? data.data.next : 1;
            this.setData({
              list: this.data.list.concat(data.data.list),
            });
          }
          if (data.code == 0 || data.data.list.length < data.data.limit) {
            console.log("换购券已使用 没有更多数据了");
            this.setData({
              noMore: true
            });
          }
          return
        }
        if (listTab == 1) {
          //存在数据就合并
          if (data.data.list) {
            log.addFilterMsg('dh_expireList');
            next_exp = data.data.next ? data.data.next : 1;
            this.setData({
              dh_expireList: this.data.dh_expireList.concat(data.data.list),
            });
          }
          if (data.code == 0 || data.data.list.length < data.data.limit) {
            console.log("换购券已过期 没有更多数据了");
            this.setData({
              dh_exp_noMore: true
            });
          }
          return
        }
        return
      }
      // 战马：换购券
      if (exc_active_tab == 2) {
        //已使用、已过期
        if (listTab == 0) {

          //存在数据就合并
          if (data.data.list) {
            exc_zm_used_param.next = data.data.next ? data.data.next : 1;
            this.setData({
              exc_zm_used_list: this.data.exc_zm_used_list.concat(data.data.list),
            });
          }
          if (data.code == 0 || data.data.list.length < data.data.limit) {
            console.log("换购券已使用 没有更多数据了");
            this.setData({
              exc_zm_used_nomore: true
            });
          }
          return
        }
        if (listTab == 1) {
          //存在数据就合并
          if (data.data.list) {
            log.addFilterMsg('dh_expireList');
            exc_zm_expire_param.next = data.data.next ? data.data.next : 1;
            this.setData({
              exc_zm_expire_list: this.data.exc_zm_expire_list.concat(data.data.list),
            });
          }
          if (data.code == 0 || data.data.list.length < data.data.limit) {
            console.log("换购券已过期 没有更多数据了");
            this.setData({
              exc_zm_expire_nomore: true
            });
          }
          return
        }
        return
      }

    }
    // 惠让列表
    if (activeTab == 1) {
      //存在数据就合并
      if (data.data.list) {
        next_hr = data.data.next ? data.data.next : 1;
        this.setData({
          hrList: this.data.hrList.concat(data.data.list),
        });
      }
      if (data.code == 0 || data.data.list.length < data.data.limit) {
        console.log("惠让券 没有更多数据了");
        this.setData({
          noMore_hr: true
        });
      }
      return
    }
    // 活动券列表
    if (activeTab == 2) {
      let {
        actListTab,
        hnTitle,
        hnTitleBlue,
        zmTitle
      } = this.data;

      //判断是已使用、已过期活动券
      if (actListTab == 0) {

        //存在数据就合并
        if (data.data.list) {
          // 判断标题
          data.data.list.forEach(item => {
            item.couponTitle = hnTitle;
            if (item.prizeratetype == 105) {
              item.couponTitle = zmTitle
            }
            if (item.prizeratetype == 112) {
              item.couponTitle = hnTitleBlue
            }
          })
          next_act = data.data.next ? data.data.next : 1;
          this.setData({
            actList: this.data.actList.concat(data.data.list),
          });
        }
        if (data.code == 0 || data.data.list.length < data.data.limit) {
          this.setData({
            noMore_act: true
          });
        }
        return
      }
      if (actListTab == 1) {
        //存在数据就合并

        if (data.data.list) {
          // 判断标题
          data.data.list.forEach(item => {
            item.couponTitle = hnTitle;
            if (item.prizeratetype == 105) {
              item.couponTitle = zmTitle
            }
            if (item.prizeratetype == 112) {
              item.couponTitle = hnTitleBlue
            }
          })
          next_act_expire = data.data.next ? data.data.next : 1;
          this.setData({
            expiredList: this.data.expiredList.concat(data.data.list),
          });
        }
        if (data.code == 0 || data.data.list.length < data.data.limit) {
          this.setData({
            nomore_act_expire: true
          });
        }
        return
      }
    }

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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let activeTab = this.data.activeTab;
    this.initDate();
    this.getcountcard();
    //换购券
    // if (activeTab == 0) {
    //   let listTab = this.data.listTab;
    //   //判断当前换购券是已使用还是 已过期
    //   if (listTab == 0) {
    //     this.setData({
    //       noMore: false
    //     })
    //     param.type = 1;
    //     param.next = 1;
    //     this.getList(param, this.dataRefresh);
    //     return
    //   } else {
    //     this.getListUsed(this.dataRefresh);
    //     return
    //   }

    // }
    //惠让券
    if (activeTab == 1) {
      this.setData({
        noMore_hr: false
      })
      hrparam.next = 1;
      hrparam.type = 3;
      this.getList(hrparam, this.dataRefresh);
    }
    //活动券
    // if (activeTab == 2) {
    //   let actListTab = this.data.actListTab;
    //   //判断当前活动券是已使用还是 已过期
    //   if (actListTab == 0) {
    //     this.setData({
    //       noMore_act: false
    //     })
    //     actparam.type = 4;
    //     actparam.next = 1;
    //     this.getList(actparam, this.dataRefresh);
    //     return
    //   } else {
    //     this.getactList({}, this.dataRefresh);
    //     return
    //   }
    // }
    this.initAllList(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let activeTab = this.data.activeTab;
    //换购券
    // if (activeTab == 0) {
    //   let listTab = this.data.listTab;
    //   //判断当前换购券是已使用还是 已过期
    //   if (listTab == 0) {
    //     if (this.data.noMore) return;
    //     param.next = next_used;
    //     this.getList(param, this.dataProcess);
    //     return
    //   } else {
    //     if (this.data.dh_exp_noMore) return;
    //     this.getListUsed(this.dataProcess);
    //     return
    //   }

    // }
    // 惠让券
    if (activeTab == 1) {
      if (this.data.noMore_hr) return;
      hrparam.next = next_hr;
      this.getList(hrparam, this.dataProcess);
    }
    // 活动券
    // if (activeTab == 2) {
    //   let actListTab = this.data.actListTab;
    //   //判断当前活动券是已使用还是 已过期
    //   if (actListTab == 0) {
    //     if (this.data.noMore_act) return;
    //     actparam.next = next_act;
    //     this.getList(actparam, this.dataProcess);
    //   }
    // }
    this.initAllList();
  },
  // 换购券红牛、战马切换
  excTabChange(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      exc_active_tab: index
    })
    this.initCountData();
    this.initAllList(true)


  },
  // 点击不同tab时 重置统计数据
  initCountData() {
    let {
      act1_unused_expire,
      act1_used,
      act3_used,
      act4_unused_expire,
      act4_used,
      exc_zm_used,
      exc_zm_unused_expire,
      exc_zm_hgq,
      exc_zm_jl,
      exc_hn_unused_expire,
      exc_hn_used,
      exc_hn_hgq,
      exc_hn_jl,
      exc_hn_dhq // 2023年8月23日 产品兑换券统计
    } = this.data.countcardInfo;
    let {
      activeTab,
      exc_active_tab,
      listTab
    } = this.data;
    let count_expire = 0,
      count_used = 0,
      exc_count = 0,
      exc_award = 0,
      product_exc_coupon = 0;

    // 换购券-战马
    if (activeTab == 0 && exc_active_tab == 2) {
      count_expire = exc_zm_unused_expire;
      count_used = exc_zm_used;
      // listTab:0已使用 1已过期,区分战马-已使用、已过期 的换购券，换购券奖励
      if (listTab == 0) {
        exc_count = exc_zm_hgq.used;
        exc_award = exc_zm_jl.used;
        console.log("已使用：", exc_count, exc_award)
        this.setData({
          exc_count,
          exc_award
        })
      }
      if (listTab == 1) {

        exc_count = exc_zm_hgq.unused_expire;
        exc_award = exc_zm_jl.unused_expire;
        console.log("已过期", exc_count, exc_award)
        this.setData({
          exc_count,
          exc_award
        })
      }
    }
    // 换购券-红牛
    if (activeTab == 0 && exc_active_tab == 1) {

      count_expire = exc_hn_unused_expire;
      count_used = exc_hn_used;
      // listTab:0已使用 1已过期,区分战马-已使用、已过期 的换购券，换购券奖励
      if (listTab == 0) {
        exc_count = exc_hn_hgq.used;
        exc_award = exc_hn_jl.used;
        product_exc_coupon = exc_hn_dhq.used;
        console.log("已使用：", exc_count, exc_award)
        this.setData({
          exc_count: utils.formatAmount(exc_count) || 0,
          exc_award: utils.formatAmount(exc_award) || 0,
          product_exc_coupon: utils.formatAmount(product_exc_coupon) || 0
        })
      }
      if (listTab == 1) {
        exc_count = exc_hn_hgq.unused_expire;
        exc_award = exc_hn_jl.unused_expire;
        product_exc_coupon = exc_hn_dhq.unused_expire;
        console.log("已过期", exc_count, exc_award)
        this.setData({
          exc_count: utils.formatAmount(exc_count) || 0,
          exc_award: utils.formatAmount(exc_award) || 0,
          product_exc_coupon: utils.formatAmount(product_exc_coupon) || 0
        })
      }
    }
    // 惠让券
    if (activeTab == 1) {
      count_expire = -1;
      count_used = act3_used;
    }
    // 活动券
    if (activeTab == 2) {
      count_expire = act4_unused_expire;
      count_used = act4_used
    }
    let count_expire_format = utils.formatAmount(count_expire) || 0;
    let count_used_format = utils.formatAmount(count_used) || 0;
    console.log("count_expire_format:",count_expire_format,count_used_format);
    this.setData({
      count_expire,
      count_used
    })
  },
  // 点击不同tab时候  重置列表数据
  initAllList(refresh = false) {
    let {
      actListTab,
      activeTab,
      exc_active_tab,
      listTab,
      noMore,
      dh_exp_noMore,
    } = this.data;
    // 换购券
    if (activeTab == 0) {
      // 红牛、战马
      if (exc_active_tab == 1) {
        // 已使用、已过期
        if (listTab == 0) {
          param.type = 1;
          param.status = 5;
          if (refresh) {
            param.next = 1;

            this.getList(param, this.dataRefresh);
          } else {
            if (this.data.noMore) return;
            this.getList(param, this.dataProcess);
          }
          return
        }
        if (listTab == 1) {
          if (refresh) {
            next_exp = 1;
            this.getListUsed(this.dataRefresh);
          } else {
            if (this.data.dh_exp_noMore) return;
            this.getListUsed(this.dataProcess);
          }
          return
        }
        return
      }
      if (exc_active_tab == 2) {
        // 已使用、已过期
        if (listTab == 0) {
          exc_zm_used_param.status = 5;
          exc_zm_used_param.type = 2;
          if (refresh) {
            exc_zm_used_param.next = 1;
            this.getList(exc_zm_used_param, this.dataRefresh);
          } else {
            if (this.data.exc_zm_used_nomore) return;
            this.getList(exc_zm_used_param, this.dataProcess);

          }
          return
        }
        if (listTab == 1) {
          if (refresh) {
            exc_zm_expire_param.next = 1;
            this.getExcLog(exc_zm_expire_param, this.dataRefresh);
          } else {
            if (this.data.exc_zm_expire_nomore) return;
            this.getExcLog(exc_zm_expire_param, this.dataProcess);

          }
          return
        }
        return
      }
      return
    }
    //活动券
    if (activeTab == 2) {
      // 已使用、已过期
      if (actListTab == 0) {

        if (refresh) {
          actparam.type = 4;
          actparam.next = 1;
          this.getList(actparam, this.dataRefresh);
        } else {
          if (this.data.noMore_act) return;
          actparam.next = next_act;

          this.getList(actparam, this.dataProcess);
        }
        return
      }
      if (actListTab == 1) {
        this.getactList({}, this.dataRefresh);
        return
      }
      return
    }
  },
  getExcLog(params, callback) {
    getexclog(params).then(res => {
      return callback(res);
    })
  },
  initDate: function () {
    var recentMonth = utils.getLastMonth();
    var selectedDate = new Array();
    selectedDate.push(recentMonth.last);
    selectedDate.push(recentMonth.now);
    param.start_time = '';
    param.end_time = '';
    exc_hn_expire_date.start_time = '';
    exc_hn_expire_date.end_time = '';
    this.setData({
      // defaultDate: recentMonth.last + "~" + recentMonth.now,
      defaultDate: '',
      // selectedDate: selectedDate,
    })
  },
  onRangePick(event) {
    var selectedDate = event.detail;
    param.start_time = selectedDate[0];
    param.end_time = selectedDate[1];
    this.setData({
      selectedDate: selectedDate,
      defaultDate: selectedDate[0] + "~" + selectedDate[1],
    })
  },
  chooseDate: function () {
    this.selectComponent("#timePicker").showModal()
    return
    this.setData({
      showCalendar: true
    });
  },
  // 点击选择日历按钮
  tapDateButton: function (e) {
    //根据data 设置的button 顺序 ，默认左取消右确定
    let index = e.detail.index;
    let date = this.data.selectedDate;

    if (index == 0) {
      //点击取消
      this.setData({
        showCalendar: false,
      });
      return
    }
    //关闭日历弹窗
    this.setData({
      showCalendar: false,
      defaultDate: date[0] + "~" + date[1],
    });
    if (index == 1) {
      //点击确定
      let {
        activeTab,
        listTab,
        exc_active_tab
      } = this.data;
      // 换购券-战马
      if (activeTab == 0 && exc_active_tab == 2) {
        if (listTab == 0) {
          exc_zm_used_param.start_time = date[0];
          exc_zm_used_param.end_time = date[1];
        }
        if (listTab == 1) {
          exc_zm_expire_param.start_time = date[0];
          exc_zm_expire_param.end_time = date[1];
        }
      }
      // 换购券-红牛
      if (activeTab == 0 && exc_active_tab == 1) {
        if (listTab == 0) {
          param.start_time = date[0];
          param.end_time = date[1];
        }
        if (listTab == 1) {
          exc_hn_expire_date.start_time = date[0];
          exc_hn_expire_date.end_time = date[1];
        }
      }
      console.log("param:", param);
      console.log("exc_hn_expire_date:", exc_hn_expire_date);
      this.initAllList(true)
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

    let {
      activeTab,
      listTab,
      exc_active_tab
    } = this.data;
    // 换购券-战马
    if (activeTab == 0 && exc_active_tab == 2) {
      if (listTab == 0) {
        exc_zm_used_param.start_time = sTime;
        exc_zm_used_param.end_time = eTime;
      }
      if (listTab == 1) {
        exc_zm_expire_param.start_time = sTime;
        exc_zm_expire_param.end_time = eTime;
      }
    }
    // 换购券-红牛
    if (activeTab == 0 && exc_active_tab == 1) {
      if (listTab == 0) {
        param.start_time = sTime;
        param.end_time = eTime;
      }
      if (listTab == 1) {
        exc_hn_expire_date.start_time = sTime;
        exc_hn_expire_date.end_time = eTime;
      }
    }
    console.log("param:", param);
    console.log("exc_hn_expire_date:", exc_hn_expire_date);
    this.initAllList(true)

  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})