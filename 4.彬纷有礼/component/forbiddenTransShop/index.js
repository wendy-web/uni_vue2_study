// component/forbiddenTransShop/index.js
// 店铺活动期间禁止转让店铺
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const utils = require('../../utils/util');
var actMap = new Map();
import storeRankUtils from '../../api/storeRank/utils';
import shopActUtils from '../../api/shopActivity/utils';
actMap.set('dgZmExcActInfo', {
  api: shopActUtils.dgZmExcActInfo.bind(shopActUtils),
  inAct: 'inExcAct_DG_ZM',
  img_shop_head: `${COS_URL}/public/img/bfyl/2023/08/gzUnbox/img_shop_head.png`,
  popBG: ``,
})
// actMap.set('gzUnboxActInfo', {
//   api: shopActUtils.gzUnboxActInfo.bind(shopActUtils),
//   inAct: 'inUnboxAct_GZ',
//   img_shop_head: `${COS_URL}/public/img/bfyl/2023/08/gzUnbox/img_shop_head.png`,
//   popBG: ``,
// })
// actMap.set('storeRankActInfo14', {
//   api: storeRankUtils.actInfo14.bind(storeRankUtils),
//   inAct: 'inStoreRank14',
//   popBG: `${COS_URL}/public/img/bfyl/2023/08/bg_pop_default.png`
// })
// actMap.set('shopActInfo', {
//   api: shopActUtils.act5_getinfo.bind(shopActUtils),
//   inAct: 'inActCoupon',
//   popBG: `${COS_URL}/public/img/bfyl/2023/07/unbox/bg_pop.png`
// })
// actMap.set('shopUnboxActInfoSZ', {
//   api: shopActUtils.act5_getinfo_sz.bind(shopActUtils),
//   inAct: 'inUnboxAct_SZ',
//   popBG: `${COS_URL}/public/img/bfyl/2023/07/unbox/bg_pop.png`
// })
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
    notTransferShow: false, //禁止转让店铺弹窗
    actInfo: null, //活动参与信息
    inAct: false, //是否在活动期间，以此字段判断是否弹窗不可操作店铺
    icon_no_trans: `${COS_URL}/public/img/bfyl/2023/07/icon_no_trans.png`, //禁止转让店铺图标
    popBG: `${COS_URL}/public/img/bfyl/2023/07/unbox/bg_pop.png`, //禁止转让店铺background 的背景图
    img_shop_head: `${COS_URL}/public/img/bfyl/2023/07/img_shop_head.png`, // 禁止转让店铺背景
    gzZmExcPopShow:false,//广州战马兑奖弹窗
    closeImg:`${COS_URL}/public/img/phaseIII/20211020/icon_close.png`,
    file_url_gzexc:`${COS_URL}/public/img/bfyl/2023/08/gzExc`,//广州兑奖活动资源

  },

  /**
   * 组件的方法列表
   */
  methods: {
    isForbiddenTransShop({
      tips = '暂不能转让店铺',
    } = {}) {
      let {
        inAct,
        actInfo
      } = this.data;
      if (inAct) {
        // 判断活动是否是战马：广州战马兑奖活动转让店铺弹窗样式不一样
        if (actInfo.trans_shop_name == 'gz_zm_exc') {
          this.setData({
            gzZmExcPopShow: true,
            noTransferTips: tips
          })
        } else {
          this.setData({
            notTransferShow: true,
            noTransferTips: tips
          })
        }
      }
      return inAct
    },
    async initData() {
      try {
        for (let [key, value] of actMap.entries()) {
          let cache = wx.getStorageSync(key);
          if (cache) {
            cache = JSON.parse(cache)
          } else {
            let {
              actInfo
            } = await value.api();
            cache = actInfo;
          }
          let inAct = utils.inActCouponTips(value.inAct);
          let img_shop_head = value.img_shop_head || this.data.img_shop_head;
          this.setData({
            actInfo: cache,
            inAct,
            popBG: value.popBG,
            img_shop_head
          })
          if (inAct) {
            break
          }

        }
      } catch (error) {
        console.log("禁止操作店铺组件 catch:", error);
      }
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
  },
  lifetimes: {
    attached() {
      console.log("forbiddenTransShop  attached");
    }
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
      this.initData();
      console.log("引入forbiddenTransShop的页面 show 事件：", this.data.inAct);

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