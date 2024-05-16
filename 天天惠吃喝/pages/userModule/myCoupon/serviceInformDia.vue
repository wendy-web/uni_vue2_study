<template>
<van-popup
	:show="isShow"
	position="bottom"
	custom-style="overflow: inherit;"
	round
	safe-area-inset-bottom
	@close="popupClose"
>
	<view class="inform">
		<image class="close_icon" :src="subImgUrl +'/close.png'" mode="aspectFill" @click="popupClose"></image>
        <view class="cont_title">服务保障</view>
		<view class="cont_item">
			<view class="cont_item-li">
				<view class="li_title">先囤后用</view>
				<view class="li_txt">购买兑换券，提前锁定优惠，想吃时直接兑换使用。</view>
			</view>
			<view class="cont_item-li">
				<view class="li_title">有效期</view>
				<view class="li_txt">自购买日起30天内有效，请在有效期内使用。</view>
			</view>
			<view class="cont_item-li">
				<view class="li_title">退款说明</view>
				<view class="li_txt">随时可退，过期未使用自动退。</view>
			</view>
		</view>
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
	},
	data(){
		return {
			subImgUrl: `${getImgUrl()}static/subPackages/shopMallModule`,
		}
	},
	methods:{
		popupClose() {
			this.$emit('close');
		},
	}
}
</script>
<style lang="scss" scoped>
.cont_title{
	font-size: 32rpx;
	text-align: center;
	line-height: 44rpx;
	font-weight: bold;
	margin: 40rpx auto;
}
.close_icon {
	position: absolute;
	width: 48rpx;
	height: 48rpx;
	top: 24rpx;
	right: 24rpx;
}
.cont_item{
	padding: 0 32rpx;
	.cont_item-li {
		margin-bottom: 48rpx;
		padding-left: 22rpx;
		.li_title {
			font-size: 28rpx;
			color: #333;
			line-height: 40rpx;
			position: relative;
			font-weight: bold;
			&::before {
				content: '\3000';
				position: absolute;
				left: -22rpx;
				top: 50%;
				width: 6rpx;
				height: 6rpx;
				background: #e1e1e1;
				border-radius: 50%;
			}
		}
		.li_txt {
			font-size: 26rpx;
			color: #999;
			line-height: 36rpx;
			margin-top: 16rpx;
		}
	}
}
</style>
