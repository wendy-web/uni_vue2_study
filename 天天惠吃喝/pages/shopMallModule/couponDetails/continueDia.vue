<template>
<van-popup
    :show="isShow"
    custom-style="overflow: visible;background: transparent;"
    round
		:safe-area-inset-bottom="false"
>
  <view class="cont_box">
    <image class="cont_top_icon" src="https://file.y1b.cn/store/1-0/23713/64afe852aa2a6.png" mode="aspectFit"></image>
    <view class="cont_text">
      <image class="content_title" src="https://file.y1b.cn/store/1-0/23713/64afe6b045bfd.png" mode="aspectFit"></image>
      <view class="cont_title">确认离开吗?</view>
      <view class="cont_txt">
        <image class="content_box-img" src="https://file.y1b.cn/store/1-0/23713/64afe688266be.png"></image>
        <view class="con_price">
          <text style="color: #ef2b20; margin-right: 5rpx;">¥{{faceValue}}</text> 限时优惠
        </view>
        <view class="con_credit">
          {{ zeroCredits ? '近期最大优惠' : `${creditsValue}牛金豆不退还` }}
        </view>
      </view>
    </view>
    <view class="btns_box">
      <view class="pop_btn" @click="onClose">{{cancelText}}</view>
      <view class="pop_btn pop_btn-confirm" @click="onConfirm">{{confirmText}}</view>
    </view>
  </view>
</van-popup>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      accountNum: {
        type: Number,
        default: 0
      },
      faceValue: {
        type: Number,
        default: 0
      },
      creditsValue: {
        type: Number,
        default: 0
      },
      cancelText: {
        type: String,
        default: '离开'
      },
      confirmText: {
        type: String,
        default: '再考虑下'
      },
      zeroCredits: {
        type: [String, Number],
        default: 0
      }
    },
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters(["userInfo", "isSelRedPacket", 'isSelNewPacket']),
    },
    methods: {
        onConfirm() {
            this.$emit("confirm");
        },
        onClose() {
            this.$emit("close");
        }
    }

}
</script>

<style lang="scss">
.cont_box {
  background: #ffffff;
  border-radius: 32rpx;
  padding: 36rpx 0;
  font-size: 28rpx;
  text-align: center;
  width: 670rpx;
  box-sizing: border-box;
  border: 8rpx solid #FCF2E1;
  position: relative;
  .cont_top_icon {
    width: 548rpx;
    height: 74rpx;
    position: absolute;
    top: -39rpx;
    left: 50%;
    transform: translateX(-50%);
  }
}
.cont_text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .content_title {
    width: 424rpx;
    height: 42rpx;
  }
}
.btns_box {
  width: 100%;
  margin-top: 64rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.pop_btn {
  width: 288rpx;
  height: 88rpx;
  box-sizing: border-box;
  line-height: 88rpx;
  text-align: center;
  border-radius: 16rpx;
  font-weight: 500;
  color: #333;
  border: none;
  background: #f8f8f8;
}

.pop_btn-confirm {
  color: #fff;
  background: linear-gradient(135deg,#f2554d, #f04037);
}
.confirm_text {
  font-size: 28rpx;
  color: #999;
  line-height: 40rpx;
  margin-top: 30rpx;
}
.confirm_num {
  font-size: 50rpx;
  font-weight: 500;
  text-align: center;
  color: #333333;
  line-height: 72rpx;
  margin: 24rpx 0 80rpx;
}
.cont_title {
  font-size: 28rpx;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  text-align: center;
  color: #666666;
  line-height: 40rpx;
  margin: 16rpx auto 28rpx;
}
.cont_txt {
  width: 550rpx;
  height: 192rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 0;
  .content_box-img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
  }
  .con_price {
    font-size: 36rpx;
    font-family: PingFang SC, PingFang SC-Semibold;
    font-weight: 600;
    text-align: center;
    color: #333333;
    line-height: 50rpx;
    margin: 8rpx 0;
  }
  .con_credit {
    font-size: 24rpx;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    text-align: center;
    color: #f15048;
    line-height: 34rpx;
  }
}
</style>
