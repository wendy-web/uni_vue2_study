// component/storeExchangePop/background/index.js
import {COS_URL} from '../../../utils/http'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bgImg: {
      type: String,
      value: `${COS_URL}/public/img/bfyl/2023/10/bg_pop.png`
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
    closeImg: `${COS_URL}/public/img/bfyl/202201/icon_close.png`,
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
