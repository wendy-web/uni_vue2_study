// pages/phaseIII/couponStats/detail/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
// 可用卡券：活动券-传参
var dis_params = {
  status:3, // 1未使用，2已过期，3全部
  next:1,
  arg:'',// 产品类型
  start_time:'',
  end_time:'',
};
var act_params = {
  status:3, // 1未使用，2已过期，3全部
  next:1,
  arg:'',// 产品类型
  start_time:'',
  end_time:'',
}

let _refresh_times = 0; // 请求成功+1,大于0的时候，trigger 父页面 刷新统计接口

import {
  discountList, // 折扣券
  act4List, // 活动券
} from '../../../../api/coupon/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: '#2e2e2e',
    isBackBtn: false, // 设置是否显示回到顶部按钮
    isEmpty: false, // 设置是否为空数据
    couponList: [], // 列表数据
    defaultSetting: {
      shake: true,
      style: 'black', // 设置圆点申诉还是浅色
      background: {
        color: '#ffffff',
      },
    },
    loadMoreSetting: {
      status: "more",
      more: {
        text: '上拉加载更多',
        color: '#999',
      },
      loading: {
        text: '加载中...',
        color: '#999',
      },
      noMore: {
        text: '~ 没有更多记录了~',
        color: '#999',
      },
      color: "#999",
    },
    emptySetting: {
      img: 'https://file.y1b.cn/public/img/bfyl/202208/img_empty.png',
      text: ''
    },
    file_url_9m: `${COS_URL}/public/img/bfyl/2023/09`, //23年9月 cos图片资源
    opentype:1,// 默认1，折扣券，2活动券
    hnTitle: app.globalData.hnTitle,
    hnTitleBlue: app.globalData.hnTitleBlue,
    zmTitle: app.globalData.zmTitle,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initOptions(options)
  },
  initOptions(options) {
    let {
      params
    } = options;
    params = JSON.parse(decodeURIComponent(params));
    let {opentype} = params;
    let title = opentype == 1 ? '折扣券详情' : '活动券详情';
    wx.setNavigationBarTitle({
      title,
    })
    this.setData({
      opentype,
      params
    })
    if(opentype==1){
      this.refreshDis()
    }else{
      this.refreshAct()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  // 下拉刷新
  refreshList(){
    let {opentype} = this.data;
    if(opentype==1){
      this.refreshDis()
    }else{
      this.refreshAct()
    }
  },
  // 下拉刷新 折扣券
  async refreshDis(event) {
    try {
      dis_params.next=1;
      dis_params.start_time ='';
      dis_params.end_time = '';
      dis_params.arg = '';
      let {
        loadMoreSetting,
        params
      } = this.data;
      if(params.start_time&&params.end_time){
        dis_params.start_time = params.start_time;
        dis_params.end_time = params.end_time;
      }
      if(params.arg){
        dis_params.arg = params.arg;
      }
      console.log("折扣券传参:",dis_params);
      let res = await discountList(dis_params);
      _refresh_times++;
      let {
        code,
        data
      } = res;
      let {
        next,
        list,
      } = data;

      if (code == 1) {
        dis_params.next = next || 1;
        loadMoreSetting.status = 'noMore'
        
        this.setData({
          couponList: list,
          loadMoreSetting,
          isEmpty: false,
        })
        return
      }
      if (code == 0) {
        this.setData({
          isEmpty: true,
          couponList: [],
        })
      }
    } catch (error) {
      console.log("活动券列表refresh catch：", error);
    }
  },
  //下拉刷新 活动券
  async refreshAct(event) {
    try {
     
      let {
        loadMoreSetting,
        params,
        hnTitle,
        hnTitleBlue,
        zmTitle,
      } = this.data;
      if(params.start_time&&params.end_time){
        act_params.start_time = params.start_time;
        act_params.end_time = params.end_time;
      }
      if(params.arg){
        act_params.arg = params.arg;
      }
      let res = await act4List(act_params);
      _refresh_times++;
      let {
        code,
        data
      } = res;
      let {
        next,
        list,
      } = data;

      if (code == 1) {
        act_params.next = next || 1;
        loadMoreSetting.status = 'noMore'
        // 判断标题
        list.forEach(item => {
          item.couponTitle = hnTitle;
          if (item.prizeratetype == 105) {
            item.couponTitle = zmTitle
          }
          if (item.prizeratetype == 112) {
            item.couponTitle = hnTitleBlue
          }
        })
        this.setData({
          couponList: list,
          loadMoreSetting,
          isEmpty: false,
        })
        return
      }
      if (code == 0) {
        this.setData({
          isEmpty: true,
          couponList: [],
        })
      }
    } catch (error) {
      console.log("活动券列表refresh catch：", error);
    }
  },
  // 上拉加载更多：折扣券才有，活动券无分页
  async loadmore(event) {
    let {
      loadMoreSetting,
      couponList,
      opentype
    } = this.data;
    // 活动券不分页
    if(opentype==2)return;
    try {
      // 判断当前是否为加载状态 防止页面重复添加数据
      if (loadMoreSetting.status !== 'loading') {
        loadMoreSetting.status = 'loading'
        this.setData({
          loadMoreSetting,
        })
        let res = await discountList(dis_params);
        let {
          code,
          data
        } = res;
        let {
          limit = 10,
            next,
            list = [],
        } = data;
        let nomore = list?.length < limit ? true : false;
        if (code == 1) {
          dis_params.next = next;
          loadMoreSetting.status = 'more';
          // 合并数据
          this.setData({
            couponList: couponList.concat(list),
            loadMoreSetting
          })
        }
        if (code == 0 || nomore) {
          loadMoreSetting.status = 'noMore'
          this.setData({
            loadMoreSetting
          })
        }

      }
    } catch (error) {
      console.log("loadmore catch:", error)
    }

  },
  // scroller组件 内容高度
  contentHeight(event){
    // console.log("contentHeight:",event)
    
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
    dis_params.next=1;
    act_params.next=1;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom() {

  // },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage() {

  // }
})