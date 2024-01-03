// component/actCouponPop/gzExcBackground/index.js
import {
  COS_URL
} from '../../../utils/http'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
    // 打开类型：0默认无顶部内容
    openType: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    closeImg: `${COS_URL}/public/img/bfyl/2023/08/gzExc/pop_icon_close.png`,
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
