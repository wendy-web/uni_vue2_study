// pages/phaseIII//write-off/reward.js
let utils = require("../../../utils/util");
let http = require("../../../utils/api");
let log = require("../../../utils/log");
let reachBottom = '';
let requesting = false;
let next = 1;
// 在页面中定义插屏广告
let interstitialAd = null;
let openTime = 0; //开红包次数，第三次弹插屏广告
const app = getApp();
const COS_URL = app.globalData.COS_URL;
import {
  getuserShop
} from '../../../api/exchange/index';
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultDate: '', //默认日期最近一个月
    showCalendar: false, //日历弹窗：默认隐藏
    showTypePop: false, //类型选择弹窗，默认隐藏
    selectedDate: '', //选择的日期
    defaultDate: '', //默认页面初始化日期
    d_uid: '', //店员uid默认不传为全部
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }], //日历弹窗按钮
    getRewardBtn: [{
      text: "领取",
      extClass: "phase_btn"
    }], //领奖弹窗  领取按钮
    getRewardPop: false, //开红包弹窗，请求成功后弹出
    noMore: false, //没有更多数据：
    list: [], //核销红包列表
    param: '', //店员传参\
    hide: false, //店员隐藏开红包
    blockAd: false,
    userShopInfo: null, //店长信息
    // 2023年9月19日 phaseIII的static 静态资源迁移至COS
    file_phase_static: `${COS_URL}/public/img/bfyl/phase/static`,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        // adUnitId: 'adunit-1495b528c79d89ab'//测试版id,上线需注释并打开线上版id
        adUnitId: 'adunit-0af76c31d35dec11' //线上版id
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {
        console.error("插屏广告onError:", err);
      })
      interstitialAd.onClose(() => {})
    }

    this.initDate();


    //获取掌柜店员信息
    utils.getShopInfo().then(res => {
      var boss = '';
      var crew = new Array();
      var member = res.member;
      for (var i = 0, len = member.length; i < len; ++i) {
        if (member[i]['condition'] == 1) {
          boss = member[i];
        } else {
          crew.push(member[i]);
        }
      }
      if (crew) {
        crew.forEach((item, index) => {
          let countTime = setTimeout(() => {
            var item_loaded = 'crew[' + index + '].loaded';
            that.setData({
              [item_loaded]: true
            })
            clearTimeout(countTime)
          }, (index + 1) * 220);
        });
      }

      this.setData({
        crew: crew,
        boss: boss
      });
    }).catch(error=>{
      console.log("店铺信息catch:",error);
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    //获取用户信息
    try {
      let userInfo = wx.getStorageSync('userdata') || await utils.getUserInfoNew();
      if(userInfo){
        this.setData({
          userInfo,
          blockAd: utils.blockAd()
        })
        this.initData();
      }
    } catch (error) {
      // 获取用户信息失败时候监听新的token
      app.tokenReadyCallback = (token) => {
        utils.getUserInfoNew().then(userInfo => {
          this.setData({
            userInfo
          })
          this.initData();
        });
      }
    }
  },
  initDate: function () {
    var recentMonth = utils.getLastMonth();
    var selectedDate = new Array();
    selectedDate.push(recentMonth.last);
    selectedDate.push(recentMonth.now);
    console.log("默认日期：", selectedDate);
    this.setData({
      defaultDate: recentMonth.last + "~" + recentMonth.now,
      selectedDate: selectedDate,
      parameter: {
        // start_time: recentMonth.last,
        // end_time: recentMonth.now,
        start_time: '',
        end_time: '',
      },
    })
  },
  initData() {
    // 获取店长信息/api/user/getuserShop
    getuserShop().then(res => {
      this.setData({
        userShopInfo: res.data
      })
    })
    let {
      userInfo
    } = this.data;
    if (userInfo.condition == 2) {
      wx.setNavigationBarTitle({
        title: "核销助力记录"
      })
      var param = {
        type: 1,
        open: 3,
        check_status: 2
      }
      this.setData({
        param: param,
        hide: true
      });
      return
    }
    // 副掌柜
    if (userInfo.condition == 3) {
      this.setData({
        hide: true
      });
    }
    //如果有数据 并且 没有更多数据 不执行（）
    log.info("noMore:", this.data.noMore, "\n list length:", this.data.list.length);
    if (!this.data.noMore && this.data.list.length == 0) {
      var param = {};
      console.log(this.data.userInfo)
      if (userInfo.condition == 2) {
        //店员请求参数：open:3 check_status:2 type:1
        param = this.data.param;
      }
      // param.start_time = this.data.parameter.start_time;
      // param.end_time = this.data.parameter.end_time;
      param.start_time = '';
      param.end_time = '';
      param.next = 1;
      param.check_status = 2;
      //商户我的卡包：未拆红包
      this.getcardlog(param, this.dataProcess);
    }
  },
  /**
   *  商户我的卡包：未开红包
   * @param {
   * start_time 开始时间
   * end_time 结束时间
   * next 下一页页码
   * d_uid 店员UID
   * limit 显示条数 默认6
   * }  
   */
  getcardlog: function (param, callback) {
    console.log("getCardLog 参数：", param);
    if (requesting) return;
    requesting = true;
    param.exp_status = 2;
    param.type2 = 0;

    http.postBase({
      url:'/api/card/getcardlog',
      params:param
    }).then(res=>{
      console.log("getcardlog 请求成功:", res);
      log.addFilterMsg("getcardlog");
      log.error("getcardlog:", JSON.stringify(res));
      return callback(res);
    });
  },
  //页面初始化/上拉加载更多  处理数据
  dataProcess: function (data) {
    requesting = false;
    reachBottom = false;
    //存在数据就合并
    if (data.data.list) {
      next = data.data.next;
      this.setData({
        list: this.data.list.concat(data.data.list),
      });
    }
    console.log(data.data.list);
    let list_length = data.data.list?.length || 0;
    let limit = data.data.limit || 10;
    if (data.code == 0 || list_length < limit) {
      console.log("没有更多数据了");
      this.setData({
        noMore: true
      });
      return 
    }
  },
  //选择日期/店员 处理数据
  chooseProcess: function (data) {

    requesting = false;
    //存在数据就合并
    if (data.data.list) {
      next = data.data.next;
      this.setData({
        list: data.data.list,
      });
    } else {
      next = 1;
      this.setData({
        list: '',
      });
    }
    wx.stopPullDownRefresh();
    if (data.code == 0 || data.data.list.length < data.data.limit) {
      console.log("没有更多数据了");
      return this.setData({
        noMore: true
      });
    }

  },
  //选择店员
  chooseCrew: function (e) {

    var that = this;
    var d_uid = e.detail.currentTarget.dataset.uid;
    // var selectedDate = this.data.selectedDate;
    var chooseDate = this.data.parameter;
    var parameter = '';
    // console.log("日期参数:", selectedDate);
    if (d_uid != 0) {
      parameter = {
        start_time: chooseDate.start_time,
        end_time: chooseDate.end_time,
        // start_time: selectedDate[0],
        // end_time: selectedDate[1],
        d_uid: d_uid,
      }
    } else {
      parameter = {
        // start_time: selectedDate[0],
        // end_time: selectedDate[1],
        start_time: chooseDate.start_time,
        end_time: chooseDate.end_time,
      }
    }
    parameter.next = 1;
    parameter.check_status = 2;
    this.setData({
      showTypePop: false,
      noMore: false,
    });
    console.log("请求参数：", parameter);
    this.getcardlog(parameter, this.chooseProcess);

  },
  chooseDate: function () {
    this.setData({
      showCalendar: true
    });
  },
  chooseType: function () {
    this.setData({
      showTypePop: true
    });
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
    //关闭日历弹窗
    this.setData({
      showCalendar: false,
      noMore: false
    });
    next = 1
    if (index == 1) {
      //点击确定
      //日期，店员参数：
      let date = this.data.selectedDate;
      let d_uid = this.data.d_uid;
      let param = '';
      if (d_uid) {
        param = {
          start_time: date[0],
          end_time: date[1],
          d_uid: d_uid
        }
      } else {
        param = {
          start_time: date[0],
          end_time: date[1],
        }
      }
      if (this.data.userInfo.condition == 2) {
        //店员请求参数：open:3 check_status:2 type:1
        param.type = 1;
        param.open = 3;
      }
      param.check_status = 2;

      console.log("post参数", param);
      this.getcardlog(param, this.chooseProcess);
      return
    }
  },
  // 开红包
  getReward: function (e) {
    var that = this;
    //获取用户店铺信息
    http.post('/api/shop/getInfo', false, ).then((res) => {
      if (res.code == 1) {
        var shopInfo = res.data;
        console.log("店铺信息：", shopInfo);
        if (!shopInfo.l_longitude && !shopInfo.l_latitude) {
          wx.showModal({
            title: '温馨提示',
            content: "请完善店铺信息",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/zhongduan/geren/mendian/renzhen/index',
                })
              }
            }
          })
        } else {
          let id = e.currentTarget.dataset.id;
          let list = that.data.list;
          let index = list.findIndex(item => item.id == id);
          let param = {
            c_id: id
          }
          console.log("opencard 请求参数；", param);

          http.post('/api/card/opencard', param).then(res => {
            console.log("开红包返回：", res);
            log.info("opencard:", JSON.stringify(res));
            if (res.code == 1) {
              wx.showToast({
                title: '恭喜您获得' + res.data.money + '元',
                icon: 'none',
                duration: 2000
              })
              let index = list.findIndex(item => item.id == id);
              let newList = "list[" + index + "].show";
              if (index > -1) {
                list.splice(index, 1);
                that.setData({
                  // [newList]:false
                  list: list
                });
              }
              //开红包成功后更新用户信息：userInfo.card_m:兑换红包收益累计
              getuserShop().then(res => {
                this.setData({
                  userShopInfo: res.data
                })
              })
              openTime++;
              if (openTime >= 3) {
                // 在适合的场景显示插屏广告
                if (interstitialAd && that.data.blockAd) {
                  interstitialAd.show().catch((err) => {
                    console.error("插屏广告显示失败:", err)
                  })
                }
              }
            }
            if (res.code == 0) {
              wx.showModal({
                title: '温馨提示',
                content: res.msg,
                showCancel: false
              })
            }
            if (res.code == 5) {
              wx.showModal({
                title: '温馨提示',
                content: res.msg,
                showCancel: false,
                success: (_res) => {
                  if (_res.confirm) {
                    wx.reLaunch({
                      url: '/pages/user/register/index',
                    })

                  }
                }
              })
            }
          })

        }

      } else {
        wx.showModal({
          title: '温馨提示',
          content: "填写店铺信息后可领取兑换红包",
          confirmText: "前往填写",
          cancelText: "放弃",
          success: (_res) => {
            if (_res.confirm) {
              wx.redirectTo({
                url: '/pages/zhongduan/geren/mendian/renzhen/index',
              })
            } else {
              wx.navigateBack();

            }
          }
        })
        console.log(res)
      }
    })


  },
  //关闭弹窗
  closePop: function () {
    this.setData({
      getRewardPop: false
    });
    // wx.navigateTo({
    //   url: '/pages/zhongduan/geren/yuer/index',
    // })
  },
  onPickDateChange(event) {
    console.log('parent onPickDateChange', event)
  },
  onControl(event) {
    console.log('parent onControl', event)
  },
  onPickDay(event) {
    console.log('parent onPickDay', event)
  },
  onRangePick(event) {
    console.log('parent onRangePick', event)
    var selectedDate = event.detail;
    this.setData({
      selectedDate: selectedDate,
      defaultDate: selectedDate[0] + "~" + selectedDate[1],
      parameter: {
        start_time: selectedDate[0],
        end_time: selectedDate[1],
      }
    })

  },
  goYuer: function () {
    //检查用户手机号,存在则跳转
    var userdata = wx.getStorageSync('userdata');
    if (userdata && userdata.mobile) {
      //本地缓存用户信息
      let url = '';
      if (userdata.condition != 2) {
        url = "/pages/zhongduan/geren/yuer/index"
      } else {
        url = "/pages/zhongduan/geren/zhuli/index"
      }
      wx.redirectTo({
        url: url,
      })
    } else {
      //请求接口获取最新数据
      utils.getUserInfoNew()

    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    openTime = 0;
    requesting = false;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    openTime = 0;
    requesting = false;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function (e) {
    this.initDate();
    // let param = this.data.parameter;
    let param = {};
    if (this.data.userInfo.condition == 2) {
      //店员请求参数：open:3 check_status:2 type:1
      param.type = 1;
      param.open = 3;
    }
    param.check_status = 2;
    param.next = 1;
    next = 1;
    this.setData({
      noMore: false
    });
    // 获取店长信息/api/user/getuserShop
    getuserShop().then(res => {
      this.setData({
        userShopInfo: res.data
      })
      this.getcardlog(param, this.chooseProcess);
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {

    // let date = this.data.selectedDate;
    let date = this.data.parameter;
    let d_uid = this.data.d_uid;
    let param = '';
    if (d_uid != 0) {
      param = {
        start_time: date.start_time,
        end_time: date.end_time,
        d_uid: d_uid,
        next: next,
      }
    } else {
      param = {
        start_time: date.start_time,
        end_time: date.end_time,
        next: next,
      }

    }
    if (this.data.userInfo.condition == 2) {
      //店员请求参数：open:3 check_status:2 type:1
      param.type = 1;
      param.open = 3;
    }
    param.check_status = 2;
    console.log("onReachBottom 传参：", param);
    //没有更多数据 或者正在上拉加载 return
    if (this.data.noMore || reachBottom) return;
    reachBottom = true;

    this.getcardlog(param, this.dataProcess);
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})