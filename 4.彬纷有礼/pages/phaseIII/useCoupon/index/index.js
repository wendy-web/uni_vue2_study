// pages/phaseIII/useCoupon/index/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
import utils from '../../../../utils/util';
import {
  groupCount
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
        color: '#f4f4f4',
      },
    },

    emptySetting: {
      img: `${COS_URL}/public/img/bfyl/2023/09/img_nodata.png`,
      text: '暂无卡券信息'
    },
    file_url_9m: `${COS_URL}/public/img/bfyl/2023/09`, //23年9月 cos图片资源
    couponList: [], //卡券列表
    initDate: '', //更新时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.initData();
  },
  async initData() {
    try {
      let res = await groupCount();
      let {
        code,
        data
      } = res;
      if (code == 1) {
        let couponList = data.list;
        couponList.forEach(item => {
          let {
            day_7,
            day_15,
            day_30
          } = item;
          item.day_total = day_7 + day_15 + day_30;
        });
        this.setData({
          initDate: data.date,
          couponList,
          isEmpty: false
        })
        return
      }
      this.setData({
        isEmpty: true
      })
    } catch (error) {
      console.log("initData catch:", error);
    }
  },
  openPageParam(event) {
    const {
      url = '',
      params = '',
    } = event.currentTarget.dataset;
    let encodeParams = encodeURIComponent(JSON.stringify(params));
    let str = `?couponInfo=${encodeParams}`;
    if (!url) return;
    utils.navigateFrequentPage(url, str)
  },
  loadmore() {
    console.log('此页面无加载的····');
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


})