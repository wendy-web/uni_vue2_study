// pages/storeRank/prizeTicket/pop/index.js
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
    confirmPopShow: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 显示二次确认弹窗
    showConfirm() {
      this.setData({
        confirmPopShow: true
      })
    },
    // 关闭弹窗
    onClose(event) {
      let {
        popname
      } = event.currentTarget.dataset;
      this.setData({
        [popname]: false
      })
    },
    onConfirm(){
      this.setData({
        confirmPopShow: false
      })
      this.triggerEvent('refresh');
    }
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