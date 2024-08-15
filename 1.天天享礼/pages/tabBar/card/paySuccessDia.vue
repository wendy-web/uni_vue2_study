<template>
<van-popup
    :show="isShow"
    custom-style="overflow: visible;background: transparent;"
    round
    :z-index="100"
    :safe-area-inset-bottom="false"
    :catchtouchmove="true"
    @close="onClose"
>
	<view class="cont_box">
        <image class="pay_dia-light" :src="cardImgUrl + 'pay_dia-light.png'" mode="aspectFill"></image>
        <image class="pay_dia" :src="cardImgUrl + 'pay_dia.png'" mode="aspectFill"></image>
        <view class="cont_title">{{title}}</view>
        <view class="cont_cont">
            <!-- <view>会员红包将在{{config.day}}天后发放</view> -->
            <view>
                有效期：
                <text style="color: #FE9433;">{{ vipObject.over_time }}</text>
            </view>
        </view>
        <view class="pop_btn" @click="onClose">我知道了</view>
	</view>
</van-popup>
</template>

<script>
import { getImgUrl } from '@/utils/auth.js';
export default {
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '续费成功'
        },
        vipObject: {
            type: Object,
            default: {}
        }
    },
	data() {
		return {
            mgUrl: getImgUrl(),
            cardImgUrl:`${getImgUrl()}static/card/`,
		}
	},
	methods: {
		onClose() {
			this.$emit("close");
		}
	}
}
</script>

<style scoped lang="scss">
@import '@/static/css/mixin.scss';
.cont_box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 608rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 48rpx 0 44rpx;
  text-align: center;
  position: relative;
  .pay_dia-light{
    position: absolute;
    width: 608rpx;
    height: 608rpx;
    opacity: 0.32;
    top: -314rpx;
  }
  .pay_dia{
    position: absolute;
    width: 200rpx;
    height: 148rpx;
    top: -114rpx;
  }
}
.cont_title {
    font-size: 36rpx;
    font-weight: 500;
    color: #333;
    line-height: 50rpx;
}
.cont_cont{
    font-size: 28rpx;
    line-height: 40rpx;
    margin: 30rpx auto 72rpx;
}
.pop_btn {
    width: 392rpx;
    height: 82rpx;
    background: #fe423d;
    border-radius: 42rpx;
    line-height: 82rpx;
    font-size: 28rpx;
    font-weight: 600;
    color: #fff;
    padding: 0 50rpx;
    box-sizing: border-box;
}
</style>
