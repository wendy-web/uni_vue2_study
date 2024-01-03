<template>
<view>
<view class="list_item fl_al_end"
  v-for="(item, index) in list"
  :key="index"
   @click="selComHandle(item, index)"
>
  <view class="com_img">
      <image class="bg_img" :src="item.product_img" mode="aspectFill"></image>
      <!-- <view class="sell_out">售罄</view> -->
  </view>
  <view class="list_txt">
      <view class="item_title">{{item.product_name}}</view>
      <view class="price_num">
          <text style="font-size: 26rpx">¥</text>
          {{item.user_price}}
          <text class="price_num-old">¥{{ item.product_price }}</text>
      </view>
      <view class="spare_num">
          <image class="bg_img" :src="takeImgUrl + '/spare_bg.png'" mode="scaleToFill"></image>
          已省¥{{ (item.product_price - item.user_price).toFixed(2) }}
      </view>
  </view>
  <view class="list_right">
      <view class="num_icon">
          <image class="bg_img" :src="takeImgUrl +'/add_icon.png'" mode="aspectFill"></image>
          <view class="num_add" v-if="item.car_num">{{ item.car_num }}</view>
      </view>
      <!-- <view class="sell_out-txt">已售罄</view> -->
  </view>
</view>
</view>
</template>

<script>
import { getImgUrl } from '@/utils/auth.js';
export default {
  props: {
    list: {
      type: Array,
      default: []
    },
	tabIndex: {
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
    selComHandle(item, index) {
      this.$emit('selCom', item, this.tabIndex, index);
    },
  },
}
</script>

<style scoped lang="scss">
.list_item {
	margin-bottom: 40rpx;
	.com_img {
		width: 144rpx;
		height: 144rpx;
		margin-right: 24rpx;
		position: relative;
		z-index: 0;
		.sell_out{
			width: 144rpx;
			height: 56rpx;
			background: rgba(0,0,0,0.30);
			position: absolute;
			bottom: 0;
			left: 0;
			font-size: 26rpx;
			font-weight: 500;
			text-align: center;
			color: #ffffff;
			line-height: 56rpx;
		}
	}
	.list_right {
		font-size: 0;
		.sell_out-txt{
			height: 40rpx;
			font-size: 28rpx;
			color: #aaa;
			line-height: 40rpx;
		}
	}
	.list_txt {
		flex: 1;
		align-self:stretch;
		.item_title{
			font-size: 28rpx;
			font-weight: 600;
			color: #333;
			line-height: 40rpx;
			margin-bottom: 18rpx;
		}
		.price_num{
			font-size: 32rpx;
			font-weight: 600;
			color: #f95731;
			line-height: 34rpx;
			.price_num-old{
				text-decoration:line-through;
				font-size: 26rpx;
				font-weight: 400;
				text-align: left;
				color: #aaaaaa;
				line-height: 36rpx;
				margin-left: 16rpx;
			}
		}
		.spare_num {
			width: 112rpx;
			height: 32rpx;
			opacity: 0.84;
			font-size: 22rpx;
			text-align: left;
			color: #f95731;
			line-height: 32rpx;
			position: relative;
			z-index: 0;
			padding: 10rpx 8rpx 0;
            white-space: nowrap;
		}
	}
}
.num_icon{
	width: 44rpx;
	height: 44rpx;
	position: relative;
	z-index: 0;
	.num_add{
		height: 28rpx;
		min-width: 28rpx;
		padding: 0 5rpx;
		font-weight: 600;
		text-align: center;
		color: #fff;
		line-height: 1;
		background: #c2a379;
		border: 2rpx solid #ffffff;
		border-radius: 50%;
		font-size: 24rpx;
		position: absolute;
		top: 0;
		right: 0;
		box-sizing: border-box;
		transform: translate(50%, -50%);
	}
}
</style>