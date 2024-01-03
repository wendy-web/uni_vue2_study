// pages/storeRank//djRecord.js
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
    rankList: false, //排行榜列表
    loadMore: false, //正在加载更多
    noMore: false,
    myRankInfo: false, //我的排名信息
    rankBgImg: '', //背景图
    navBarSystem: {
      navBarHeight: 44,
      statusBarHeight: 20
    },
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
    utils.getNavbarData().then(res => {
      console.log("getNavbarData:", res);
      if (res) {
        this.setData({
          navBarSystem: res,
        })
      }
      console.log("自定义导航栏：", this.data.navBarSystem)
    });
    try {
      let storeInfo = wx.getStorageSync('storeInfo') || await utils.getShopInfo(false);
      this.setData({
        storeInfo
      })
      this.getMyRank();

      this.getData('refresh');
    } catch (error) {
      console.log("onLoad catch:",error)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  async onReady() {

  },
  getMyRank: function () {
    let that = this;
    unbox_getInfo().then(res => {
      let {
        code,
        data,
        msg
      } = res;
      if (code == 1) {
        this.setData({
          myRankInfo: data
        })
        // this.getData('refresh');
      } else {

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
      }

    })

  },
  getRankList: function (param, mask = true) {
    let that = this;
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
          // res.data.list = data.list.filter(item=>item.card_count>=myRankInfo.kpi_1);
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
  getData: function (type) {
    let that = this;
    let param = {};
    let {
      myRankInfo,
      storeInfo,
      rankList
    } = this.data
    if (type == 'refresh') {
      // param.issues = 1; //一期活动
      param.next = 1; 
      param.limit = 20; 
      that.getRankList(param).then(res => {
        console.log("getRankList:", res);
        wx.stopPullDownRefresh({
          success: (res) => {},
        })
        if (res.code == 1) {
          let {
            next,
            list,
            limit
          } = res.data;
          _nextOne = next;

          that.setData({
            rankList: list,
            myRankList: [],
            noMore: list.length < limit

          })
        } else {
          this.setData({
            noMore: true
          })
        }
        that.setData({
          refreshed: false
        })
      }).catch(err => {
        console.log("refresh err:", err)
      })

    } else {
      //加载更多
      param.next = _nextOne; //一期活动
      param.limit = 20; 
      //用户排名在100以后并且页数等于10:请求另一个接口，获取当前用户前5后5条数据
      if (myRankInfo && myRankInfo.rank > 100 && rankList.length > 99) {
        unbox_rankAsg().then(res => {
          console.log("unbox_rankAsg:", res);
          if (res.code == 1) {
            let newlist = [];
            res.data.forEach(item => {
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
        }).catch(err => {
          log.addFilterMsg('rankAsgErr')
          log.info("rankAsg err:", err)
        });

        return
      }

      that.getRankList(param, false).then(res => {
        console.log("getRankList More:", res);
        if (res.code == 1) {
          _nextOne = res.data.next;
          let {
            limit,
            list = []
          } = res.data;
          console.log("list.length>=limit:", list.length >= limit)
          that.setData({
            rankList: rankList.concat(list),
            loadMore: false,
            noMore: list.length < limit
          })
        } else {
          that.setData({
            noMore: true,
            loadMore: false
          })
        }

      }).catch(err => {
        log.setFilterMsg('getRankList')
        log.info("getRankList more err:", err)
        console.log("err:", err)
      })
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
  async onShow() {
    let that = this;

    let systemInfo = app.globalData.systemInfo;
    if (systemInfo) {
      let screenHeight = systemInfo.windowHeight;
      this.setData({
        screenHeight: screenHeight,
      });
    }
    utils.getNavbarData().then(res => {
      console.log("getNavbarData:", res);
      if (res) {
        that.setData({
          navBarSystem: res,
        })
      }
    });





  },
  imgLoadError: function (e) {
    let name = e.currentTarget.dataset.name;
    if (name == "rankBg") {
      this.setData({

      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    _nextOne = 1;
  },
  // pull-refresh组件触发：pageNum:1刷新||加载更多，endError,endSuccess:失败成功回调
  loadData(event) {
    console.log("loadData:", event)
    let {
      pageNum,
      endError,
      endSuccess
    } = event.detail;
    // 取当前记录的页码
    let {
      pageNext
    } = this.data;
    // 第一页：重置数据
    if (pageNum == 1) {
      pageNext = 1;
      this.setData({
        rankList: [],
        myRankList: []
      })
    }
    let {
      rankList: list,
      myRankInfo,
      storeInfo
    } = this.data;
    // 请求参数
    let param = {
      next: pageNum
    }
    // 超过100条数据
    //用户排名在100以后并且页数等于10:请求另一个接口，获取当前用户前5后5条数据
    if (myRankInfo && myRankInfo.rank > 100 && list.length > 99) {
      unbox_rankAsg().then(res => {
        console.log("/api/act/rankasg:", res);
        if (res.code == 1) {
          let newlist = [];
          res.data.forEach(item => {
            if (storeInfo && storeInfo.uid != item.uid) {
              item.shop_name = utils.replaceSecStar(item.shop_name);
            }
            // 100名以后的前五后五上榜用户，对比前100名列表去重
            if (!list[item.rank - 1]) {
              newlist.push(item);
            }
          });
          this.setData({
            myRankList: newlist,
          })
        }
        /**成功回调 */
        endSuccess(0, pageNum)
      }).catch(err => {
        // 加载失败回调
        endError()
      });
      return
    }
    // 前100条数据
    if (myRankInfo) {
      param.kpi_num = myRankInfo.kpi_num;
    }
    unbox_rankList(param, true).then(res => {
      let {
        data,
        code
      } = res;
      if (data && data.list.length) {
        pageNext = data.next
        data.list.forEach(item => {
          // 根据当前店铺信息判断是否同一个店铺：uid == uid
          if (storeInfo && storeInfo.uid != item.uid) {
            item.shop_name = utils.replaceSecStar(item.shop_name);
          } else {
            item.class_name = 'list-item-own'
          }
          item.end_time = utils.parseTime(new Date(item.end_time.replace(new RegExp(/-/gm), '/')).getTime(), "{y}.{m}.{d} {h}:{i}:{s}")
        })
        this.setData({
          rankList: list.concat(data.list),
          pageNext
        })
      }
      if (code == 0 && list.length) {
        endSuccess(1, pageNum)
        return
      }
      /**成功回调 */
      let size = data && data.list.length || 0;
      console.log("length:", size, pageNum)
      endSuccess(size, pageNum)
    }).catch(err => {
      console.log(err)
      // 加载失败回调
      endError()
    });
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
  onPullDownRefresh: function () {
    // this.refresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom")
    // this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})