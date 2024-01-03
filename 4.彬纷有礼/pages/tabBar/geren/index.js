 //index.js
 //获取应用实例
 const app = getApp();
 var utils = require('../../../utils/util.js');
 var http = require('../../../utils/api');
 const log = require('../../../utils/log');
 const socket = require('../../../utils/socket.js')
 let timer = '';
 let hide = false;
 const COS_URL = app.globalData.COS_URL;
 const shopActUtils = require("../../../api/shopActivity/utils");
 const storeRankUtils = require("../../../api/storeRank/utils");
 let check_voucher_expire = Date.now() < new Date('2023/06/16 00:00:00').getTime();
 import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime.js';
 import {
   excCount,
   getuserShop,
   canScanNum,
   scan23getUser
 } from '../../../api/exchange/index';
 import {
   xdyhMini,
   reportEvent
 } from '../../../api/openMiniProgram'
 import {
   getxdyhUser,
   getConfig
 } from '../../../api/config'
 Page({
   data: {
     userInfo: '',
     progress: '',
     dhxPop: false, //待核销弹窗提醒
     dhxbg: COS_URL + '/public/img/phaseIII/qrcodePop1.png',
     // 新版UI
     assetsBG: COS_URL + '/public/img/phaseIII/202104/assetsBG.png',
     act_End: false, //活动结束
     ani_icon_use: COS_URL + '/public/img/phaseIII/20211020/ani_icon_use.png',
     icon_hot_fire: COS_URL + '/public/img/bfyl/202201/icon_hot_fire.png', //账单2011
     billPop2021: false, //2021年度账单弹窗
     img_billPop: COS_URL + '/public/img/bfyl/202301/img_bill_2022.png',
     icon_close: COS_URL + '/public/img/bfyl/202201/icon_close.png',
     icon_btn_bill: COS_URL + '/public/img/bfyl/202201/icon_btn_bill.png',
     icon_expiring_soon: COS_URL + '/public/img/bfyl/202206/icon_expiring_soon.png',
     store_allowance_balance: '', //可用现金券
     bg_cash_balance: COS_URL + '/public/img/bfyl/202208/bg_cash_balance.png',
     //陈列进货统计
     disPurTotal: {
       purNeed: 0,
       disNeed: 0,
       purWait: 0,
       disWait: 0
     },
     ylcountTab: null, //我的订单统计
     store_allowance_show: false, //默认隐藏现金券模块
     swiperOption: { //订单swiper 配置
       interval: 5000,
       duration: 500
     },
     icon_arrow_r: COS_URL + '/public/img/bfyl/202301/icon_arrow_r.png',
     icon_hgjl: COS_URL + '/public/img/bfyl/202302/icon_hgjl.png',
     excCount: null, //换购统计
     userShopInfo: null, //店长信息
     userRoleMap: app.globalData.userRole, //用户身份显示
     showOfficalAccount: true, // 关注公众号组件判断，部分场景才会展示
     CanScanNum: 0, // 可扫现金券箱数
     //  2023年8月18日
     hn2in1_info: null, //红牛箱内码2选1 扫码信息
     isLoggedIn: false, // 是否已登录：区分用户退出登录
     avatar_grey: `${COS_URL}/public/img/bfyl/2023/10/avatar_grey.png`
   },

   onLoad: function (options) {
     utils.getNavbarData().then(res => {
       let {
         navBarHeight,
         statusBarHeight,
         screenHeight
       } = res;
       this.setData({
         navbarHeight: navBarHeight + statusBarHeight,
         screenHeight
       })
     })
   },
   onShow() {
     // 判断是否退出登录
     let isLoggedIn = wx.getStorageSync('isLoggedIn');
     isLoggedIn = Boolean(isLoggedIn > 0);
     this.setData({
       isLoggedIn
     })

     this.initOnShow()

   },
   onReady: function () {

   },
   //  初始化onshow：判断是否登录
   async initOnShow() {
     let {
       isLoggedIn
     } = this.data;
     try {
       //注册socket回调
       socket.addLoopBack('geren', (data, ckey) => {
         console.log('socket geren', data, ckey)
         this.socketUserHandle(data, ckey)
       })
       // 先获取用户信息（身份判断）再初始化其它业务逻辑
       let userInfo = await utils.getUserInfoNew();
       if (userInfo) {
         this.setData({
           userInfo
         })
         if (isLoggedIn) {
           this.initData();
         }
       }

     } catch (error) {
       //  用户信息接口登录失效不会重复回调（wxlogin 之后会调用）所以这里需要监听token登录成功的回调
       app.tokenReadyCallback = (token) => {
         utils.getUserInfoNew().then(userInfo => {
           this.setData({
             userInfo
           })
           if (isLoggedIn) {
             this.initData();
           }
         });
       }
     }
   },
   //  初始化业务数据：
   initData() {
     //获取本地localBalance:余额缓存
     let localBalance = wx.getStorageSync('localBalance') || 0;
     // 年度账单弹窗判断（每日一次 + 截止期日）
     let timeDiff = Date.now() - new Date('2023/2/1').getTime();
     // 检查每日弹窗
     let check_bill_pop = utils.checkDateShowDailyPop('billPop2022');
     let billPop2021 = check_bill_pop && timeDiff < 0 ? true : false;
     //信息完善度  头像昵称 60% 手机号+20% 身份+20%
     var progress = '60';
     let {
       condition,
       mobile,
       shop_id
     } = this.data.userInfo;
     if (condition != 0 && mobile) {
       progress = '100';
     } else {
       progress = '80';
     }
     this.setData({
       progress,
       localBalance,
       billPop2021
     })
     // 如果不是店员，获取可用现金券
     if (condition && condition != 2) {
       this.getCashCount();
       //  2023年7月28日 获取可扫现金券额度
       this.getCanScanNum();
     }
     //  2023年8月18日 新增红牛2选1 扫码信息
     this.getUserInfo2in1()
     // 有店铺id获取店铺简洁信息
     if (shop_id) {
       utils.getShopInfo().then(_res => {
         wx.setStorageSync('storeInfo', _res)
         this.setData({
           shop_name: _res.shop_name,
           shopInfo: _res
         })

       }).catch(err => {

       })

     } else {
       this.setData({
         shop_name: ''
       })
     }
     //获取未读系统消息
     utils.getUnreadNotice()
     //获取卡包统计
     clearInterval(timer);
     hide = false;
     this.getcount();
     this.getYlcount();
     //获取换购券：判断data.pop,有值代表有26周年1元乐享换购券
     this.getCardLog();
     //获取进货陈列统计
     //  this.getDisPurTotal()

     // 2023年1月6日 获取战马换购奖励统计
     this.excCount();
     //副掌柜显示店长信息的 收益累计
     getuserShop().then(res => {
       this.setData({
         userShopInfo: res.data
       })
     })

     // 2023年7月27日 深圳开箱活动
     //  this.actCouponGetInfoSZ();
     // 2023年8月8日 深圳兑奖抽奖活动 issue 14+15
     //  this.storeRankGetInfo()
     //  2023年8月28日 广州开箱活动
     //  this.gzUnboxActInfo();
     //  2023年8月28日 广州兑奖活动
     //  this.gzExcActInfo();
     //2023年10月22日-11月30日 东莞战马兑奖活动信息
     this.actCouponGetInfo();
   },
   /**
    * 商家卡包统计：
    * unopen:未拆 -->兑换奖励 开红包
    * uncard 已拆未核销
    */
   getcount: function () {
     let that = this;
     if (hide) {
       clearInterval(timer);
       return
     };
     var userdata = this.data.userInfo;
     var condition = userdata.condition;
     // 未登录也不请求
     if (wx.getStorageSync('islogin') != 1) return
     utils.getcountcard().then(res => {
       clearInterval(timer);
       //个人用户无店铺信息 不轮询
       if (condition != 0) {
         //  定时循环获取待核销数据
         timer = setInterval(() => {
           that.getcount();
         }, 4000)
       }
       if (res.code == 1) {

         var phaseIII_count = res.data;
         wx.setStorageSync('phaseIII_count', phaseIII_count);
         let {
           act1_unused,
           act4_unused,
           exc_zm_unused,
           act3_unused
         } = res.data;
         res.data.all_unused = act1_unused + act4_unused + exc_zm_unused + act3_unused;
         this.setData({
           cardInfo: res.data
         })
         // 2023年9月22日 每天只弹1次 缓存字段：dhxpop,当前日期 和缓存的数量 两个条件都相等，不弹，否则要弹窗
         let {
           order_un
         } = res.data;
         if (order_un > 0) {
           let dhxpop_date_show = utils.checkDateShowDailyPop('dhxpop_date');
           let dhx_order_un = wx.getStorageSync('dhx_order_un') || '';
           if (dhx_order_un != order_un || dhxpop_date_show) {
             that.setData({
               dhxPop: true
             })
             wx.setStorageSync('dhx_order_un', order_un);
           }
         }
         return
       }
       this.setData({
         cardInfo: null
       })
     })

   },
   goHx: function () {
     var userdata = wx.getStorageSync('userdata');
     var condition = userdata.condition;
     wx.redirectTo({
       url: '/pages/storeOrder/myorder/index/index?activeTab=3',
     })
   },
   closePop: function () {
     this.setData({
       dhxPop: false,
       billPop2021: false
     });
   },
   onHide: function (e) {
     //关闭当前tab状态
     socket.cleanCurrTab()
     hide = true;
     this._navigateToPage = false;
     clearInterval(timer);
     timer = '';
     wx.hideLoading({
       success: (res) => {},
     })
     this.setData({
       dhxPop: false,
       billPop2021: false,
       //  actInfoRaffle:null
     })
   },
   onUnload: function () {
     hide = true;
     this._navigateToPage = false;
     clearInterval(timer);
     timer = '';
     //回收当前钩子
     socket.cleanCurrHook('geren')
   },
   navigateToPage: function (e) {
     let {
       type = '', url = ''
     } = e.currentTarget.dataset;
     if (this._navigateToPage) return;
     this._navigateToPage = true;

     if (type && type == "switchTab") {
       wx.switchTab({
         url: url,
         complete: () => {
           this._navigateToPage = false;
         }
       })
     } else {
       wx.navigateTo({
         url: url,
         complete: () => {
           this._navigateToPage = false;
         }
       })
     }
   },
   //跳转我的订单页
   jumpToOrder: function (e) {
     let activeTab = e.currentTarget.dataset.index;
     console.log("activeTab:", activeTab);
     let url = '/pages/storeOrder/myorder/index/index?activeTab=' + activeTab;
     wx.navigateTo({
       url: url,
     })
   },
   // 跳转至年度账单：activeTab=1
   openBill: utils.throttle(function () {
     let url = '/pages/zhongduan/geren/annualBill/index?activeTab=1';
     this.setData({
       billPop2021: false
     })
     wx.navigateTo({
       url: url,

     })

   }, 1000),
   //获取换购券列表
   getCardLog: function () {
     let param = {
       start_time: '',
       end_time: '',
       check_status: 0,
       next: 1,
       open: 3
     }
     http.post('/api/card/getcardlog', param).then(res => {
       console.log("getVoucherList 请求返回:", res);
       let {
         code,
         data
       } = res
       //pop存在值，说明有卡券即将过期
       if (+code == 1 && data.pop && check_voucher_expire) {
         this.setData({
           expiringSoon: true
         });
       } else {
         this.setData({
           expiringSoon: false
         });

       }
     })
   },
   //店长获取可用现金券
   getCashCount: function () {
     http.post('/api/cash/count').then(res => {
       let {
         code,
         data
       } = res;
       if (code == 1) {
         if (Number(data.balance) > 0) {
           data.balance = utils.formatAmount(data.balance)
         }
         let store_allowance_show = data.id || '';
         this.setData({
           store_allowance_balance: data.balance,
           store_allowance_show: store_allowance_show
         })
       }
     })
   },
   //引单陈列进货个人中心统计
   getDisPurTotal() {
     http.postBase({
       url: '/api/display/getShopProNum'
     }).then(res => {
       let {
         pur,
         dis,
         num,
         pro_id
       } = res.data
       let _pur = pur || {
         need_num: 0,
         completed_num: 0
       }
       let _dis = dis || {
         need_num: 0,
         completed_num: 0
       }
       let purWait = _pur.need_num - _pur.completed_num
       let disWait = _dis.need_num - _dis.completed_num
       if (!pur) {
         pur = {
           need_num: '-'
         }
         purWait = '-'
       }
       if (!dis) {
         dis = {
           need_num: '-'
         }
         disWait = '-'
       }

       this.setData({
         disPurTotal: {
           purNeed: pur.need_num,
           disNeed: dis.need_num,
           purWait: purWait,
           disWait: disWait,
           num,
           pro_id
         }
       })
     })
   },
   //跳转活动列表详情？--xiaoMo
   goStoreDisplay() {
     let {
       num,
       pro_id
     } = this.data.disPurTotal
     if (num == 1 && pro_id) {
       let {
         shop_id
       } = this.data.userInfo
       wx.navigateTo({
         url: `/pages/storeDisplay/promotionDetails/index?shop_id=${shop_id}&pro_id=${pro_id}`
       })
       return
     }
     this.goStoreDisplayTabs()
   },
   //跳转活动列表--xiaoMo
   goStoreDisplayTabs() {
     wx.navigateTo({
       url: '/pages/storeDisplay/index/index',
     })
   },
   //个人soket消息处理
   socketUserHandle(res, ckey) {
     let clean = res.clean || false
     switch (res.type) {
       /**电子签*/
       //  case 'ess':
       //    this.selectComponent('#signNotice').showPopup(res.data.msg, ckey, clean)
       //    break
       /**活动进行中 活动完成情况*/
       //  case 'act_1':
       //    if (res.data.list && res.data.list.length > 0) {
       //      this.selectComponent('#activityExecution').showPopup(res.data.list, clean)
       //    } else {
       //      this.releaseQueueTaskBack({
       //        detail: {
       //          key: 'act_1'
       //        }
       //      })
       //    }
       //    break
       /**活动结果 活动奖励发放*/
       //  case 'act_2':
       //    this.selectComponent('#awardGrant').showPopup(res.data.msg, ckey, clean)
       //    break
       /**订单通知*/
       //  case 'order_1':
       //    this.selectComponent('#orderTask').showPopup(res.data.msg, ckey, clean)
       //    break
       /**陈列复核情况*/
       //  case 'rec':
       //    this.selectComponent('#displayReview').showPopup(res.data.msg, ckey, clean)
       //    break
       //  2023年8月11日 公共事件
       case 'public':
         this.selectComponent('#orderTask').showPublicPopup(res.data.msg, ckey, clean);
         break
     }
   },
   releaseQueueTaskBack(event) {
     let {
       key
     } = event.detail
     socket.releaseQueueTaskBack(key)
   },
   
   //商城订单统计
   getYlcount() {
     let ylcountTab = {};
     http.postBase({
       url: '/api/card/ylcount'
     }).then(res => {
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
         /**月结 */
         // let yj01 = status_1.pay_type[2].o_sum
         // let yj02 = status_2.pay_type[2].o_sum
         // let yj03 = status_3.pay_type[2].o_sum
         /**月结 */
         // ylcountTab['status_1'] = status_1.pay_type[0]['o_sum'] + status_1.pay_type[1]['o_sum'] + old.status_1.order + yj01
         // ylcountTab['status_2'] = status_2.pay_type[0]['o_sum'] + status_2.pay_type[1]['o_sum'] + old.status_2.order + yj02
         // ylcountTab['status_3'] = status_3.pay_type[0]['o_sum'] + status_3.pay_type[1]['o_sum'] + old.status_3.order + yj03

         // 去除引单版本统计
         ylcountTab['status_1'] = old.status_1.order;
         ylcountTab['status_2'] = old.status_2.order;
         ylcountTab['status_3'] = old.status_3.order;
         this.setData({
           ylcountTab
         })
       }
     })
   },
   // 消息订阅
   goSubscribe() {
     wx.showLoading({
       title: '加载中',
       mask: true
     })
     let accountInfo = wx.getAccountInfoSync();
     let {
       miniProgram
     } = accountInfo;
     console.log(miniProgram);
     if (miniProgram && miniProgram.appId == "wxfdeaae516b9559f2") {
       wx.navigateTo({
         url: '/pages/tabBar/shouye/webview/index?source=bfyl',
         complete() {
           wx.hideLoading({
             success: (res) => {},
           })
         }
       })
     } else {
       wx.navigateToMiniProgram({
         appId: "wxfdeaae516b9559f2",
         path: '/pages/tabBar/shouye/webview/index?source=bfyl',
         complete() {
           wx.hideLoading({
             success: (res) => {},
           })
         }
       })
     }

   },
   // 跳转至订单详情
   goOrderDetail(event) {
     wx.showModal({
       title: '温馨提示',
       content: '跳转至订单详情'
     })
   },
   //战马换购奖励统计
   excCount() {
     excCount().then(res => {
       let {
         code,
         data
       } = res;
       if (code == 1) {
         let {
           hn_available,
           zm_available
         } = data;
         let total_available = Number(hn_available) + Number(zm_available);
         total_available = total_available.toFixed(2)
         data.total_available = total_available;
         this.setData({
           excCount: data
         })
       }
     })
   },
   async storeRankGetInfo(event) {

     try {
       // 获取活动信息
       let {
         actInfo
       } = await storeRankUtils.actInfo14();
       console.log("我的页面raffle参与信息：", actInfo)
       if (actInfo) {
         this.setData({
           actInfoRaffle: actInfo
         })

         return
       }
       return this.setData({
         actInfoRaffle: null
       })
     } catch (err) {
       console.error("storeRankGetInfo err:", err);
     }

   },
   //  2023年5月22日 关注公众号组件 事件监听
   officialLoad(event) {
     console.log("officialLoad loaded:", event)
     this.setData({
       showOfficalAccount: true
     })
   },
   officialError(event) {
     console.log("officialError error:", event)
     this.setData({
       showOfficalAccount: false
     })
   },

   // 8月深圳开箱活动参与信息
   async actCouponGetInfoSZ() {
     try {
       // 获取活动信息
       let result = await shopActUtils.act5_getinfo_sz();
       console.log("首页开箱活动参与信息：", result)
       if (result.actInfo) {

         this.setData({
           actInfoSZ: result.actInfo
         })

       } else {
         this.setData({
           actInfoSZ: null,
         })
       }
       return
     } catch (err) {
       console.error("actCouponGetInfoSZ err:", err);
     }
   },
   async getCanScanNum() {
     try {
       let {
         code,
         data
       } = await canScanNum();
       if (code == 1 && data.CanScanNum > 0) {
         this.setData({
           CanScanNum: utils.formatAmount(data.CanScanNum)
         })
       } else {
         this.setData({
           CanScanNum: 0
         })
       }

     } catch (error) {
       console.log("getCanScanNum:", error);
     }
   },
   //  2023年8月18日 红牛2in1扫码信息：
   async getUserInfo2in1() {
     try {
       let {
         code,
         data
       } = await scan23getUser();
       if (code == 1 && data.id) {
         this.setData({
           hn2in1_info: data
         })
       } else {
         this.setData({
           hn2in1_info: null
         })
       }
     } catch (error) {
       console.log("getUserInfo2in1:", error);
     }
   },
   // 2023年8月23日 我的积分跳转小店有惠
   async getxdyhUser(open = false) {
     try {
       let event_name = 'click_mintegration';
       let {
         platform = ''
       } = app.globalData.systemInfo;
       let event_data = {
         "devices": platform
       }
       reportEvent(event_name, event_data)
       let xdyhConfig = utils.getCache('xdyzConfig230810');
       if (xdyhConfig) {
         this.setData({
           xdyhConfig: JSON.parse(xdyhConfig)
         })
       } else {
         let res = await getConfig();
         if (res.code == 1 && res.data.ad1) {
           utils.setCache('xdyzConfig230810', JSON.stringify(res.data), 1800)
           this.setData({
             xdyhConfig: res.data
           })
         } else {
           this.setData({
             xdyhConfig: null
           })
         }
       }

       // 先获取用户信息（身份判断）再初始化其它业务逻辑
       let result = await getxdyhUser();
       const {
         code,
         data: xdyhUserInfo
       } = result
       if (+code == 1) {
         this.setData({
           xdyhUserInfo
         })
       }
       this.openXdyh()
     } catch (error) {
       //  用户信息接口登录失效不会重复回调（wxlogin 之后会调用）所以这里需要监听token登录成功的回调

     }
   },
   openXdyh() {
     let {
       xdyhUserInfo,
       xdyhConfig
     } = this.data;
     let page = xdyhUserInfo?.page || '';
     xdyhMini({
       path: page,
       halfScreen: xdyhConfig.scoreShop || ''
     })
   },
   //  2023年8月28日 广州开箱活动
   async gzUnboxActInfo() {
     try {
       // 获取活动信息
       let {
         actInfo
       } = await shopActUtils.gzUnboxActInfo();
       console.log("广州开箱活动信息：", actInfo)
       if (actInfo) {
         this.setData({
           actInfoGZ: actInfo
         })
         log.addFilterMsg('actInfoGZ');
         log.info(actInfo);
         //开箱活动每日弹窗处理(活动进行中)
         let {
           act_state,
           is_win,
           sign_time = '',
           status
         } = actInfo;
         // 未报名弹窗：活动未结束、未报名或者无报名时间
         if (!act_state.act_end && (status == '未报名')) {
           // 判断每日弹窗 gzunbox_apply_daily_pop
           let gzunbox_apply_daily_pop = utils.checkDateShowDailyPop('gzunbox_apply_daily_pop')
           if (gzunbox_apply_daily_pop) {
             this.selectComponent('#actCouponPop').showGzUnboxApplyPop(actInfo);
           }
           return
         }
         // 活动进行中：每日进度更新弹窗
         if (act_state.act_ing) {

           let gzunbox_apply_daily_pop_geren = utils.checkDateShowDailyPop('gzunbox_apply_daily_pop_geren')
           if (gzunbox_apply_daily_pop_geren) {
             this.selectComponent('#actCouponPop').showGzUnboxDailyPop(actInfo);
           }
           return
         }
         // 活动结束：判断本地是否缓存中奖弹窗日期
         if (act_state.act_end && !act_state.act_expire) {
           // 中奖、抽奖中奖也要算进去
           if ((is_win) && utils.checkDateShowDailyPop('gz_win_pop_date')) {
             this.selectComponent('#actCouponPop').showGzUnboxWinPop(actInfo)
             return
           }
         }
         return
       }
       return this.setData({
         actInfoGZ: null
       })
     } catch (err) {
       console.error("actInfoGZ err:", err);
     }
   },
   //  2023年8月28日 广州兑奖活动
   async gzExcActInfo() {
     try {
       // 获取活动信息
       let {
         actInfo
       } = await shopActUtils.gzExcActInfo();
       console.log("广州兑奖活动信息：", actInfo)
       if (actInfo) {
         this.setData({
           actInfoGzExc: actInfo
         })
         log.addFilterMsg('actInfoGzExc');
         log.info(actInfo);
         return
       }
       return this.setData({
         actInfoGzExc: null
       })
     } catch (err) {
       console.error("actInfoGzExc err:", err);
     }
   },
   //  跳转登录页
   goToLogIn() {
     utils.navigateFrequentPage('pages/zhongduan/geren/setting/index')
   },
   // 10月 东莞战马兑奖活动参与信息
   async actCouponGetInfo() {
    try {
      // 获取活动信息
      let result = await shopActUtils.dgZmExcActInfo();
      console.log("首页开箱活动参与信息：", result)
      if (result.actInfo) {

        this.setData({
         actInfoDgzmExc: result.actInfo
        })

      } else {
        this.setData({
         actInfoDgzmExc: null,
          displayInfo: null
        })
      }
      return
    } catch (err) {
      console.error("actCouponGetInfo err:", err);
    }
  },
 })