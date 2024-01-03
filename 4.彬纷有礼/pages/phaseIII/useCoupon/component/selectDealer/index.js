// pages/phaseIII/useCoupon/component/selectDealer/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;

const {
  debounce
} = require("../../../../../utils/util")
let delayTimer = '';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dealerList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    emptySetting: {
      img: `${COS_URL}/public/img/bfyl/2023/09/img_nodata.png`,
      text: '暂无配送商信息'
    },
    selectDealerShow: false, //选择经销商弹窗
    file_url_9m: `${COS_URL}/public/img/bfyl/2023/09`, //23年9月 cos图片资源
    keyword: '', //搜索关键词
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭弹窗
    onClose(event) {
      let {
        popname
      } = event.currentTarget.dataset;
      this.setData({
        [popname]: false
      })
      this.triggerEvent('dealerPopClose')

    },
    // 显示弹窗
    show() {
      this.setData({
        selectDealerShow: true,
      })
    },
    // 输入监听
    // searchChange: debounce(function (event) {
    //   try {
    //     let keyword = event.detail;
    //     if (keyword) {
    //       keyword = keyword.trim();
    //     }
    //     this.setData({
    //       keyword
    //     })
    //     console.log("请求的关键词：", keyword)
    //     // 触发更新列表
    //     this.triggerEvent('refreshDealerList', {
    //       keyword
    //     })

    //   } catch (error) {
    //     console.log("searchChange catch:", error)
    //   }

    // }, 800),
    async searchChange(event) {
      try {
        let keyword = event.detail;
        if (keyword) {
          keyword = keyword.trim();
        }
        this.setData({
          keyword
        })
        // 清除之前的定时器
        clearTimeout(delayTimer);
        // 设置一个新的定时器，延迟请求接口
        delayTimer = setTimeout(()=>{
          // console.log("请求的关键词：", keyword)
          // 触发更新列表
          this.triggerEvent('refreshDealerList', {
            keyword
          })
        }, 800);

      } catch (error) {
        console.log("searchChange catch:", error)
      }
    },
    // 搜索框
    // onSearch(event) {
    //   let keyword = event.detail;
    //   this.setData({
    //     keyword
    //   })
    //   // 触发更新列表
    //   this.triggerEvent('refreshDealerList', {
    //     keyword
    //   })
    // },
    //取消搜索
    searchCancel(event) {
      console.log("取消搜索：", event);
    },
    // 联系配送商
    mkPhoneCall: function (e) {
      let {
        phone,
      } = e.currentTarget.dataset;
      wx.makePhoneCall({
        phoneNumber: phone //仅为示例，并非真实的电话号码
      })
    },
    // 设置默认 配送商
    setDefault(event) {
      let {
        uid,
      } = event.currentTarget.dataset;
      this.triggerEvent('setDefault', {
        a_uid: uid
      })
    },
    // 搜索框失去焦点searchBlur
    searchBlur(event) {
      let {
        keyword
      } = this.data;
      // if (keyword) {
      //   this.triggerEvent('refreshDealerList', {
      //     keyword
      //   })
      // }
    },
    // 清空搜索框
    // searchClear(event) {
    //   let {
    //     keyword = ''
    //   } = this.data;
    //   this.triggerEvent('refreshDealerList', {
    //     keyword
    //   })
    // },
    // 选择配送商，传给父页面，关闭弹窗
    selectDealer(event) {
      let {
        item
      } = event.currentTarget.dataset;
      this.triggerEvent('selectDealer', item);
      this.setData({
        selectDealerShow: false, //选择经销商弹窗

      })
    }
  }
})