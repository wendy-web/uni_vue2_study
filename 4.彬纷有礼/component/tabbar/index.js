// component/tabbar/index.js
const app = getApp();
import {
  tabbarConfig
} from './tabbarConfig';
import {
  xdyhMini,
  reportEvent
} from '../../api/openMiniProgram';
import {
  getcountcard,
  getUnreadNotice
} from '../../utils/util'
import {
  getxdyhUser,
  getConfig
} from '../../api/config'
const utils = require("../../utils/util");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    config: tabbarConfig,
    xdyhUser: null, // 小店优惠用户信息
  },
  attached() {},
  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      let {
        detail
      } = event;
      let item = this.data.config[detail]
      // 跳转至小店有惠
      if (item && item.type == "miniProgram") {
        let event_name = 'click_imall';
        let {
          platform = ''
        } = app.globalData.systemInfo;
        let event_data = {
          "devices": platform
        }
        reportEvent(event_name, event_data)
        const {
          xdyhUser,
          configXdyh
        } = this.data;
        const page = xdyhUser?.page || '';
        xdyhMini({
          path: page,
          halfScreen: configXdyh.scoreShop || ''
        })
        return
      }
      // event.detail 的值为当前选中项的索引
      // this.setData({ active: detail });
      wx.switchTab({
        url: `/${item.pagePath}`,
      })

    },
    async initData() {
      try {
        let {
          config
        } = this.data;
        let who = wx.getStorageSync('who') || 0;

        let count = await getcountcard();
        let notice = await getUnreadNotice();
        if (count.data.unopen && who == 1) {
          config[4]['dot'] = true
        } else {
          config[4]['dot'] = false
        }
        if (notice.code == 1 && notice.data > 1) {
          config[1]['dot'] = true
        } else {
          config[1]['dot'] = false
        }
        this.setData({
          config
        })
        console.log("count:", count)
        console.log("notice:", notice)
        let configXdyh = utils.getCache('xdyzConfig230810');

        if (configXdyh) {
          this.setData({
            configXdyh: JSON.parse(configXdyh)
          })
        } else {
          let res = await getConfig();
          let {
            code,
            data
          } = res;
          if (code == 1 && data.ad1) {
            utils.setCache('xdyzConfig230810', JSON.stringify(data), 1800)
            this.setData({
              configXdyh: data
            })
          } else {
            this.setData({
              configXdyh: null
            })
          }
        }
        // 获取小店优惠用户信息（点击积分商城跳转路径）
        if (this.data.xdyhUser) return;
        let result = await getxdyhUser()
        const {
          code,
          data
        } = result;
        if (+code == 1) {
          this.setData({
            xdyhUser: data
          })
        }
      } catch (error) {
        console.log("tabbar catch:", error)
      }

    }
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
      this.initData()

    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }
})