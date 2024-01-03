// pages/couponActivity/gzUnbox/index/index.js
// pages/storeRank//rank.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const utils = require('../../../../utils/util');
const log = require('../../../../utils/log');
import {
  unboxInitPrizeConfig
} from '../../config/index'
import shopActUtils from '../../../../api/shopActivity/utils'
import {
  rankListGz16,
} from '../../../../api/shopActivity/index';
import {rankList14} from '../../../../api/storeRank/api'
let _request = false;
let params = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getAwardGif: COS_URL + "/public/img/storeRank/20210121/getAward0208.gif",
    activeTab: 0, //默认选中0排行榜
    storeInfo: null, //店铺信息
    userInfo: null, //用户信息
    actInfo: null, //活动参与信息
    rankList: [], //排行榜列表，默认显示10个
    myRankList:[], //我的前5后5列表
    noMore: false,
    // 2023年4月17日
    img_dydf: `${COS_URL}/public/img/bfyl/assets/store/dydf.png`,
    rank_bg_head: `${COS_URL}/public/img/storeRank/202304/rank_bg_head.png`, // 顶部背景图
    img_hn_28th: `${COS_URL}/public/img/storeRank/202305/icon_hb_28.png`, // 28周年图标

    img_title_can: `${COS_URL}/public/img/storeRank/202304/img_title_can.png`,
    img_hn_can: `${COS_URL}/public/img/storeRank/202304/img_hn_can.png`, // 红牛罐装
    img_hn_box: `${COS_URL}/public/img/storeRank/202304/img_hn_box.png`, // 红牛箱装
    prizeConfig: null, // 奖品设置
    img_content_mask: `${COS_URL}/public/img/storeRank/202304/img_content_mask.png`, //内容蒙层
    img_rank_tag: `${COS_URL}/public/img/storeRank/202304/img_rank_tag.png`, // 图标：排行榜
    icon_eye: `${COS_URL}/public/img/storeRank/202304/icon_eye.png`, // 图标：查看
    text_rank: `${COS_URL}/public/img/storeRank/202304/text_rank.png`, // 文字：排名
    text_shop_name: `${COS_URL}/public/img/storeRank/202304/text_shop_name.png`, // 文字：门店名称
    text_exc_num: `${COS_URL}/public/img/storeRank/202304/text_exc_num.png`, // 文字：兑奖人数
    bg_head_bar: `${COS_URL}/public/img/storeRank/202304/bg_head_bar.png`, // 背景横条
    btn_zhuli: `${COS_URL}/public/img/storeRank/202305/btn_zhuli.png`, //按钮：我要助力
    file_cos_url: `${COS_URL}/public/img/bfyl/2023/08`,
    iconTheme:'white',//顶部导航栏图标默认白色
    file_url_gzunbox:`${COS_URL}/public/img/bfyl/2023/08/gzUnbox`,//广州开箱活动资源

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    utils.getNavbarData().then(res => {
      if (res) {
        this.setData({
          navBarSystem: res,
        })
      }
    });
  },
  hxHistory: function () {
    let userInfo = this.data.userInfo;
    let url = '/pages/zhongduan/geren/storesRecord/index?act=1';
    wx.navigateTo({
      url: url,
    })
  },
  changeTab: function (e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: index
    })
  },

  previewImg: utils.throttle(function (e) {
    let url = e.currentTarget.dataset.img;
    if (url) {
      wx.previewImage({
        urls: [url],
      })
    }
  }),
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.initData();

  },
  async initData() {
    try {
      // 获取活动信息
      let {
        actInfo,
        msg
      } = await shopActUtils.gzUnboxActInfo();
      console.log("广州开箱参与信息：", actInfo, msg)
      let userInfo = wx.getStorageSync('userdata') || await utils.getUserInfoNew();
      
      if (actInfo) {
        log.addFilterMsg('actInfoGZ');
        log.info('actInfoGZ:', actInfo)
        let prizeConfig = unboxInitPrizeConfig(actInfo.calc.rule);
        let storeInfo = await utils.getShopInfo(false)
        this.setData({
          prizeConfig,
          actInfo,
          userInfo,
          storeInfo
        })
        params.next = 1;
        params.limit = 20;
        this.getData('refresh')
        return
      }
      this.setData({
        actInfo: {}
      })
      wx.showModal({
        title: '温馨提示',
        content: msg,
        showCancel: false,
        success: function (_res) {
          if (_res.confirm) {
            wx.navigateBack({
              delta: 0,
              fail() {
                wx.switchTab({
                  url: '/pages/tabBar/shouye/index',
                })
              }
            })
          }
        }
      })
    } catch (err) {
      console.error("initData err:", err);
    }

  },
  //领取奖励
  getReward: function () {
    //测试需删除
    // this.selectComponent('#storeRank').showGetAwardSuccessPop()
    // return
    //测试需删除
    if (this.data.userInfo.condition != 1) {
      wx.showModal({
        title: '温馨提示',
        content: '请通知店长领取奖励',
        showCancel: false
      })
      return
    }
    // 显示核对店铺消息弹窗
    this.selectComponent('#storeRank').showCheckShopInfoPop()
  },

  // 排名刷新
  refreshRankList() {
    params.next = 1;
    this.getData('refresh')

  },
  allRank: function () {
    //查看全部：rankList
    let url = '/pages/storeRank/rankList/index';
    if (!this.data.rankList || this.data.rankList.length < 1) {
      wx.showToast({
        title: '暂无榜单信息',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: url,
    })
  },
  showMsg: function (e) {
    let msg = e.currentTarget.dataset.msg;
    if (msg) {
      this.setData({
        showMsgPop: true,
        msg: msg
      });

    }
  },
  closeMsgPop: function () {
    this.setData({
      showMsgPop: false,
    });
  },


  // 返回上一页：失败情况返回首页
  back() {
    wx.navigateBack({
      delta: 0,
      fail(err) {
        console.log(err)
        wx.switchTab({
          url: '/pages/tabBar/shouye/index',
        })
      }
    })
  },
  //排行榜活动：定时器结束触发
  rankTimerFinished(event) {
    let actInfo = this.data.actInfo;
    //活动未结束刷新倒计时
    if (!actInfo.act_state.act_end) {
      //根据时间重新计算 活动状态
      let {
        s_time,
        e_time
      } = actInfo
      let act_state = shopActUtils.init_act_state({
        s_time,
        e_time
      });
      console.log("倒计时结束重置活动状态：", act_state)
      actInfo.act_state = act_state;
      this.setData({
        actInfo
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    _request = false;
  },
  // 打开活动规则传参活动信息
  openRankRule(event) {
    const {
      url = '',
    } = event.currentTarget.dataset;
    if (!url) return;
    let {
      actInfo
    } = this.data;
    return utils.navigateFrequentPage(url, `?actInfo=${encodeURIComponent(JSON.stringify(actInfo))}`);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    _request = false;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");
    this.initData()
  },
  // 跳转扫一扫
  goScan: function () {

    let url = "/pages/zongduan/saoma/index?hide=1";
    //获取当前页面栈
    let pages = getCurrentPages() || [];
    if (pages.length) {
      pages.reverse();
      let pageIndex = pages.findIndex(item => item.route == 'pages/zongduan/saoma/index');
      console.log(pages, pageIndex);
      if (pageIndex > -1) {
        // pages[pageIndex].setData({
        //   isBackPage: true
        // });
        wx.navigateBack({
          delta: pageIndex,
        })
        return
      }
    }
    //页面栈里无指定页面再跳转（小程序中页面栈最多10层，超出会报错：fail webview count limit exceed）
    if (url) {
      wx.navigateTo({
        url: url,
      })
    }


  },
  openPageParam(event) {
    const {
      url = '',
        params = '',
        opentype=1
    } = event.currentTarget.dataset;
    if(opentype == 2){
      let {
        userInfo
      } = this.data;
      if (userInfo.condition == 2) {
        wx.showModal({
          title: '温馨提示',
          content: '请联系店长使用卡券',
          showCancel: false
        })
        return
      }
    }
    if (!url) return;
    utils.navigateFrequentPage(url, params)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("reachBottom");
    let {
      noMore
    } = this.data;
    if (noMore) return;
    this.getData('loadmore')

  },
  getList(params) {
    let {
      storeInfo,
      actInfo,
    } = this.data;
    return new Promise((resolve, reject) => {
      // rankList14(params).then(res => {
      rankListGz16(params).then(res => {
        let {
          data
        } = res;
        if (data && data.list.length) {
          data.list.forEach(item => {
            // 根据当前店铺信息判断是否同一个店铺：uid == uid
            if (storeInfo && storeInfo.uid != item.uid) {
              item.shop_name = utils.replaceSecStar(item.shop_name);
            } else {
              item.class_name = 'list-item-own'
            }
            if (item.end_time) {
              item.end_time = utils.parseTime(new Date(item.end_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}.{m}.{d} {h}:{i}:{s}")
            } else {
              item.end_time = '';
            }
          })
        }
        res.data = data;
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  async getData(type='loadmore') {
    let {
      rankList,
      actInfo,
      storeInfo
    } = this.data;
    try {
      //用户排名在100以后并且页数等于10:请求另一个接口，获取当前用户前5后5条数据
      // if (actInfo && actInfo.rank > 100 && rankList.length > 99 && type =='loadmore') {
      //   let rankAsgRes = await rankAsg14();
      //   let {code,data} = rankAsgRes;
      //   if (code == 1) {
      //     let newlist = [];
      //     data.forEach(item => {
      //       if (storeInfo && storeInfo.uid != item.uid) {
      //         item.shop_name = utils.replaceSecStar(item.shop_name);
      //       }
      //       // 100名以后的前五后五上榜用户，对比前100名列表去重
      //       if (!rankList[item.rank - 1]) {
      //         newlist.push(item);
      //       }

      //     });
      //     console.log("newlist:", newlist)
      //     log.addFilterMsg('rankAsg')
      //     log.info("rankAsg res:", res)
      //     log.info("newlist:", newlist)
      //     this.setData({
      //       myRankList: newlist,
      //       noMore: true,
      //       loadMore: false
      //     })
      //   } else {
      //     this.setData({
      //       noMore: true,
      //       loadMore: false
      //     })
      //   }
      //   return
      // }
      let res = await this.getList(params);
      wx.stopPullDownRefresh();
      if (res.code == 1) {
        let {
          next,
          list,
          limit
        } = res.data;
        params.next = next || 1;
        console.log(res.data)
        if (type == 'refresh') {
          this.setData({
            rankList: list || [],
            myRankList: [],
            noMore: (list || []).length < limit
          });
        } else {

          this.setData({
            rankList: rankList.concat(list),
            noMore: (list || []).length < limit
          });
        }
      } else {
        this.setData({
          noMore: true,
        });
      }
    } catch (err) {
      console.log("getData err:", err);
      log.addFilterMsg('getDataCatch');
      log.info('catch err:',err)
      if(err.msg){
        wx.showModal({
          title: '温馨提示',
          content: err.msg,
          showCancel:false
        })
      }
    }
  },
  onPageScroll(event){
    let {scrollTop} = event;
    if(scrollTop>600){
      let {iconTheme} = this.data;
      if(iconTheme=='black')return;
      this.setData({
        iconTheme:'black'
      })
    }else{
      let {iconTheme} = this.data;
      if(iconTheme=='white')return;
      this.setData({
        iconTheme:'white'
      })
    }
  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})