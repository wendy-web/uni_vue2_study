// component/privacyPop/index.js
let privacyHandler
let privacyResolves = new Set()
let closeOtherPagePopUpHooks = new Set()

if (wx.onNeedPrivacyAuthorization) {
  wx.onNeedPrivacyAuthorization(resolve => {
    if (typeof privacyHandler === 'function') {
      
      privacyHandler(resolve)
    }
  })
}

const closeOtherPagePopUp = (closePopUp) => {
  closeOtherPagePopUpHooks.forEach(hook => {
    if (closePopUp !== hook) {
      hook()
    }
  })
}
Component({
  /**
   * 组件的初始数据
   */
  data: {
    privacyContractName: '',
    showPrivacy: false,
    icon_privacy_shield:'https://file.y1b.cn/public/img/bfyl/2023/08/icon_privacy_shield.png',
    firstShowPrivacy:false,//小程序搜索进入页面首次隐私弹窗
  },
  /**
   * 页面的生命周期
   */
  pageLifetimes: {
    show() {
      const that = this;
      if(wx.getPrivacySetting&&this.data.privacyContractName == ''){
        wx.getPrivacySetting({
          success(res) {
            console.log(res);
            that.setData({
              needAuthorization:res.needAuthorization
            })
            if (res.privacyContractName) {
              that.setData({
                privacyContractName: res.privacyContractName,
              })
            }
          }
        })
      };
    }
  },
  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function () {
      const closePopUp = () => {
        this.disPopUp()
      }
      privacyHandler = resolve => {
        privacyResolves.add(resolve)
        this.popUp()
        // 额外逻辑：当前页面的隐私弹窗弹起的时候，关掉其他页面的隐私弹窗
        closeOtherPagePopUp(closePopUp)
      }

      closeOtherPagePopUpHooks.add(closePopUp)

      this.closePopUp = closePopUp
    },
    detached: function () {
      closeOtherPagePopUpHooks.delete(this.closePopUp)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleAgree(e) {
      wx.setStorageSync('firstTimePrivacyPop', 1)
      this.disPopUp()
      // 这里演示了同时调用多个wx隐私接口时要如何处理：让隐私弹窗保持单例，点击一次同意按钮即可让所有pending中的wx隐私接口继续执行 （看page/index/index中的 wx.getClipboardData 和 wx.startCompass）
      privacyResolves.forEach(resolve => {
        resolve({
          event: 'agree',
          buttonId: 'agree-btn'
        })
      })
      privacyResolves.clear();
    },
    handleDisagree(e) {
      this.disPopUp()

      privacyResolves.forEach(resolve => {
        resolve({
          event: 'disagree',
        })
      })
      privacyResolves.clear()
    },
    popUp() {
      // 防止页面loading mask:true  无法点击
      wx.hideLoading({
        success:()=>{}
      })
      this.setData({
        showPrivacy: true
      })
    },
    disPopUp() {
      this.setData({
        showPrivacy: false,
        firstShowPrivacy:false
      })

    },
    // 打开隐私协议页面
    openPrivacyContract() {
      const _ = this
      wx.openPrivacyContract({
        fail: () => {
          wx.showToast({
            title: '遇到错误',
            icon: 'error'
          })
        }
      })
    },
    // 首次进入小程序弹出隐私协议
    showFirstTimePrivacyPop(){
      let {needAuthorization} = this.data;
      let firstTimePrivacyPop = wx.getStorageSync('firstTimePrivacyPop');
      // 需要判断基础库是否支持隐私协议弹窗
      if(!Boolean(needAuthorization)&&!Boolean(firstTimePrivacyPop)&&wx.getPrivacySetting){
        this.setData({
          firstShowPrivacy:true
        })
      }
    }
  },
})