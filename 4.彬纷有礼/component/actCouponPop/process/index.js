// component/storeExchangePop/process/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    actInfo: {
      type: Object,
      value: {},
      observer: function (actInfo) {
        if (actInfo) {
          this.initActInfo(actInfo);
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    initActInfo(actInfo) {
      if (actInfo) {
        let {
          kpi_1,
          kpi_2,
          progressPercent
        } = actInfo;
        let min_traget_left = Math.ceil(kpi_1 / kpi_2 * 100);
        // if(min_traget_left>60){
        //   progressPercent = progressPercent * 0.6;
        //   min_traget_left = 60;
        // }
        // actInfo.progressPercent = progressPercent;
        actInfo.min_traget_left = min_traget_left;
        this.setData({
          actInfo
        })
      }
    }
  },
  lifetimes: {
    async attached() {

    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})