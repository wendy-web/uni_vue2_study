// pages/storeRank/component/flip-card.js
let COS_URL = getApp().globalData.COS_URL || "https://file.y1b.cn";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index: {
      type: Number, //图片索引
      value: 1
    },
    cardSrc: {
      type: String, //未翻牌图片地址
      value: ''
    },
    flipSrc: {
      type: String, //已翻牌图片地址：根据index索引和点击事件去拼接图片：card_1.png，flip_1.png
      value: ''
    },
    isFlip: {
      type: Boolean,
      value: false
    },
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      let index = this.data.index;
      let cardSrc = COS_URL + '/public/img/storeRank/202108/card_' + index + '.png';
      let flipSrc = COS_URL + '/public/img/storeRank/202108/flip_hd_' + index + '.png';
      if (index == 1 || index == 2) {
        cardSrc = COS_URL + '/public/img/storeRank/202108/card_hd_' + index + '.png';
      }
      if (index == 3) {
        cardSrc = COS_URL + '/public/img/storeRank/202108/card_hd_' + index + '_new.png';
      }
      if (index == 16) {
        cardSrc = COS_URL + '/public/img/storeRank/202108/card_' + index + '_new.png';
      }
      this.setData({
        cardSrc,
        flipSrc
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    click() {
      let isFlip = this.data.isFlip;
      this.setData({
        isFlip: !isFlip,
      })
      this.triggerEvent("click",{trigger:true,cardSrc:this.data.cardSrc,flipSrc:this.data.flipSrc});
    }
  }
})