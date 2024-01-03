// pages/phaseIII/useCoupon/component/discountItem/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
// 已过期-折扣券-传参 
var params = {
  start_time: "",
  end_time: "",
  next: 1,
  arg: '', 
};

let _refresh_times = 0; // 请求成功+1,大于0的时候，trigger 父页面 刷新统计接口
const log = require("../../../../../utils/log");
import {
  discountList
} from '../../../../../api/coupon/index';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    actCount: {
      type: Object,
      value: {
        total_unsed: 0,
      }
    }
  },

  /**
   * 组件的初始数据
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
      status: "noMore",
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
    exc_hn_rule: 'https://file.y1b.cn/public/img/bfyl/202302/img_hn_consumer_rule_28y.png',
    filterArr: [], //筛选条件
    hnTitle: app.globalData.hnTitle,
    hnTitleBlue: app.globalData.hnTitleBlue,
    zmTitle: app.globalData.zmTitle,
    file_url_9m: `${COS_URL}/public/img/bfyl/2023/09`, //23年9月 cos图片资源
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 下拉刷新
    async refresh(event) {
      try {
        if (_refresh_times > 0) {
          this.triggerEvent('initCount')
        }
        params.next = 1;
        params.start_time = '';
        params.end_time = '';
        params.arg = '';
        let {
          loadMoreSetting,
          filterArr,
          hnTitle,
          hnTitleBlue,
          zmTitle
        } = this.data;
        // 有筛选条件的情况
        let crewArr = [];
        if (filterArr.length) {
          filterArr.forEach(item => {
            // 时间筛选
            if (item.name.search('dateRange_') > -1 || item.name.search('selectDate_') > -1) {
              params.start_time = item.start_time;
              params.end_time = item.end_time;
            }
            // 产品类型
            if (item.name.search('goodTypeArr_') > -1) {
              // 更新卡券类型参数
              params.arg = item.arg;
            }
          })
        }
        console.log("params:", params)
        let res = await discountList(params);
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
          params.next = next || 1;
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
    // 上拉加载更多
    async loadmore(event) {
      let {
        loadMoreSetting,
        couponList
      } = this.data;
      try {
        // 判断当前是否为加载状态 防止页面重复添加数据
        if (loadMoreSetting.status !== 'loading') {
          loadMoreSetting.status = 'loading'
          this.setData({
            loadMoreSetting,
          })
          let res = await discountList(params);
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
            params.next = next;
            loadMoreSetting.status = 'more';
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

        console.log("已过期-折扣券 loadmore catch:", error)
      }

    },

    // 显示条件筛选弹窗：活动券 actType默认4
    showFilterPop() {
      this.triggerEvent('showFilterPop', {
        type: 4
      });
    },
    // 接收筛选条件，筛选列表
    initFilterData(event) {
      console.log("已过期-折扣券  列表收到了筛选条件：", event)
      let {
        filterArr = []
      } = event;
      // 有筛选 筛选条件的时候更新传参，刷新列表数据
      this.setData({
        filterArr
      })

      //请求刷新列表
      this.refresh()
    },
    // 删除筛选条件，传递给父组件
    deleteTag(event) {
      let {
        id
      } = event.currentTarget.dataset;
      let {
        filterArr
      } = this.data;
      let findIdx = filterArr.findIndex(item => item.id == id);
      if (findIdx > -1) {
        let findItem = filterArr[findIdx];
        console.log("活动券 列表所删除的标签:", findItem);
        filterArr.splice(findIdx, 1)
        // 此处需要删掉对应标签，刷新列表
        this.setData({
          filterArr
        })
        this.triggerEvent('deleteTag', {
          item: findItem
        });
        // 刷新列表
        this.refresh();
      }
    },
 
  },
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached() {
      // 初始化列表数据
      _refresh_times = 0;
      params.start_time = '';
      params.end_time = '';
      params.arg='';

      this.refresh()

    },
    // 在组件实例被从页面节点树移除时执行
    detached: function () {
      params.start_time = '';
      params.end_time = '';
      params.next = 1;
      params.arg='';
      _refresh_times = 0;
    },
  },
  pageLifetimes: {
    // 页面被展示
    show: function () {},
    // 页面被隐藏
    hide: function () {

    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }
})