// pages/storeAllowance/cashorCoupon/component/pop/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const utils = require("../../../../../utils/util");
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    cashPopShow: false, //现金红包弹窗
    couponPopShow: false, // 产品券弹窗显示
    cashcoupon_file_url:`${COS_URL}/public/img/bfyl/2023/08/cashCoupon`,// cos 资源地址
    data:'',//选择卡券时候取data.num 最终实际的额度
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭弹窗
    onClose(event) {
      let {
        popname
      } = event.currentTarget.dataset;
      this.setData({
        [popname]: false
      })
    },
    show(params) {
      let {
        type,
        data=''
      } = params;
      
      let popname = type == 2 ? 'couponPopShow' : 'cashPopShow'
      this.setData({
        [popname]: true,
        data
      })
    },
    openPage(event) {
      let {
        url = ''
      } = event.currentTarget.dataset;
      // 查看余额的时候注意判断非店长身份
      if (url) {
        wx.redirectTo({
          url,
        })
      }
      this.onClose(event)
    },
    goScan(event) {
      let url = "pages/zongduan/saoma/index";
      // utils.navigateFrequentPage(url,'?hide=1')
      app.globalData.toscan = true;
      //获取当前页面栈
      let pages = getCurrentPages() || [];
      if (pages.length) {
        //查询排行榜页面索引
        pages.reverse();
        let pageIndex = pages.findIndex(item => item.route == 'pages/zongduan/saoma/index');
        //找到索引的，返回至排行榜页（wx.navigateBack关闭当前页面）
        if (pageIndex > -1) {
          const pageTarget = pages[pageIndex];
          pageTarget.setData({
            isBackPage: true,
          })
          wx.navigateBack({
            delta: pageIndex,
          })
          this.onClose(event)

          return
        }
      }
      //页面栈里无指定页面再跳转（小程序中页面栈最多10层，超出会报错：fail webview count limit exceed）
      if (url) {
        wx.redirectTo({
          url: '/pages/zongduan/saoma/index?hide=1',
        })
        this.onClose(event)
      }

    },
  },
  lifetimes: {
    async attached() {
      // 在组件实例进入页面节点树时执行
      try {
        let userdata = wx.getStorageSync('userdata') || await utils.getUserInfoNew();

        this.setData({
          userdata
        })
      } catch (error) {

        console.log("attached error:", error)
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
      console.log("页面显示");
    },
    hide: function () {
      // 页面被隐藏
      let data = this.data;
      Object.keys(data).forEach(item => {
        // console.log(item,':',typeof data[item])
        if (typeof data[item] === 'boolean' && data[item] === true) {
          this.setData({
            [item]: false
          })
        }
      });
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }
})