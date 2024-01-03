// component/storeExchangePop/process/index.js
import {
  prizeConfig,
  checkPrize
} from './config';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    actInfo: {
      type: Object,
      value: {},
      // value: {"title":"战马兑奖送奖励","kpi_1":0,"kpi_2":0,"s_time":"2023-07-20 00:00:00","e_time":"2023-08-31 23:59:59","exp_time":"2023-10-20 23:59:59","sub_cover":"https:\/\/file.y1b.cn\/public\/act\/cover_dg5.png","sub_t1":"战马一元乐享","sub_t2":"战马","calc":[[15,29,6,6],[30,44,12,12],[45,59,18,18],[60,89,24,24],[90,199,42,42],[200,999999,120,120]],"issue":11,"issue_title":"001期","status":"未开始","shop_id":124,"id":133,"kpi_num":0},
      observer: function (actInfo = null) {
        if (actInfo) {
          this.initActInfo(actInfo);
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    prizeConfig
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initActInfo(actInfo = null) {
      if (actInfo) {
        let {
          kpi_num = 0,
            rev_msg = [0, 0]
        } = actInfo;
        const excPrizeInfo = checkPrize(kpi_num);
        actInfo.total_coupons = 0;
        if (rev_msg) {
          actInfo.total_coupons = rev_msg[0] + rev_msg[1];
        }
        console.log("process组件当前兑奖奖励信息：", excPrizeInfo);
        this.setData({
          excPrizeInfo,
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