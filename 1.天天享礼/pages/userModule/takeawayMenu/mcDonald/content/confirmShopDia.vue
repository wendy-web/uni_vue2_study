<template>
	<van-popup
    :show="isShow"
    custom-style="overflow: visible;background: transparent;"
    round
    :z-index="100"
	  :safe-area-inset-bottom="false"
	  :catchtouchmove="true"
  >
	<view class="cont_box">
      <image class="shop_icon" src="https://file.y1b.cn/store/1-0/23814/64d9c778e2fca.png" mode="aspectFill"></image>
      <image class="shop_close" :src="takeImgUrl + '/shop_close.png'" mode="aspectFill" @click="onClose"></image>
      <view class="cont_lab-conf"> 确定前往取餐门店</view>
      <view class="cont_text">【{{ restaurantName }}】</view>
      <view class="cont_lab">
        {{ distance ? `距您${formatDistance(this.distance)},` : '' }}确认订单后将无法更改
      </view>
      <view class="btns_box fl_bet">
        <view class="pop_btn pop_btn-cancel" @click="onDisplace">更换门店</view>
        <view class="pop_btn pop_btn-confirm" @click="onConfirm">确定</view>
      </view>
	</view>
</van-popup>
</template>

<script>
import { getImgUrl } from '@/utils/auth.js';
import { formatDistance } from '@/utils/index.js';
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    restaurantName: {
      type: String,
      default: ''
    },
    distance: {
      type: Number,
      default: 0
    }
  },
	data() {
		return {
      takeImgUrl: getImgUrl() + '/static/subPackages/userModule/takeawayMenu',
    }
	},
	methods: {
    formatDistance,
		onClose() {
			this.$emit("close");
		},
    onDisplace() {
			this.$emit("displace");
    },
    onConfirm() {
			this.$emit("confirm");
    },
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
  width: 622rpx;
  background: #ffffff;
  border-radius: 40rpx;
  position: relative;
}
.shop_icon{
  width: 346rpx;
  height: 320rpx;
  margin-top: -62rpx;
}
.shop_close{
  position: absolute;
  width: 30rpx;
  height: 32rpx;
  top: 0;
  right: 0;
  padding: 32rpx;
}
.cont_text {
  font-size: 32rpx;
  font-weight: 600;
  text-align: center;
  color: #333;
  line-height: 44rpx;
  padding: 0 40rpx;
  margin-top: 8rpx;
}
.cont_lab{
  font-size: 26rpx;
  text-align: center;
  color: #999999;
  line-height: 36rpx;
  padding: 0 40rpx;
  margin-top: 20rpx;
}
.cont_lab-conf{
  font-size: 28rpx;
  text-align: center;
  color: #777777;
  line-height: 40rpx;
  margin-top: 10rpx;
}

.btns_box {
	width: 100%;
  margin-bottom: 40rpx;
  padding: 0 76rpx;
  box-sizing: border-box;
  margin-top: 56rpx;
  color: #333;
}
.pop_btn {
  width: 212rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 42rpx;
  font-size: 28rpx;
  font-weight: 600;
  text-align: center;
  border: 2rpx solid;
}

.pop_btn-confirm {
  background: $mcDonaldColor;
  border-color: transparent;
}
</style>
