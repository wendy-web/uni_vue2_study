<template>
<view class="item">
	<view class="type_top">
		<view class="type_lft">
			<image class="type_top-icon" mode="scaleToFill" src="https://file.y1b.cn/store/1-0/24424/6628c97ae962e.png"></image>
			<text class="type_lft-label">{{ item.starbucks.goods_sku_name }} </text>
		</view>
		<view class="type_rit" :class="'order-status-'+item.status">
			{{ ((item.status == 0) ? '待付款': item.statusDesc) || item.order_status_name}}
		</view>
	</view>
	<view class="order" @click="jumpLinkHandle(item)">
		<view class="order_tag" v-if="eatTypeText">{{eatTypeText}}</view>
		<view
			class="order_cont"
			v-for="(orderItem, index) in item.starbucks.orderItems"
			:key="index"
		>
			<image class="order-img" mode="scaleToFill" :src="orderItem.imgUrl"></image>
			<view class="order-detail">
				<view class="order-detail_txt">
					<view class="maxTwoLine">{{orderItem.productName}}</view>
					<view class="order_type">{{ orderItem.sku_str }}</view>
				</view>
				<view class="order_num">
					共{{orderItem.quantity}}件
				</view>
			</view>
		</view>
	</view>
	<!-- 支付金额 -->
	<view class="pay-info" @click="jumpLinkHandle(item)">
		<view class="total_amount" v-if="item.starbucks.total_amount > 3">共{{ item.starbucks.total_amount }}件</view>
		<text class="pay-info_label">{{[2,3,4,5].includes(Number(item.status)) ? '实付' : '应付'}}</text>
		<view v-html="formatPrice(item.amount)"></view>
	</view>
	<!-- 待支付||去使用-->
	<view class="order-operate" v-if="item.status == 0" @click="jumpLinkHandle(item)">
		<view class="order-remain-time">
			<block v-if="item.remainTime">
				<view>剩余时间：</view>
				<view class="count-down">
					<view>{{item.remainTime|remainTime}}</view>
				</view>
			</block>
		</view>
		<view class="btn">去支付</view>
	</view>
	<view class="take_box fl_end">
		<view class="take_btn" v-if="Number(item.status)" @click="againHandle(item.id)">再来一单</view>
		<view class="take_btn" v-if="[3].includes(Number(item.status))"
			@click="jumpLinkHandle(item)"
		>取单口令</view>
	</view>
</view>
</template>

<script>
import { parseTime } from '@/utils/index.js';
import { mapGetters } from 'vuex';
export default {
	props: {
		item: {
			type: Object,
		},
	},
	filters: {
		remainTime(val) {
			let format_time = '';
			if (val > 0) {
				format_time = parseTime(val, '{i}:{s}')
			}
			return format_time;
		}
	},
	computed: {
        ...mapGetters(['userInfo']),
		eatTypeText() {
			const eatTypeIndex = this.item.starbucks.takeout;
			return ['到店取餐', '外卖'][eatTypeIndex];
		}
	},
	data() {
		return {
			gColor:'#006442'
		}
	},
	methods: {
		formatPrice(price = 0, type) {
			// if (!price) return;
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
		jumpLinkHandle(item) {
			this.$go(`/pages/userModule/takeawayMenu/starbucks/order/index?oid=${item.id || 0}`);
		},
        async againHandle() {
            this.$goToDiscountsMini();
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
	.order_cont{
		display: flex;
		justify-content: space-between;
		margin-top: 13rpx;
	}
	.order_type{
		height: 36rpx;
		font-size: 26rpx;
		text-align: left;
		color: #aaaaaa;
		line-height: 36rpx;
	}
	.order_num {
		height: 40rpx;
		font-size: 28rpx;
		color: #333333;
		line-height: 40rpx;
		margin-left: 10rpx;
	}
}
.order-img {
	flex-shrink: 0;
	width: 160rpx;
	height: 160rpx;
	margin-right: 26rpx;
	border-radius: 16rpx;
}
.order-detail {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	min-height: 100rpx;
	padding-right: 10rpx;
	font-size: 28rpx;
	color: #333333;
	line-height: 40rpx;
	.order-detail_txt {
		flex: 1;
		align-self: stretch;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
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
.order-type {
	width: 72rpx;
	height: 34rpx;
	line-height: 34rpx;
	text-align: center;
	background: #f3f5f9;
	border-radius: 4rpx;
	font-size: 24rpx;
	font-weight: 400;
	color: #666666;
	margin-top: 30rpx;
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
		margin-right: 8rpx;
	}
	.total_amount{
		margin-right: 10rpx;
	}
}
.pay-price {
	font-size: 32rpx;
	font-weight: 500;
	color: #333333;
	line-height: 38rpx;
}
.order-operate {
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
	margin-top: 24rpx;
	padding: 21rpx 24rpx 0;
}
.order-remain-time {
	line-height: 34rpx;
	display: flex;
	align-items: center;
	font-size: 26rpx;
	text-align: left;
	color: #999999;
	line-height: 36rpx;
}
.btn {
	// width: 144rpx;
	padding: 0 30rpx;
	height: 60rpx;
	line-height: 60rpx;
	box-sizing: border-box;
	text-align: center;
	border: 2rpx solid #f84842;
	border-radius: 36rpx;
	font-size: 28rpx;
	font-weight: 400;
	color: #f84842;
}
.count-down {
	color: #333333;
	font-size: 26rpx;
}
.maxTwoLine {
	text-overflow: -o-ellipsis-lastline;
	overflow: hidden;
	text-overflow: ellipsis;
	// white-space: nowrap;
	display: -webkit-box;
	line-clamp: 2;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	font-weight: 600;
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
	}
}
.type_rit {
	font-size: 26rpx;
	font-weight: 400;
	color: #666666;
	line-height: 36rpx;
	white-space: nowrap;
}
.take_box {
	margin-top: 32rpx;
	.take_btn {
		padding: 0 30rpx;
		display: inline-block;
		line-height: 56rpx;
		border: 2rpx solid #cccccc;
		border-radius: 32rpx;
		text-align: center;
		font-size: 28rpx;
		color: #333;
		margin-right: 24rpx;
	}
}
</style>
