// 排行榜榜单
let app = getApp();
const storeRankNum = app.globalData.storeRankNum;
const utils = require('../../../utils/util');
const log = require('../../../utils/log')
import {
  COS_URL
} from '../../../utils/http'
let _nextOne = 1;
import {
  // myRank,
  // rankList,
  // rankAsg,
  unbox_getInfo,
  unbox_rankList,
  unbox_rankAsg
} from '../../../api/storeRank/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refreshed: false, //下拉刷新未触发
    rankList: [], //排行榜列表
    loadMore: false, //正在加载更多
    noMore: false,
    myRankInfo: null, //我的排名信息
    navBarSystem: {
      navBarHeight: 44,
      statusBarHeight: 20
    },
    screenHeight: null, //屏幕高度
    storeRankNum: storeRankNum, //店铺排行榜上榜人数
    storeInfo: null,
    text_rank: `${COS_URL}/public/img/storeRank/202304/text_rank.png`, // 文字：排名
    text_shop_name: `${COS_URL}/public/img/storeRank/202304/text_shop_name.png`, // 文字：门店名称
    text_exc_num: `${COS_URL}/public/img/storeRank/202304/text_exc_num.png`, // 文字：兑奖人数
    myRankList: [], //我的排名信息：100后的前五后五信息
    pageNext: 1, // 下一页
    img_cos_url:`${COS_URL}/public/img/bfyl/2023/08/img`,//原有images静态文件移到cos上
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    try {
      let navBarSystem = await utils.getNavbarData();
      let storeInfo = wx.getStorageSync('storeInfo') || await utils.getShopInfo(false);
      this.setData({
        navBarSystem,
        screenHeight: navBarSystem.screenHeight,
        storeInfo
      })
      this.getMyRank();
      this.getData('refresh');
    } catch (error) {
      console.log("onLoad catch:", error)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  // 获取我的排行榜信息
  async getMyRank() {
    try {
      let {
        code,
        data,
        msg
      } = await unbox_getInfo();
      if (code == 1) {
        this.setData({
          myRankInfo: data
        })
        return
      }
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
    } catch (error) {
      console.log("getMyRank error:", error)
    }

  },
  // 获取排行榜列表数据
  getRankList(param, mask = true) {
    let {
      storeInfo,
      myRankInfo
    } = this.data;
    if (myRankInfo) {
      param.kpi_num = myRankInfo.kpi_num;
    }
    return new Promise(function (resolve, reject) {
      unbox_rankList(param, mask).then(res => {
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
            item.end_time = utils.parseTime(new Date(item.end_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}.{m}.{d} {h}:{i}:{s}")
          })
        }
        resolve(res)
      }).catch(err => {
        reject(err)
      });
    })
  },
  async getData(type) {
    let that = this;
    let param = {};
    param.limit = 20;
    let {
      myRankInfo,
      storeInfo,
      rankList
    } = this.data
    try {
      if (type == 'refresh') {
        _nextOne = 1;//重置下一页
        rankList = [];
        this.setData({
          myRankList:[],
          rankList
        })
      }
      param.next = _nextOne;
      param.limit = 20;
      //用户排名在100以后并且页数等于10:请求另一个接口，获取当前用户前5后5条数据
      if (myRankInfo && myRankInfo.rank > 100 && rankList.length > 99) {
        let {code,data} = await unbox_rankAsg();
        
        if (code == 1) {
          let newlist = [];
          data.forEach(item => {
            if (storeInfo && storeInfo.uid != item.uid) {
              item.shop_name = utils.replaceSecStar(item.shop_name);
            }
            // 100名以后的前五后五上榜用户，对比前100名列表去重
            if (!rankList[item.rank - 1]) {
              newlist.push(item);
            }

          });
          console.log("newlist:", newlist)
          log.addFilterMsg('rankAsg')
          log.info("rankAsg res:", res)
          log.info("newlist:", newlist)
          that.setData({
            myRankList: newlist,
            noMore: true,
            loadMore: false
          })
        } else {
          that.setData({
            noMore: true,
            loadMore: false
          })
        }
        return
      }


      let {
        code,
        data
      } = await this.getRankList(param);
      if (code == 1) {
        let {
          next,
          list = [],
          limit
        } = data;
        //赋值下一页参数
        _nextOne = next;
        this.setData({
          rankList: list,
          rankList: rankList.concat(list),
          noMore: list.length < limit
        })
      } else {
        this.setData({
          noMore: true,
        })
      }
      this.setData({
        loadMore: false,
        refreshed: false
      })
      return

    } catch (error) {
      this.setData({
        loadMore: false,
        refreshed: false
      })
      console.log("getData error:", error)
      log.setFilterMsg('getRankList')
      log.info("getRankList err:", error)
    }
  },
  refresh: function () {
    console.log('refresh');
    this.getMyRank();
    this.getData('refresh');
  },
  loadMore: function () {
    console.log('loadMore');
    if (this.data.noMore) return;
    if (this.data.loadMore) return;
    this.setData({
      loadMore: true
    })

    setTimeout(() => {

      this.getData('loadMore')
    }, 30);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    _nextOne = 1;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  onBeforeBack: function () {
    wx.navigateBack({
      delta: 0,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom")
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})