import {
  COS_URL
} from '../../../utils/http'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bgImg: {
      type: String,
      value: `${COS_URL}/public/img/bfyl/2023/07/unbox/bg_pop.png`
    },
    // 打开类型：0默认无顶部内容，1每日进度，2中奖弹窗，3店铺转让，4核对店铺信息
    openType: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    closeImg: `${COS_URL}/public/img/phaseIII/20211020/icon_close.png`,
    // closeImg: `${COS_URL}/public/img/storeRank/202305/icon_close.png`,
    bg_record_title: `${COS_URL}/public/img/bfyl/2023/07/bg_record_title.png`,// 标题背景
    icon_ticker_tape: `${COS_URL}/public/img/couponActivity/pop/icon_ticker_tape.png`,// 中奖弹窗碎花
    img_shop_head: `${COS_URL}/public/img/bfyl/2023/07/img_shop_head.png`, // 禁止转让店铺背景
    file_url_gzunbox:`${COS_URL}/public/img/bfyl/2023/08/gzUnbox`,//广州开箱cos图片资源
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