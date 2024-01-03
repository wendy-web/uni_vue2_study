// component/storeRankPop/popBackground/index.js
import {COS_URL} from '../../../utils/http'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bgImg: {
      type: String,
      value: `${COS_URL}/public/img/storeRank/202305/bg_unbox_normal.png`
    },
    boxItemClass:{
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    closeImg: `${COS_URL}/public/img/storeRank/20210121/close.png`,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closePop() {
      this.triggerEvent('close')
    }
  }
})