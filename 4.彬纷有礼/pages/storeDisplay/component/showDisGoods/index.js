// pages/storeDisplay/component/showDisGoods/index.js
Component({
  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    goods_list:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showPopup(goods_list) {
      this.setData({ show: true,goods_list});
    },
    onClose() {
      this.setData({ show: false });
    }
  }
})
