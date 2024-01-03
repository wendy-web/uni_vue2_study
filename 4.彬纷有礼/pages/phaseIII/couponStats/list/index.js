// pages/phaseIII/couponStats/index/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
// 已过期-折扣券-传参 
var params = {
  start_time: "",
  end_time: "",
  arg: "", // 产品类型参数
};
import utils from '../../../../utils/util';
import {
  otherCount,
  getSkuParam,
  accumCount
} from '../../../../api/coupon/index';
import {
  getRecentDaysStartAndEnd
} from '../component/filterPop/utils';

import {
  initDateRange,
  initBrandType
} from '../component/filterPop/config';
const defaultParamsObj = {
  selectDate: null,
  goodTypeArr: null
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconTheme: 'black', //顶部导航栏图标默认白色
    background: '#ffffff',
    isBackBtn: false, // 设置是否显示回到顶部按钮
    defaultSetting: {
      shake: true,
      style: 'black', // 设置圆点申诉还是浅色
      background: {
        color: '#ffffff',
      },
    },
    dateRangeArr: JSON.parse(JSON.stringify(initDateRange)), // 近X日
    brandTypeArr: JSON.parse(JSON.stringify(initBrandType)), // 品牌类型
    skuParams: [], //产品类型
    file_url_9m: `${COS_URL}/public/img/bfyl/2023/09`, //23年9月 cos图片资源
    total_toggle: false, //累计获得折叠
    ky_toggle: false, // 可用卡券折叠
    lj_use_toggle: false, // 累计使用折叠
    hxing_toggle: false, // 核销中折叠
    expire_toggle: false, // 已过期折叠
    not_today_filter: false, //不是今日的筛选条件，默认false, 有时间筛选且不是今日为true, 累计活动模块文字颜色改变
    totalReward: {}, //累计获得
    otherCount: {}, // 其它统计
    filterPopArr: [], //弹窗筛选的条件数组，2023年9月22日 重构点击各种条件时候的参数
    innerBoxHeight: '', // scroller组件高度
    // 通对象来存储筛选弹窗的条件
    filterPopObj: JSON.parse(JSON.stringify(defaultParamsObj)),
    paramsObj: JSON.parse(JSON.stringify(defaultParamsObj)),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let query = this.createSelectorQuery().in(this);
    query.select('#innerbox').boundingClientRect()
    query.exec(res => {
      let item = res[0] || '';
      if (item && item.id == 'innerbox') {
        this.setData({
          innerBoxHeight: item.height
        })
      }
    })
    this.initData();
  },
  initData() {
    // 初始化近X日参数
    this.initDateRange('dateRangeArr');
    // 初始化产品参数
    this.initSkuParam();
    // 首次进入页面，默认传参今天的起止时间参数
    let {
      dateRangeArr
    } = this.data;
    let obj = ''
    dateRangeArr.forEach(item => {
      if (item.checked) {
        obj = item;
      }
    })
    let paramsObj = JSON.parse(JSON.stringify(defaultParamsObj));
    let _obj = JSON.parse(JSON.stringify(obj));
    paramsObj.selectDate = {
      ..._obj
    }
    this.setData({
      paramsObj,
    })
    this.refresh();
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
  // 点击tab
  tabChange(event) {
    let {
      id
    } = event.currentTarget.dataset;
    let {
      dateRangeArr,
    } = this.data;
    dateRangeArr.forEach(item => {
      if (item.id == id) {
        item.checked = true;
      } else {
        item.checked = false
      }
    })
    this.setData({
      dateRangeArr,
    })
    this.afterTabChange();

  },
  // 点击tab以后重置请求参数
  afterTabChange() {
    let {
      dateRangeArr,
      paramsObj,
      filterPopObj
    } = this.data;
    let selectDate = dateRangeArr.find(item => item.checked === true);
    let _select_date = JSON.parse(JSON.stringify(selectDate));
    paramsObj.selectDate = _select_date
    // filterPopArr 里面的参数需要去掉
    let find_filter_date = JSON.parse(JSON.stringify(filterPopObj.selectDate));
    filterPopObj.selectDate = null;
    if (find_filter_date) {
      this.selectComponent("#filterPop").deleteTag(find_filter_date);
    }
    this.setData({
      paramsObj,
      filterPopObj
    })
    this.refresh();
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
  // 下拉刷新
  async refresh(event) {
    try {
      params.start_time = '';
      params.end_time = '';
      params.arg = '';
      let {
        not_today_filter,
        paramsObj
      } = this.data;
      not_today_filter = false; // 默认false，防止清空时间，上一次的true还保留（累计获得会显示红色）

      let {
        selectDate,
        goodTypeArr
      } = paramsObj;
      if (selectDate) {
        params.start_time = selectDate.start_time;
        params.end_time = selectDate.end_time;
        if (selectDate.label != '今日' && selectDate.start_time && selectDate.end_time) {
          not_today_filter = true;
        } else {
          not_today_filter = false;
        }
      }
      if (goodTypeArr) {
        // 更新卡券类型参数
        params.arg = goodTypeArr.arg;
      }
      console.log("请求传参params:", params)
      // 累计获得
      let res = await accumCount(params);
      // 其它统计
      let otherRes = await otherCount({
        arg: params.arg
      })
      let {
        code,
        data
      } = res;
      let {
        code: _code,
        data: _data
      } = otherRes;
      if (code == 1 || _code == 1) {
        this.setData({
          totalReward: data,
          otherCount: _data,
          isEmpty: false,
          not_today_filter
        })
        // 计算每个类型的总数
        this.calcTotalCount();
        return
      }
      if (code == 0) {
        this.setData({
          isEmpty: true,
          totalReward: [],
          not_today_filter
        })
      }
    } catch (error) {
      console.log("卡券统计 refresh catch：", error);
    }
  },
  // 显示条件筛选弹窗：活动券 actType默认4
  showFilterPop() {
    this.selectComponent('#filterPop').showFilterPop();
  },
  // 接收筛选条件，筛选列表
  initFilterData(event) {
    let {
      filterArr = []
    } = event.detail;
    console.log("卡券统计  收到了筛选条件：", JSON.stringify(filterArr));
    // 先把固定选中的产品类型置空，如果有筛选产品类型并且和固定的相同时候再选中····
    let {brandTypeArr,paramsObj} = this.data;
    brandTypeArr.forEach(itm => {
      itm.checked = false;
    })
    // 还有产品类型参数也置空，有筛选产品类型时候再赋值
    paramsObj.goodTypeArr = null;
    this.setData({
      brandTypeArr,
      paramsObj
    })
    // 先重置掉已经选择的固定tab
    this.initSelectedFilter(filterArr);


  },
  // 删除的标签， 传参给filterPop 去处理
  deleteTag(event) {
    let {
      name = ''
    } = event.currentTarget.dataset;
    let {
      filterPopObj,
      paramsObj
    } = this.data;
    this.selectComponent("#filterPop").deleteTag(filterPopObj[name]);
    filterPopObj[name] = null;
    paramsObj[name] = null;
    // 如果删除的是日期，需要重置为今天的日期,并且重置自定义时间高亮效果
    if (name == 'selectDate') {
      console.log("需要重置今日日期了和自定义的高亮了·········");
      this.initDateRange('dateRangeArr');
      let {
        dateRangeArr,
      } = this.data;
      dateRangeArr.forEach(item => {
        if (item.checked) {
          paramsObj[name] = JSON.parse(JSON.stringify(item));
        }
      })
    }
    this.setData({
      paramsObj,
      filterPopObj
    })
    // 刷新列表
    this.refresh();
  },
  // 初始化 日期区间范围
  initDateRange(name) {
    let dateRange = this.data[name];
    dateRange.forEach(item => {
      item.name = 'selectDate';
      let res = '';
      let day = item.days
      if (day < 0) {
        let days = Math.abs(day);
        res = getRecentDaysStartAndEnd(days, day)
      } else {
        res = getRecentDaysStartAndEnd(day)
      }
      let {
        start,
        end
      } = res;
      item.start_time = start;
      item.end_time = end;
      if (item.label === '今日') {
        item.checked = true;
      } else {
        item.checked = false;
      }
    })
    this.setData({
      [name]: dateRange
    })
  },
  // 初始化产品类型参数
  async initSkuParam() {
    try {
      let res = await getSkuParam();
      let {
        code,
        data
      } = res;
      if (code == 1) {
        this.setData({
          skuParams: data
        })
      }
    } catch (error) {
      console.log("initSkuParam catch：", error)
    }
  },
  // 弹窗筛选的条件，需要初始化固定的tab 选中状态
  initSelectedFilter(filterArr) {
    let {
      dateRangeArr,
      brandTypeArr,
      paramsObj
    } = this.data;
    let filterPopObj = JSON.parse(JSON.stringify(defaultParamsObj));

    // 先判断一下数组不为空：有可能没选条件 空数组
    if (filterArr.length) {
      filterArr.forEach(item => {
        // 有时间筛选
        if (item.name.search('selectDate') > -1 || item.name.search('dateRange') > -1) {
          dateRangeArr.forEach(itm => {
            itm.checked = false
          })
          item.name = 'selectDate';
          filterPopObj.selectDate = item;
          paramsObj.selectDate = item;
        }
        // 产品类型:有重复的filterArr这一项就不能显示了：比如选的是红牛 战马···
        if (item.name.search('goodTypeArr') > -1) {
          filterPopObj.goodTypeArr = item;
          paramsObj.goodTypeArr = item;
          brandTypeArr.forEach(itm => {
            if (itm.label == item.label) {
              itm.checked = true;
              filterPopObj.goodTypeArr = null;
            } else {
              itm.checked = false;
            }
          })
        }
      })
      
      // 把自定义筛选的条件，赋值给请求接口的参数 paramsObj
      this.setData({
        dateRangeArr,
        brandTypeArr,
        paramsObj,
        filterPopObj,
      })

      //请求刷新列表
      this.refresh()
      return
    }
    this.setData({
      filterPopObj,
    })
    // 没有筛选条件,重置为今天
    this.initData();

  },
  // 返回上一页：失败情况返回首页
  back() {
    wx.navigateBack({
      delta: 0,
      fail(err) {
        wx.navigateTo({
          url: '/pages/phaseIII/useCoupon/index/index',
        })

      }
    })
  },
  // 选择卡券类型
  selectGoodType(event) {
    let {
      arg
    } = event.currentTarget.dataset;
    let {
      brandTypeArr,
      paramsObj,
      filterPopObj
    } = this.data;
    let _item = ''
    brandTypeArr.forEach(item => {
      if (item.arg == arg) {
        item.checked = !item.checked;
        _item = item;
      } else {
        item.checked = false
      }
    })
    if (_item) {
      paramsObj.goodTypeArr = JSON.parse(JSON.stringify(_item));
      paramsObj.goodTypeArr.arg = _item.checked ? _item.arg : '';
    } else {
      paramsObj.goodTypeArr = null;
    }
    this.selectComponent("#filterPop").replaceGoodTypeItem(_item);
    filterPopObj.goodTypeArr = null;
    this.setData({
      brandTypeArr,
      paramsObj,
      filterPopObj
    })
    // 更新列表
    this.refresh();
  },
  // 折叠
  toggleChange(event) {
    let {
      name
    } = event.currentTarget.dataset;
    let toggle = this.data[name];
    this.setData({
      [name]: !toggle
    })
  },
  // 重置品牌类型选中
  resetBrandType(event) {
    let {
      brandTypeArr
    } = this.data;
    brandTypeArr.forEach(item => {
      item.checked = false;
    })
    this.setData({
      brandTypeArr
    })
  },
  // 打开页面
  openPage(event) {
    const {
      url = '',
        type = ''
    } = event.currentTarget.dataset;
    if (!url) return;
   
    let _param = {};
   
    let {selectDate='',goodTypeArr=''} = this.data.paramsObj;
    if (selectDate) {
      _param.start_time = selectDate.start_time;
      _param.end_time = selectDate.end_time;
    }
    if(goodTypeArr){
      _param.arg = goodTypeArr.arg;
    }
    _param.opentype = type;
    let params = `?params=${encodeURIComponent(JSON.stringify(_param))}`;
    utils.navigateFrequentPage(url, params)
  },
  // 计算每个类型的总数
  calcTotalCount() {
    let {
      totalReward = '', otherCount = ''
    } = this.data;
    if (totalReward) {
      totalReward = this.calcTotalItem(totalReward);
    }
    if (otherCount) {
      let {
        expired,
        inuse,
        usable,
        used
      } = otherCount;
      expired = this.calcTotalItem(expired);
      inuse = this.calcTotalItem(inuse);
      usable = this.calcTotalItem(usable);
      used = this.calcTotalItem(used);
      otherCount = {
        expired,
        inuse,
        usable,
        used
      };
      this.setData({
        expired,
        inuse,
        usable,
        used
      });
    }
    this.setData({
      totalReward,
      otherCount
    });
  },
  // 计算单个类型的总数
  calcTotalItem(item) {
    if (item) {
      let {
        act,
        dis,
        exc
      } = item;
      let {
        exc_num,
        exc_jl,
        exc_dhq
      } = exc;
      let total = act.act_num + dis.dis_num + exc_num + exc_jl + exc_dhq;
      item.total = total;
      exc.total = exc_num + exc_jl + exc_dhq;
      item.exc = exc;
    }
    return item
  },
  // 重置条件刷新
  resetRefresh() {
    // 初始化近X日参数
    this.initDateRange('dateRangeArr');
    let paramsObj = JSON.parse(JSON.stringify(defaultParamsObj));
    this.setData({
      paramsObj,
    })
    // 重置filterPop 里面的参数
    this.selectComponent("#filterPop").resetFilter();

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