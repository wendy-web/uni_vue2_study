<template>
<view class="item">
	<view class="type_top">
		<view class="type_lft">
			<image class="type_top-icon" mode="scaleToFill" :src="productIcon || productImg"></image>
			<text>{{ item.restaurant_name }} </text>
		</view>
		<view class="type_rit" :class="'order-status-'+ item.status">
			{{ item.order_status_name }}
		</view>
	</view>
	<view class="order" @click="goToUse('/pages/userModule/order/index')">
		<view class="order_tag" v-if="isShowLab">自提带走</view>
		<view class="order_cont">
			<image class="order_cont-img" mode="scaleToFill" :src="productImg"></image>
			<view class="phone_cont fl_bet">
				{{ item.goods_sku_name }}
				<view v-html="formatPrice(item.amount, 1)" ></view>
			</view>
		</view>
	</view>
	<!-- 支付金额 -->
	<view class="pay-info">
		<text class="pay-info_label">{{ [2,3,4,5].includes(Number(item.status)) ? '实付' : '应付' }}</text>
		<view v-html="formatPrice(item.pay_amount)"></view>
	</view>
	<view class="take" @click="goToUse()">
		<view class="take_btn">{{ Number(item.status) ? '再来一单' : '去支付' }}</view>
	</view>
</view>
</template>
<script>
import { mapGetters } from "vuex";
import { jtkDcObj } from '../static/config';
export default {
	props: {
		item: {
			type: Object,
		},
	},
	data() {
		return { }
	},
	computed: {
    	...mapGetters(["userInfo"]),
		productImg() {
			const pay_way = this.item.pay_way;
			return jtkDcObj[pay_way].product_img;
		},
		productIcon() {
			const pay_way = this.item.pay_way;
			return jtkDcObj[pay_way].product_icon;
		},
		isShowLab() {
			const { pay_way } = this.item;
			return !['movie', 'car'].includes(pay_way);
		}
	},
	methods: {
		formatPrice(price = 0, type) {
			price = Number(price / 100).toFixed(2);
			let splitPrice = price.split(".");
			let dom= '';
			switch(type) {
				case 1:
					dom = `<span style="font-weight:500;font-size: 16px;color: #333">¥${splitPrice[0]}.<span style="font-size: 13px;">${splitPrice[1]}</span></span>`;
					break;
				default:
					dom = `<span style="font-weight:500;font-size: 20px;color: #F84842">¥${splitPrice[0]}.<span style="font-size: 14px;">${splitPrice[1]}</span></span>`;
					break;
			}
			return dom;
		},
		goToUse(path = '') {
			const { pay_way } = this.item;
			switch(pay_way) {
				case 'movie':
					this.$goToMoviePlugin();
					break;
				case 'car':
					this.$goToCarPlugin();
					break;
				default:
					this.$goToDiscountsMini(path);
					break;
			}
		}
	}
}
</script>

<style lang="scss">
.item {
	min-height: 258rpx;
	box-sizing: border-box;
	background: #ffffff;
	border-radius: 16rpx;
	margin-top: 16rpx;
	padding-bottom: 32rpx;
}
.order {
	padding: 19rpx 24rpx 26rpx;
	.order_tag {
		display: inline-block;
		padding: 0 12rpx;
		height: 34rpx;
		background: rgba($color: #FEA367, $alpha: .3);
		border-radius: 8rpx;
		font-size: 24rpx;
		text-align: center;
		color: #ff9b58;
		line-height: 34rpx;
		margin-bottom: 20rpx;
	}
	.order_cont {
		display: flex;
		align-items: center;
		margin-top: 13rpx;
		.order_cont-img {
			width: 160rpx;
			height: 160rpx;
			border-radius: 16rpx;
			flex: 0 0 160rpx;
			margin-right: 26rpx;
		}
	}
}
.order-status {
	font-size: 26rpx;
	font-weight: 400;
	line-height: 36rpx;
	min-width: 88rpx;
	text-align: right;
}
.order-status-0 {
	color: #ef2b20;
}
.order-status-1 {
	color: #999999;
}
.order-status-2 {
	color: #333333;
}
.pay-info {
	font-size: 24rpx;
	font-weight: 400;
	color: #333333;
	line-height: 34rpx;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding: 0 24rpx;
	.pay-info_label {
		margin: 0 8rpx 0 32rpx;
	}
}
.type_top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 18rpx 24rpx 18rpx 26rpx;
	border-bottom: 2rpx solid #f1f1f1;
	.type_lft {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		font-weight: 500;
		color: #333333;
		line-height: 36rpx;
		overflow: hidden;
		.type_lft-label{
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			flex: 1;
		}
	}
	.type_top-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 10rpx;
		border-radius: 8rpx;
	}
}
.type_rit {
	font-size: 26rpx;
	font-weight: 400;
	color: #666666;
	line-height: 36rpx;
	white-space: nowrap;
}
.take{
	display: flex;
	justify-content: flex-end;
	margin: 32rpx 24rpx 0 0;
	.take_btn {
		padding: 0 30rpx;
		display: inline-block;
		line-height: 56rpx;
		border: 2rpx solid #cccccc;
		border-radius: 32rpx;
		text-align: center;
		font-size: 28rpx;
		color: #333333;
	}
}
.phone_cont {
	font-weight: 600;
	font-size: 28rpx;
	color: #333;
	flex: 1;
	.phone_cont-lab {
		font-size: 26rpx;
		color: #aaa;
		line-height: 36rpx;
		margin-top: 16rpx;
		font-weight: 400;
		&:last-child {
			margin-top: 8rpx;
		}
	}
}
.pay-info-num{
	font-size: 26rpx;
	color: #999;
	line-height: 36rpx;
	margin-right: 16rpx;
}
</style>
