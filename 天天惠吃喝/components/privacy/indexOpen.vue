<template>
<van-popup
  :show="innerShow"
  custom-style="background-color: transparent;overflow:visible;"
  :z-index="100"
  :catchtouchmove="true"
>
  <view class="content">
    <image class="privacy_icon" src="https://file.y1b.cn/store/1-0/23829/64ed8742906b7.png" mode="scaleToFill"></image>
    <view class="title">用户隐私保护提示</view>
    <view class="des">
      感谢您使用本小程序，请您在使用前阅读完整版<text class="link" @click="openPrivacyContract">{{ privacyContractName }}</text>了解详细信息。
    </view>
    <view class="des">
      当您点击同意开始使用我们的产品和服务，即表示您已理解并同意该条款内容，我们将保护您的个人信息安全，并为您提供完整的服务。
    </view>
    <view class="btns">
        <button id="disagree-btn" class="item reject" @click="handleDisagree">不同意</button>
        <button id="agree-btn" class="item agree" open-type="agreePrivacyAuthorization" @agreeprivacyauthorization="handleAgree">同意
        </button>
    </view>
  </view>
</van-popup>
</template>

<script>
let privacyHandler;
let privacyResolves = new Set();
let closeOtherPagePopUpHooks = new Set();
if (wx.onNeedPrivacyAuthorization) {
  wx.onNeedPrivacyAuthorization(resolve => {
    if (typeof privacyHandler === 'function') {
      privacyHandler(resolve)
    }
  });
}
const closeOtherPagePopUp = (closePopUp) => {
  closeOtherPagePopUpHooks.forEach(hook => {
    if (closePopUp !== hook) {
      hook()
    }
  })
}
import {
mapGetters,
mapMutations
} from 'vuex';
export default {
  data() {
    return {
      innerShow: false,
      privacyContractName: '《天天享礼小程序隐私保护指引》',
      currentPage: '', // 当前页面地址
      disagreePrivacyPageList: [
        'pages/tabBar/discounts/index',
        'pages/userModule/takeawayMenu/mcDonald/index',
        'pages/userModule/takeawayMenu/luckin/index',
        'pages/userModule/takeawayMenu/kfc/index',
        'pages/userModule/takeawayMenu/mcDonald/selectShop/index',
        'pages/userModule/takeawayMenu/luckin/selectShop/index',
        'pages/userModule/takeawayMenu/kfc/selectShop/index'
      ], // 不同意授权页面的判断
    }
  },
  computed: {
    ...mapGetters(['diaList', 'isAutoPrivacy'])
  },
  watch: {
    // diaList(newValue, oldValue) {
    //   if (newValue.length && newValue[0] == "privacy") {
    //     this.innerShow = true;
    //   }
    // }
  },
  mounted() {
    const pageList = getCurrentPages();
    const currentPageObj = pageList[pageList.length - 1];
    this.currentPage = currentPageObj.route;
    const closePopUp = () => {
      this.disPopUp()
    }
    privacyHandler = resolve => {
      privacyResolves.add(resolve)
      this.popUp();
      // 额外逻辑：当前页面的隐私弹窗弹起的时候，关掉其他页面的隐私弹窗
      closeOtherPagePopUp(closePopUp);
    }
    closeOtherPagePopUpHooks.add(closePopUp)
    this.closePopUp = closePopUp;
    if (wx.getPrivacySetting && !this.isAutoPrivacy) {
        this.setAutoPrivacy(true)
        wx.getPrivacySetting({
        success: res => {
            if (res.needAuthorization) {
                return this.popUp()
            }
            this.delCurrentDiaList('privacy')
        },
        fail: () => { },
        complete: () => { },
        })
    } else {
        this.delCurrentDiaList('privacy')
        // 低版本基础库不支持 wx.getPrivacySetting 接口，隐私接口可以直接调用
    }
  },
  beforeDestroy() {
    closeOtherPagePopUpHooks.delete(this.closePopUp);
  },
  methods: {
    ...mapMutations({
        setGiftInfo: 'user/setGiftInfo',
        setDiaList: "user/setDiaList",
        delCurrentDiaList: "user/delCurrentDiaList",
        setAutoPrivacy: "user/setAutoPrivacy",
    }),
    handleAgree(e) {
      this.disPopUp()
      // 这里演示了同时调用多个wx隐私接口时要如何处理：让隐私弹窗保持单例，点击一次同意按钮即可让所有pending中的wx隐私接口继续执行 （看page/index/index中的 wx.getClipboardData 和 wx.startCompass）
      privacyResolves.forEach(resolve => {
        resolve({
          event: 'agree',
          buttonId: 'agree-btn'
        })
      })
      privacyResolves.clear()
    },
    // 不同意授权
    handleDisagree(e) {
      this.disPopUp()
      privacyResolves.forEach(resolve => {
        const isBack = this.disagreePrivacyPageList.includes(this.currentPage);
        if(isBack)  {
          this.$switchTab('/pages/tabBar/shopMall/index');
        } else {
          resolve({
            event: 'disagree',
          });
        }
      });
      privacyResolves.clear();
    },
    popUp() {
        if (this.innerShow === false) {
          this.setDiaList('privacy')
          this.innerShow = true;
          // if(this.diaList[0] == 'privacy') {
          //   return  this.innerShow = true;
          // }
          // return this.setDiaList('privacy');
        }
    },
    disPopUp() {
        if (this.innerShow === true) {
            this.innerShow = false;
            this.delCurrentDiaList('privacy')
        }
    },
    // 打开翻看协议
    openPrivacyContract() {
      wx.openPrivacyContract();
    },
    LifetimesShow() {
      if (this.closePopUp) {
        privacyHandler = resolve => {
          privacyResolves.add(resolve)
          this.popUp()
          // 额外逻辑：当前页面的隐私弹窗弹起的时候，关掉其他页面的隐私弹窗
          closeOtherPagePopUp(this.closePopUp)
        }
      }
    }
  },
}
</script>

<style scoped lang="scss">
.content {
    width: 648rpx;
    padding: 64rpx 58rpx 66rpx;
    box-sizing: border-box;
    background: linear-gradient(180deg,#ffe7dd, #ffffff 28%);
    border: 4rpx solid #ffddc4;
    border-radius: 52rpx;
    box-shadow: 0rpx 0rpx 18rpx 0rpx rgba(255,255,255,0.99) inset;
    overflow: hidden;
    text-align: center;
    .privacy_icon{
      width: 110rpx;
      height: 172rpx;
      margin: 0 auto 22rpx;
      display: block;
    }
    .title{
      font-size: 40rpx;
      font-family: Source Han Sans CN, Source Han Sans CN-Bold;
      font-weight: 700;
      color: #000;
    }
    .des {
      color: #666;
      margin-top: 40rpx;
      font-size: 28rpx;
      text-align: left;
      color: #6c6c6c;
      line-height: 1.5;
      .link{
        color: #FF492D;
      }
  }
}

.btns {
  margin-top: 76rpx;
  display: flex;
  .item {
    justify-content: space-between;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border: none;
    width: 220rpx;
    height: 76rpx;
    background: #ffffff;
    border: 2rpx solid transparent;
    border-radius: 40rpx;
    &.reject {
      color: #676767;
      border-color: #B6B6B6;
    }
    &.agree {
        background: #EB2C0E;
        color: #fff;
    }
  }
}
</style>
