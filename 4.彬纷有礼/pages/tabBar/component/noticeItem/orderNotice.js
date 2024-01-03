// pages/tabBar/component/noticeItem/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;


let is_requesting = false;
let params = {
  next: 1,
  limit: 10,
  type: 1
}
import {
  getnotice
} from '../../../../api/coupon/index';
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: Number,
      value: 0, //默认订单通知
    },
    innerBoxHeight:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    background: '#2e2e2e',
    isBackBtn: false, // 设置是否显示回到顶部按钮
    isEmpty: false, // 设置是否为空数据
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
    noticeList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 下拉刷新
    async refresh(event) {
      try {
        if (is_requesting) return;
        is_requesting = true;

        params.next = 1;
        let {
          loadMoreSetting,
        } = this.data;

        let res = await getnotice(params);
        is_requesting = false;
        let {
          code,
          data
        } = res;
        let {
          limit,
          next,
          list,
        } = data;
        if (code == 1) {
          params.next = next;
          let nomore = list.length < limit ? true : false;
          if (nomore) {
            loadMoreSetting.status = 'noMore'
          } else {
            loadMoreSetting.status = 'more';
          }
          list.forEach((val) => {
            if (val.type == 1) {
              let content = JSON.parse(val['content']);
              val.status = content.status;
              delete content.status
              val.content = content;
            }
          });
          this.setData({
            noticeList: list,
            loadMoreSetting,
            isEmpty: false,
          })
          return
        }
        if (code == 0) {
          loadMoreSetting.status = 'more';
          this.setData({
            isEmpty: true,
            noticeList: [],
            loadMoreSetting,
          })
        }
      } catch (error) {
        is_requesting = false;

        console.log("消息-订单通知 refresh catch：", error);
      }
    },
    // 上拉加载更多
    async loadmore(event) {

      let {
        loadMoreSetting,
        noticeList
      } = this.data;
      try {
        if(loadMoreSetting.status ==='noMore') return;
        // 判断当前是否为加载状态 防止页面重复添加数据
        if (loadMoreSetting.status !== 'loading') {
          loadMoreSetting.status = 'loading'
          this.setData({
            loadMoreSetting,
          })
          let res = await getnotice(params);
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
            list.forEach((val) => {
              if (val.type == 1) {
                let content = JSON.parse(val['content']);
                val.status = content.status;
                delete content.status
                val.content = content;
              }
            });
            this.setData({
              noticeList: noticeList.concat(list),
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
  },
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached() {
      
      // 初始化列表数据
      params.next = 1;
      params.type = 1;

      this.refresh()

    },
    // 在组件实例被从页面节点树移除时执行
    detached: function () {
      params.next = 1;
      params.type = 1;
    },
  },
  pageLifetimes: {
    // 页面被展示
    show: function () {
      // 初始化列表数据
      params.next = 1;
      params.type = 1;
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