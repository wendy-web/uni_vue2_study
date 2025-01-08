<template>
<van-popup
	:show="isShow"
	position="bottom"
	custom-style="overflow: inherit;background:#F5F5F5;"
	round
	safe-area-inset-bottom
	@close="popupClose"
>
	<view class="inform">
		<image class="close_icon" :src="subImgUrl +'/close.png'" mode="aspectFill" @click="popupClose"></image>
        <view class="cont_title">申请退款</view>
		<view class="cont_item">
			<view class="cont_lab">预计退回</view>
			<view class="cont_price">{{ orderInfo.pay_amount }}元</view>
			<view class="cont_txt">退款操作无法撤销，退款金额以实际退还为准</view>
		</view>
		<view class="com_box fl_bet">
			<view class="com_img fl_center">
				<image class="widHei" :src="orderInfo.goods_imgs" mode="aspectFit"></image>
			</view>
			<view class="item_title">{{orderInfo.goods_sku_name}}</view>
			<view class="price_num">
				<text style="font-size: 24rpx">¥</text> {{ orderInfo.pay_amount }}
			</view>
		</view>
		<view class="sub_btn" @click="subHandle">提交</view>
	</view>
</van-popup>
</template>
<script>
import { applyRefund } from '@/api/modules/order.js';
import { getImgUrl } from '@/utils/auth.js';
export default {
	props: {
		isShow: {
			type: Boolean,
			default: false
		},
		orderInfo: {
			type: Object,
			default () {
				return {}
			}
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
		async subHandle() {
			this.$emit('subClick');
			const res = await applyRefund({ id: this.orderInfo.id});
			// if(res.code != 1 || !res.data) return this.$toast(res.msg);
		}
	}
}
</script>
<style lang="scss" scoped>
.inform{
	padding: 0 16rpx;
}
.cont_title {
	font-size: 32rpx;
	text-align: center;
	line-height: 44rpx;
	font-weight: bold;
	margin: 32rpx auto;
}
.close_icon {
	position: absolute;
	width: 48rpx;
	height: 48rpx;
	top: 24rpx;
	right: 24rpx;
}
.cont_item {
	background: #fff;
	border-radius: 16rpx;
	text-align: center;
	overflow: hidden;
	.cont_lab {
		font-size: 26rpx;
		color: #666;
		line-height: 36rpx;
		margin-top: 32rpx;
	}
	.cont_price {
		font-size: 44rpx;
		font-weight: bold;
		color: #f84842;
		line-height: 60rpx;
		margin-top: 4rpx;
	}
	.cont_txt {
		font-size: 24rpx;;
		color: #aaa;
		line-height: 34rpx;
		margin: 16rpx auto 30rpx;
	}
}
.com_box {
	background: #fff;
	border-radius: 16rpx;
	margin-top: 20rpx;
	padding: 16rpx 24rpx 16rpx;
	position: relative;
	z-index: 0;
	&.active {
		&::before {
			content: '\3000';
			background: url("https://test-file.y1b.cn/store/1-0/24412/6619098728845.png") 0 0 / 100% 100% no-repeat;
			position: absolute;
			bottom: 0;
			right: 90rpx;
			width: 174rpx;
			height: 120rpx;
			// z-index: -1;
		}
	}
}
.com_img {
	width: 112rpx;
	height: 112rpx;
	flex: 0 0 112rpx;
	margin-right: 16rpx;
	position: relative;
	z-index: 0;
	.sell_out {
		width: 144rpx;
		height: 56rpx;
		background: rgba(0,0,0,0.30);
		position: absolute;
		bottom: 0;
		left: 0;
		font-size: 26rpx;
		font-weight: 500;
		text-align: center;
		color: #fff;
		line-height: 56rpx;
	}
}
.list_right {
	font-size: 0;
	.sell_out-txt {
		height: 40rpx;
		font-size: 28rpx;
		color: #aaa;
		line-height: 40rpx;
	}
}
.item_title{
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	line-height: 40rpx;
	flex: 1;
}
.price_num {
	font-size: 28rpx;
	font-weight: bold;
	margin-left: 16rpx;
	white-space: nowrap;
}
.sub_btn {
	line-height: 80rpx;
	background: #f84842;
	border-radius: 16rpx;
	font-size: 28rpx;
	text-align: center;
	color: #fff;
	margin: 40rpx 0;
}
</style>
