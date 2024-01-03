// pages/voucher/component/excItemHn/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
// 可用卡券：换购券-红牛传参
var params = {
  next: 1,
  check_status: 0,
  exp_status: 0,
  open: 3,
  start_time: "",
  end_time: "",
  exc_arg:""
};
let _refresh_times = 0; // 请求成功+1,大于0的时候，trigger 父页面 刷新统计接口
let _voucherExpPop = false;
let voucher_expire_time = Date.now() < new Date('2023/06/16 00:00:00').getTime();
let is_requesting = false;
const log = require("../../../../../utils/log");
import {
  getcardlog
} from '../../../../../api/coupon/index';
// 卡券不同类型的背景 map
import {
  voucher_bg_map as itemBGMap,
  voucher_title_map as titleMap,
  hn_voucher_stamp_map as stampMap
} from '../../utils'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hnExcCount: {
      type: Object,
      value: {
        total_unsed: 0,
        exc_hn_hgq: 0,
        exc_hn_jl: 0,
        exc_product: 0
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
    exc_hn_rule: 'https://file.y1b.cn/public/img/bfyl/202302/img_hn_consumer_rule_28y.png',
    filterArr: [], //筛选条件
    itemBGMap: itemBGMap, //卡券背景类型
    titleMap: titleMap, //卡券标题
    stampMap: stampMap, //卡券水印戳
    file_url_9m:`${COS_URL}/public/img/bfyl/2023/09`,//23年9月 cos图片资源
    total:0,//筛选的累计字段
    pageReady:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 下拉刷新
    async refresh(event) {
      try {
        if(is_requesting)return;
        is_requesting = true;
        if (_refresh_times > 0) {
          this.triggerEvent('initCount')
        }
        params.next = 1;
        params.start_time = '';
        params.end_time = '';
        params.exc_arg="";
        let {
          loadMoreSetting,
          filterArr
        } = this.data;
        // 有筛选条件的情况
        if(filterArr.length){
          filterArr.forEach(item=>{
            // 时间筛选
            if(item.name == 'dateRangeHn' || item.name =='hnSelectDate'){
              params.start_time = item.start_time;
              params.end_time = item.end_time;
            }
            if(item.name == 'hnCouponTypeArr'){
              // 更新卡券类型参数
              params.exc_arg = item.value
            }
          })
        }
        let res = await getcardlog(params);
        is_requesting = false;
        _refresh_times++;
        let {
          code,
          data
        } = res;
        let {
          limit,
          next,
          pop,
          list,
          total = 0
        } = data;
        // 有即将过期的券···弹窗提示
        if (pop != null) {
          this.checkVoucherExpire()
        }
        if (code == 1) {
          let {couponList} = this.data
          params.next = next;
          let nomore = list.length < limit ? true : false;
          if (nomore) {
            loadMoreSetting.status = 'noMore'
          } else {
            loadMoreSetting.status = 'more';
          }
          this.setData({
            couponList: list,
            loadMoreSetting,
            total,
            isEmpty: false,
            pageReady:true
          })
          return
        }
        if (code == 0) {
          loadMoreSetting.status = 'more';
          this.setData({
            isEmpty: true,
            total,
            couponList:[],
            loadMoreSetting,
            pageReady:true
          })
        }
      } catch (error) {
        is_requesting = false;

        console.log("换购红牛列表refresh catch：", error);
      }
    },
    // 上拉加载更多
    async loadmore(event) {
      
      let  {loadMoreSetting,couponList} = this.data;
      try {
        // 判断当前是否为加载状态 防止页面重复添加数据
        if (loadMoreSetting.status !== 'loading') {
          loadMoreSetting.status = 'loading'
          this.setData({
            loadMoreSetting,
          })
          let res = await getcardlog(params);
          let {
            code,
            data
          } = res;
          let {
            limit=10,
            next,
            list=[],
            total
          } = data;
          let nomore = list?.length < limit ? true : false;
          if (code == 1) {
            params.next = next;
            loadMoreSetting.status = 'more';
            this.setData({
              couponList: couponList.concat(list),
              total,
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
        loadMoreSetting.status = 'more';
        this.setData({
          loadMoreSetting,
        })
        console.log("loadmore catch:", error)
      }

    },
    // 显示活动规则
    showExcRule() {
      let {
        exc_hn_rule,
      } = this.data;
      let url = exc_hn_rule;
      wx.previewImage({
        urls: [url],
      })
    },
    // 显示条件筛选弹窗：换购券-红牛 excType默认1
    showFilterPop() {
      this.triggerEvent('showFilterPop', {
        type: 1
      });
    },
    // 接收筛选条件，筛选列表
    initFilterData(event) {
      console.log("红牛列表收到了筛选条件：", event)
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
        console.log("换购--红牛列表所删除的标签:", findItem);
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
    // 检查核销截止通知弹窗
    checkVoucherExpire() {
      // 当前的时间大于截止日期：跳过
      if (!_voucherExpPop && voucher_expire_time) {
        log.addFilterMsg("prizeratetype25");
        // 显示换购券-过期 弹窗提示
        this.triggerEvent('showExcExpirePop')
        _voucherExpPop = true;
      }
    },
    // 重置条件的下拉刷新
    restRefresh(){
      this.setData({
        filterArr:[]
      })
      // 触发主页面重置filterPop参数
      this.triggerEvent('resetFilterPop',{
        type: 1
      })
    }
  },
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached() {
      // 初始化列表数据
      _refresh_times = 0;
      params.start_time = '';
      params.end_time = '';
      params.exc_arg='';

      this.refresh()

    },
    // 在组件实例被从页面节点树移除时执行
    detached: function () {
      console.log("红牛列表组件移除");
      params.start_time = '';
      params.end_time = '';
      params.next = 1;
      params.exc_arg='';
      _refresh_times = 0;

      _voucherExpPop = false;

    },
  },
  pageLifetimes: {
    // 页面被展示
    show: function () {
      // 初始化列表数据
      _refresh_times = 0;
      params.start_time = '';
      params.end_time = '';
      params.exc_arg='';
      this.refresh()
    },
    // 页面被隐藏
    hide: function () {
      is_requesting = false;

    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }
})