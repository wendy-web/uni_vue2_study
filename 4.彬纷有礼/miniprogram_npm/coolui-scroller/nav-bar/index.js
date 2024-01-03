// pages/second-floor/circle/index.js
Component({
  externalClasses: ['nav-bar-class'],
  relations: {
    '../second-floor/index': {
      type: 'parent',
      linked(target) {
        this.setData({
          target,
        })
      },
    },
  },
  properties: {
    type: {
      type: String,
      value: 'default',
    },
    config: {
      type: Object,
      value: {
        back: {
          show: true,
        },
        background: {
          color: '#ffffff',
        },
        text: {
          color: '#000000',
          shadow: 0,
        },
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: null,
    statusBarHeight: 0,
    Custom: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      if (this.data.config.back.click) {
        this.data.config.back.click()
      } else {
        wx.navigateBack({
          delta: 1,
        })
      }
    },
  },
  ready() {
    const that = this
    wx.getSystemInfoAsync({
      success: (e) => {
        that.setData({
          StatusBar: e.statusBarHeight,
        })
        let capsule = wx.getMenuButtonBoundingClientRect()
        if (capsule) {
          that.setData({
            Custom: capsule,
            statusBarHeight: capsule.bottom + capsule.top - e.statusBarHeight,
          })
        } else {
          that.setData({
            statusBarHeight: e.statusBarHeight + 50,
          })
        }
      },
    })
  },
})
