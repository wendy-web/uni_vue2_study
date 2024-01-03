// pages/Component/jarPop.js
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    bgImg: {
      type: String,
      value: ''
    },
    openType: {
      type: String,
      value: 'navigate'
    },
    pagePath: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    iconCloseUrl: 'https://file.y1b.cn/public/img/storeRank/202106/icon_close.png'
  },
  attached: function () {
    console.log("广告组件初始化············:", this.data);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    closePop: function () {
      this.setData({
        show: false
      });
    },
    openPage: function (e) {
      this.setData({
        show: false
      });
      let pagePath = this.data.pagePath;
      let openType = this.data.openType;
      console.log("jarPop openPage pagePath:", pagePath);
      if (this.data.pagePath) {
        if (openType == 'navigate') {
          wx.navigateTo({
            url: pagePath,
          })
        } else {
          wx.switchTab({
            url: pagePath,
          })
        }
        return
      }

    }
  }
})